import { getType } from 'typesafe-actions';
import * as actions from '../actions';

export const defaultState = {
  darkMode: false,
};

const states = (state = defaultState, action) => {
    const payload = action.payload;
    // console.log(action.type,'sdf') ;
  switch (action.type) {    
    case getType(actions.setDarkMode.request):
      return { ...state, darkMode: payload.value};

    default:
      return state;
  }
};

export default states;
