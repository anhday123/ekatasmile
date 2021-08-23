import React from "react";
import {

  Link,

} from "react-router-dom";
import styles from "./../view-product/view-product.module.scss";
import {  Upload, message, Row, Col } from "antd";
import {
  ArrowLeftOutlined,
  FileImageOutlined,

} from "@ant-design/icons";

export default function OrderInformationViewProduct() {
  const { Dragger } = Upload;

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  return (
    <>
      <div className={styles["product_manager"]}>
        <Link className={styles["product_manager_title"]} to="/actions/order-information/view/4">

          <ArrowLeftOutlined style={{ color: 'black' }} />
          <div className={styles["product_manager_title_product"]}>
            Thông tin sản phẩm ly thủy tinh
          </div>

        </Link>

        <Row style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Col style={{ width: '100%', height: '20rem', marginTop: '1.5rem' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <FileImageOutlined style={{ marginTop: '1.25rem' }} />
              </p>
            </Dragger>,
          </Col>

          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div className="center_information">
              <div style={{ marginTop: '1rem' }}><b>Mã sản phẩm: </b>12DF</div>
              <div style={{ marginTop: '1rem' }}><b>Tên sản phẩm: </b>Ly thủy tinh</div>
              <div style={{ marginTop: '1rem' }}><b>Mã SKU: </b>GUU</div>
              <div style={{ marginTop: '1rem' }}><b>Giá bán sỉ: </b>0đ</div>
              <div style={{ marginTop: '1rem' }}><b>Giá bán lẻ: </b>0đ</div>
              <div style={{ marginTop: '1rem' }}><b>Giá nhập thuế: </b>0đ</div>
              <div style={{ display: 'flex', marginTop: '1rem', justifyContent: 'flex-start', alignItems: 'center', width: '100%', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%', }}><b>Chính sách bảo hành: </b></div>
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

          <Col style={{ width: '100%' }} xs={24} sm={24} md={11} lg={7} xl={7}>
            <div className="center_information">
              <div style={{ marginTop: '1rem' }}><b>Chiều dài: </b>20cm</div>
              <div style={{ marginTop: '1rem' }}><b>Chiều rộng: </b>20cm</div>
              <div style={{ marginTop: '1rem' }}><b>Chiều cao: </b>20cm</div>
              <div style={{ marginTop: '1rem' }}><b>Số lượng: </b>20</div>
              <div style={{ marginTop: '1rem' }}><b>Loại sản phẩm: </b>Quà lưu niệm</div>
              <div style={{ marginTop: '1rem' }}><b>Nhà cung cấp: </b>An Phát</div>
            </div>
          </Col>

        </Row>
      </div>
    </>
  );
}
