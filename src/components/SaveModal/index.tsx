/**
 * 设置宽高的modal
 */
import React, { useState } from 'react'
import { Modal, Input, Select, Col, Row } from 'antd'

// 保存的图片类型
export enum ImageType {
  jpg = 'image/jpeg',
  png = 'image/png',
}
// 返回图片类型拓展名
export function getImageExtension (imageType: ImageType): string {
  let extension = '.jpg'
  if (imageType === ImageType.jpg) {
    extension = '.jpg'
  } else if (imageType === ImageType.png) {
    extension = '.png'
  }

  return extension
}

interface PorpTypes {
  visible: boolean
  defaultname?: string
  onOk: (filename: string, imageType: ImageType) => void
  onClose: () => void
}

const SavaModal: React.FC<PorpTypes> = props => {
  const {
    visible,
    defaultname = '',
    onOk,
    onClose,
  } = props

  const [imageType, setImageType] = useState<ImageType>(ImageType.jpg)
  const [filename, setFilename] = useState<string>(defaultname)

  const handleSubmit = () => {
    onOk(filename, imageType)
    onClose()
  }

  return (
    <Modal
      title="保存图片"
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <Row>
        <Col span={18}>
          <Input
            type="text"
            value={filename}
            onChange={(e) => { setFilename(e.target.value) }}
          />
        </Col>
        <Col span={5} offset={1}>
          <Select value={imageType} onChange={(value) => { setImageType(value) }}>
            <Select.Option value={ImageType.jpg}>.jpg</Select.Option>
            <Select.Option value={ImageType.png}>.png</Select.Option>
          </Select>
        </Col>
      </Row>
    </Modal>
  )
}

export default SavaModal
