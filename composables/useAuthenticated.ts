import { useAuthenticationStore } from "~/stores/auth";

interface ReturnUseAuthenticated {
  isAuthenticated: () => boolean;
  isGuest: () => boolean;
}

export const useAuthenticated = (): ReturnUseAuthenticated => {
  const { getToken } = useAuthenticationStore();

  const isAuthenticated = (): boolean => {
    const token = getToken.token;
    const sessionAt = Number(getToken.session_at);
    const currentTime = new Date().getTime();

    return token !== "" && sessionAt > currentTime;
  };

  const isGuest = (): boolean => {
    return !isAuthenticated();
  };

  return {
    isAuthenticated,
    isGuest,
  };
};
