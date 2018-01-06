import React, { Component } from 'react';
import { Button,Breadcrumb,Table,DatePicker } from 'antd';
import moment from 'moment'
import {connect} from 'react-redux'
import {fetchOrderData} from '../../../redux/order.redux'

import OrderDetail from '../../../components/orderDetail/orderDetail'
import OperatorDetail from '../../../components/operatorDetail/operatorDetail'
import VipDetail from '../../../components/vipDetail/vipDetail'

import './UsedOrder.css';

const {RangePicker} = DatePicker

@connect(
    state=>state.order,
    {fetchOrderData}
)
class UsedOrder extends Component {

  constructor(props){
    super(props)
    this.state={
      loading:true,
      vipDetailModalVisible:false,
      operatorDetailModalVisible:false,
      orderDetailModalVisible:false,
      dateValue:{},
      selectedBtn:''
    }
    this._onDatePickerChange=this._onDatePickerChange.bind(this)
  }

  componentWillMount(){
    if(this.props.orderCount<=0||this.props.orderCount>this.props.currentOrderCount){
      this.props.fetchOrderData()
    }
  }

  componentDidMount(){
    setTimeout(()=>{
      this.setState({
        loading:false
      })
    },500)
  }

  _onDatePickerChange(date, dateString) {
    var dateValue
    if(dateString.length===2&&dateString[0]!==""&&dateString[1]!==""){
      dateValue={
        timeStart:new Date(dateString[0]).getTime(),
        timeEnd:new Date(dateString[1]).getTime(),
        timeName:'finishedTime'
      }
    }else{
      dateValue={
        timeStart:1262278861000,
        timeEnd:new Date().getTime(),
        timeName:'finishedTime'
      }
      this.props.fetchOrderData({dateValue})
    }
    this.setState({
      dateValue
    })
  }

  render() {

    const columns = [{
      title: '订单ID',
      dataIndex: 'serializtion',
      width: '12%',
    },{
      title: '桌位号码',
      dataIndex: 'deskId',
      width: '12%',
    },{
      title: '开单时间',
      dataIndex: 'createTime',
      sorter: (a, b) => a.createTime - b.createTime,
      render:(text, record)=><span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
      width: '12%',
    },{
      title: '消费金额',
      dataIndex: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render:(text, record)=><span>{`￥${record.totalPrice.toFixed(2)}`}</span>,
      width: '12%',
    },{
      title: '结单时间',
      dataIndex: 'finishedTime',
      sorter: (a, b) => a.createTime - b.createTime,
      render:(text, record)=><span>{moment(record.finishedTime).format('YYYY-MM-DD HH:mm:ss')}</span>,
      width: '12%',
    },{
      title: '顾客',
      dataIndex: 'vipId',
      render:(text, record)=>(
          <div>
            {record.vipId===0?'普通操作员':(<Button type="primary" size="small">查看</Button>)}
          </div>
      ),
      width: '12%',
    },{
      title: '结单操作员',
      dataIndex: 'operatorId',
      render:(text, record)=><Button type="primary" size="small">查看</Button>,
      width: '12%',
    },{
      title: '操作',
      render: (text, record) =><Button onClick={()=>this._handleDeleteOperator(record)} type="primary" size="small">详情</Button>,
    }];

    return (
        <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
          <div style={{ marginBottom:10}}>
          <RangePicker
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
              }}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={this._onDatePickerChange}
              onOk={()=>{
                this.props.fetchOrderData({dateValue:this.state.dateValue})
              }}
          />
          <Button style={{ marginLeft:10}} type={this.state.selectedBtn==='today'?'primary':''} onClick={()=>{
            var todayStartTime=new Date()
            todayStartTime.setHours(0)
            todayStartTime.setMinutes(0)
            todayStartTime.setSeconds(0)
            todayStartTime.setMilliseconds(0)
            this.props.fetchOrderData({
              dateValue:{
                timeStart:todayStartTime.getTime(),
                timeEnd:new Date().getTime(),
                timeName:'finishedTime'
              }
            })
            this.setState({
              selectedBtn:'today'
            })
          }}>今日订单</Button>
          <Button type={this.state.selectedBtn==='currentMonth'?'primary':''} onClick={()=>{
            var currentMonthStartTime=new Date()
            currentMonthStartTime.setDate(1)
            currentMonthStartTime.setHours(0)
            currentMonthStartTime.setMinutes(0)
            currentMonthStartTime.setSeconds(0)
            currentMonthStartTime.setMilliseconds(0)
            this.props.fetchOrderData({
              dateValue:{
                timeStart:currentMonthStartTime.getTime(),
                timeEnd:new Date().getTime(),
                timeName:'finishedTime'
              }
            })
            this.setState({
              selectedBtn:'currentMonth'
            })
          }}>本月订单</Button>
          <Button type={this.state.selectedBtn==='all'?'primary':''} onClick={()=>{
            this.props.fetchOrderData({
              dateValue:{
                timeStart:1262278861000,
                timeEnd:new Date().getTime(),
                timeName:'finishedTime'
              }
            })
            this.setState({
              selectedBtn:'all'
            })
          }}>所有订单</Button>
          </div>
          <Table columns={columns}
                 rowKey={record => record.id}
                 dataSource={this.props.orderData}
                 pagination={this.props.orderCount}
                 loading={this.state.loading}
          />
          {this.state.vipDetailModalVisible?<VipDetail />:null}
          {this.state.operatorDetailModalVisible?<OperatorDetail />:null}
          {this.state.orderDetailModalVisible?<OrderDetail />:null}
        </div>
    );
  }
}

export default UsedOrder;
