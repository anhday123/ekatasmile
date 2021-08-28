import styles from './../configuration-store/configuration-store.module.scss'
import React from 'react'
import { Input, Row, Col, Popover } from 'antd'
import { Link } from 'react-router-dom'
import {
  ShopOutlined,
  FileExcelOutlined,
  FormOutlined,
  DollarOutlined,
  TeamOutlined,
  CreditCardOutlined,
  ApartmentOutlined,
  BranchesOutlined,
} from '@ant-design/icons'
import { ROUTES } from 'consts'

export default function ConfigurationStore() {
  return (
    <>
      <div className={styles['configuration']}>
        <div
          style={{
            color: 'black',
            fontWeight: '600',
            fontSize: '1rem',
            borderBottom: '1px solid grey',
            paddingBottom: '0.5rem',
          }}
        >
          Cấu hình
        </div>
        <div className={styles['configuration_content']}>
          <div
            style={{ color: '#1A3873', fontSize: '1.25rem', fontWeight: '700' }}
          >
            Thông tin về cửa hàng
          </div>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
            >
              <Link
                to={ROUTES.BRANCH}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  className={styles['hover_item']}
                  style={{
                    backgroundColor: '#FCEEE4',
                    marginRight: '1rem',
                    border: '1px solid #FA964C',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '4rem',
                    height: '3rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  <BranchesOutlined
                    style={{ color: '#FA964C', fontSize: '1.5rem' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      fontSize: '1rem',
                      color: '#0015CD',
                    }}
                  >
                    Quản lý chi nhánh
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      color: 'black',
                      fontSize: '0.75rem',
                    }}
                  >
                    Thêm và điều chỉnh thông tin chi nhánh
                  </div>
                </div>
              </Link>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
            >
              <Link
                to={ROUTES.STORE}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  className={styles['hover_item']}
                  style={{
                    backgroundColor: '#E7FCE6',
                    marginRight: '1rem',
                    border: '1px solid #2DD728',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '4rem',
                    height: '3rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  <ShopOutlined
                    style={{ color: '#2DD728', fontSize: '1.5rem' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      fontSize: '1rem',
                      color: '#0015CD',
                    }}
                  >
                    Quản lý cửa hàng
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      color: 'black',
                      fontSize: '0.75rem',
                    }}
                  >
                    Quản lý thông tin liên hệ và địa chỉ của cửa hàng
                  </div>
                </div>
              </Link>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
            >
              <Link
                to={ROUTES.USER}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  className={styles['hover_item']}
                  style={{
                    backgroundColor: '#FCE5E1',
                    marginRight: '1rem',
                    border: '1px solid #F07D6B',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '4rem',
                    height: '3rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  <ApartmentOutlined
                    style={{ color: '#F07D6B', fontSize: '1.5rem' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      fontSize: '1rem',
                      color: '#0015CD',
                    }}
                  >
                    Quản lý người dùng
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      color: 'black',
                      fontSize: '0.75rem',
                    }}
                  >
                    Tạo, quản lý các vai trò người dùng
                  </div>
                </div>
              </Link>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
            >
              <Link
                to={ROUTES.EMPLOYEE}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  className={styles['hover_item']}
                  style={{
                    backgroundColor: '#FCDFEF',
                    marginRight: '1rem',
                    border: '1px solid #F060AE',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '4rem',
                    height: '3rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  <TeamOutlined
                    style={{ color: '#F060AE', fontSize: '1.5rem' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      fontSize: '1rem',
                      color: '#0015CD',
                    }}
                  >
                    Quản lý nhân sự
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      color: 'black',
                      fontSize: '0.75rem',
                    }}
                  >
                    Tạo và quản lý tất cả tài khoản của nhân sự
                  </div>
                </div>
              </Link>
            </Col>
          </Row>
        </div>

        <div className={styles['configuration_content']}>
          <div
            style={{ color: '#1A3873', fontSize: '1.25rem', fontWeight: '700' }}
          >
            Thông tin bán hàng
          </div>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
            >
              <Link
                to={ROUTES.TAX}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  className={styles['hover_item']}
                  style={{
                    backgroundColor: '#FCF7EB',
                    marginRight: '1rem',
                    border: '1px solid #EFC76E',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '4rem',
                    height: '3rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  <DollarOutlined
                    style={{ color: '#EFC76E', fontSize: '1.5rem' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      fontSize: '1rem',
                      color: '#0015CD',
                    }}
                  >
                    Quản lý thuế
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      color: 'black',
                      fontSize: '0.75rem',
                    }}
                  >
                    Thiết lập thuế nhập và bán hàng
                  </div>
                </div>
              </Link>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
              xs={24}
              sm={24}
              md={11}
              lg={7}
              xl={7}
            >
              <Link
                to={ROUTES.PAYMENT}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  className={styles['hover_item']}
                  style={{
                    backgroundColor: '#F3FCE2',
                    marginRight: '1rem',
                    border: '1px solid #B6DE62',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '4rem',
                    height: '3rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  <CreditCardOutlined
                    style={{ color: '#B6DE62', fontSize: '1.5rem' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      fontSize: '1rem',
                      color: '#0015CD',
                    }}
                  >
                    Quản lý thanh toán
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      color: 'black',
                      fontSize: '0.75rem',
                    }}
                  >
                    Thiết lập các hình thức thanh toán
                  </div>
                </div>
              </Link>
            </Col>
          </Row>
        </div>

        <div className={styles['configuration_content']}>
          <div
            style={{ color: '#1A3873', fontSize: '1.25rem', fontWeight: '700' }}
          >
            Nhật ký
          </div>
          <Row
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Col
              style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
              xs={24}
              sm={11}
              md={11}
              lg={7}
              xl={7}
            >
              <Link
                to={ROUTES.IMPORT_REPORT_FILE}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  className={styles['hover_item']}
                  style={{
                    backgroundColor: '#D7E9DB',
                    marginRight: '1rem',
                    border: '1px solid #388F4D',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '4rem',
                    height: '3rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  <FileExcelOutlined
                    style={{ color: '#388F4D', fontSize: '1.5rem' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      fontSize: '1rem',
                      color: '#0015CD',
                    }}
                  >
                    Nhập/xuất file
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      color: 'black',
                      fontSize: '0.75rem',
                    }}
                  >
                    Theo dõi và quản lý nhập xuất file
                  </div>
                </div>
              </Link>
            </Col>
            <Col
              style={{ width: '100%', marginTop: '1rem', marginRight: '1rem' }}
              xs={24}
              sm={11}
              md={11}
              lg={7}
              xl={7}
            >
              <Link
                to={ROUTES.ACTIVITY_DIARY}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div
                  className={styles['hover_item']}
                  style={{
                    backgroundColor: '#E9D4D5',
                    marginRight: '1rem',
                    border: '1px solid #8F292F',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '4rem',
                    height: '3rem',
                    borderRadius: '0.25rem',
                  }}
                >
                  <FormOutlined
                    style={{ color: '#8F292F', fontSize: '1.5rem' }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      fontSize: '1rem',
                      color: '#0015CD',
                    }}
                  >
                    Nhật ký hoạt động
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      width: '100%',
                      color: 'black',
                      fontSize: '0.75rem',
                    }}
                  >
                    Quản lý toàn bộ thao tác, nhật ký hoạt động trong cửa hàng
                  </div>
                </div>
              </Link>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}
