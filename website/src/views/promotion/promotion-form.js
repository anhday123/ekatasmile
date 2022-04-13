import moment from 'moment'
import {
  Select,
  Row,
  Col,
  notification,
  Button,
  Input,
  Form,
  InputNumber,
  Checkbox,
  Radio,
  Space,
  Upload,
  message,
  DatePicker,
} from 'antd'
import { PlusOutlined, LoadingOutlined, InboxOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import styles from './add.module.scss'
import { addPromotion, updatePromotion } from 'apis/promotion'
import { getAllStore } from 'apis/store'
import { getAllBranch } from 'apis/branch'
import { removeAccents } from 'utils'
// Apis
import { uploadFile } from 'apis/upload'

//language
import { useTranslation } from 'react-i18next'
const { Option } = Select
const { Dragger } = Upload

export default function PromotionAdd(props) {
  console.log(props.state)
  const [storeList, setStoreList] = useState([])
  const [showVoucher, setShowVoucher] = useState('show')
  const [isChooseAllStore, setIsChooseAllStore] = useState(false)
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [checkedCustom, setCheckedCustom] = useState(false)
  const [checkedVoucher, setCheckedVoucher] = useState(false)
  const [selectAppCustomer, setSelectAppCustomer] = useState()
  const openNotification = () => {
    notification.success({
      message: t('promotion.add_promotion_successful'),
    })
  }
  const onFinish = async (values) => {
    try {
      const obj = {
        name: values.name,
        promotion_code: values.promotion_code,
        type: values.type,
        value: values.value,
        has_voucher: showVoucher === 'show',
        limit: {
          amount: values.amount ? parseInt(values.amount) : 0,
          stores: values.store ? values.store : [],
        },
        order_value_require: values.discount_condition || '',
        max_discount_value: values.max_discount || '',
        description: values.description || '',
        start_date: moment(values.start_date).format('YYYY-MM-DD'),
        end_date: moment(values.end_date).format('YYYY-MM-DD'),
      }
      console.log(obj)
      let res
      if (props.state.length === 0) res = await addPromotion(obj)
      else res = await updatePromotion(props.state.promotion_id, obj)

      if (res.status === 200) {
        openNotification()
        props.reload()
        props.close()
        form.resetFields()
        setIsChooseAllStore(false)
      } else throw res
    } catch (e) {
      console.log(e)
      notification.warning({
        message: t('promotion.add_promotion_failed'),
      })
    }
  }

  const generateCode = (value) => {
    let tmp = value.toUpperCase()
    tmp = tmp.replace(/\s/g, '')
    tmp = removeAccents(tmp)
    return tmp
  }

  const selectAllStore = (value) => {
    setIsChooseAllStore(value)
    value
      ? form.setFieldsValue({
          store: storeList.map((e) => {
            return e.branch_id
          }),
        })
      : form.setFieldsValue({ store: [] })
  }
  const _uploadImage = async (file) => {
    try {
      setLoading(true)
      const url = await uploadFile(file)
      setImage(url || '')
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getBranch = async (params) => {
      try {
        const res = await getAllBranch(params)
        if (res.status === 200) {
          setStoreList(res.data.data)
        } else {
          throw res
        }
      } catch (e) {
        console.log(e)
      }
    }
    getBranch()
  }, [])

  useEffect(() => {
    if (props.state) {
      form.setFieldsValue({ ...props.state })
    } else {
      form.resetFields()
    }
    if (!props.show) {
      form.resetFields()
    }
  }, [form, props.show, props.state])

  return (
    <>
      <Form onFinish={onFinish} form={form} layout="vertical">
        <Row
          gutter={10}
          style={{
            marginBottom: '10px',
            display: 'flex',
            flexDirection: 'column',
            padding: '0 10px 20px',
          }}
        >
          <div style={{ fontWeight: 'bold', font: '16px', marginBottom: '10px' }}>
            {t('warehouse.image')}
          </div>
          <Dragger
            style={{ margin: '0 2px' }}
            {...{
              name: 'file',
              multiple: true,
              action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
              onChange(info) {
                const { status } = info.file
                if (status !== 'uploading') {
                  console.log(info.file, info.fileList)
                }
                if (status === 'done') {
                  message.success(`${info.file.name} file uploaded successfully.`)
                } else if (status === 'error') {
                  message.error(`${info.file.name} file upload failed.`)
                }
              },
              onDrop(e) {
                console.log('Dropped files', e.dataTransfer.files)
              },
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from uploading company data or
              other band files
            </p>
          </Dragger>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <div className={styles['promotion-add__box']}>
              <div className={styles['promotion-add__title']}>
                {t('promotion.promotion_program')} <span style={{ color: 'red' }}>*</span>
              </div>
              <Form.Item name="name">
                <Input
                  placeholder={t('promotion.enter_promotion_program')}
                  size="large"
                  onChange={(e) => {
                    form.setFieldsValue({
                      promotion_code: generateCode(e.target.value),
                    })
                  }}
                />
              </Form.Item>
              <div className={styles['promotion-add__title']}>
                {t('promotion.promotion_program_code')} <span style={{ color: 'red' }}>*</span>
              </div>
              <Form.Item name="promotion_code">
                <Input placeholder={t('promotion.enter_promotion_program_code')} size="large" />
              </Form.Item>
              <div className={styles['promotion-add__title']}>
                {t('promotion.applies_customers')}
              </div>
              <Select
                style={{ width: '100%', marginBottom: '30px' }}
                size="large"
                placeholder={t('order_delivery.all')}
                showSearch
                onChange={(value) => setSelectAppCustomer(value)}
                value={selectAppCustomer || 'customer-0'}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="customer-0">{t('order_delivery.all')}</Option>
                <Option value="customer-1">{t('promotion.haunt')}</Option>
                <Option value="customer-2">{t('promotion.new_guest')}</Option>
                <Option value="customer-3">{t('promotion.potential')}</Option>
                <Option value="customer-4">{t('promotion.loyal')}</Option>
              </Select>
              <Checkbox
                onChange={() => setCheckedCustom(!checkedCustom)}
                checked={checkedCustom}
                style={{
                  marginBottom: '30px',
                  padding: '0',
                  color: checkedCustom ? '#2463EA' : '#000',
                }}
              >
                {t('promotion.add_automatic_customers')}
              </Checkbox>
              <Checkbox
                onChange={() => setCheckedVoucher(!checkedVoucher)}
                checked={checkedVoucher}
                style={{
                  margin: '0 0 57px',
                  padding: '0',
                  color: checkedVoucher ? '#2463EA' : '#000',
                }}
              >
                {t('promotion.download_excel_file')}
              </Checkbox>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles['promotion-add__box']}>
              <div className={styles['promotion-add__title']}>
                {t('promotion.promotion_options')}
              </div>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item name="type" initialValue="VALUE" label={t('promotion.promotion_type')}>
                    <Select placeholder={t('promotion.promotion_type')} size="large">
                      <Option value="VALUE">{t('promotion.value')}</Option>
                      <Option value="PERCENT">{t('promotion.percent')}</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="value" label={t('promotion.promotion_value')}>
                    <InputNumber
                      placeholder={t('promotion.promotion_value')}
                      size="large"
                      min={0}
                      style={{ width: '100%', borderRadius: '15px' }}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row  gutter={20}>
                <Col span={12}>
                  <Form.Item name="discount_condition" label={t('promotion.applied_limit')}>
                    <InputNumber
                      style={{ width: '100%', borderRadius: 15 }}
                      size="large"
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="max_discount" label={t('promotion.limited_promotion')}>
                    <InputNumber
                      style={{ width: '100%', borderRadius: 15 }}
                      size="large"
                      min={0}
                      formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div className={styles['promotion-add__box']}>
              <div className={styles['promotion-add__title']}>{t('promotion.description')}</div>
              <Form.Item name="description" style={{ marginBottom: 0 }}>
                <Input.TextArea style={{ height: 100, margin: '15px 0' }} />
              </Form.Item>
            </div>
          </Col>
        </Row>
        <Row
          style={{
            borderBottom: '1px solid #B4B4B4',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '20px',
          }}
        >
          <div style={{ fontSize: '18px', color: '#394150', paddingBottom: '10px' }}>
            {t('promotion.applied_time')}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '50%', fontSize: '16px', marginLeft: '5px' }}>
              <div> {t('promotion.start_date')}</div>
              <Form.Item name="start_date">
                <DatePicker size="large" style={{ width: '100%', marginTop: '10px' }} />
              </Form.Item>
            </div>
            <div style={{ width: '50%', fontSize: '16px', marginLeft: '10px' }}>
              {' '}
              <div> {t('promotion.end_date')}</div>
              <Form.Item name="end_date">
                <DatePicker size="large" style={{ width: '100%', marginTop: '10px' }} />
              </Form.Item>
            </div>
          </div>
        </Row>
        <div className={styles['promotion_add_button']}>
          <Form.Item>
            <Button size="large" type="primary" htmlType="submit" style={{ width: 120 }}>
              {props.state.length === 0 ? t('promotion.add') : t('promotion.save')}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  )
}
