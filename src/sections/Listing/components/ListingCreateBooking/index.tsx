import React from 'react';

import { Button, Card, DatePicker, Divider, Typography } from 'antd';
import moment, { Moment } from 'moment';

import { BookingsIndex } from './types';

import { appStrings } from '../../../../i18n';
import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';
import { Viewer } from '../../../../lib/types';
import { displayErrorMessage, formatListingPrice } from '../../../../lib/utils';

interface Props {
  viewer: Viewer;
  host: ListingData['listing']['host'];
  price: number;
  bookingsIndex: ListingData['listing']['bookingsIndex'];
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
}

const { Paragraph, Text, Title } = Typography;

const {
  LISTING: { CREATE_BOOKING: lang },
} = appStrings;

export const ListingCreateBooking = ({
  viewer,
  host,
  price,
  bookingsIndex,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

  const dateIsBooked = (currentDate: Moment): boolean => {
    const year = currentDate.year();
    const month = currentDate.month();
    const day = currentDate.date();

    if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
      return Boolean(bookingsIndexJSON[year][month][day]);
    }

    return false;
  };

  const disabledDate = (currentDate: Moment | null): boolean => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf('day'));
      return dateIsBeforeEndOfDay || dateIsBooked(currentDate);
    }
    return false;
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
        return displayErrorMessage(lang.dateError);
      }
      let dateCursor = checkInDate;
      while (moment(dateCursor).isBefore(selectedCheckOutDate, 'days')) {
        dateCursor = moment(dateCursor).add(1, 'days');
        const year = dateCursor.year();
        const month = dateCursor.month();
        const day = dateCursor.date();

        if (
          bookingsIndexJSON[year] &&
          bookingsIndexJSON[year][month] &&
          bookingsIndexJSON[year][month][day]
        ) {
          return displayErrorMessage(lang.dateOverlapsError);
        }
      }
    }
    setCheckOutDate(selectedCheckOutDate);
  };

  const viewerIsHost = viewer.id === host.id;
  const checkInInputDisabled = viewerIsHost || !viewer.id || !host.hasWallet;
  const checkOutInputDisabled = !checkInDate;
  const buttonDisabled = !checkInDate || !checkOutDate;

  let buttonMessage = viewer.id ? lang.wontBeCharged : lang.signInRequird;

  if (viewerIsHost) {
    buttonMessage = lang.cantBookOwnListing;
  }

  if (!host.hasWallet) {
    buttonMessage = lang.noHostWallet;
  }

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/{lang.day}</span>
            </Title>
          </Paragraph>
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>{lang.checkIn}</Paragraph>
            <DatePicker
              value={checkInDate}
              format="YYYY/MM/DD"
              showToday={false}
              disabledDate={disabledDate}
              disabled={checkInInputDisabled}
              onChange={setCheckInDate}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Paragraph strong>{lang.checkOut}</Paragraph>
            <DatePicker
              value={checkOutDate}
              format="YYYY/MM/DD"
              showToday={false}
              disabled={checkOutInputDisabled}
              disabledDate={disabledDate}
              onChange={verifyAndSetCheckOutDate}
            />
          </div>
        </div>
        <Divider />
        <Button
          size="large"
          type="primary"
          className="listing-booking__card-cta"
          disabled={buttonDisabled}
        >
          {lang.bookButton}
        </Button>
        <Text type="secondary" mark>
          {buttonMessage}
        </Text>
      </Card>
    </div>
  );
};
