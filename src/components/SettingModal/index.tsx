/**
 * 设置宽高的modal
 */
import React, { useState } from 'react'
import { Modal, InputNumber, Form } from 'antd'

interface PorpTypes {
  visible: boolean
  defaultWidth?: number
  defaultHeight?: number
  onOk: (width: number, height: number) => void
  onClose: () => void
}

const SettingModal: React.FC<PorpTypes> = props => {
  const {
    visible,
    defaultWidth = 4840,
    defaultHeight = 720,
    onOk,
    onClose,
  } = props

  const [width, setWidth] = useState<number>(defaultWidth)
  const [height, setHeight] = useState<number>(defaultHeight)

  const handleSubmit = () => {
    onOk(width, height)
    onClose()
  }

  return (
    <Modal
      title="设置裁剪尺寸"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <Form layout="horizontal" labelCol={{span: 8}} wrapperCol={{span: 16}}>
        <Form.Item label="宽度(width)">
          <React.Fragment>
            <InputNumber min={1} value={width} onChange={(value = 1) => { setWidth(value) }} />
            像素（px）
          </React.Fragment>
        </Form.Item>
        <Form.Item label="高度(height)">
          <React.Fragment>
            <InputNumber min={1} value={height} onChange={(value = 1) => { setHeight(value) }} />
            像素（px）
          </React.Fragment>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SettingModal
