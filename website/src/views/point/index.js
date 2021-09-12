import styles from './point.module.scss'
import {
  Row,
  Col,
  Select,
  Checkbox,
  Radio,
  InputNumber,
  Button,
  Space,
  notification,
} from 'antd'
import { useEffect, useState } from 'react'
import { getPointSetting, updatePointSetting } from 'apis/point'
import { getAllBranch } from 'apis/branch'

export default function Point() {
  const [pointSetting, setPoinSetting] = useState(false)
  const [branchList, setBranchList] = useState([])
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
      const data = {
        accumulate_point: config.accumulate,
        accumulate_point_branchs: config.selected,
        point_rate: config.accumulate_price,
        use_point: config.use,
        use_point_branchs: config.selected,
        currency_rate: config.use_price,
      }
      const res = await updatePointSetting(pointSetting.point_setting_id, data)
      if (res.data.success) {
        notification.success({ message: 'Cập nhật thành công' })
      }
    } catch (err) {
      console.log(err)
      notification.error({ message: 'Cập nhật thất bại' })
    }
  }

  const selectAllBranch = (val) => {
    if (val)
      setConfig({
        ...config,
        selected: branchList.map((e) => {
          return e.branch_id
        }),
      })
    else
      setConfig({
        ...config,
        selected: [],
      })
  }
  useEffect(() => {
    const getPoint = async (params) => {
      try {
        const res = await getPointSetting(params)
        if (res.data.success) {
          setPoinSetting(res.data.data[0])
        }
      } catch (err) {
        console.log(err)
      }
    }
    getPoint()
  }, [])
  useEffect(() => {
    const getBranch = async (params) => {
      try {
        const res = await getAllBranch(params)
        if (res.data.success) {
          setBranchList(res.data.data)
          setSelectedBranch(res.data.data[0].branch_id)
        }
      } catch (err) {
        console.log(err)
      }
    }
    getBranch()
  }, [])
  useEffect(() => {
    setConfig({
      use: pointSetting.use,
      accumulate: pointSetting.accumulate_point_branchs,
      accumulate_price: pointSetting.point_rate || 0,
      use_price: pointSetting.currency_rate || 0,
    })
  }, [pointSetting])
  return (
    <div className={styles['point']}>
      <Row style={{ borderBottom: 'solid 1px #B4B4B4', paddingBottom: '10px' }}>
        <Col>
          <Row align="middle" style={{ fontSize: 20, fontWeight: 600 }}>
            Cấu hình tích điểm
          </Row>
        </Col>
      </Row>
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
            {branchList.map((e) => (
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
          <div className={styles['setting-box']}>
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
                <span style={{ fontWeight: 500, color: 'blue' }}>
                  Áp dụng tính năng tích điểm
                </span>
              </Checkbox>
              <div>
                <b>Cơ chế tích điểm</b>
              </div>
              <Checkbox checked={config.accumulate}>
                Tích điểm cho toàn bộ sản phẩm
              </Checkbox>
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
                  disabled={!config.accumulate}
                  onChange={(e) =>
                    setConfig({ ...config, accumulate_price: e })
                  }
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />{' '}
                = 1 điểm
              </div>
            </Space>
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className={styles['setting-box']}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <PointTitle title="Thiết lập đổi điểm" />
              <Checkbox checked={config.use}>
                <span style={{ fontWeight: 500, color: 'blue' }}>
                  Áp dụng tính năng đổi điểm
                </span>
              </Checkbox>
              <div>
                <b>Thanh toán</b>
              </div>
              <div>Tỷ lệ quy đổi điểm ra tiền</div>
              <div>
                1 điểm ={' '}
                <InputNumber
                  value={config.use_price}
                  disabled={!config.use}
                  onChange={(e) => setConfig({ ...config, use_price: e })}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </div>
            </Space>
          </div>
        </Col>
      </Row>
      <Row justify="end">
        <Button
          type="primary"
          size="large"
          style={{ width: 100 }}
          onClick={onSaveSetting}
        >
          Lưu
        </Button>
      </Row>
    </div>
  )
}
