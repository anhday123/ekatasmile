import UI from "../../../../components/Layout/UI";
import React, { useState, useEffect } from "react";
import axios from 'axios'
import { ACTION, ROUTES } from './../../../../consts/index'
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import styles from "./../add/add.module.scss";
import { Select, Button, Tabs, InputNumber, Divider, Table, Checkbox, Switch, Input, Upload, message, Form, Row, Col, notification } from "antd";
import {
  ArrowLeftOutlined,
  CloseOutlined,
  LoadingOutlined,
  FileImageOutlined,
  BarcodeOutlined,
  PlusOutlined,
  InboxOutlined,
  ContactsTwoTone,
} from "@ant-design/icons";
import { apiAddProduct } from "../../../../apis/product";
import { apiAllCategory } from "../../../../apis/category";
import { apiAllWarranty } from './../../../../apis/warranty'
import { apiAllSupplier } from "../../../../apis/supplier"; import { useDispatch } from 'react-redux'
import SingleProduct from "./components/singleProduct";
import GroupProduct from "./components/groupProduct";
import { apiDistrict, apiProvince } from "../../../../apis/information";
import { apiAllInventory } from "../../../../apis/inventory";
const { Option } = Select;
const { Dragger } = Upload;
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
let index = 0;
let indexGroup = 0;
export default function ProductAdd() {
  const [supplier, setSupplier] = useState([])
  const [name, setName] = useState('')
  const [nameGroup, setNameGroup] = useState('')
  const [itemsGroup, setItemsGroup] = useState([])
  const [dynamic, setDynamic] = useState([])
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [listGroup, setListGroup] = useState('')
  const [warranty, setWarranty] = useState([])
  const [warehouse, setWarehouse] = useState([])
  let history = useHistory();
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const { TabPane } = Tabs;
  const onNameChange = event => {
    setName(event.target.value)
  };
  const onNameChangeGroup = event => {
    setNameGroup(event.target.value)
    console.log(event.target.value)
  };

  const addItemGroup = () => {
    console.log('addItem');
    setNameGroup('')
    setItemsGroup([...itemsGroup, nameGroup || `New item ${index++}`])
  };
  const addItem = () => {
    console.log('addItem');
    setName('')
    setWarranty([...warranty, name || `New item ${index++}`])
  };
  function callback(key) {
    console.log(key);
  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm mới sản phẩm thành công.',
    });
  };
  const [sku, setSKU] = useState('')
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
  const openNotificationForgetImage = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Bạn chưa chọn ảnh.',
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const apiAllSupplierData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllSupplier();
      console.log(res)
      if (res.status === 200) {
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (values.active) {
            array.push(values)
          }
        })
        setSupplier([...array])
      }
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const [category, setCategory] = useState([])
  const apiAllCategoryData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllCategory();
      console.log(res)
      console.log("||||||||||||||")
      if (res.status === 200) {

        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (values.active) {
            array.push(values)
          }
        })
        setCategory([...array])
      }
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'productCode',
    },
    {
      title: 'Mã barcode',
      dataIndex: 'barcode',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Giá tiền',
      dataIndex: 'moneyPrice',
    },
  ];
  const dataTable = [];
  for (let i = 0; i < 46; i++) {
    dataTable.push({
      key: i,
      productName: `Quần áo ${i}`,
      productCode: `QA-${i}`,
      barcode: `${i}`,
      quantity: <Input defaultValue={i} />,
      moneyPrice: `${i}00.000 VNĐ`,
    });
  }
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const [list, setList] = useState('')

  const propsMain = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    async onChange(info) {
      var { status } = info.file;
      if (status !== 'done') {
        status = 'done'
        if (status === 'done') {
          console.log(info.file, info.fileList);
          if (info.fileList && info.fileList.length > 0) {
            var image;
            var array = []
            let formData = new FormData();
            info.fileList.forEach((values, index) => {
              image = values.originFileObj
              formData.append("files", image);   //append the values with key, value pair
            })

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
              console.log(resultsMockup)
              console.log("|||99999999999999999999")
              console.log(resultsMockup[0].data.data[0])
              dispatch({ type: ACTION.LOADING, data: false });
              setList(resultsMockup[0].data.data)
            }
          }
        }
      }
      // if (status !== 'uploading') {
      //     console.log(info.file, info.fileList);
      // }
      // if (status === 'done') {
      //     message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === 'error') {
      //     message.error(`${info.file.name} file upload failed.`);
      // }
    },
    onDrop(e) {
      //   console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const propsMainGroup = {

    async onChange(info) {
      console.log(info)
      console.log("-------------123")
      var { status } = info.file;
      if (status !== 'done') {
        status = 'done'
        if (status === 'done') {
          console.log(info.file, info.fileList);
          if (info.fileList && info.fileList.length > 0) {
            var image;
            var array = []
            let formData = new FormData();
            info.fileList.forEach((values, index) => {
              image = values.originFileObj
              formData.append("files", image);   //append the values with key, value pair
            })

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
              console.log(resultsMockup)
              console.log("|||99999999999999999999")
              console.log(resultsMockup[0].data.data[0])
              dispatch({ type: ACTION.LOADING, data: false });
              setListGroup(resultsMockup[0].data.data)
            }
          }
        }
      }
      // if (status !== 'uploading') {
      //     console.log(info.file, info.fileList);
      // }
      // if (status === 'done') {
      //     message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === 'error') {
      //     message.error(`${info.file.name} file upload failed.`);
      // }
    },
    onDrop(e) {
      //   console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const apiAllWarrantyData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllWarranty();
      console.log(res)
      if (res.status === 200) {
        setWarranty(res.data.data)
      }
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const getWarehouse = async () => {
    try {
      const res = await apiAllInventory()
      if (res.status === 200) {
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (values.active) {
            array.push(values)
          }
        })
        setWarehouse([...array])
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    apiAllWarrantyData();
  }, []);
  const data = form.getFieldValue()
  // data.supplier = supplier && supplier.length > 0 ? supplier[0].supplier_id : ''
  data.productType = category && category.length > 0 ? category[0].category_id : ''
  // data.policy = warranty && warranty.length > 0 ? warranty[0].name : ''

  const [productPrice, setProductPrice] = useState('')
  const onChangeProductPrice = (e) => {
    setProductPrice(e)
  }
  const [productName, setProductName] = useState("")
  const onChangeProductName = (e) => {
    setProductName(e.target.value)
  }
  // const [dynamic, setDynamic] = useState([{
  //   options: '',
  //   values: [],
  // }])



  const openNotificationDynamic = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description:
        `Tối đa chỉ tạo 2 variant.`,
    });
  };

  const openNotificationDynamicDeleteSuccess = () => {
    notification.success({
      message: 'Thành công',
      description:
        `Xóa thuộc tính thành công thành công.`,
    });
  };
  const [options, setOptions] = useState([{ array: [] }])

  const [arrayFinish, setArrayFinish] = useState([])
  function handleChangeSelect(value1, index) {
    console.log(`selected ${value1}`);
    // var array = [...dynamic]
    // array[index].values = value1
    // setDynamic([...array])

    var arrayTest = []
    var arrayMini = [...dynamic[index].values]
    value1 && value1.length > 0 && value1.forEach((values3, index3) => {
      var object = {
        title: values3,
        sku: sku ? `${sku}-${values3}` : values3,
        supplier: [],
        price: 0,
        regular_price: 0,
        sale_price: 0,
        active: true
      }
      arrayTest.push(object)
    })
    var array = [...dynamic]

    // arrayMini.push(object)
    array[index].values = arrayTest
    setDynamic([...array])
  }
  const [attributes, setAttributes] = useState([])
  function handleChangeSelectOptions(value1, index) {
    console.log(`selected ${value1}`);
    var arrayTest = []
    // var arrayMini = [...dynamic[index].values]
    var arrayStart = [...options]


    if (options && options.length > 0) {

      if (index === 1) {

        if (arrayStart.length === 2) {
          value1 && value1.length > 0 && value1.forEach((values3, index3) => {

            var object = {
              title: `${productName}-${values3}`,
              sku: sku ? `${sku}-${values3}` : values3,
              image: [],
              supplier: [],
              retail_price: 0,
              wholesale_price: 0,
            }
            arrayTest.push(object)
          })
        }
        if (arrayStart.length === 3) {
          value1 && value1.length > 0 && value1.forEach((values5, index5) => {
            arrayStart.forEach((values6, index6) => {
              if (index6 === 2) {
                values6.values.forEach((values7, index7) => {
                  var object = {
                    title: `${productName}-${values5}-${values7}`,
                    sku: sku ? `${sku}-${values5}-${values7}` : values5,
                    image: [],
                    supplier: [],
                    retail_price: 0,
                    wholesale_price: 0,
                  }
                  arrayTest.push(object)
                })
              }
            })
          })



        }
      }
      if (index === 2) {

        if (arrayStart.length === 2) {
          value1 && value1.length > 0 && value1.forEach((values3, index3) => {

            var object = {
              title: `${productName}-${values3}`,
              sku: sku ? `${sku}-${values3}` : values3,
              image: [],
              supplier: [],
              retail_price: 0,
              wholesale_price: 0,
            }
            arrayTest.push(object)
          })
        }
        if (arrayStart.length === 3) {

          arrayStart.forEach((values3, index3) => {
            if (index3 === 1) {
              values3.values.forEach((values5, index5) => {
                value1.forEach((values4, index4) => {
                  var object = {
                    title: `${productName}-${values5}-${values4}`,
                    sku: sku ? `${sku}-${values5}-${values4}` : values5,
                    image: [],
                    supplier: [],
                    retail_price: 0,
                    wholesale_price: 0,
                  }
                  arrayTest.push(object)
                })
              })
            }
          })
        }

      }
      var arrayNew = [...options]
      arrayNew[0].array = arrayTest;
      setOptions([...arrayNew])
      var array = [...options]
      array[index].values = value1
      setOptions([...array])
    } else {
      arrayStart[0].array = []
      setOptions([...arrayStart])
    }
  }
  const onClickDelete = (index) => {
    var array = [...dynamic]
    array.splice(index, 1)
    console.log(array)
    console.log("+++")
    openNotificationDynamicDeleteSuccess()
    setDynamic([...array])
  }

  const onChangeTitle = (e, index, index1, values1) => {
    var array = [...dynamic]

  }

  function onChangeSwitch(e, index, index1) {
    console.log(`switch to ${e}`);
    var array = [...dynamic]
    array[index].values[index1].active = e;

    setDynamic([...array])
  }



  useEffect(() => {
    apiAllSupplierData();
  }, []);
  useEffect(() => {
    getWarehouse()
    apiAllCategoryData();
  }, []);

  return (
    <UI>
      <div className={styles["product_manager"]}>
        <Link className={styles["product_manager_title"]} to="/product/6">

          <ArrowLeftOutlined style={{ color: 'black' }} />
          <div className={styles["product_manager_title_product"]}>
            Thêm mới sản phẩm
          </div>

        </Link>
        <Tabs style={{ width: '100%' }} defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Sản phẩm đơn" key="1">
            <SingleProduct category={category} supplier={supplier} warranty={warranty} warehouse={warehouse} />
          </TabPane>
          <TabPane tab="Sản phẩm đa nhóm" key="2">

            <GroupProduct category={category} supplier={supplier} warranty={warranty} warehouse={warehouse} />

          </TabPane>
          <TabPane tab="Quét để nhập" key="3">
            <div style={{ width: '100%', marginTop: '1rem', border: '1px solid rgb(243, 234, 234)' }}>
              <Table rowKey="_id" bordered rowSelection={rowSelection} columns={columns} dataSource={dataTable} scroll={{ y: 500 }} />
            </div>
            <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Button style={{ width: '7.5rem' }} htmlType="submit" type="primary">
                Thêm
              </Button>
            </div>
          </TabPane>
        </Tabs>
      </div>

    </UI >
  );
}
