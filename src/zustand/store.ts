import { create } from "zustand";

type Store = {
  surveys: any[];
  setSurveys: (val: any) => void;
  userData: any;
  setUserData: (val: any) => void;
  themeStore: {
    accent_text_color: string;
    bg_color: string;
    button_color: string;
    button_text_color: string;
    destructive_text_color: string;
    header_bg_color: string;
    hint_color: string;
    link_color: string;
    secondary_bg_color: string;
    section_bg_color: string;
    section_header_text_color: string;
    section_separator_color: string;
    subtitle_text_color: string;
    text_color: string;
  };
  updateThemeStore: (val: any) => void;
  telegramId: any;
  setTelegramId: (val: any) => void;
  usersForms: any;
  setUsersForms: (val: any) => void;
  scriptLoaded: boolean;
  isTelegramMiniApp: boolean;
  setIsTelegramMiniApp: (val: any) => void;
  setScriptLoaded: (val: any) => void;
  initData: any;
  setInitData: (val: any) => void;
  setThemeStore: (val: any) => void;
  showArchives: boolean;
  setShowArchives: (val: any) => void;
};

export const useStore = create<Store>()((set) => ({
  surveys: [],
  showArchives: false,
  setShowArchives: (val: any) => set(() => ({ showArchives: val })),
  userData: {},
  themeStore: {
    accent_text_color: "#6ab2f2",
    bg_color: "transparent",
    button_color: "#5288c1",
    button_text_color: "#ffffff",
    destructive_text_color: "#ec3942",
    header_bg_color: "#17212b",
    hint_color: "#708499",
    link_color: "#6ab3f3",
    secondary_bg_color: "#232e3c",
    section_bg_color: "#17212b",
    section_header_text_color: "#6ab3f3",
    section_separator_color: "#111921",
    subtitle_text_color: "#708499",
    text_color: "#f5f5f5",
  },
  scriptLoaded: false,
  isTelegramMiniApp: true,
  telegramId: null,
  usersForms: [],
  initData: {},
  updateThemeStore: (val: any) => set(() => ({ themeStore: val })),
  setUserData: (val: any) => set(() => ({ userData: val })),
  setSurveys: (val: any) => set(() => ({ surveys: val })),
  setIsTelegramMiniApp: (val: any) => set(() => ({ isTelegramMiniApp: val })),
  setScriptLoaded: (val: any) => set(() => ({ scriptLoaded: val })),
  setUsersForms: (val: any) => set(() => ({ usersForms: val })),
  setTelegramId: (val: any) => set(() => ({ telegramId: val })),
  setInitData: (val: any) => set(() => ({ initData: val })),
  setThemeStore: (val: any) => set(() => ({ themeStore: val })),
}));
