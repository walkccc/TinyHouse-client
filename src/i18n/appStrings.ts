export const appStrings = {
  APP: {
    locale: 'en-US',
    lang: 'English',
  },
  LOGIN: {
    onCompleted: "You've successfully logged in!",
    loading: 'Logging you in...',
    error: "Sorry! We weren't able to log you in. Please try again later!",
    loginVia: (party: string) => `Login via ${party}`,
  },
  LOGOUT: {
    onCompleted: "You've successfully loggest out!",
    error: "Sorry! We weren't able to log you out. Please try again later!",
  },
  ERROR_BANNER: {
    message: 'Oh no! Something went wrong :(',
    description: 'Sorry, but something went wrong. Please check you connection and try again.',
  },
};
