import React from 'react';

import { KeyOutlined } from '@ant-design/icons';
import { Modal, Button, Divider, Typography } from 'antd';
import { Moment } from 'moment';

import { appStrings } from '../../../../i18n';
import { formatListingPrice } from '../../../../lib/utils';

interface Props {
  price: number;
  modalVisible: boolean;
  checkInDate: Moment;
  checkOutDate: Moment;
  setModalVisible: (modalVisible: boolean) => void;
}

const { Title, Text, Paragraph } = Typography;

const {
  LISTING: { CREATE_BOOKING_MODAL: lang },
} = appStrings;

export const ListingCreateBookingModal = ({
  price,
  modalVisible,
  checkInDate,
  checkOutDate,
  setModalVisible,
}: Props) => {
  const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
  const listingPrice = daysBooked * price;

  return (
    <Modal visible={modalVisible} centered footer={null} onCancel={() => setModalVisible(false)}>
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <KeyOutlined />
          </Title>
          <Title className="listing-booking-modal__intro-title" level={3}>
            {lang.title}
          </Title>
          <Paragraph>
            {lang.enterYourPayment}{' '}
            <Text strong mark>
              {checkInDate.format('MMMM Do YYYY')}
            </Text>{' '}
            {lang.and}{' '}
            <Text strong mark>
              {checkOutDate.format('MMMM Do YYYY')}
            </Text>
            {lang.inclusive}
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={' '}
            <Text strong>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            {lang.total} ={' '}
            <Text strong mark>
              {formatListingPrice(listingPrice, false)}
            </Text>
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <Button size="large" type="primary" className="listing-booking-modal__cta">
            {lang.book}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
