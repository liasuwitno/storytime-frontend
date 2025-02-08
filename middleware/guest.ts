export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuthenticated();

  if (isAuthenticated()) {
    return navigateTo("/");
  }
});
