import { Radio, Modal } from "antd";
import { useState } from "react";

export default function ChangeStatusModal(props) {
    const { visible, onCancel, onOk } = props
    const [status, setStatus] = useState('')
    return (
        <Modal visible={visible} onCancel={onCancel} onOk={() => onOk(status)}>
            <Radio.Group onChange={e => setStatus(e.target.value)}>
                <Radio value="PROCESSING" >Chờ chuyển</Radio>
                <Radio value="SHIPPING">Đang chuyển</Radio>
                <Radio value="CANCEL_FINISH">Đã Hủy</Radio>
                <Radio value="COMPLETE">Hoàn thành</Radio>
            </Radio.Group>
        </Modal>
    )
}