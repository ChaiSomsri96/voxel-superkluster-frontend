import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { initEntityState, entityLoadingStarted, entityLoadingSucceeded, entityLoadingFailed } from '../utils';

export const defaultState = {
    cartInfo: initEntityState(null)
};

const states = (state = defaultState, action) => {
    switch (action.type) {
        case getType(actions.getCartInfo.request):
            return { ...state, cartInfo: entityLoadingStarted(state.cartInfo, action.payload) };
        case getType(actions.getCartInfo.success):
            return { ...state, cartInfo: entityLoadingSucceeded(state.cartInfo, action.payload) };
        case getType(actions.getCartInfo.failure):
            return { ...state, cartInfo: entityLoadingFailed(state.cartInfo) };

        default:
            return state;
    }
};

export default states;