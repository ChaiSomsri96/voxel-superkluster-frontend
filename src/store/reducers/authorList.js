import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { initEntityState, entityLoadingStarted, entityLoadingSucceeded, entityLoadingFailed } from '../utils';

export const defaultState = {
  authorList: initEntityState(null),
  authorRanking: initEntityState(null),
  authorInfo: initEntityState(null),
  authorOnSaledNfts: initEntityState(null),
  authorCreatedNfts: initEntityState(null),
  authorLikedNfts: initEntityState(null),
  authorHiddenNfts: initEntityState(null),
  authorCollectedNfts: initEntityState(null),
  authorBidNfts: initEntityState(null),
  authorSellNfts: initEntityState(null),
  accessToken: initEntityState(localStorage.getItem('accessToken')),
  authorAccount: initEntityState(localStorage.getItem('account'))
};

const states = (state = defaultState, action) => {
  switch (action.type) {
    
    case getType(actions.getAuthorList.request):
      return { ...state, authorList: entityLoadingStarted(state.authorList, action.payload) };
    case getType(actions.getAuthorList.success):
      return { ...state, authorList: entityLoadingSucceeded(state.authorList, action.payload) };
    case getType(actions.getAuthorList.failure):
      return { ...state, authorList: entityLoadingFailed(state.authorList) };

    case getType(actions.getAuthorInfo.request):
      return { ...state, authorInfo: entityLoadingStarted(state.authorInfo, action.payload) };
    case getType(actions.getAuthorInfo.success):
      return { ...state, authorInfo: entityLoadingSucceeded(state.authorInfo, action.payload) };
    case getType(actions.getAuthorInfo.failure):
      return { ...state, authorInfo: entityLoadingFailed(state.authorInfo) };

    case getType(actions.getAuthorOnSaledNfts.request):
      return { ...state, authorOnSaledNfts: entityLoadingStarted(state.authorOnSaledNfts, action.payload) };
    case getType(actions.getAuthorOnSaledNfts.success):
      return { ...state, authorOnSaledNfts: entityLoadingSucceeded(state.authorOnSaledNfts, action.payload) };
    case getType(actions.getAuthorOnSaledNfts.failure):
      return { ...state, authorOnSaledNfts: entityLoadingFailed(state.authorOnSaledNfts) };

    case getType(actions.getAuthorCreatedNfts.request):
      return { ...state, authorCreatedNfts: entityLoadingStarted(state.authorCreatedNfts, action.payload) };
    case getType(actions.getAuthorCreatedNfts.success):
      return { ...state, authorCreatedNfts: entityLoadingSucceeded(state.authorCreatedNfts, action.payload) };
    case getType(actions.getAuthorCreatedNfts.failure):
      return { ...state, authorCreatedNfts: entityLoadingFailed(state.authorCreatedNfts) };

    case getType(actions.getAuthorLikedNfts.request):
      return { ...state, authorLikedNfts: entityLoadingStarted(state.authorLikedNfts, action.payload) };
    case getType(actions.getAuthorLikedNfts.success):
      return { ...state, authorLikedNfts: entityLoadingSucceeded(state.authorLikedNfts, action.payload) };
    case getType(actions.getAuthorLikedNfts.failure):
      return { ...state, authorLikedNfts: entityLoadingFailed(state.authorLikedNfts) };

    case getType(actions.getAuthorHiddenNfts.request):
      return { ...state, authorHiddenNfts: entityLoadingStarted(state.authorHiddenNfts, action.payload) };
    case getType(actions.getAuthorHiddenNfts.success):
      return { ...state, authorHiddenNfts: entityLoadingSucceeded(state.authorHiddenNfts, action.payload) };
    case getType(actions.getAuthorHiddenNfts.failure):
      return { ...state, authorHiddenNfts: entityLoadingFailed(state.authorHiddenNfts) };

    case getType(actions.getAuthorCollectedNfts.request):
      return { ...state, authorCollectedNfts: entityLoadingStarted(state.authorCollectedNfts, action.payload) };
    case getType(actions.getAuthorCollectedNfts.success):
      return { ...state, authorCollectedNfts: entityLoadingSucceeded(state.authorCollectedNfts, action.payload) };
    case getType(actions.getAuthorCollectedNfts.failure):
      return { ...state, authorCollectedNfts: entityLoadingFailed(state.authorCollectedNfts) };

    case getType(actions.getAuthorBidNfts.request):
      return { ...state, authorBidNfts: entityLoadingStarted(state.authorBidNfts, action.payload) };
    case getType(actions.getAuthorBidNfts.success):
      return { ...state, authorBidNfts: entityLoadingSucceeded(state.authorBidNfts, action.payload) };
    case getType(actions.getAuthorBidNfts.failure):
      return { ...state, authorBidNfts: entityLoadingFailed(state.authorBidNfts) };
    
    case getType(actions.getAuthorSellNfts.request):
      return { ...state, authorSellNfts: entityLoadingStarted(state.authorSellNfts, action.payload) };
    case getType(actions.getAuthorSellNfts.success):
      return { ...state, authorSellNfts: entityLoadingSucceeded(state.authorSellNfts, action.payload) };
    case getType(actions.getAuthorSellNfts.failure):
      return { ...state, authorSellNfts: entityLoadingFailed(state.authorSellNfts) };

    case getType(actions.getAuthorRanking.request):
      return { ...state, authorRanking: entityLoadingStarted(state.authorRanking, action.payload) };
    case getType(actions.getAuthorRanking.success):
      return { ...state, authorRanking: entityLoadingSucceeded(state.authorRanking, action.payload) };
    case getType(actions.getAuthorRanking.failure):
      return { ...state, authorRanking: entityLoadingFailed(state.authorRanking) };
    case getType(actions.saveAccessToken):
      return { ...state, accessToken: entityLoadingSucceeded(state.accessToken, action.payload) };
    case getType(actions.saveAuthorAccount):
      return { ...state, authorAccount: entityLoadingSucceeded(state.authorAccount, action.payload) };  
    default:
      return state;
  }
};

export default states;
