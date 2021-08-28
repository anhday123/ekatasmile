import { useHistory, Link, useLocation } from 'react-router-dom'
import styles from './../information/information.module.scss'
import { Row, Col } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useEffect } from 'react'
import { ROUTES } from 'consts'
export default function SupplierInformation(props) {
  const history = useHistory()
  const location = useLocation()

  return (
    <>
      <div className={styles['supplier_information']}>
        <div className={styles['supplier_information_content_parent']}>
          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
            >
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  {' '}
                  <div>
                    <b>Tên nhà cung cấp:</b> {props.data.name}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
            >
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  <div>
                    <b>Địa chỉ:</b> {props.data.address}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
            >
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  <div>
                    <b>Mã nhà cung cấp:</b> {props.data.code}
                  </div>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
            >
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  <div>
                    <b>Tỉnh/thành phố:</b> {props.data.province}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
            >
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  <div>
                    <b>Email:</b> {props.data.email}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_right']}
            >
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  <div>
                    <b>Quận/huyện:</b> {props.data.district}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={styles['supplier_information_content_main']}>
            <Col
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
              className={styles['supplier_information_content_child_left']}
            >
              <Row
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
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
                  <div>
                    <b>Liên hệ:</b> {props.data.phone}
                  </div>
                </Col>
              </Row>
            </Col>

            {/*  */}
          </Row>
        </div>
      </div>
    </>
  )
}
