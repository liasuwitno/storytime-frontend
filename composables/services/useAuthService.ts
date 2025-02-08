import type { ApiResponse } from "~/types/response";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  token: string;
  session: {
    expires_at: string;
    expires_in: number;
  };
}

export interface RegisterPayload {
  fullname: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ProfileResponse {
  id: string;
  fullname: string;
  username: string;
  email: string;
  avatar: string | null;
  status: "active" | "inactive";
  bio: string;
}

interface ReturnUseAuthService {
  login: (payload: LoginPayload) => Promise<ApiResponse<LoginResponse | null>>;
  register: (payload: RegisterPayload) => Promise<ApiResponse<null>>;
  logOut: () => Promise<ApiResponse<null>>;
  getProfile: () => Promise<ApiResponse<ProfileResponse>>;
}

export const useAuthService = (): ReturnUseAuthService => {
  const { $request } = useNuxtApp();

  const login = async (
    payload: LoginPayload
  ): Promise<ApiResponse<LoginResponse | null>> => {
    const response = await $request.post<
      LoginPayload,
      ApiResponse<LoginResponse | null>
    >({
      url: "/login",
      body: payload,
    });

    return response;
  };

  const register = async (
    payload: RegisterPayload
  ): Promise<ApiResponse<null>> => {
    const response = await $request.post<RegisterPayload, ApiResponse<null>>({
      url: "/register",
      body: payload,
    });

    return response;
  };

  const logOut = async (): Promise<ApiResponse<null>> => {
    const response = await $request.post<null, ApiResponse<null>>({
      url: "/logout",
    });

    return response;
  };

  const getProfile = async (): Promise<ApiResponse<ProfileResponse>> => {
    const response = await $request.get<ApiResponse<ProfileResponse>>({
      url: "/profile",
    });

    return response;
  };

  return {
    login,
    register,
    logOut,
    getProfile,
  };
};
