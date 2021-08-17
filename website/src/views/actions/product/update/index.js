import UI from "../../../../components/Layout/UI";
import React, { useState, useEffect } from "react";
import axios from 'axios'
import { ACTION, ROUTES } from './../../../../consts/index'
import { useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useParams,
  useLocation
} from "react-router-dom";
import styles from "./../update/update.module.scss";
import { Select, Button, Checkbox, Input, Upload, message, Form, Row, Col, notification, InputNumber } from "antd";
import {
  ArrowLeftOutlined,
  LoadingOutlined,
  FileImageOutlined,
  BarcodeOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { apiAllSupplier } from "../../../../apis/supplier";
import { apiUpdateProduct } from "../../../../apis/product";
const { Option } = Select;
const provinceDataProductType = ["Zhejiang", "Jiangsu"];
const cityDataProductType = {
  Zhejiang: [
    "Nhập loại sản phẩm",
    "Áo sơ mi",
    "Nước hoa",
    "Hộp quà tặng",
    "Giày dép",
    "Gấu bông",
    "Túi xách",
  ],
};
const provinceDataSupplier = ["Zhejiang", "Jiangsu"];
const cityDataSupplier = {
  Zhejiang: [
    "Nhập nhà cung cấp",
    "An Phát",
    "Minh Anh",
    "Hồng Hà",
    "Phát Đạt",
    "An An",
    "Thiên An",
  ],
};
function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
function onChange(e) {
  console.log(`checked = ${e.target.checked}`);
}
export default function ProductUpdate(propsData) {
  const dispatch = useDispatch()
  let { slug } = useParams();
  const state = propsData.location.state;
  let history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [citiesProductType, setCitiesProductType] = React.useState(
    cityDataProductType[provinceDataProductType[0]]
  );
  const [citiesSupplier, setCitiesSupplier] = React.useState(
    cityDataSupplier[provinceDataSupplier[0]]
  );
  const [secondCitySupplier, setSecondCitySupplier] = React.useState(
    cityDataSupplier[provinceDataSupplier[0]][0]
  );
  const [secondCityProductType, setSecondCityProductType] = React.useState(
    cityDataProductType[provinceDataProductType[0]][0]
  );
  const onSecondCityChangeProductType = (value) => {
    setSecondCityProductType(value);
    console.log(value);
  };
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const [select, setSelect] = useState(state.name)
  const onChangeSelect = (e) => {
    // var { value } = e.target;
    setSelect(e)
    console.log(e)
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Cập nhật thông tin sản phẩm thành công.',
    });
  };
  const openNotificationError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Lỗi cập nhật thông tin sản phẩm.',
    });
  };
  const apiUpdateProductData = async (object, id) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiUpdateProduct(object, id);
      console.log(res);
      if (res.status === 200) {
        openNotification()
        history.push("/product/6");
      } else {
        openNotificationError()
      }
      // if (res.status === 200) setStatus(res.data.status);
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const openNotificationNumber = (data) => {
    notification.error({
      message: 'Thất bại',
      description:
        `${data} phải là số.`,
    });
  };
  const onFinish = async (values) => {
    console.log("Success:", values);

    const image = values.dragger && values.dragger.length > 0 && values.dragger[0].originFileObj;
    let formData = new FormData();    //formdata object
    formData.append("files", image);   //append the values with key, value pair
    if (formData) {
      dispatch({ type: ACTION.LOADING, data: true });
      let a = axios
        .post(
          "https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((resp) => resp);
      let resultsMockup = await Promise.all([a]);
      dispatch({ type: ACTION.LOADING, data: false });
      if (isNaN(values.length) || isNaN(values.unit) || isNaN(values.wholesale_price) || isNaN(values.retail_price) || isNaN(values.import_price) || isNaN(values.width) || isNaN(values.quantity) || isNaN(values.height) || isNaN(values.weight)) {
        if (isNaN(values.length)) {
          openNotificationNumber('Chiều dài')
        }
        if (isNaN(values.width)) {
          openNotificationNumber('Chiều rộng')
        }
        if (isNaN(values.height)) {
          openNotificationNumber('Chiều cao')
        }
        if (isNaN(values.weight)) {
          openNotificationNumber('Cân nặng')
        }
        if (isNaN(values.quantity)) {
          openNotificationNumber('Số lượng cung cấp')
        }
        if (isNaN(values.import_price)) {
          openNotificationNumber('Giá nhập thuế')
        }
        if (isNaN(values.retail_price)) {
          openNotificationNumber('Giá bán lẻ')
        }
        if (isNaN(values.wholesale_price)) {
          openNotificationNumber('Giá bán sỉ')
        }
        if (isNaN(values.unit)) {
          openNotificationNumber('Đơn vị')
        }

      } else {

        const object = {
          sku: values.sku.toLowerCase(),
          name: values.name.toLowerCase(),
          barcode: values.bardcode,
          category_id: '1',
          image: values.dragger && values.dragger.length > 0 ? resultsMockup[0].data.data[0] : state.image,
          length: parseInt(values.length),
          width: parseInt(values.width),
          height: parseInt(values.height),
          weight: parseInt(values.weight),
          import_price: parseInt(values.import_price),
          retail_price: parseInt(values.retail_price),
          wholesale_price: parseInt(values.wholesale_price),
          warranty: values.warranty,
          supplier_id: select
        }
        console.log(object)
        apiUpdateProductData(object, state.product_id)
        // apiAddProductData(object)
      }
    }


  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  console.log(state)
  const [supplier, setSupplier] = useState([])
  const apiAllSupplierData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllSupplier();
      console.log(res)
      setSupplier(res.data.data)
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    apiAllSupplierData();
  }, []);
  return (
    <UI>
      <div className={styles["product_manager"]}>
        <Link className={styles["product_manager_title"]} to={slug === '6' ? ("/product/6") : ("/actions/branch/view/19")}>

          <ArrowLeftOutlined style={{ color: 'black' }} />
          <div className={styles["product_manager_title_product"]}>
            {`Cập nhật thông tin sản phẩm ${state.name}`}
          </div>

        </Link>
        <Form
          onFinish={onFinish}
          initialValues={state}
          form={form}
          onFinishFailed={onFinishFailed}
          className={styles["product_manager_content"]}
        >

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Mã sản phẩm</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="sku"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input disabled placeholder="123DF" />
                </Form.Item>
              </div>
            </Col>
            {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Mã SKU</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="skuCode"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="ABC" />
                </Form.Item>
              </div>
            </Col> */}
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Tên sản phẩm</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="name"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="Ly thủy tinh" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Giá bán sỉ</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="wholesale_price"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    // defaultValue={1000}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}

                  />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Giá bán lẻ</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="retail_price"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    // defaultValue={1000}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}

                  />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Giá nhập thuế</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="import_price"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    // defaultValue={1000}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}

                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={11} md={11} lg={7} xl={7}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Kích thước (chiều dài)</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="length"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="10cm" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={11} md={11} lg={7} xl={7}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Kích thước (chiều rộng)</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="width"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="20cm" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={11} md={11} lg={7} xl={7}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Kích thước (chiều cao)</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="height"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="30cm" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={11} md={11} lg={7} xl={7}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Cân nặng (g)</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="weight"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="30cm" />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div className={styles["product_manager_content_image"]}>
            <div
              className={styles["product_manager_content_image_child_title"]}
            >
              Ảnh sản phẩm
            </div>
            <div className={styles["product_manager_content_image_child"]}>
              <Form.Item

              //  label="Dragger"
              >
                <Form.Item

                  name="dragger"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  noStyle
                >
                  <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <img src={state.image} style={{ paddingTop: '1.25rem', width: '5rem', height: '5rem', objectFit: 'contain' }} alt="" />
                    </p>
                    <p className={styles['ant-upload-text']}>
                      Kéo file ảnh vào đây để thêm ảnh mới
                    </p>
                    {/* <p className="ant-upload-hint">
                      Support for a single or bulk upload.
                    </p> */}
                  </Upload.Dragger>
                </Form.Item>
              </Form.Item>
              {/* <div
                className={styles["product_manager_content_image_child_upload"]}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {loading.imageUrl ? (
                    <img
                      src={loading.imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div> */}
              {/* <div
                className={
                  styles["product_manager_content_image_child_upload_title"]
                }
              >

              </div> */}
            </div>
          </div>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Mã barcode</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="barcode"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="ZTE-AAA" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ backgroundColor: '#0077E5', cursor: 'pointer', width: '2.5rem', display: 'flex', padding: '0.25rem 0.5rem', justifyContent: 'center' }}><BarcodeOutlined style={{ fontSize: '1.5rem', color: 'black' }} />
              </div></Col>

          </Row>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Số lượng cung cấp</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="quantity"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="20" />
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Đơn vị</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="unit"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input placeholder="40" />
                </Form.Item>
              </div>
            </Col>

          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Phân loại</div>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            {/* <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Loại sản phẩm</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="supplier_id"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Select
                    // className={
                    //   styles["product_manager_content_product_type_left_content"]
                    // }
                    style={{ width: '100%' }}
                    defaultValue={state.name}
                  >
                    <Option value="type1">Loại sản phẩm 1</Option>
                    <Option value="type2">Loại sản phẩm 2</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col> */}
            <Col style={{ width: '100%', marginBottom: '1.5rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Nhà cung cấp</div>
                {/* <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="supplier_id1"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                > */}
                <Select
                  // className={
                  //   styles["product_manager_content_product_type_left_content"]
                  // }
                  style={{ width: '100%' }}
                  value={select}
                  onChange={onChangeSelect}
                >
                  {
                    supplier.map((values, index) => {
                      return (
                        <Option value={values.supplier_id}>{values.name}</Option>
                      )
                    })
                  }
                </Select>
                {/* </Form.Item> */}
              </div>
            </Col>

          </Row>
          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Chính sách bảo hành</div>
                <Form.Item
                  style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
                  // label="Username"
                  name="warranty"
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  <Input.TextArea style={{ width: '100%' }} placeholder="Bảo hành 5 tháng" rows={5} />
                </Form.Item>
              </div>
            </Col>


          </Row>
          <div
            className={
              styles["product_manager_content_product_code_product_type_button"]
            }
          >
            {/* <Form.Item>
              <Button
                style={{ width: '5rem' }}
                className={
                  styles[
                  "product_manager_content_product_code_product_type_button_left"
                  ]
                }
                type="primary"
                danger
              >
                Hủy
              </Button>
            </Form.Item> */}
            <Form.Item>
              <Button style={{ width: '5rem' }} htmlType="submit" type="primary">
                Lưu
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </UI>
  );
}
