import React from 'react';

import { Col, Layout, Row, Typography } from 'antd';
import { Link, useHistory } from 'react-router-dom';

import cancunImage from './assets/cancun.jpg';
import mapBackground from './assets/map-background.jpg';
import sanFransiscoImage from './assets/san-fransisco.jpg';
import { HomeHero } from './components';

import { appStrings } from '../../i18n';
import { displayErrorMessage } from '../../lib/utils';

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const { HOME: lang } = appStrings;

export const Home = () => {
  const history = useHistory();

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage(lang.onSearchError);
    }
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
