import React, { Component } from 'react';
import { Button,Breadcrumb,Table,message,Modal } from 'antd';
import './OperatorLists.css';

import {fetchOperatorData,setActiveOperatorData,deleteOperator} from '../../../redux/operator.redux'
import {connect} from 'react-redux'

import moment from 'moment'

import OperatorUpdate from '../OperatorUpdate/OperatorUpdate'
import ChangePwd from '../../../components/changePwd/changePwd'

const confirm=Modal.confirm

@connect(
    state=>state.operator,
    {fetchOperatorData,setActiveOperatorData,deleteOperator}
)
class OperatorLists extends Component {
  constructor(props){
    super(props)
    this.state={
      data: [],
      pagination: {},
      loading: false,
      changePwdModalVisible: false,
    }
    this._handleDeleteOperator=this._handleDeleteOperator.bind(this)
  }
  componentWillMount() {
    if(this.props.operatorCount==0){
      this.props.fetchOperatorData();
    }
  }
  componentDidMount() {
    console.log('did mount')
  }

  _handleDeleteOperator=(operator)=>{
    const {id,name}=operator
    const {deleteOperator} = this.props
    confirm({
      title: '确认删除：“'+name+'”？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('OK');
        deleteOperator(id)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  render() {
    const columns = [{
      title: '姓名',
      dataIndex: 'name',
      width: '20%',
    }, {
      title: '手机号码',
      dataIndex: 'mobileNum',
      width: '20%',
    },{
      title: '类别',
      dataIndex: 'permission',
      filters: [{
        text: '普通操作员',
        value: 1,
      }, {
        text: '超级管理员',
        value: 2,
      }],
      filterMultiple: false,
      render:(text, record)=><span>{record.permission===1?'普通操作员':'超级管理员'}</span>,
      width: '20%',
    },{
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: (a, b) => a.createTime - b.createTime,
      render:(text, record)=><span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
      width: '20%',
    }, {
      title: '操作',
      render: (text, record) => (
          <div>
            <Button onClick={()=>{
              this.props.setActiveOperatorData(record)
              this.props.history.push('/home/operatorManage/operatorUpdate')
            }} type="primary" size="small">修改信息</Button>
            <Button onClick={()=>{
              this.props.setActiveOperatorData(record)
              this.setState({
                changePwdModalVisible:true
              })
            }} type="primary" size="small">修改密码</Button>
            <Button onClick={()=>this._handleDeleteOperator(record)} type="danger" size="small">删除</Button>
          </div>
      ),
    }];

    return (
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          <Button size="large" type={'primary'} onClick={()=>{
            this.props.setActiveOperatorData({id:-1})
            this.props.history.push('/home/operatorManage/operatorUpdate')
          }}>添加操作员</Button>
          <Table columns={columns}
                 rowKey={record => record.id}
                 dataSource={this.props.operatorData}
                 pagination={this.props.operatorCount}
                 loading={this.state.loading}
          />
          {this.props.activeOperatorId>-1?(
              <ChangePwd
                  title={`修改管理员${this.props.activeOperatorData.name}的密码`}
                  visible={this.state.changePwdModalVisible}
                  forWitch={{type:'operator',id:this.props.activeOperatorId}}
                  hideChangePwd={()=>{
                    this.setState({
                      changePwdModalVisible:false
                    })
                  }}
                  key={new Date()}
              />
          ):null}
        </div>
    );
  }
}

export default OperatorLists;
