import React, { useState } from 'react';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Col, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { Moment } from 'moment';
import { useQuery } from 'react-apollo';
import { useRouteMatch } from 'react-router-dom';

import { ListingCreateBooking, ListingCreateBookingModal } from './components';
import { ListingBookings } from './components/ListingBookings';
import { ListingDetails } from './components/ListingDetails';

import { appStrings } from '../../i18n';
import { ErrorBanner, PageSkeleton } from '../../lib/components';
import { LISTING } from '../../lib/graphql/queries';
import {
  Listing as ListingData,
  ListingVariables,
} from '../../lib/graphql/queries/Listing/__generated__/Listing';
import { Viewer } from '../../lib/types';

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}

const { LISTING: lang } = appStrings;
const PAGE_LIMIT = 3;
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string);

export const Listing = ({ viewer }: Props) => {
  const match = useRouteMatch<MatchParams>();

  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, loading, error } = useQuery<ListingData, ListingVariables>(LISTING, {
    variables: {
      id: match.params.id,
      limit: PAGE_LIMIT,
      bookingsPage,
    },
  });

  const listing = data?.listing;
  const listingBookings = listing?.bookings;

  const listingDetailsElement = listing ? <ListingDetails listing={listing} /> : null;

  const listingBookingsElement = listingBookings ? (
    <ListingBookings
      listingBookings={listingBookings}
      limit={PAGE_LIMIT}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  const listingCreateBookingElement = listing ? (
    <ListingCreateBooking
      viewer={viewer}
      host={listing.host}
      price={listing.price}
      bookingsIndex={listing.bookingsIndex}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
      setModalVisible={setModalVisible}
    />
  ) : null;

  const listingCreateBookingModalElement =
    listing && checkInDate && checkOutDate ? (
      <Elements stripe={stripePromise}>
        <ListingCreateBookingModal
          price={listing.price}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      </Elements>
    ) : null;

  if (loading) {
    return (
      <Content className="listing">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listing">
        <ErrorBanner description={lang.error} />
        <PageSkeleton />
      </Content>
    );
  }

  return (
    <Content className="listing">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listingDetailsElement}
          {listingBookingsElement}
        </Col>
        <Col xs={24} lg={10}>
          {listingCreateBookingElement}
        </Col>
      </Row>
      {listingCreateBookingModalElement}
    </Content>
  );
};
