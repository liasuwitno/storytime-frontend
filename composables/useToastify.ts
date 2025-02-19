import { useRouter } from "vue-router";

export function useCustomToastify() {
  const router = useRouter();

  const showToast = (
    message: string,
    options: {
      autoClose?: number;
      position?:
        | "top-center"
        | "top-right"
        | "top-left"
        | "bottom-center"
        | "bottom-right"
        | "bottom-left"
        | undefined;
      redirectPath?: string;
    } = {}
  ) => {
    const { autoClose = 3000, position = "top-center", redirectPath } = options;

    useToastify(message, {
      autoClose,
      position,
    });

    if (redirectPath) {
      setTimeout(() => {
        router.push(redirectPath);
      }, autoClose);
    }
  };

  return {
    showToast,
  };
}
