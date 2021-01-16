import React from 'react';

import { NavLink } from 'react-router-dom';

import { MenuItems } from './components';

import { Viewer } from '../../lib/types';

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = ({ viewer, setViewer }: Props) => {
  return (
    <header>
      <h2>Navigation</h2>
      <NavLink to="/">Go to '/'</NavLink>
      <br />
      <MenuItems viewer={viewer} setViewer={setViewer} />
    </header>
  );
};
