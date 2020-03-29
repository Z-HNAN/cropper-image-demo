import React, { useCallback, useState, useRef, useEffect } from 'react'

import { Modal, message } from 'antd'

import Cropper from 'react-cropper' // 引入Cropper
import 'cropperjs/dist/cropper.css' // 引入Cropper对应的css

interface PropTypes {
  visible: boolean
  zoom: number
  uploadedImageFile: Blob | null,
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
    // 不存在上传对象直接结束
    if (!uploadedImageFile) {
      return
    }
    const fileReader = new FileReader()
    // 此时loading一定是存在的
    let hideLoading = () => {}

    fileReader.onloadstart = () => {
      // 产生loading
      hideLoading = message.loading('解析图片中...', 0)
    }

    fileReader.onloadend = (e) => {
      // 结束loading
      hideLoading()
      if (!(e.target)) {
        message.error(`图片上传失败: ${e}`)
        return
      }
      const dataURL = e.target.result
      setSrc(dataURL)
    }

    fileReader.readAsDataURL(uploadedImageFile)

    // 结束时销毁对象
    // eslint-disable-next-line consistent-return
    return hideLoading
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
