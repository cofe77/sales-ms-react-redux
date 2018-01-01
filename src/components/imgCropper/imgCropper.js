import React from 'react'
import Cropper from 'react-cropper'
import {Modal} from 'antd'
import 'cropperjs/dist/cropper.css'

class ImgCropper extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      src:'',
    };
    this.cropImage = this.cropImage.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result });
    };
    reader.readAsDataURL(files[0]);
  }

  cropImage() {
    if(this.state.src===''){
      return;
    }
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    this.props.cropperImgEnd(this.cropper.getCroppedCanvas().toDataURL());
  }
  render(){
    return (
        <Modal
            title="选择商品图片"
            visible={this.props.visible}
            okText="确认裁剪"
            cancelText="取消"
            onOk={this.cropImage}
            onCancel={this.props._handleCancelCropper}
        >
          <input type="file" onChange={this.onChange} />
          
          <Cropper
              style={{ height: 400, width: '100%' }}
              aspectRatio={1}
              preview=".img-preview"
              guides={false}
              src={this.state.src}
              ref={cropper => { this.cropper = cropper; }}
          />
        </Modal>
    )
  }
}

export default ImgCropper