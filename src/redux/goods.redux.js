import axios from 'axios'
import {message} from 'antd'

//弹出商品详情对话框
const GOODS_DETAIL_MODAL_VISIBLE='GOODS_DETAIL_MODAL_VISIBLE'
//所有商品信息
const GOODS_DATA='GOODS_DATA'
//所有商品类型信息
const GOODS_TYPE_DATA='GOODS_TYPE_DATA'
//关闭商品详情对话框
const GOODS_DETAIL_MODAL_INVISIBLE='GOODS_DETAIL_MODAL_INVISIBLE'
//弹出更新商品对话框
const GOODS_UPDATE_MODAL_VISIBLE='GOODS_UPDATE_MODAL_VISIBLE'
//关闭更新商品对话框
const GOODS_UPDATE_MODAL_INVISIBLE='GOODS_UPDATE_MODAL_INVISIBLE'
//更新当前商品信息
const ACTIVE_GOODS_DATA='ACTIVE_GOODS_DATA'


const initGoodsState={
  goodsData:[],
  goodsCount:0,
  goodsTypeData:[],
  goodsTypeCount:0,
  goodsDetailModalVisible:false,
  goodsUpdateModalVisible:false,
  activeGoodsId:'',
  activeGoodsData:{}
}

export function goods(state=initGoodsState,action){
  switch(action.type){
    case GOODS_DATA:
      return {
        ...state,
        goodsData:action.payload.data.map(v=>({...v,typeName:state.goodsTypeData.find(tv=>tv.id===v.typeId).name})),
        goodsCount:action.payload.count,
        goodsUpdateModalVisible:false
      }
    case GOODS_TYPE_DATA:
      return {...state,goodsTypeData:action.payload.data,goodsTypeCount:action.payload.count}
    case GOODS_DETAIL_MODAL_VISIBLE:
      return {...state,goodsDetailModalVisible:true,activeGoodsId:action.payload}
    case GOODS_DETAIL_MODAL_INVISIBLE:
      return {...state,goodsDetailModalVisible:false,activeGoodsId:'',activeGoodsData:{}}
    case GOODS_UPDATE_MODAL_VISIBLE:
      return {...state,goodsUpdateModalVisible:true,activeGoodsId:action.payload}
    case GOODS_UPDATE_MODAL_INVISIBLE:
      return {...state,goodsUpdateModalVisible:false,activeGoodsId:'',activeGoodsData:{}}
    case ACTIVE_GOODS_DATA:
      return {...state,activeGoodsData:{...action.payload,typeName:state.goodsTypeData.find(tv=>tv.id===action.payload.typeId).name}}
    default:
      return state
  }
}

export function showGoodsDetailModal(goodsId){
  return {type:GOODS_DETAIL_MODAL_VISIBLE,payload:goodsId}
}
export function hideGoodsDetailModal(){
  return {type:GOODS_DETAIL_MODAL_INVISIBLE}
}
export function showUpdateGoodsModal(goodsId){
  return {type:GOODS_UPDATE_MODAL_VISIBLE,payload:goodsId}
}
export function hideUpdateGoodsModal(){
  return {type:GOODS_UPDATE_MODAL_INVISIBLE}
}
export function allGoodsData({data,count}){
  return {type:GOODS_DATA,payload:{data,count}}
}
export function allGoodsTypeData({data,count}){
  return {type:GOODS_TYPE_DATA,payload:{data,count}}
}

function activeGoodsData(data){
  return {type:ACTIVE_GOODS_DATA,payload:data}
}

export function fetchGoodsData(params={}){
  return async (dispatch)=>{
    const goodsTypeDataRes = await axios.post('/goodsType/getAll',{})
    const goodsDataRes = await axios.post('/goods/getByParams',{row:10000})
    if(goodsTypeDataRes.status===200){
      dispatch(allGoodsTypeData({data:goodsTypeDataRes.data.slice(1),count:goodsTypeDataRes.data[0].count}))
    }else{
      message.error('网络错误！')
    }
    if(goodsDataRes.status===200){
      dispatch(allGoodsData({data:goodsDataRes.data.slice(1),count:goodsDataRes.data[0].count}))
    }else{
      message.error('网络错误！')
    }
  }
}

export function fetchGoodsDataById(goodsId){
  return (dispatch,getState)=>{
      const {goodsData} = getState().goods
      const goods=goodsData.find(v=>v.id===goodsId)
      dispatch(activeGoodsData(goods))
  }
}

export function addGoods(goodsData){
  return dispatch=>{
      axios.post('/goods/save',{
          ...goodsData
      }).then((response)=>{
        if(response.status===200){
          message.success('添加成功！')
          dispatch(fetchGoodsData())
        }
      }).catch((error)=>message.error('网络错误！'));
  }
}
export function updateGoods(goodsData){
  return (dispatch,getState)=>{
      axios.post('/goods/update',{
          ...goodsData,
          id:getState().goods.activeGoodsId
      }).then((response)=>{
        if(response.status===200){
          message.success('保存修改成功！')
          dispatch(fetchGoodsData())
        }
      }).catch((error)=>message.error('网络错误！'));
  }
}
export function deleteGoods(goodsId){
  return (dispatch,getState)=>{
      axios.post('/goods/delete',{
          id:goodsId
      }).then((response)=>{
        if(response.status===200){
          message.success('删除成功！')
          dispatch(fetchGoodsData())
        }
      }).catch((error)=>message.error('网络错误！'));
  }
}