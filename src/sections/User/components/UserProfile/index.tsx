import React, { Fragment } from 'react';

import { Avatar, Button, Card, Divider, Tag, Typography } from 'antd';
import { useMutation } from 'react-apollo';

import { appStrings } from '../../../../i18n';
import { DISCONNECT_STRIPE } from '../../../../lib/graphql/mutations';
import { DisconnectStripe as DisconnectStripeData } from '../../../../lib/graphql/mutations/DisconnectStripe/__generated__/DisconnectStripe';
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User';
import { Viewer } from '../../../../lib/types';
import {
  displayErrorMessage,
  displaySuccessNotification,
  formatListingPrice,
} from '../../../../lib/utils';

interface Props {
  user: UserData['user'];
  viewerIsUser: boolean;
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  handleUserRefetch: () => void;
}

const {
  USER: { PROFILE: lang },
} = appStrings;

const { Paragraph, Text, Title } = Typography;

const stripeAuthUrl =
  'https://connect.stripe.com/oauth/authorize?response_type=code' +
  `&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`;

export const UserProfile = ({
  user,
  viewerIsUser,
  viewer,
  setViewer,
  handleUserRefetch,
}: Props) => {
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(DISCONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data && data.disconnectStripe) {
        setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
        displaySuccessNotification(lang.stripeOnCompleteMessage, lang.stripeOnCompleteDescription);
        handleUserRefetch();
      }
    },
    onError: () => {
      displayErrorMessage(lang.stripeError);
    },
  });

  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  };

  const additionalDetails = user.hasWallet ? (
    <Fragment>
      <Paragraph>
        <Tag color="green">{lang.stripeRegistered}</Tag>
      </Paragraph>
      <Paragraph>
        {lang.incomeEarned}:{' '}
        <Text strong>{user.income ? formatListingPrice(user.income) : `$0`}</Text>
      </Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        loading={loading}
        onClick={() => disconnectStripe()}
      >
        {lang.disconnectStripe}
      </Button>
      <Paragraph type="secondary">{lang.disconnectWarning}</Paragraph>
    </Fragment>
  ) : (
    <Fragment>
      <Paragraph>{lang.intereseted}</Paragraph>
      <Button type="primary" className="user-profile__details-cta" onClick={redirectToStripe}>
        {lang.connectStripe}
      </Button>
      <Paragraph type="secondary">
        {lang.tinyHouseUses}{' '}
        <a href="https://stripe.com/en-US/connect" target="_blank" rel="noopener noreferrer">
          Stripe
        </a>{' '}
        {lang.explanation}
      </Paragraph>
    </Fragment>
  );

  const additionalDetailsSection = viewerIsUser ? (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>{lang.additionalDetails}</Title>
        {additionalDetails}
      </div>
    </Fragment>
  ) : null;

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className="user-profile__details">
          <Title level={4}>{lang.details}</Title>
          <Paragraph>
            {lang.name}: <Text strong>{user.name}</Text>
          </Paragraph>
          <Paragraph>
            {lang.contact}: <Text strong>{user.contact}</Text>
          </Paragraph>
        </div>
        {additionalDetailsSection}
      </Card>
    </div>
  );
};
