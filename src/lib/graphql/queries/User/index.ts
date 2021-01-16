import { gql } from 'apollo-boost';

export const USER = gql`
  query User($id: ID!, $limit: Int!, $listingsPage: Int!, $bookingsPage: Int!) {
    user(id: $id) {
      id
      name
      avatar
      contact
      hasWallet
      income
      listings(limit: $limit, page: $listingsPage) {
        total
        result {
          id
          title
          image
          address
          price
          numOfGuests
        }
      }
      bookings(limit: $limit, page: $bookingsPage) {
        total
        result {
          id
          listing {
            id
            title
            image
            address
            price
            numOfGuests
          }
          checkIn
          checkOut
        }
      }
    }
  }
`;
