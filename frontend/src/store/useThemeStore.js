import {create} from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("FaceRipple-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("FaceRipple-theme", theme);
    set({theme});
  },
}));
