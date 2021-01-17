import React, { useEffect, useRef, useState } from 'react';

import { Affix, Layout, List, Typography } from 'antd';
import { useQuery } from 'react-apollo';
import { Link, useRouteMatch } from 'react-router-dom';

import { ListingsFilters, ListingsPagination, ListingsSkeleton } from './components';

import { appStrings } from '../../i18n';
import { ErrorBanner, ListingCard } from '../../lib/components';
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
  const locationRef = useRef(match.params.location);

  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(LISTINGS, {
    skip: locationRef.current !== match.params.location && page !== 1,
    variables: {
      location: match.params.location,
      filter,
      limit: PAGE_LIMIT,
      page,
    },
  });

  // when location change, we'll set page to 1, thus force a new query
  useEffect(() => {
    setPage(1);
    locationRef.current = match.params.location;
  }, [match.params.location]);

  const listings = data?.listings;
  const listingsRegion = listings?.region;

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <ListingsPagination
            total={listings.total}
            limit={PAGE_LIMIT}
            page={page}
            setPage={setPage}
          />
          <ListingsFilters filter={filter} setFilter={setFilter} />
        </Affix>
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
      </div>
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

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listing">
        <ErrorBanner description={lang.error} />
        <ListingsSkeleton />
      </Content>
    );
  }

  return (
    <Content className="listings">
      {listingsRegionsElement}
      {listingsSectionElement}
    </Content>
  );
};
