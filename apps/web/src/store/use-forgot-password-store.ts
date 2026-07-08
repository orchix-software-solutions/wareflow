import { create } from "zustand";

interface ForgotPasswordState {
  identifier: string;
  otp: string;
  setIdentifier: (identifier: string) => void;
  setOtp: (otp: string) => void;
  reset: () => void;
}

export const useForgotPasswordStore = create<ForgotPasswordState>()((set) => ({
  identifier: "",
  otp: "",
  setIdentifier: (identifier) => set({ identifier }),
  setOtp: (otp) => set({ otp }),
  reset: () => set({ identifier: "", otp: "" }),
}));
