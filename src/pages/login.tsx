import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import axios from "axios";
import { USER_API_ENDPOINT } from "@/utils/data";
import { toast } from "sonner";

export interface loginInputState {
  email: string;
  password: string;
  role: string;
}

export default function LoginPage() {
  const [input, setInput] = useState<loginInputState>({
    email: "",
    password: "",
    role: "",
  });

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/login`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        // router.push("/login"); // Redirect to login page after successful registration
      }
    } catch (error) {
      console.log(error);
      toast.error("Login failed. Please try again.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue to your dashboard.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-[#022bf8] focus:ring-2 focus:ring-[#022bf8]/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-[#022bf8] focus:ring-2 focus:ring-[#022bf8]/20"
              />
            </div>

            <div className="flex gap-12">
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="role"
                  value="Student"
                  checked={input.role === "Student"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Student
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="radio"
                  name="role"
                  value="Recruiter"
                  checked={input.role === "Recruiter"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Recruiter
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#022bf8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#011fbe]"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-[#022bf8]">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
