import { combineReducers } from 'redux';
import nftReducer from './nfts';
import hotCollectionsReducer from './hotCollections';
import authorListReducer from './authorList';
import filterReducer from './filters';
import blogPostsReducer from './blogs';
import themeReducer from './theme' ;
import cartReducer from "./cart";

export const rootReducer = combineReducers({
  NFT: nftReducer,
  CART: cartReducer,
  hotCollection: hotCollectionsReducer,
  authors: authorListReducer,
  filters: filterReducer,
  blogs: blogPostsReducer ,
  themes : themeReducer
}) ;

const reducers = (state, action) => rootReducer(state, action);

export default reducers;