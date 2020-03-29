import React, { useState, useRef, useEffect } from 'react'
import { Button, Upload, Modal, message } from 'antd'
import { UploadOutlined, DownloadOutlined, SettingOutlined, QuestionCircleOutlined } from '@ant-design/icons'

import CropperModal from './components/CropperModal'
import SettingModal from './components/SettingModal'
import SaveModal, { ImageType, getImageExtension } from './components/SaveModal'


import styles from './App.css'

const CROPPER_DEFAULT_WIDTH = 480
const CROPPER_DEFAULT_HEIGHT = 720

interface PropsTypes {
  
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 文件最大限制为5M

const App: React.FC<PropsTypes> = () => {

  /**
   * 处理设置裁剪大小
   */
  const [settingVisible, setSettingVisible] = useState<boolean>(false)
  const [cropperSize, setCropperSize] = useState({ width: CROPPER_DEFAULT_WIDTH, height: CROPPER_DEFAULT_HEIGHT })

  // 计算展示图片区域的大小
  const containerRef = useRef(null)
  const [contentSize, setContentSize] = useState({ height: 0, width: 0})

  /**
   * 展示提示
   */
  const showTips = () => {
    Modal.info({
      title: '技术说明',
      content: '使用客户端技术进行裁剪，断网也可正常使用。网站不会保存您图片的任何信息。',
    })
  }

  useEffect(() => {
    const container = (containerRef.current as any)
    const width = container.clientWidth as number
    const height = container.clientHeight as number

    // 取最小值为size cropperHeight/cropperWidth = imgHeight/imgWidth
    let computedHeight
    let computedWidth
    if (width < height) {
      // 以width为基准
      const size = width
      computedHeight = size * (cropperSize.height / cropperSize.width)
      computedWidth = size * 1
      } else {
      // 以height为基准
      const size = height
      computedHeight = size * 1
      computedWidth = size * (cropperSize.width / cropperSize.height)
    }
    // 是否超高
    if (computedHeight > height) {
      // eslint-disable-next-line operator-assignment
      computedWidth = (height / computedHeight) * computedWidth
      computedHeight = height
    }
    // 是否超宽
    if (computedWidth > width) {
      // eslint-disable-next-line operator-assignment
      computedHeight = (width / computedWidth) * computedHeight
      computedWidth = width
    }
    setContentSize({ height: computedHeight, width: computedWidth })
  }, [cropperSize])

  // 裁剪modal是否显示
  const [cropperVisible, setCropperVisible] = useState<boolean>(false)
  // 上传的图片
  const [file, setFile] = useState<Blob | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  /**
   * 处理保存
   */
  const [saveVisible, setSaveVisible] = useState<boolean>(false)
  const [saveImageInfo, setSaveImageInfo] = useState({ type: ImageType.jpg, filename: '' })
  // 打开保存框
  const openSaveModal = () => {
    // 判断是否已经有图片了
    if (fileUrl === null) {
      // 不存在图片
      message.warn('请先上传一张图片')
      return
    }
    setSaveVisible(true)
  }

  // 保存图片
  const [saveStyle, setStyle] = useState<any>({ display: 'none' })
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const downloadImg = (url: string, name: string) => {
    const oA = document.createElement('a')
    oA.download = name // 设置下载的文件名，默认是'下载'
    oA.href = url
    document.body.appendChild(oA)
    oA.click()
    oA.remove() // 下载之后把创建的元素删除
  }
  const handleDownload = (filename: string, imageType: ImageType) => {
    try {
      setStyle({ display: 'absolute', opacity: 0 })
      const canvas = canvasRef.current as HTMLCanvasElement
      const image = imageRef.current as HTMLImageElement
      canvas.getContext('2d')!.drawImage(image, 0, 0, cropperSize.width, cropperSize.height)
      setStyle({ display: 'none' })
      // 下载图片
      downloadImg(canvas.toDataURL(imageType), `${filename}${getImageExtension(imageType)}`)
      message.success('图片生成成功')
    } catch (e) {
      message.error(`图片生成失败:${e.message}`)
    } finally {
      // 清空保存
      setSaveImageInfo({ type: ImageType.jpg, filename: '' })
    }
  }

  // 处理上传图片
  const handleChangeFile = (currentFile: Blob ) => {
    // 检查是否图片
    if (!/image\/\w+/.test(currentFile.type)) {
      message.error('请传入图片类型')
      return false
    }
    if (currentFile.size <= MAX_FILE_SIZE) {
      setFile(currentFile)
      setCropperVisible(true)
      // 设置图片默认名称，并去除拓展名最后一个`.xx`
      setSaveImageInfo({ ...saveImageInfo, filename: (currentFile as any).name.replace(/\.\w+$/g, '') })
    } else {
      message.warn('图片过大 10M')
    }
    return false
  }

  // 处理提交完成图片
  const handleSubmit = (resultFile: Blob) => {
    const base64 = URL.createObjectURL(resultFile)
    setFileUrl(base64)
  }

  return (
    <div className={styles.root}>
      <div className={styles.title}>
        <Button
          className={styles.tipsButton}
          type="dashed"
          shape="circle"
          icon={<QuestionCircleOutlined />}
          size="small"
          onClick={showTips}
        />
        <h2 style={{ margin: 0 }}>
          图片裁剪工具<strong>{cropperSize.width}*{cropperSize.height}</strong>
        </h2>
        <Button
          className={styles.settingButton}
          type="dashed"
          shape="circle"
          icon={<SettingOutlined />}
          size="small"
          onClick={() => setSettingVisible(true)}
        />
      </div>
      <div className={styles.imgContainer} ref={containerRef}>
        <div className={styles.imgContent} style={contentSize} >
          {fileUrl && (
            <img
              width="100%"
              height="100%"
              src={fileUrl}
              alt="裁剪后的图片"
            />
          )}
        </div>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.toolbarUpload}>
          <Upload
            accept="image/jpeg,image/jpg,image/png"
            beforeUpload={handleChangeFile}
            fileList={[]}
          >
            <Button><UploadOutlined /> 上传图片</Button>
          </Upload>
        </div>
        <div className={styles.toolbarDownload}>
          <Button type="primary" icon={<DownloadOutlined />} onClick={openSaveModal}>下载图片</Button>
        </div>
      </div>
      <div className={styles.save} style={{ height: cropperSize.height, width: cropperSize.width, ...saveStyle }}>
        <canvas className={styles.saveCanvas} ref={canvasRef} width={cropperSize.width} height={cropperSize.height} />
        <img src={fileUrl as string} alt="" ref={imageRef} width="100%" height="100%" />
      </div>
      
      {settingVisible && <SettingModal
        visible={settingVisible}
        defaultWidth={cropperSize.width}
        defaultHeight={cropperSize.height}
        onOk={(width, height) => { setCropperSize({ width, height }) } }
        onClose={() => setSettingVisible(false) }
      />}

      {cropperVisible && <CropperModal
        visible={cropperVisible}
        zoom={cropperSize.width / cropperSize.height} // widht / height
        uploadedImageFile={file}
        onClose={() => { setCropperVisible(false) }}
        onSubmit={handleSubmit}
      />}

      {saveVisible && <SaveModal
        visible={saveVisible}
        defaultname={saveImageInfo.filename}
        onClose={() => { setSaveVisible(false) }}
        onOk={handleDownload}
      />}
    </div>
  )
}

export default App