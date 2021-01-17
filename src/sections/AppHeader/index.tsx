import React, { useEffect, useState } from 'react';

import { Input, Layout } from 'antd';
import { NavLink, useHistory, useLocation } from 'react-router-dom';

import logo from './assets/tinyhouse-logo.png';
import { MenuItems } from './components';

import { appStrings } from '../../i18n';
import { Viewer } from '../../lib/types';
import { displayErrorMessage } from '../../lib/utils';

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;
const { Search } = Input;

const { APP_HEADER: lang } = appStrings;

export const AppHeader = ({ viewer, setViewer }: Props) => {
  const history = useHistory();
  const location = useLocation();

  const [search, setSearch] = useState('');

  useEffect(() => {
    const { pathname } = location;
    const pathnameSubStrings = pathname.split('/');

    if (!pathname.includes('/listings')) {
      setSearch('');
      return;
    }

    if (pathname.includes('/listings') && pathnameSubStrings.length === 3) {
      setSearch(pathnameSubStrings[2]);
      return;
    }
  }, [location]);

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage(lang.onSearchError);
    }
  };

  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <NavLink to="/">
            <img src={logo} alt="TinyHouse logo" />
          </NavLink>
        </div>
        <div className="app-header__search-input">
          <Search
            placeholder={lang.searchPlaceHolder}
            enterButton
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearch}
          />
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};
