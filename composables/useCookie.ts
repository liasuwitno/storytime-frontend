import Cookie from "js-cookie";

interface CookieOptions {
  expires?: number;
  path?: string;
  key: string;
  value: string;
}

export const KEY_DEFAULT = "session";

interface ReturnUseCookie {
  setCookie: ({ key, value, expires, path }: CookieOptions) => void;
  getCookies: (key: string) => string | undefined;
  removeCookie: ({ key, path }: Pick<CookieOptions, "key" | "path">) => void;
}

export const useCookies = (): ReturnUseCookie => {
  const setCookie = ({
    key = KEY_DEFAULT,
    value,
    expires,
    path = "/",
  }: CookieOptions): void => {
    Cookie.set(key, value, {
      expires,
      path,
    });
  };

  const getCookies = (key: string = KEY_DEFAULT): string | undefined => {
    const value = Cookie.get(key);

    return value;
  };

  const removeCookie = ({
    key,
    path,
  }: Pick<CookieOptions, "key" | "path">): void => {
    Cookie.remove(key, {
      path,
    });
  };

  return {
    removeCookie,
    getCookies,
    setCookie,
  };
};
