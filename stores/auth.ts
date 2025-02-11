import { defineStore } from "pinia";
import {
  useAuthService,
  type ProfileResponse,
} from "~/composables/services/useAuthService";

interface CredentialsPayload {
  session_in: number;
  token: string;
}

export const useAuthenticationStore = defineStore("auth", {
  state: () => ({
    userProfile: null as ProfileResponse | null,
    token: "",
    session_at: 0,
  }),
  actions: {
    setCredentials(credential: CredentialsPayload | null) {
      if (!credential) return;

      const { setCookie } = useCookies();

      setCookie({
        key: "session",
        value: credential.token ?? "",
        expires: 1,
        path: "/",
      });

      setCookie({
        key: "session_at",
        value: `${credential.session_in ?? ""}`,
        expires: 1,
        path: "/",
      });

      this.token = credential.token ?? "";
      this.session_at = credential.session_in ?? 0;
    },

    logout() {
      const { setCookie } = useCookies();

      setCookie({ key: "session", value: "", expires: -1, path: "/" });
      setCookie({ key: "session_at", value: "", expires: -1, path: "/" });

      this.token = "";
      this.session_at = 0;
      this.userProfile = null;
    },

    setProfile(profile: ProfileResponse | null) {
      if (!profile) return;

      this.userProfile = profile;
    },

    async loadProfile() {
      const { getProfile } = useAuthService();

      try {
        const response = await getProfile();
        if (response?.code === CODE_OK && response?.data) {
          this.setProfile(response.data);

          return true;
        }

        return false;
      } catch (error) {
        console.error("[ERROR PROFILE] : ", error);
      }
    },
  },
  getters: {
    isLoggedIn(): boolean {
      const { getCookies } = useCookies();

      const token = getCookies("session");
      const session_at = getCookies("session_at");

      if (!token || !session_at) {
        return false;
      }

      const sessionExpiry = Number(session_at);
      const currentTime = new Date().getTime();

      return !!token && sessionExpiry > currentTime;
    },
  },
});
