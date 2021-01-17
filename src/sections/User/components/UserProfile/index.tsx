import React, { Fragment } from 'react';

import { Avatar, Button, Card, Divider, Typography } from 'antd';

import { appStrings } from '../../../../i18n';
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
  user: UserData['user'];
  viewerIsUser: boolean;
}

const {
  USER: { PROFILE: lang },
} = appStrings;

const { Paragraph, Text, Title } = Typography;

const stripeAuthUrl =
  'https://connect.stripe.com/oauth/authorize?response_type=code' +
  `&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`;

export const UserProfile = ({ user, viewerIsUser }: Props) => {
  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl;
  };

  const additionalDetailsSection = viewerIsUser ? (
    <Fragment>
      <Divider />
      <div className="user-profile__details">
        <Title level={4}>{lang.additionalDetails}</Title>
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
