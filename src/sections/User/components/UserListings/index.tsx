import React from 'react';

import { List, Typography } from 'antd';

import { appStrings } from '../../../../i18n';
import { ListingCard } from '../../../../lib/components';
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User';

interface Props {
  userListings: UserData['user']['listings'];
  limit: number;
  listingsPage: number;
  setListingsPage: (page: number) => void;
}

const { Paragraph, Title } = Typography;

const {
  USER: { LISTINGS: lang },
} = appStrings;

export const UserListings = ({ userListings, limit, listingsPage, setListingsPage }: Props) => {
  const { total, result } = userListings;

  const userListingsList = (
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
        current: listingsPage,
        total,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setListingsPage(page),
      }}
      renderItem={(userListing) => (
        <List.Item>
          <ListingCard listing={userListing}></ListingCard>
        </List.Item>
      )}
    />
  );

  return (
    <div className="user-listings">
      <Title level={4} className="user-listings__title">
        {lang.listings}
      </Title>
      <Paragraph className="user-listings__description">{lang.explanation}</Paragraph>
      {userListingsList}
    </div>
  );
};
