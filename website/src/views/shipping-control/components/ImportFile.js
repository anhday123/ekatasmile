import { Drawer, Row, Col, Select, Upload, Button } from "antd";

export default function ImportFile(props) {
    const settingUpload = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    return (
        <Drawer>
            <Row>
                <Col span={8}>
                    Chọn đơn vị vận chuyển:
                </Col>
                <Col span={16}>
                    <Select></Select>
                </Col>
            </Row>
            <Row>
                *Chú ý:
                - Mã đơn vận Chuyển  phải là duy nhất.
                - Chỉ nhập các đơn hàng đối soát thành công vào file.
                - Chuyển đổi file nhập dưới dạng .XLS trước tải dữ liệu.
                - Tải file mẫu đơn hàng <a href target="_blank">tại đây</a>
            </Row>
            <Row>
                <Upload {...settingUpload}>
                    <Button>Đính kèm file</Button>
                </Upload>
            </Row>
            <Row justify="end">
                <Button type="primary">Lưu</Button>
            </Row>
        </Drawer>
    )
}