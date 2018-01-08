import React, { Component } from 'react';
import { Button,DatePicker } from 'antd';
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend } from 'recharts'
import {connect} from 'react-redux'
import { fetchStatisticsData } from '../../../redux/statistics.redux'
import moment from 'moment'
import './TurnOver.css';


const {MonthPicker} = DatePicker

@connect(
    state=>state.statistics,
    {fetchStatisticsData}
)
class TurnOver extends Component {

  constructor(props){
    super(props)
    this.state={
      selectedBtn:'lastSevenDays'
    }
    this._onDatePickerChange=this._onDatePickerChange.bind(this)
  }

  componentWillMount(){
    this.fetchLastSevenDays()
  }

  fetchLastSevenDays(){
    var lastSevenDays=new Date()
    lastSevenDays.setDate(lastSevenDays.getDate()-7)
    lastSevenDays.setHours(0)
    lastSevenDays.setMinutes(0)
    lastSevenDays.setSeconds(0)
    lastSevenDays.setMilliseconds(0)

    this.props.fetchStatisticsData({
      endTime:new Date().getTime(),
      split:"day",
      startTime:lastSevenDays.getTime()
    },7)
    this.setState({
      selectedBtn:'lastSevenDays'
    })
  }

  fetchLastThirtyDays(){
    var lastThirtyDays=new Date()
    lastThirtyDays.setDate(lastThirtyDays.getDate()-30)
    lastThirtyDays.setHours(0)
    lastThirtyDays.setMinutes(0)
    lastThirtyDays.setSeconds(0)
    lastThirtyDays.setMilliseconds(0)

    this.props.fetchStatisticsData({
      endTime:new Date().getTime(),
      split:"day",
      startTime:lastThirtyDays.getTime()
    },30)
    this.setState({
      selectedBtn:'lastThirtyDays'
    })
  }

  _onDatePickerChange(date, dateString) {
    var dateValue
    let currentMonthStart=new Date()
    currentMonthStart.setFullYear(dateString.split('-')[0])
    currentMonthStart.setMonth(dateString.split('-')[1]-1)
    currentMonthStart.setDate(1)
    currentMonthStart.setHours(0,0,0,0)
    let currentMonthEnd=new Date(currentMonthStart)
    currentMonthEnd.setMonth(currentMonthStart.getMonth()+1)
    currentMonthEnd.setDate(-1)
    if(dateString!==""){
      dateValue={
        startTime:currentMonthStart.getTime(),
        endTime:currentMonthEnd.getTime(),
        split:"day"
      }
      this.props.fetchStatisticsData(dateValue,currentMonthEnd.getDate())
    }else{
      this.fetchLastSevenDays()
    }
  }


  render() {
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
        <div>
          <h2>营业详情</h2>
        </div>
        <div style={{ marginBottom:10}}>
          <MonthPicker
              defaultValue={moment('2018/01',"YYYY-MM")}
              format="YYYY-MM"
              onChange={this._onDatePickerChange}
          />
          <Button style={{ marginLeft:10}} type={this.state.selectedBtn==='lastSevenDays'?'primary':''} onClick={()=>{
            this.fetchLastSevenDays()
          }}>过去七天</Button>
          <Button type={this.state.selectedBtn==='lastThirtyDays'?'primary':''} onClick={()=>{
            this.fetchLastThirtyDays()
          }}>过去30天</Button>
        </div>
        <LineChart width={1300} height={500} data={this.props.orderData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip/>
          <Legend />
          <Line type="monotone" dataKey="订单总价格" stroke="#8884d8" />
          <Line type="monotone" dataKey="现金实收" stroke="#82ca9d" />
          <Line type="monotone" dataKey="微信支付宝实收" stroke="red" />
          <Line type="monotone" dataKey="会员余额抵扣" stroke="green" />
          <Line type="monotone" dataKey="划零优惠" stroke="pink" />
          <Line type="monotone" dataKey="存酒抵扣" stroke="black" />
        </LineChart>
      </div>
    );
  }
}

export default TurnOver;
