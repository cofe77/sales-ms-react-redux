

const NAV_CHANGE='NAV_CHANGE'

const initNavState={
  currentNav:1-2,
}

export function navCfg(state=initNavState,action){
  switch(action.type){
    case NAV_CHANGE:
      return {...state,currentNav:action.payload}
  }
}