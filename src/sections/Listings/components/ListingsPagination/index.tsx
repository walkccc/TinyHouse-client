import React from 'react';

import { Pagination } from 'antd';

interface Props {
  total: number;
  limit: number;
  page: number;
  setPage: (page: number) => void;
}

export const ListingsPagination = ({ total, limit, page, setPage }: Props) => (
  <Pagination
    current={page}
    total={total}
    defaultPageSize={limit}
    hideOnSinglePage
    showLessItems
    onChange={(page: number) => setPage(page)}
    className="listings-pagination"
  />
);
