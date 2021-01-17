import React, { useState } from 'react';

import { BankOutlined, HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Layout, Typography, Form, Input, Radio, Upload, Button, InputNumber } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { useMutation } from 'react-apollo';
import { Link, Redirect } from 'react-router-dom';

import { appStrings } from '../../i18n';
import { ListingType } from '../../lib/graphql/globalTypes';
import { HOST_LISTING } from '../../lib/graphql/mutations';
import {
  HostListing as HostListingData,
  HostListingVariables,
} from '../../lib/graphql/mutations/HostListing/__generated__/HostListing';
import { Viewer } from '../../lib/types';
import { iconColor, displayErrorMessage, displaySuccessNotification } from '../../lib/utils';

interface Props {
  viewer: Viewer;
}

interface HostListingValues {
  type: ListingType;
  numOfGuests: number;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image: File;
  price: number;
}

const { Content } = Layout;
const { Title, Text } = Typography;
const { Item } = Form;

const { HOST: lang } = appStrings;
const { FORM: f } = lang;
const { maxChar, warning } = f;

export const Host = ({ viewer }: Props) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const [hostListing, { loading, data }] = useMutation<HostListingData, HostListingVariables>(
    HOST_LISTING,
    {
      onCompleted: () => displaySuccessNotification(lang.onCompleted),
      onError: () => displayErrorMessage(lang.error),
    }
  );

  const handleImageUpload = (info: UploadChangeParam) => {
    const { file } = info;
    if (file.status === 'uploading') {
      setImageBase64Value(null);
      setImageLoading(true);
      return;
    }

    if (file.status === 'done' && file.originFileObj) {
      getBase64Value(file.originFileObj, (imageBase64Value: string) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  const handleHostListing = (values: HostListingValues) => {
    console.log(values);

    hostListing({
      variables: {
        input: {
          title: values.title,
          description: values.description,
          image: imageBase64Value as string,
          type: values.type,
          address: `${values.address}, ${values.city}, ${values.state}`,
          price: values.price * 100,
          numOfGuests: values.numOfGuests,
        },
      },
    });
  };

  if (!viewer.id || !viewer.hasWallet) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            {lang.notViewerTitle}
          </Title>
          <Text type="secondary">
            {lang.notViewerReminder[0]} <Link to="/login">/login</Link> {lang.notViewerReminder[1]}
          </Text>
        </div>
      </Content>
    );
  }

  if (data && data.hostListing) {
    return <Redirect to={`/listing/${data.hostListing.id}`} />;
  }

  if (loading) {
    return (
      <Content className="host-content">
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            {lang.loading}
          </Title>
          <Text type="secondary">{lang.loadingExplanation}</Text>
        </div>
      </Content>
    );
  }

  return (
    <Content className="host-content">
      <Form layout="vertical" onFinish={handleHostListing}>
        <div className="host__form-header">
          <Title level={3} className="host__form-title">
            {lang.title}
          </Title>
          <Text type="secondary">{lang.text}</Text>
        </div>

        <Item label={f.type} name="type" rules={[{ required: true, message: f.typeMessage }]}>
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <BankOutlined style={{ color: iconColor }} /> <span>{f.apartment}</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined style={{ color: iconColor }} /> <span>{f.house}</span>
            </Radio.Button>
          </Radio.Group>
        </Item>

        <Item
          label={f.numOfGuests}
          name="numOfGuests"
          rules={[{ required: true, message: warning(f.numOfGuests) }]}
        >
          <InputNumber name="numOfGuests" min={1} max={6} placeholder="4" />
        </Item>

        <Item
          label={f.title}
          name="title"
          extra={maxChar(50)}
          rules={[{ required: true, message: warning(f.title) }]}
        >
          <Input name="title" maxLength={45} placeholder={f.titlePlaceholder} />
        </Item>

        <Item
          label={f.description}
          name="description"
          extra={maxChar(300)}
          rules={[{ required: true, message: warning(f.description) }]}
        >
          <Input.TextArea rows={3} maxLength={300} placeholder={f.descriptionPlaceholder} />
        </Item>

        <Item
          label={f.address}
          name="address"
          extra={maxChar(300)}
          rules={[{ required: true, message: warning(f.address) }]}
        >
          <Input placeholder={f.addressPlaceholder} name="address" autoComplete="street-address" />
        </Item>

        <Item label={f.city} name="city" rules={[{ required: true, message: warning(f.city) }]}>
          <Input placeholder={f.cityPlaceholder} name="city" autoComplete="address-level2" />
        </Item>

        <Item label={f.state} name="state" rules={[{ required: true, message: warning(f.state) }]}>
          <Input placeholder={f.statePlaceholder} name="state" autoComplete="address-level1" />
        </Item>

        <Item label={f.zip} name="zip">
          <Input placeholder={f.zipPlaceholder} autoComplete="postal-code" name="zip" />
        </Item>

        <Item
          label={f.image}
          name="image"
          extra={f.imageExtra}
          rules={[{ required: true, message: f.imageMessage }]}
        >
          <div className="host__form-image-upload">
            <Upload
              listType="picture-card"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeImageUpload}
              onChange={handleImageUpload}
            >
              {imageBase64Value ? (
                <img src={imageBase64Value} alt={f.imageAlt} />
              ) : (
                <div>
                  {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div className="ant-upload-text">{f.upload}</div>
                </div>
              )}
            </Upload>
          </div>
        </Item>

        <Item
          label={f.price}
          name="price"
          extra={f.priceExtra}
          rules={[{ required: true, message: warning(f.price) }]}
        >
          <InputNumber min={0} placeholder="120" />
        </Item>

        <Item>
          <Button type="primary" htmlType="submit">
            {f.submit}
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

const beforeImageUpload = (file: File): boolean => {
  const fileIsValidImage =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
  const fileIsValidSize = file.size / 1024 / 1024 < 1;

  if (!fileIsValidImage) {
    displayErrorMessage(lang.invalidImageError);
  }

  if (!fileIsValidSize) {
    displayErrorMessage(lang.invalidSizeError);
  }

  return fileIsValidImage && fileIsValidSize;
};

const getBase64Value = (file: File | Blob, callback: (imageBase64Value: string) => void): void => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      callback(reader.result);
    }
  };
};
