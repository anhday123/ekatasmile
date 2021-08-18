import UI from "./../../components/Layout/UI";
import styles from "./../sell/sell.module.scss";
import emptyProduct from "./../../assets/img/emptyProduct.png";
import user from './../../assets/img/user.png'
import { ACTION, } from './../../consts/index'
import { uploadImg, uploadImgs } from "./../../apis/upload";
import { apiFilterCity, getAllBranch } from './../../apis/branch'
import _ from 'lodash'
import { Offline, Online } from "react-detect-offline";
import { apiAllTax } from './../../apis/tax'
import { apiAllShipping } from './../../apis/shipping'
import { apiCheckPromotion, getAllPromotion, getPromoton } from './../../apis/promotion'
import moment from 'moment'
import { addCustomer, getAllCustomer, getCustomer } from './../../apis/customer'
import { apiAllProduct, apiProductCategory, apiProductCategoryMerge, apiProductSeller, apiSearchProduct, apiUpdateProduct, } from "../../apis/product";
import { useDispatch } from 'react-redux'
import React, { useState, useRef, useEffect } from "react";
import FunctionShortcut from './../../components/sell/function-shortcut/index'
import "react-multi-carousel/lib/styles.css";
import {
  PlusCircleOutlined,
  AudioOutlined,
  AlertOutlined,
  CheckOutlined,
  MinusOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  PlusOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Select,
  Pagination,
  Dropdown,
  DatePicker,
  Drawer,
  notification,
  Button,
  Radio,
  Checkbox,
  Steps,
  Table,
  Input,
  Popover,
  InputNumber,
  Row,
  Typography,
  Space,
  Tabs,
  Modal,
  Form,
  Col,
} from "antd";
import { Markunread, TrainRounded } from "@material-ui/icons";
import { apiDistrict, apiProvince } from "../../apis/information";
import { getAllPayment } from "../../apis/payment";
import { apiAllOrder, apiOrderPromotion, apiOrderVoucher } from "../../apis/order";
import { apiAllUser } from "../../apis/user";
const ButtonGroup = Button.Group;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Step } = Steps;
const columns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    width: 150,
  },
  {
    title: 'Mã SKU',
    dataIndex: 'skuCode', width: 150,
  },
  {
    title: 'Tên sản phẩm',
    dataIndex: 'productName', width: 150,
  },
  {
    title: 'Đơn vị',
    dataIndex: 'unit', width: 150,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity', width: 150,
  },
  {
    title: 'Đơn giá',
    dataIndex: 'bill', width: 150,
  },
  {
    title: 'Thành tiền',
    dataIndex: 'moneyTotal', width: 150,
  },
  {
    title: '',
    dataIndex: 'actions', width: 150,
  },
];

const data = [];

