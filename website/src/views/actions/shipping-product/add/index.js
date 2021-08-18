import UI from "../../../../components/Layout/UI";
import styles from "./../add/add.module.scss";
import React, { useEffect, useState } from "react";
import { Select, Button, Input, Form, Row, Col, DatePicker, Popover, Table, Modal, Drawer, notification, AutoComplete, InputNumber, Radio } from "antd";
import { Link, useHistory } from "react-router-dom";
import { ArrowLeftOutlined, AudioOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined } from "@ant-design/icons";
import { getAllBranch } from "../../../../apis/branch";
import { apiSearchProduct, apiProductSeller } from "../../../../apis/product";
import { addDelivery } from "../../../../apis/delivery";
import { useDispatch } from "react-redux";
import { apiAllInventory } from "../../../../apis/inventory";
const { Option } = Select;
const { Search } = Input;
export default function ShippingProduct() {
  const [visible, setVisible] = useState(false)
  const [modal2Visible, setModal2Visible] = useState(false)
  const [modal3Visible, setModal3Visible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [selectedRowKeysMain, setSelectedRowKeysMain] = useState([])
  const [branchList, setBranchList] = useState([])
  const [deliveryFlow, setDeliveryFlow] = useState({ from: "", fromtype: "BRANCH", to: "", totype: "BRANCH" })
  const [warehouseList, setWarehouseList] = useState([])
  const [productList, setProductList] = useState([])
  const [productDelivery, setProductDelivery] = useState([])
  const [options, setOptions] = useState([])
  const history = useHistory()
  const dispatch = useDispatch()

  const onFinish = async (values) => {
    var productSend = []
    var success = true
    productDelivery.forEach(e => {
      if (success)
        if (e.variants) {
          e.variants.forEach(variant => {
            if (variant.quantity <= variant.available_stock_quantity)
              productSend.push({ ...variant, product_id: e.product_id })
            else {
              notification.error({ message: "Thất bại!", description: "Số lượng vượt quá số lượng hiện có" })
              success = false
              return;
            }
          })
        }
        else {
          if (e.quantity <= e.available_stock_quantity)
            productSend.push(e)
          else {
            notification.error({ message: "Thất bại!", description: "Số lượng vượt quá số lượng hiện có" })
            success = false
            return;
          }
        }
    })
    if (success) {
      try {
        dispatch({ type: 'LOADING', data: true })
        const obj = {
          "type": `${deliveryFlow.fromtype}-${deliveryFlow.totype}`,
          "user_ship": values.from,
          "user_receive": values.to,
          "from": values.from,
          "to": values.to,
          "products": productSend,
          note: values.note,
          tag: values.tag
        }
        const res = await addDelivery(obj)
        if (res.status == 200) {
          notification.success({ message: "Thành công", description: "Thêm phiếu chuyển hàng thành công" })
          history.push("/shipping-product/9")
        }
        dispatch({ type: 'LOADING', data: false })
      }
      catch (e) {
        console.log(e);
        notification.error({ message: "Thất bại", description: "Thêm phiếu chuyển hàng thất bại" })
        dispatch({ type: 'LOADING', data: false })
      }
    }
  };
  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm sản phẩm thành công',
    });
  };
  const onClickAddProduct = () => {
    setVisible(false)
    openNotification()
  }
  const columns = [
    {
      title: 'STT',
      width: 150,
      render(data, record, index) {
        return index + 1
      }
    },
    {
      title: 'Mã hàng',
      dataIndex: 'sku',
      width: 150,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: 'Tồn kho',
      width: 150,
      render(data) {
        return data.quantity || data.available_stock_quantity
      }
    },
    {
      title: 'Số lượng',
      key: 'deliveryQuantity',
      width: 150,
    },
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   width: 150,
    // },
  ];
  const columnsAddProduct = [
    {
      title: 'STT',
      dataIndex: 'stt',
      width: 150,
    },
    {
      title: 'Mã hàng',
      dataIndex: 'productCode',
      width: 150,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      width: 150,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'inventory',
      width: 150,
    },
    {
      title: 'Số lượng',
      dataIndex: 'available_stock_quantity',
      width: 150,
    },
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   width: 150,
    // },
  ];
  const columnsVariant = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      render(data) {
        return <img src={data[0]} width="80px" />
      }
    },
    {
      title: 'SKU',
      dataIndex: "sku"
    },
    {
      title: 'Giá nhập',
      dataIndex: 'import_price'
    },
    {
      title: 'Giá cơ bản',
      dataIndex: "base_price"
    },
    {
      title: 'Giá bán',
      dataIndex: "sale_price"
    },
    {
      title: 'Số lượng tồn',
      dataIndex: "available_stock_quantity"
    },
    {
      title: 'Số lượng chuyển',
      key: 'variantsNumber',
    },
  ]
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      stt: i,
      productCode: <Link to="/actions/shipping-product/view/9">{`DHN ${i}`}</Link>,
      productName: `Sản phẩm ${i}`,
      inventory: i,
      quantity: `Số lượng ${i}`,
      //   action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      //     {/* <Link style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></Link> */}
      //     <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      //   </div>
    });
  }
  const dataAddProuct = [];
  for (let i = 0; i < 46; i++) {
    dataAddProuct.push({
      key: i,
      stt: i,
      productCode: `DHN ${i}`,
      productName: `Sản phẩm ${i}`,
      inventory: i,
      quantity: <Input placeholder="Nhâp số lượng" />,
      // action: <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      //   <div onClick={() => modal3VisibleModal(true)} style={{ marginRight: '0.5rem' }}><EditOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#0500E8' }} /></div>
      //   <div><DeleteOutlined style={{ fontSize: '1.25rem', cursor: 'pointer', color: '#E50000' }} /></div>
      // </div>
    });
  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  function onChange(date, dateString) {
    console.log(date, dateString);
  }
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1890ff',
      }}
    />
  );
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }
  const modal3VisibleModal = (modal3Visible) => {
    setModal3Visible(modal3Visible)
  }
  const onSearch = value => console.log(value);
  const onSearchAddProduct = value => console.log(value);
  const content = (
    <div>
      <div>Gợi ý 1</div>
      <div>Gợi ý 2</div>
    </div>
  );
  const onSelectChangeMain = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeysMain(selectedRowKeys)
  };
  const rowSelectionMain = {
    selectedRowKeysMain,
    onChange: onSelectChangeMain,
  };
  const onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const onFinishUpdateQuantity = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailedUpdateQuantity = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const getBranch = async () => {
    try {
      const res = await getAllBranch()
      if (res.status == 200) {
        setBranchList(res.data.data)
      }
    }
    catch (e) {
      console.log(e);

    }
  }
  const getWarehouse = async () => {
    try {
      const res = await apiAllInventory()
      if (res.status == 200) {
        setWarehouseList(res.data.data)
      }
    }
    catch (e) {
      console.log(e);

    }
  }
  const getProductList = async params => {
    try {
      const res = await apiProductSeller(params && params)
      if (res.status == 200) {
        setProductList(res.data.data)
      }
    }
    catch (e) {
      console.log(e);
    }
  }
  const handleSearch = async (value) => {
    const res = await apiProductSeller({ keyword: value, page: 1, page_size: 20 })
    if (res.status == 200) {
      res.data.data.length > 0 ? setOptions(searchResult(res.data.data)) : setOptions([])
    }
  };

  const searchResult = (query) => {
    return query
      .map((_, idx) => {
        return {
          value: JSON.stringify(_),
          label: (
            <div
              style={{
                display: 'flex',
                // justifyContent: 'space-between',
              }}
            >
              <img src={_.image[0]} width="100px" style={{ marginRight: 20 }} />
              <span>{_.name}</span>
              {/* <span>{_.sale_price}</span> */}
            </div>
          ),
        };
      });
  }

  const onSelect = (value) => {
    console.log(JSON.parse(value));
    setProductDelivery([...productDelivery, JSON.parse(value)])
  };
  useEffect(() => {
    getWarehouse()
    getBranch()
  }, [])
  useEffect(() => {
    if (history.location.state)
      setProductDelivery(history.location.state)
  }, [])
  return (
    <UI>
      <div className={styles["supplier_add"]}>
        <Link className={styles["supplier_add_back_parent"]} style={{ borderBottom: '1px solid rgb(233, 220, 220)', paddingBottom: '1rem' }} to="/shipping-product/9">

          <ArrowLeftOutlined style={{ fontWeight: '600', fontSize: '1rem', color: 'black' }} />
          <div className={styles["supplier_add_back"]}>Tạo phiếu chuyển hàng</div>

        </Link>

        <Form
          style={{}}
          className={styles["supplier_add_content"]}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >

          <div style={{ display: 'flex', marginBottom: '0.75rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin phiếu chuyển</div>

          <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Chuyển từ:&nbsp;
                  <Radio.Group defaultValue="BRANCH" value={deliveryFlow.fromtype} onChange={(e) => setDeliveryFlow({ ...deliveryFlow, fromtype: e.target.value })}>
                    <Radio value="BRANCH">Chi nhánh</Radio>
                    <Radio value="WAREHOUSE">Kho</Radio>
                  </Radio.Group>
                </div>
                <Form.Item
                  name="from"

                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  {
                    deliveryFlow.fromtype === "BRANCH" ? <Select placeholder="Chọn nơi nhận" showSearch filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                      optionFilterProp="children"
                    >
                      {

                        branchList.map(e => <Option value={e.branch_id}>{e.name}</Option>)
                      }
                    </Select> :
                      <Select placeholder="Chọn nơi nhận" showSearch filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                        optionFilterProp="children"
                      >
                        {
                          warehouseList.map(e => <Option value={e.warehouse_id}>{e.name}</Option>)
                        }
                      </Select>
                  }
                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Ghi chú</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="note"
                >
                  <Input placeholder="Nhập ghi chú" />
                </Form.Item>
              </div>
            </Col>
          </Row>
          <Row style={{ borderBottom: '1px solid rgb(236, 226, 226)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Nhận ở:&nbsp;
                  <Radio.Group defaultValue="BRANCH" value={deliveryFlow.totype} onChange={(e) => setDeliveryFlow({ ...deliveryFlow, totype: e.target.value })}>
                    <Radio value="BRANCH">Chi nhánh</Radio>
                    <Radio value="WAREHOUSE">Kho</Radio>
                  </Radio.Group>
                </div>
                <Form.Item
                  name="to"

                  hasFeedback
                  rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                >
                  {
                    deliveryFlow.totype === "BRANCH" ? <Select placeholder="Chọn nơi nhận" showSearch filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                      optionFilterProp="children"
                    >
                      {

                        branchList.map(e => <Option value={e.branch_id}>{e.name}</Option>)
                      }
                    </Select> :

                      <Select placeholder="Chọn nơi nhận" showSearch filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                        optionFilterProp="children"
                      >
                        {

                          warehouseList.map(e => <Option value={e.branch_id}>{e.name}</Option>)
                        }
                      </Select>
                  }

                </Form.Item>
              </div>
            </Col>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600' }}>Tag</div>
                <Form.Item

                  className={styles["supplier_add_content_supplier_code_input"]}
                  name="tag"
                >
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}>
                  </Select>
                </Form.Item>
              </div>
            </Col>
          </Row>


          <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', color: 'black', fontWeight: '600', fontSize: '1rem' }}>Thông tin sản phẩm</div>

          <AutoComplete
            dropdownMatchSelectWidth={252}
            style={{
              width: '100%',
            }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
            onFocus={handleSearch}
          >
            <div style={{ display: 'flex', margin: '1rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <Search style={{ width: '100%' }} placeholder="Tìm kiếm theo mã, theo tên" onSearch={onSearch} enterButton /></div>
          </AutoComplete>
          {/*
          <div onClick={showDrawer} style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}><Button type="primary" style={{ width: '7.5rem', display: 'flex', justifyContent: 'center' }}>Thêm sản phẩm</Button></div>
        */

          }
          <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={12} lg={12} xl={12}>
              <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} xs={24} sm={24} md={24} lg={24} xl={6}>
                  <Button icon={<FileExcelOutlined />} style={{ width: '7.5rem', backgroundColor: '#004F88', color: 'white' }}>Nhập excel</Button>
                </Col>

              </Row>
            </Col>
          </Row>

          <Row style={{ width: '100%' }}>
            <div style={{ marginBottom: '0.5rem', color: 'black', fontWeight: '600', fontSize: 16 }}>Danh sách sản phẩm chuyển</div>
          </Row>
          <div style={{ border: '1px solid rgb(236, 226, 226)', width: '100%' }}>
            <Table rowSelection={rowSelectionMain}
              expandable={{
                expandedRowRender: (record, indexRecord) => <Table
                  size="small"
                  pagination={false}
                  dataSource={record.variants}
                  columns={columnsVariant.map((e, indexVariant) => {
                    if (e.key == 'variantsNumber')
                      return {
                        ...e, render(text, data, i) {
                          return <InputNumber onBlur={(val) => {
                            productDelivery[indexRecord].variants[i].quantity = parseInt(val.target.value)
                          }} />
                        }
                      }
                    return e

                  })}
                />,
                rowExpandable: record => record.variants,
              }}
              rowKey="_id"
              columns={columns.map((e) => {
                if (e.key === 'deliveryQuantity')
                  return {
                    ...e, render(data, record, index) {
                      return !data.has_variable && <InputNumber onBlur={(e) => {
                        productDelivery[index].quantity = parseInt(e.target.value)
                      }
                      } />
                    }
                  }
                return e
              })}
              dataSource={productDelivery}
              scroll={{ y: 500 }} />
          </div>
          {
            selectedRowKeysMain && selectedRowKeysMain.length > 0 ? (<div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Button type="primary" danger style={{ width: '7.5rem' }}>Xóa sản phẩm</Button></div>) : ('')
          }
          <Row style={{ marginTop: '1rem' }} className={styles["supplier_add_content_supplier_button"]}>
            {/* <Col style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item >
                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>
              </Form.Item>
            </Col> */}
            <Col style={{ width: '100%', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>
              <Form.Item>
                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit" >
                  Tạo
                </Button>
              </Form.Item>
            </Col>
          </Row>

        </Form>
        <Drawer
          title="Thêm sản phẩm"
          width={720}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
            <Popover placement="bottomLeft" content={content} trigger="click">
              <div style={{ display: 'flex', margin: '1rem 0', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <Search style={{ width: '100%' }} placeholder="Tìm kiếm theo mã, theo tên" onSearch={onSearchAddProduct} enterButton /></div>
            </Popover>
            <div style={{ border: '1px solid rgb(236, 226, 226)', width: '100%' }}>
              <Table rowSelection={rowSelection} columns={columnsAddProduct} dataSource={dataAddProuct} scroll={{ y: 500 }} />

            </div>
          </div>
          <Row style={{}} className={styles["supplier_add_content_supplier_button"]}>
            {/* <Col onClick={onClose} style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>

              <Button style={{ width: '7.5rem' }} type="primary" danger>
                Hủy
              </Button>

            </Col> */}
            <Col onClick={onClickAddProduct} style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>

              <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                Xác nhận
              </Button>

            </Col>
          </Row>

        </Drawer>
        <Modal
          title="Cập nhật số lượng sản phẩm"
          centered
          footer={null}

          visible={modal3Visible}
          onOk={() => modal3VisibleModal(false)}
          onCancel={() => modal3VisibleModal(false)}
        >
          <Form
            style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Số lượng</div>
            <Form.Item
              style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}
              // label="Username"
              name="quantity"
              rules={[{ required: true, message: 'Giá trị rỗng!' }]}
            >
              <Input placeholder="Nhập số lượng cập nhật" />
            </Form.Item>
            <Row style={{}} className={styles["supplier_add_content_supplier_button"]}>
              {/* <Col onClick={() => modal2VisibleModal(false)} style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>

                <Button style={{ width: '7.5rem' }} type="primary" danger>
                  Hủy
                </Button>

              </Col> */}
              <Col onClick={() => modal3VisibleModal(false)} style={{ width: '100%', marginTop: '1rem', marginLeft: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }} xs={24} sm={24} md={5} lg={4} xl={3}>

                <Button style={{ width: '7.5rem' }} type="primary" htmlType="submit">
                  Xác nhận
                </Button>

              </Col>
            </Row>
          </Form>
        </Modal>

      </div>
    </UI>
  );
}
