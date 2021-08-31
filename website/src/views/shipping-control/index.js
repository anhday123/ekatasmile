import styles from './../shipping-control/shipping-control.module.scss'
import React, { useEffect, useState } from 'react'
import { Button, Tabs } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { getCompare, getSession } from '../../apis/compare'
import PenddingCompare from './components/penddingCompare'
import Compared from './components/compared'
import CompareHistory from './components/compareHistory'
import CreateCompare from './components/createCompare'
import Permission from 'components/permission'
import { getAllBranch } from '../../apis/branch'
import { PERMISSIONS } from 'consts'

const { TabPane } = Tabs
function removeNull(a) {
  return Object.keys(a)
    .filter((key) => a[key] !== '' && a[key] !== undefined)
    .reduce((res, key) => ((res[key] = a[key]), res), {})
}
export default function ShippingControl() {
  const [compareList, setCompareList] = useState([])
  const [sessionList, setSessionList] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [branchList, setBranchList] = useState([])
  const [filter, setFilter] = useState({})
  const [currentTab, setCurrentTab] = useState(1)

  const getAllCompare = async (params) => {
    try {
      const res = await getCompare(params)
      if (res.data.success) {
        setCompareList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getAllSession = async (params) => {
    try {
      const res = await getSession(params)
      if (res.data.success) {
        setSessionList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getBranch = async (params) => {
    try {
      const res = await getAllBranch(params)
      if (res.data.success) {
        setBranchList(res.data.data)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const changeTab = (e) => {
    setCurrentTab(e)
    if (e == 3) {
      getAllSession()
    } else {
      getAllCompare()
    }
  }

  useEffect(() => {
    getBranch()
  }, [])
  useEffect(() => {
    if (currentTab == 3) {
      getAllSession({ ...removeNull(filter) })
    } else {
      getAllCompare({ ...removeNull(filter) })
    }
  }, [filter])
  return (
    <>
      <div className={`${styles['promotion_manager']} ${styles['card']}`}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid rgb(236, 226, 226)',
            paddingBottom: '0.75rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div className={styles['promotion_manager_title']}>
            Đối soát vận chuyển
          </div>
          <div className={styles['promotion_manager_button']}>
            <Permission
              permissions={[PERMISSIONS.them_phieu_doi_soat_van_chuyen]}
            >
              <Button
                size="large"
                icon={<PlusCircleOutlined style={{ fontSize: '1rem' }} />}
                type="primary"
                onClick={() => setShowCreate(true)}
              >
                Thêm phếu đối soát riêng lẻ
              </Button>
            </Permission>
          </div>
        </div>
        <Tabs
          defaultActiveKey="1"
          style={{ width: '100%' }}
          onChange={changeTab}
        >
          <TabPane
            tab={
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                Đơn chờ đối soát
              </span>
            }
            key="1"
          >
            <PenddingCompare
              compareList={compareList}
              branchList={branchList}
              setFilter={setFilter}
            />
          </TabPane>
          <TabPane
            tab={
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                Đơn đã đối soát thành công
              </span>
            }
            key="2"
          >
            <Compared
              compareList={compareList}
              branchList={branchList}
              setFilter={setFilter}
            />
          </TabPane>
          <TabPane
            tab={
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                Lịch sử đối soát
              </span>
            }
            key="3"
          >
            <CompareHistory
              compareList={sessionList}
              branchList={branchList}
              setFilter={setFilter}
            />
          </TabPane>
        </Tabs>
      </div>
      <CreateCompare
        visible={showCreate}
        reload={() => {
          if (currentTab == 3) {
            getAllSession({ ...removeNull(filter) })
          } else {
            getAllCompare({ ...removeNull(filter) })
          }
        }}
        onClose={() => setShowCreate(false)}
      />
    </>
  )
}
