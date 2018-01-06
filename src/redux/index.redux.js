import {combineReducers} from 'redux'
import {auth} from './auth.redux'
import {goods} from './goods.redux'
import {operator} from './operator.redux'
import {order} from './order.redux'
import {statistics} from './statistics.redux'




const rootReducer=combineReducers({
  auth,
  goods,
  operator,
  order,
  statistics,
})
export default rootReducer