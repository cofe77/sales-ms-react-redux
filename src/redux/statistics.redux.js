import axios from 'axios'
import {message} from 'antd'

const STATISTICS_ORDER_DATA = 'STATISTICS_ORDER_DATA'

const initStatisticsData={
  orderData:[]
}

export function statistics(state=initStatisticsData,action){
  switch(action.type){
    case STATISTICS_ORDER_DATA:
      return {...state,orderData:action.payload}
    default:
      return state
  }
}

export function fetchStatisticsData(params={},days){
  return async (dispatch)=>{
    const orderRes = await axios.post('/order/tally',params)

    if(orderRes.status===200&&orderRes.data.isSuccess===true){
      message.success('获取数据成功！')
      var {startTime}=params
      const endDay=new Date(params.endTime)
      var dateDays=[]
      var tempOrderData=[]
      for(var i=0;i<days;i++){
        let day=new Date(startTime).getFullYear()+'-'+(new Date(startTime).getMonth()+1)+'-'+new Date(startTime).getDate()
        dateDays.push(day)
        let dayData={
          'name':day,
          '现金实收':orderRes.data.cashSettlement[i],
          '会员余额抵扣':orderRes.data.dedcuteSettlement[i],
          '划零优惠':orderRes.data.oddment[i],
          '微信支付宝实收':orderRes.data.onlineSettlement[i],
          '存酒抵扣':orderRes.data.savedBeerdsDedcute[i],
          '订单总价格':orderRes.data.totalPrice[i],
        }
        tempOrderData.push(dayData)
        startTime+=24*3600000
      }

      dispatch(statisticsOrderData(tempOrderData))
    }else{
      message.error('获取数据失败！')
    }
  }
}

export function statisticsOrderData(data){
  return {type:STATISTICS_ORDER_DATA,payload:data}
}