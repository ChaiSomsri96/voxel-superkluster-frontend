import { Axios, Canceler } from '../../../core/axios';
import * as actions from '../../actions';
import api from '../../../core/api';

export const fetchAuthorList = (authorId) => async (dispatch) => {
  dispatch(actions.getAuthorList.request(Canceler.cancel));

  try {
    const filter = authorId ? `id=${authorId}` : '';
    
    const { data } = await Axios.get(`${api.baseUrl}${api.authors}?${filter}`, {
      cancelToken: Canceler.token,
      params: {}
    });

    dispatch(actions.getAuthorList.success(data));
  } catch (err) {
    dispatch(actions.getAuthorList.failure(err));
  }
};

export const fetchAuthorRanking = () => async (dispatch) => {

  dispatch(actions.getAuthorRanking.request(Canceler.cancel));

  try {
    const { data } = await Axios.get(`${api.baseUrl}${api.authorsSales}`, {
      cancelToken: Canceler.token,
      params: {}
    });

    dispatch(actions.getAuthorRanking.success(data));
  } catch (err) {
    dispatch(actions.getAuthorRanking.failure(err));
  }
};

export const fetchAuthorInfo = (author_address) => async (dispatch) => {
  dispatch(actions.getAuthorInfo.request(Canceler.cancel));

  try {
    const { data } = await Axios.get(`/api/users/?public_address=${author_address}`);
    dispatch(actions.getAuthorInfo.success(data));
  } catch (err) {
    dispatch(actions.getAuthorInfo.failure(err));
  }
};

export const fetchAuthorOnSaledNfts = (author_address, page) => async (dispatch) => {
  dispatch(actions.getAuthorOnSaledNfts.request(Canceler.cancel));

  try {
    const sendData = {
      sale: author_address,
      per_page: 20,
      page: page
    }
    const { data } = await Axios.post(`api/supply-assets/user-profile-data`, sendData);
    dispatch(actions.getAuthorOnSaledNfts.success(data));
  } catch (err) {
    dispatch(actions.getAuthorOnSaledNfts.failure(err));
  }
};

export const fetchAuthorCreatedNfts = (author_address, page) => async (dispatch) => {
  dispatch(actions.getAuthorCreatedNfts.request(Canceler.cancel));

  const sendData = {
    creator: author_address,
    per_page: 20,
    page: page
  }

  try {
    const { data } = await Axios.post(`api/supply-assets/user-profile-data`, sendData);
    dispatch(actions.getAuthorCreatedNfts.success(data));
  } catch (err) {
    dispatch(actions.getAuthorCreatedNfts.failure(err));
  }
};

export const fetchAuthorHiddenNfts = (author_address, page) => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken') ;
  const header = { 'Authorization': `Bearer ${accessToken}` } ;
  dispatch(actions.getAuthorHiddenNfts.request(Canceler.cancel));
  const sendData = {
    per_page: 20,
    page: page
  }
  try {
    const { data } = await Axios.post(`api/supply-assets/get-hidden-data`, sendData, { headers: header });
    dispatch(actions.getAuthorHiddenNfts.success(data));
  } catch (err) {
    dispatch(actions.getAuthorHiddenNfts.failure(err));
  }
};

export const fetchAuthorLikedNfts = (author_address, page) => async (dispatch) => {
  dispatch(actions.getAuthorLikedNfts.request(Canceler.cancel));
  const sendData = {
    liked: author_address,
    per_page: 20,
    page: page
  }
  try {
    const { data } = await Axios.post(`api/supply-assets/user-profile-data`, sendData);
    dispatch(actions.getAuthorLikedNfts.success(data));
  } catch (err) {
    dispatch(actions.getAuthorLikedNfts.failure(err));
  }
};

export const fetchAuthorCollectedNfts = (author_address, page) => async (dispatch) => {
  dispatch(actions.getAuthorCollectedNfts.request(Canceler.cancel));
  const sendData = {
    owner: author_address,
    per_page: 20,
    page: page
  }
  try {
    const { data } = await Axios.post(`api/supply-assets/user-profile-data`, sendData);
    dispatch(actions.getAuthorCollectedNfts.success(data));
  } catch (err) {
    dispatch(actions.getAuthorCollectedNfts.failure(err));
  }
};

export const fetchAuthorBidNfts = (author_address, page, perPage) => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken') ;
  const header = { 'Authorization': `Bearer ${accessToken}` } ;
  dispatch(actions.getAuthorBidNfts.request(Canceler.cancel)) ;
  try {
    const sendData = {
      author: author_address,
      per_page: perPage,
      page: page
    };
    if(accessToken) {
      let { data } = await Axios.post(`/api/activity/get-user-history`, sendData, { headers: header }) ;
      dispatch(actions.getAuthorBidNfts.success(data)) ;
    }
    else {
      let { data } = await Axios.post(`/api/activity/get-history`, sendData) ;
      dispatch(actions.getAuthorBidNfts.success(data)) ;
    }
  } catch (err) {
    dispatch(actions.getAuthorBidNfts.failure(err)) ;
  }
};

export const fetchAuthorSellNfts = (author_address) => async (dispatch) => {
  const accessToken = localStorage.getItem('accessToken') ;
  const header = { 'Authorization': `Bearer ${accessToken}` } ;
  dispatch(actions.getAuthorSellNfts.request(Canceler.cancel));
  try {
    const { data } = await Axios.post(`/api/bid/asset-sell-list` ,{owner:author_address} ,{ headers: header });
    dispatch(actions.getAuthorSellNfts.success(data.data));
  } catch (err) {
    dispatch(actions.getAuthorSellNfts.failure(err));
  }
};
