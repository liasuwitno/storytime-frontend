import Cookie from "js-cookie";

interface CookieOptions {
  expires?: number;
  path?: string;
  key: string;
  value: string;
}

export const KEY_DEFAULT = "session";

export const setCookie = ({
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

export const getCookie = (key: string = KEY_DEFAULT): string | undefined => {
  const value = Cookie.get(key);

  return value;
};

export const removeCookie = ({
  key,
  path,
}: Pick<CookieOptions, "key" | "path">): void => {
  Cookie.remove(key, {
    path,
  });
};
