import { configureStore } from "@reduxjs/toolkit";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { toast } from "sonner";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";
import rootReducer from "@/redux/rootReducer";
import { setUser, type AuthUser } from "@/redux/reducer/authSlice";
import Navbar from "./Navbar";
import { USER_API_ENDPOINT } from "@/utils/data";

const { replace } = vi.hoisted(() => ({
  replace: vi.fn().mockResolvedValue(true),
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ replace }),
}));

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  return { ...actual, default: { ...actual.default, post: vi.fn() } };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const user: AuthUser = {
  fullName: "Sam Patel",
  email: "sam@example.com",
  phoneNumber: "9876543210",
  profile: { profilePhoto: "https://example.com/sam.png" },
};

function renderNavbar(currentUser: AuthUser | null) {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch(setUser(currentUser));
  render(<Provider store={store}><Navbar /></Provider>);
  return store;
}

afterEach(() => {
  cleanup();
  vi.mocked(axios.post).mockReset();
  replace.mockReset().mockResolvedValue(true);
  vi.restoreAllMocks();
});

describe("Navbar profile menu", () => {
  it("uses the Redux photo in both avatars and the full name in the popover", async () => {
    vi.spyOn(globalThis, "Image").mockImplementation(function () {
      const image = document.createElement("img");
      Object.defineProperty(image, "src", {
        set() { queueMicrotask(() => image.onload?.(new Event("load"))); },
      });
      return image;
    });
    const store = renderNavbar(user);
    await userEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    expect(screen.getByRole("heading", { name: user.fullName })).toBeInTheDocument();
    expect(screen.getByText(/Hey this is Sam Patel's profile/)).toBeInTheDocument();
    await waitFor(() => {
      const photos = screen.getAllByRole("img", { name: user.fullName });
      expect(photos).toHaveLength(2);
      photos.forEach((photo) => expect(photo).toHaveAttribute("src", user.profile?.profilePhoto));
    });
    act(() => {
      store.dispatch(setUser({ ...user, fullName: "Taylor Singh", profile: { profilePhoto: "https://example.com/taylor.png" } }));
    });
    expect(screen.getByRole("heading", { name: "Taylor Singh" })).toBeInTheDocument();
    expect(screen.getByText(/Hey this is Taylor Singh's profile/)).toBeInTheDocument();
    await waitFor(() => {
      screen.getAllByRole("img", { name: "Taylor Singh" }).forEach((photo) => {
        expect(photo).toHaveAttribute("src", "https://example.com/taylor.png");
      });
    });
  });

  it("shows initials when the profile photo is missing", async () => {
    renderNavbar({ ...user, profile: undefined });
    await userEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    await waitFor(() => expect(screen.getAllByText("S")).toHaveLength(2));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("preserves login and registration links for signed-out users", () => {
    renderNavbar(null);
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute("href", "/register");
    expect(screen.queryByRole("button", { name: "Open profile menu" })).not.toBeInTheDocument();
  });

  it("shows a single Profile link with an icon and closes the popover on navigation", async () => {
    renderNavbar(user);
    await userEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    const profile = screen.getByRole("link", { name: "Profile" });
    expect(profile).toHaveAttribute("href", "/profile");
    expect(profile.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    const logout = screen.getByRole("button", { name: "Logout" });
    expect(logout.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    profile.addEventListener("click", (event) => event.preventDefault(), { once: true });
    await userEvent.click(profile);
    await waitFor(() => expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument());
  });

  it("logs out through the API and clears the Redux user on success", async () => {
    const store = renderNavbar(user);
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { success: true, message: "Logged out" },
    });
    await userEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Logout" }));
    await waitFor(() => expect(store.getState().auth.user).toBeNull());
    expect(axios.post).toHaveBeenCalledWith(
      `${USER_API_ENDPOINT}/logout`,
      {},
      { withCredentials: true },
    );
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Logged out");
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("preserves the signed-in user if the backend rejects logout", async () => {
    const store = renderNavbar(user);
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { success: false, message: "Logout unavailable" },
    });
    await userEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Logout" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Logout unavailable"));
    expect(store.getState().auth.user).toEqual(user);
    expect(screen.getByRole("button", { name: "Logout" })).toBeEnabled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("prevents duplicate logout requests while pending and permits retry after a network error", async () => {
    const store = renderNavbar(user);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    let rejectRequest!: (error: Error) => void;
    vi.mocked(axios.post).mockImplementationOnce(() => new Promise((_resolve, reject) => {
      rejectRequest = reject;
    }));
    await userEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Logout" }));
    const pendingButton = screen.getByRole("button", { name: "Logging out..." });
    expect(pendingButton).toBeDisabled();
    await userEvent.click(pendingButton);
    expect(axios.post).toHaveBeenCalledTimes(1);
    act(() => { rejectRequest(new Error("Network error")); });
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Logout failed. Please try again."));
    expect(store.getState().auth.user).toEqual(user);
    expect(screen.getByRole("button", { name: "Logout" })).toBeEnabled();
    expect(replace).not.toHaveBeenCalled();
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { success: true } });
    await userEvent.click(screen.getByRole("button", { name: "Logout" }));
    await waitFor(() => expect(store.getState().auth.user).toBeNull());
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("reports a navigation error without treating successful logout as a failure", async () => {
    const store = renderNavbar(user);
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(axios.post).mockResolvedValueOnce({ data: { success: true } });
    replace.mockRejectedValueOnce(new Error("Navigation failed"));
    await userEvent.click(screen.getByRole("button", { name: "Open profile menu" }));
    await userEvent.click(screen.getByRole("button", { name: "Logout" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(
      "You are logged out, but navigation to the home page failed.",
    ));
    expect(store.getState().auth.user).toBeNull();
    expect(toast.error).not.toHaveBeenCalledWith("Logout failed. Please try again.");
  });
});
