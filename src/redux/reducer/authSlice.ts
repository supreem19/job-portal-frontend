import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  _id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role?: "Student" | "Recruiter";
  profile?: {
    bio?: string;
    skills?: string[];
    resume?: string;
    resumeOriginalName?: string;
    company?: string;
    profilePhoto?: string;
  };
}

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: null,
};

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = auth.actions;
export default auth.reducer;
