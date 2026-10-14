"use client";

import { Mail, Pencil, Phone, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setUser, type AuthUser } from "@/redux/reducer/authSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { USER_API_ENDPOINT } from "@/utils/data";

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return <p className="rounded-2xl border border-violet-100 bg-white p-6 text-zinc-500">Please sign in to view your profile.</p>;
  }

  const skills = user.profile?.skills ?? [];

  return (
    <>
      <section aria-labelledby="profile-heading" className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm sm:p-9">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="size-22 shrink-0">
              <AvatarImage src={user.profile?.profilePhoto} alt={user.fullName} />
              <AvatarFallback className="bg-linear-to-br from-violet-200 to-violet-600 text-3xl font-extrabold text-white">{user.fullName.trim().charAt(0).toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <div><h1 id="profile-heading" className="text-2xl font-extrabold">{user.fullName}</h1><p className="mt-1 text-zinc-500">{user.profile?.bio || "No bio added yet."}</p></div>
          </div>
          <button type="button" onClick={() => setIsEditing(true)} aria-label="Edit profile" className="grid size-11 shrink-0 place-items-center rounded-md border border-zinc-200 text-zinc-700 transition hover:bg-zinc-100"><Pencil size={19} /></button>
        </div>
        <div className="mt-7 space-y-3 text-zinc-700"><p className="flex items-center gap-3"><Mail size={19} /> {user.email}</p><p className="flex items-center gap-3"><Phone size={19} /> {user.phoneNumber}</p></div>
        <div className="mt-7"><h2 className="font-bold">Skills</h2><div className="mt-3 flex flex-wrap gap-2">{skills.length ? skills.map((skill, index) => <span key={`${skill}-${index}`} className="rounded bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white">{skill}</span>) : <p className="text-zinc-500">No skills added yet.</p>}</div></div>
        <div className="mt-7"><h2 className="font-bold">Resume</h2>{user.profile?.resume ? <a href={user.profile.resume} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block font-semibold text-[#652bc4] hover:underline">{user.profile.resumeOriginalName || "Download"}</a> : <p className="mt-2 text-zinc-500">No resume uploaded yet.</p>}</div>
      </section>
      {isEditing && <EditProfileModal key={user._id ?? user.email} user={user} onClose={() => setIsEditing(false)} />}
    </>
  );
}

interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
}

function EditProfileModal({ user, onClose }: { user: AuthUser; onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const [input, setInput] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    bio: user.profile?.bio ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const changeEventHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      const { data } = await axios.post<UpdateProfileResponse>(
        `${USER_API_ENDPOINT}/profile/updateProfile`,
        input,
        { withCredentials: true },
      );
      if (!data.success || !data.user) {
        toast.error(data.message || "Profile update failed. Please try again.");
        return;
      }
      dispatch(setUser(data.user));
      toast.success(data.message || "Profile updated successfully.");
      onClose();
    } catch (error) {
      console.error(error);
      const message = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      toast.error(message || "Profile update failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onMouseDown={() => { if (!isSaving) onClose(); }}>
      <form className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl" onMouseDown={(event) => event.stopPropagation()} onSubmit={onSubmit} aria-busy={isSaving}>
        <div className="flex items-center justify-between"><h2 id="edit-profile-title" className="text-xl font-extrabold">Edit profile</h2><button type="button" onClick={onClose} disabled={isSaving} aria-label="Close edit profile" className="rounded p-1 text-zinc-500 hover:bg-zinc-100"><X /></button></div>
        <fieldset disabled={isSaving} className="mt-6 grid gap-4">
          <label className="grid gap-1.5 text-sm font-semibold">Full name<input name="fullName" value={input.fullName} onChange={changeEventHandler} required className="rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-violet-500" /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Email<input type="email" name="email" value={input.email} onChange={changeEventHandler} required className="rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-violet-500" /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Phone<input type="tel" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} required className="rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-violet-500" /></label>
          <label className="grid gap-1.5 text-sm font-semibold">Bio<textarea name="bio" value={input.bio} onChange={changeEventHandler} rows={3} className="resize-none rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-violet-500" /></label>
        </fieldset>
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={isSaving} className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-bold">Cancel</button><button type="submit" disabled={isSaving} className="rounded-md bg-[#652bc4] px-4 py-2 text-sm font-bold text-white hover:bg-[#5423a5] disabled:opacity-50">{isSaving ? "Saving..." : "Save changes"}</button></div>
      </form>
    </div>
  );
}
