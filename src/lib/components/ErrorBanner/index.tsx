import React from 'react';

import { Alert } from 'antd';

import { appStrings } from '../../../i18n';

interface Props {
  message?: string;
  description?: string;
}

const { ERROR_BANNER: lang } = appStrings;

export const ErrorBanner = ({ message = lang.message, description = lang.description }: Props) => (
  <Alert
    banner
    closable
    message={message}
    description={description}
    type="error"
    className="error-banner"
  />
);
