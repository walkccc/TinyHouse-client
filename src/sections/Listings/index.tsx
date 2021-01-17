import React from 'react';

import { Layout, List, Typography } from 'antd';
import { useQuery } from 'react-apollo';
import { Link, useRouteMatch } from 'react-router-dom';

import { appStrings } from '../../i18n';
import { ListingCard } from '../../lib/components';
import { ListingsFilter } from '../../lib/graphql/globalTypes';
import { LISTINGS } from '../../lib/graphql/queries/Listings';
import {
  Listings as ListingsData,
  ListingsVariables,
} from '../../lib/graphql/queries/Listings/__generated__/Listings';

const { Content } = Layout;
const { Paragraph, Text, Title } = Typography;

interface MatchParams {
  location: string;
}

const PAGE_LIMIT = 8;

const { LISTINGS: lang } = appStrings;

export const Listings = () => {
  const match = useRouteMatch<MatchParams>();

  const { data } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
    variables: {
      location: match.params.location,
      filter: ListingsFilter.PRICE_LOW_TO_HIGH,
      limit: PAGE_LIMIT,
      page: 1,
    },
  });

  const listings = data?.listings;
  const listingsRegion = listings?.region;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <List
        grid={{
          gutter: 12,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={listings.result}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    ) : (
      <div>
        <Paragraph>
          {lang.emptyList} <Text mark>"{listingsRegion}."</Text>
        </Paragraph>
        <Paragraph>
          <Link to="/host">{lang.host}</Link>!
        </Paragraph>
      </div>
    );

  const listingsRegionsElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      {lang.results} "{listingsRegion}"
    </Title>
  ) : null;

  return (
    <Content className="listings">
      {listingsRegionsElement}
      {listingsSectionElement}
    </Content>
  );
};
