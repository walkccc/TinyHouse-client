import React from 'react';

import { Col, Layout, Row, Typography } from 'antd';
import { useQuery } from 'react-apollo';
import { Link, useHistory } from 'react-router-dom';

import cancunImage from './assets/cancun.jpg';
import mapBackground from './assets/map-background.jpg';
import sanFransiscoImage from './assets/san-fransisco.jpg';
import { HomeHero, HomeListings, HomeListingsSkeleton } from './components';

import { appStrings } from '../../i18n';
import { ListingsFilter } from '../../lib/graphql/globalTypes';
import { LISTINGS } from '../../lib/graphql/queries/Listings';
import {
  Listings,
  ListingsVariables,
} from '../../lib/graphql/queries/Listings/__generated__/Listings';
import { displayErrorMessage } from '../../lib/utils';

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const { HOME: lang } = appStrings;
const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = () => {
  const history = useHistory();

  const { data, loading } = useQuery<Listings, ListingsVariables>(LISTINGS, {
    variables: {
      filter: ListingsFilter.PRICE_HIGH_TO_LOW,
      limit: PAGE_LIMIT,
      page: PAGE_NUMBER,
    },
  });

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage(lang.onSearchError);
    }
  };

  const renderListingsSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data) {
      return <HomeListings title="Premium Listings" listings={data.listings.result} />;
    }
    return null;
  };

  return (
    <Content className="home" style={{ backgroundImage: `url(${mapBackground})` }}>
      <HomeHero onSearch={onSearch} />
      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          {lang.title}
        </Title>
        <Paragraph>{lang.explantion}</Paragraph>
        <Link
          to="/listings/united%20states"
          className="ant-btn ant-btn-primary ant-btn-large home__cta-section-button"
        >
          {lang.link}
        </Link>
      </div>

      {renderListingsSection()}

      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          {lang.homeListingTitle}
        </Title>
        <Row gutter={12}>
          <Col xs={24} lg={12} style={{ marginBottom: 12 }}>
            <Link to="/listings/san%20fransisco">
              <div className="home__listings-img-cover">
                <img
                  src={sanFransiscoImage}
                  alt="San Fransisco"
                  className="home__listings-img"
                  loading="lazy"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} lg={12} style={{ marginBottom: 12 }}>
            <Link to="/listings/cancún">
              <div className="home__listings-img-cover">
                <img src={cancunImage} alt="Cancún" className="home__listings-img" loading="lazy" />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
