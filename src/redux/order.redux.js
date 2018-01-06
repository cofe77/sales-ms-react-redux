import axios from 'axios'
import {message} from 'antd'

const ORDER_DATA='ORDER_DATA'

const initOrderState={
  orderData:[],
  orderCount:0,
  currentOrderCount:0,
}

export function order(state=initOrderState,action){
  switch (action.type){
    case ORDER_DATA:
      return {...state,orderData:action.payload.slice(1),currentOrderCount:action.payload[0].count,orderCount:state.orderCount>=action.payload[0].count?state.orderCount:action.payload[0].count}
    default:
      return state
  }
}



export function fetchOrderData(params={}){
  return async (dispatch)=>{
    const orderDataRes = await axios.post('/order/getByParamsOldsSimple',{...params,row:100000})

    if(orderDataRes.status===200&&orderDataRes.data[0].count>=0){
      message.success('获取数据成功！')
      dispatch(orderData(orderDataRes.data))
    }else{
      message.error('获取数据失败！')
    }
  }
}


export function orderData(data){
  return {type:ORDER_DATA,payload:data}
}