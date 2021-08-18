import { Modal, Table } from 'antd'
export default function ImportModal(props) {
    const { visible, onCancel } = props
    return (
        <Modal visible={visible} onCancel={onCancel} onOk={onCancel}>

        </Modal>
    )
}