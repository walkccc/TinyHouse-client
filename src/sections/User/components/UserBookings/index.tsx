import React from 'react';

import { List, Typography } from 'antd';

import { appStrings } from '../../../../i18n';
import { ListingCard } from '../../../../lib/components';
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
  userBookings: UserData['user']['bookings'];
  limit: number;
  bookingsPage: number;
  setBookingsPage: (page: number) => void;
}

const { Paragraph, Text, Title } = Typography;

const { BOOKINGS: lang } = appStrings;

export const UserBookings = ({ userBookings, limit, bookingsPage, setBookingsPage }: Props) => {
  const total = userBookings?.total;
  const result = userBookings?.result;

  const userBookingsList = userBookings ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 4,
        xl: 4,
        xxl: 4,
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
      renderItem={(userBooking) => {
        const bookingHistory = (
          <div className="user-bookings__booking-history">
            <div>
              {lang.checkIn}: <Text strong>{userBooking.checkIn}</Text>
            </div>
            <div>
              {lang.checkOut}: <Text strong>{userBooking.checkIn}</Text>
            </div>
          </div>
        );
        return (
          <List.Item>
            {bookingHistory}
            <ListingCard listing={userBooking.listing}></ListingCard>
          </List.Item>
        );
      }}
    />
  ) : null;

  return userBookingsList ? (
    <div className="user-bookings">
      <Title level={4} className="user-bookings__title">
        {lang.bookings}
      </Title>
      <Paragraph className="user-bookings__description">{lang.explanation}</Paragraph>
      {userBookingsList}
    </div>
  ) : null;
};
