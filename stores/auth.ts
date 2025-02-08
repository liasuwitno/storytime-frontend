import { defineStore } from "pinia";

const { getCookies, setCookie } = useCookies();

interface CredentialsPayload {
  session_in: number;
  token: string;
}

export const useAuthenticationStore = defineStore("auth", {
  state: () => ({
    userProfile: null,
  }),
  getters: {
    getProfile: (state) => state.userProfile,
    getToken: () => {
      return {
        token: getCookies("session"),
        session_at: getCookies("session_at"),
      };
    },
  },
  actions: {
    setCredentials: (credential: CredentialsPayload | null) => {
      if (!credential) return;

      setCookie({
        key: "session",
        value: credential?.token ?? "",
        expires: 1,
        path: "/",
      });

      setCookie({
        key: "session_at",
        value: `${credential?.session_in ?? ""}`,
        expires: 1,
        path: "/",
      });
    },
  },
});
