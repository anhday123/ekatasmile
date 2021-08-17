import { Row, Col, Modal, Drawer } from 'antd'
function formatCash(str) {
  return str
    .split('')
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ',') + prev
    })
}
export default function ProductInfo(props) {
  const { record, warranty } = props
  return (
    <div>
      <Drawer
        title="Chi tiết sản phẩm"
        width={1000}
        visible={props.modal2Visible}
        onClose={() => props.modal2VisibleModal(false)}
      >
        {record && record.attributes && record.attributes.length > 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <Row
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Col
                style={{ width: '100%' }}
                xs={24}
                sm={24}
                md={7}
                lg={7}
                xl={7}
              >
                <div className="center_information">
                  <div style={{ marginTop: '1rem' }}>
                    <b>Tên sản phẩm: </b>
                    {record ? record.name : ''}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <b>Chiều dài: </b>
                    {`${record ? record.length : 0} cm`}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <b>Chiều rộng: </b>
                    {`${record ? record.width : 0} cm`}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <b>Chiều rộng: </b>
                    {`${record ? record.width : 0} cm`}
                  </div>
                </div>
              </Col>

              <Col
                style={{ width: '100%' }}
                xs={24}
                sm={24}
                md={7}
                lg={7}
                xl={7}
              >
                <div className="center_information">
                  <div style={{ marginTop: '1rem' }}>
                    <b>Sku: </b>
                    {record ? record.sku : ''}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <b>Chiều cao: </b>
                    {`${record ? record.height : 0} cm`}
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <b>Cân nặng: </b>
                    {`${record ? record.weight : 0} g`}
                  </div>
                </div>
              </Col>

              <Col
                style={{ width: '100%' }}
                xs={24}
                sm={24}
                md={7}
                lg={7}
                xl={7}
              >
                <div className="center_information">
                  <div style={{ marginTop: '1rem' }}>
                    <b>Nhà cung cấp: </b>
                    {record.suppliers.name}
                  </div>
                </div>
              </Col>
            </Row>
            <Row align="center" justify="start" style={{ width: '100%', borderTop: '1px solid rgb(223, 213, 213)', margin: '1.25rem 0 0 0', }}>
              <Col
                style={{ width: '100%' }}
              >
                <div
                  style={{
                    color: 'black',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  Thuộc tính:
                </div>
                <Row>
                  {record &&
                    record.attributes &&
                    record.attributes.length > 0 &&
                    record.attributes.map((values1, index1) => {
                      return (
                        <Col span={6}>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                              }}
                            >
                              <div
                                style={{
                                  marginRight: '0.25rem',
                                  color: 'black',
                                  fontWeight: '650',
                                  marginTop: '0.75rem',
                                }}
                              >
                                Tên thuộc tính:{' '}
                              </div>
                              <div
                                style={{
                                  marginRight: '0.25rem',
                                  marginTop: '0.75rem',
                                }}
                              >
                                {' '}
                                {values1.option}
                              </div>
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                              }}
                            >
                              <div
                                style={{
                                  marginRight: '0.25rem',
                                  color: 'black',
                                  fontWeight: '650',
                                  marginTop: '0.75rem',
                                }}
                              >
                                Giá trị:{' '}
                              </div>
                              <div
                                style={{
                                  marginRight: '0.25rem',
                                  marginTop: '0.75rem',
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                }}
                              >
                                {values1 &&
                                  values1.values &&
                                  values1.values
                                    .length > 0 &&
                                  values1.values.map((values2, index2) => {
                                    return (
                                      <div>
                                        {
                                          values2
                                        }
                                        ,{' '}
                                      </div>
                                    )
                                  }
                                  )}
                              </div>
                            </div>
                          </div>
                        </Col>
                      )
                    })}
                </Row>

              </Col>
            </Row>

            <Row
              style={{
                display: 'flex',
                paddingTop: '1.25rem',
                margin: '1.25rem 0 0 0',
                borderTop: '1px solid rgb(223, 213, 213)',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >

              <Col
                style={{ width: '100%' }}
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
              >
                <div
                  style={{
                    color: 'black',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    fontSize: '1rem',
                    fontWeight: '600',
                  }}
                >
                  Phiên bản:
                </div>
                <Row
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  {record &&
                    record.variants &&
                    record.variants.map(
                      (values1, index1) => {
                        return (
                          <Col
                            style={{
                              width: '100%',
                            }}
                            xs={24}
                            sm={24}
                            md={8}
                            lg={8}
                            xl={8}
                          >
                            <div
                              style={{
                                display: 'flex',
                                borderBottom: '1px solid rgb(223, 213, 213)',
                                paddingBottom: '1.25rem',
                                marginBottom: '0.5rem',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                                flexDirection: 'column',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: '0.25rem',
                                    color: 'black',
                                    fontWeight: '650',
                                    marginTop: '0.75rem',
                                  }}
                                >
                                  Variants:
                                </div>
                                <div
                                  style={{
                                    marginTop: '0.75rem',
                                  }}
                                >
                                  {
                                    values1.title
                                  }
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: '0.25rem',
                                    color: 'black',
                                    fontWeight: '650',
                                    marginTop: '0.75rem',
                                  }}
                                >
                                  Sku:
                                </div>
                                <div
                                  style={{
                                    marginTop: '0.75rem',
                                  }}
                                >
                                  {
                                    values1.sku
                                  }
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: '0.25rem',
                                    color: 'black',
                                    fontWeight: '650',
                                    marginTop: '0.75rem',
                                  }}
                                >
                                  Giá cơ bản:
                                </div>
                                <div
                                  style={{
                                    marginTop: '0.75rem',
                                  }}
                                >
                                  {
                                    formatCash(values1.base_price + '')
                                  } VND
                                </div>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: '0.25rem',
                                    color: 'black',
                                    fontWeight: '650',
                                    marginTop: '0.75rem',
                                  }}
                                >
                                  Giá bán:
                                </div>
                                <div
                                  style={{
                                    marginTop: '0.75rem',
                                  }}
                                >
                                  {
                                    formatCash(values1.sale_price + '')
                                  } VND
                                </div>
                              </div>


                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                  width: '100%',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    marginRight: '0.25rem',
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    color: 'black',
                                    fontWeight: '650',
                                    marginTop: '0.75rem',
                                  }}
                                >
                                  Hình ảnh:
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    maxWidth: '100%',
                                    overflow: 'auto',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    width: '100%',
                                  }}
                                >
                                  {values1 &&
                                    values1.image &&
                                    values1.image.map((values3, index3) => {
                                      return (
                                        <div
                                          style={{
                                            display: 'flex',
                                            marginTop: '1rem',
                                            marginRight: '1rem',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            width: '100%',
                                          }}
                                        >
                                          <img
                                            src={
                                              values3
                                            }
                                            style={{
                                              width: '5rem',
                                              height: '5rem',
                                              objectFit: 'contain',
                                            }}
                                            alt=""
                                          />
                                        </div>
                                      )
                                    }
                                    )}
                                </div>
                              </div>
                            </div>
                          </Col>
                        )
                      }
                    )}
                </Row>
              </Col>
            </Row>
          </div>
        ) : (
          <Row
            style={{
              display: 'flex',
              height: '100%',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', height: '100%' }}
              xs={24}
              sm={24}
              md={7}
              lg={7}
              xl={7}
            >
              <Row
                style={{
                  display: 'flex',
                  height: '100%',
                  margin: '1rem 0',
                  maxHeight: '30rem',
                  overflow: 'auto',
                  justifyContent: 'center',
                  width: '100%',
                  flexDirection: 'column',
                }}
              >
                {record &&
                  record.image &&
                  record.image.length > 0 &&
                  record.image.map((values, index) => {
                    if (
                      index ===
                      record.image[
                      record.image.length - 1
                      ]
                    ) {
                      return (
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          style={{ width: '100%' }}
                        >
                          <img
                            src={
                              record &&
                                record.image &&
                                record.image
                                  .length > 0
                                ? values
                                : ''
                            }
                            style={{
                              width: '12.5rem',
                              marginTop: '1rem',
                              height: '6rem',
                              objectFit: 'contain',
                            }}
                            alt=""
                          />
                        </Col>
                      )
                    } else {
                      return (
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          style={{
                            width: '100%',
                            borderBottom: '1px solid grey',
                            borderRight: '1px solid grey',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingBottom: '1rem',
                          }}
                        >
                          <img
                            src={
                              record &&
                                record.image &&
                                record.image
                                  .length > 0
                                ? values
                                : ''
                            }
                            style={{
                              width: '12.5rem',
                              marginTop: '1rem',
                              height: '6rem',
                              objectFit:
                                'contain',
                            }}
                            alt=""
                          />
                        </Col>
                      )
                    }
                  })}
              </Row>
            </Col>

            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={7}
              lg={7}
              xl={7}
            >
              <div className="center_information">
                <div style={{ marginTop: '1rem' }}>
                  <b>Sku: </b>
                  {record ? record.sku : ''}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Tên sản phẩm: </b>
                  {record ? record.name : ''}
                </div>
                {/* <div style={{ marginTop: '1rem' }}><b>Mã SKU: </b>GUU</div> */}
                <div style={{ marginTop: '1rem' }}>
                  <b>Giá cơ bản: </b>
                  {`${record && record.base_price
                    ? formatCash(record.base_price + '')
                    : 0
                    } VNĐ`}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Giá bán: </b>
                  {`${record && record.sale_price
                    ? formatCash(record.sale_price + '')
                    : 0
                    } VNĐ`}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Giá nhập: </b>
                  {`${record && record.import_price
                    ? formatCash(record.import_price + '')
                    : 0
                    } VNĐ`}
                </div>

                <div
                  style={{
                    display: 'flex',
                    marginTop: '1rem',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <b>Chính sách bảo hành: </b>
                  </div>
                  {warranty.map((values, index) => {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          color: 'black',
                          fontWeight: '600',
                          marginTop: '0.5rem',
                          justifyContent: 'flex-start',
                          alignItem: 'center',
                          width: '100%',
                        }}
                      >{`-${values.name}`}</div>
                    )
                  })}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ marginTop: '0.5rem' }}>
                      Sản phẩm được bảo hành miễn phí nếu
                      đảm bảo tất cả các điều kiện sau:
                      <div
                        style={{ marginTop: '0.5rem' }}
                      >
                        – Sản phẩm thuộc danh mục được
                        bảo hành từ Nhà sản xuất hoặc
                        Nhà phân phối.
                      </div>
                      <div
                        style={{ marginTop: '0.5rem' }}
                      >
                        – Sản phẩm bị lỗi kỹ thuật do
                        Nhà sản xuất.
                      </div>
                      <div
                        style={{ marginTop: '0.5rem' }}
                      >
                        – Thời hạn bảo hành trên phiếu
                        bảo hành vẫn còn hiệu lực
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col
              style={{ width: '100%' }}
              xs={24}
              sm={24}
              md={7}
              lg={7}
              xl={7}
            >
              <div className="center_information">
                <div style={{ marginTop: '1rem' }}>
                  <b>Chiều dài: </b>
                  {`${record ? record.length : 0} cm`}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Chiều rộng: </b>
                  {`${record ? record.width : 0} cm`}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Chiều cao: </b>
                  {`${record ? record.height : 0} cm`}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Cân nặng: </b>
                  {`${record ? record.weight : 0} g`}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Mã barcode: </b>
                  {`${record ? record.barcode : 'không có'}`}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Đơn vị: </b>
                  {`${record ? record.unit : 'không có'}`}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Số lượng cung cấp: </b>
                  {record ? record.quantity : 0}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Loại sản phẩm: </b>
                  {record &&
                    record.category &&
                    record.category.name
                    ? record.category.name
                    : ''}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <b>Nhà cung cấp: </b>
                  {record.suppliers && record.suppliers.name}
                </div>
                {/* <div style={{ marginTop: '1rem' }}><b>Nhà cung cấp: </b></div> */}
              </div>
            </Col>
          </Row>
        )}
      </Drawer>
    </div>
  )
}
