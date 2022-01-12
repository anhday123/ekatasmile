import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ROUTES } from 'consts'
import { useHistory } from 'react-router-dom'

//components
import TitlePage from 'components/title-page'

//antd
import { Row, Col, Select, Checkbox, Radio, InputNumber, Button, Space, notification } from 'antd'

//icons
import { ArrowLeftOutlined } from '@ant-design/icons'

//apis
import { getPoint, updatePoint } from 'apis/point'
import { getAllBranch } from 'apis/branch'

export default function Point() {
  const dispatch = useDispatch()
  const history = useHistory()

  const [point, setPoint] = useState({})
  const [branches, setBranches] = useState([])
  const [selectedBranch, setSelectedBranch] = useState(1)

  const [config, setConfig] = useState({
    use: true,
    accumulate: true,
    accumulate_price: 0,
    use_price: 0,
    selected: [],
  })

  const PointTitle = ({ title }) => (
    <Row style={{ borderBottom: 'solid 1px #B4B4B4', paddingBottom: '10px' }}>
      <Col>
        <Row align="middle" style={{ fontSize: 18, fontWeight: 600 }}>
          {title}
        </Row>
      </Col>
    </Row>
  )

  const onSaveSetting = async () => {
    try {
      dispatch({ type: 'LOADING', data: true })
      const data = {
        accumulate_point: config.accumulate,
        accumulate_point_branchs: config.selected,
        point_rate: config.accumulate_price,
        use_point: config.use,
        use_point_branchs: config.selected,
        currency_rate: config.use_price,
      }
      const res = await updatePoint(data, point.point_setting_id)
      if (res.status === 200) {
        if (res.data.success) {
          notification.success({ message: 'Cập nhật thành công' })
        } else {
          notification.error({ message: 'Cập nhật thất bại' })
        }
      }

      dispatch({ type: 'LOADING', data: false })
    } catch (err) {
      console.log(err)
      dispatch({ type: 'LOADING', data: true })
      notification.error({ message: 'Cập nhật thất bại' })
    }
  }

  const selectAllBranch = (checked) => {
    if (checked) setConfig({ ...config, selected: branches.map((e) => e.branch_id) })
    else setConfig({ ...config, selected: [] })
  }

  const _getPoint = async (query) => {
    try {
      const res = await getPoint(query)
      console.log(res)
      // if (res.data.success) setPoint(res.data.data[0])
    } catch (err) {
      console.log(err)
    }
  }

  const _getBranches = async (params) => {
    try {
      const res = await getAllBranch(params)
      if (res.data.success) {
        setBranches(res.data.data)
        setSelectedBranch(res.data.data[0].branch_id)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    _getPoint()
    _getBranches()
  }, [])

  useEffect(() => {
    setConfig({
      use: point.use_point,
      accumulate: point.accumulate_point,
      accumulate_price: point.point_rate || 0,
      use_price: point.currency_rate || 0,
    })
  }, [point])

  return (
    <div className="card">
      <TitlePage
        title={
          <Row
            wrap={false}
            align="middle"
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(ROUTES.CONFIGURATION_STORE)}
          >
            <ArrowLeftOutlined style={{ marginRight: 8 }} />
            Cấu hình tích điểm
          </Row>
        }
      >
        <Button type="primary" size="large" style={{ width: 100 }} onClick={onSaveSetting}>
          Lưu
        </Button>
      </TitlePage>
      <Row style={{ margin: '1em 0' }}>
        <Col xs={24} lg={8}>
          <Select
            mode="multiple"
            placeholder="Chọn chi nhánh"
            size="large"
            value={config.selected}
            onChange={(e) => setConfig({ ...config, selected: e })}
            style={{ width: '100%' }}
          >
            {branches.map((e) => (
              <Select.Option value={e.branch_id}>{e.name}</Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Row style={{ margin: '1em 0' }}>
        <Checkbox onChange={(e) => selectAllBranch(e.target.checked)}>
          Áp dụng cho tất cả chi nhánh
        </Checkbox>
      </Row>
      <Row gutter={30} style={{ margin: '1em 0' }}>
        <Col xs={24} lg={12}>
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <PointTitle title="Thiết lập tích điểm" />
              <Checkbox
                checked={config.accumulate}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    accumulate: e.target.checked,
                  })
                }
              >
                <span style={{ fontWeight: 500, color: 'blue' }}>Áp dụng tính năng tích điểm</span>
              </Checkbox>
              <div>
                <b>Cơ chế tích điểm</b>
              </div>
              <Checkbox checked={config.accumulate}>Tích điểm cho toàn bộ sản phẩm</Checkbox>
              <div>
                <b>Hình thức tích điểm</b>
              </div>
              <Radio.Group>
                <Radio>Tích điểm cố định</Radio>
              </Radio.Group>
              <div>
                <b>Tỷ lệ quy đổi điểm</b>
              </div>
              <div>
                <InputNumber
                  value={config.accumulate_price}
                  onChange={(e) => setConfig({ ...config, accumulate_price: e })}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />{' '}
                = 1 điểm
              </div>
            </Space>
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div>
            <Space direction="vertical" style={{ width: '100%' }}>
              <PointTitle title="Thiết lập đổi điểm" />
              <Checkbox
                checked={config.use}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    use: e.target.checked,
                  })
                }
              >
                <span style={{ fontWeight: 500, color: 'blue' }}>Áp dụng tính năng đổi điểm</span>
              </Checkbox>
              <div>
                <b>Thanh toán</b>
              </div>
              <div>Tỷ lệ quy đổi điểm ra tiền</div>
              <div>
                1 điểm ={' '}
                <InputNumber
                  value={config.use_price}
                  onChange={(e) => setConfig({ ...config, use_price: e })}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
            </Space>
          </div>
        </Col>
      </Row>
    </div>
  )
}
