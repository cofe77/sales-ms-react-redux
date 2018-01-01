import {combineReducers} from 'redux'
import {auth} from './auth.redux'
import {goods} from './goods.redux'




const rootReducer=combineReducers({
  auth,
  goods,
})
export default rootReducer