const data2 = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    stt: `${i}`,
    skuCode: `PNH ${i}`,
    productName: `sản phẩm ${i}`,
    unit: `${i} cái`,
    quantity: 'UI là input nhập vào nhưng để tạm này nha, có API xử lý sau',
    bill: ` ${i}00.000 VNĐ`,
    moneyTotal: `${i}00.000 VNĐ`,
    actions: <div><DeleteOutlined style={{ color: 'red', fontSize: '1.5rem' }} /></div>
  });
}
for (let i = 0; i < 46; i++) {
  data2.push({
    key: i,
    stt: `${i} Bill 2`,
    skuCode: `PNH ${i} Bill 2`,
    productName: `sản phẩm ${i} Bill 2`,
    unit: `${i} cái Bill 2`,
    quantity: 'UI là input nhập vào nhưng để tạm này nha, có API xử lý sau Bill 2',
    bill: ` ${i}00.000 VNĐ Bill 2`,
    moneyTotal: `${i}00.000 VNĐ Bill 2`,
    actions: <div><DeleteOutlined style={{ color: 'red', fontSize: '1.5rem' }} /></div>
  });
}
const { Option } = Select;
function callback(key) {
  console.log(key);
}
export default function Sell() {
  const [form] = Form.useForm()
  const [shipping, setShipping] = useState([])
  const [customerOddMain, setCustomerOddMain] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [randomPhoneValue, setRandomPhoneValue] = useState()
  const [modal3Visible, setModal3Visible] = useState(false)
  const [category, setCategory] = useState([])
  const [paymentStatus, setPaymentStatus] = useState("")
  const [shippingStatus, setShippingStatus] = useState("")
  const [districtMainAPI, setDistrictMainAPI] = useState([])
  const [customerOnClick, setCustomerOnClick] = useState([])
  const [selectedRowKeysOrderList, setSelectedRowKeysOrderList] = useState([])
  const [selectedRowKeysOrderDetail, setSelectedRowKeysOrderDetail] = useState([])
  const [loadingOrderList, setLoadingOrderList] = useState(false)
  const [listMoney, setListMoney] = useState([])
  const [objectVariant, setObjectVariant] = useState({})
  const [record, setRecord] = useState({})
  const [recordMini, setRecordMini] = useState([])
  const typingTimeoutRef = useRef(null);
  const [valueSearchCustomer, setValueSearchCustomer] = useState('')
  const [valueSearch, setValueSearch] = useState('')
  const [orderToday, setOrderToday] = useState()
  const [visibleOrderList, setVisibleOrderList] = useState(false)
  const [start, setStart] = useState('')
  const [formatMoney, setFormatMoney] = useState('');
  const [mark, setMark] = useState([])
  const [customer, setCustomer] = useState([])
  const [customerBackup, setCustomerBackup] = useState([])
  const [indexMark, setIndexMark] = useState('')
  const { Search } = Input;
  const [status, setStatus] = useState(0);
  const [countTable, setCountTable] = useState(0)
  const [end, setEnd] = useState('')
  const [userEmployee, setUserEmployee] = useState({})
  const [clear, setClear] = useState(-1)
  const [taxDefault, setTaxDefault] = useState(['VAT'])
  const [loadingTable, setLoadingTable] = useState(false)
  const [valueSearchOrderDetail, setValueSearchOrderDetail] = useState('')
  const [taxPercentValue, setTaxPercentValue] = useState(0)
  const [receiveMethod, setReceiveMethod] = useState("2")
  const [orderStatus, setOrderStatus] = useState('order now')
  const [paymentMethod, setPaymentMethod] = useState('1')
  const [taxMoneyValue, setTaxMoneyValue] = useState(0)
  const [visibleOrder, setVisibleOrder] = useState(false)
  const [order, setOrder] = useState([])
  const [voucher, setVoucher] = useState("")
  const [discount, setDiscount] = useState(0)
  const [orderDetail, setOrderDetail] = useState([])
  const [receiveMethodName, setReceiveMethodName] = useState('')
  const [paymentForm, setPaymentForm] = useState()
  const [discountMoney, setDiscountMoney] = useState(0)
  const [moneyTemp, setMoneyTemp] = useState(0)
  const [moneyFinishBackup, setMoneyFinishBackup] = useState(0)
  const [promotionValue, setPromotionValue] = useState('default')
  const [visible, setVisible] = useState(false)
  const [colorChoose, setColorChoose] = useState('')
  const [voucherSave, setVoucherSave] = useState('')
  const [voucherSaveCheck, setVoucherSaveCheck] = useState(-1)
  const [sizeChoose, setSizeChoose] = useState('')
  const [tax, setTax] = useState([])
  const [branchId, setBranchId] = useState('')
  const dispatch = useDispatch()
  const [promotion, setPromotion] = useState([])
  const [promotionMain, setPromotionMain] = useState([])
  const [value, setValue] = useState('18');
  const [valueSex, setValueSex] = useState('Nam');
  const [branch, setBranch] = useState([])
  const [modal2Visible, setModal2Visible] = useState(false)
  const [product, setProduct] = useState([])
  const [note, setNote] = useState('')
  const [districtMain, setDistrictMain] = useState([])
  const apiDistrictData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiDistrict();
      console.log(res)
      if (res.status === 200) {
        setDistrictMain(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    if (billQuantity && billQuantity.length > 0) {
      <Offline>
        {
          localStorage.setItem('bill', JSON.stringify(billQuantity && billQuantity.length > 0 ? billQuantity : []))
        }
      </Offline>
    }



  })
  const [provinceMain, setProvinceMain] = useState([])
  const apiProvinceData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiProvince();
      console.log(res)
      if (res.status === 200) {
        setProvinceMain(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiDistrictData();
  }, []);
  useEffect(() => {
    apiProvinceData();
  }, []);
  const getAllCustomerData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await getCustomer({ page: 1, page_size: 50 });
      console.log(res)
      console.log("__________312")
      if (res.status === 200) {

        setCustomerBackup(res.data.data)
        dispatch({ type: ACTION.LOADING, data: false });

      }

      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    getAllCustomerData()
  }, [])
  const apiProductCategoryDataMerge = async (value) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const branch_id = JSON.parse(localStorage.getItem('branch_id'))

      const res = await apiProductCategoryMerge({ branch: branch_id.data.branch.branch_id });
      console.log(res)
      console.log("_________________________________________________7777777777777777777777777")
      if (res.status === 200) {


        setCategory(res.data.data)

      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiProductCategoryDataMerge()
  }, [])

  const modal3VisibleModal = (modal3Visible) => {
    setModal3Visible(modal3Visible)
  }
  const onSelectChangeOrderList = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeysOrderList(selectedRowKeys)

  };
  const rowSelectionOrderList = {
    selectedRowKeysOrderList,
    onChange: onSelectChangeOrderList,
  };
  const apiAllShippingData = async (value) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await apiAllShipping(value);
      console.log(res)
      console.log('___________123123')
      if (res.status === 200) {
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (values.active) {
            array.push(values)
          }
        })
        setShipping([...array])

      } else {
        openNotificationErrorAddCustomer()
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiAllShippingData()
  }, [])
  const onSelectChangeOrderDetail = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeysOrderDetail(selectedRowKeys)

  };
  const rowSelectionOrderDetail = {
    selectedRowKeysOrderDetail,
    onChange: onSelectChangeOrderDetail,
  };
  const showDrawerOrderList = () => {
    setVisibleOrderList(true)
  };
  function callbackOrderList(key) {
    console.log(key);
  }
  const onCloseOrderList = () => {
    setVisibleOrderList(false)
  };
  const getAllPromotionData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await getAllPromotion();
      console.log(res)
      console.log("___________11111111111_____")
      if (res.status === 200) {

        var array = []
        res.data.data && res.data.data.forEach((values, index) => {
          if (values.active) {
            array.push(values)
          }
        })
        setPromotion([...array])
        setPromotionMain(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const apiAllOrderData = async () => {
    try {
      //   dispatch({ type: ACTION.LOADING, data: true });
      setLoadingTable(true)
      const res = await apiAllOrder({ page: 1, page_size: 10 });
      console.log(res)

      console.log("___________11111111111222222222222_____")
      if (res.status === 200) {
        setCountTable(res.data.count)
        setOrder(res.data.data)
        let now = moment();
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (moment(values.create_date).format('YYYY-MM-DD') === now.format("YYYY-MM-DD")) {
            array.push(values)
          }
        })
        setOrderToday([...array])
      }
      //dispatch({ type: ACTION.LOADING, data: false });
      setLoadingTable(false)
    } catch (error) {
      setLoadingTable(false)
      // dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    getAllPromotionData()
  }, [])
  useEffect(() => {
    apiAllOrderData()
  }, [])
  const apiAllUserData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllUser();
      console.log(res)
      console.log("991")
      if (res.status === 200) {
        const username = localStorage.getItem("username")
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (username === values.username) {
            setUserEmployee(values)
          }
        })


      }
      // setSupplier(res.data.data)
      // if (res.status === 200) {
      //   setBranch(res.data.data)
      // }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  useEffect(() => {
    apiAllUserData();
  }, []);
  const apiAllTaxData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiAllTax();
      console.log(res)
      if (res.status === 200) {
        setTax(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiAllTaxData()
  }, [])
  const onChangeNote = (e) => {
    setNote(e.target.value)
  }
  const onChangeBirthday = e => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };
  const onChangeSex = e => {
    console.log('radio checked', e.target.value);
    setValueSex(e.target.value);
  };
  const showDrawerOrder = () => {
    setVisibleOrder(true)
  };

  const onCloseOrder = () => {
    setVisibleOrder(false)
  };

  const showDrawer = () => {
    setVisible(true)
    setRandomPhoneValue(randomPhone())
  };

  const onClose = () => {
    setVisible(false)
  };

  const onChangeFormatMoney = (e) => {
    const { value } = e.target;
    const format = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    setFormatMoney(format);
  }
  const modal2VisibleModal = (modal2Visible) => {
    setModal2Visible(modal2Visible)
  }

  const onClickModal2Visible = (values3, record2) => {
    setCheckVariantSize([])
    setCheckVariantColor([])
    setSize(-1)
    setColor(-1)
    if (billQuantity && billQuantity.length > 0) {

      var count = 0;
      var array = [...billQuantity]
      array[billIndex].forEach((values1, index1) => {
        if (values1.sku === values3.sku) {
          count++
        }



      })
      if (count > 0) {
        openNotificationAddProductErrorAddProduct()
      } else {

        setModal2Visible(true)
        setObjectVariant(values3)
        setRecord(record2)

      }
    }
    else {
      openNotificationAddProductError()
    }
  }


  const onSearch = (e) => {
    if (e.target.value === "" || e.target.value === "default" || e.target.value === " ") {
      setProductSearch([])
      setValueSearch("")
    } else {
      setValueSearch(e.target.value)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        const value = e.target.value;
        apiSearchData(value);
      }, 300);
    }

  }

  const onSearchCustomer = (e) => {
    if (e.target.value === "" || e.target.value === "default" || e.target.value === " ") {
      // setProductSearch([])
      setValueSearchCustomer("")
      setCustomerOnClick([])
      setCustomer([])
      setCustomerOddMain(false)
      var arrayCustomerSelect = [...billQuantity]
      arrayCustomerSelect[billIndex][0].customer = []
      setBillQuantity([...arrayCustomerSelect])
    } else {
      setValueSearchCustomer(e.target.value)
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        const value = e.target.value;
        getCustomerData(value);
      }, 1000);
    }

  }
  const onChangeVoucher = (e) => {
    if (e.target.value === "" || e.target.value === "default" || e.target.value === " ") {
      setVoucher("")
    } else {
      setVoucher(e.target.value)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      typingTimeoutRef.current = setTimeout(() => {
        const value = e.target.value;
        apiCheckPromotionData({ voucher: value }, 1)
      }, 1000);
    }

  }
  const onClickStatus = (data) => {
    setStatus(data);

  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  const onClickProduct = () => {
    setProduct([])
  }

  function onChangeCustomerMoney(value) {
    console.log('changed', value);
  }
  const contentFormatMoney = (
    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
      <div style={{ color: 'black', fontWeight: '600' }}>{formatMoney ? `${formatMoney} VNĐ` : `0 VNĐ`}</div>
    </div>
  );
  const [count, setCount] = useState(0)
  const apiAllProductData = async () => {
    // setLoading(true)
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiSearchProduct({ page: 1, page_size: 10 })
      console.log(res)
      console.log('--------------------------')
      if (res.status === 200) {
        setProduct(res.data.data)
        setCount(res.data.count)
      }
      // setLoading(false)
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {
      // setLoading(false)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  const [payment, setPayment] = useState([])
  const getAllPaymentData = async () => {
    // setLoading(true)
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await getAllPayment()
      console.log(res)
      console.log('--------------------------')
      if (res.status === 200) {
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (values.active) {
            array.push(values)
          }
        })
        setPayment([...array])
      }
      // setLoading(false)
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {
      // setLoading(false)
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  useEffect(() => {
    getAllPaymentData()
  }, [])
  useEffect(() => {
    apiAllProductData()
  }, [])
  const apiSearchProductDataPage = async (data, data1) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true })

      const res = await apiSearchProduct({ page: data, page_size: data1 })
      console.log(res)
      if (res.status === 200) {
        setProduct(res.data.data)
        setCount(res.data.count)
      }
      dispatch({ type: ACTION.LOADING, data: false })
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      dispatch({ type: ACTION.LOADING, data: false })
    }
  }
  function onShowSizeChange(current, pageSize) {
    console.log(current, pageSize)
    if (current && pageSize) {
      apiSearchProductDataPage(current, pageSize)
    }
  }
  function onChangeWork(pageNumber) {
    console.log('Page: ', pageNumber)
    apiSearchProductDataPage(pageNumber, 10)
  }

  const onClickMarkVariant = (index) => {

    setIndexMark(index)
    // if (billQuantity && billQuantity.length > 0) {
    //   var array = [...mark]
    //   array.push(index)
    //   setMark([...array])
    // } else {

    // }

  }
  const onClickMark = (index) => {

    if (billQuantity && billQuantity.length > 0) {
      var array = [...billQuantity[billIndex][0].mark]
      array.push(index)
      setMark([...array])
      var arrayBillQuantity = [...billQuantity]
      arrayBillQuantity[billIndex][0].mark = array
      setBillQuantity([...arrayBillQuantity])
    } else {

    }

  }
  function formatCash(str) {
    return str
      .split('')
      .reverse()
      .reduce((prev, next, index) => {
        return (index % 3 ? next : next + ',') + prev
      })
  }
  const openNotificationAddProductErrorBill = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Voucher không tồn tại hoặc đã được sử dụng.',
    });
  };

  const openNotificationVoucherError = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description:
        'Chỉ tạo được tối đa 5 hóa đơn.',
    });
  };
  const openNotificationVoucherErrorNew = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description:
        'Hóa đơn mới tạo không thể xóa.',
    });
  };
  const [arrayRandom, setArrayRandom] = useState([1, 2, 3, 4, 5])
  const [billQuantity, setBillQuantity] = useState([])
  const onClickCreateBill = () => {

    setConfirm(1)
    if (billQuantity && billQuantity.length > 4) {
      openNotificationVoucherError()
    } else {
      var arrayResult = [...arrayRandom]
      arrayResult.forEach((values, index) => {
        if (index === 0) {
          setBillName(`1000${values}`)
          const object = [{ values: values, mark: [], customer: [] }]
          var array = [...billQuantity]
          array.push(object)
          setBillQuantity([...array])
          arrayResult.splice(index, 1)
          setArrayRandom([...arrayResult])





          setBillQuantityStatus(values)
          setBillIndex(array.length - 1)
          setDiscount(0)
          setValueSearchCustomer("")
          setPromotionValue('default')
          var moneyTotalItem = 0;
          array[array.length - 1].forEach((values30, index30) => {
            if (index30 !== 0) {
              moneyTotalItem += values30.total_cost
            }
          })
          setMoneyTotal(moneyTotalItem)





          var taxPercent = 0;
          tax && tax.length > 0 && tax.forEach((values40, index40) => {
            taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
              if (values40.name === values41) {
                var numberValue = values40.value.split('%')[0]

                console.log(numberValue)
                taxPercent += parseInt(numberValue)
              }
            })
          })
          console.log(taxPercent)
          console.log("____555")
          var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
          var result = moneyTotalTemp - moneyTotalItem;
          setTaxPercentValue(taxPercent)
          setTaxMoneyValue(result)
          setMoneyFinish(moneyTotalTemp)
        }
      })
    }



  }
  const [confirm, setConfirm] = useState(-1)
  const onClickDeleteBillQuantity = (index, randomName) => {
    console.log(index)
    console.log(billIndex)
    console.log("______________________neeeeeeeeeeee")
    setMoneyPredict([])
    setOrderStatus("order now")
    setPaidCustomerMoney("")
    setPaymentMethod("1")
    setNote("")
    setReceiveMethod("2")
    setTaxDefault(['VAT'])
    setVoucher("")
    setPromotionValue("default")
    var array = [...billQuantity]
    console.log(index)
    setValueSearchCustomer("")
    console.log(array[array.length - 1])
    array.splice(index, 1)
    console.log(array)
    console.log(array.length)
    console.log("_______666")



    if (array && array.length === 0) {
      setBillName('')
    }
    //&& index !== 0
    if (array.length > 0) {
      var checkValue = 0;
      array.forEach((values1, index1) => {
        if (values1.length > 1) {
          checkValue++
        }

        if (values1 && values1.length > 0) {
          values1.forEach((values2, index2) => {
            if (index2 === 0) {

              if (index !== 0) {


                if (array && array.length === 1) {
                  setBillQuantityStatus(values2.values) //
                  setBillName(`1000${values2.values}`)
                  if (billQuantity && billQuantity.length > 0) {
                    var count = 0;
                    billQuantity.forEach((values00, index00) => {

                      values00.forEach((values100, index100) => {
                        if (index100 === 0) {
                          if (values2.values === values100.values) {
                            //     
                            count++;
                          }
                        }
                      })
                    })
                    //  && 
                    if (moneyFinish > 0) {
                      if (count > 0) {
                        // alert('123')
                        setConfirm(1)
                      } else {
                        setConfirm(0)
                      }

                    } else {


                    }
                  } else {

                  }



                } else {
                  setBillQuantityStatus(-1)
                  if (billQuantity && billQuantity.length > 0) {
                    var count = 0;
                    billQuantity.forEach((values, index) => {
                      values.forEach((values1, index1) => {
                        if (index1 === 0) {
                          if (-1 === values1.values) {
                            //     
                            count++;
                          }
                        }
                      })
                    })
                    //  && 
                    if (moneyFinish > 0) {
                      if (count > 0) {
                        // alert('123')
                        setConfirm(1)
                      } else {
                        setConfirm(0)
                      }

                    } else {


                    }
                  } else {

                  }
                }
              }
              else {
                // alert('123')
                if (array && array.length === 1) {
                  setBillQuantityStatus(-1)
                  if (billQuantity && billQuantity.length > 0) {
                    var count = 0;
                    billQuantity.forEach((values, index) => {
                      values.forEach((values1, index1) => {
                        if (index1 === 0) {
                          if (-1 === values1.values) {
                            //     
                            count++;
                          }
                        }
                      })
                    })
                    //  && 
                    if (moneyFinish > 0) {
                      if (count > 0) {
                        // alert('123')
                        setConfirm(1)
                      } else {
                        setConfirm(0)
                      }

                    } else {


                    }
                  } else {

                  }
                } else {
                  setBillQuantityStatus(-1)
                  if (billQuantity && billQuantity.length > 0) {
                    var count = 0;
                    billQuantity.forEach((values, index) => {
                      values.forEach((values1, index1) => {
                        if (index1 === 0) {
                          if (-1 === values1.values) {
                            //     
                            count++;
                          }
                        }
                      })
                    })
                    //  && 
                    if (moneyFinish > 0) {
                      if (count > 0) {
                        // alert('123')
                        setConfirm(1)
                      } else {
                        setConfirm(0)
                      }

                    } else {


                    }
                  } else {

                  }
                }

              }
            } else {


            }
          })

        }


      })
      if (checkValue === 0) {
        setConfirm(-1)
      }
    }

    if (array && array.length === 1) {
      var moneyTotalItem = 0;
      if (index - 1 >= 0) {
        array[index - 1].forEach((values30, index30) => {
          if (index30 !== 0) {
            moneyTotalItem += values30.total_cost
          }
        })
        setMoneyTotal(moneyTotalItem)
        var taxPercent = 0;
        tax && tax.length > 0 && tax.forEach((values40, index40) => {
          taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
            if (values40.name === values41) {
              var numberValue = values40.value.split('%')[0]

              console.log(numberValue)
              taxPercent += parseInt(numberValue)
            }
          })
        })
        console.log(taxPercent)
        console.log("____555")
        var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
        var result = moneyTotalTemp - moneyTotalItem;
        setTaxPercentValue(taxPercent)
        setTaxMoneyValue(result)
        setMoneyFinish(moneyTotalTemp)
      }

    }
    setBillQuantity([...array])
    if (index === 0) {
      setBillIndex(array && array.length > 0 ? 0 : 0)
    } else {
      setBillIndex(array && array.length > 0 ? array.length - 1 : 0)
    }
    var random = [...arrayRandom]
    random.push(randomName)
    setArrayRandom([...random])
  }
  const contentHoverVariant = (url) => {
    return (

      <img src={url} style={{ width: '35rem', height: '17.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', objectFit: 'contain' }} alt="" />

    )

  }

  const [quantity, setQuantity] = useState(1)
  const [color, setColor] = useState(-1)
  const [colorSizeArray, setColorSizeArray] = useState([])
  const [sizeArrray, setSizeArray] = useState([])
  const [checkVariantColor, setCheckVariantColor] = useState([])
  const [checkVariantSize, setCheckVariantSize] = useState([])
  const [checkQuantity, setCheckQuantity] = useState([])
  const onClickColor = (index, data1) => {
    setColor(index)
    setColorChoose(data1)
    var array = [...colorSizeArray]
    array.push(data1)
    setColorSizeArray([...array])
    var count = [];

    objectVariant && objectVariant.options && objectVariant.options.length > 0 && objectVariant.options.forEach((values1, index1) => {
      if (index1 === 0) {
        if (values1.values.toLowerCase() === data1.toLowerCase()) {
          count.push(1)
          setCheckVariantColor([...count])
        } else {

          setCheckVariantColor([2, 3])
        }
      }
    })
  }
  const [size, setSize] = useState(-1)
  const onClickSize = (index, data1) => {
    setSize(index)
    setSizeChoose(data1)
    var array = [...colorSizeArray]
    array.push(data1)
    setColorSizeArray([...array])
    var count = [];
    objectVariant && objectVariant.options && objectVariant.options.length > 0 && objectVariant.options.forEach((values1, index1) => {
      if (index1 === 1) {
        if (values1.values.toLowerCase() === data1.toLowerCase()) {
          count.push(1)
          setCheckVariantSize([...count])
        } else {

          setCheckVariantSize([2, 3])
        }
      }
    })
    console.log(objectVariant)
    console.log(data1)
    console.log(count)
    console.log("------------------")
  }
  const increase = () => {
    let quantity1 = parseInt(quantity) + 1;
    if (isNaN(quantity1)) {
      openNotificationErrorQuantityCheck()
    } else {
      setQuantity(quantity1)
      var quantityCheck = []
      console.log(objectVariant.quantity)
      console.log("___123")
      var quantityTotal = parseInt(objectVariant.available_stock_quantity) + parseInt(objectVariant.low_stock_quantity)
      if (orderStatus === 'order now') {
        if (quantityTotal >= parseInt(quantity1)) {
          setCheckQuantity([])
          if (parseInt(quantity1) <= 0) {
            setQuantity(1)
          } else {
            setQuantity(quantity1)
          }
        }
        else {
          console.log(objectVariant)
          console.log("___123123")
          setQuantity(quantityTotal)
          openNotificationErrorQuantityAvailable(objectVariant.title, quantityTotal)
          // quantityCheck.push(1)
          // setCheckQuantity([...quantityCheck])
        }
      } else {
        if (parseInt(quantity1) <= 0) {
          setQuantity(1)
        } else {
          setQuantity(quantity1)
        }
      }

    }


  }
  const decline = () => {
    let quantity1 = quantity - 1;
    if (quantity1 === 0 || quantity1 === 1) {
      quantity1 = 1;
    }
    if (isNaN(quantity1)) {
      openNotificationErrorQuantityCheck()
    } else {
      setQuantity(quantity1)
      var quantityCheck = []
      console.log(objectVariant.quantity)
      console.log("___123")
      var quantityTotal = parseInt(objectVariant.available_stock_quantity) + parseInt(objectVariant.low_stock_quantity)
      if (orderStatus === 'order now') {
        if (quantityTotal >= parseInt(quantity1)) {
          setCheckQuantity([])
          if (parseInt(quantity1) <= 0) {
            setQuantity(1)
          } else {
            setQuantity(quantity1)
          }
        }
        else {
          console.log(objectVariant)
          console.log("___123123")
          setQuantity(quantityTotal)
          openNotificationErrorQuantityAvailable(objectVariant.title, quantityTotal)
          quantityCheck.push(1)
          setCheckQuantity([...quantityCheck])
        }
      } else {
        if (parseInt(quantity1) <= 0) {
          setQuantity(1)
        } else {
          setQuantity(quantity1)
        }
      }

    }


  }
  // const decline = () => {
  //   let quantity1 = quantity - 1;
  //   if (quantity1 === 0 || quantity1 === 1) {
  //     quantity1 = 1;
  //   }
  //   var quantityCheck = []
  //   console.log(objectVariant.quantity)
  //   console.log("___123")
  //   setQuantity(quantity1)
  //   var quantityTotal = parseInt(objectVariant.available_stock_quantity) + parseInt(objectVariant.low_stock_quantity)
  //   if (quantityTotal >= parseInt(quantity1)) {
  //     setCheckQuantity([])

  //   }
  //   else {
  //     quantityCheck.push(1)
  //     setCheckQuantity([...quantityCheck])
  //   }
  // };
  const openNotificationErrorQuantityCheck = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Số lượng phải là số nguyên.',
    });
  };
  const onChangeQuantity = (e) => {
    if (isNaN(e.target.value)) {
      openNotificationErrorQuantityCheck()
    } else {
      setQuantity(e.target.value)
      var quantityCheck = []
      console.log(objectVariant.quantity)
      console.log("___123")
      var quantityTotal = parseInt(objectVariant.available_stock_quantity) + parseInt(objectVariant.low_stock_quantity)
      if (orderStatus === 'order now') {
        if (quantityTotal >= parseInt(e.target.value)) {
          setCheckQuantity([])
          if (parseInt(e.target.value) <= 0) {
            setQuantity(1)
          } else {
            setQuantity(e.target.value)
          }
        }
        else {
          console.log(objectVariant)
          console.log("___123123")
          setQuantity(quantityTotal)
          openNotificationErrorQuantityAvailable(objectVariant.title, quantityTotal)
          // quantityCheck.push(1)
          // setCheckQuantity([...quantityCheck])
        }
      } else {
        setCheckQuantity([])
        if (parseInt(e.target.value) <= 0) {
          setQuantity(1)
        } else {
          setQuantity(e.target.value)
        }
      }

    }


  }
  const openNotificationAddProductError = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Bạn chưa tạo hóa đơn.',
    });
  };




  const [roleName, setRoleName] = useState('')
  useEffect(() => {
    const branch_id = JSON.parse(localStorage.getItem('branch_id'))
    setRoleName(branch_id.data.role.name.toLowerCase())
    setBranchId(branch_id.data.branch.branch_id)


  }, [])
  const [productSelect, setProductSelect] = useState([])
  const apiProductSellerData = async (e) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiProductSeller({ branch: branchId, page: 1, page_size: 50 });
      console.log(res)
      console.log("|||0000001112222222222")
      if (res.status === 200) {
        var array = []

        const branch_id = JSON.parse(localStorage.getItem('branch_id'))

        // res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
        //   console.log(values)
        //   if (values.branch === branch_id.data.branch.branch_id) {
        //     array.push(values)
        //   }
        // })
        console.log("|||000000222")
        setProductSelect(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const apiProductSellerDataMain = async (e) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiProductSeller({ branch: e });
      console.log(res)
      console.log("|||000000111")
      if (res.status === 200) {
        setProductSelect(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    apiProductSellerData()
  }, [])
  const handleChange = (e) => {
    setBranchId(e)
    apiProductSellerDataMain(e)
  }
  const [city, setCity] = useState('')
  const handleChangeCustomer = async (value) => {
    console.log(`selected ${value}`);
    // setCity(value)
    // if (value !== 'default') {
    //   apiSearchProvinceData(value)
    // } else {
    //   await getAllStoreData()
    // }
  }
  const [branchDetail, setBranchDetail] = useState({})
  const getAllBranchData = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await getAllBranch();
      console.log(res)
      console.log("|||000000111")
      if (res.status === 200) {
        var object = {}
        const branch_id = JSON.parse(localStorage.getItem('branch_id'))

        res.data.data && res.data.data.forEach((values, index) => {
          console.log(values)
          console.log(branchId)
          console.log('_______66666')
          if (values.branch_id === branch_id.data.branch.branch_id) {
            object = values

          }
        })
        setBranchDetail(object)
        console.log(object)
        console.log("_______________________99988877666")
        setBranch(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  useEffect(() => {
    getAllBranchData();
  }, []);
  console.log(branchId)
  console.log("---333")
  const [billIndex, setBillIndex] = useState(0)
  const [billQuantityStatus, setBillQuantityStatus] = useState(1)
  const [billName, setBillName] = useState('')
  const onClickBillIndex = (index, status, name) => {
    setConfirm(1)
    setBillName(String(name))
    setBillQuantityStatus(status)
    setBillIndex(index)
    setDiscount(0)
    setValueSearchCustomer("")
    setPromotionValue('default')
    var array = [...billQuantity]
    var moneyTotalItem = 0;
    array[index].forEach((values30, index30) => {
      if (index30 !== 0) {
        moneyTotalItem += values30.total_cost
      }
    })
    setMoneyTotal(moneyTotalItem)





    var taxPercent = 0;
    tax && tax.length > 0 && tax.forEach((values40, index40) => {
      taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
        if (values40.name === values41) {
          var numberValue = values40.value.split('%')[0]

          console.log(numberValue)
          taxPercent += parseInt(numberValue)
        }
      })
    })
    console.log(taxPercent)
    console.log("____555")
    var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
    var result = moneyTotalTemp - moneyTotalItem;
    setTaxPercentValue(taxPercent)
    setTaxMoneyValue(result)
    setMoneyFinish(moneyTotalTemp)
  }
  const openNotificationAddProductErrorAddProduct = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Sản phẩm đã thêm.',
    });
  };
  const openNotificationAddProductErrorAddProductSuccess = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm sản phẩm vào hóa đơn thành công.',
    });
  };
  const openNotificationErrorQuantityTotal = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Sản phẩm này đã hết hàng.',
    });
  };
  const [moneyTotal, setMoneyTotal] = useState(0)
  const [moneyFinish, setMoneyFinish] = useState(0)
  const [moneyPredict, setMoneyPredict] = useState([])
  const [moneyPredictValue, setMoneyPredictValue] = useState('')
  const [paidCustomerMoney, setPaidCustomerMoney] = useState('')
  const [indexPaymentMoney, setIndexPaymentMoney] = useState(-1)
  const onClickPredictMoney = (e, index) => {
    console.log(e)
    setIndexPaymentMoney(index)
    setMoneyPredictValue(e)
    var result = parseInt(e) - parseInt(moneyFinish)
    setPaidCustomerMoney(String(result))
  }

  const onClickAddProductSimple = (record1) => {
    console.log(record1)
    console.log("___________456456")
    var quantityTotal = parseInt(record1.available_stock_quantity) + parseInt(record1.low_stock_quantity)
    if (quantityTotal > 0) {
      if (billQuantity && billQuantity.length > 0) {

        setRecord(record1)
        var array = [...billQuantity]

        if (array[billIndex].length === 0) {
          array[billIndex].push({ quantityAvailable: quantityTotal, sale_price: record1.sale_price, title: record1.name, product_id: record1.product_id, sku: record1.sku, supplier: record1.suppliers, options: [], quantity: 1, total_cost: (1 * record1.sale_price), voucher: '', discount: 0, final_cost: 0 })
          openNotificationAddProductErrorAddProductSuccess()
          setBillQuantity([...array])


          var moneyTotalItem = 0;
          array[billIndex].forEach((values30, index30) => {
            if (index30 !== 0) {
              moneyTotalItem += values30.total_cost
            }
          })
          setMoneyTotal(moneyTotalItem)
          var taxPercent = 0;
          tax && tax.length > 0 && tax.forEach((values40, index40) => {
            taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
              if (values40.name === values41) {
                var numberValue = values40.value.split('%')[0]

                console.log(numberValue)
                taxPercent += parseInt(numberValue)
              }
            })
          })
          console.log(taxPercent)
          console.log("____555")
          var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
          var result = moneyTotalTemp - moneyTotalItem;
          setTaxPercentValue(taxPercent)
          setTaxMoneyValue(result)
          setMoneyFinish(moneyTotalTemp)

          setMoneyPredict(TienThoi(parseInt(moneyTotalTemp)))
        } else {
          var count = 0;
          array[billIndex].forEach((values1, index1) => {
            if (values1.sku === record1.sku) {
              count++
            }
            var result = array[billIndex].findIndex(x => x.sku === record1.sku)
            if (result === -1) {
              array[billIndex].push({ quantityAvailable: quantityTotal, sale_price: record1.sale_price, title: record1.name, product_id: record1.product_id, sku: record1.sku, supplier: record1.suppliers, options: [], quantity: 1, total_cost: (1 * record1.sale_price), voucher: '', discount: 0, final_cost: 0 })
              openNotificationAddProductErrorAddProductSuccess()
              setBillQuantity([...array])
              var moneyTotalItem = 0;
              array[billIndex].forEach((values30, index30) => {
                if (index30 !== 0) {
                  moneyTotalItem += values30.total_cost
                }
              })
              setMoneyTotal(moneyTotalItem)
              var taxPercent = 0;
              tax && tax.length > 0 && tax.forEach((values40, index40) => {
                taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
                  if (values40.name === values41) {
                    var numberValue = values40.value.split('%')[0]

                    console.log(numberValue)
                    taxPercent += parseInt(numberValue)
                  }
                })
              })
              console.log(taxPercent)
              console.log("____555")
              var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
              var result = moneyTotalTemp - moneyTotalItem;
              setTaxPercentValue(taxPercent)
              setTaxMoneyValue(result)
              setMoneyFinish(moneyTotalTemp)
              setMoneyPredict(TienThoi(parseInt(moneyTotalTemp)))
            }

          })

        }




        if (count > 0) {
          openNotificationAddProductErrorAddProduct()
        }



      } else {
        openNotificationAddProductError()
      }
    } else {

      openNotificationErrorQuantityTotal()
    }

  }
  const onClickAddProduct = (objectVariant1, record1) => {
    // setModal2Visible(false)
    console.log(record1)
    console.log("123123123")
    if (billQuantity && billQuantity.length > 0) {
      var array = [...billQuantity]
      setRecord(record1)
      console.log(colorChoose)
      console.log(sizeChoose)
      console.log("---123")
      // array[billIndex].forEach((values1, index1) => {
      //   if (values1.product_id === objectVariant1.product_id) {
      //     array[billIndex][index1] = { ...values1, quantity: objectVariant1.quantity + 1 }
      //   } else {

      //   }
      // })

      if (array[billIndex].length === 0) {
        array[billIndex].push({ sale_price: objectVariant1.sale_price, title: objectVariant1.title, product_id: record1.product_id, sku: objectVariant1.sku, supplier: objectVariant1.supplier, options: objectVariant1.options, quantity: objectVariant1.quantity, total_cost: objectVariant1.quantity * objectVariant1.sale_price, voucher: '', discount: 0, final_cost: 0 })
        openNotificationAddProductErrorAddProductSuccess()
        setBillQuantity([...array])
      } else {
        var count = 0;
        array[billIndex].forEach((values1, index1) => {
          if (values1.sku === objectVariant1.sku) {
            count++
          }
          console.log(values1.sku)
          console.log("|||0009999")
          console.log(objectVariant1.sku)
          var result = array[billIndex].findIndex(x => x.sku === objectVariant1.sku)
          if (result === -1) {
            array[billIndex].push({ sale_price: objectVariant1.sale_price, title: objectVariant1.title, product_id: record1.product_id, sku: objectVariant1.sku, supplier: objectVariant1.supplier, options: objectVariant1.options, quantity: objectVariant1.quantity, total_cost: objectVariant1.quantity * objectVariant1.sale_price, voucher: '', discount: 0, final_cost: 0 })
            setBillQuantity([...array])
            openNotificationAddProductErrorAddProductSuccess()
          }


        })
        if (count > 0) {
          openNotificationAddProductErrorAddProduct()
        }

      }

    } else {
      openNotificationAddProductError()
    }

  }
  const onClickAddProductVariant = () => {
    // setModal2Visible(false)
    console.log(record)
    console.log("123123123")
    var quantityTotal = parseInt(objectVariant.available_stock_quantity) + parseInt(objectVariant.low_stock_quantity)
    if (orderStatus === 'order now') {
      if (quantityTotal > 0) {
        if (billQuantity && billQuantity.length > 0) {
          var array = [...billQuantity]
          setRecord(record)
          console.log(colorChoose)
          console.log(sizeChoose)
          console.log("---123")
          // array[billIndex].forEach((values1, index1) => {
          //   if (values1.product_id === objectVariant1.product_id) {
          //     array[billIndex][index1] = { ...values1, quantity: objectVariant1.quantity + 1 }
          //   } else {

          //   }
          // })

          if (array[billIndex].length === 0) {
            array[billIndex].push({ quantityAvailable: quantityTotal, sale_price: objectVariant.sale_price, title: objectVariant.title, product_id: record.product_id, sku: objectVariant.sku, supplier: objectVariant.supplier, options: objectVariant.options, quantity: quantity, total_cost: quantity * objectVariant.sale_price, voucher: '', discount: 0, final_cost: 0 })
            openNotificationAddProductErrorAddProductSuccess()
            setBillQuantity([...array])
            modal2VisibleModal(false)




            setQuantity(1)
            if (billQuantity && billQuantity.length > 0) {
              var array9 = [...billQuantity[billIndex][0].mark]
              array9.push(indexMark)
              setMark([...array9])

              var arrayBillQuantity = [...billQuantity]
              arrayBillQuantity[billIndex][0].mark = array9
              setBillQuantity([...arrayBillQuantity])



              var moneyTotalItem = 0;
              array[billIndex].forEach((values30, index30) => {
                if (index30 !== 0) {
                  moneyTotalItem += values30.total_cost
                }
              })
              setMoneyTotal(moneyTotalItem)




              var taxPercent = 0;
              tax && tax.length > 0 && tax.forEach((values40, index40) => {
                taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
                  if (values40.name === values41) {
                    var numberValue = values40.value.split('%')[0]

                    console.log(numberValue)
                    taxPercent += parseInt(numberValue)
                  }
                })
              })
              console.log(taxPercent)
              console.log("____555")
              var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
              var result = moneyTotalTemp - moneyTotalItem;
              setTaxPercentValue(taxPercent)
              setTaxMoneyValue(result)
              setMoneyFinish(moneyTotalTemp)
              setMoneyPredict(TienThoi(parseInt(moneyTotalTemp)))
            } else {

            }
          } else {
            var count = 0;
            array[billIndex].forEach((values1, index1) => {
              if (values1.sku === objectVariant.sku) {
                count++
              }
              console.log(values1.sku)
              console.log("|||0009999")
              console.log(objectVariant.sku)
              var result = array[billIndex].findIndex(x => x.sku === objectVariant.sku)
              if (result === -1) {
                array[billIndex].push({ quantityAvailable: quantityTotal, sale_price: objectVariant.sale_price, title: objectVariant.title, product_id: record.product_id, sku: objectVariant.sku, supplier: objectVariant.supplier, options: objectVariant.options, quantity: quantity, total_cost: quantity * objectVariant.sale_price, voucher: '', discount: 0, final_cost: 0 })
                setBillQuantity([...array])
                openNotificationAddProductErrorAddProductSuccess()
                modal2VisibleModal(false)
                setQuantity(1)
                if (billQuantity && billQuantity.length > 0) {
                  var array9 = [...billQuantity[billIndex][0].mark]
                  array9.push(indexMark)
                  setMark([...array9])
                  var arrayBillQuantity = [...billQuantity]
                  arrayBillQuantity[billIndex][0].mark = array9
                  setBillQuantity([...arrayBillQuantity])
                  var moneyTotalItem = 0;
                  array[billIndex].forEach((values30, index30) => {
                    if (index30 !== 0) {
                      moneyTotalItem += values30.total_cost
                    }
                  })
                  setMoneyTotal(moneyTotalItem)




                  var taxPercent = 0;
                  tax && tax.length > 0 && tax.forEach((values40, index40) => {
                    taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
                      if (values40.name === values41) {
                        var numberValue = values40.value.split('%')[0]

                        console.log(numberValue)
                        taxPercent += parseInt(numberValue)
                      }
                    })
                  })
                  console.log(taxPercent)
                  console.log("____555")
                  var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
                  var result = moneyTotalTemp - moneyTotalItem;
                  setTaxPercentValue(taxPercent)
                  setTaxMoneyValue(result)
                  setMoneyFinish(moneyTotalTemp)
                  setMoneyPredict(TienThoi(parseInt(moneyTotalTemp)))
                } else {

                }
              }


            })
            if (count > 0) {
              openNotificationAddProductErrorAddProduct()
            }

          }

        } else {
          openNotificationAddProductError()
        }
      } else {
        openNotificationErrorQuantityTotal()
      }
    } else {
      if (billQuantity && billQuantity.length > 0) {
        var array = [...billQuantity]
        setRecord(record)
        console.log(colorChoose)
        console.log(sizeChoose)
        console.log("---123")
        // array[billIndex].forEach((values1, index1) => {
        //   if (values1.product_id === objectVariant1.product_id) {
        //     array[billIndex][index1] = { ...values1, quantity: objectVariant1.quantity + 1 }
        //   } else {

        //   }
        // })

        if (array[billIndex].length === 0) {
          array[billIndex].push({ quantityAvailable: quantityTotal, sale_price: objectVariant.sale_price, title: objectVariant.title, product_id: record.product_id, sku: objectVariant.sku, supplier: objectVariant.supplier, options: objectVariant.options, quantity: quantity, total_cost: quantity * objectVariant.sale_price, voucher: '', discount: 0, final_cost: 0 })
          openNotificationAddProductErrorAddProductSuccess()
          setBillQuantity([...array])
          modal2VisibleModal(false)




          setQuantity(1)
          if (billQuantity && billQuantity.length > 0) {
            var array9 = [...billQuantity[billIndex][0].mark]
            array9.push(indexMark)
            setMark([...array9])

            var arrayBillQuantity = [...billQuantity]
            arrayBillQuantity[billIndex][0].mark = array9
            setBillQuantity([...arrayBillQuantity])



            var moneyTotalItem = 0;
            array[billIndex].forEach((values30, index30) => {
              if (index30 !== 0) {
                moneyTotalItem += values30.total_cost
              }
            })
            setMoneyTotal(moneyTotalItem)




            var taxPercent = 0;
            tax && tax.length > 0 && tax.forEach((values40, index40) => {
              taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
                if (values40.name === values41) {
                  var numberValue = values40.value.split('%')[0]

                  console.log(numberValue)
                  taxPercent += parseInt(numberValue)
                }
              })
            })
            console.log(taxPercent)
            console.log("____555")
            var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
            var result = moneyTotalTemp - moneyTotalItem;
            setTaxPercentValue(taxPercent)
            setTaxMoneyValue(result)
            setMoneyFinish(moneyTotalTemp)
            setMoneyPredict(TienThoi(parseInt(moneyTotalTemp)))
          } else {

          }
        } else {
          var count = 0;
          array[billIndex].forEach((values1, index1) => {
            if (values1.sku === objectVariant.sku) {
              count++
            }
            console.log(values1.sku)
            console.log("|||0009999")
            console.log(objectVariant.sku)
            var result = array[billIndex].findIndex(x => x.sku === objectVariant.sku)
            if (result === -1) {
              array[billIndex].push({ quantityAvailable: quantityTotal, sale_price: objectVariant.sale_price, title: objectVariant.title, product_id: record.product_id, sku: objectVariant.sku, supplier: objectVariant.supplier, options: objectVariant.options, quantity: quantity, total_cost: quantity * objectVariant.sale_price, voucher: '', discount: 0, final_cost: 0 })
              setBillQuantity([...array])
              openNotificationAddProductErrorAddProductSuccess()
              modal2VisibleModal(false)
              setQuantity(1)
              if (billQuantity && billQuantity.length > 0) {
                var array9 = [...billQuantity[billIndex][0].mark]
                array9.push(indexMark)
                setMark([...array9])
                var arrayBillQuantity = [...billQuantity]
                arrayBillQuantity[billIndex][0].mark = array9
                setBillQuantity([...arrayBillQuantity])
                var moneyTotalItem = 0;
                array[billIndex].forEach((values30, index30) => {
                  if (index30 !== 0) {
                    moneyTotalItem += values30.total_cost
                  }
                })
                setMoneyTotal(moneyTotalItem)




                var taxPercent = 0;
                tax && tax.length > 0 && tax.forEach((values40, index40) => {
                  taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
                    if (values40.name === values41) {
                      var numberValue = values40.value.split('%')[0]

                      console.log(numberValue)
                      taxPercent += parseInt(numberValue)
                    }
                  })
                })
                console.log(taxPercent)
                console.log("____555")
                var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
                var result = moneyTotalTemp - moneyTotalItem;
                setTaxPercentValue(taxPercent)
                setTaxMoneyValue(result)
                setMoneyFinish(moneyTotalTemp)
                setMoneyPredict(TienThoi(parseInt(moneyTotalTemp)))
              } else {

              }
            }


          })
          if (count > 0) {
            openNotificationAddProductErrorAddProduct()
          }

        }

      } else {
        openNotificationAddProductError()
      }
    }



  }
  const openNotificationErrorQuantityAvailable = (name, data) => {
    notification.warning({
      message: 'Nhắc nhở',
      description:
        <div>Số lượng sản phẩm <b>{name}</b> chỉ còn lại: <b style={{ color: 'red', fontSize: '1rem' }}>{data}</b></div>
    });
  };
  const onChangeQuantityBill = (value, index1, index2) => {
    setCount(0)
    setDiscount(0)
    setPromotionValue('default')
    if (value <= 0) {
      value = 1
      var array = [...billQuantity]
      array[index1][index2].quantity = value
      array[index1][index2].total_cost = value * array[index1][index2].sale_price
      console.log(array[index1][index2].quantity)
      setBillQuantity([...array])


      var moneyTotalItem = 0;
      array[index1].forEach((values30, index30) => {
        if (index30 !== 0) {
          moneyTotalItem += values30.total_cost
        }
      })
      setMoneyTotal(moneyTotalItem)



      var taxPercent = 0;
      tax && tax.length > 0 && tax.forEach((values40, index40) => {
        taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
          if (values40.name === values41) {
            var numberValue = values40.value.split('%')[0]

            console.log(numberValue)
            taxPercent += parseInt(numberValue)
          }
        })
      })
      console.log(taxPercent)
      console.log("____555")
      var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
      var result = moneyTotalTemp - moneyTotalItem;
      setTaxPercentValue(taxPercent)
      setTaxMoneyValue(result)
      setMoneyFinish(moneyTotalTemp)
    } else {
      var array = [...billQuantity]
      if (orderStatus === 'pre-order' || orderStatus === 'order list') {
        array[index1][index2].quantity = value
        array[index1][index2].total_cost = value * array[index1][index2].sale_price
        console.log(array[index1][index2].quantity)
        setBillQuantity([...array])


        var moneyTotalItem = 0;
        array[index1].forEach((values30, index30) => {
          if (index30 !== 0) {
            moneyTotalItem += values30.total_cost
          }
        })
        setMoneyTotal(moneyTotalItem)



        var taxPercent = 0;
        tax && tax.length > 0 && tax.forEach((values40, index40) => {
          taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
            if (values40.name === values41) {
              var numberValue = values40.value.split('%')[0]

              console.log(numberValue)
              taxPercent += parseInt(numberValue)
            }
          })
        })
        console.log(taxPercent)
        console.log("____555")
        var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
        var result = moneyTotalTemp - moneyTotalItem;
        setTaxPercentValue(taxPercent)
        setTaxMoneyValue(result)
        setMoneyFinish(moneyTotalTemp)
      } else {
        const quantityAvailableValue = array[index1][index2].quantityAvailable
        if (parseInt(value) > parseInt(quantityAvailableValue)) {
          array[index1][index2].quantity = quantityAvailableValue
          setBillQuantity([...array])
          openNotificationErrorQuantityAvailable(array[index1][index2].title, array[index1][index2].quantityAvailable)
        } else {

          array[index1][index2].quantity = value
          array[index1][index2].total_cost = value * array[index1][index2].sale_price
          console.log(array[index1][index2].quantity)
          setBillQuantity([...array])


          var moneyTotalItem = 0;
          array[index1].forEach((values30, index30) => {
            if (index30 !== 0) {
              moneyTotalItem += values30.total_cost
            }
          })
          setMoneyTotal(moneyTotalItem)



          var taxPercent = 0;
          tax && tax.length > 0 && tax.forEach((values40, index40) => {
            taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
              if (values40.name === values41) {
                var numberValue = values40.value.split('%')[0]

                console.log(numberValue)
                taxPercent += parseInt(numberValue)
              }
            })
          })
          console.log(taxPercent)
          console.log("____555")
          var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
          var result = moneyTotalTemp - moneyTotalItem;
          setTaxPercentValue(taxPercent)
          setTaxMoneyValue(result)
          setMoneyFinish(moneyTotalTemp)
        }
      }

    }
    // var { value, name } = e.target;


  }
  const onClickDeleteBillQuantityItem = (index1, index2, sku) => {
    var array = [...billQuantity]
    var arrayMark = [...billQuantity[billIndex][0].mark]
    array[index1].splice(index2, 1)
    arrayMark && arrayMark.length > 0 && arrayMark.forEach((values6, index6) => {
      if (values6 === sku) {
        arrayMark.splice(index6, 1)
        var arrayResult = [...billQuantity]
        arrayResult[billIndex][0].mark = arrayMark
        setBillQuantity([...arrayResult])
      }
    })

    setBillQuantity([...array])






    var moneyTotalItem = 0;
    array[index1].forEach((values30, index30) => {
      if (index30 !== 0) {
        moneyTotalItem += values30.total_cost
      }
    })
    setMoneyTotal(moneyTotalItem)



    var taxPercent = 0;
    tax && tax.length > 0 && tax.forEach((values40, index40) => {
      taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
        if (values40.name === values41) {
          var numberValue = values40.value.split('%')[0]

          console.log(numberValue)
          taxPercent += parseInt(numberValue)
        }
      })
    })
    console.log(taxPercent)
    console.log("____555")
    var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
    var result = moneyTotalTemp - moneyTotalItem;
    setTaxPercentValue(taxPercent)
    setTaxMoneyValue(result)
    setMoneyFinish(moneyTotalTemp)

  }
  const [productSearch, setProductSearch] = useState([])

  const apiSearchData = async (value) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await apiProductSeller({ keyword: value, branch: branchId, page: 1, page_size: 50 });
      console.log(res)
      if (res.status === 200) {
        setProductSearch(res.data.data)
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const contentHoverProduct = (url) => {
    return (
      <img src={url} style={{ width: '40rem', height: '20rem', objectFit: 'contain' }} alt="" />
    )
  }

  const content = (
    <div className={styles['popover']}>

      {
        productSearch && productSearch.length > 0 ? (productSearch && productSearch.length > 0 && productSearch.map((values, index) => {
          return (
            values && values.variants && values.variants.length > 0 ? (values && values.variants && values.variants.map((values1, index1) => {
              return (
                <div style={{ width: '100%' }} onClick={() => { onClickModal2Visible(values1, values); onClickMarkVariant(values1.sku) }} className={styles['product-search']}>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Popover placement="right" content={() => contentHoverProduct(values1.image[0])}>
                      <img src={values1.image[0]} style={{ width: '5rem', height: '5rem', objectFit: 'contain' }} alt="" />
                    </Popover>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}  >{values1.title}</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '1rem', alignItems: 'center' }}>
                    <div>{`${formatCash(String(values1.sale_price))}`}</div>
                    <div style={{ marginLeft: '0.5rem' }}>VNĐ</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                      <div style={{ color: '#50D648', borderRadius: '50%', fontSize: '1.25rem' }}><CheckCircleOutlined /></div>
                      <div style={{ color: '#50D648', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values1.available_stock_quantity}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                      <div style={{ color: 'orange', borderRadius: '50%', fontSize: '1.25rem' }}><AlertOutlined /></div>
                      <div style={{ color: 'orange', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values1.low_stock_quantity}</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                      <div style={{ color: 'red', borderRadius: '50%', fontSize: '1.25rem' }}><CloseCircleOutlined /></div>
                      <div style={{ color: 'red', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values1.out_stock_quantity}</div>
                    </div>
                  </div>
                </div>
              )
            })) : (
              <div style={{ width: '100%' }} onClick={() => { onClickAddProductSimple(values); onClickMark(values.sku) }} className={styles['product-search']}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Popover placement="right" content={() => contentHoverProduct(values.image[0])}>
                    <img src={values.image[0]} style={{ width: '5rem', height: '5rem', objectFit: 'contain' }} alt="" />
                  </Popover>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}  >{values.name}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '1rem', alignItems: 'center' }}>
                  <div>{`${formatCash(String(values.sale_price))}`}</div>
                  <div style={{ marginLeft: '0.5rem' }}>VNĐ</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <div style={{ color: '#50D648', borderRadius: '50%', fontSize: '1.25rem' }}><CheckCircleOutlined /></div>
                    <div style={{ color: '#50D648', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values.available_stock_quantity}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <div style={{ color: 'orange', borderRadius: '50%', fontSize: '1.25rem' }}><AlertOutlined /></div>
                    <div style={{ color: 'orange', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values.low_stock_quantity}</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <div style={{ color: 'red', borderRadius: '50%', fontSize: '1.25rem' }}><CloseCircleOutlined /></div>
                    <div style={{ color: 'red', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values.out_stock_quantity}</div>
                  </div>
                </div>
              </div>


            ))
        })) :
          (
            productSelect && productSelect.length > 0 ? (productSelect && productSelect.length > 0 && productSelect.map((values, index) => {

              return (

                values && values.variants && values.variants.length > 0 ? (values && values.variants && values.variants.map((values1, index1) => {
                  if (index1 > -1) {
                    return (
                      <div style={{ width: '100%' }} onClick={() => { onClickModal2Visible(values1, values); onClickMarkVariant(values1.sku) }} className={styles['product-search']}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                          <Popover placement="right" content={() => contentHoverProduct(values1.image[0])}>
                            <img src={values1.image[0]} style={{ width: '5rem', height: '5rem', objectFit: 'contain' }} alt="" />
                          </Popover>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}  >{values1.title}</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '1rem', alignItems: 'center' }}>
                          <div>{`${formatCash(String(values1.sale_price))}`}</div>
                          <div style={{ marginLeft: '0.5rem' }}>VNĐ</div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <div style={{ color: '#50D648', borderRadius: '50%', fontSize: '1.25rem' }}><CheckCircleOutlined /></div>
                            <div style={{ color: '#50D648', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values1.available_stock_quantity}</div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <div style={{ color: 'orange', borderRadius: '50%', fontSize: '1.25rem' }}><AlertOutlined /></div>
                            <div style={{ color: 'orange', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values1.low_stock_quantity}</div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <div style={{ color: 'red', borderRadius: '50%', fontSize: '1.25rem' }}><CloseCircleOutlined /></div>
                            <div style={{ color: 'red', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values1.out_stock_quantity}</div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                })) : (
                  <div style={{ width: '100%', }} onClick={() => { onClickAddProductSimple(values); onClickMark(values.sku) }} className={styles['product-search']}>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                      <Popover placement="right" content={() => contentHoverProduct(values.image[0])}>
                        <img src={values.image[0]} style={{ width: '5rem', height: '5rem', objectFit: 'contain' }} alt="" />
                      </Popover>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}  >{values.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '1rem', alignItems: 'center' }}>
                      <div>{`${formatCash(String(values.sale_price))}`}</div>
                      <div style={{ marginLeft: '0.5rem' }}>VNĐ</div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <div style={{ color: '#50D648', borderRadius: '50%', fontSize: '1.25rem' }}><CheckCircleOutlined /></div>
                        <div style={{ color: '#50D648', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values.available_stock_quantity}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <div style={{ color: 'orange', borderRadius: '50%', fontSize: '1.25rem' }}><AlertOutlined /></div>
                        <div style={{ color: 'orange', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values.low_stock_quantity}</div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <div style={{ color: 'red', borderRadius: '50%', fontSize: '1.25rem' }}><CloseCircleOutlined /></div>
                        <div style={{ color: 'red', marginLeft: '0.25rem', borderRadius: '50%', fontSize: '1.25rem' }}>{values.out_stock_quantity}</div>
                      </div>
                    </div>
                  </div>)

              )

            })) : (<div style={{ color: 'black', fontSize: '1.25rem', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>Không tìm thấy sản phẩm ở chi nhánh này</div>)
          )

      }

    </div >
  );
  function randomFunc(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  const openNotificationSuccessAddCustomer = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm mới khách hàng thành công.',
    });
  };
  const openNotificationErrorNameCustomer = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Tên khách hàng phải là chữ',
    });
  };
  const openNotificationErrorNameCustomerNull = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Bạn chưa nhập tên khách hàng.',
    });
  };

  const openNotificationErrorPhone = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Liên hệ phải là số và có độ dài là 10.',
    });
  };
  const openNotificationErrorAddCustomer = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Liên hệ đã tồn tại.',
    });
  };
  const addCustomerData = async (value) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await addCustomer(value);
      console.log(res)
      console.log('___________123123')
      if (res.status === 200) {
        setCustomer(res.data.data)
        await getAllCustomerData()
        openNotificationSuccessAddCustomer()
        setCustomerOddMain(false)
        setCustomerName('')

        onClose()
      } else {
        openNotificationErrorAddCustomer()
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };


  function isValid(string) {
    var re = /^([a-zA-Z]|[-._](?![-._])){2,30}$/
    return re.test(string)
  }
  const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  const onFinishAddCustomer = (values) => {
    console.log('Success:', values);
    // onClose()
    var now = moment().get('year');
    console.log(customerName)
    console.log(now)
    console.log(value)
    now -= parseInt(value)
    console.log(`${now}/01/01`)
    if (customerName && customerName !== "" || customerName && customerName !== " " || customerName && customerName !== "default") {
      if (!isNaN(customerName) || isNaN(randomPhoneValue)) {
        if (!isNaN(customerName)) {
          openNotificationErrorNameCustomer()
        }
        if (isNaN(randomPhoneValue)) {
          openNotificationErrorPhone()
        }
      } else {
        if (regex.test(randomPhoneValue)) {
          const object = {
            phone: randomPhoneValue,
            type: customerName,
            first_name: customerName,
            last_name: "",
            gender: valueSex,
            birthday: `${now}/01/01`,
            address: values.address,
            ward: values.ward,
            district: values.district,
            province: values.ward,
            balance: []
          }
          console.log(object)
          addCustomerData(object)
        } else {
          if (!regex.test(randomPhoneValue)) {
            openNotificationErrorPhone()
          }

        }
      }
    } else {
      openNotificationErrorNameCustomerNull()
    }

  };

  const onFinishFailedAddCustomer = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };



  // const apiProductCategoryData = async (value) => {
  //   try {
  //     dispatch({ type: ACTION.LOADING, data: true });

  //     const res = await apiProductCategory();
  //     console.log(res)

  //     if (res.status === 200) {


  //       setCategory(res.data.data)

  //     }
  //     dispatch({ type: ACTION.LOADING, data: false });
  //     // openNotification();
  //     // history.push(ROUTES.NEWS);
  //   } catch (error) {

  //     dispatch({ type: ACTION.LOADING, data: false });
  //   }
  // };
  // useEffect(() => {
  //   apiProductCategoryData()
  // }, [])



  const getCustomerData = async (data) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await getCustomer({ keyword: data, page: 1, page_size: 50 });
      console.log(res)
      console.log("__________312")
      if (res.status === 200) {

        // setCustomerBackup(res.data.data)
        setCustomer(res.data.data)

      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const getCustomerDataCustomeAlone = async () => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });

      const res = await getCustomer({ keyword: 'Khách lẻ', page: 1, page_size: 50 });
      console.log(res)
      console.log("__________312")
      if (res.status === 200) {

        // setCustomerBackup(res.data.data)
        //   setCustomer(res.data.data)
        //    var array = []
        //    array.push(values)
        setCustomerOnClick([...res.data.data])
        setValueSearchCustomer(`${res.data.data[0].first_name} - ${res.data.data[0].phone}`)



        var arrayCustomerSelect = [...billQuantity]
        arrayCustomerSelect[billIndex][0].customer = res.data.data
        setBillQuantity([...arrayCustomerSelect])
      }
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const onChangeCustomerOdd = (e) => {
    console.log(e)
    console.log("_____________5555555555")
    setCustomerOddMain(e.target.checked)
    if (e.target.checked) {
      setValueSearchCustomer('Khách lẻ')
      getCustomerDataCustomeAlone()
    } else {
      setValueSearchCustomer('')
      setCustomerOnClick([])
      setCustomer([])
      var arrayCustomerSelect = [...billQuantity]
      arrayCustomerSelect[billIndex][0].customer = []
      setBillQuantity([...arrayCustomerSelect])
    }
  }

  const onChangeCustomerName = (e) => {
    setCustomerName(e.target.value)
  }
  console.log(branchDetail)
  console.log("______________+++")


  const apiFilterCityData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiFilterCity({ keyword: object });
      console.log(res)
      if (res.status === 200) {
        setDistrictMainAPI(res.data.data)
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  function handleChangeCity(value) {
    console.log(`selected ${value}`);
    apiFilterCityData(value)
  }

  const onClickInformation = (values) => {
    var array = []
    array.push(values)
    setCustomerOnClick([...array])
    setValueSearchCustomer(`${values.first_name} - ${values.phone}`)



    var arrayCustomerSelect = [...billQuantity]
    arrayCustomerSelect[billIndex][0].customer = array
    setBillQuantity([...arrayCustomerSelect])
  }
  const contentCustomer = (

    <div className={styles['shadow']} style={{ display: 'flex', height: '20rem', maxWidth: '100%', backgroundColor: 'white', zIndex: '999', maxHeight: '100%', overflow: 'auto', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>

      {
        customer && customer.length > 0 ? (customer && customer.length > 0 && customer.map((values, index) => {
          return (
            <div onClick={() => onClickInformation(values)} className={styles['informaton__customer-search']}>
              <div><img src={user} style={{ width: '2rem', height: '2rem', marginRight: '0.5rem', objectFit: 'contain' }} alt="" /></div>
              <div style={{ color: 'black', fontWeight: '600' }}>{values.first_name} - </div>
              <div style={{ color: 'black', fontWeight: '600' }}>{values.phone}</div>
            </div>
          )
        })) : (customerBackup && customerBackup.length > 0 && customerBackup.map((values, index) => {
          return (
            <div onClick={() => onClickInformation(values)} className={styles['informaton__customer-search']}>
              <div><img src={user} style={{ width: '2rem', height: '2rem', marginRight: '0.5rem', objectFit: 'contain' }} alt="" /></div>
              <div style={{ color: 'black', fontWeight: '600' }}>{`${values.first_name} ${values.last_name} - `}</div>
              <div style={{ marginLeft: '0.25rem', color: 'black', fontWeight: '600' }}>{values.phone}</div>
            </div>
          )
        }))

      }
    </div>
  )

  function randomPhone() {
    var S4 = function () {
      // Math.random should be unique because of its seeding algorithm.
      // Convert it to base 36 (numbers + letters), and grab the first 9 characters
      // after the decimal.
      return String(Math.floor(Math.random() * 10));
    };
    return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
  }
  const onChangeRandom = (e) => {
    setRandomPhoneValue(e.target.value)
  }


  const onClickSearchCustomer = () => {
    if (customerBackup && customerBackup.length > 0) {
      dispatch({ type: ACTION.LOADING, data: false });
    } else {
      dispatch({ type: ACTION.LOADING, data: true });
    }
  }

  const onChangeTax = (e) => {
    console.log(e)
    setTaxDefault(e)
    var taxPercent = 0;

    tax && tax.length > 0 && tax.forEach((values40, index40) => {
      e && e.length > 0 && e.forEach((values41, index41) => {
        if (values40.name === values41) {
          var numberValue = values40.value.split('%')[0]

          console.log(numberValue)
          taxPercent += parseInt(numberValue)
        }
      })
    })



    var moneyTotalTemp = moneyTotal + ((taxPercent * moneyTotal) / 100)
    var result = moneyTotalTemp - moneyTotal;
    setTaxPercentValue(taxPercent)
    setTaxMoneyValue(result)
    console.log(taxPercent)
    console.log(moneyTotalTemp)
    console.log(moneyFinish)
    console.log(result)
    console.log("____555")
    setMoneyFinish(moneyTotalTemp)
  }

  const apiCheckPromotionData = async (object, count) => {
    if (count === 1) {
      try {
        dispatch({ type: ACTION.LOADING, data: true });
        const res = await apiCheckPromotion(object);
        console.log(res)
        console.log("-----------------------------------------------")
        if (res.status === 200) {
          setVoucherSaveCheck(count)
          setVoucherSave(object.voucher)
          await getAllPromotionData()
          var taxPercent1 = 0;
          console.log("-----------")
          taxPercent1 += res.data.data.value
          console.log(taxPercent1)
          console.log(typeof taxPercent1)

          setDiscount(taxPercent1)
          var discountMoneyValue = (taxPercent1 * moneyTotal) / 100
          var moneyTotalTemp = moneyFinish - discountMoneyValue



          // var moneyTotalTemp = moneyFinish - ((taxPercent1 * moneyFinish) / 100)
          var moneyTempItem = moneyFinish - moneyTotalTemp

          setMoneyFinishBackup(moneyFinish)
          setMoneyFinish(Math.round(moneyTotalTemp))
          setMoneyTemp(moneyTempItem)

          setDiscountMoney(Math.round(discountMoneyValue))
          console.log(moneyTotal)
          console.log(moneyFinish)
          console.log(Math.round(moneyTotalTemp))
          console.log(discountMoneyValue)
          console.log("______7777")
        } else {
          openNotificationAddProductErrorBill()

        }
        // if (res.status === 200) setUsers(res.data);
        dispatch({ type: ACTION.LOADING, data: false });
      } catch (error) {

        dispatch({ type: ACTION.LOADING, data: false });
      }
    } else {
      try {
        dispatch({ type: ACTION.LOADING, data: true });
        const res = await getPromoton({ name: object });
        console.log(res)
        console.log("-----------------------------------------------")
        if (res.status === 200) {
          setVoucherSaveCheck(count)
          setVoucherSave(object.voucher)
          await getAllPromotionData()
          var taxPercent1 = 0;
          console.log("-----------")
          taxPercent1 += res.data.data[0].value
          console.log(taxPercent1)
          console.log(typeof taxPercent1)

          setDiscount(taxPercent1)
          var discountMoneyValue = (taxPercent1 * moneyTotal) / 100
          var moneyTotalTemp = moneyFinish - discountMoneyValue



          // var moneyTotalTemp = moneyFinish - ((taxPercent1 * moneyFinish) / 100)
          var moneyTempItem = moneyFinish - moneyTotalTemp

          setMoneyFinishBackup(moneyFinish)
          setMoneyFinish(Math.round(moneyTotalTemp))
          setMoneyTemp(moneyTempItem)

          setDiscountMoney(Math.round(discountMoneyValue))
          console.log(moneyTotal)
          console.log(moneyFinish)
          console.log(Math.round(moneyTotalTemp))
          console.log(discountMoneyValue)
          console.log("______7777")
        } else {
          openNotificationAddProductErrorBill()

        }
        // if (res.status === 200) setUsers(res.data);
        dispatch({ type: ACTION.LOADING, data: false });
      } catch (error) {

        dispatch({ type: ACTION.LOADING, data: false });
      }
    }

  };

  const onChangePromotionValue = async (e) => {
    console.log(e)


    setVoucherSave(e)
    if (e === 'default') {
      var moneyNew = moneyFinish + moneyTemp
      setDiscount(0)
      setMoneyFinish(moneyNew)
      setPromotionValue(e)
    } else {
      setPromotionValue(e)
      apiCheckPromotionData({ voucher: e }, 2)
    }
  }
  const predictMoney = (money) => {
    var array = [1, 2, 5, 10, 20, 50, 100, 200, 500]
    var array1 = [money]
    array.forEach((values, index) => {
      if (values > money) {
        array1.push(values)
      }
    })
    var array2 = []
    array.forEach((values, index) => {
      money += values
      array2.push(money)
    })
    return [...array2]

  }
  console.log(predictMoney(148))
  console.log("______________567567")

  const onChangeReceiveMethod = (e) => {
    console.log(e)
    setReceiveMethod(e.target.value)
  }

  const onChangePaymentMethod = (e) => {
    setPaymentMethod(e.target.value)
  }
  const openNotificationErrorBillQuantity = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Bạn chưa tạo hóa đơn.',
    });
  };
  const openNotificationSuccessOrder = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thanh toán hóa đơn thành công.',
    });
  };
  const openNotificationErrorOrder = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Thanh toán hóa đơn thất bại.',
    });
  };
  const apiOrderVoucherData = async (object, randomFinish) => {
    console.log(object)
    console.log("________________5675567")
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiOrderVoucher(object);
      console.log(res)
      console.log("________________44444444444444")
      if (res.status === 200) {
        await apiAllOrderData()
        setOrderStatus("order now")
        setPaymentMethod("1")
        setNote("")
        setReceiveMethod("2")
        setMoneyPredict([])
        setPaidCustomerMoney("")
        setTaxDefault(['VAT'])
        setVoucher("")
        setPromotionValue("default")
        setValueSearchCustomer("")
        console.log(billQuantity)
        var array = [...billQuantity]
        array.splice(billIndex, 1)
        if (array && array.length === 0) {
          setBillName('')
        }

        if (array.length > 0) {
          var checkValue = 0;
          array.forEach((values1, index1) => {
            if (values1.length > 1) {
              checkValue++
            }

            if (values1 && values1.length > 0) {
              values1.forEach((values2, index2) => {
                if (index2 === 0) {

                  if (billIndex !== 0) {


                    if (array && array.length === 1) {
                      setBillQuantityStatus(values2.values) //
                      setBillName(`1000${values2.values}`)
                      if (billQuantity && billQuantity.length > 0) {
                        var count = 0;
                        billQuantity.forEach((values00, index00) => {

                          values00.forEach((values100, index100) => {
                            if (index100 === 0) {
                              if (values2.values === values100.values) {
                                //     
                                count++;
                              }
                            }
                          })
                        })

                        if (moneyFinish > 0) {
                          if (count > 0) {

                            setConfirm(1)
                          } else {
                            setConfirm(0)
                          }

                        } else {


                        }
                      } else {

                      }



                    } else {
                      setBillQuantityStatus(-1)
                      if (billQuantity && billQuantity.length > 0) {
                        var count = 0;
                        billQuantity.forEach((values, index) => {
                          values.forEach((values1, index1) => {
                            if (index1 === 0) {
                              if (-1 === values1.values) {

                                count++;
                              }
                            }
                          })
                        })

                        if (moneyFinish > 0) {
                          if (count > 0) {

                            setConfirm(1)
                          } else {
                            setConfirm(0)
                          }

                        } else {


                        }
                      } else {

                      }
                    }
                  }
                  else {

                    if (array && array.length === 1) {
                      setBillQuantityStatus(-1)
                      if (billQuantity && billQuantity.length > 0) {
                        var count = 0;
                        billQuantity.forEach((values, index) => {
                          values.forEach((values1, index1) => {
                            if (index1 === 0) {
                              if (-1 === values1.values) {
                                //     
                                count++;
                              }
                            }
                          })
                        })

                        if (moneyFinish > 0) {
                          if (count > 0) {

                            setConfirm(1)
                          } else {
                            setConfirm(0)
                          }

                        } else {


                        }
                      } else {

                      }
                    } else {
                      setBillQuantityStatus(-1)
                      if (billQuantity && billQuantity.length > 0) {
                        var count = 0;
                        billQuantity.forEach((values, index) => {
                          values.forEach((values1, index1) => {
                            if (index1 === 0) {
                              if (-1 === values1.values) {

                                count++;
                              }
                            }
                          })
                        })

                        if (moneyFinish > 0) {
                          if (count > 0) {

                            setConfirm(1)
                          } else {
                            setConfirm(0)
                          }

                        } else {


                        }
                      } else {

                      }
                    }

                  }
                } else {


                }
              })

            }


          })
          if (checkValue === 0) {
            setConfirm(-1)
          }
        }

        if (array && array.length === 1) {
          var moneyTotalItem = 0;
          if (billIndex - 1 >= 0) {
            array[billIndex - 1].forEach((values30, index30) => {
              if (index30 !== 0) {
                moneyTotalItem += values30.total_cost
              }
            })
            setMoneyTotal(moneyTotalItem)
            var taxPercent = 0;
            tax && tax.length > 0 && tax.forEach((values40, index40) => {
              taxDefault && taxDefault.length > 0 && taxDefault.forEach((values41, index41) => {
                if (values40.name === values41) {
                  var numberValue = values40.value.split('%')[0]

                  console.log(numberValue)
                  taxPercent += parseInt(numberValue)
                }
              })
            })
            console.log(taxPercent)
            console.log("____555")
            var moneyTotalTemp = moneyTotalItem + ((taxPercent * moneyTotalItem) / 100)
            var result = moneyTotalTemp - moneyTotalItem;
            setTaxPercentValue(taxPercent)
            setTaxMoneyValue(result)
            setMoneyFinish(moneyTotalTemp)
          }

        }


        if (billIndex === 0) {
          setBillIndex(array && array.length > 0 ? 0 : 0)
        } else {

          setBillIndex(array && array.length > 0 ? array.length - 1 : 0)
        }
        console.log(billIndex)
        console.log(array)
        console.log("_____________________77777777777777")

        var random = [...arrayRandom]

        random.push(randomFinish)
        setArrayRandom([...random])
        modal3VisibleModal(false)
        openNotificationSuccessOrder()
        setBillQuantity([...array])
      } else {
        openNotificationErrorOrder()
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  }
  const apiOrderPromotionData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      const res = await apiOrderPromotion(object);
      console.log(res)
      console.log("________________44444444444444")
      if (res.status === 200) {

        var array = [...billQuantity]
        array.splice(billIndex, 1)
        setBillQuantity([...array])
        modal3VisibleModal(false)
        openNotificationSuccessOrder()
      } else {
        openNotificationErrorOrder()
      }
      // if (res.status === 200) setUsers(res.data);
      dispatch({ type: ACTION.LOADING, data: false });
    } catch (error) {

      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const openNotificationErrorBillQuantityNotChoose = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Bạn chưa chọn hóa đơn cần thanh toán.',
    });
  };
  const openNotificationErrorBillQuantityNotChooseProduct = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Hóa đơn này chưa có sản phẩm.',
    });
  };
  const openNotificationErrorBranchId = () => {
    notification.error({
      message: 'Thất bại',
      description:
        'Không tìm thấy chi nhánh làm việc của nhân viên này.',
    });
  };
  const openNotificationErrorCustomerId = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description:
        'Bạn chưa chọn thông tin khách hàng cần thanh toán.',
    });
  };
  const openNotificationErrorTax = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description:
        'Bạn chưa chọn thuế.',
    });
  };
  const openNotificationErrorVoucher = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description:
        'Bạn chưa chọn chương trình khuyến mãi hoặc nhập voucher.',
    });
  };

  const onClickPayment = () => {
    console.log(customerOnClick)
    console.log("__________123456")
    if (billQuantity && billQuantity.length > 0) {
      var count = 0;
      billQuantity.forEach((values, index) => {
        values.forEach((values1, index1) => {
          if (index1 === 0) {
            if (billQuantityStatus === values1.values) {
              //     
              count++;
            }
          }
        })
      })
      //  && 
      if (moneyFinish > 0) {
        if (count > 0) {
          if (customerOnClick && customerOnClick.length === 0) {
            openNotificationErrorCustomerId()
          } else {
            console.log(voucherSave)
            console.log("___________555")

            if ((taxDefault && taxDefault.length === 0) || ((branchId && branchId === "") || (branchId && branchId === " ") || (branchId && branchId === "default")) || ((customerOnClick[0].customer_id && customerOnClick[0].customer_id === "") || (customerOnClick[0].customer_id && customerOnClick[0].customer_id === " ") || (customerOnClick[0].customer_id && customerOnClick[0].customer_id === "default"))) {
              if ((branchId && branchId === "") || (branchId && branchId === " ") || (branchId && branchId === "default")) {
                openNotificationErrorBranchId()
              }
              if (((customerOnClick[0].customer_id && customerOnClick[0].customer_id === "") || (customerOnClick[0].customer_id && customerOnClick[0].customer_id === " ") || (customerOnClick[0].customer_id && customerOnClick[0].customer_id === "default"))) {
                openNotificationErrorCustomerId()
              }
              if (taxDefault && taxDefault.length === 0) {
                openNotificationErrorTax()
              }
              // if ((voucherSave === '') || (voucherSave === ' ') || (voucherSave === 'default')) {
              //   openNotificationErrorVoucher()

              // }
            } else {

              var arrayFinish = [...billQuantity]
              billQuantity.forEach((values200, index200) => {
                values200.forEach((values300, index300) => {
                  if (index300 !== 0) {
                    arrayFinish[index200][index300].voucher = voucherSave ? voucherSave : ''
                  }
                })
              })
              var arrayFinishMain = []
              arrayFinish.forEach((values, index) => {
                if (index === billIndex) {
                  values.forEach((values1, index1) => {
                    if (index1 !== 0) {
                      arrayFinishMain.push(values1)
                    }
                  })
                }


              })
              var arrayVoucher = [...arrayFinishMain]
              var discountMoneyVoucher = parseInt(discountMoney)
              arrayFinishMain.forEach((values, index) => {
                if (discountMoneyVoucher > values.total_cost) {
                  arrayVoucher[index].discount = values.total_cost
                  arrayVoucher[index].final_cost = values.total_cost - arrayVoucher[index].discount
                  discountMoneyVoucher -= values.total_cost
                } else {
                  arrayVoucher[index].discount = discountMoneyVoucher
                  arrayVoucher[index].final_cost = values.total_cost - arrayVoucher[index].discount
                  discountMoneyVoucher = 0;
                }
              })
              console.log(arrayVoucher)
              console.log(discountMoneyVoucher)
              console.log("______________777111")
              payment && payment.length > 0 && payment.forEach((values, index) => {
                if (values.payment_id === paymentMethod) {
                  setPaymentForm(values.name)
                }
              })
              shipping && shipping.length > 0 && shipping.forEach((values, index) => {
                if (values.transport_id === receiveMethod) {
                  setReceiveMethodName(values.name)
                }
              })
              if (voucherSaveCheck === 1) {
                const object = {
                  branch: branchId,
                  customer: customerOnClick[0].customer_id,
                  order_details: arrayFinishMain && arrayFinishMain.length > 0 ? arrayFinishMain : [],
                  payment: (paymentMethod && paymentMethod !== '') || (paymentMethod && paymentMethod !== ' ') || (paymentMethod && paymentMethod !== 'default') ? paymentMethod : '',
                  tax_list: taxDefault && taxDefault.length > 0 ? taxDefault : [],
                  voucher: (voucherSave && voucherSave !== '') || (voucherSave && voucherSave !== ' ') || (voucherSave && voucherSave !== 'default') ? voucherSave : '',
                  transport: (receiveMethod && receiveMethod !== '') || (receiveMethod && receiveMethod !== ' ') || (receiveMethod && receiveMethod !== 'default') ? receiveMethod : '',
                  total_cost: parseInt(moneyTotal) > 0 ? parseInt(moneyTotal) : 0,
                  discount: parseInt(discountMoney) > 0 ? parseInt(discountMoney) : 0,
                  final_cost: parseInt(moneyFinish) > 0 ? parseInt(moneyFinish) : 0,
                  latitude: "",
                  longtitude: "",
                  note: (note && note !== '') || (note && note !== ' ') || (note && note !== 'default') ? note : ''
                }
                console.log(object)
                modal3VisibleModal(true)


                setOrderDetail(object.order_details)
              } else {
                const object = {
                  branch: branchId,
                  customer: customerOnClick[0].customer_id,
                  order_details: arrayFinishMain && arrayFinishMain.length > 0 ? arrayFinishMain : [],
                  payment_id: (paymentMethod && paymentMethod !== '') || (paymentMethod && paymentMethod !== ' ') || (paymentMethod && paymentMethod !== 'default') ? paymentMethod : '',
                  tax_list: taxDefault && taxDefault.length > 0 ? taxDefault : [],
                  promotion: (voucherSave && voucherSave !== '') || (voucherSave && voucherSave !== ' ') || (voucherSave && voucherSave !== 'default') ? voucherSave : '',
                  transport: (receiveMethod && receiveMethod !== '') || (receiveMethod && receiveMethod !== ' ') || (receiveMethod && receiveMethod !== 'default') ? receiveMethod : '',
                  total_cost: parseInt(moneyTotal) > 0 ? parseInt(moneyTotal) : 0,
                  discount: parseInt(discountMoney) > 0 ? parseInt(discountMoney) : 0,
                  final_cost: parseInt(moneyFinish) > 0 ? parseInt(moneyFinish) : 0,
                  latitude: "",
                  longtitude: "",
                  note: (note && note !== '') || (note && note !== ' ') || (note && note !== 'default') ? note : ''
                }
                console.log(object)
                modal3VisibleModal(true)
                setOrderDetail(object.order_details)
              }

            }
          }
        } else {
          openNotificationErrorBillQuantityNotChoose()
        }

      } else {
        openNotificationErrorBillQuantityNotChooseProduct()

      }
    } else {
      openNotificationErrorBillQuantity()
    }
  }
  const onClickPaymentFinish = () => {
    console.log(customerOnClick)
    console.log("__________123456")
    if (billQuantity && billQuantity.length > 0) {
      var count = 0;
      billQuantity.forEach((values, index) => {
        values.forEach((values1, index1) => {
          if (index1 === 0) {
            if (billQuantityStatus === values1.values) {
              //     
              count++;
            }
          }
        })
      })
      //  && 
      if (moneyFinish > 0) {
        if (count > 0) {
          if (customerOnClick && customerOnClick.length === 0) {
            openNotificationErrorCustomerId()
          } else {
            console.log(voucherSave)
            console.log("___________555")

            if ((taxDefault && taxDefault.length === 0) || ((branchId && branchId === "") || (branchId && branchId === " ") || (branchId && branchId === "default")) || ((customerOnClick[0].customer_id && customerOnClick[0].customer_id === "") || (customerOnClick[0].customer_id && customerOnClick[0].customer_id === " ") || (customerOnClick[0].customer_id && customerOnClick[0].customer_id === "default"))) {
              if ((branchId && branchId === "") || (branchId && branchId === " ") || (branchId && branchId === "default")) {
                openNotificationErrorBranchId()
              }
              if (((customerOnClick[0].customer_id && customerOnClick[0].customer_id === "") || (customerOnClick[0].customer_id && customerOnClick[0].customer_id === " ") || (customerOnClick[0].customer_id && customerOnClick[0].customer_id === "default"))) {
                openNotificationErrorCustomerId()
              }
              if (taxDefault && taxDefault.length === 0) {
                openNotificationErrorTax()
              }
              // if ((voucherSave === '') || (voucherSave === ' ') || (voucherSave === 'default')) {
              //   openNotificationErrorVoucher()

              // }
            } else {

              var arrayFinish = [...billQuantity]
              var randomFinish = -1;

              var arrayFinishMain = []
              arrayFinish.forEach((values, index) => {
                if (index === billIndex) {
                  values.forEach((values1, index1) => {
                    if (index1 !== 0) {
                      arrayFinishMain.push(values1)
                    }
                  })
                }


              })
              var arrayVoucher = [...arrayFinishMain]
              var discountMoneyVoucher = parseInt(discountMoney)
              arrayFinishMain.forEach((values, index) => {
                if (discountMoneyVoucher > values.total_cost) {
                  arrayVoucher[index].discount = values.total_cost
                  arrayVoucher[index].final_cost = values.total_cost - arrayVoucher[index].discount
                  discountMoneyVoucher -= values.total_cost
                } else {
                  arrayVoucher[index].discount = discountMoneyVoucher
                  arrayVoucher[index].final_cost = values.total_cost - arrayVoucher[index].discount
                  discountMoneyVoucher = 0;
                }
              })
              billQuantity.forEach((values200, index200) => {

                values200.forEach((values300, index300) => {
                  if (index300 !== 0) {
                    if (arrayFinish[index200][index300].discount > 0) {
                      arrayFinish[index200][index300].voucher = voucherSave ? voucherSave : ''
                    } else {
                      arrayFinish[index200][index300].voucher = ''
                    }

                  } else {
                    randomFinish = values300.values
                  }
                })
              })
              console.log(arrayVoucher)
              console.log(discountMoneyVoucher)
              console.log("______________777111")
              payment && payment.length > 0 && payment.forEach((values, index) => {
                if (values.payment_id === paymentMethod) {
                  setPaymentForm(values.name)
                }
              })
              shipping && shipping.length > 0 && shipping.forEach((values, index) => {
                if (values.transport_id === receiveMethod) {
                  setReceiveMethodName(values.name)
                }
              })
              var taxNewFinish = []
              tax && tax.length > 0 && tax.forEach((values500, index500) => {
                taxDefault && taxDefault.length > 0 && taxDefault.forEach((values501, index501) => {
                  if (values500.name === values501) {
                    taxNewFinish.push(values500.tax_id)
                  }
                })
              })
              if (voucherSaveCheck === 1) {
                const object = {
                  branch: branchId,
                  customer: customerOnClick[0].customer_id,
                  order_details: arrayFinishMain && arrayFinishMain.length > 0 ? arrayFinishMain : [],
                  payment: (paymentMethod && paymentMethod !== '') || (paymentMethod && paymentMethod !== ' ') || (paymentMethod && paymentMethod !== 'default') ? paymentMethod : '',
                  taxes: taxNewFinish && taxNewFinish.length > 0 ? taxNewFinish : [],
                  voucher: (voucherSave && voucherSave !== '') || (voucherSave && voucherSave !== ' ') || (voucherSave && voucherSave !== 'default') ? voucherSave : '',
                  transport: (receiveMethod && receiveMethod !== '') || (receiveMethod && receiveMethod !== ' ') || (receiveMethod && receiveMethod !== 'default') ? receiveMethod : '',
                  total_cost: parseInt(moneyTotal) > 0 ? parseInt(moneyTotal) : 0,
                  discount: parseInt(discountMoney) > 0 ? parseInt(discountMoney) : 0,
                  final_cost: parseInt(moneyFinish) > 0 ? parseInt(moneyFinish) : 0,
                  latitude: "",
                  type: orderStatus,
                  longtitude: "",
                  note: (note && note !== '') || (note && note !== ' ') || (note && note !== 'default') ? note : ''
                }
                console.log(object)


                console.log("__________________________33333333333333")
                apiOrderVoucherData(object, randomFinish)
              } else {
                var taxNewFinish = []
                tax && tax.length > 0 && tax.forEach((values500, index500) => {
                  taxDefault && taxDefault.length > 0 && taxDefault.forEach((values501, index501) => {
                    if (values500.name === values501) {
                      taxNewFinish.push(values500.tax_id)
                    }
                  })
                })
                var promotionValueFinish = ""
                promotion && promotion.length > 0 && promotion.forEach((values600, index600) => {
                  if (values600.name === voucherSave) {
                    promotionValueFinish = values600.promotion_id
                  }
                })
                const object = {
                  branch: branchId,
                  customer: customerOnClick[0].customer_id,
                  order_details: arrayFinishMain && arrayFinishMain.length > 0 ? arrayFinishMain : [],
                  payment: (paymentMethod && paymentMethod !== '') || (paymentMethod && paymentMethod !== ' ') || (paymentMethod && paymentMethod !== 'default') ? paymentMethod : '',
                  taxes: taxNewFinish && taxNewFinish.length > 0 ? taxNewFinish : [],
                  promotion: (promotionValueFinish && promotionValueFinish !== '') || (promotionValueFinish && promotionValueFinish !== ' ') || (promotionValueFinish && promotionValueFinish !== 'default') ? promotionValueFinish : '',
                  transport: (receiveMethod && receiveMethod !== '') || (receiveMethod && receiveMethod !== ' ') || (receiveMethod && receiveMethod !== 'default') ? receiveMethod : '',
                  total_cost: parseInt(moneyTotal) > 0 ? parseInt(moneyTotal) : 0,
                  discount: parseInt(discountMoney) > 0 ? parseInt(discountMoney) : 0,
                  final_cost: parseInt(moneyFinish) > 0 ? parseInt(moneyFinish) : 0,
                  latitude: "",
                  longtitude: "",
                  type: orderStatus,
                  note: (note && note !== '') || (note && note !== ' ') || (note && note !== 'default') ? note : ''
                }
                console.log(object)

                console.log("__________________________33333333333333")
                apiOrderVoucherData(object, randomFinish)
                //  apiOrderPromotionData(object)
              }

            }
          }
        } else {
          openNotificationErrorBillQuantityNotChoose()
        }

      } else {
        openNotificationErrorBillQuantityNotChooseProduct()

      }
    } else {
      openNotificationErrorBillQuantity()
    }
  }
  // useEffect(() => {
  //   var countTimeout = 0
  //   const timer = setTimeout(() => {

  //     countTimeout++;
  //     if (countTimeout === 7) {
  //       alert('het 7s')
  //       dispatch({ type: ACTION.LOADING, data: false });
  //     } else {
  //       if (product.length > 0 && tax.length > 0 && promotion.length > 0 && productSelect.length > 0 && branch.length > 0 && category.length > 0 && customerBackup.length > 0) {
  //         dispatch({ type: ACTION.LOADING, data: false });
  //       } else {
  //         dispatch({ type: ACTION.LOADING, data: true });
  //       }
  //     }
  //   }, 7000);
  //   return () => clearTimeout(timer);
  // }, []);

  const columnsTable = [
    {
      title: 'Mã SKU',
      dataIndex: 'sku',
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (text, record) => `${formatCash(
        String(text))}`
    },
    {
      title: 'Đơn giá',
      dataIndex: 'sale_price',
      render: (text, record) => `${formatCash(
        String(text))} VNĐ`
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_cost',
      render: (text, record) => `${formatCash(
        String(text))} VNĐ`
    },
    {
      title: 'Chiết khấu',
      dataIndex: 'discount',
      render: (text, record) => `${formatCash(
        String(text))} VNĐ`
    },
    {
      title: 'Thành tiền',
      dataIndex: 'final_cost',
      render: (text, record) => `${formatCash(
        String(text))} VNĐ`
    },
    {
      title: voucherSaveCheck === 1 ? 'Voucher' : 'Promotion',
      dataIndex: 'voucher',
      render: (text, record) => record && record.discount > 0 ? text : ('')
    },
  ];
  console.log(voucherSaveCheck)
  console.log("______________555555555555")

  const onChangeOrderStatus = (e) => {
    console.log(e.target.value)
    setOrderStatus(e.target.value)
  }



  // IF React
  // export default TienThoi;

  // If Nodejs
  // module.exports = { TienThoi };

  var sumOutput = [];

  const TienThoi = (sumTong) => {
    if (sumTong <= 500000 && sumTong > 200000) {
      sum500k(sumTong, sumTong);
    } else if (sumTong <= 200000 && sumTong > 100000) {
      sum200k(sumTong, sumTong);
    } else if (sumTong <= 100000 && sumTong > 50000) {
      sum100k(sumTong, sumTong);
    } else if (sumTong <= 50000 && sumTong > 20000) {
      sum50k(sumTong, sumTong);
    } else if (sumTong <= 20000 && sumTong >= 10000) {
      sum20k(sumTong, sumTong);
    }
    sumOutput.push(sumTong);
    return locTrung();
  };

  const sum500k = (sumTong, sumRemain) => {
    var sum = 0;
    var number500 = 0;
    if (sumRemain % 500000 == 0) {
      number500 = parseInt(sumRemain / 500000);
    } else {
      number500 = parseInt(sumRemain / 500000) + 1;
    }
    for (var i = number500; i >= 0; i--) {
      if (sumRemain - i * 500000 <= 0) {
        sum = i * 500000;
        sumOutput.push(sumTong - sumRemain + sum);
      } else {
        sum200k(sumTong, sumRemain - i * 500000);
      }
    }
  };

  const sum200k = (sumTong, sumRemain) => {
    var sum = 0;
    var number200 = 0;
    if (sumRemain % 200000 == 0) {
      number200 = parseInt(sumRemain / 200000);
    } else {
      number200 = parseInt(sumRemain / 200000) + 1;
    }
    for (var i = number200; i >= 0; i--) {
      if (sumRemain - i * 200000 <= 0) {
        sum = i * 200000;
        sumOutput.push(sumTong - sumRemain + sum);
      } else {
        sum100k(sumTong, sumRemain - i * 200000);
      }
    }
  };

  const sum100k = (sumTong, sumRemain) => {
    var sum = 0;
    var number100 = 0;
    if (sumRemain % 100000 == 0) {
      number100 = parseInt(sumRemain / 100000);
    } else {
      number100 = parseInt(sumRemain / 100000) + 1;
    }
    for (var i = number100; i >= 0; i--) {
      if (sumRemain - i * 100000 <= 0) {
        sum = i * 100000;
        sumOutput.push(sumTong - sumRemain + sum);
      } else {
        sum50k(sumTong, sumRemain - i * 100000);
      }
    }
  };

  const sum50k = (sumTong, sumRemain) => {
    var sum = 0;
    var number50 = 0;
    if (sumRemain % 50000 == 0) {
      number50 = parseInt(sumRemain / 50000);
    } else {
      number50 = parseInt(sumRemain / 50000) + 1;
    }
    for (var i = number50; i >= 0; i--) {
      if (sumRemain - i * 50000 <= 0) {
        sum = i * 50000;
        sumOutput.push(sumTong - sumRemain + sum);
      } else {
        sum20k(sumTong, sumRemain - i * 50000);
      }
    }
  };

  const sum20k = (sumTong, sumRemain) => {
    var sum = 0;
    var number20 = 0;
    if (sumRemain % 20000 == 0) {
      number20 = parseInt(sumRemain / 20000);
    } else {
      number20 = parseInt(sumRemain / 20000) + 1;
    }
    for (var i = number20; i >= 0; i--) {
      if (sumRemain - i * 20000 <= 0) {
        sum = i * 20000;
        sumOutput.push(sumTong - sumRemain + sum);
      } else {
        sum10k(sumTong, sumRemain - i * 20000);
      }
    }
  };

  const sum10k = (sumTong, sumRemain) => {
    var sum = 0;
    var number10 = 0;
    if (sumRemain % 10000 == 0) {
      number10 = parseInt(sumRemain / 10000);
    } else {
      number10 = parseInt(sumRemain / 10000) + 1;
    }
    for (var i = number10; i > 0; i--) {
      if (sumRemain - i * 10000 <= 0) {
        sum = i * 10000;
        sumOutput.push(sumTong - sumRemain + sum);
      } else {
      }
    }
  };

  const locTrung = () => {
    var min = 1000000;
    sumOutput.map((i) => {
      if (i < min) min = i;
    });

    var lst = [10000, 20000, 50000, 100000, 200000, 500000];

    lst.map((i) => {
      if (i > min) sumOutput.push(i);
    });

    var result = [];
    for (var i = 0; i < sumOutput.length; i++) {
      var isHave = false;
      for (var j = 0; j < result.length; j++) {
        if (result[j] == sumOutput[i]) isHave = true;
      }

      if (!isHave) result.push(sumOutput[i]);
    }
    result = _.sortBy(result, (o) => {
      return o;
    });

    return result;
  };
  console.log(moneyPredict)
  console.log("____________________________________________123456789")
  const contentCustomerOrderList = (text) => {
    return (
      <div className={styles['customer__information-view']}>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Tên: </div>
          <div>{text ? text.first_name : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Địa chỉ: </div>
          <div>{text ? text.address : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Thành phố/quận: </div>
          <div>{text ? `${text.province}/${text.district}` : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Số điện thoại: </div>
          <div>{text ? text.phone : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Giới tính: </div>
          <div>{text ? text.gender : ''}</div>
        </div>
      </div>
    )
  }
  const contentCodeOrderList = (record) => {
    return (
      <div className={styles['customer__information-view']}>
        <div>
          <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600', marginRight: '0.25rem' }}>Phương thức thanh toán </div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Loại: </div>
          <div>{record && record.payment && record.payment.name ? record.payment.name : ''}</div>
        </div>




        <div style={{ borderTop: '1px solid grey', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600', marginRight: '0.25rem' }}>Thuế </div>
        </div>
        {
          record && record.taxes && record.taxes.map((values, index) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem', alignItems: 'center', width: '100%', }}>
                  <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Tên: </div>
                  <div>{values && values.name ? values.name : ''}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
                  <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Giá trị: </div>
                  <div>{values && values.value ? values.value : ''}</div>
                </div>

              </div>
            )
          })
        }




        <div style={{ borderTop: '1px solid grey', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600', marginRight: '0.25rem' }}>Chi nhánh </div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Tên: </div>
          <div>{record && record.branch && record.branch.name ? record.branch.name : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Số điện thoại: </div>
          <div>{record && record.branch && record.branch.phone ? record.branch.phone : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Địa chỉ: </div>
          <div>{record && record.branch && record.branch.address ? record.branch.address : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Thành phố/quận: </div>
          <div>{record && record.branch && record.branch.district && record.branch.ward ? `${record.branch.ward}/${record.branch.district}` : ''}</div>
        </div>



        <div style={{ borderTop: '1px solid grey', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600', marginRight: '0.25rem' }}>Nhân viên </div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Tên: </div>
          <div>{record && record.employee && record.employee.first_name && record.employee.last_name ? `${record.employee.first_name} ${record.employee.last_name}` : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Số điện thoại: </div>
          <div>{record && record.employee && record.employee.phone ? record.employee.phone : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Địa chỉ: </div>
          <div>{record && record.employee && record.employee.address ? record.employee.address : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Thành phố/quận: </div>
          <div>{record && record.employee && record.employee.district && record.employee.province ? `${record.employee.province}/${record.employee.district}` : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Công ty: </div>
          <div>{record && record.employee && record.employee.company_name ? record.employee.company_name : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Vai trò: </div>
          <div>{record && record.employee && record.employee._role ? record.employee._role : ''}</div>
        </div>
        <div>
          <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem' }}>Email: </div>
          <div>{record && record.employee && record.employee.email ? record.employee.email : ''}</div>
        </div>
      </div>
    )
  }
  const columnsOrderList = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'order_id',
      render: (text, record) => text ? <Popover placement="right" content={() => contentCodeOrderList(record)} ><div style={{ color: '#336CFB', cursor: 'pointer' }}>{text}</div> </Popover> : ''
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'create_date',
      render: (text, record) => text ? moment(text).format("YYYY-MM-DD, HH:mm:ss") : ''
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      render: (text, record) => text ? <Popover content={() => contentCustomerOrderList(text)} ><div style={{ color: '#336CFB', cursor: 'pointer' }}>{text.first_name}</div> </Popover> : ''
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text, record) => text ? <div style={{ color: '#50D648' }}>{record.status}</div> : ''
    },
    // {
    //   title: 'Thanh toán',
    //   dataIndex: '_payment_status',
    //   render: (text, record) => text === 'Đã thanh toán' ? <div style={{ color: '#04B000' }}>Đã thanh toán</div> : <div style={{ color: '#FF9900' }}>Chờ xử lý</div>
    // },
    // {
    //   title: 'Giao hàng',
    //   dataIndex: '_shipping',
    //   render: (text, record) => text === 'Đã giao' ? <div style={{ color: '#04B000' }}>Đã giao</div> : <div style={{ color: '#FF9900' }}>Chưa giao hàng</div>
    // },
    {
      title: 'Thành tiền',
      dataIndex: 'final_cost',
      render: (text, record) => text ? <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }}>{`${formatCash(String(text))} VNĐ`}</div> : 0
    },
  ];
  const columnsDetailOrder = [
    {
      title: 'Giá bán',
      dataIndex: 'sale_price',
      render: (text, record) => text ? <div >{`${formatCash(String(text))} VNĐ`}</div> : 0
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'title',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
    },



    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
    },
    {
      title: 'Thuộc tính',
      dataIndex: 'optionsMain',
      width: 200,
      render: (text, record) => record && record.options && record.options.length > 0 ? (<div>{record.options.map((values, index) => {
        return (
          <div style={{ display: 'flex', marginBottom: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>-Thuộc tính: </div>
              <div>{values.name}.</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
              <div style={{ color: 'black', fontWeight: '600', marginRight: '0.25rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>-Kích thước: </div>
              <div>{values.values}.</div>
            </div>
          </div>
        )
      })}</div>) : ('')
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (text, record) => text ? <div >{`${formatCash(String(text))}`}</div> : 0
    },



    {
      title: 'Tổng tiền',
      dataIndex: 'total_cost',
      render: (text, record) => text ? <div >{`${formatCash(String(text))} VNĐ`}</div> : 0
    },
    {
      title: voucherSaveCheck === 1 ? 'Voucher' : 'Promotion',
      dataIndex: 'voucher',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      render: (text, record) => text ? <div >{`${formatCash(String(text))} VNĐ`}</div> : 0
    },
    {
      title: 'Thành tiền',
      dataIndex: 'final_cost',
      render: (text, record) => text ? <div style={{ color: 'black', fontSize: '1rem', fontWeight: '600' }}>{`${formatCash(String(text))} VNĐ`}</div> : 0
    },
  ];
  const apiAllOrderDataTable = async (page, page_size) => {
    try {
      //   dispatch({ type: ACTION.LOADING, data: true });
      setLoadingTable(true)
      const res = await apiAllOrder({ page: page, page_size: page_size });
      console.log(res)
      console.log("___________11111111111222222222222_____")
      if (res.status === 200) {
        setCountTable(res.data.count)
        setOrder(res.data.data)
      }
      //dispatch({ type: ACTION.LOADING, data: false });
      setLoadingTable(false)
    } catch (error) {
      setLoadingTable(false)
      // dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  const apiAllOrderDataTableOrderDetail = async (e) => {
    try {
      //   dispatch({ type: ACTION.LOADING, data: true });
      setLoadingTable(true)
      const res = await apiAllOrder({ keyword: e, page: 1, page_size: 10 });
      console.log(res)
      console.log("___________11111111111222222222222_____")
      if (res.status === 200) {
        setCountTable(res.data.count)
        setOrder(res.data.data)
        let now = moment();
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (moment(values.create_date).format('YYYY-MM-DD') === now.format("YYYY-MM-DD")) {
            array.push(values)
          }
        })
        setOrderToday([...array])
      }
      //dispatch({ type: ACTION.LOADING, data: false });
      setLoadingTable(false)
    } catch (error) {
      setLoadingTable(false)
      // dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  function onShowSizeChangeTable(current, pageSize) {
    console.log(current, pageSize);
    apiAllOrderDataTable(current, pageSize)
  }
  function onChangeTable(pageNumber) {
    console.log('Page: ', pageNumber);
    apiAllOrderDataTable(pageNumber, 10)
  }

  const onSearchOrderDetail = (e) => {
    setValueSearchOrderDetail(e.target.value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      const value = e.target.value;
      apiAllOrderDataTableOrderDetail(value);
    }, 300);
    // 
  };
  const dateFormat = 'YYYY/MM/DD';
  const apiAllOrderDataTableOrderDetailDate = async (start, end) => {
    try {
      //   dispatch({ type: ACTION.LOADING, data: true });
      setLoadingTable(true)
      const res = await apiAllOrder({ from_date: start, to_date: end });
      console.log(res)
      console.log("___________11111111111222222222222_____")
      if (res.status === 200) {
        setCountTable(res.data.count)
        setOrder(res.data.data)
        let now = moment();
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (moment(values.create_date).format('YYYY-MM-DD') === now.format("YYYY-MM-DD")) {
            array.push(values)
          }
        })
        setOrderToday([...array])
      }
      //dispatch({ type: ACTION.LOADING, data: false });
      setLoadingTable(false)
    } catch (error) {
      setLoadingTable(false)
      // dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  function onChangeDate(dates, dateStrings) {
    setClear(-1)
    setStart(dateStrings && dateStrings.length > 0 ? dateStrings[0] : [])
    setEnd(dateStrings && dateStrings.length > 0 ? dateStrings[1] : [])
    apiAllOrderDataTableOrderDetailDate(dateStrings && dateStrings.length > 0 ? dateStrings[0] : '', dateStrings && dateStrings.length > 0 ? dateStrings[1] : '')
  }
  const openNotificationClear = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Dữ liệu đã được reset về ban đầu.',
    });
  };
  const onClickClear = async () => {
    await apiAllOrderData()
    openNotificationClear()
    setValueSearchOrderDetail("")
    setClear(1)
    setSelectedRowKeysOrderDetail([])
    setSelectedRowKeysOrderList([])
    setShippingStatus("")
    setPaymentStatus("")
    setStart([])
    setEnd([])
  }
  const apiAllOrderDataTablePaymentStatus = async (start) => {
    try {
      //   dispatch({ type: ACTION.LOADING, data: true });
      setLoadingTable(true)
      const res = await apiAllOrder({ _payment_status: start });
      console.log(res)
      console.log("___________11111111111222222222222_____")
      if (res.status === 200) {
        setCountTable(res.data.count)
        setOrder(res.data.data)
        let now = moment();
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (moment(values.create_date).format('YYYY-MM-DD') === now.format("YYYY-MM-DD")) {
            array.push(values)
          }
        })
        setOrderToday([...array])
      }
      //dispatch({ type: ACTION.LOADING, data: false });
      setLoadingTable(false)
    } catch (error) {
      setLoadingTable(false)
      // dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const onChangePaymentStatus = async (e) => {
    console.log(e)
    if (e === 'default') {
      await apiAllOrderData()
    } else {
      setPaymentStatus(e)
      apiAllOrderDataTablePaymentStatus(e)
    }

  }
  const apiAllOrderDataTableShippingStatus = async (start) => {
    try {
      //   dispatch({ type: ACTION.LOADING, data: true });
      setLoadingTable(true)
      const res = await apiAllOrder({ _shipping: start });
      console.log(res)
      console.log("___________11111111111222222222222_____")
      if (res.status === 200) {
        setCountTable(res.data.count)
        setOrder(res.data.data)
        let now = moment();
        var array = []
        res.data.data && res.data.data.length > 0 && res.data.data.forEach((values, index) => {
          if (moment(values.create_date).format('YYYY-MM-DD') === now.format("YYYY-MM-DD")) {
            array.push(values)
          }
        })
        setOrderToday([...array])
      }
      //dispatch({ type: ACTION.LOADING, data: false });
      setLoadingTable(false)
    } catch (error) {
      setLoadingTable(false)
      // dispatch({ type: ACTION.LOADING, data: false });
    }
  };

  const onChangeShippingStatus = async (e) => {
    console.log(e)
    if (e === 'default') {
      await apiAllOrderData()
    } else {
      setShippingStatus(e)
      apiAllOrderDataTableShippingStatus(e)
    }

  }

  return (
    <UI>
      <Online>

        <div className={styles["sell_manager"]}>
          <div className={styles["sell_manager_title"]}>
            <Row className={styles["sell_manager_title_row_top"]}>
              <Col
                className={styles["sell_manager_title_row_col"]}
                xs={24}
                sm={24}
                md={14}
                lg={14}
                xl={14}
              >

                <div style={{ width: '50%' }}>
                  {
                    roleName === 'employee' ? (
                      <Select style={{ width: '50%' }}
                        placeholder="Chọn chi nhánh"
                        optionFilterProp="children"
                        showSearch
                        disabled
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        } value={branchId} onChange={handleChange}>
                        {/* <Option value="default">Chọn cửa hàng</Option> */}
                        {
                          branch && branch.length > 0 && branch.map((values, index) => {
                            return (
                              <Option value={values.branch_id}>{values.name}</Option>
                            )
                          })
                        }
                      </Select>
                    ) : (
                      <Select style={{ width: '100%' }}
                        placeholder="Chọn chi nhánh"
                        optionFilterProp="children"
                        showSearch

                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        } value={branchId} onChange={handleChange}>
                        {/* <Option value="default">Chọn cửa hàng</Option> */}
                        {
                          branch && branch.length > 0 && branch.map((values, index) => {
                            return (
                              <Option value={values.branch_id}>{values.name}</Option>
                            )
                          })
                        }
                      </Select>
                    )
                  }

                </div>

              </Col>
              <Col
                className={styles["sell_manager_title_row_col_home"]}
                xs={24}
                sm={24}
                md={8}
                lg={8}
                xl={8}
              >
                <FunctionShortcut />
              </Col>

              <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                <div>
                  <Row
                    className={styles["sell_manager_title_row_col_child_right"]}
                  >
                    <Col
                      className={styles["sell_manager_title_row_col_user"]}
                      xs={24}
                      sm={24}
                      md={24}
                      lg={12}
                      xl={12}
                    >
                      {/* <div>
                      <div
                        className={
                          styles["sell_manager_title_row_col_child_name"]
                        }
                      >
                        <div>
                          <UserOutlined
                            style={{
                              borderRadius: "50%",
                              padding: "0.25rem",
                              fontSize: "1rem",
                              color: "#08c",
                              backgroundColor: "white",
                            }}
                          />
                        </div>
                        <div>Nguyen Van Ty</div>
                      </div>
                    </div>
                  */}
                    </Col>

                  </Row>
                </div>
              </Col>

            </Row>
            <Row className={styles["sell_manager_title_row_fix"]}>
              {
                billQuantity && billQuantity.length > 0 && billQuantity.map((values, index) => {
                  return (
                    billQuantityStatus === values[0].values ? (<Col
                      className={styles["sell_manager_title_row_col_item_active"]}
                      // onClick={() => onClickStatus(1)}
                      xs={24}
                      sm={24}
                      md={3}
                      lg={3}
                      xl={3}
                    >
                      <div className={styles["sell_manager_title_row_col_orders"]} >
                        <div onClick={() => onClickBillIndex(index, values[0].values, (parseInt(branchId) * 10000) + values[0].values)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                          <div
                            className={
                              styles["sell_manager_title_row_col_orders_title"]
                            }
                          >
                            Hóa đơn
                          </div>
                          <div>{(parseInt(branchId) * 10000) + values[0].values}</div>

                        </div>
                        <div onClick={() => onClickDeleteBillQuantity(index, values[0].values)} style={{ position: 'absolute', top: '0', right: '0' }}><CloseOutlined style={{ paddingRight: '0.25rem', fontSize: '1rem', color: 'red' }} /></div>
                      </div>

                    </Col>) : (<Col
                      className={styles["sell_manager_title_row_col_item"]}
                      // onClick={() => onClickStatus(1)}
                      xs={24}
                      sm={24}
                      md={3}
                      lg={3}
                      xl={3}
                    >

                      <div className={styles["sell_manager_title_row_col_orders"]} >
                        <div onClick={() => onClickBillIndex(index, values[0].values, (parseInt(branchId) * 10000) + values[0].values)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                          <div
                            className={
                              styles["sell_manager_title_row_col_orders_title"]
                            }
                          >
                            Hóa đơn
                          </div>
                          <div>{(parseInt(branchId) * 10000) + values[0].values}</div>

                        </div>
                        <div onClick={() => onClickDeleteBillQuantity(index, values[0].values)} style={{ position: 'absolute', top: '0', right: '0' }}><CloseOutlined style={{ paddingRight: '0.25rem', fontSize: '1rem', color: 'red' }} /></div>
                      </div>
                    </Col>)
                  )
                })
              }

              <Col

                className={styles["sell_manager_title_row_col_item_add"]}
                // onClick={onClickOrders}
                xs={24}
                sm={24}
                md={5}
                lg={5}
                xl={5}
              >
                <div className={styles["sell_manager_title_row_col_orders_add"]}>
                  <div onClick={onClickCreateBill} style={{ width: '2rem' }}>
                    <PlusCircleOutlined
                      style={{
                        fontSize: "1.75rem",
                        color: "white",
                        fontWeight: "900",
                      }}
                      theme="outlined"
                    />
                  </div>
                  {
                    confirm === 0 ? (<div style={{ color: 'red', fontSize: '1rem', fontWeight: '600', marginLeft: '1rem' }}>Chưa chọn hóa đơn</div>) : (confirm === 1 && billName !== '' ? (<div style={{ color: '#50D648', fontSize: '1rem', fontWeight: '600', marginLeft: '1rem' }}>{`Đang xử lý hóa đơn: ${billName}`}</div>) : (''))
                  }

                </div>
              </Col>

            </Row>
            <Row className={styles["sell_manager_title_row"]}>
              <Col
                className={styles["sell_manager_title_row_col"]}
                xs={24}
                sm={24}
                md={14}
                lg={14}
                xl={14}
              >

                <div style={{ width: '100%' }} className={styles["sell_manager_title_row_col_parent"]}>
                  <Dropdown style={{ width: '100' }} trigger={['click']} overlay={content}>
                    <Input style={{ width: '100%' }} name="name" value={valueSearch} enterButton onChange={onSearch} className={styles["orders_manager_content_row_col_search"]}
                      placeholder="Tìm kiếm sản phẩm" autocomplete="off" allowClear />
                  </Dropdown>
                </div>

              </Col>
              <Col
                className={styles["sell_manager_title_row_col"]}
                xs={24}
                sm={24}
                md={8}
                lg={8}
                xl={8}
              >

                <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} >
                  <Radio.Group style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', }} onChange={onChangeOrderStatus} value={orderStatus}>
                    <Radio style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }} value="order now">Order now</Radio>
                    <Radio style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }} value="pre-order">Pre-order</Radio>
                    {/* <Radio style={{ color: 'white', fontSize: '1rem', fontWeight: '600' }} value="order list">Danh sách order</Radio> */}
                  </Radio.Group>
                  <Button onClick={showDrawerOrderList} type="primary" danger>Danh sách order</Button>
                </div>

              </Col>
            </Row>
          </div>
          {/* <div>{JSON.stringify(billQuantity)}</div> */}
          {/* 

        {JSON.stringify(mark)} */}

          <div className={styles["sell_manager_content"]}>
            <Row className={styles["sell_manager_content_row"]}>
              <Col
                className={styles["sell_manager_content_row_col"]}
                xs={24}
                sm={24}
                md={24}
                lg={15}
                xl={15}
              >
                <div>
                  <div className={styles["sell_manager_content_row_col_bottom"]}>
                    <Row
                      className={
                        styles["sell_manager_content_row_col_bottom_row"]
                      }
                    >
                      <Col
                        className={
                          styles["sell_manager_content_row_col_bottom_row_col"]
                        }
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        xl={24}
                      >
                        {/* <div
                        className={styles["sell_manager_content_row_col_table"]}
                      >
                        <Table
                          //   rowSelection={rowSelection}
                          columns={columns}
                          className={
                            styles["sell_manager_content_row_col_table_child"]
                          }
                          dataSource={data}
                          pagination={{ pageSize: 50 }}
                          scroll={{ y: 300 }}
                        />
                      </div> */}
                        <div
                          className={
                            styles[
                            "sell_manager_content_row_col_bottom_row_col_empty"
                            ]
                          }
                        >
                          {
                            billQuantity && billQuantity.length > 0 ? (<div style={{ width: '100%', height: '30rem', maxHeight: '100%', overflow: 'auto', backgroundColor: 'white', border: '1px solid rgb(235, 225, 225)' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column  ' }}>
                                <Row style={{ display: 'flex', borderBottom: '1px solid rgb(226, 213, 213)', paddingBottom: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} >
                                  <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={1}><div style={{ fontSize: '1rem', textAlign: 'center' }}>STT</div></Col>
                                  <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>Mã SKU</div></Col>
                                  <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>Tên sản phẩm</div></Col>
                                  <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>Đơn vị</div></Col>
                                  <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>Số lượng</div></Col>
                                  <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>Đơn giá</div></Col>
                                  <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>Thành tiền</div></Col>
                                  <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={1}></Col>
                                </Row>
                                {
                                  billQuantity && billQuantity.length > 0 && billQuantity.map((values, index) => {
                                    if (index === billIndex) {
                                      return (
                                        values.map((values1, index1) => {
                                          if (index1 !== 0) {
                                            return (
                                              <Row style={{ display: 'flex', marginTop: '1rem', borderBottom: '1px solid rgb(226, 213, 213)', paddingBottom: '1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }} >
                                                <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={1}><div style={{ fontSize: '1rem', textAlign: 'center' }}>{index1}</div></Col>
                                                <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>{values1.sku}</div></Col>
                                                <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>{values1.title}</div></Col>
                                                <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>{record.unit}</div></Col>
                                                <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>

                                                  {
                                                    confirm === 1 ? (<InputNumber min={1}
                                                      max={1000000} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                      parser={value => value.replace(/\$\s?|(,*)/g, '')} value={values1.quantity} name="quantity" onChange={(e) =>

                                                        onChangeQuantityBill(e, index, index1)} />) : (<InputNumber disabled formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                          parser={value => value.replace(/\$\s?|(,*)/g, '')} value={values1.quantity} name="quantity" onChange={(e) =>

                                                            onChangeQuantityBill(e, index, index1)} />)
                                                  }
                                                </div></Col>
                                                <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>{values1.sale_price}</div></Col>
                                                <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={3}><div style={{ fontSize: '1rem', textAlign: 'center' }}>{`${formatCash(String(values1.sale_price * values1.quantity))} VNĐ`}</div></Col>
                                                <Col style={{ width: '100%' }} xs={24} sm={11} md={7} lg={5} xl={1}><DeleteOutlined onClick={() => onClickDeleteBillQuantityItem(index, index1, values1.sku)} style={{ color: 'red', fontSize: '1.5rem', cursor: 'pointer' }} /></Col>
                                              </Row>
                                            )
                                          }

                                        })
                                      )
                                    }

                                  })
                                }

                              </div>
                            </div>) : (<div
                              className={
                                styles[
                                "sell_manager_content_row_col_bottom_row_col_empty"
                                ]
                              }
                            >
                              <div style={{ marginBottom: '1rem' }}><img src={emptyProduct} style={{ width: '7.5rem', height: '7.5rem', objectFit: 'contain' }} alt="" /></div>
                              <div>      Cửa hàng của bạn chưa có hóa đơn nào</div>

                            </div>)
                          }
                        </div>
                      </Col>
                      {
                        productSelect && productSelect.length > 0 ? (
                          <Col
                            className={
                              styles["sell_manager_content_row_col_bottom_row_col"]
                            }
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                          >
                            <div className={styles['product_show']}>
                              <Tabs defaultActiveKey="0" onChange={callback}>
                                {
                                  category && category.length > 0 && category.map((values20, index20) => {
                                    return (
                                      <TabPane tab={values20.name} key={index20}>

                                        <Row style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                                          {
                                            values20.data && values20.data.length > 0 && values20.data.map((values, index) => {

                                              return (
                                                values.variants && values.variants.length > 0 ? (
                                                  values.variants.map((values3, index3) => {
                                                    return (

                                                      <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={7} xl={7} >
                                                        <div
                                                          onClick={() => { onClickModal2Visible(values3, values) }}
                                                          // onClick={() => onClickModal2Visible(values3, values)}
                                                          className={
                                                            styles[
                                                            "sell_manager_content_row_col_bottom_row_col_bottom_col_parent"
                                                            ]
                                                          }
                                                        >
                                                          <div
                                                            onClick={() => onClickMarkVariant(values3.sku)}
                                                            className={
                                                              styles[
                                                              "sell_manager_content_row_col_bottom_row_col_bottom_col_product"
                                                              ]
                                                            }
                                                          >
                                                            <div
                                                              className={
                                                                styles[
                                                                "sell_manager_content_row_col_bottom_row_col_bottom_col_product_image_parent"
                                                                ]
                                                              }
                                                            >
                                                              <img
                                                                className={
                                                                  styles[
                                                                  "sell_manager_content_row_col_bottom_row_col_bottom_col_product_image"
                                                                  ]
                                                                }
                                                                src={values3.image[0]}
                                                                alt=""
                                                              />
                                                            </div>
                                                            <div className={styles["product_information"]}>
                                                              <div>{values3.title}</div>
                                                              <div>{`Giá : ${formatCash(
                                                                String(values3.sale_price))} VNĐ`}</div>
                                                            </div>

                                                            {
                                                              billQuantity && billQuantity.length > 0 && billQuantity[billIndex][0].mark && billQuantity[billIndex][0].mark ? (billQuantity[billIndex][0].mark && billQuantity[billIndex][0].mark.length > 0 && billQuantity[billIndex][0].mark.map((values5, index5) => {
                                                                return (
                                                                  values5 === values3.sku ? (
                                                                    <div style={{ position: 'absolute', top: '0', right: '0' }}><CheckOutlined style={{ fontSize: '1.5rem', fontWeight: '600', color: '#01F701' }} /></div>
                                                                  ) : (
                                                                    ''
                                                                  )
                                                                )
                                                              })) : ('')

                                                            }



                                                          </div>

                                                        </div>
                                                      </Col>

                                                    )

                                                  })
                                                ) : (

                                                  <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={7} xl={7} >
                                                    <div
                                                      onClick={() => onClickAddProductSimple(values)}
                                                      // onClick={() => onClickModal2Visible(values3, values)}
                                                      className={
                                                        styles[
                                                        "sell_manager_content_row_col_bottom_row_col_bottom_col_parent"
                                                        ]
                                                      }
                                                    >
                                                      <div
                                                        onClick={() => onClickMark(values.sku)}
                                                        className={
                                                          styles[
                                                          "sell_manager_content_row_col_bottom_row_col_bottom_col_product"
                                                          ]
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            styles[
                                                            "sell_manager_content_row_col_bottom_row_col_bottom_col_product_image_parent"
                                                            ]
                                                          }
                                                        >
                                                          <img
                                                            className={
                                                              styles[
                                                              "sell_manager_content_row_col_bottom_row_col_bottom_col_product_image"
                                                              ]
                                                            }
                                                            src={values.image[0]}
                                                            alt=""
                                                          />
                                                        </div>
                                                        <div className={styles["product_information"]}>
                                                          <div>{values.name}</div>
                                                          <div>{`Giá : ${formatCash(
                                                            String(values.sale_price))} VNĐ`}</div>
                                                        </div>
                                                        {/* <div style={{ position: 'absolute', top: '0', right: '0' }}><CheckOutlined style={{ fontSize: '1.5rem', fontWeight: '600', color: '#01F701' }} /></div> */}
                                                        {
                                                          billQuantity && billQuantity.length > 0 && billQuantity[billIndex][0].mark && billQuantity[billIndex][0].mark ? (billQuantity[billIndex][0].mark && billQuantity[billIndex][0].mark.length > 0 && billQuantity[billIndex][0].mark.map((values5, index5) => {
                                                            return (
                                                              values5 === values.sku ? (
                                                                <div style={{ position: 'absolute', top: '0', right: '0' }}><CheckOutlined style={{ fontSize: '1.5rem', fontWeight: '600', color: '#01F701' }} /></div>
                                                              ) : (
                                                                ''
                                                              )
                                                            )
                                                          })) : ('')

                                                        }
                                                      </div>

                                                    </div>
                                                  </Col>

                                                )



                                              )
                                            })
                                          }


                                        </Row>

                                      </TabPane>
                                    )
                                  })
                                }


                              </Tabs>

                            </div>
                            {/* <Pagination
                            style={{ margin: '2rem 0 1rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                            showSizeChanger
                            onChange={onChangeWork}
                            onShowSizeChange={onShowSizeChange}
                            defaultCurrent={10}
                            total={count}
                          /> */}
                          </Col>
                        ) : ('')
                      }

                    </Row>
                  </div>
                </div>
              </Col>
              <Col
                className={styles["sell_manager_content_row_col_right"]}
                xs={24}
                sm={24}
                md={24}
                lg={8}
                xl={8}
              >
                <div
                  className={styles["sell_manager_content_row_col_right_parent"]}
                >
                  <Form
                    onFinish={onFinish}
                    className={
                      styles["sell_manager_content_row_col_right_parent_content"]
                    }
                  >
                    <div>
                      <div
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_search"
                          ]
                        }
                      >
                        <Row
                          className={
                            styles[
                            "sell_manager_content_row_col_right_parent_search_row"
                            ]
                          }
                        >
                        </Row>
                      </div>
                      <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                        {
                          billQuantity && billQuantity.length > 0 ? (<Col xs={24} sm={24} md={20} lg={20} xl={20} style={{ width: '100%' }}>

                            {
                              customerBackup && customerBackup.length > 0 && billQuantity && billQuantity.length > 0 ? (<Dropdown style={{ width: '100%' }} trigger={['click']} overlay={contentCustomer}>
                                <Input style={{ width: '100%' }} name="name" onClick={onClickSearchCustomer} value={valueSearchCustomer} enterButton onChange={onSearchCustomer} className={styles["orders_manager_content_row_col_search"]}
                                  placeholder="Tìm khách hàng theo tên, số điện thoại" autocomplete="off" allowClear />
                              </Dropdown>) : (
                                <Input style={{ width: '100%' }} name="name" onClick={onClickSearchCustomer} value={valueSearchCustomer} enterButton onChange={onSearchCustomer} className={styles["orders_manager_content_row_col_search"]}
                                  placeholder="Tìm khách hàng theo tên, số điện thoại" autocomplete="off" allowClear />
                              )
                            }

                          </Col>) : (<Col xs={24} sm={24} md={20} lg={20} xl={20} style={{ width: '100%' }}>

                            {
                              customerBackup && customerBackup.length > 0 && billQuantity && billQuantity.length > 0 ? (<Dropdown style={{ width: '100%' }} trigger={['click']} overlay={contentCustomer}>
                                <Input disabled style={{ width: '100%' }} name="name" onClick={onClickSearchCustomer} value={valueSearchCustomer} enterButton onChange={onSearchCustomer} className={styles["orders_manager_content_row_col_search"]}
                                  placeholder="Tìm khách hàng theo tên, số điện thoại" autocomplete="off" allowClear />
                              </Dropdown>) : (
                                <Input disabled style={{ width: '100%' }} name="name" onClick={onClickSearchCustomer} value={valueSearchCustomer} enterButton onChange={onSearchCustomer} className={styles["orders_manager_content_row_col_search"]}
                                  placeholder="Tìm khách hàng theo tên, số điện thoại" autocomplete="off" allowClear />
                              )
                            }

                          </Col>)
                        }

                        <Col xs={24} sm={24} md={3} lg={3} xl={3} style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Button onClick={showDrawer} icon={<PlusOutlined />} type="primary"></Button>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ width: '100%', display: 'flex', margin: '1.5rem 0 0 0 ', justifyContent: 'flex-start', alignItems: 'center' }}>
                          {
                            billQuantity && billQuantity.length > 0 ? (<Checkbox checked={customerOddMain} value={customerOddMain} style={{ color: 'black', fontWeight: '600' }} onChange={onChangeCustomerOdd}>Khách lẻ</Checkbox>) : (<Checkbox disabled style={{ color: 'black', fontWeight: '600' }}>Khách lẻ</Checkbox>)
                          }

                        </Col>
                      </Row>
                      {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div style={{ paddingBottom: '1rem', color: 'black', fontWeight: '600' }}>Thuế</div>
                      <div style={{ paddingBottom: '1rem', }}>0 VNĐ</div>
                    </div> */}
                      {
                        billQuantity && billQuantity.length > 0 && billQuantity[billIndex][0].customer && billQuantity[billIndex][0].customer.length > 0 ? (
                          billQuantity[billIndex][0].customer.map((values, index) => {
                            return (

                              <div style={{ width: '100%', borderBottom: '1px solid rgb(235, 225, 225)', marginBottom: '1.25rem' }}>
                                <div
                                  style={{ marginTop: '1.25rem' }}
                                  className={
                                    styles[
                                    "sell_manager_content_row_col_right_parent_content_money_fix"
                                    ]
                                  }
                                >
                                  <div style={{ width: '100%', fontWeight: '600', color: 'black', paddingBottom: '1rem' }}>{`Tên khách hàng: ${values.first_name} - ${values.phone}.`}</div>
                                </div>
                                <div
                                  className={
                                    styles[
                                    "sell_manager_content_row_col_right_parent_content_money_fix"
                                    ]
                                  }
                                >
                                  <div style={{ width: '100%', fontWeight: '600', color: 'black', paddingBottom: '1rem' }}>{`Địa chỉ: ${values.address}.`}</div>
                                </div>
                                <div
                                  className={
                                    styles[
                                    "sell_manager_content_row_col_right_parent_content_money_fix"
                                    ]
                                  }
                                >
                                  {
                                    values.balance && values.balance.length > 0 ? (<div onClick={showDrawerOrder} style={{ cursor: 'pointer', color: '#336CFB', width: '100%', fontWeight: '600', paddingBottom: '1.5rem' }}>
                                      {
                                        values.balance && values.balance.length > 0 ? (`Đơn hàng đã mua: ${values.balance.length}`) : (`Đơn hàng đã mua: 0`)
                                      }
                                    </div>) : (<div onClick={showDrawerOrder} style={{ cursor: 'pointer', color: '#336CFB', width: '100%', fontWeight: '600', paddingBottom: '1.5rem' }}>
                                      {
                                        values.balance && values.balance.length > 0 ? (`Đơn hàng đã mua: ${values.balance.length}`) : (`Đơn hàng đã mua: 0`)
                                      }
                                    </div>)
                                  }

                                </div>


                                <div
                                  className={
                                    styles[
                                    "sell_manager_content_row_col_right_parent_content_money_fix"
                                    ]
                                  }
                                >
                                  <div style={{ width: '100%', fontWeight: '600', color: 'black', paddingBottom: '1.5rem' }}>Quà tặng</div>
                                  <Form.Item
                                    style={{ width: '100%' }}
                                    name="selectGift"
                                    // label="Select"
                                    hasFeedback
                                    rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                                  >

                                    <Select style={{ width: '100%' }} defaultValue="default">
                                      <Option value="default">Chọn quà tặng</Option>
                                      <Option value="voucherA">Quà tặng A</Option>
                                      <Option value="voucherB">Quà tặng B</Option>
                                    </Select>
                                  </Form.Item>
                                </div>



                              </div>

                            )
                          })
                        ) : (<div style={{ marginBottom: '1rem' }}></div>)
                      }




                      <div
                        style={{ marginBottom: '1.5rem' }}
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_content_money_radio"
                          ]
                        }
                      >
                        <div>Phương thức nhận hàng</div>

                        <Radio.Group value={receiveMethod} onChange={onChangeReceiveMethod}>
                          {
                            shipping && shipping.length > 0 && shipping.map((values, index) => {
                              return (
                                <Radio style={{ marginTop: '0.5rem' }} value={values.transport_id}>{values.name}</Radio>
                              )
                            })
                          }


                        </Radio.Group>

                      </div>







                      <div
                        style={{ marginBottom: '1.5rem' }}
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_content_money_radio"
                          ]
                        }
                      >
                        <div>Chọn hình thức thanh toán</div>

                        <Radio.Group value={paymentMethod} onChange={onChangePaymentMethod}>
                          {
                            payment && payment.length > 0 && payment.map((values, index) => {
                              return (
                                <Radio style={{ marginTop: '0.5rem' }} value={values.payment_id}>{values.name}</Radio>
                              )
                            })
                          }

                        </Radio.Group>

                      </div>

                      <div
                        style={{ marginBottom: '1rem' }}
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_content_money_radio"
                          ]
                        }
                      >
                        <div>Tiền khách đưa</div>
                        {
                          moneyPredict && moneyPredict.length > 0 ? (<Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                            {
                              moneyPredict && moneyPredict.length > 0 && moneyPredict.map((values, index) => {
                                return (
                                  <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={11} md={11} lg={7} xl={7}>
                                    {
                                      indexPaymentMoney === index ? (<Button style={{ width: '7rem', backgroundColor: '#50D648' }} onClick={() => onClickPredictMoney(values, index)} type="primary">{`${formatCash(
                                        String(values))} VNĐ`}</Button>) : (<Button style={{ width: '7rem' }} onClick={() => onClickPredictMoney(values, index)} type="primary">{`${formatCash(
                                          String(values))} VNĐ`}</Button>)
                                    }

                                  </Col>
                                )
                              })
                            }

                          </Row>) : (<Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

                            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={11} md={11} lg={7} xl={7}>
                              <Button style={{ width: '7rem' }} type="primary">100.000 VNĐ</Button>
                            </Col>
                            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={11} md={11} lg={7} xl={7}>
                              <Button style={{ width: '7rem' }} type="primary">200.000 VNĐ</Button>
                            </Col>
                            <Col style={{ width: '100%', marginTop: '0.5rem' }} xs={24} sm={11} md={11} lg={7} xl={7}>
                              <Button style={{ width: '7rem' }} type="primary">500.000 VNĐ</Button>
                            </Col>

                          </Row>)
                        }


                      </div>
                      <div
                        style={{ marginBottom: '0.5rem' }}
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_content_money_fix"
                          ]
                        }
                      >
                        <div style={{ fontWeight: '600', color: 'red', fontSize: '1rem' }}> Tiền thối</div>
                        <div style={{ fontWeight: '600', color: 'red', fontSize: '1rem' }}>{
                          paidCustomerMoney ?
                            `${formatCash(
                              String(paidCustomerMoney))} VNĐ` : '0 VNĐ'}</div>
                      </div>


                      <Input
                        value={note}
                        onChange={onChangeNote}
                        prefix={<EditOutlined />}
                        style={{ paddingLeft: '0.5rem', marginBottom: '1.5rem' }}
                        placeholder="Nhập ghi chú đơn hàng"
                      />

                      <div
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_content_money"
                          ]
                        }
                      >
                        <div style={{ fontWeight: '600', color: 'black', marginRight: '1rem' }}>Thuế</div>
                        <div style={{ width: '100%' }}>

                          <Select showSearch
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Chọn thuế"
                            optionFilterProp="children"

                            filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }





                            onChange={onChangeTax}
                            value={taxDefault}
                          >
                            {/* <Option value="default">Tất cả thuế</Option> */}
                            {
                              tax && tax.length > 0 && tax.map((values, index) => {
                                return (
                                  <Option value={values.name}>{values.name}</Option>
                                )
                              })
                            }
                          </Select>

                        </div>
                      </div>
                      {
                        moneyFinish && moneyFinish > 0 ? (
                          promotionValue && promotionValue === 'default' ? (<div
                            style={{ paddingTop: '0.5rem' }}
                            className={
                              styles[
                              "sell_manager_content_row_col_right_parent_content_money_fix"
                              ]
                            }
                          >
                            <div style={{ fontWeight: '600', color: 'black', marginRight: '1rem' }}>Voucher</div>

                            <Input style={{ width: '100%' }} name="name" value={voucher} enterButton onChange={onChangeVoucher} className={styles["orders_manager_content_row_col_search"]}
                              placeholder="Nhập voucher" autocomplete="off" allowClear />
                          </div>) : (<div
                            style={{ paddingTop: '0.5rem' }}
                            className={
                              styles[
                              "sell_manager_content_row_col_right_parent_content_money_fix"
                              ]
                            }
                          >
                            <div style={{ fontWeight: '600', color: 'black', marginRight: '1rem' }}>Voucher</div>
                            <Input disabled style={{ width: '100%' }} name="name" value={voucher} enterButton onChange={onChangeVoucher} className={styles["orders_manager_content_row_col_search"]}
                              placeholder="Nhập voucher" autocomplete="off" allowClear />
                          </div>)
                        ) : (
                          promotionValue && promotionValue === 'Chọn voucher' ? (<div
                            style={{ paddingTop: '0.5rem' }}
                            className={
                              styles[
                              "sell_manager_content_row_col_right_parent_content_money_fix"
                              ]
                            }
                          >
                            <div style={{ fontWeight: '600', color: 'black', marginRight: '1rem' }}>Voucher</div>
                            <Input disabled style={{ width: '100%' }} name="name" value={voucher} enterButton onChange={onChangeVoucher} className={styles["orders_manager_content_row_col_search"]}
                              placeholder="Nhập voucher" autocomplete="off" allowClear />
                          </div>) : (<div
                            style={{ paddingTop: '0.5rem' }}
                            className={
                              styles[
                              "sell_manager_content_row_col_right_parent_content_money_fix"
                              ]
                            }
                          >
                            <div style={{ fontWeight: '600', color: 'black', marginRight: '1rem' }}>Voucher</div>
                            <Input disabled style={{ width: '100%' }} name="name" value={voucher} enterButton onChange={onChangeVoucher} className={styles["orders_manager_content_row_col_search"]}
                              placeholder="Nhập voucher" autocomplete="off" allowClear />
                          </div>)
                        )
                      }



                      {
                        moneyFinish && moneyFinish > 0 ? (
                          <div
                            style={{ margin: '1.25rem 0 1rem 0' }}
                            className={
                              styles[
                              "sell_manager_content_row_col_right_parent_content_money_fix"
                              ]
                            }
                          >
                            <div style={{ fontWeight: '600', color: 'black', }}>Áp dụng CTKM</div>
                            {
                              voucher && voucher !== '' || voucher && voucher !== 'default' || voucher && voucher !== ' ' ? (<Select style={{ width: '100%' }} disabled defaultValue="default">
                                <Option value="default">Chọn voucher</Option>
                                {
                                  promotion && promotion.length > 0 && promotion.map((values, index) => {
                                    return (
                                      <Option value={values}>{values}</Option>
                                    )
                                  })
                                }



                              </Select>) : (<Select style={{ width: '100%' }} placeHolder="Chọn voucher" value={promotionValue} onChange={onChangePromotionValue} >
                                <Option value="default">Không dùng</Option>
                                {

                                  promotion && promotion.length > 0 && promotion.map((values, index) => {
                                    return (
                                      <Option value={values.name}>{values.name}</Option>
                                    )
                                  })
                                }



                              </Select>)
                            }

                          </div>
                        ) : (
                          <div
                            style={{ margin: '1.25rem 0 1rem 0' }}
                            className={
                              styles[
                              "sell_manager_content_row_col_right_parent_content_money_fix"
                              ]
                            }
                          >
                            <div style={{ fontWeight: '600', color: 'black', }}>Áp dụng CTKM</div>
                            {
                              voucher && voucher !== '' || voucher && voucher !== 'default' || voucher && voucher !== ' ' ? (<Select style={{ width: '100%' }} disabled defaultValue="default">
                                <Option value="default">Không</Option>
                                {
                                  promotion && promotion.length > 0 && promotion.map((values, index) => {
                                    return (
                                      <Option value={values}>{values}</Option>
                                    )
                                  })
                                }



                              </Select>) : (<Select style={{ width: '100%' }} disabled placeHolder="Chọn voucher" value={promotionValue} onChange={onChangePromotionValue} >

                                {
                                  promotion && promotion.length > 0 && promotion.map((values, index) => {
                                    return (
                                      <Option value={values}>{values}</Option>
                                    )
                                  })
                                }



                              </Select>)
                            }

                          </div>
                        )
                      }






                      <div
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_content_money"
                          ]
                        }
                      >
                        <div style={{ fontWeight: '600', color: 'black', fontSize: '1rem' }}>Tổng tiền</div>
                        <div style={{ fontWeight: '600', color: 'black', fontSize: '1rem' }}>
                          {
                            confirm === 1 && moneyTotal && billQuantity && billQuantity.length > 0 && moneyTotal > 0 ? (`${formatCash(
                              String(moneyTotal))} VNĐ`) : ('0 VNĐ')
                          }

                        </div>
                      </div>

                      <div
                        style={{ paddingBottom: '0.25rem' }}
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_content_money"
                          ]
                        }
                      >
                        <div
                          style={{ fontWeight: '600', color: 'black', fontSize: '1rem' }}
                        >
                          Chiết khấu
                        </div>
                        <div style={{ fontWeight: '600', color: 'black', fontSize: '1rem' }}>
                          {
                            confirm === 1 && discount && billQuantity && billQuantity.length > 0 && discount > 0 && discountMoney && discountMoney > 0 ? (`-${formatCash(
                              String(discountMoney))} VNĐ`) : ('0 VNĐ')
                          }
                          {/* {
                          confirm === 1 && discount && billQuantity && billQuantity.length > 0 && discount > 0 && discountMoney && discountMoney > 0 ? (`-${formatCash(
                            String(discountMoney))} VNĐ (-${discount}%)`) : ('0 VNĐ')
                        } */}
                        </div>
                      </div>
                      <div
                        style={{ paddingBottom: '0.25rem' }}
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_content_money"
                          ]
                        }
                      >
                        <div
                          style={{ fontWeight: '600', color: 'black', fontSize: '1rem' }}
                        >
                          Tổng thuế
                        </div>
                        <div style={{ fontWeight: '600', color: 'black', fontSize: '1rem' }}>
                          {
                            confirm === 1 && taxPercentValue && billQuantity && billQuantity.length > 0 && taxPercentValue > 0 && taxMoneyValue && taxMoneyValue > 0 ? (`+${formatCash(
                              String(taxMoneyValue))} VNĐ`) : ('0 VNĐ')
                          }
                          {/* {
                          confirm === 1 && taxPercentValue && billQuantity && billQuantity.length > 0 && taxPercentValue > 0 && taxMoneyValue && taxMoneyValue > 0 ? (`+${formatCash(
                            String(taxMoneyValue))} VNĐ (+${taxPercentValue}%)`) : ('0 VNĐ')
                        } */}
                        </div>
                      </div>
                      <div
                        style={{ borderTop: '1px solid grey', paddingTop: '1rem', }}
                        className={
                          styles[
                          "sell_manager_content_row_col_right_parent_content_money"
                          ]
                        }
                      >
                        <div
                          style={{ fontWeight: '600', color: 'black', fontSize: '1.25rem' }}
                        >
                          Thành tiền
                        </div>
                        <div style={{ fontWeight: '600', color: 'black', fontSize: '1.25rem' }}>
                          {
                            confirm === 1 && moneyFinish && billQuantity && billQuantity.length > 0 && moneyFinish > 0 ? (`${formatCash(
                              String(moneyFinish))} VNĐ`) : ('0 VNĐ')
                          }
                        </div>
                      </div>
                      {/* <div
                      className={
                        styles[
                        "sell_manager_content_row_col_right_parent_content_money_fix"
                        ]
                      }
                    >
                      <div style={{ fontWeight: '600', color: 'black', paddingBottom: '1.5rem' }}>Tiền khách đưa</div>
                      <Form.Item
                        // label="Username"
                        name="customerMoney"
                        rules={[{ required: true, message: 'Giá trị rỗng!' }]}
                      >

                        <InputNumber
                          style={{ width: '100%' }}
                          // defaultValue={1000}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          onChange={onChangeCustomerMoney}
                        />

                      </Form.Item>
                    </div> */}


                    </div>

                    <div
                      className={
                        styles[
                        "sell_manager_content_row_col_right_parent_content_money_input_button"
                        ]
                      }
                    >
                      <div>
                        {/* <Button size="large" className={styles["button_background"]}>
                        Đặt hàng
                      </Button> */}
                      </div>
                      <div>
                        <Button
                          onClick={onClickPayment}
                          style={{ borderRadius: '0.25rem' }}
                          size="large"
                          className={styles["button_background_right"]}
                        >
                          Thanh toán (F5)
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
              </Col>
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem', alignItems: 'center', width: '100%', color: 'black', fontSize: '1rem', fontWeight: '600' }}>
                {
                  `Tên nhân viên: ${userEmployee.first_name} ${userEmployee.last_name}`
                }
              </div>
            </Row>
          </div>
        </div>
        <Modal
          title="Tùy chọn"
          centered
          width={1000}
          footer={null}
          visible={modal2Visible}
          onOk={() => modal2VisibleModal(false)}
          onCancel={() => modal2VisibleModal(false)}
        >
          <Row style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={11} xl={11}>
              <Row style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Popover placement="right" content={() => contentHoverVariant(objectVariant.image[0])}>
                    <img src={objectVariant && objectVariant.image && objectVariant.image.length > 0 ? objectVariant.image[0] : ''} style={{ width: '100%', cursor: 'pointer', height: '100%', objectFit: 'contain' }} alt="" />
                  </Popover>
                </Col>
                <Col style={{ width: '100%' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    {
                      objectVariant && objectVariant.image && objectVariant.image.length > 0 && objectVariant.image.map((values, index) => {
                        if (index !== 0) {
                          return (
                            <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={7}>
                              <Popover placement="right" content={() => contentHoverVariant(values)}>
                                <img src={values} style={{ marginTop: '1rem', cursor: 'pointer', width: '100%', height: '100%', objectFit: 'contain' }} alt="" />
                              </Popover>
                            </Col>
                          )
                        }

                      })
                    }

                  </Row>
                </Col>
              </Row>
            </Col>
            <Col style={{ width: '100%', marginLeft: '1.5rem' }} xs={24} sm={24} md={24} lg={11} xl={11}>
              <div className={styles['variant']}>
                <div style={{ color: 'black', fontWeight: '600', width: '100%', fontSize: '1.5rem' }}>{objectVariant.title}</div>
                <div style={{ width: '100%' }}>
                  <div style={{ color: 'black', fontSize: '1.5rem', fontWeight: '600' }}>{`${formatCash(
                    String(objectVariant.sale_price))} đ`}</div>
                  <div style={{ textDecoration: 'line-through', color: 'grey', fontSize: '1.25rem', marginLeft: '1rem', fontWeight: '600' }}>{`${formatCash(
                    String(objectVariant.sale_price * 2))} đ`}</div>
                </div>
                <div style={{ width: '100%' }}>
                  <div style={{ color: 'grey', fontSize: '1rem', fontWeight: '600', }}>Màu sắc: </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    {
                      record && record.attributes && record.attributes.length > 0 && record.attributes.map((values1, index1) => {
                        if (index1 === 0) {
                          return (
                            values1.values.map((values2, index2) => {
                              if (index2 === color) {
                                return (

                                  <div style={{ color: 'black', marginLeft: '1rem', fontWeight: '600', fontSize: '1.25rem' }}>{values2}</div>
                                )
                              }
                            })
                          )
                        }
                      })
                    }
                  </div>
                </div>
                <div style={{ width: '100%', marginTop: '0.5rem' }}>
                  {
                    record && record.attributes && record.attributes.length > 0 && record.attributes.map((values1, index1) => {
                      if (index1 === 0) {
                        return (
                          values1.values.map((values2, index2) => {
                            if (index2 === color) {
                              return (

                                <div onClick={() => onClickColor(index2, values2)} style={{ backgroundColor: '#E6F2FF', fontWeight: '600', border: '1px solid #165FB4', color: 'black', marginRight: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '0.25rem' }}>{values2}</div>
                              )
                            } else {
                              return (

                                <div onClick={() => onClickColor(index2, values2)} style={{ backgroundColor: '#F2F2F2', color: 'black', marginRight: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '0.25rem' }}>{values2}</div>
                              )
                            }
                          })
                        )
                      }
                    })
                  }
                </div>





                <div style={{ width: '100%', marginTop: '0.5rem' }}>
                  <div style={{ color: 'grey', fontSize: '1rem', fontWeight: '600', }}>Kích thước: </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    {
                      record && record.attributes && record.attributes.length > 0 && record.attributes.map((values1, index1) => {
                        if (index1 === 1) {
                          return (
                            values1.values.map((values2, index2) => {
                              if (index2 === size) {
                                return (

                                  <div style={{ color: 'black', marginLeft: '1rem', fontWeight: '600', fontSize: '1.25rem' }}>{values2}</div>
                                )
                              }
                            })
                          )
                        }
                      })
                    }
                  </div>
                </div>
                <div style={{ width: '100%', marginTop: '0.5rem' }}>
                  {
                    record && record.attributes && record.attributes.length > 0 && record.attributes.map((values1, index1) => {
                      if (index1 === 1) {
                        return (
                          values1.values.map((values2, index2) => {
                            if (index2 === size) {
                              return (

                                <div onClick={() => onClickSize(index2, values2)} style={{ backgroundColor: '#E6F2FF', fontWeight: '600', border: '1px solid #165FB4', color: 'black', marginRight: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '0.25rem' }}>{values2}</div>
                              )
                            } else {
                              return (

                                <div onClick={() => onClickSize(index2, values2)} style={{ backgroundColor: '#F2F2F2', color: 'black', marginRight: '1rem', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '0.25rem' }}>{values2}</div>
                              )
                            }
                          })
                        )
                      }
                    })
                  }
                </div>
                <div style={{ width: '100%', flexDirection: 'column', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <div style={{ color: 'grey', fontSize: '1rem', marginTop: '0.25rem', fontWeight: '600', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>Số lượng: </div>
                  <div style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <ButtonGroup style={{ width: '100%', marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                      {
                        orderStatus === 'order now' ? (parseInt(objectVariant.available_stock_quantity) + parseInt(objectVariant.low_stock_quantity) > 0 ? (<Button onClick={decline}>
                          <MinusOutlined />
                        </Button>) : (<Button disabled onClick={decline}>
                          <MinusOutlined />
                        </Button>)) : (<Button onClick={decline}>
                          <MinusOutlined />
                        </Button>)
                      }

                      {
                        orderStatus === 'order now' ? (parseInt(objectVariant.available_stock_quantity) + parseInt(objectVariant.low_stock_quantity) > 0 ? (
                          <Input
                            value={quantity} style={{ width: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} name="quantity" onChange={onChangeQuantity} />) : (<Input
                              disabled
                              value={quantity} style={{ width: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} name="quantity" onChange={onChangeQuantity} />)
                        ) : (<Input
                          value={quantity} style={{ width: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} name="quantity" onChange={onChangeQuantity} />)
                      }



                      {
                        orderStatus === 'order now' ? (parseInt(objectVariant.available_stock_quantity) + parseInt(objectVariant.low_stock_quantity) > 0 ? (<Button onClick={increase}>
                          <PlusOutlined />
                        </Button>) : (<Button disabled onClick={increase}>
                          <PlusOutlined />
                        </Button>)) : (<Button onClick={increase}>
                          <PlusOutlined />
                        </Button>)
                      }



                    </ButtonGroup>
                  </div>
                </div>
                <div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </Col>
            {
              checkQuantity.length === 0 ? (checkVariantSize.length === 1 && checkVariantColor.length === 1 && checkQuantity.length === 0 ? (<div onClick={onClickAddProductVariant} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button type="primary" style={{ width: '10rem' }}>Thêm vào giỏ hàng</Button></div>) : (
                checkVariantSize.length === 0 && checkVariantColor.length === 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button disabled type="primary" style={{ width: '10rem' }}>Chưa có thuộc tính</Button></div>) : (
                  checkQuantity.length === 1 ? (<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
                    <Button disabled type="primary" style={{ width: '10rem' }}>Không đủ hàng</Button>
                  </div>) : (<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
                    <Button disabled type="primary" style={{ width: '10rem' }}>Hết hàng</Button>
                  </div>)

                )
              )) : (checkVariantSize.length === 1 && checkVariantColor.length === 1 && checkQuantity.length === 0 ? (<div onClick={onClickAddProductVariant} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button type="primary" style={{ width: '10rem' }}>Thêm vào giỏ hàng</Button></div>) : (
                checkVariantSize.length === 0 && checkVariantColor.length === 0 ? (<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}><Button disabled type="primary" style={{ width: '10rem' }}>Chưa có thuộc tính</Button></div>) : (
                  checkQuantity.length === 1 ? (<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
                    <Button disabled type="primary" style={{ width: '10rem' }}>Không đủ hàng</Button>
                  </div>) : (<div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginTop: '1rem' }}>
                    <Button disabled type="primary" style={{ width: '10rem' }}>Hết hàng</Button>
                  </div>)

                )
              ))
            }

          </Row>
        </Modal>
        <Drawer
          title="Thêm mới khách hàng"
          width={1000}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form
            layout="vertical"
            initialValues={branchDetail}
            form={form}
            onFinish={onFinishAddCustomer}
            onFinishFailed={onFinishFailedAddCustomer}
            style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', }}>
              <Col style={{ width: '100%', marginBottom: '1.5rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red' }}>*</b>Tên khách hàng</div>
                <Input value={customerName} onChange={onChangeCustomerName} placeholder="Nhập tên khách hàng" />


              </Col>
              <Col style={{ width: '100%', marginBottom: '1.5rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red' }}>*</b>Liên hệ</div>
                <Input value={randomPhoneValue} onChange={onChangeRandom} placeholder="Nhập liên hệ" />

              </Col>
            </Row>

            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', }}>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Tỉnh/thành phố</div>
                <Form.Item

                  name="ward"

                >
                  <Select showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn tỉnh/thành phố"
                    optionFilterProp="children"


                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } value={city ? city : 'default'} onChange={(event) => { handleChangeCustomer(event); handleChangeCity(event) }}>
                    <Option value="default">Tất cả tỉnh/thành phố</Option>
                    {
                      provinceMain && provinceMain.length > 0 && provinceMain.map((values, index) => {
                        return (
                          <Option value={values.province_name}>{values.province_name}</Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>

              </Col>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Độ tuổi</div>
                <Radio.Group onChange={onChangeBirthday} value={value}>
                  <Radio value={'18'}>Dưới 18</Radio>
                  <Radio value={'25'}>18 đến 25</Radio>
                  <Radio value={'35'}>25 đến 35</Radio>
                  <Radio value={'100'}>Trên 35</Radio>
                </Radio.Group>

              </Col>
            </Row>

            <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%', }}>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Quận/huyện</div>
                <Form.Item

                  name="district"

                >
                  <Select showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn quận/huyện"
                    optionFilterProp="children"


                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    } >
                    <Option value="default">Tất cả quận/huyện</Option>
                    {
                      districtMainAPI && districtMainAPI.length > 0 ? (districtMainAPI && districtMainAPI.length > 0 && districtMainAPI.map((values, index) => {
                        return (
                          <Option value={values.district_name}>{values.district_name}</Option>
                        )
                      })) : (districtMain && districtMain.length > 0 && districtMain.map((values, index) => {
                        return (
                          <Option value={values.district_name}>{values.district_name}</Option>
                        )
                      }))
                    }
                  </Select>
                </Form.Item>

              </Col>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Địa chỉ</div>
                <Form.Item

                  name="address"

                >
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>

              </Col>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>


              </Col>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Giới tính</div>

                <Radio.Group onChange={onChangeSex} value={valueSex}>
                  <Radio value={'Nam'}>Nam</Radio>
                  <Radio value={'Nữ'}>Nữ</Radio>
                  <Radio value={'Khác'}>Khác</Radio>
                </Radio.Group>


              </Col>
            </Row>

            <Form.Item style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                <Button htmlType="submit" type="primary" style={{ with: '10rem' }}>Thêm khách hàng</Button>
              </div>

            </Form.Item>
          </Form>
        </Drawer>
        <Drawer
          title="Đơn hàng đặt gần nhất"
          width={600}
          onClose={onCloseOrder}
          visible={visibleOrder}
          bodyStyle={{ paddingBottom: 80 }}
        >
          {
            customerOnClick && customerOnClick.length > 0 && customerOnClick.balance && customerOnClick.balance.length > 0 ? (
              <div style={{
                height: '100%', maxHeight: '100%', overflow: 'auto',
                display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column'
              }}>
                < div className={styles['order']} >
                  <div>
                    <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}>Nguyễn Văn A - 0384943497</div>
                    <div style={{ color: 'grey' }}>10:00am, 03/08/2021</div>
                  </div>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}>Giày thể thao kiểu dáng Hàn Quốc</div>
                  <div>
                    <div style={{ color: 'grey', fontSize: '1rem' }}>Màu: Đỏ Đen, Size: 38</div>
                    <div style={{ color: 'grey', fontSize: '1rem' }}>x2</div>
                  </div>
                  <div style={{ color: 'grey', paddingBottom: '1rem', borderBottom: '1px solid rgb(233, 217, 217)', fontSize: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>250,000 VNĐ</div>
                  <div style={{ color: 'black', paddingBottom: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'flex-end', fontWeight: '600', marginTop: '0.5rem', alignItems: 'center', width: '100%' }}>Thành tiền: 500,000 VNĐ</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}><Button type="primary" style={{ width: '7.5rem' }}>Đặt lại</Button></div>
                </div>
                <div className={styles['order']}>
                  <div>
                    <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}>Nguyễn Văn A - 0384943497</div>
                    <div style={{ color: 'grey' }}>10:00am, 03/08/2021</div>
                  </div>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}>Giày thể thao kiểu dáng Hàn Quốc</div>
                  <div>
                    <div style={{ color: 'grey', fontSize: '1rem' }}>Màu: Đỏ Đen, Size: 38</div>
                    <div style={{ color: 'grey', fontSize: '1rem' }}>x2</div>
                  </div>
                  <div style={{ color: 'grey', paddingBottom: '1rem', borderBottom: '1px solid rgb(233, 217, 217)', fontSize: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>250,000 VNĐ</div>
                  <div style={{ color: 'black', paddingBottom: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'flex-end', fontWeight: '600', marginTop: '0.5rem', alignItems: 'center', width: '100%' }}>Thành tiền: 500,000 VNĐ</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}><Button type="primary" style={{ width: '7.5rem' }}>Đặt lại</Button></div>
                </div>
                <div className={styles['order']}>
                  <div>
                    <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}>Nguyễn Văn A - 0384943497</div>
                    <div style={{ color: 'grey' }}>10:00am, 03/08/2021</div>
                  </div>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}>Giày thể thao kiểu dáng Hàn Quốc</div>
                  <div>
                    <div style={{ color: 'grey', fontSize: '1rem' }}>Màu: Đỏ Đen, Size: 38</div>
                    <div style={{ color: 'grey', fontSize: '1rem' }}>x2</div>
                  </div>
                  <div style={{ color: 'grey', paddingBottom: '1rem', borderBottom: '1px solid rgb(233, 217, 217)', fontSize: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>250,000 VNĐ</div>
                  <div style={{ color: 'black', paddingBottom: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'flex-end', fontWeight: '600', marginTop: '0.5rem', alignItems: 'center', width: '100%' }}>Thành tiền: 500,000 VNĐ</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}><Button type="primary" style={{ width: '7.5rem' }}>Đặt lại</Button></div>
                </div>
                <div className={styles['order']}>
                  <div>
                    <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}>Nguyễn Văn A - 0384943497</div>
                    <div style={{ color: 'grey' }}>10:00am, 03/08/2021</div>
                  </div>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem' }}>Giày thể thao kiểu dáng Hàn Quốc</div>
                  <div>
                    <div style={{ color: 'grey', fontSize: '1rem' }}>Màu: Đỏ Đen, Size: 38</div>
                    <div style={{ color: 'grey', fontSize: '1rem' }}>x2</div>
                  </div>
                  <div style={{ color: 'grey', paddingBottom: '1rem', borderBottom: '1px solid rgb(233, 217, 217)', fontSize: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>250,000 VNĐ</div>
                  <div style={{ color: 'black', paddingBottom: '1rem', fontSize: '1rem', display: 'flex', justifyContent: 'flex-end', fontWeight: '600', marginTop: '0.5rem', alignItems: 'center', width: '100%' }}>Thành tiền: 500,000 VNĐ</div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}><Button type="primary" style={{ width: '7.5rem' }}>Đặt lại</Button></div>
                </div>
              </div>
            ) : ('Chưa có đơn hàng nào')
          }

        </Drawer>
        <Modal
          title="Chi tiết thông tin đơn hàng"
          centered
          width={1000}
          footer={null}
          visible={modal3Visible}
          onOk={() => modal3VisibleModal(false)}
          onCancel={() => modal3VisibleModal(false)}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>

            {
              billQuantity && billQuantity.length > 0 && billQuantity[billIndex][0].customer && billQuantity[billIndex][0].customer.length > 0 && billQuantity[billIndex][0].customer.map((values1, index1) => {
                return (
                  <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                        <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>Tên khách hàng:</div>
                        <div>{values1.first_name}</div>
                      </div>
                    </Col>
                    <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                        <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>Địa chỉ:</div>
                        <div>{values1.address}</div>
                      </div>
                    </Col>
                  </Row>
                )
              })
            }
            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>Phương thức nhận hàng:</div>
                  <div>{receiveMethodName}</div>
                </div>
              </Col>
              <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>Hình thức thanh toán:</div>
                  <div>{paymentForm}</div>
                </div>
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>Thuế:</div>
                  {
                    taxDefault && taxDefault.length > 0 && taxDefault.map((values, index) => {
                      if (index === 0) {
                        return <div>{`${values}`}</div>

                      } else {
                        return <div>{`, ${values}`}</div>

                      }

                    }

                    )
                  }

                </div>
              </Col>
              <Col style={{ width: '100%', }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>Ghi chú:</div>
                  <div>{note ? note : 'không có ghi chú'}</div>
                </div>
              </Col>
            </Row>
            <Table style={{ marginTop: '0.5rem', marginBottom: '1rem' }} pagination={false} bordered columns={columnsTable} dataSource={orderDetail} scroll={{ y: 250 }} />

            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>Tổng tiền:</div>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>
                    {
                      confirm === 1 && moneyTotal && billQuantity && billQuantity.length > 0 && moneyTotal > 0 ? (`${formatCash(
                        String(moneyTotal))} VNĐ`) : ('0 VNĐ')
                    }

                  </div>
                </div>
              </Col>

            </Row>

            <Row style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>

              <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>Chiết khấu:</div>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>
                    {
                      confirm === 1 && discount && billQuantity && billQuantity.length > 0 && discount > 0 && discountMoney && discountMoney > 0 ? (`-${formatCash(
                        String(discountMoney))} VNĐ`) : ('0 VNĐ')
                    }</div>
                </div>
              </Col>

            </Row>


            <Row style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem', alignItems: 'center', width: '100%' }}>

              <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={24} lg={24} xl={24}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>Tổng thuế:</div>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1rem', marginRight: '0.25rem' }}>  {
                    confirm === 1 && taxPercentValue && billQuantity && billQuantity.length > 0 && taxPercentValue > 0 && taxMoneyValue && taxMoneyValue > 0 ? (`+${formatCash(
                      String(taxMoneyValue))} VNĐ`) : ('0 VNĐ')
                  }</div>
                </div>
              </Col>
            </Row>

            <Row style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', marginTop: '1.5rem', borderTop: '1px solid grey', margin: '1rem 0', alignItems: 'center', width: '100%' }}>

              <Col style={{ width: '100%', }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1.25rem', marginRight: '0.25rem' }}>Thành tiền:</div>
                  <div style={{ color: 'black', fontWeight: '600', fontSize: '1.25rem', marginRight: '0.25rem' }}>     {
                    confirm === 1 && moneyFinish && billQuantity && billQuantity.length > 0 && moneyFinish > 0 ? (`${formatCash(
                      String(moneyFinish))} VNĐ`) : ('0 VNĐ')
                  }</div>
                </div>
              </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
              <Button
                onClick={onClickPaymentFinish}
                style={{ borderRadius: '0.25rem' }}
                size="large"
                className={styles["button_background_right"]}
              >
                Đồng ý
              </Button>
            </div>
          </div>
        </Modal>
        <Drawer
          title="Danh sách đơn hàng"
          width='95%'
          onClose={onCloseOrderList}
          visible={visibleOrderList}
          bodyStyle={{ paddingBottom: 80 }}

        >
          <Tabs defaultActiveKey="2" onChange={callbackOrderList}>
            {/* 
          <TabPane tab="Tất cả đơn hàng" key="1">

            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Col style={{ width: '100%', marginBottom: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ width: '100%' }}>
                  <Input style={{ width: '100%' }} name="name" value={valueSearchOrderDetail} enterButton onChange={onSearchOrderDetail} className={styles["orders_manager_content_row_col_search"]}
                    placeholder="Tìm kiếm theo mã, theo tên" allowClear />
                </div>
              </Col>
              <Col style={{ width: '100%', marginBottom: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ width: '100%' }}>
                  <RangePicker
                    // name="name1" value={moment(valueSearch).format('YYYY-MM-DD')}
                    value={clear === 1 ? ([]) : (start !== "" ? [moment(start, dateFormat), moment(end, dateFormat)] : [])}
                    style={{ width: '100%' }}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    onChange={onChangeDate}
                  />
                </div>
              </Col>
              <Col style={{ width: '100%', marginBottom: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ width: '100%' }}>
                  <Select showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn trạng thái thanh toán"
                    optionFilterProp="children"
                    value={paymentStatus ? paymentStatus : 'default'}

                    onChange={onChangePaymentStatus}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    <Option value="default">Chọn trạng thái thanh toán</Option>
                    <Option value="Đã thanh toán">Đã thanh toán</Option>
                    <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                  </Select>
                </div>
              </Col>
              <Col style={{ width: '100%', marginBottom: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ width: '100%' }}>
                  <Select showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn trạng thái giao hàng"
                    optionFilterProp="children"

                    value={shippingStatus ? shippingStatus : 'default'}

                    onChange={onChangeShippingStatus}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    <Option value="default">Chọn trạng thái giao hàng</Option>
                    <Option value="Đã giao hàng">Đã giao hàng</Option>
                    <Option value="Chưa giao hàng">Chưa giao hàng</Option>
                    <Option value="Đang giao hàng">Đang giao hàng</Option>
                  </Select>
                </div>
              </Col>
            </Row>
            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}></Col>
              <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginBottom: '1rem' }}><Button onClick={onClickClear} type="primary" style={{ width: '7.5rem' }}>Xóa tất cả lọc</Button></div>
              </Col>
            </Row>

            <div style={{ width: '100%', border: '1px solid rgb(243, 234, 234)' }}>
              <Table rowSelection={rowSelectionOrderList} bordered columns={columnsOrderList} dataSource={order} scroll={{ y: 300 }}
                rowKey="_id"
                pagination={false}
                loading={loadingTable}

                expandable={{
                  expandedRowRender: record => {

                    return (
                      <div style={{ backgroundColor: 'white', border: '1px solid white' }}>
                        < Table bordered columns={columnsDetailOrder} dataSource={record && record.order_details && record.order_details.length > 0 ? record.order_details : []} scroll={{ y: 500 }} />

                      </div>)

                  },
                  expandedRowKeys: selectedRowKeysOrderList,
                  expandIconColumnIndex: -1,
                }}

              />
            </div>

            <Pagination
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '1rem' }}
              showSizeChanger
              onShowSizeChange={onShowSizeChangeTable}
              defaultCurrent={10}
              onChange={onChangeTable}
              total={countTable}
            />
          </TabPane> */}

            <TabPane tab="Đơn hàng trong ngày" key="2">

              <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%', marginBottom: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div style={{ width: '100%' }}>
                    <Input style={{ width: '100%' }} name="name" value={valueSearchOrderDetail} enterButton onChange={onSearchOrderDetail} className={styles["orders_manager_content_row_col_search"]}
                      placeholder="Tìm kiếm theo mã, theo tên" allowClear />
                  </div>
                </Col>
                {/* <Col style={{ width: '100%', marginBottom: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ width: '100%' }}>
                  <RangePicker
                    // name="name1" value={moment(valueSearch).format('YYYY-MM-DD')}
                    value={clear === 1 ? ([]) : (start !== "" ? [moment(start, dateFormat), moment(end, dateFormat)] : [])}
                    style={{ width: '100%' }}
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    onChange={onChangeDate}
                  />
                </div>
              </Col> */}
                {/* <Col style={{ width: '100%', marginBottom: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ width: '100%' }}>
                  <Select showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn trạng thái"
                    optionFilterProp="children"
                    value={paymentStatus ? paymentStatus : 'default'}

                    onChange={onChangePaymentStatus}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    <Option value="default">Chọn trạng thái</Option>
                    <Option value="Đã thanh toán">Đã thanh toán</Option>
                    <Option value="Chưa thanh toán">Chưa thanh toán</Option>
                    <Option value="Đã giao hàng">Đã giao hàng</Option>
                    <Option value="Chưa giao hàng">Chưa giao hàng</Option>
                    <Option value="Đang giao hàng">Đang giao hàng</Option>
                  </Select>
                </div>
              </Col> */}
                {/* <Col style={{ width: '100%', marginBottom: '1rem', }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ width: '100%' }}>
                  <Select showSearch
                    style={{ width: '100%' }}
                    placeholder="Chọn trạng thái giao hàng"
                    optionFilterProp="children"

                    value={shippingStatus ? shippingStatus : 'default'}

                    onChange={onChangeShippingStatus}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    <Option value="default">Chọn trạng thái giao hàng</Option>
                    <Option value="Đã giao hàng">Đã giao hàng</Option>
                    <Option value="Chưa giao hàng">Chưa giao hàng</Option>
                    <Option value="Đang giao hàng">Đang giao hàng</Option>
                  </Select>
                </div>
              </Col> */}
              </Row>
              {/* <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%', marginBottom: '1rem' }}><Button onClick={onClickClear} type="primary" style={{ width: '7.5rem' }}>Xóa tất cả lọc</Button></div> */}
              <div style={{ width: '100%', border: '1px solid rgb(243, 234, 234)' }}>
                <Table rowSelection={rowSelectionOrderList} bordered columns={columnsOrderList} dataSource={orderToday} scroll={{ y: 300 }}
                  rowKey="_id"
                  pagination={false}
                  loading={loadingTable}

                  expandable={{
                    expandedRowRender: record => {

                      return (
                        <div style={{ backgroundColor: 'white', border: '1px solid white' }}>
                          < Table bordered columns={columnsDetailOrder} dataSource={record && record.order_details && record.order_details.length > 0 ? record.order_details : []} scroll={{ y: 500 }} />

                        </div>)

                    },
                    expandedRowKeys: selectedRowKeysOrderList,
                    expandIconColumnIndex: -1,
                  }}

                />
              </div>

              <Pagination
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '1rem' }}
                showSizeChanger
                onShowSizeChange={onShowSizeChangeTable}
                defaultCurrent={10}
                onChange={onChangeTable}
                total={countTable}
              />
            </TabPane>

          </Tabs>
        </Drawer>

      </Online>


    </UI >
  );
}
