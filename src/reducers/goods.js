

export function goods_detail_modal (state = {goodsDetailVisible:false,goodsId:null}, action) {
  switch (action.type) {
    case "SHOW_GOODS_DETAIL_MODAL":
      console.log(action)
      return {...state,goodsDetailVisible:true,goodsId:action.payload};
      break;
    case "CLOSE_GOODS_DETAIL_MODAL":
      console.log(action)
      return {...state,goodsDetailVisible:false,goodsId:null};
      break;
    default:
      return state
  }
}

export function edit_goods_modal (state = {goodsEditVisible:false,goodsId:null}, action) {
  switch (action.type) {
    case "SHOW_EDIT_GOODS_MODAL":
      console.log(action)
      return {...state,goodsEditVisible:true,goodsId:action.payload};
      break;
    case "CLOSE_EDIT_GOODS_MODAL":
      console.log(action)
      return {...state,goodsEditVisible:false,goodsId:null};
      break;
    default:
      return state
  }
}

export function add_goods_modal (state = {goodsAddVisible:false}, action) {
  switch (action.type) {
    case "SHOW_ADD_GOODS_MODAL":
      console.log(action)
      return {...state,goodsAddVisible:true};
      break;
    case "CLOSE_ADD_GOODS_MODAL":
      console.log(action)
      return {...state,goodsAddVisible:false};
      break;
    default:
      return state
  }
}