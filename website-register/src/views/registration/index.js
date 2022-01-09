import { Button, Col, Input, Row, Select, Form } from 'antd'
import Checkbox from 'antd/lib/checkbox/Checkbox'
import React from 'react'
import styles from './registration.module.scss'
import { CloseOutlined } from '@ant-design/icons';

const { Option } = Select;
function Registration() {
    return (
        <div className={styles['registration']} >
            <img
                src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/bg-register.jpg"
                alt="background"
            />
            <div className={styles['registration-content']} >
                <div className={styles['registration-content-container']}>
                    <button className={styles['registration-content-button-close']}>
                        <CloseOutlined />
                    </button>
                    <div className={styles['registration-content--logo']} >
                        <img src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/logo/Sapo-logo.svg?v=202101071107" alt="logo" />
                    </div>
                    <div className={styles['registration-content--title']}>
                        <h2>Dùng thử Sapo miễn phí 7 ngày</h2>
                        <p>+150,000 doanh nghiệp &amp; chủ shop tin dùng</p>
                    </div>
                    <div className={styles['registration-content--form']}>
                        <Form>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        style={{ marginBottom: 16 }}
                                        name="name"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên của bạn' }]}
                                    >
                                        <Input allowClear placeholder="Họ và tên của bạn" className={styles['input']} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={14}>
                                <Col span={12}>
                                    <Form.Item
                                        style={{ marginBottom: 16 }}
                                        name="phone"
                                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn' }]}
                                    >
                                        <Input
                                            allowClear
                                            placeholder="Số điện thoại của bạn"
                                            className={styles['input']}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        style={{ marginBottom: 16 }}
                                        name="name-store"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên của hàng của bạn' }]}
                                    >
                                        <Input
                                            allowClear
                                            placeholder="Tên của hàng của bạn"
                                            className={styles['input']}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={14}>
                                <Col span={12}>
                                    <Form.Item
                                        style={{ marginBottom: 16 }}
                                        name="province"
                                        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/Thành phố' }]}
                                    >
                                        <Select
                                            allowClear
                                            className={styles['select']}
                                            placeholder={<span style={{ lineHeight: '48px' }}>Bạn ở Tỉnh / thành phố nào?</span>}
                                        >
                                            <Option value="1">Hồ Chí Minh</Option>
                                            <Option value="2">Hà nội</Option>
                                            <Option value="3">Đà Nẵng</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        style={{ marginBottom: 16 }}
                                        name="product"
                                        rules={[{ required: true, message: 'Vui lòng chọn sản phẩm bạn quan tâm' }]}
                                    >
                                        <Select
                                            allowClear
                                            className={styles['select']}
                                            placeholder={<span style={{ lineHeight: '48px' }}>Bạn ở Tỉnh / thành phố nào?</span>}
                                            listHeight={100}
                                        >
                                            <Option value="1">Phần mềm quản lý bán hàng</Option>
                                            <Option value="2">Thiết kế website bán hàng</Option>
                                            <Option value="3">Bán hàng online (FB &amp; sàn TMDT)</Option>
                                            <Option value="4">Quản lý và bán hàng đa kênh</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className={styles['checkbox-registration']}>
                                <Checkbox />&nbsp;Tôi đồng ý với <a href='#/'>&nbsp;quy định sử dụng &nbsp;</a> và <a href='#/'>&nbsp;chính sách bảo&nbsp;</a>của Sapo
                            </Row>
                            <Row className={styles['btn-registration']}>
                                <Button>
                                    Đăng ký dùng thử
                                </Button>
                            </Row>
                            <Row className={styles['btn-registration-sub-title']}>
                                Hoặc đăng ký nhanh bằng tài khoản
                            </Row>
                            <Row className={styles['btn-registration-sub-img']} justify='center' gutter={20}>
                                <Col span={7}>
                                    <a href="#/">
                                        <img
                                            src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/svg_sociallogin_fb_new.svg"
                                            alt='fb'
                                        />
                                    </a>
                                </Col>
                                <Col span={7}>
                                    <a href="#/">
                                        <img
                                            src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/svg_sociallogin_gg_new.svg"
                                            alt='gg'
                                        />
                                    </a>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Registration