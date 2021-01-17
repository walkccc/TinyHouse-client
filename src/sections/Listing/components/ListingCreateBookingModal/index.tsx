import React from 'react';

import { KeyOutlined } from '@ant-design/icons';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Modal, Button, Divider, Typography } from 'antd';
import moment, { Moment } from 'moment';
import { useMutation } from 'react-apollo';

import { appStrings } from '../../../../i18n';
import { CREATE_BOOKING } from '../../../../lib/graphql/mutations';
import {
  CreateBooking as CreateBookingData,
  CreateBookingVariables,
} from '../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking';
import {
  displayErrorMessage,
  displaySuccessNotification,
  formatListingPrice,
} from '../../../../lib/utils';

interface Props {
  id: string;
  price: number;
  modalVisible: boolean;
  checkInDate: Moment;
  checkOutDate: Moment;
  setModalVisible: (modalVisible: boolean) => void;
  clearBookingDate: () => void;
  handleListingRefetch: () => Promise<void>;
}

const { Title, Text, Paragraph } = Typography;

const {
  LISTING: { CREATE_BOOKING_MODAL: lang },
} = appStrings;

export const ListingCreateBookingModal = ({
  id,
  price,
  modalVisible,
  checkInDate,
  checkOutDate,
  setModalVisible,
  clearBookingDate,
  handleListingRefetch,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [createBooking, { loading }] = useMutation<CreateBookingData, CreateBookingVariables>(
    CREATE_BOOKING,
    {
      onCompleted: () => {
        clearBookingDate();
        displaySuccessNotification(lang.onCompletedMessage, lang.onCompletedDescription);
        handleListingRefetch();
      },
      onError: () => {
        displayErrorMessage(lang.error);
      },
    }
  );

  const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1;
  const listingPrice = daysBooked * price;

  const handleCreateBooking = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return displayErrorMessage(lang.stripeError);
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    const { token, error } = await stripe.createToken(card);

    if (token) {
      createBooking({
        variables: {
          input: {
            id,
            source: token.id,
            checkIn: moment(checkInDate).format('YYYY-MM-DD'),
            checkOut: moment(checkOutDate).format('YYYY-MM-DD'),
          },
        },
      });
    } else {
      displayErrorMessage(error && error.message ? error.message : lang.error);
    }
  };

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
          <CardElement className="listing-booking-modal__stripe-card" />
          <Button
            size="large"
            type="primary"
            loading={loading}
            onClick={handleCreateBooking}
            className="listing-booking-modal__cta"
          >
            {lang.book}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
