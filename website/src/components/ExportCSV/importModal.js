import { Modal, Table, Row } from 'antd'
import { Link } from 'react-router-dom'
export default function ImportModal(props) {

    const { visible, onCancel, onOk, columns, dataSource, downTemplate, actionComponent, importLoading } = props
    console.log(dataSource);
    return (
        <Modal title={<a href={downTemplate} >template.xlsx</a>} visible={visible} onCancel={onCancel} onOk={onOk || onCancel} width={1000} centered>
            <Row style={{ marginBottom: 15 }}>
                {actionComponent}
            </Row>
            <Table columns={columns} loading={importLoading} dataSource={dataSource} />
        </Modal>
    )
}