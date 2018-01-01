import React, { Component } from 'react';
import { Form, Icon, Input, Button,message } from 'antd';
import axios from 'axios';
import './Login.css';



const FormItem = Form.Item;

class LoginForm extends Component {

  _handleSubmit=(event)=>{
    event.preventDefault();
    axios.post('/operator/login', {
      mobileNum:"18393918951",
      password:"15233c425764"
    }).then((response)=>{
      message.success('登陆成功！');
      this.props.history.push('/home/welcome');
    }).catch((error)=>message.error('网络错误！'));
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className="login-page">
          <div className="login-box">
            <div className="login-title-box">
              <span className="login-title">
                欢迎来到SalesMS，请登录！
              </span>
            </div>
            <Form onSubmit={this._handleSubmit.bind(this)} className="login-form">
              <FormItem>
                {getFieldDecorator('userName', {
                  rules: [{ required: true, message: '请输入用户名!' }],
                })(
                    <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="请输入用户名" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }],
                })(
                    <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="请输入密码" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button pull-right">
                  登录
                </Button>
              </FormItem>
            </Form>
          </div>
        </div>
    );
  }
}
const Login = Form.create()(LoginForm);

export default Login;
