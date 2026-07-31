import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { USER_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface InputState {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: "";
  file: File | undefined;
}

export default function RegisterPage() {
  const router = useRouter();
  const [input, setInput] = useState<InputState>({
    fullName: "",
    email: "",
    password: "",
    role: "",
    phoneNumber: "",
    file: undefined,
  });

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("phoneNumber", input.phoneNumber);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/login"); // Redirect to login page after successful registration
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Join thousands of job seekers and employers.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                type="text"
                placeholder="Your full name"
                name="fullName"
                value={input.fullName}
                onChange={changeEventHandler}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-[#022bf8] focus:ring-2 focus:ring-[#022bf8]/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-[#022bf8] focus:ring-2 focus:ring-[#022bf8]/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="number"
                placeholder="Phone Number"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-[#022bf8] focus:ring-2 focus:ring-[#022bf8]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
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
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Profile Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-[#022bf8] focus:ring-2 focus:ring-[#022bf8]/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600"
            >
              Register
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#022bf8]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
