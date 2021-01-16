import React from 'react';

import { Avatar, Divider, List, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { appStrings } from '../../../../i18n';
import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';

interface Props {
  listingBookings: ListingData['listing']['bookings'];
  limit: number;
  bookingsPage: number;
  setBookingsPage: (page: number) => void;
}

const { Text, Title } = Typography;

const { BOOKINGS: lang } = appStrings;

export const ListingBookings = ({
  listingBookings,
  limit,
  bookingsPage,
  setBookingsPage,
}: Props) => {
  const total = listingBookings?.total;
  const result = listingBookings?.result;

  const listingBookingsList = listingBookings ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 3,
      }}
      dataSource={result}
      locale={{ emptyText: lang.emptyText }}
      pagination={{
        position: 'top',
        current: bookingsPage,
        total,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setBookingsPage(page),
      }}
      renderItem={(listingBooking) => {
        const bookingHistory = (
          <div className="listing-bookings__history">
            <div>
              {lang.checkIn}: <Text strong>{listingBooking.checkIn}</Text>
            </div>
            <div>
              {lang.checkOut}: <Text strong>{listingBooking.checkOut}</Text>
            </div>
          </div>
        );
        return (
          <List.Item className="listing-bookings__item">
            {bookingHistory}
            <Link to={`/user/${listingBooking.tenant.id}`}>
              <Avatar src={listingBooking.tenant.avatar} size={64} shape="square" />
            </Link>
          </List.Item>
        );
      }}
    />
  ) : null;

  return listingBookingsList ? (
    <div className="listing-bookings">
      <Divider />
      <div className="listing-bookings__section">
        <Title level={4}>{lang.bookings}</Title>
      </div>
      {listingBookingsList}
    </div>
  ) : null;
};
