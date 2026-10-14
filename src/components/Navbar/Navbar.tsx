import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { setUser } from "@/redux/reducer/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

interface LogoutResponse {
  success: boolean;
  message?: string;
}

export default function Navbar() {
  const user = useSelector((store: RootState) => store.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initial = user?.fullName.trim().charAt(0).toUpperCase() || "?";

  const logout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const { data } = await axios.post<LogoutResponse>(
        `${USER_API_ENDPOINT}/logout`,
        {},
        { withCredentials: true },
      );
      if (!data.success) {
        toast.error(data.message || "Logout failed. Please try again.");
        return;
      }
      dispatch(setUser(null));
      setIsOpen(false);
      toast.success(data.message || "Logged out successfully.");
      await router.replace("/").catch((error: unknown) => {
        console.error(error);
        toast.error("You are logged out, but navigation to the home page failed.");
      });
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      toast.error(message || "Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    <div className="flex items-center justify-between mx-auto max-w-7xl h-24">
      <div>
        <h1 className="text-2xl font-bold">
          Job <span className="text-[#022bf8]">Portal</span>
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <ul className="flex font-bold items-center gap-12">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/browse">Browse</Link>
          </li>
          <li>
            <Link href="/jobs">Jobs</Link>
          </li>
        </ul>
        {!user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-sm bg-gray-200 px-3 py-1 text-sm hover:bg-gray-400"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-sm bg-red-400 px-3 py-1 text-sm hover:bg-red-700"
            >
              Register
            </Link>
          </div>
        ) : (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger className="cursor-pointer" aria-label="Open profile menu">
              <Avatar>
                <AvatarImage
                  src={user.profile?.profilePhoto}
                  alt={user.fullName}
                />
                <AvatarFallback>{initial}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 gap-0 overflow-hidden rounded-xl p-0">
              <div className="flex items-start gap-3 border-b border-border p-4">
                <Avatar size="lg">
                  <AvatarImage
                    src={user.profile?.profilePhoto}
                    alt={user.fullName}
                  />
                  <AvatarFallback>{initial}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h1 className="break-words font-bold">{user.fullName}</h1>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Hey this is {user.fullName}&apos;s profile, Welcome back. you have new
                    features please explore!
                  </p>
                </div>
              </div>
              <div className="grid gap-1 p-2">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition hover:bg-violet-50 hover:text-[#652bc4] focus-visible:outline-2 focus-visible:outline-violet-500"
                >
                  <UserRound size={18} aria-hidden="true" />
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  disabled={isLoggingOut}
                  aria-busy={isLoggingOut}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={18} aria-hidden="true" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
