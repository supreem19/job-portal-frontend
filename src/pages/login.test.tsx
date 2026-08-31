import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./login";

vi.mock("axios", () => ({
  default: { post: vi.fn() },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/components/Navbar", () => ({
  default: () => <nav>Navbar</nav>,
}));

vi.mock("@/utils/data", () => ({
  USER_API_ENDPOINT: "http://api.example.com/users",
}));

const mockedPost = vi.mocked(axios.post);

describe("LoginPage", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the login form and registration link", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /create one/i })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("updates the email, password, and role fields", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const email = screen.getByPlaceholderText("you@example.com");
    const password = screen.getByPlaceholderText("Enter your password");
    const [student] = screen.getAllByRole("radio");

    await user.type(email, "student@example.com");
    await user.type(password, "secret123");
    await user.click(student);

    expect(email).toHaveValue("student@example.com");
    expect(password).toHaveValue("secret123");
    expect(student).toBeChecked();
  });

  it("submits the entered credentials and shows a success toast", async () => {
    const user = userEvent.setup();
    mockedPost.mockResolvedValueOnce({
      data: { success: true, message: "Logged in successfully" },
    });
    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "recruiter@example.com");
    await user.type(screen.getByPlaceholderText("Enter your password"), "secret123");
    await user.click(screen.getAllByRole("radio")[1]);
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockedPost).toHaveBeenCalledWith(
        "http://api.example.com/users/login",
        {
          email: "recruiter@example.com",
          password: "secret123",
          role: "Recruiter",
        },
        { withCredentials: true },
      );
    });
    expect(toast.success).toHaveBeenCalledWith("Logged in successfully");
  });

  it("shows an error toast when the login request fails", async () => {
    const user = userEvent.setup();
    mockedPost.mockRejectedValueOnce(new Error("Network error"));
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Login failed. Please try again.");
    });
    expect(toast.success).not.toHaveBeenCalled();
  });
});
