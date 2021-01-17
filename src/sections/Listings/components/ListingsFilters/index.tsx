import { Select } from 'antd';

import { appStrings } from '../../../../i18n';
import { ListingsFilter } from '../../../../lib/graphql/globalTypes';

interface Props {
  filter: ListingsFilter;
  setFilter: (filter: ListingsFilter) => void;
}

const { Option } = Select;

const {
  LISTINGS: { FILTERS: lang },
} = appStrings;

export const ListingsFilters = ({ filter, setFilter }: Props) => (
  <div className="listings-filters">
    <span>{lang.filterBy}</span>
    <Select value={filter} onChange={(filter: ListingsFilter) => setFilter(filter)}>
      <Option value={ListingsFilter.PRICE_LOW_TO_HIGH}>{lang.priceLowToHigh}</Option>
      <Option value={ListingsFilter.PRICE_HIGH_TO_LOW}>{lang.priceHighToLow}</Option>
    </Select>
  </div>
);
