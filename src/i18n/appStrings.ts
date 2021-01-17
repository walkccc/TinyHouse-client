export const appStrings = {
  APP: {
    locale: 'en-US',
    lang: 'English',
  },
  APP_HEADER: {
    onSearchError: 'Please enter a valid search',
    searchPlaceHolder: "Search 'New York'",
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
  HOME: {
    title: 'Your guide for all things rental',
    explantion: 'Helping you make the best decisions in renting your last minute locations.',
    link: 'Popular listings in the United States',
    homeListingTitle: 'Listings of any kind',
    onSearchError: 'Please enter a valid search',
    HERO: {
      title: "Find a place you'll love to stay at",
      dubai: 'Dubai',
      london: 'London',
      newYork: 'New York',
      taipei: 'Taipei',
    },
  },
  USER: {
    error: "This user may not exist or we've encountered an error",
    PROFILE: {
      additionalDetails: 'Additional Details',
      intereseted: 'Interested in becoming a TinyHouse host? Register with your Stripe account!',
      tinyHouseUses: 'TinyHouse uses',
      explanation: 'to help transfer your earnings in a secure and truster manner.',
      connectStripe: 'Connect with Stripe',
      details: 'Details',
      name: 'Name',
      contact: 'Contact',
    },
    LISTINGS: {
      listings: 'Listings',
      emptyText: "User doesn't have any listings yet!",
      explanation:
        'This section highlights the listings this user currently hosts and has made available for bookings.',
    },
  },
  LISTING: {
    error: "This listing may not exist or we've encountered an error",
    DETAILS: {
      about: 'About this space',
      guests: 'guests',
    },
    CREATE_BOOKING: {
      dateError: "You can't book date of check out to be prior to check in!",
      day: 'day',
      checkIn: 'Check in',
      checkOut: 'Check out',
      bookButton: 'Request to book!',
    },
  },
  LISTINGS: {
    error:
      "We either couldn't find anything matching your search or we've encountered an error. If you're searching for a unique location, try searching again with more common keywords.",
    emptyList: 'It appears that no listings have yet been created for',
    host: 'Be the first person to create a listing in this area!',
    results: 'Results for',
    FILTERS: {
      filterBy: 'Filter By',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
    },
  },
  BOOKINGS: {
    bookings: 'Bookings',
    emptyText: 'No bookings for this listing!',
    checkIn: 'Check in',
    checkOut: 'Check out',
    explanation:
      "This section highlights the bookings you've made, and the check-in/check-out dates associated with said bookings.",
  },
  ERROR_BANNER: {
    message: 'Oh no! Something went wrong :(',
    description: 'Sorry, but something went wrong. Please check you connection and try again.',
  },
  LISTING_CARD: {
    day: 'day',
    guests: 'guests',
  },
};
