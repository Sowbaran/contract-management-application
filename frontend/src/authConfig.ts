export const auth0Config = {
  domain: import.meta.env["VITE_AUTH0_DOMAIN"] as string,
  clientId: import.meta.env["VITE_AUTH0_CLIENT_ID"] as string,
  authorizationParams: {
    redirect_uri: import.meta.env["VITE_APP_REDIRECT_URL"] as string,
    scope: "openid profile email",
  },
};
