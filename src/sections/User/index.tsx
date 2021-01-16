import React, { useState } from 'react';

import { Col, Layout, Row } from 'antd';
import { useQuery } from 'react-apollo';
import { useRouteMatch } from 'react-router-dom';

import { UserBookings, UserListings, UserProfile } from './components';

import { appStrings } from '../../i18n';
import { ErrorBanner, PageSkeleton } from '../../lib/components';
import { USER } from '../../lib/graphql/queries';
import { User as UserData, UserVariables } from '../../lib/graphql/queries/User/__generated__/User';
import { Viewer } from '../../lib/types';

interface Props {
  viewer: Viewer;
}

interface MatchParams {
  id: string;
}

const { Content } = Layout;

const { USER: lang } = appStrings;
const PAGE_LIMIT = 4;

export const User = ({ viewer }: Props) => {
  const match = useRouteMatch<MatchParams>();

  const [listingsPage, setListingsPage] = useState(1);
  const [bookingsPage, setBookingsPage] = useState(1);

  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: { id: match.params.id, limit: PAGE_LIMIT, listingsPage, bookingsPage },
  });

  const user = data?.user;
  const userListings = user?.listings;
  const userBookings = user?.bookings;
  const viewerIsUser = viewer.id === match.params.id;

  const userProfileElement = user ? <UserProfile user={user} viewerIsUser={viewerIsUser} /> : null;

  const userListingsElement = userListings ? (
    <UserListings
      userListings={userListings}
      limit={PAGE_LIMIT}
      listingsPage={listingsPage}
      setListingsPage={setListingsPage}
    />
  ) : null;

  const userBookingsElement = userBookings ? (
    <UserBookings
      userBookings={userBookings}
      limit={PAGE_LIMIT}
      bookingsPage={bookingsPage}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="user">
        <ErrorBanner description={lang.error} />
        <PageSkeleton />
      </Content>
    );
  }

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>
          {userProfileElement}
          {userListingsElement}
          {userBookingsElement}
        </Col>
      </Row>
    </Content>
  );
};
