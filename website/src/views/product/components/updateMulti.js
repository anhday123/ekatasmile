
import { Drawer, Col, Row, Select, Form, Button, Input, InputNumber } from "antd"
const { Option } = Select
export default function UpdateMultiProduct(props) {
    const { onCloseUpdate, visibleUpdate, arrayUpdate, warranty, supplier, category, onCloseUpdateFunc, UploadImgChild, styles, UploadImg } = props
    return (
        <Drawer
            title="Cập nhật thông tin sản phẩm"
            width={1000}
            onClose={onCloseUpdate}
            visible={visibleUpdate}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                <div
                    style={{
                        textAlign: 'right',
                    }}
                >
                    <Button
                        onClick={() => onCloseUpdateFunc(2)}
                        type="primary"
                    >
                        Cập nhật
                    </Button>
                </div>
            }
        >
            {arrayUpdate &&
                arrayUpdate.length > 0 &&
                arrayUpdate.map((values, index) => {
                    const obj = Object.keys(values)
                    if (index === 0) {
                        return values &&
                            values.attributes &&
                            values.attributes.length > 0 ? (
                            <Form
                                style={{
                                    borderBottom: '1px solid grey',
                                    paddingBottom: '1.5rem',
                                }}
                                className={styles['supplier_add_content']}
                                // form={form}
                                layout="vertical"
                                initialValues={values}
                            >
                                <Row
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    {obj.map((data) => {
                                        // if (data === 'suppliers') {
                                        //   const InputName = () => <Select mode="multiple" defaultValue={values[data].map(e => e.supplier_id)}
                                        //     showSearch
                                        //     style={{ width: '100%' }}
                                        //     placeholder="Chọn nhà cung cấp"
                                        //     optionFilterProp="children"

                                        //     filterOption={(input, option) =>
                                        //       option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        //     }
                                        //     onChange={(event) => {
                                        //       // const value =
                                        //       //   event.target.value;
                                        //       const indexWarranty = values[data].findIndex(e => e.supplier_id === event)
                                        //       arrayUpdate[index][data][indexWarranty] =
                                        //         event;
                                        //     }}>
                                        //     {
                                        //       supplier && supplier.length > 0 && supplier.map((values, index) => {
                                        //         return (
                                        //           <Option value={values.supplier_id}>{values.name}</Option>
                                        //         )
                                        //       })
                                        //     }
                                        //   </Select>
                                        //   return (
                                        //     <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                        //       <div>
                                        //         <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Nhà cung cấp</div>
                                        //         <InputName />

                                        //       </div>
                                        //     </Col>
                                        //   )
                                        // }
                                        if (data === 'name') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        {/* <Form.Item
    
                                    label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                    name="phone"
                                    rules={[{ required: true, message: "Giá trị rỗng!" }]}
                                  > */}
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Tên sản phẩm
                                                        </div>

                                                        <InputName />
                                                        {/* </Form.Item> */}
                                                    </div>
                                                </Col>
                                            )
                                        }

                                        if (data === 'length') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        {/* <Form.Item
    
                                    label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                                    name="phone"
                                    rules={[{ required: true, message: "Giá trị rỗng!" }]}
                                  > */}
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Chiều dài
                                                        </div>

                                                        <InputName />
                                                        {/* </Form.Item> */}
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'width') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Chiều rộng
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'height') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Chiều cao
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'weight') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Cân nặng
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }

                                        if (data === 'sku') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            SKU
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }

                                        if (data === 'category') {
                                            const InputName = () => (
                                                <Select
                                                    defaultValue={
                                                        values[data].category_id
                                                    }
                                                    showSearch
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    placeholder="Select a person"
                                                    optionFilterProp="children"
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onChange={(event) => {
                                                        // const value =
                                                        //   event.target.value;
                                                        arrayUpdate[index][
                                                            data
                                                        ] = event
                                                    }}
                                                >
                                                    {category &&
                                                        category.length >
                                                        0 &&
                                                        category.map(
                                                            (
                                                                values,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <Option
                                                                        value={
                                                                            values.category_id
                                                                        }
                                                                    >
                                                                        {
                                                                            values.name
                                                                        }
                                                                    </Option>
                                                                )
                                                            }
                                                        )}
                                                </Select>
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Loại sản phẩm
                                                        </div>
                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                    })}
                                    {values &&
                                        values.attributes &&
                                        values.attributes.length > 0 &&
                                        values.attributes.map(
                                            (values20, index20) => {
                                                const objChild =
                                                    Object.keys(values20)
                                                return (
                                                    <div>
                                                        <Row
                                                            style={{
                                                                display:
                                                                    'flex',
                                                                justifyContent:
                                                                    'space-between',
                                                                alignItems:
                                                                    'center',
                                                                width: '100%',
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    color: 'black',
                                                                    fontSize:
                                                                        '1rem',
                                                                    marginTop:
                                                                        '1rem',
                                                                    fontWeight:
                                                                        '600',
                                                                }}
                                                            >
                                                                {/* <b
                                    style={{
                                      color: 'red',
                                    }}
                                  >
                                    *
                                  </b> */}
                                                                {/* Seller (
                                  {
                                    values20.title
                                  }
                                  ) */}
                                                            </div>
                                                            <Row
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    justifyContent:
                                                                        'space-between',
                                                                    alignItems:
                                                                        'center',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                                {objChild.map(
                                                                    (
                                                                        dataChild
                                                                    ) => {
                                                                        if (
                                                                            dataChild ===
                                                                            'retail_price'
                                                                        ) {
                                                                            const InputName =
                                                                                () => (
                                                                                    <InputNumber
                                                                                        style={{
                                                                                            width: '100%',
                                                                                        }}
                                                                                        defaultValue={
                                                                                            values
                                                                                                .attributes[
                                                                                                index20
                                                                                            ]
                                                                                                .retail_price
                                                                                        }
                                                                                        onChange={(
                                                                                            event
                                                                                        ) => {
                                                                                            // const value =
                                                                                            //   event.target.value;

                                                                                            arrayUpdate[
                                                                                                index
                                                                                            ].attributes[
                                                                                                index20
                                                                                            ].retail_price =
                                                                                                isNaN(
                                                                                                    event
                                                                                                )
                                                                                                    ? 0
                                                                                                    : event ===
                                                                                                        0
                                                                                                        ? 0
                                                                                                        : event
                                                                                        }}
                                                                                        formatter={(
                                                                                            value
                                                                                        ) =>
                                                                                            `${value}`.replace(
                                                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                                                ','
                                                                                            )
                                                                                        }
                                                                                        parser={(
                                                                                            value
                                                                                        ) =>
                                                                                            value.replace(
                                                                                                /\$\s?|(,*)/g,
                                                                                                ''
                                                                                            )
                                                                                        }
                                                                                    // onChange={onChange}
                                                                                    />
                                                                                )
                                                                            return (
                                                                                <Col
                                                                                    style={{
                                                                                        width: '100%',
                                                                                    }}
                                                                                    xs={
                                                                                        24
                                                                                    }
                                                                                    sm={
                                                                                        24
                                                                                    }
                                                                                    md={
                                                                                        11
                                                                                    }
                                                                                    lg={
                                                                                        11
                                                                                    }
                                                                                    xl={
                                                                                        7
                                                                                    }
                                                                                >
                                                                                    <div>
                                                                                        <div
                                                                                            style={{
                                                                                                color: 'black',
                                                                                                fontWeight:
                                                                                                    '600',
                                                                                                marginBottom:
                                                                                                    '0.5rem',
                                                                                                marginTop:
                                                                                                    '1rem',
                                                                                            }}
                                                                                        >
                                                                                            Giá
                                                                                            bán
                                                                                        </div>

                                                                                        <InputName />
                                                                                    </div>
                                                                                </Col>
                                                                            )
                                                                        }
                                                                        if (
                                                                            dataChild ===
                                                                            'image'
                                                                        ) {
                                                                            const InputName =
                                                                                () => (
                                                                                    <UploadImgChild
                                                                                        imageUrl={
                                                                                            values20[
                                                                                            dataChild
                                                                                            ]
                                                                                        }
                                                                                        indexUpdate={
                                                                                            values._id
                                                                                        }
                                                                                        index20={
                                                                                            index20
                                                                                        }
                                                                                    />
                                                                                )
                                                                            return (
                                                                                <Col
                                                                                    style={{
                                                                                        width: '100%',
                                                                                    }}
                                                                                    xs={
                                                                                        24
                                                                                    }
                                                                                    sm={
                                                                                        24
                                                                                    }
                                                                                    md={
                                                                                        11
                                                                                    }
                                                                                    lg={
                                                                                        11
                                                                                    }
                                                                                    xl={
                                                                                        7
                                                                                    }
                                                                                >
                                                                                    <div>
                                                                                        {/* <Form.Item
  
                  label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                  name="phone"
                  rules={[{ required: true, message: "Giá trị rỗng!" }]}
                > */}
                                                                                        <div
                                                                                            style={{
                                                                                                color: 'black',
                                                                                                fontWeight:
                                                                                                    '600',
                                                                                                marginBottom:
                                                                                                    '0.5rem',
                                                                                                marginTop:
                                                                                                    '1rem',
                                                                                            }}
                                                                                        >
                                                                                            Ảnh
                                                                                            sản
                                                                                            phẩm
                                                                                        </div>

                                                                                        <InputName />
                                                                                        {/* </Form.Item> */}
                                                                                    </div>
                                                                                </Col>
                                                                            )
                                                                        }

                                                                        if (
                                                                            dataChild ===
                                                                            'wholesale_price'
                                                                        ) {
                                                                            const InputName =
                                                                                () => (
                                                                                    <InputNumber
                                                                                        style={{
                                                                                            width: '100%',
                                                                                        }}
                                                                                        defaultValue={
                                                                                            values
                                                                                                .attributes[
                                                                                                index20
                                                                                            ]
                                                                                                .wholesale_price
                                                                                        }
                                                                                        onChange={(
                                                                                            event
                                                                                        ) => {
                                                                                            // const value =
                                                                                            //   event.target.value;

                                                                                            arrayUpdate[
                                                                                                index
                                                                                            ].attributes[
                                                                                                index20
                                                                                            ].wholesale_price =
                                                                                                isNaN(
                                                                                                    event
                                                                                                )
                                                                                                    ? 0
                                                                                                    : event ===
                                                                                                        0
                                                                                                        ? 0
                                                                                                        : event
                                                                                        }}
                                                                                        formatter={(
                                                                                            value
                                                                                        ) =>
                                                                                            `${value}`.replace(
                                                                                                /\B(?=(\d{3})+(?!\d))/g,
                                                                                                ','
                                                                                            )
                                                                                        }
                                                                                        parser={(
                                                                                            value
                                                                                        ) =>
                                                                                            value.replace(
                                                                                                /\$\s?|(,*)/g,
                                                                                                ''
                                                                                            )
                                                                                        }
                                                                                    // onChange={onChange}
                                                                                    />
                                                                                )
                                                                            return (
                                                                                <Col
                                                                                    style={{
                                                                                        width: '100%',
                                                                                    }}
                                                                                    xs={
                                                                                        24
                                                                                    }
                                                                                    sm={
                                                                                        24
                                                                                    }
                                                                                    md={
                                                                                        11
                                                                                    }
                                                                                    lg={
                                                                                        11
                                                                                    }
                                                                                    xl={
                                                                                        7
                                                                                    }
                                                                                >
                                                                                    <div>
                                                                                        <div
                                                                                            style={{
                                                                                                color: 'black',
                                                                                                fontWeight:
                                                                                                    '600',
                                                                                                marginBottom:
                                                                                                    '0.5rem',
                                                                                                marginTop:
                                                                                                    '1rem',
                                                                                            }}
                                                                                        >
                                                                                            Giá
                                                                                            cơ
                                                                                            bản
                                                                                        </div>

                                                                                        <InputName />
                                                                                    </div>
                                                                                </Col>
                                                                            )
                                                                        }
                                                                    }
                                                                )}
                                                            </Row>
                                                        </Row>

                                                        <Row
                                                            style={{
                                                                display:
                                                                    'flex',
                                                                marginTop:
                                                                    '1rem',
                                                                justifyContent:
                                                                    'space-between',
                                                                alignItems:
                                                                    'center',
                                                                width: '100%',
                                                            }}
                                                        >
                                                            {
                                                                <div>
                                                                    <div
                                                                        style={{
                                                                            color: 'black',
                                                                            fontSize:
                                                                                '1rem',
                                                                            fontWeight:
                                                                                '600',
                                                                        }}
                                                                    >
                                                                        {/* <b
                                        style={{
                                          color: 'red',
                                        }}
                                      >
                                        *
                                      </b>
                                      Supplier
                                      (
                                      {
                                        values20.title
                                      }
                                      ) */}
                                                                    </div>
                                                                    <Row
                                                                        style={{
                                                                            display:
                                                                                'flex',
                                                                            justifyContent:
                                                                                'space-between',
                                                                            alignItems:
                                                                                'center',
                                                                            width: '100%',
                                                                        }}
                                                                    >
                                                                        {values20.supplier &&
                                                                            values20
                                                                                .supplier
                                                                                .length >
                                                                            0 &&
                                                                            values20.supplier.map(
                                                                                (
                                                                                    values30,
                                                                                    index30
                                                                                ) => {
                                                                                    const objMini =
                                                                                        Object.keys(
                                                                                            values30
                                                                                        )
                                                                                    const InputNameQuantity =
                                                                                        () => (
                                                                                            <InputNumber
                                                                                                style={{
                                                                                                    width: '100%',
                                                                                                }}
                                                                                                defaultValue={
                                                                                                    values
                                                                                                        .attributes[
                                                                                                        index20
                                                                                                    ]
                                                                                                        .supplier[
                                                                                                        index30
                                                                                                    ]
                                                                                                        .quantity
                                                                                                }
                                                                                                onChange={(
                                                                                                    event
                                                                                                ) => {
                                                                                                    // const value =
                                                                                                    //   event.target.value;

                                                                                                    arrayUpdate[
                                                                                                        index
                                                                                                    ].attributes[
                                                                                                        index20
                                                                                                    ].supplier[
                                                                                                        index30
                                                                                                    ].quantity =
                                                                                                        isNaN(
                                                                                                            event
                                                                                                        )
                                                                                                            ? 0
                                                                                                            : event ===
                                                                                                                0
                                                                                                                ? 0
                                                                                                                : event
                                                                                                }}
                                                                                                formatter={(
                                                                                                    value
                                                                                                ) =>
                                                                                                    `${value}`.replace(
                                                                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                                                                        ','
                                                                                                    )
                                                                                                }
                                                                                                parser={(
                                                                                                    value
                                                                                                ) =>
                                                                                                    value.replace(
                                                                                                        /\$\s?|(,*)/g,
                                                                                                        ''
                                                                                                    )
                                                                                                }
                                                                                            // onChange={onChange}
                                                                                            />
                                                                                        )
                                                                                    const InputNameImport =
                                                                                        () => (
                                                                                            <InputNumber
                                                                                                style={{
                                                                                                    width: '100%',
                                                                                                }}
                                                                                                defaultValue={
                                                                                                    values
                                                                                                        .attributes[
                                                                                                        index20
                                                                                                    ]
                                                                                                        .supplier[
                                                                                                        index30
                                                                                                    ]
                                                                                                        .import_price
                                                                                                }
                                                                                                onChange={(
                                                                                                    event
                                                                                                ) => {
                                                                                                    // const value =
                                                                                                    //   event.target.value;

                                                                                                    arrayUpdate[
                                                                                                        index
                                                                                                    ].attributes[
                                                                                                        index20
                                                                                                    ].supplier[
                                                                                                        index30
                                                                                                    ].import_price =
                                                                                                        isNaN(
                                                                                                            event
                                                                                                        )
                                                                                                            ? 0
                                                                                                            : event ===
                                                                                                                0
                                                                                                                ? 0
                                                                                                                : event
                                                                                                }}
                                                                                                formatter={(
                                                                                                    value
                                                                                                ) =>
                                                                                                    `${value}`.replace(
                                                                                                        /\B(?=(\d{3})+(?!\d))/g,
                                                                                                        ','
                                                                                                    )
                                                                                                }
                                                                                                parser={(
                                                                                                    value
                                                                                                ) =>
                                                                                                    value.replace(
                                                                                                        /\$\s?|(,*)/g,
                                                                                                        ''
                                                                                                    )
                                                                                                }
                                                                                            // onChange={onChange}
                                                                                            />
                                                                                        )
                                                                                    const InputNameSupplier =
                                                                                        () => (
                                                                                            <Select
                                                                                                mode="multiple"
                                                                                                defaultValue={
                                                                                                    values
                                                                                                        .attributes[
                                                                                                        index20
                                                                                                    ]
                                                                                                        .supplier[
                                                                                                        index30
                                                                                                    ]
                                                                                                        .name
                                                                                                }
                                                                                                showSearch
                                                                                                style={{
                                                                                                    width: '100%',
                                                                                                }}
                                                                                                placeholder="Chọn nhà cung cấp"
                                                                                                optionFilterProp="children"
                                                                                                filterOption={(
                                                                                                    input,
                                                                                                    option
                                                                                                ) =>
                                                                                                    option.children
                                                                                                        .toLowerCase()
                                                                                                        .indexOf(
                                                                                                            input.toLowerCase()
                                                                                                        ) >=
                                                                                                    0
                                                                                                }
                                                                                                onChange={(
                                                                                                    event
                                                                                                ) => {
                                                                                                    // const value =
                                                                                                    //   event.target.value;
                                                                                                    const indexSupplierCheck =
                                                                                                        values.attributes[
                                                                                                            index20
                                                                                                        ].supplier.findIndex(
                                                                                                            (
                                                                                                                e
                                                                                                            ) =>
                                                                                                                e.name ===
                                                                                                                event
                                                                                                        )
                                                                                                    arrayUpdate[
                                                                                                        index
                                                                                                    ].attributes[
                                                                                                        index20
                                                                                                    ].supplier[
                                                                                                        index30
                                                                                                    ].name =
                                                                                                        event
                                                                                                }}
                                                                                            >
                                                                                                {supplier &&
                                                                                                    supplier.length >
                                                                                                    0 &&
                                                                                                    supplier.map(
                                                                                                        (
                                                                                                            values,
                                                                                                            index
                                                                                                        ) => {
                                                                                                            return (
                                                                                                                <Option
                                                                                                                    value={
                                                                                                                        values.supplier_id
                                                                                                                    }
                                                                                                                >
                                                                                                                    {
                                                                                                                        values.name
                                                                                                                    }
                                                                                                                </Option>
                                                                                                            )
                                                                                                        }
                                                                                                    )}
                                                                                            </Select>
                                                                                        )

                                                                                    return (
                                                                                        <Row
                                                                                            style={{
                                                                                                display:
                                                                                                    'flex',
                                                                                                justifyContent:
                                                                                                    'space-between',
                                                                                                alignItems:
                                                                                                    'center',
                                                                                                width: '100%',
                                                                                            }}
                                                                                        >
                                                                                            <Col
                                                                                                style={{
                                                                                                    width: '100%',
                                                                                                }}
                                                                                                xs={
                                                                                                    24
                                                                                                }
                                                                                                sm={
                                                                                                    24
                                                                                                }
                                                                                                md={
                                                                                                    11
                                                                                                }
                                                                                                lg={
                                                                                                    11
                                                                                                }
                                                                                                xl={
                                                                                                    7
                                                                                                }
                                                                                            >
                                                                                                <div
                                                                                                    style={{
                                                                                                        color: 'black',
                                                                                                        fontWeight:
                                                                                                            '600',
                                                                                                        marginBottom:
                                                                                                            '0.5rem',
                                                                                                        marginTop:
                                                                                                            '1rem',
                                                                                                    }}
                                                                                                >
                                                                                                    Nhà
                                                                                                    cung
                                                                                                    cấp
                                                                                                    (phiên
                                                                                                    bản)
                                                                                                </div>

                                                                                                <InputNameSupplier />
                                                                                            </Col>
                                                                                            <Col
                                                                                                style={{
                                                                                                    width: '100%',
                                                                                                }}
                                                                                                xs={
                                                                                                    24
                                                                                                }
                                                                                                sm={
                                                                                                    24
                                                                                                }
                                                                                                md={
                                                                                                    11
                                                                                                }
                                                                                                lg={
                                                                                                    11
                                                                                                }
                                                                                                xl={
                                                                                                    7
                                                                                                }
                                                                                            >
                                                                                                <div
                                                                                                    style={{
                                                                                                        color: 'black',
                                                                                                        fontWeight:
                                                                                                            '600',
                                                                                                        marginBottom:
                                                                                                            '0.5rem',
                                                                                                        marginTop:
                                                                                                            '1rem',
                                                                                                    }}
                                                                                                >
                                                                                                    Giá
                                                                                                    nhập
                                                                                                </div>

                                                                                                <InputNameImport />
                                                                                            </Col>
                                                                                            <Col
                                                                                                style={{
                                                                                                    width: '100%',
                                                                                                }}
                                                                                                xs={
                                                                                                    24
                                                                                                }
                                                                                                sm={
                                                                                                    24
                                                                                                }
                                                                                                md={
                                                                                                    11
                                                                                                }
                                                                                                lg={
                                                                                                    11
                                                                                                }
                                                                                                xl={
                                                                                                    7
                                                                                                }
                                                                                            >
                                                                                                <div
                                                                                                    style={{
                                                                                                        color: 'black',
                                                                                                        fontWeight:
                                                                                                            '600',
                                                                                                        marginBottom:
                                                                                                            '0.5rem',
                                                                                                        marginTop:
                                                                                                            '1rem',
                                                                                                    }}
                                                                                                >
                                                                                                    Số
                                                                                                    lượng
                                                                                                </div>

                                                                                                <InputNameQuantity />
                                                                                            </Col>
                                                                                        </Row>
                                                                                    )
                                                                                }
                                                                            )}
                                                                    </Row>
                                                                </div>
                                                            }
                                                        </Row>
                                                    </div>
                                                )
                                            }
                                        )}
                                </Row>
                            </Form>
                        ) : (
                            <Form
                                style={{
                                    borderBottom:
                                        '1px solid rgb(238, 224, 224)',
                                    paddingBottom: '1.5rem',
                                }}
                                className={styles['supplier_add_content']}
                                // form={form}
                                layout="vertical"
                                initialValues={values}
                            >
                                <Row
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    {obj.map((data) => {
                                        if (data === 'image') {
                                            const InputName = () => (
                                                <UploadImg
                                                    imageUrl={values[data]}
                                                    indexUpdate={values._id}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        {/* <Form.Item
    
                        label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                        name="phone"
                        rules={[{ required: true, message: "Giá trị rỗng!" }]}
                      > */}
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Ảnh sản phẩm
                                                        </div>

                                                        <InputName />
                                                        {/* </Form.Item> */}
                                                    </div>
                                                </Col>
                                            )
                                        }

                                        if (data === 'warranty') {
                                            const InputName = () => (
                                                <Select
                                                    defaultValue={values[
                                                        data
                                                    ].map(
                                                        (e) => e.warranty_id
                                                    )}
                                                    mode="multiple"
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    placeholder="Chọn chính sách bảo hành"
                                                    onChange={(event) => {
                                                        // const value =
                                                        //   event.target.value;
                                                        const indexWarranty =
                                                            values[
                                                                data
                                                            ].findIndex(
                                                                (e) =>
                                                                    e.warranty_id ===
                                                                    event
                                                            )
                                                        arrayUpdate[index][
                                                            data
                                                        ][indexWarranty] =
                                                            event
                                                    }}
                                                >
                                                    {warranty &&
                                                        warranty.length >
                                                        0 &&
                                                        warranty.map(
                                                            (values) => (
                                                                <Option
                                                                    value={
                                                                        values.warranty_id
                                                                    }
                                                                >
                                                                    {
                                                                        values.name
                                                                    }
                                                                </Option>
                                                            )
                                                        )}
                                                </Select>
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Chính sách bảo
                                                            hành
                                                        </div>
                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'suppliers') {
                                            const InputName = () => (
                                                <Select
                                                    defaultValue={values.supplier_id}
                                                    showSearch
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    placeholder="Chọn nhà cung cấp"
                                                    optionFilterProp="children"
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                // onChange={(event) => {
                                                //   // const value =
                                                //   //   event.target.value;
                                                //   const indexWarranty =
                                                //     values[
                                                //       data
                                                //     ].findIndex(
                                                //       (e) =>
                                                //         e.supplier_id ===
                                                //         event
                                                //     )
                                                //   arrayUpdate[index][
                                                //     data
                                                //   ][indexWarranty] =
                                                //     event
                                                // }}
                                                >
                                                    {supplier &&
                                                        supplier.length >
                                                        0 &&
                                                        supplier.map(
                                                            (
                                                                values,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <Option
                                                                        value={
                                                                            values.supplier_id
                                                                        }
                                                                    >
                                                                        {
                                                                            values.name
                                                                        }
                                                                    </Option>
                                                                )
                                                            }
                                                        )}
                                                </Select>
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Nhà cung cấp
                                                        </div>
                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'name') {
                                            const InputName = () => (
                                                <Input
                                                    disabled
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        {/* <Form.Item
    
                        label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                        name="phone"
                        rules={[{ required: true, message: "Giá trị rỗng!" }]}
                      > */}
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Tên sản phẩm
                                                        </div>

                                                        <InputName />
                                                        {/* </Form.Item> */}
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        // if (data === 'import_price') {
                                        //   const InputName = () => <InputNumber
                                        //     style={{ width: '100%' }} defaultValue={values[data]}
                                        //     onChange={(event) => {
                                        //       // const value =
                                        //       //   event.target.value;

                                        //       arrayUpdate[index][data] =
                                        //         isNaN(event) ? 0 : event === 0 ? 0 : event;
                                        //     }}
                                        //     formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        //     parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                        //   // onChange={onChange}
                                        //   />
                                        //   return (
                                        //     <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                                        //       <div>

                                        //         <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem', marginTop: '1rem' }}>Giá nhập thuế</div>

                                        //         <InputName />
                                        //       </div>
                                        //     </Col>
                                        //   )
                                        // }
                                        if (data === 'regular_price') {
                                            const InputName = () => (
                                                <InputNumber
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        // const value =
                                                        //   event.target.value;

                                                        arrayUpdate[index][
                                                            data
                                                        ] = isNaN(event)
                                                                ? 0
                                                                : event === 0
                                                                    ? 0
                                                                    : event
                                                    }}
                                                    formatter={(value) =>
                                                        `${value}`.replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ','
                                                        )
                                                    }
                                                    parser={(value) =>
                                                        value.replace(
                                                            /\$\s?|(,*)/g,
                                                            ''
                                                        )
                                                    }
                                                // onChange={onChange}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Giá bán sỉ
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'sale_price') {
                                            const InputName = () => (
                                                <InputNumber
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        // const value =
                                                        //   event.target.value;

                                                        arrayUpdate[index][
                                                            data
                                                        ] = isNaN(event)
                                                                ? 0
                                                                : event === 0
                                                                    ? 0
                                                                    : event
                                                    }}
                                                    formatter={(value) =>
                                                        `${value}`.replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ','
                                                        )
                                                    }
                                                    parser={(value) =>
                                                        value.replace(
                                                            /\$\s?|(,*)/g,
                                                            ''
                                                        )
                                                    }
                                                // onChange={onChange}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Giá bán lẻ
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }

                                        if (data === 'length') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        {/* <Form.Item
    
                        label={<div style={{ color: 'black', fontWeight: '600' }}>Liên hệ</div>}
                        name="phone"
                        rules={[{ required: true, message: "Giá trị rỗng!" }]}
                      > */}
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Chiều dài
                                                        </div>

                                                        <InputName />
                                                        {/* </Form.Item> */}
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'width') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Chiều rộng
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'height') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Chiều cao
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'weight') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Cân nặng
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'barcode') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Mã barcode
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'sku') {
                                            const InputName = () => (
                                                <Input
                                                    disabled
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            SKU
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'quantity') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Số lượng cung
                                                            cấp
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                        if (data === 'unit') {
                                            const InputName = () => (
                                                <Input
                                                    defaultValue={
                                                        values[data]
                                                    }
                                                    onChange={(event) => {
                                                        const value =
                                                            event.target
                                                                .value
                                                        arrayUpdate[index][
                                                            data
                                                        ] = value
                                                    }}
                                                />
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Đơn vị
                                                        </div>

                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }

                                        if (data === 'category') {
                                            const InputName = () => (
                                                <Select
                                                    defaultValue={
                                                        values[data].category_id
                                                    }
                                                    showSearch
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    placeholder="Select a person"
                                                    optionFilterProp="children"
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
                                                        option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                                input.toLowerCase()
                                                            ) >= 0
                                                    }
                                                    onChange={(event) => {
                                                        // const value =
                                                        //   event.target.value;
                                                        arrayUpdate[index][
                                                            data
                                                        ] = event
                                                    }}
                                                >
                                                    {category &&
                                                        category.length >
                                                        0 &&
                                                        category.map(
                                                            (
                                                                values,
                                                                index
                                                            ) => {
                                                                return (
                                                                    <Option
                                                                        value={
                                                                            values.category_id
                                                                        }
                                                                    >
                                                                        {
                                                                            values.name
                                                                        }
                                                                    </Option>
                                                                )
                                                            }
                                                        )}
                                                </Select>
                                            )
                                            return (
                                                <Col
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                    xs={24}
                                                    sm={24}
                                                    md={11}
                                                    lg={11}
                                                    xl={11}
                                                >
                                                    <div>
                                                        <div
                                                            style={{
                                                                color: 'black',
                                                                fontWeight:
                                                                    '600',
                                                                marginBottom:
                                                                    '0.5rem',
                                                                marginTop:
                                                                    '1rem',
                                                            }}
                                                        >
                                                            Loại sản phẩm
                                                        </div>
                                                        <InputName />
                                                    </div>
                                                </Col>
                                            )
                                        }
                                    })}
                                </Row>
                            </Form>
                        )
                    }
                })}
        </Drawer>

    )
}