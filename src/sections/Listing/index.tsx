import React, { useState } from 'react';

import { Content } from 'antd/lib/layout/layout';
import { useQuery } from 'react-apollo';
import { useRouteMatch } from 'react-router-dom';

import { appStrings } from '../../i18n';
import { ErrorBanner, PageSkeleton } from '../../lib/components';
import { LISTING } from '../../lib/graphql/queries';
import {
  Listing as ListingData,
  ListingVariables,
} from '../../lib/graphql/queries/Listing/__generated__/Listing';

interface MatchParams {
  id: string;
}

const { LISTING: lang } = appStrings;
const PAGE_LIMIT = 3;

export const Listing = () => {
  const match = useRouteMatch<MatchParams>();

  const [bookingsPage] = useState(1);

  const { loading, error } = useQuery<ListingData, ListingVariables>(LISTING, {
    variables: {
      id: match.params.id,
      limit: PAGE_LIMIT,
      bookingsPage,
    },
  });

  if (loading) {
    return (
      <Content className="listing">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listing">
        <ErrorBanner description={lang.error} />
        <PageSkeleton />
      </Content>
    );
  }

  return <h2>Listing</h2>;
};
