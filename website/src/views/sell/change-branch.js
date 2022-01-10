import React, { useState, useEffect } from 'react'
import styles from './sell.module.scss'

import { ACTION } from 'consts'
import { useSelector, useDispatch } from 'react-redux'

//antd
import { Row, Modal, Select, Button, Tooltip, Input } from 'antd'

//icons antd
import { ExclamationCircleOutlined } from '@ant-design/icons'

//images
import location from 'assets/icons/location.png'

//apis
import { getAllBranch } from 'apis/branch'

export default function ChangeBranch() {
  const dispatch = useDispatch()
  const dataUser = useSelector((state) => state.login.dataUser)

  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(false)

  const [visible, setVisible] = useState(false)
  const toggle = () => setVisible(!visible)

  const branchActive =
    localStorage.getItem('branchSell') && JSON.parse(localStorage.getItem('branchSell'))

  const [branchId, setBranchId] = useState(branchActive && branchActive.branch_id)

  const _getBranches = async () => {
    try {
      setLoading(true)
      const res = await getAllBranch()
      if (res.status === 200) setBranches(res.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const _changeBranch = async () => {
    const branch = branches.find((s) => s.branch_id === branchId)
    localStorage.setItem('branchSell', JSON.stringify(branch))
    localStorage.setItem('invoice', JSON.stringify({ invoice: {} })) //reset đơn hàng local storage
    dispatch({ type: 'UPDATE_INVOICE', data: [] }) //reset đơn hàng trong reducer
    window.location.reload()
  }

  function confirm() {
    Modal.confirm({
      onOk: () => _changeBranch(),
      title: 'Bạn có muốn chuyển đổi chi nhánh này không ?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hệ thống sẽ không lưu lại thông tin của các đơn hàng này',
      okText: 'Đồng ý',
      cancelText: 'Từ chối',
    })
  }

  useEffect(() => {
    if (!visible) setBranchId(branchActive && branchActive.branch_id)
  }, [visible])

  useEffect(() => {
    _getBranches()
  }, [])

  return (
    <>
      <Tooltip title={branchActive ? branchActive.name : ''}>
        <Row wrap={false} align="middle" style={{ cursor: 'pointer' }} onClick={toggle}>
          <img src={location} alt="" style={{ marginRight: 10, width: 10 }} />
          <p className={styles['name-store']}>{branchActive && branchActive.name}</p>
        </Row>
      </Tooltip>
      <Modal
        width={400}
        onCancel={toggle}
        visible={visible}
        footer={null}
        title="Chuyển đổi chi nhánh"
      >
        <div>
          <p style={{ marginBottom: 0 }}>Doanh nghiệp</p>
          <Input
            style={{ color: 'black' }}
            value={dataUser.data && dataUser.data._branch && dataUser.data._branch.name}
            disabled
          />
        </div>
        <div style={{ marginBottom: 25, marginTop: 20 }}>
          <p style={{ marginBottom: 0 }}>Điểm bán</p>
          <Select
            placeholder="Chọn điểm bán"
            loading={loading}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            style={{ width: '100%' }}
            value={branchId}
            onChange={(value) => setBranchId(value)}
          >
            {branches.map((branch, index) => (
              <Select.Option key={index} value={branch.branch_id}>
                {branch.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <Row justify="end">
          <Button
            onClick={confirm}
            type="primary"
            style={{ backgroundColor: '#0877DE', borderColor: '#0877DE' }}
          >
            Chuyển đổi
          </Button>
        </Row>
      </Modal>
    </>
  )
}
