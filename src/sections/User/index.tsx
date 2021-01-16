import React from 'react';

export const User = () => {
  const url = window.location.href;
  const index = url.indexOf('/user');
  const uid = url.substring(index + 6);

  return (
    <h2>
      Current URL: <span>/user/{uid}</span>
    </h2>
  );
};
