import axios from 'axios'
import {message} from 'antd'

const OPERATOR_DATA='OPERATOR_DATA'
const ACTIVE_OPERATOR_DATA='ACTIVE_OPERATOR_DATA'


const initOperatorState={
  operatorData:[],
  operatorCount:0,
  activeOperatorId:-2,
  activeOperatorData:{},
}

export function operator(state=initOperatorState,action){
  switch(action.type){
    case OPERATOR_DATA:
      return {...state,operatorData:action.payload.data,operatorCount:action.payload.num}
    case ACTIVE_OPERATOR_DATA:
      return {...state,activeOperatorId:action.payload.id,activeOperatorData:action.payload}
    default:
      return state
  }
}

export function fetchOperatorData(){
  return async dispatch=>{
    const response = await axios.post('/operator/getByParams',{row:10000})
    if(response.status===200){
      dispatch(operatorData({data:response.data.slice(1),num:response.data[0].count}))
    }else{
      message.error('服务器错误！')
    }
  }
}

export function addOperator(data){
  return async dispatch=>{
    const addRes = await axios.post('/operator/create',data)
    if(addRes.status===200){
      message.success('添加成功！')
      dispatch(fetchOperatorData())
    }
  }
}
export function updateOperator(data){
  return async dispatch=>{
    const addRes = await axios.post('/operator/update',data)
    if(addRes.status===200){
      message.success('修改成功！')
      dispatch(fetchOperatorData())
    }
  }
}

export function deleteOperator(id){
  return (dispatch,getState)=>{
    axios.post('/operator/delete',{
      id
    }).then((response)=>{
      if(response.status===200){
        message.success('删除成功！')
        dispatch(fetchOperatorData())
      }
    }).catch((error)=>message.error('网络错误！'));
  }
}
export function operatorData({data,num}){
  return {type:OPERATOR_DATA,payload:{data,num}}
}

export function setActiveOperatorData(data){
  return {type:ACTIVE_OPERATOR_DATA,payload:data}
}
