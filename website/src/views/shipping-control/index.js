import React, { useEffect, useState } from 'react'

import { PERMISSIONS, ROUTES } from 'consts'

//antd
import { Button, Tabs, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

//apis
import { getAllBranch } from 'apis/branch'
import { getCompare, getSession } from 'apis/compare'
import { addShippingControlWithFile } from 'apis/shipping'
import { useHistory } from 'react-router-dom'

//components
import PenddingCompare from './components/penddingCompare'
import Compared from './components/compared'
import CompareHistory from './components/compareHistory'
import Permission from 'components/permission'
import TitlePage from 'components/title-page'
import ImportCsv from 'components/ImportCSV'

function removeNull(a) {
  return Object.keys(a)
    .filter((key) => a[key] !== '' && a[key] !== undefined)
    .reduce((res, key) => ((res[key] = a[key]), res), {})
}

const { TabPane } = Tabs
export default function ShippingControl() {
  const history = useHistory()

  const [compareList, setCompareList] = useState([])
  const [sessionList, setSessionList] = useState([])
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
    <div className="card">
      <TitlePage title="Đối soát vận chuyển">
        <Space>
          <ImportCsv
            size="large"
            txt="Import phiếu đối soát"
            upload={addShippingControlWithFile}
            title="Nhập phiếu đối soát bằng file excel"
            fileTemplated="https://s3.ap-northeast-1.wasabisys.com/admin-order/2022/01/18/35e278a0-a244-4c7e-9284-015fb9c00238/file_mau_doi_soat.xlsx"
            reload={getAllCompare}
          />
          <Permission permissions={[PERMISSIONS.them_phieu_doi_soat_van_chuyen]}>
            <Button
              size="large"
              icon={<PlusCircleOutlined />}
              type="primary"
              onClick={() => history.push(ROUTES.SHIPPING_CONTROL_ADD)}
            >
              Thêm phiếu đối soát riêng lẻ
            </Button>
          </Permission>
        </Space>
      </TitlePage>

      <Tabs defaultActiveKey="1" style={{ width: '100%' }} onChange={changeTab}>
        <TabPane
          tab={<span style={{ fontSize: 15, fontWeight: 500 }}>Đơn chờ đối soát</span>}
          key="1"
        >
          <PenddingCompare
            compareList={compareList}
            branchList={branchList}
            setFilter={setFilter}
          />
        </TabPane>
        <TabPane
          tab={<span style={{ fontSize: 15, fontWeight: 500 }}>Đơn đã đối soát thành công</span>}
          key="2"
        >
          <Compared compareList={compareList} branchList={branchList} setFilter={setFilter} />
        </TabPane>
        <TabPane
          tab={<span style={{ fontSize: 15, fontWeight: 500 }}>Lịch sử đối soát</span>}
          key="3"
        >
          <CompareHistory compareList={sessionList} branchList={branchList} setFilter={setFilter} />
        </TabPane>
      </Tabs>
    </div>
  )
}
