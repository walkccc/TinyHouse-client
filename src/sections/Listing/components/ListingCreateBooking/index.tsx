import React from 'react';

import { Button, Card, DatePicker, Divider, Typography } from 'antd';
import moment, { Moment } from 'moment';

import { appStrings } from '../../../../i18n';
import { displayErrorMessage, formatListingPrice } from '../../../../lib/utils';

interface Props {
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
}

const { Paragraph, Title } = Typography;

const {
  LISTING: { CREATE_BOOKING: lang },
} = appStrings;

export const ListingCreateBooking = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const disabledDate = (currentDate?: Moment): boolean => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf('day'));
      return dateIsBeforeEndOfDay;
    }
    return false;
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, 'days')) {
        return displayErrorMessage(lang.dateError);
      }
    }
    setCheckOutDate(selectedCheckOutDate);
  };

  const checkOutInputDisabled = !checkInDate;
  const buttonDisabled = !checkInDate || !checkOutDate;

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
      </Card>
    </div>
  );
};
