import UI from "../../../../components/Layout/UI";
import React from "react";
import {
  Link,
  useParams
} from "react-router-dom";
import styles from "./../view/view.module.scss";
import {Row, Col } from "antd";
import {
  ArrowLeftOutlined,
} from "@ant-design/icons";

export default function ProductView(propsData) {
  console.log(propsData.location)
  const state = propsData.location.state;

  let { slug } = useParams();
  return (
    <UI>
      <div className={styles["product_manager"]}>
        <Link className={styles["product_manager_title"]} to={slug === '6' ? ("/product/6") : ("/actions/branch/view/19")}>

          <ArrowLeftOutlined style={{ color: 'black' }} />
          <div className={styles["product_manager_title_product"]}>
            {`Thông tin chi tiết sản phẩm ${state ? state.name : ''}`}
          </div>

        </Link>


        <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Col style={{ width: '100%', marginTop: '1.5rem' }} xs={24} sm={24} md={7} lg={7} xl={7}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>     <img src={state ? state.image : ''} style={{ width: '12.5rem', height: '12.5rem', objectFit: 'contain' }} alt="" />
            </div></Col>

          <Col style={{ width: '100%' }} xs={24} sm={24} md={7} lg={7} xl={7}>
            <div className="center_information">
              <div style={{ marginTop: '1rem' }}><b>Mã sản phẩm: </b>{state ? state.sku : ''}</div>
              <div style={{ marginTop: '1rem' }}><b>Tên sản phẩm: </b>{state ? state.name : ''}</div>
              <div style={{ marginTop: '1rem' }}><b>Giá bán sỉ: </b>{`${state && state.wholesale_price ? state.wholesale_price : ''} VNĐ`}</div>
              <div style={{ marginTop: '1rem' }}><b>Giá bán lẻ: </b>{`${state ? state.retail_price : ''} VNĐ`}</div>
              <div style={{ marginTop: '1rem' }}><b>Giá nhập thuế: </b>{`${state ? state.import_price : ''} VNĐ`}</div>
              <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}><b>Chính sách bảo hành: </b>{state ? state.warranty : ''}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                  <div style={{ marginTop: '0.5rem' }}>Sản phẩm được bảo hành miễn phí nếu đảm bảo tất cả các điều kiện sau:
                    <div style={{ marginTop: '0.5rem' }}>– Sản phẩm thuộc danh mục được bảo hành từ Nhà sản xuất hoặc Nhà phân phối.</div>
                    <div style={{ marginTop: '0.5rem' }}>– Sản phẩm bị lỗi kỹ thuật do Nhà sản xuất.</div>
                    <div style={{ marginTop: '0.5rem' }}>– Thời hạn bảo hành trên phiếu bảo hành vẫn còn hiệu lực</div>

                  </div>

                </div>
              </div>
            </div>
          </Col>

          <Col style={{ width: '100%' }} xs={24} sm={24} md={7} lg={7} xl={7}>
            <div className="center_information">
              <div style={{ marginTop: '1rem' }}><b>Chiều dài: </b>{`${state ? state.length : ''} cm`}</div>
              <div style={{ marginTop: '1rem' }}><b>Chiều rộng: </b>{`${state ? state.width : ''} cm`}</div>
              <div style={{ marginTop: '1rem' }}><b>Chiều cao: </b>{`${state ? state.height : ''} cm`}</div>
              <div style={{ marginTop: '1rem' }}><b>Cân nặng: </b>{`${state ? state.weight : ''} g`}</div>
              <div style={{ marginTop: '1rem' }}><b>Số lượng: </b>{state ? state.quantity : ''}</div>
              <div style={{ marginTop: '1rem' }}><b>Loại sản phẩm: </b>{state ? state.category_id : ''}</div>
            </div>
          </Col>

        </Row>

      </div>
    </UI>
  );
}
