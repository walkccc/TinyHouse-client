import React, { useState } from 'react';

import { Col, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { Moment } from 'moment';
import { useQuery } from 'react-apollo';
import { useRouteMatch } from 'react-router-dom';

import { ListingCreateBooking } from './components';
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

export const Listing = ({ viewer }: Props) => {
  const match = useRouteMatch<MatchParams>();

  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

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
    />
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
    </Content>
  );
};
