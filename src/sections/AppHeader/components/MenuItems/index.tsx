import React from 'react';

import { useMutation } from 'react-apollo';
import { NavLink } from 'react-router-dom';

import { appStrings } from '../../../../i18n';
import { LOG_OUT } from '../../../../lib/graphql/mutations';
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut';
import { Viewer } from '../../../../lib/types';

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { LOGOUT: lang } = appStrings;

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem('token');
        <h3>{lang.onCompleted}</h3>;
      }
    },
    onError: () => {
      <h3>{lang.error}</h3>;
    },
  });

  const handleLogout = async () => {
    await logOut();
  };

  const { id, avatar } = viewer;

  return id && avatar ? (
    <div>
      <NavLink to={`/user/${id}`}>Go to '/user/{id}'</NavLink>
      <br />
      <button onClick={handleLogout}>Log out</button>
    </div>
  ) : (
    <NavLink to={`/login`}>Go to '/login'</NavLink>
  );
};
