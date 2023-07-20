import { Axios, Canceler } from "../../../core/axios";
import * as actions from "../../actions";
import api from "../../../core/api";

import Swal from 'sweetalert2' ;
import 'sweetalert2/src/sweetalert2.scss' ;

const openNotificationWithIcon = param => {
  Swal.fire({
    title: 'It worked!',
    text: `${param}`,
    icon: 'success',
    confirmButtonText: 'Close',
    timer: 5000,
customClass: 'swal-height'
  })
};
const openNotificationWithIconError = param => {
  Swal.fire({
    title: 'Oops...',
    text: `${param}`,
    icon: 'error',
    confirmButtonText: 'Close',
    timer: 5000,
customClass: 'swal-height'
  })
};

export const fetchNftsBreakdown = (authorId) => async (dispatch, getState) => {
  //access the state

  dispatch(actions.getNftBreakdown.request(Canceler.cancel));

  try {
    let filter = authorId ? "author=" + authorId : "";
    const { data } = await Axios.get(`${api.baseUrl}${api.nfts}?${filter}`, {
      cancelToken: Canceler.token,
      params: {},
    });

    dispatch(actions.getNftBreakdown.success(data));
  } catch (err) {
    dispatch(actions.getNftBreakdown.failure(err));
  }
};

export const fetchNftShowcase = () => async (dispatch) => {
  dispatch(actions.getNftShowcase.request(Canceler.cancel));

  try {
    const { data } = await Axios.get(`${api.baseUrl}${api.nftShowcases}`, {
      cancelToken: Canceler.token,
      params: {},
    });

    dispatch(actions.getNftShowcase.success(data));
  } catch (err) {
    dispatch(actions.getNftShowcase.failure(err));
  }
};

export const fetchNftCategory = () => async (dispatch) => {
  dispatch(actions.getCategories.request(Canceler.cancel));

  try {
    const { data } = await Axios.get(`/api/setting/categories`);
    dispatch(actions.getCategories.success(data));
  } catch (err) {
    dispatch(actions.getCategories.failure(err));
  }
};

export const fetchNftCollections = () => async (dispatch) => {
  dispatch(actions.getFilterCollections.request(Canceler.cancel));

  try {
    const { data } = await Axios.get(`/api/collections/search`);
    dispatch(actions.getFilterCollections.success(data));
  } catch (err) {
    dispatch(actions.getFilterCollections.failure(err));
  }
};

export const fetchNftDetailInfo = (accessToken, header, nftId) => async (dispatch) => {
  dispatch(actions.getNftDetailInfo.request(Canceler.cancel));
  
  try {
    if(accessToken) { 
      const { data } = await Axios.get(`/api/supply-assets/users/${nftId}`, { headers: header })
      dispatch(actions.getNftDetailInfo.success(data.asset));
    }
    else {
      const { data } = await Axios.get(`/api/supply-assets/${nftId}`);
      dispatch(actions.getNftDetailInfo.success(data.asset));
    }
  } catch (err) {
    dispatch(actions.getNftDetailInfo.failure(err));
  }
}

export const fetchNftDetail = (pageNum, pageSize, param, searchKey,accessToken,header) => async (dispatch) => {
  dispatch(actions.getNftDetail.request(Canceler.cancel));

  let requestData = {
    page: pageNum,
    per_page: pageSize,
    search_key: searchKey?searchKey : ""
  };

  if(param) {
    requestData = {
      sale_type: param.sale_type ? param.sale_type : null,
      collection: param.collection && param.collection.length > 0? param.collection : null,
      chainUrl: param.chain_url ? param.chain_url : null,
      category: param.category ? param.category : "",
      min_price: param.min_price ? param.min_price : null,
      max_price: param.max_price ? param.max_price : null,
      order_type: param.order_type ? param.order_type : null,
      currency_type: param.price_type ? param.price_type : null,
      ...requestData
    }
  }

  try {
    if(accessToken){
      const { data } = await Axios.post(`/api/assets/explorer_user_assets`, requestData, { headers: header });
      dispatch(actions.getNftDetail.success(data));
    }else {
      const { data } = await Axios.post(`/api/assets/explorer_assets`, requestData);
      dispatch(actions.getNftDetail.success(data));
    }
  } catch (err) {
    dispatch(actions.getNftDetail.failure(err));
  }
};

export const fetchNftHistory = (param) => async (dispatch) => {
  dispatch(actions.getNftHistory.request(Canceler.cancel));
  try {
    const { data } = await Axios.post("/api/assets/history", param);
    dispatch(actions.getNftHistory.success(data));
  } catch (err) {
    dispatch(actions.getNftHistory.failure(err));
  }
};

export const fetchBidHistory = (param) => async (dispatch) => {
  dispatch(actions.getNftBidHistory.request(Canceler.cancel));
  try {
    const { data } = await Axios.post("/api/bid/asset-bids", param);
    dispatch(actions.getNftBidHistory.success(data.data));
  } catch (err) {
    dispatch(actions.getNftBidHistory.failure(err));
  }
};

export const createNftCollection = (param) => async (dispatch) => {
  dispatch(actions.getCollection.request(Canceler.cancel));
  try {
    const header = { 'Authorization': `Bearer ${param.accessToken}` }
    const { data } = await Axios.post("/api/collections", param.newData, { headers: header });
    if (data) {
      dispatch(actions.getCollection.success(data));
      openNotificationWithIcon('Collection Created Successfully!');
      param.setItemId(data.link);
    }
  } catch (err) {
    dispatch(actions.getCollection.failure(err));
    Object.values(err).map(function(item) {
      if (item.data && item.data.msg) {
        
        openNotificationWithIconError(`${ item.data.msg }`);
        
      }
    })

  }
};

export const createNftMinting = (param) => async (dispatch) => {
  dispatch(actions.postMintingNft.request(Canceler.cancel));
  try {
    const header = { 'Authorization': `Bearer ${param.accessToken}` }
    const { data } = await Axios.post("/api/supply-assets", param.newData, { headers: header });
    if (data) {
      dispatch(actions.postMintingNft.success(data));
      openNotificationWithIcon('NFT Created Successfully')
      param.setItemId(data.id);
    }
  } catch (err) {
    dispatch(actions.postMintingNft.failure(err));
    Object.values(err).map(function(item) {
      if (item.data && item.data.msg) {
        openNotificationWithIconError(`${ item.data.msg }`);
        throw item 
      }
    })
  }
}; 
