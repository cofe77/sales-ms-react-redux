import React from 'react'
import {Form,Input,Modal,message} from 'antd'
import axios from 'axios'


const FormItem=Form.Item

class ChangePwdForm extends React.Component{
  constructor(props){
    super(props)
    this.state={
      confirmDirty:false
    }
    this._handleOk=this._handleOk.bind(this)
  }

  componentDidMount(){
    console.log(this.props)
    console.log('did mount')
  }

  componentWillMount(){
    console.log('will mount')
  }

  _checkConfirm=(rule,value,callback)=>{
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPwd'], { force: true });
    }
    callback();
  }

  _checkPassword=(rule,value,callback)=>{
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次密码输入不一致！');
    } else {
      callback();
    }
  }

  _handleConfirmBlur=(e)=>{
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  async _handleOk(){
    const form =this.props.form
    form.validateFields((err,values)=>{
      if(!err){
        if(values.password===values.newPassword){
          message.error('新旧密码重复！')
          return
        }
        console.log(values)
        const {confirmPwd,...passwordData} = values
        const {id,type} = this.props.forWitch
        axios.post(`/${type}/update`,{...passwordData,id}).then(res=>{
          if(res.status===200){
            if(res.data==='passwordError'){
              message.error('旧密码错误！')
            }else{
              message.success('修改成功！')
              this.props.hideChangePwd()
            }
          }
        }).catch(e=>{
          message.error('服务器错误！')
        })
      }
    })
  }

  render(){
    const {getFieldDecorator} =this.props.form
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
          title={this.props.title}
          visible={this.props.visible}
          okText={'确认修改'}
          cancelText={'取消'}
          onOk={this._handleOk}
          onCancel={()=>this.props.hideChangePwd()}
      >
      <Form>
        {/*旧密码*/}
        <FormItem
            {...formItemLayout}
            label={'旧密码'}
            hasFeedback
        >
          {getFieldDecorator('password',{
            rules:[
                {required:true,message:'请输入旧密码'},
                ]
          })(
             <Input type="password" placeholder="请输入旧密码" />
          )}
        </FormItem>
        {/*新密码*/}
        <FormItem
            {...formItemLayout}
            label={'新密码'}
            hasFeedback
        >
          {getFieldDecorator('newPassword',{
            rules:[
                {required:true,message:'请输入新密码'},{
                validator:this._checkConfirm
              },{
                max:10,message:'密码长度6-10位'
              },{
                min:6,message:'密码长度6-10位'
              }
                ]
          })(
             <Input type="password" placeholder="请输入新密码" />
          )}
        </FormItem>
        {/*确认新密码*/}
        <FormItem
            {...formItemLayout}
            label={'确认新密码'}
            hasFeedback
        >
          {getFieldDecorator('confirmPwd',{
            rules:[
                {required:true,message:'请确认新密码'},{
                  validator:this._checkPassword
              }
                ]
          })(
             <Input type="password" placeholder="请确认新密码" onBlur={this._handleConfirmBlur} />
          )}
        </FormItem>
      </Form>
      </Modal>
    )
  }


}

const ChangePwd = Form.create()(ChangePwdForm)

export default ChangePwd