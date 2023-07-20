import { getType } from 'typesafe-actions';
import * as actions from '../actions';
import { initEntityState, entityLoadingStarted, entityLoadingSucceeded, entityLoadingFailed } from '../utils';

export const defaultState = {
  nftCategory: initEntityState(null),
  nftBreakdown: initEntityState(null),
  nftDetail: initEntityState(null),
  nftDetailInfo: initEntityState(null),
  nftHistory: initEntityState(null),
  nftBidHistory: initEntityState(null),
  nftShowcase: initEntityState(null),
  nftCollection: initEntityState(null),
  nftFilterCollections: initEntityState(null),
  nftMinting: initEntityState(null)
};

const states = (state = defaultState, action) => {
  switch (action.type) {

    case getType(actions.getCategories.request):
      return { ...state, nftCategory: entityLoadingStarted(state.nftCategory, action.payload) };
    case getType(actions.getCategories.success):
      return { ...state, nftCategory: entityLoadingSucceeded(state.nftCategory, action.payload) };
    case getType(actions.getCategories.failure):
      return { ...state, nftCategory: entityLoadingFailed(state.nftCategory) };

    case getType(actions.getFilterCollections.request):
      return { ...state, nftFilterCollections: entityLoadingStarted(state.nftFilterCollections, action.payload) };
    case getType(actions.getFilterCollections.success):
      return { ...state, nftFilterCollections: entityLoadingSucceeded(state.nftFilterCollections, action.payload) };
    case getType(actions.getFilterCollections.failure):
      return { ...state, nftFilterCollections: entityLoadingFailed(state.nftFilterCollections) };
    
    case getType(actions.getNftBreakdown.request):
      return { ...state, nftBreakdown: entityLoadingStarted(state.nftBreakdown, action.payload) };
    case getType(actions.getNftBreakdown.success):
      //append existing data with new data
      let payload = state.nftBreakdown.data ? [...state.nftBreakdown.data, ...action.payload] : action.payload;
      return { ...state, nftBreakdown: entityLoadingSucceeded(state.nftBreakdown, payload) };
    case getType(actions.getNftBreakdown.failure):
      return { ...state, nftBreakdown: entityLoadingFailed(state.nftBreakdown) };
    
    case getType(actions.getNftDetail.request):
      return { ...state, nftDetail: entityLoadingStarted(state.nftDetail, action.payload) };
    case getType(actions.getNftDetail.success):
      return { ...state, nftDetail: entityLoadingSucceeded(state.nftDetail, action.payload) };
    case getType(actions.getNftDetail.failure):
      return { ...state, nftDetail: entityLoadingFailed(state.nftDetail) };

    case getType(actions.getNftDetailInfo.request):
      return { ...state, nftDetailInfo: entityLoadingStarted(state.nftDetail, action.payload) };
    case getType(actions.getNftDetailInfo.success):
      return { ...state, nftDetailInfo: entityLoadingSucceeded(state.nftDetail, action.payload) };
    case getType(actions.getNftDetailInfo.failure):
      return { ...state, nftDetailInfo: entityLoadingFailed(state.nftDetail) };

    case getType(actions.getNftHistory.request):
      return { ...state, nftHistory: entityLoadingStarted(state.nftHistory, action.payload) };
    case getType(actions.getNftHistory.success):
      return { ...state, nftHistory: entityLoadingSucceeded(state.nftHistory, action.payload) };
    case getType(actions.getNftHistory.failure):
      return { ...state, nftHistory: entityLoadingFailed(state.nftHistory) };
    
    case getType(actions.getNftBidHistory.request):
      return { ...state, nftBidHistory: entityLoadingStarted(state.nftBidHistory, action.payload) };
    case getType(actions.getNftBidHistory.success):
      return { ...state, nftBidHistory: entityLoadingSucceeded(state.nftBidHistory, action.payload) };
    case getType(actions.getNftBidHistory.failure):
      return { ...state, nftBidHistory: entityLoadingFailed(state.nftBidHistory) };
    
    case getType(actions.getNftShowcase.request):
      return { ...state, nftShowcase: entityLoadingStarted(state.nftShowcase, action.payload) };
    case getType(actions.getNftShowcase.success):
      return { ...state, nftShowcase: entityLoadingSucceeded(state.nftShowcase, action.payload) };
    case getType(actions.getNftShowcase.failure):
      return { ...state, nftShowcase: entityLoadingFailed(state.nftShowcase) };

    case getType(actions.getCollection.request):
      return { ...state, nftCollection: entityLoadingStarted(state.nftCollection, action.payload) };
    case getType(actions.getCollection.success):
      return { ...state, nftCollection: entityLoadingSucceeded(state.nftCollection, action.payload) };
    case getType(actions.getCollection.failure):
      return { ...state, nftCollection: entityLoadingFailed(state.nftCollection) };

      case getType(actions.postMintingNft.request):
        return { ...state, nftMinting: entityLoadingStarted(state.nftMinting, action.payload) };
      case getType(actions.postMintingNft.success):
        return { ...state, nftMinting: entityLoadingSucceeded(state.nftMinting, action.payload) };
      case getType(actions.postMintingNft.failure):
        return { ...state, nftMinting: entityLoadingFailed(state.nftMinting) };
    case getType(actions.clearNfts):
      return { ...state, nftBreakdown: initEntityState(null)};
    
    default:
      return state;
  }
};

export default states;
