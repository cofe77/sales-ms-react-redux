export function show_goodsDetail_modal(goodsId) {
  return {
    type: "SHOW_GOODS_DETAIL_MODAL",
    payload:goodsId
  };
}

export function close_goodsDetail_modal() {
  return {
    type: "CLOSE_GOODS_DETAIL_MODAL"
  };
}

export function show_editGoods_modal(goodsId) {
  return {
    type: "SHOW_EDIT_GOODS_MODAL",
    payload:goodsId
  };
}

export function close_editGoods_modal() {
  return {
    type: "CLOSE_EDIT_GOODS_MODAL"
  };
}

export function show_addGoods_modal(goodsId) {
  return {
    type: "SHOW_ADD_GOODS_MODAL"
  };
}

export function close_addGoods_modal() {
  return {
    type: "CLOSE_ADD_GOODS_MODAL"
  };
}