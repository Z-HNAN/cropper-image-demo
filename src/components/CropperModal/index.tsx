import React, { useCallback, useState, useRef, useEffect } from 'react'

import { Modal, message } from 'antd'

import Cropper from 'react-cropper' // 引入Cropper
import 'cropperjs/dist/cropper.css' // 引入Cropper对应的css

interface PropTypes {
  visible: boolean
  zoom: number
  uploadedImageFile: Blob,
  onClose: () => void,
  onSubmit: (file: Blob) => void,
}

const CropperModal: React.FC<PropTypes> = props => {

  const {
    visible,
    zoom,
    uploadedImageFile,
    onClose,
    onSubmit,
  } = props

  const [src, setSrc] = useState<string | ArrayBuffer | null>(null)
  const cropperRef = useRef(null)

  useEffect(() => {
    const fileReader = new FileReader()
    fileReader.onload = e => {
      if (!(e.target)) {
        message.error(`图片上传失败: ${e}`)
        return
      }
      const dataURL = e.target.result
      setSrc(dataURL)
    }

    fileReader.readAsDataURL(uploadedImageFile)
  }, [uploadedImageFile])
 
  const handleSubmit = useCallback(() => {
    if (cropperRef === null || cropperRef.current === null) {
      return
    }
    ;(cropperRef.current as any).getCroppedCanvas().toBlob((blob: any) => {
      // 把选中裁切好的的图片传出去
      onSubmit(blob)
      // 关闭弹窗
      onClose()
    })
  }, [onClose, onSubmit])

  return (
    <Modal
      title="裁剪图片预览"
      visible={visible}
      style={{ top: 35 }}
      onOk={handleSubmit}
      onCancel={onClose}
    >
      <Cropper
        style={{ height: '62vh', width: '100%' }}
        src={src}
        ref={cropperRef}
        viewMode={1}
        zoomable={false}
        aspectRatio={zoom} // 固定为1:1  可以自己设置比例, 默认情况为自由比例
        guides={false}
        preview=".cropper-preview"
      />
    </Modal>
  )
}

export default CropperModal
