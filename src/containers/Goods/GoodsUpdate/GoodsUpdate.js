import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {hideUpdateGoodsModal,addGoods,fetchGoodsDataById,updateGoods} from '../../../redux/goods.redux';
import {Modal, Button,message,Form, Select, Input, Radio,InputNumber } from 'antd';
import ImgCropper from '../../../components/imgCropper/imgCropper'
import './GoodsUpdate.css';
import axios from 'axios';
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

@connect(
    state=>state.goods,
    {hideUpdateGoodsModal,addGoods,fetchGoodsDataById,updateGoods}
)
class GoodsUpdateForm extends Component {
  constructor(props){
    super(props)
    this.state={
      isAddNew:true,
      photo:"",
      imgCropperModalVisible:false,
    }
    this._handleInputGoodsName=this._handleInputGoodsName.bind(this)
    this._handleCancelCropper=this._handleCancelCropper.bind(this)
    this._cropperImgEnd=this._cropperImgEnd.bind(this)
    this._handleAddConfirm=this._handleAddConfirm.bind(this)
    this._handleCancel=this._handleCancel.bind(this)
  }



  _handleCancel = (e) => {
    this.props.hideUpdateGoodsModal();
  };
  //检查商品名称是否合法
  _handleInputGoodsName=(rule, value, callback)=>{
    this.state.isAddNew?(this.props.goodsData.some(v=>v.name===value)?callback('名称已存在！'):callback()):callback()
  }
  componentWillMount(){
    if(this.props.activeGoodsId!==0) {
      this.props.fetchGoodsDataById(this.props.activeGoodsId)
      this.setState({
        isAddNew: false,
      })
    }
  }
  componentDidMount() {
    setTimeout(()=>{
      if(!this.state.isAddNew) {
        const oldGoodsDate = this.props.activeGoodsData
        this.props.form.setFieldsValue({
          name:oldGoodsDate.name,
          price:oldGoodsDate.price,
          typeId:oldGoodsDate.typeId,
          describe:oldGoodsDate.describe,
          photo:oldGoodsDate.photoUrl,
        });
        this.setState({
          photo:oldGoodsDate.photoUrl,
        })
      }
    },500)
  }
  _handleCancelCropper(){
    this.setState({
      imgCropperModalVisible:false
    })
  }
  _cropperImgEnd(state){
    this.setState({
      photo:state,
      imgCropperModalVisible:false
    })
    this.props.form.setFieldsValue({
      photo: state
    });
  }

  _handleAddConfirm = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let newGoodsData;
        if(this.state.isAddNew){
          newGoodsData={...values,photo:values.photo.split(",")[1]}
          this.props.addGoods(newGoodsData)
        }else{
          if(values.photo.split(",").length>1){
            newGoodsData={...values,photo:values.photo.split(",")[1]}
          }else{
            newGoodsData={
              name:values.name,
              price:values.price,
              typeId:values.typeId,
              describe:values.describe,
            }
          }
          this.props.updateGoods(newGoodsData)
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
        <div>
          <Modal
              title={this.state.isAddNew?'添加商品':'修改商品信息'}
              visible={this.props.goodsUpdateModalVisible}
              onCancel={this._handleCancel}
              footer={null}
              maskClosable={false}
          >
            <Form>
              <FormItem
                  {...formItemLayout}
                  label="名称"
                  hasFeedback
              >
                {getFieldDecorator('name', {
                  rules: [{
                    required: true, message: '请输入商品名称！',
                  },{
                    validator: this._handleInputGoodsName
                  }],
                })(
                    <Input
                        placeholder="请输入商品名称！"
                    />
                )}
              </FormItem>

              <FormItem
                  {...formItemLayout}
                  label="价格"
                  hasFeedback
              >
                {getFieldDecorator('price', {
                  rules: [{
                    required: true, message: '请输入正确的商品价格！',type:'number'
                  }],
                })(
                    <InputNumber min={0} max={10000} />
                )}
                <span className="ant-form-text"> 元</span>
              </FormItem>


              <FormItem
                  {...formItemLayout}
                  label="类别"
                  hasFeedback
              >
                {getFieldDecorator('typeId', {
                  rules: [
                    { required: true, message: '请选择商品类别！' }
                  ],
                })(
                    <Select placeholder="请选择商品类别！">
                      {this.props.goodsTypeData.map(v=><Option key={v.id} value={v.id}>{v.name}</Option>)}
                    </Select>
                )}
              </FormItem>

              <FormItem
                  {...formItemLayout}
                  label="图片"
                  hasFeedback
              >
                {getFieldDecorator('photo', {
                  rules: [
                    { required: true, message: '请选择图片！' },
                  ]
                })(
                    <Button icon="file" type="primary" onClick={()=>{
                      this.setState({
                        imgCropperModalVisible:true
                      })
                    }}>{this.state.isAddNew?'请选择图片':'重新选择图片'}</Button>
                )}
              </FormItem>

              {this.state.photo===''?null:(
                  <FormItem
                      {...formItemLayout}
                      label=""
                      hasFeedback
                  >
                    <img style={{marginLeft:150}} width={150} height={150} src={this.state.photo.split(',').length>1?this.state.photo:"/"+this.props.activeGoodsData.photoUrl} alt=""/>
                  </FormItem>
              )}

              <FormItem
                  {...formItemLayout}
                  label="简介"
                  hasFeedback
              >
                {getFieldDecorator('describe', {
                  rules: [{
                    required: true, message: '请输入商品简介，将在点餐界面显示！',
                  },{
                    max: 50, message: '商品简介过长！',
                  }],
                })(
                    <TextArea rows={4} />
                )}
              </FormItem>

              <FormItem
                  wrapperCol={{ span: 12, offset: 6 }}
              >
                <Button type="primary" onClick={this._handleCancel}>取消</Button>
                <Button type="primary" onClick={this._handleAddConfirm}>{this.state.isAddNew?'确认添加':'确认修改'}</Button>
              </FormItem>
            </Form>
          </Modal>
          <ImgCropper cropperImgEnd={this._cropperImgEnd} _handleCancelCropper={this._handleCancelCropper} visible={this.state.imgCropperModalVisible} imgSrc={this.state.imgSrc} />
        </div>
    );
  }
}


const GoodsUpdate = Form.create()(GoodsUpdateForm)

export default GoodsUpdate;
