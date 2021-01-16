import React from 'react';

import { EnvironmentOutlined } from '@ant-design/icons';
import { Avatar, Divider, Tag, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { appStrings } from '../../../../i18n';
import { Listing } from '../../../../lib/graphql/queries/Listing/__generated__/Listing';
import { iconColor } from '../../../../lib/utils';

interface Props {
  listing: Listing['listing'];
}

const { Paragraph, Title } = Typography;

const {
  LISTING: { DETAILS: lang },
} = appStrings;

export const ListingDetails = ({ listing }: Props) => {
  const { title, description, image, type, address, city, numOfGuests, host } = listing;

  return (
    <div className="listing-details">
      <div style={{ backgroundImage: `url(${image})` }} className="listing-details__image" />
      <div className="listing-details__information">
        <Paragraph type="secondary" ellipsis className="listing-details__city-address">
          <Link to={`/listings/${city}`}>
            <EnvironmentOutlined style={{ color: iconColor }} /> {city}
          </Link>
          <Divider type="vertical" />
          {address}
        </Paragraph>
        <Title level={3} className="listing-details__title">
          {title}
        </Title>
      </div>

      <div className="listing-details__section">
        <Link to={`/user/${host.id}`}>
          <Avatar src={host.avatar} size={64} />
          <Title level={2} className="listing-details__host-name">
            {host.name}
          </Title>
        </Link>

        <Divider />

        <div className="listing-details__section">
          <Title level={4}>{lang.about}</Title>
          <div className="listing-details__about-items">
            <Tag color="magenta">{type}</Tag>
            <Tag color="magenta">
              {numOfGuests} {lang.guests}
            </Tag>
          </div>
          <Paragraph ellipsis={{ rows: 3, expandable: true }}>{description}</Paragraph>
        </div>
      </div>
    </div>
  );
};
