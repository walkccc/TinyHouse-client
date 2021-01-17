import React from 'react';

import { Card, Col, Input, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { appStrings } from '../../../../i18n';
import dubaiImage from '../../assets/dubai.jpg';
import londonImage from '../../assets/london.jpg';
import newYorkImage from '../../assets/new-york.jpg';
import taipeiImage from '../../assets/taipei.jpg';

interface Props {
  onSearch: (value: string) => void;
}

const { Search } = Input;
const { Title } = Typography;

const {
  HOME: { HERO: lang },
} = appStrings;

export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title className="home-hero__title">{lang.title}</Title>
        <Search
          placeholder="Search 'New York'"
          size="large"
          enterButton
          className="home-hero__search-input"
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className="home-hero__cards">
        <Col md={6} xs={12}>
          <Link to="/listings/dubai">
            <Card cover={<img src={dubaiImage} alt={lang.dubai} />}>{lang.dubai}</Card>
          </Link>
        </Col>

        <Col md={6} xs={0}>
          <Link to="/listings/london">
            <Card cover={<img src={londonImage} alt={lang.london} />}>{lang.london}</Card>
          </Link>
        </Col>

        <Col md={6} xs={12}>
          <Link to="/listings/new%20york">
            {' '}
            <Card cover={<img src={newYorkImage} alt={lang.newYork} />}>{lang.newYork}</Card>
          </Link>
        </Col>

        <Col md={6} xs={0}>
          <Link to="/listings/taipei">
            <Card cover={<img src={taipeiImage} alt={lang.taipei} />}>{lang.taipei}</Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
