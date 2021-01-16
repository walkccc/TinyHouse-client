import React from 'react';

import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Button, Menu } from 'antd';
import { useMutation } from 'react-apollo';
import { NavLink } from 'react-router-dom';

import { appStrings } from '../../../../i18n';
import { LOG_OUT } from '../../../../lib/graphql/mutations';
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut';
import { Viewer } from '../../../../lib/types';
import { displaySuccessNotification, displayErrorMessage } from '../../../../lib/utils';

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

const { LOGOUT: lang } = appStrings;

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem('token');
        displaySuccessNotification(lang.onCompleted);
      }
    },
    onError: () => {
      displayErrorMessage(lang.error);
    },
  });

  const handleLogout = async () => {
    await logOut();
  };

  const { id, avatar } = viewer;

  const subMenuLogin =
    id && avatar ? (
      <SubMenu title={<Avatar src={avatar} />}>
        <Item key="/user">
          <NavLink to={`/user/${id}`}>
            <UserOutlined></UserOutlined>
            Profile
          </NavLink>
        </Item>
        <Item key="/logout" onClick={handleLogout}>
          <LogoutOutlined></LogoutOutlined>
          Log out
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <NavLink to="/login">
          <Button type="primary">Sign In</Button>
        </NavLink>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <NavLink to="/host">
          <HomeOutlined />
          Host
        </NavLink>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
