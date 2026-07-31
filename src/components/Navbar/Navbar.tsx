import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function Navbar() {
  const user = false;
  return (
    <div className="flex items-center justify-between mx-auto max-w-7xl h-24">
      <div>
        <h1 className="text-2xl font-bold">
          Job <span className="text-[#022bf8]">Portal</span>
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <ul className="flex font-bold items-center gap-12">
          <li>Home</li>
          <li>Browse</li>
          <li>Jobs</li>
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
          <Popover>
            <PopoverTrigger>
              <button className="cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="shadcn"
                  />
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex items-center gap-4 space-y-2">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="shadcn"
                  />
                </Avatar>
                <div>
                  <h1 className="font-bold">Supreem Rajput</h1>
                  <p className="text-sm text-muted-foreground">
                    Hey this is Supreem profile, Welcome back. you have new
                    features please explore!
                  </p>
                  <div>
                    <button>Profile</button>
                    <button>Profile</button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
