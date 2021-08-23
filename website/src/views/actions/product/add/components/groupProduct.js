
import { Form, Col, Row, Input, Button, Select, InputNumber, Upload, Checkbox, notification } from 'antd'
import { PlusOutlined, CloseOutlined } from '@ant-design/icons'
import styles from '../add.module.scss'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { apiAddProduct } from "../../../../../apis/product";
import { ACTION } from '../../../../../consts/index'
import { useHistory } from 'react-router-dom'

const { Option } = Select
const { Dragger } = Upload
export default function GroupProduct(props) {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const history = useHistory()
  const [productName, setProductName] = useState("")
  const [itemsGroup, setItemsGroup] = useState([])
  const [dynamic, setDynamic] = useState([])
  const [sku, setSKU] = useState('')
  const [supplierGroup, setSupplierGroup] = useState(props.supplier && props.supplier.length > 0 ? props.supplier[0].supplier_id : '1')
  const [options, setOptions] = useState([{ array: [] }])
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [weightValue, setWeightValue] = useState("")
  const [lengthValue, setLengthValue] = useState("")
  const [widthValue, setWidthValue] = useState("")
  const [heightValue, setHeightValue] = useState("")
  const [warehouse, setWarehouse] = useState(props.warehouse && props.warehouse.length > 0 ? props.warehouse[0].warehouse_id : '1')
  const [category, setCategory] = useState(props.category && props.category.length > 0 ? props.category[0].category_id : '1')
  const onChangeCategory = (e) => {
    console.log(e)
    setCategory(e)
  }
  const openNotificationDynamicDeleteSuccess = () => {
    notification.success({
      message: 'Thành công',
      description:
        `Xóa thuộc tính thành công.`,
    });
  };
  const openNotificationDynamic = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description:
        `Tối đa chỉ tạo 2 variant.`,
    });
  };

  const onChangeSkuMain = (e, index) => {
    var { value } = e.target;
    var arrayTemp = [...options]
    if (value.indexOf('-') !== -1) {
      arrayTemp[0].array[index].sku = value ? value : ''
    } else {
      arrayTemp[0].array[index].sku = value ? sku + "-" + value : ''
    }

    setDynamic([...arrayTemp])

  }
  const openNotification = () => {
    notification.success({
      message: 'Thành công',
      description:
        'Thêm mới sản phẩm thành công.',
    });
  };
  const openNotificationDynamicWarn = () => {
    notification.warning({
      message: 'Nhắc nhở',
      description:
        `Bạn phải nhập tên sản phẩm, sku và chọn nhà cung cấp trước.`,
    });
  };
  const onClickDeleteOptions = (index) => {

    var array = [...options]
    array.splice(index, 1)
    console.log(array)
    console.log("+++")
    openNotificationDynamicDeleteSuccess()
    // setOptions([...array])

    var arrayTest = []
    if (array.length === 2) {
      array.forEach((values3, index3) => {
        if (index3 === 1) {
          values3.values.forEach((values5, index5) => {
            var object = {
              title: `${productName}-${values5}`,
              sku: sku ? `${sku}-${values5}` : values5,
              image: [],
              supplier: [],
              base_price: 0,
              sale_price: 0,
              quantity: 0,
              options: [
                {
                  name: array[1].option,
                  values: values5
                }
              ]
            }
            arrayTest.push(object)
          })

        }
      })
      array[0].array = arrayTest
      setOptions([...array])
    }
    if (array.length === 1) {
      array[0].array = []
      setOptions([...array])
    }
  }
  function handleChangeSelectOptions(value1, index) {
    console.log(`selected ${value1}`);
    var arrayTest = []
    // var arrayMini = [...dynamic[index].values]
    var arrayStart = [...options]


    if (options && options.length > 0) {
      if (options[index].option) {
        if (index === 1) {

          if (arrayStart.length === 2) {
            value1 && value1.length > 0 && value1.forEach((values3, index3) => {

              var object = {
                title: `${productName}-${values3}`,
                sku: sku ? `${sku}-${values3}` : values3,
                image: [],
                base_price: 0,
                sale_price: 0,
                quantity: 0,
                options: [
                  {
                    name: options[1].option,
                    values: values3
                  }
                ]
              }
              arrayTest.push(object)
            })
          }
          if (arrayStart.length === 3) {
            value1 && value1.length > 0 && value1.forEach((values5, index5) => {
              arrayStart.forEach((values6, index6) => {
                if (index6 === 2) {
                  values6.values.forEach((values7, index7) => {
                    var object = {
                      title: `${productName}-${values5}-${values7}`,
                      sku: sku ? `${sku}-${values5}-${values7}` : values5,
                      image: [],
                      supplier: [],
                      base_price: 0,
                      sale_price: 0,
                      quantity: 0,
                      options: [
                        {
                          name: options[1].option,
                          values: values5
                        },
                        {
                          name: options[2].option,
                          values: values7
                        }
                      ]
                    }
                    arrayTest.push(object)
                  })
                }
              })
            })
          }
        }
        if (index === 2) {

          if (arrayStart.length === 2) {
            value1 && value1.length > 0 && value1.forEach((values3, index3) => {

              var object = {
                title: `${productName}-${values3}`,
                sku: sku ? `${sku}-${values3}` : values3,
                image: [],
                supplier: [],
                base_price: 0,
                sale_price: 0,
                quantity: 0,
                options: [
                  {
                    name: options[1].option,
                    values: values3
                  }
                ]
              }
              arrayTest.push(object)
            })
          }
          if (arrayStart.length === 3) {

            arrayStart.forEach((values3, index3) => {
              if (index3 === 1) {
                values3.values.forEach((values5, index5) => {
                  value1.forEach((values4, index4) => {
                    var object = {
                      title: `${productName}-${values5}-${values4}`,
                      sku: sku ? `${sku}-${values5}-${values4}` : values5,
                      image: [],
                      supplier: [],
                      base_price: 0,
                      sale_price: 0,
                      quantity: 0,
                      options: [
                        {
                          name: options[1].option,
                          values: values5
                        },
                        {
                          name: options[2].option,
                          values: values4
                        }
                      ]
                    }

                    arrayTest.push(object)
                  })
                })
              }
            })
          }

        }
        var arrayNew = [...options]
        arrayNew[0].array = arrayTest;
        setOptions([...arrayNew])
        var array = [...options]
        array[index].values = value1
        setOptions([...array])
      }
      else {
        notification.error({ message: "Vui lòng nhập tên thuộc tính" })
      }

    } else {
      arrayStart[0].array = []
      setOptions([...arrayStart])
    }
  }
  const onChangeWeightValue = (e) => {
    setWeightValue(e)
  }

  const onChangeWidthValue = (e) => {
    setWidthValue(e)
  }

  const onChangeLengthValue = (e) => {
    setLengthValue(e)
  }

  const onChangeHeightValue = (e) => {
    setHeightValue(e)
  }
  const apiAddProductData = async (object) => {
    try {
      dispatch({ type: ACTION.LOADING, data: true });
      // console.log(value);
      const res = await apiAddProduct(object);
      console.log(res);
      if (res.status === 200) {
        // await getAllStoreData()
        // openNotificationSuccessStore()
        // modal5VisibleModal(false)
        // modal3VisibleModal(false)
        // form.resetFields();
        openNotification()
        history.push("/product/6");
      } else {
        openNotificationForgetImageError()
      }
      // if (res.status === 200) setStatus(res.data.status);
      dispatch({ type: ACTION.LOADING, data: false });
      // openNotification();
      // history.push(ROUTES.NEWS);
    } catch (error) {
      console.log(error);
      dispatch({ type: ACTION.LOADING, data: false });
    }
  };
  function onChangeCheckbox(e) {
    console.log(`checked = ${e.target.checked}`);
    setCheckboxValue(e.target.checked)
  }
  function handleChangeSupplier(value) {
    console.log(`selected ${value}`);
    setSupplierGroup(value)
  }
  const onChangeProductName = (e) => {
    setProductName(e.target.value)
  }
  const onChangeSKU = (e) => {
    setSKU(e.target.value)
  }
  const onFinishGroup = async (values) => {

  }
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const openNotificationForgetImageError = () => {
    notification.error({
      message: 'Thất bại',
      duration: 3,
      description:
        'Tên sản phẩm hoặc sku đã tồn tại.',
    });
  };

  function onChangeRegularPrice(e, index, index1) {
    console.log('changed', e);
    var arrayTemp = [...options]
    if (parseInt(e) > 0) {
      arrayTemp[0].array[index].sale_price = e;
    } else {
      arrayTemp[0].array[index].sale_price = 0;
    }

    setOptions([...arrayTemp])
  }
  function onChangeBaseCost(e, index) {
    console.log('changed', e);
    var arrayTemp = [...options]
    if (parseInt(e) > 0) {
      arrayTemp[0].array[index].base_price = e;
    } else {
      arrayTemp[0].array[index].base_price = 0;
    }

    setOptions([...arrayTemp])

  }
  function onChangeImportPrice(e, index) {
    console.log('changed', e);
    var arrayTemp = [...options]
    if (parseInt(e) > 0) {
      arrayTemp[0].array[index].import_price = e;
    } else {
      arrayTemp[0].array[index].import_price = 0;
    }

    setOptions([...arrayTemp])

  }
  function onChangeSalePrice(e, index, index1) {
    console.log('changed', e);
    var array = [...dynamic]
    if (parseInt(e) > 0) {
      array[index].values[index1].sale_price = e;
    } else {
      array[index].values[index1].sale_price = 0;
    }

    setDynamic([...array])
  }

  const onChangeSupplierQuantity = (e, index, index7) => {
    var arrayTemp = [...options];
    if (parseInt(e) > 0) {
      arrayTemp[0].array[index].quantity = e;
    } else {
      arrayTemp[0].array[index].quantity = 0;
    }

    setOptions([...arrayTemp])
  }
  const onChangeSupplier = (e, index) => {
    var arrayTemp = [...options];
    if (parseInt(e) > 0) {
      arrayTemp[0].array[index].supplier = supplierGroup
    } else {
      arrayTemp[0].array[index].supplier = supplierGroup
    }

    setOptions([...arrayTemp])
  }
  const onClickVariantWarning = () => {
    openNotificationDynamicWarn()
  }
  const openNotificationErrorGroupName = (data) => {
    notification.error({
      message: 'Thất bại',
      description: 'Bạn chưa nhập tên sản phẩm.'
    });
  };
  const openNotificationErrorGroupPrice = (data) => {
    notification.error({
      message: 'Thất bại',
      description: 'Bạn chưa nhập giá bán.'
    });
  };
  const openNotificationErrorGroupSku = (data) => {
    notification.error({
      message: 'Thất bại',
      description: 'Bạn chưa nhập sku.'
    });
  };
  const openNotificationErrorGroupSupplier = () => {
    notification.error({
      message: 'Thất bại',
      description: 'Bạn chưa chọn nhà cung cấp.'
    });
  };
  const openNotificationErrorGroupDynamic = (data) => {
    if (data === 1) {
      notification.error({
        message: 'Thất bại',
        description: 'Bạn chưa nhập thuộc tính (variant).'
      });
    }
    else if (data === 2) {
      notification.error({
        message: 'Thất bại',
        description: 'Bạn chưa nhập giá trị (variant).'
      });
    }
    else if (data === 7) {
      notification.error({
        message: 'Thất bại',
        description: 'Tất cả giá nhập, số lượng nhà cung cấp phải lớn hơn 0. (preview).'
      });
    }
    else if (data === 3) {
      notification.error({
        message: 'Thất bại',
        description: 'Bạn chưa nhập sku (preview).'
      });
    } else if (data === 4) {
      notification.error({
        message: 'Thất bại',
        description: 'Tất cả giá bán lẻ, bán sỉ phải lớn hơn 0. (preview).'
      });
    }
    else if (data === 6) {
      notification.error({
        message: 'Thất bại',
        description: 'Tất cả giá nhập và số lượng nhà cung cấp phải lớn hơn 0. (preview).'
      });
    } else if (data === 10) {
      notification.error({
        message: 'Thất bại',
        description: 'Bạn chưa tạo variant.'
      });
    } else if (data === 11) {
      notification.error({
        message: 'Thất bại',
        description: 'Tất cả giá nhập và số lượng nhà cung cấp phải lớn hơn 0. (preview).'
      });
    }
    else if (data === 12) {
      notification.error({
        message: 'Thất bại',
        description: 'Bạn chưa chọn loại sản phẩm.'
      });
    }
    else if (data === 13) {
      notification.error({
        message: 'Thất bại',
        description: 'Bạn chưa chọn kho.'
      });
    }
    else {
      notification.error({
        message: 'Thất bại',
        description: 'Bạn chưa chọn đủ ảnh. (preview).'
      });
    }
  };

  const onChangeGroup = async (info, index) => {
    console.log(info)
    console.log('+++---------')
    if (info.fileList && info.fileList.length > 0) {
      var image;
      let formData = new FormData();
      info.fileList.forEach((values, index) => {
        image = values.originFileObj
        formData.append("files", image);   //append the values with key, value pair
      })

      if (formData) {
        dispatch({ type: ACTION.LOADING, data: true });
        let a = axios
          .post(
            "https://workroom.viesoftware.vn:6060/api/uploadfile/google/multifile",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((resp) => resp);
        let resultsMockup = await Promise.all([a]);
        dispatch({ type: ACTION.LOADING, data: false });
  
        var arrayOptions = [...options]
        arrayOptions[0].array[index].image = resultsMockup[0].data.data
        setOptions([...arrayOptions])
      }
    }
  }
  const onClickAddProductGroup = () => {
    if (productName === "" || sku === "" || supplierGroup === "" || category === "" || warehouse === "") {
      if (productName === "") {
        openNotificationErrorGroupName()
      }
      if (sku === "") {
        openNotificationErrorGroupSku()
      }
      if (supplierGroup === "") {
        openNotificationErrorGroupSupplier()
      }
      if (category === "") {
        openNotificationErrorGroupDynamic(12)
      }
      if (warehouse === "") {
        openNotificationErrorGroupDynamic(13)
      }
    } else {
      var count = 0;
      var count1 = 0;
      var count2 = 0;
      var count3 = 0;
      var count4 = 0;
      var count5 = 0;
      var count6 = 0;
      options && options.length > 0 && options.forEach((values1, index1) => {
        if (options && options.length === 1) {
          openNotificationErrorGroupDynamic(10)
          count++;
        }
        if (index1 === 0) {

          values1 && values1.array && values1.array.forEach((values2, index2) => {
            if (category === "") {
              count++;
              count5++;
            }
            if (warehouse === "") {
              count++;
              count6++;
            }
            if (values2.sku === "") {

              count++;
              count4++;
            }
            if (values2.base_price === 0) {

              count++;
              count3++;
            }
            if (values2.sale_price === 0) {

              count++;
              count3++;
            }
            if (values2 && values2.image.length === 0) {

              count++;
              count2++;
            }

          })

        }
        else {
          if (values1.option === "") {
            openNotificationErrorGroupDynamic(1)
            count++;
          }
          if (values1 && values1.values.length === 0) {
            openNotificationErrorGroupDynamic(2)
            count++;
          }
        }

      })
      if (count1 > 0) {
        openNotificationErrorGroupDynamic(7)
      }
      if (count2 > 0) {
        openNotificationErrorGroupDynamic(9)
      }
      if (count3 > 0) {
        openNotificationErrorGroupDynamic(4)
      }
      if (count4 > 0) {
        openNotificationErrorGroupDynamic(3)
      }
      if (count5 > 0) {
        openNotificationErrorGroupDynamic(12)
      }
      if (count6 > 0) {
        openNotificationErrorGroupDynamic(13)
      }
      if (count === 0) {
        var array = []
        options && options.forEach((values, index) => {
          if (index !== 0) {
            array.push(values)
          }
        })
        const object = {
          product_list: [
            {
              sku: sku,
              name: productName,
              barcode: "",
              category: category,
              image: [],
              length: lengthValue ? lengthValue : 0,
              width: widthValue ? widthValue : 0,
              height: heightValue ? heightValue : 0,
              weight: weightValue ? weightValue : 0,
              warranty: [],
              quantity: 0,
              unit: "",
              warehouse: warehouse,
              has_variable: true,
              suppliers: supplierGroup,
              attributes: array && array.length > 0 ? array : [],
              variants: options && options.length > 0 && options[0].array && options[0].array.length > 0 ? options[0].array : []
            }
          ]
        }
        apiAddProductData(object)
      }
    }
  }
  const onClickVariant = () => {
    if (options && options.length > 2) {
      openNotificationDynamic()
    } else {
      var objectNew = {
        values: [],
      }
      var arrayNew = [...options]
      arrayNew.push(objectNew)
      setOptions([...arrayNew])
    }
  }
  const onChangeDynamic = (e, index) => {
    var { name, value } = e.target;
    var array = [...dynamic]
    array[index][name] = value;
    setDynamic([...array])
  }
  const onChangeOptions = (e, index) => {
    var { name, value } = e.target;
    var array = [...options]
    array[index]['option'] = value;
    setOptions([...array])
  }
  return (
    <div>
      <Form
        onFinish={onFinishGroup}
        layout="vertical"
        form={form}
        onFinishFailed={onFinishFailed}
        className={styles["product_manager_content"]}
      >

        <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>

          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Tên sản phẩm</div>

            <Input value={productName} name="productName" onChange={onChangeProductName} placeholder="Nhập tên sản phẩm" />


          </Col>

          {/* <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Giá bán</div>
                  <InputNumber
                    value={productPrice}
                    onChange={onChangeProductPrice}
                    name="productPrice"
                    style={{ width: '100%' }}
                    placeholder="Nhập giá bán sỉ"
                    // defaultValue={1000}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}

                  />

                </Col> */}
          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>SKU</div>
            <Input value={sku} name="sku" onChange={onChangeSKU} placeholder="Nhập sku" />
          </Col>
          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Nhà cung cấp</div>
            <Select value={supplierGroup} onChange={handleChangeSupplier} placeholder="Chọn nhà cung cấp" style={{ width: '100%' }}>
              {
                props.supplier && props.supplier.length > 0 && props.supplier.filter(e => e.active).map((values, index) => {
                  return (
                    <Option value={values.supplier_id}>{values.name}</Option>
                  )
                })
              }
            </Select>

          </Col>
          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Nhà Kho</div>
            <Select value={warehouse} onChange={(e) => setWarehouse(e)} placeholder="Chọn Kho" style={{ width: '100%' }}>
              {
                props.warehouse && props.warehouse.length > 0 && props.warehouse.filter(e => e.active).map((values, index) => {
                  return (
                    <Option value={values.warehouse_id}>{values.name}</Option>
                  )
                })
              }
            </Select>

          </Col>
          <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={11}>
            <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}><b style={{ color: 'red', marginRight: '0.25rem' }}>*</b>Loại sản phẩm</div>
            <Select
              // className={
              //   styles["product_manager_content_product_type_left_content"]
              // }
              style={{ width: '100%' }}
              onChange={onChangeCategory}
              value={category}
              placeholder="Chọn loại sản phẩm"
            >
              {
                props.category && props.category.length > 0 && props.category.map((values, index) => {
                  return (
                    <Option value={values.category_id}>{values.name}</Option>
                  )
                })
              }

            </Select>

          </Col>

        </Row>

        <div style={{ display: 'flex', marginBottom: '1.25rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}><Checkbox onChange={onChangeCheckbox}>Thông số sản phẩm (không bắt buộc)</Checkbox></div>
        {
          checkboxValue ? (
            <Row style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều dài</div>
                <InputNumber
                  value={lengthValue}
                  onChange={onChangeLengthValue}
                  name="lengthValue"
                  style={{ width: '100%' }}
                  placeholder="Nhập chiều dài (cm)"
                  // defaultValue={1000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}

                />

              </Col>
              <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều rộng</div>
                <InputNumber
                  value={widthValue}
                  onChange={onChangeWidthValue}
                  name="widthValue"
                  style={{ width: '100%' }}
                  placeholder="Nhập chiều rộng (cm)"
                  // defaultValue={1000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}

                />

              </Col>
              <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Chiều cao</div>
                <InputNumber
                  value={heightValue}
                  onChange={onChangeHeightValue}
                  name="heightValue"
                  style={{ width: '100%' }}
                  placeholder="Nhập chiều cao (cm)"
                  // defaultValue={1000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}

                />
              </Col>
              <Col style={{ width: '100%', marginBottom: '1rem' }} xs={24} sm={24} md={11} lg={11} xl={5}>
                <div style={{ color: 'black', fontWeight: '600', marginBottom: '0.5rem' }}>Cân nặng</div>
                <InputNumber
                  value={weightValue}
                  onChange={onChangeWeightValue}
                  name="weightValue"
                  style={{ width: '100%' }}
                  placeholder="Nhập cân nặng (g)"
                  // defaultValue={1000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}

                />
              </Col>
            </Row>
          ) : ''
        }
        {
          sku && productName && supplierGroup && supplierGroup.length > 0 ? (<div className={styles['variant']}>
            <Row style={{ borderBottom: '1px solid rgb(236, 230, 230)', width: '100%', padding: '0 1rem 1rem 1rem' }}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{ color: 'black', marginTop: '1rem', fontSize: '1rem', fontWeight: '600' }}>Thuộc tính</Col>
              <Col style={{ marginTop: '1rem' }} xs={24} sm={12} md={12} lg={12} xl={12} className={styles['variant_title']}>
                <div onClick={onClickVariant} style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <div><PlusOutlined /></div>
                  <div style={{ marginLeft: '0.5rem' }}>Thêm thuộc tính</div>
                </div>
              </Col>
            </Row>



            {
              options && options.length > 0 && options.map((values, index) => {
                if (index > 0) {
                  return (
                    <Row key={index} style={{ display: 'flex', padding: '0 1rem 1rem 1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={10} lg={10} xl={10}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>Tên thuộc tính</div>
                          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}><Input value={values.name} name="name" onChange={(e) => onChangeOptions(e, index)} placeholder="Nhập thuộc tính" /></div>
                        </div>
                      </Col>
                      <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={10} lg={10} xl={10}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', marginBottom: '0.5rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>Giá trị</div>
                          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}>
                            <Select
                              value={values.values}
                              onChange={(e) => handleChangeSelectOptions(e, index)}
                              mode="multiple"
                              mode="tags"
                              style={{ width: '100%' }}
                              placeholder="Nhập giá trị"
                            >
                              {itemsGroup.map(item => (
                                <Option key={item}>{item}</Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                      </Col>
                      <Col style={{ width: '100%', marginTop: '1rem' }} xs={24} sm={24} md={1} lg={1} xl={1}>
                        <CloseOutlined onClick={() => onClickDeleteOptions(index)} style={{ fontSize: '1.5rem', paddingTop: '2rem', cursor: 'pointer', color: 'red' }} />
                      </Col>
                    </Row>
                  )
                }

              })
            }
          </div>) : (<div className={styles['variant']}>
            <Row style={{ borderBottom: '1px solid rgb(236, 230, 230)', width: '100%', padding: '0 1rem 1rem 1rem' }}>
              <Col xs={24} sm={12} md={12} lg={12} xl={12} style={{ color: 'black', marginTop: '1rem', fontSize: '1rem', fontWeight: '600' }}>Thuộc tính</Col>
              <Col style={{ marginTop: '1rem' }} xs={24} sm={12} md={12} lg={12} xl={12} className={styles['variant_title']}>
                <div onClick={onClickVariantWarning} style={{ display: 'flex', cursor: 'pointer', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                  <div><PlusOutlined /></div>
                  <div style={{ marginLeft: '0.5rem' }}>Thêm thuộc tính</div>
                </div>
              </Col>
            </Row>

          </div>)
        }
        {
          sku && productName && options && options.length > 1 && supplierGroup && supplierGroup.length > 0 ? (
            <div className={styles['preview']}>
              <div style={{ color: 'black', padding: '1rem', borderBottom: '1px solid rgb(230, 219, 219)', fontSize: '1rem', fontWeight: '600' }}>Phiên bản</div>
              <Row style={{ display: 'flex', backgroundColor: '#FAFAFA', padding: '0 1rem 1rem 1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={3}>Picture</Col>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Variants</Col>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>SKU</Col>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Supplier</Col>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>Seller</Col>
                {/* <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={1}>Status</Col> */}
              </Row>
              {
                options && options.length > 0 && options[0].array.map((values2, index) => {
                  return (

                    <Row style={{ display: 'flex', borderBottom: '1px solid rgb(230, 219, 219)', padding: '0 1rem 1rem 1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={3}>
                        <div className={styles["product_manager_content_image_child"]}>
                          <Dragger
                            name='file'
                            multiple={true}
                            showUploadList={false}
                            action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                            style={{ width: '7.5rem', }} onChange={(event) => onChangeGroup(event, index)}  >
                            {
                              values2 && values2.image.length > 0 ? (<p style={{ marginTop: '1.25rem', }} className="ant-upload-drag-icon">

                                <img src={values2.image[values2.image.length - 1]} style={{ width: '5rem', height: '2.5rem', objectFit: 'contain' }} alt="" />

                              </p>) : (<p style={{ marginTop: '1.25rem', width: '7.5rem' }} className="ant-upload-drag-icon">

                                <PlusOutlined />

                                <div>Thêm ảnh</div>

                              </p>)

                            }
                          </Dragger>

                          <div style={{ display: 'flex', maxWidth: '100%', overflow: 'auto', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                            {
                              values2 && values2.image.length > 0 && values2.image.map((values, index) => {
                                return (
                                  <img src={values} style={{ width: '5rem', margin: '1rem 1rem 1rem 0rem', height: '2.5rem', objectFit: 'contain' }} alt="" />
                                )
                              })
                            }
                          </div>
                        </div>
                      </Col>
                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                        <div style={{ fontSize: '1rem', fontWeight: '600' }}>  {values2.title}</div>
                      </Col>
                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                        <div style={{ display: 'flex', border: '1px solid grey', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                          {/* <div style={{ backgroundColor: '#FAFAFA', width: '5rem', padding: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid grey' }}>{`${sku} - `}</div> */}
                          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', }}>

                            <Input style={{ width: '100%', border: 'none' }} value={values2.sku} name="sku" onChange={(e) => onChangeSkuMain(e, index)} />
                          </div>
                        </div>
                      </Col>
                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                        <div style={{ marginBottom: '1rem' }}>
                          {/* <div style={{ marginBottom: '0.5rem' }}>{supplierGroup}</div> */}
                          {/* <InputNumber
                                        style={{ width: '100%' }}
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}

                                        onChange={(e) => onChangeSupplier(e, index, index)}
                                      /> */}
                          <div style={{ marginBottom: '0.5rem', marginTop: '1rem' }}>Số lượng</div>
                          <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            defaultValue={0}
                            onChange={(e) => onChangeSupplierQuantity(e, index, index)}
                          />
                        </div>


                      </Col>
                      <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={4}>
                        <div className={styles['seller']}>
                          <div style={{ marginTop: '1rem' }}>
                            <div style={{ marginBottom: '0.5rem' }}>Giá nhập</div>
                            <InputNumber

                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}

                              onChange={(e) => onChangeImportPrice(e, index)}
                            />
                          </div>
                          <div>
                            <div style={{ marginBottom: '0.5rem' }}>Giá cơ bản</div>
                            <InputNumber

                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                              onChange={(e) => onChangeBaseCost(e, index)}
                            />
                          </div>
                          <div style={{ marginTop: '1rem' }}>
                            <div style={{ marginBottom: '0.5rem' }}>Giá bán</div>
                            <InputNumber

                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}

                              onChange={(e) => onChangeRegularPrice(e, index)}
                            />
                          </div>
                          {/* <div style={{ marginTop: '1rem' }}>
                                <div style={{ marginBottom: '0.5rem' }}>Sale price</div>
                                <InputNumber

                                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                  parser={value => value.replace(/\$\s?|(,*)/g, '')}

                                  onChange={(e) => onChangeSalePrice(e, index, index1)}
                                />
                              </div> */}
                        </div>
                      </Col>
                      {/* <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={1}>
                            <Switch defaultChecked onChange={(e) => onChangeSwitch(e, index)} /></Col> */}
                    </Row>

                  )
                })
              }


            </div>
          ) : (
            <div className={styles['preview']}>
              <div style={{ color: 'black', padding: '1rem', borderBottom: '1px solid rgb(230, 219, 219)', fontSize: '1rem', fontWeight: '600' }}>Phiên bản</div>
              <Row style={{ display: 'flex', backgroundColor: '#FAFAFA', padding: '0 1rem 1rem 1rem', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={1}>Variants</Col>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={6}>SKU</Col>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={6}>Supplier</Col>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={6}>Seller</Col>
                <Col style={{ width: '100%', marginTop: '1rem', fontWeight: '600', color: 'black' }} xs={24} sm={24} md={11} lg={11} xl={1}>Status</Col>
              </Row>



            </div>
          )
        }
        <div
          style={{ marginTop: '2rem' }}
          className={
            styles["product_manager_content_product_code_product_type_button"]
          }
        >
          {/* <Form.Item>
              <Button
                style={{ width: '5rem' }}
                className={
                  styles[
                  "product_manager_content_product_code_product_type_button_left"
                  ]
                }
                type="primary"
                danger
              >
                Hủy
              </Button>
            </Form.Item> */}
          <div>
            <Button onClick={onClickAddProductGroup} style={{ width: '7.5rem' }} htmlType="submit" type="primary">
              Thêm
            </Button>
          </div>
        </div>
      </Form>

    </div>
  )
}