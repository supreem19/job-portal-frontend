import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { USER_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImagePlus } from "lucide-react";

interface InputState {
  fullName: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
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

  const uploadImageToS3 = async (): Promise<string> => {
    if (!input.file) return "";

    const formData = new FormData();
    formData.append("image", input.file);

    const { data } = await axios.post(
      "http://localhost:5011/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return data.imageUrl;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let profilePhoto = "";

      // Upload image first
      if (input.file) {
        profilePhoto = await uploadImageToS3();
      }

      // Register user
      const payload = {
        fullName: input.fullName,
        email: input.email,
        password: input.password,
        phoneNumber: input.phoneNumber,
        role: input.role,
        profilePhoto,
      };

      const res = await axios.post(`${USER_API_ENDPOINT}/register`, payload, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Registration failed.");
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
                required
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
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-[#022bf8] focus:ring-2 focus:ring-[#022bf8]/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Phone Number"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                required
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
                required
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
                  required
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
              <label
                htmlFor="profile-photo"
                className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-600 transition hover:border-[#022bf8] hover:bg-blue-50"
              >
                <ImagePlus className="size-5 shrink-0 text-[#022bf8]" />
                <span className="truncate">
                  {input.file?.name ?? "Choose a profile photo"}
                </span>
              </label>
              <input
                id="profile-photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={changeFileHandler}
                className="sr-only"
              />
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, or WebP</p>
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
