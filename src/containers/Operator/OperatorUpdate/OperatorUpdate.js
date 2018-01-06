import React from 'react'
import {connect} from 'react-redux'
import {Form,Input,Button,Radio,Breadcrumb,Icon} from 'antd'
import {addOperator,updateOperator} from '../../../redux/operator.redux'
import {Redirect,Link} from 'react-router-dom'

const FormItem=Form.Item
const RadioGroup = Radio.Group;



@connect(
    state=>state.operator,
    {addOperator,updateOperator}
)
class OperatorUpdateForm extends React.Component{

  constructor(props){
    super(props)
    this.state={
      isAddNew:true,
      confirmDirty: false,
    }
    this._handleConfirm=this._handleConfirm.bind(this)
    this._handleCancel=this._handleCancel.bind(this)
  }

  componentWillMount(){
    console.log('WillMount')
    console.log(this.props)
    if(this.props.activeOperatorId===-2){this.props.history.push('/home/operatorManage')}
    if(this.props.activeOperatorId>=0) {
      this.setState({
        isAddNew: false,
      })
    }
  }
  componentDidMount(){
    if(!this.state.isAddNew) {
      const oldOperatorDate = this.props.activeOperatorData
      this.props.form.setFieldsValue({
        name:oldOperatorDate.name,
        mobileNum:oldOperatorDate.mobileNum,
        permission:oldOperatorDate.permission,
      });
    }
  }

  _handleConfirm(){
    const oldCount=this.props.operatorCount
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        if(this.state.isAddNew){
          const {confirmPwd,...operatorData}=values
          this.props.addOperator(operatorData)
          setTimeout(()=>{
            if(this.props.operatorCount!==oldCount){
              this.props.history.push('/home/operatorManage')
            }
          },1000)
        }else{
          this.props.updateOperator({...values,id:this.props.activeOperatorId})
          setTimeout(()=>{
              this.props.history.push('/home/operatorManage')
          },1000)
        }
      }
    });
  }

  _handleCancel(){
    this.props.history.push('/home/operatorManage')
  }

  _checkOperatorName=(rule, value, callback)=>{
    this.state.isAddNew?(this.props.operatorData.some(v=>v.name===value)?callback('姓名已存在！'):callback()):(this.props.operatorData.filter(v=>v.id!==this.props.activeOperatorId).some(v=>v.name===value)?callback('姓名已存在！'):callback())
  }

  _handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  _checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码输入不一致！');
    } else {
      callback();
    }
  }
  _checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPwd'], { force: true });
    }
    callback();
  }

  render(){

    const {getFieldDecorator} =this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/home/operatorManage">
                <Icon type="desktop" />
                <span>  操作员管理</span>
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {this.state.isAddNew?'添加操作员':'修改操作员信息'}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ width:400,margin:'0 auto',border:'1px dotted #f60',padding:20}}>
            <h2>{this.state.isAddNew?'添加操作员':'修改操作员信息'}</h2>
            <Form>
              {/*操作员姓名*/}
              <FormItem
                  {...formItemLayout}
                  label="姓名"
                  hasFeedback
              >
                {getFieldDecorator('name',{
                  rules:[
                    {required:true,message:'请输入操作员姓名'},{
                      max:10,message:'姓名长度2-10位'
                    },{
                      min:2,message:'姓名长度2-10位'
                    },{
                      validator: this._checkOperatorName
                    }
                  ]
                })(
                    <Input placeholder="请输入操作员姓名！" />
                )}
              </FormItem>
              {/*操作员手机号码*/}
              <FormItem
                  {...formItemLayout}
                  label="手机号码"
                  hasFeedback
              >
                {getFieldDecorator('mobileNum',{
                  rules:[
                    {required:true,message:'请输入操作员手机号码'},
                    {
                      len:11,message:'请输入正确的手机号码'
                    }
                  ]
                })(
                    <Input placeholder="请输入操作员手机号码！" type="tel" />
                )}
              </FormItem>
              {/*操作员权限*/}
              <FormItem
                  {...formItemLayout}
                  label="权限"
                  hasFeedback
              >
                {getFieldDecorator('permission',{
                  initialValue: 2,
                })(
                    <RadioGroup>
                      <Radio value={1}>超级管理员</Radio>
                      <Radio value={2}>普通操作员</Radio>
                    </RadioGroup>
                )}
              </FormItem>
              {this.state.isAddNew?(
                  <div>

                  {/*新密码*/}
                  <FormItem
                      {...formItemLayout}
                     label="密码"
                     hasFeedback
                  >
                  {getFieldDecorator('password',{
                    rules:[
                      {required:true,message:'请输入密码'},
                      {
                        validator: this._checkConfirm,
                      },{
                        max:10,message:'密码长度6-10位'
                      },{
                        min:6,message:'密码长度6-10位'
                      }
                    ]
                  })(
                      <Input type="password" placeholder="请输入密码" />
                  )}
                  </FormItem>
                {/*确认新密码*/}
                  <FormItem
                      {...formItemLayout}
                      label="确认密码"
                      hasFeedback
                  >
                  {getFieldDecorator('confirmPwd',{
                    rules:[
                      {required:true,message:'请确认密码'},
                      {
                        validator: this._checkPassword,
                      }
                    ]
                  })(
                      <Input type="password" placeholder="请确认密码" onBlur={this._handleConfirmBlur} />
                  )}
                  </FormItem>
                  </div>
              ):null}
            </Form>
            <div style={{width:168,margin:'0 auto'}}>
              <Button onClick={()=>this._handleCancel()} type="primary">{'取消'}</Button>
              <Button onClick={()=>this._handleConfirm()} type="primary">{this.state.isAddNew?'确认添加':'确认修改'}</Button>
            </div>
          </div>
        </div>
    )
  }
}

const OperatorUpdate=Form.create()(OperatorUpdateForm)

export default OperatorUpdate