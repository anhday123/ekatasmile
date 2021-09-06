import { Modal, Table, Row, Typography } from 'antd'
const { Text } = Typography
export default function ImportModal(props) {
  const {
    visible,
    onCancel,
    onOk,
    columns,
    dataSource,
    downTemplate,
    actionComponent,
    importLoading,
  } = props
  console.log(dataSource)
  return (
    <Modal
      title={<a href={downTemplate}>template.xlsx</a>}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk || onCancel}
      width={1000}
      centered
    >
      <Row style={{ marginBottom: 15 }}>{actionComponent}</Row>
      <Table
        columns={columns}
        size="small"
        loading={importLoading}
        dataSource={dataSource}
        summary={(pageData) => {
          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell>
                  <Text></Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text>Tổng cộng:{`${pageData.length}`}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text></Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text></Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text></Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text></Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text></Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell>
                  <Text></Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )
        }}
      />
    </Modal>
  )
}
