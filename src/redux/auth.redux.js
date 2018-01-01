const LOGIN_SUCCESS='LOGIN_SUCCESS'

const initAuthState={
  isAuth:false,
  userData:{}
}


export function auth(state=initAuthState,action){
  switch (action.type){
    case LOGIN_SUCCESS:
      return {...state,isAuth:true,userData:action.payload}
    case LOGIN_SUCCESS:
      return {...state,isAuth:true,userData:action.payload}
    default:
      return state
  }
}