import { configureStore } from "@reduxjs/toolkit";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { Provider } from "react-redux";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import rootReducer from "@/redux/rootReducer";
import { setUser, type AuthUser } from "@/redux/reducer/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";
import Profile from "./Profile";

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();
  return { ...actual, default: { ...actual.default, post: vi.fn() } };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const user: AuthUser = {
  _id: "user-1",
  fullName: "Sam Patel",
  email: "sam@example.com",
  phoneNumber: "9876543210",
  role: "Student",
  profile: {
    bio: "Frontend developer",
    skills: ["TypeScript", "React"],
    profilePhoto: "https://example.com/photo.png",
    resume: "https://example.com/resume.pdf",
    resumeOriginalName: "Sam-resume.pdf",
    company: "company-1",
  },
};

function renderProfile(currentUser: AuthUser | null = user) {
  const store = configureStore({ reducer: rootReducer });
  store.dispatch(setUser(currentUser));
  render(<Provider store={store}><Profile /></Provider>);
  return store;
}

afterEach(() => {
  cleanup();
  vi.mocked(axios.post).mockReset();
  vi.restoreAllMocks();
});

describe("Profile", () => {
  it("renders the Redux user's contact details, bio, skills, and resume", () => {
    renderProfile();
    expect(screen.getByRole("heading", { name: user.fullName })).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
    expect(screen.getByText(user.phoneNumber)).toBeInTheDocument();
    expect(screen.getByText("Frontend developer")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sam-resume.pdf" })).toHaveAttribute("href", user.profile?.resume);
    expect(screen.queryByText("Ankit Pathak")).not.toBeInTheDocument();
  });

  it("reacts to Redux user changes and prefills the latest user data", async () => {
    const store = renderProfile();
    act(() => {
      store.dispatch(setUser({ ...user, fullName: "Taylor Singh", profile: { bio: "Updated bio" } }));
    });
    expect(screen.getByRole("heading", { name: "Taylor Singh" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.getByLabelText("Full name")).toHaveValue("Taylor Singh");
    expect(screen.getByLabelText("Email")).toHaveValue(user.email);
    expect(screen.getByLabelText("Phone")).toHaveValue(user.phoneNumber);
    expect(screen.getByLabelText("Bio")).toHaveValue("Updated bio");
  });

  it("handles missing optional profile data without showing sample content", async () => {
    renderProfile({ fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber });
    expect(screen.getByText("No bio added yet.")).toBeInTheDocument();
    expect(screen.getByText("No skills added yet.")).toBeInTheDocument();
    expect(screen.getByText("No resume uploaded yet.")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.getByLabelText("Bio")).toHaveValue("");
  });

  it("shows a sign-in message without a user and closes the modal on logout", async () => {
    const store = renderProfile(null);
    expect(screen.getByText("Please sign in to view your profile.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Edit profile" })).not.toBeInTheDocument();
    act(() => { store.dispatch(setUser(user)); });
    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    act(() => { store.dispatch(setUser(null)); });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("discards cancelled edits and prefills from Redux when reopened", async () => {
    const store = renderProfile();
    const interaction = userEvent.setup();
    await interaction.click(screen.getByRole("button", { name: "Edit profile" }));
    await interaction.clear(screen.getByLabelText("Full name"));
    await interaction.type(screen.getByLabelText("Full name"), "Unsaved name");
    await interaction.click(screen.getByRole("button", { name: "Cancel" }));
    expect(store.getState().auth.user).toEqual(user);
    expect(axios.post).not.toHaveBeenCalled();
    await interaction.click(screen.getByRole("button", { name: "Edit profile" }));
    expect(screen.getByLabelText("Full name")).toHaveValue(user.fullName);
  });

  it("posts all edited fields and replaces Redux with the server's updated user", async () => {
    const store = renderProfile();
    const interaction = userEvent.setup();
    const updatedUser = {
      ...user,
      fullName: "Taylor Singh",
      email: "taylor@example.com",
      phoneNumber: "1234567890",
      profile: { ...user.profile, bio: "New bio" },
    };
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: { success: true, message: "Profile saved", user: updatedUser },
    });
    await interaction.click(screen.getByRole("button", { name: "Edit profile" }));
    for (const [label, value] of [
      ["Full name", updatedUser.fullName],
      ["Email", updatedUser.email],
      ["Phone", updatedUser.phoneNumber],
      ["Bio", updatedUser.profile.bio],
    ]) {
      await interaction.clear(screen.getByLabelText(label));
      await interaction.type(screen.getByLabelText(label), value);
    }
    await interaction.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(axios.post).toHaveBeenCalledWith(
      `${USER_API_ENDPOINT}/profile/updateProfile`,
      { fullName: updatedUser.fullName, email: updatedUser.email, phoneNumber: updatedUser.phoneNumber, bio: "New bio" },
      { withCredentials: true },
    );
    expect(store.getState().auth.user).toEqual(updatedUser);
    expect(screen.getByRole("heading", { name: updatedUser.fullName })).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Profile saved");
  });

  it.each([
    { success: false, message: "Email already exists" },
    { success: true },
  ])("keeps Redux unchanged and the form open on an unsuccessful response: %j", async (data) => {
    const store = renderProfile();
    vi.mocked(axios.post).mockResolvedValueOnce({ data });
    await userEvent.click(screen.getByRole("button", { name: "Edit profile" }));
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(store.getState().auth.user).toEqual(user);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("disables saving while pending and reports API errors without discarding edits", async () => {
    const store = renderProfile();
    const interaction = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    let rejectRequest!: (error: Error) => void;
    vi.mocked(axios.post).mockImplementationOnce(() => new Promise((_resolve, reject) => {
      rejectRequest = reject;
    }));
    await interaction.click(screen.getByRole("button", { name: "Edit profile" }));
    await interaction.clear(screen.getByLabelText("Bio"));
    await interaction.type(screen.getByLabelText("Bio"), "Unsaved bio");
    await interaction.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getByLabelText("Full name")).toBeDisabled();
    act(() => {
      rejectRequest(new axios.AxiosError("Conflict", undefined, undefined, undefined, {
        data: { message: "Phone number already exists" },
        status: 409,
        statusText: "Conflict",
        headers: {},
        config: { headers: new axios.AxiosHeaders() },
      }));
    });
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Phone number already exists"));
    expect(screen.getByLabelText("Bio")).toHaveValue("Unsaved bio");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
    expect(store.getState().auth.user).toEqual(user);
  });
});
