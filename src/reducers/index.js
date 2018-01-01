import {combineReducers} from "redux"
import { add_goods_modal,goods_detail_modal,edit_goods_modal} from './goods'

const rootReducer = combineReducers({
  add_goods_modal,
  goods_detail_modal,
  edit_goods_modal,
});
export default rootReducer