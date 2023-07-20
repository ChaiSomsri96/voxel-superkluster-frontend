import React, { memo, useEffect, useState } from "react";
import { useLocation } from "@reach/router";

import {useSelector, useDispatch } from "react-redux";
import styled from 'styled-components';
import { Pagination } from 'antd';

import * as selectors from "./../store/selectors";
import * as actions from "./../store/actions/thunks";
import { createBrowserHistory } from 'history';

import NftCard from "./../components/NftCard";
import EmptyCard from "./../components/EmptyCard";
import NftCardSmall from './NftCardSmall';
import EmptyCardSmall from './../components/EmptyCardSmall';

const NoDataDiv = styled.div`
  margin: 20px 0px;
  color: grey;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const ColumnNewRedux = ({ filterData }) => {
  let { state } = useLocation();
  let nfts = useSelector(selectors.nftDetailState).data;
  const dispatch = useDispatch();

  const [isLoading, setLoading]=useState(false);
  const [tempArr,setTempArr]= useState([]);
  const [UsdPrice , setUsdPrice]= useState() ;
  const [ethPrice, setEthPrice] = useState(1);
  const [isTotalNum, setTotalNum]=useState(1);
  const [isPageNumber , setPageNumber] = useState(()=>{
    let currentUrlParams = new URLSearchParams(window.location.search);
    let PageCurrent = currentUrlParams.get('PageCurrent') ;
    if(PageCurrent == null || PageCurrent == "" ) return 1 ;
    return JSON.parse(PageCurrent) || 1 ;
  }) ;
  const [isPageSize, setPageSize]=useState(25);
  const [isSearchKey, setSearchKey]=useState('');
  const [isLoginAccount , setLoginAccount] =useState(()=>{
    const saved = localStorage.getItem('account');
    return saved ;
  }) ;
  const account = localStorage.getItem('account');
  const accessToken = localStorage.getItem('accessToken');
  const header = { 'Authorization': `Bearer ${accessToken}` };
  const history = createBrowserHistory();


  const [currentView, setCurrentView] = useState(filterData.current_view);

  useEffect(()=>{
    setSearchKey(localStorage.getItem('searchValue')) ;
  },[localStorage.getItem('searchValue')]) ;

  useEffect(()=>{
    setLoginAccount(localStorage.getItem('account')) ;
  },[localStorage.getItem('account')]) ;

  const [isItemLoading, setItemLoading] = useState(true);

  useEffect(() => {
    if(nfts) {
      let tmp = nfts.data  ;
      setTempArr(tmp) ;
      setEthPrice(nfts.ethUsdPrice);
      localStorage.setItem('usdPrice' , nfts.usdPrice) ;
      if (nfts.meta) {
        setTotalNum(nfts.meta.total)
        setItemLoading(false);
      }
    }
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000);
    return () => clearTimeout(timer);
  }, [state, nfts]);

  useEffect(() => {
    getNftItems(isPageNumber, isPageSize, filterData, isSearchKey) ;
  }, [dispatch, filterData, isPageNumber, isPageSize, isSearchKey,accessToken]);

  useEffect(() => {
    if(isItemLoading) return;
    if(isPageNumber > 1 && isPageNumber > parseInt(isTotalNum / isPageSize) + (isTotalNum % isPageSize)? 1:0) {
      handlePageEvent(1);
    }
  }, [isPageNumber, isPageSize, isTotalNum, isItemLoading])
 
 
  useEffect(() => {
    dispatch(actions.fetchAuthorInfo(account));
  }, [])

  const handlePageEvent = (pageNumber) => {
    let currentUrlParams = new URLSearchParams(window.location.search) ;
    currentUrlParams.set('PageCurrent', pageNumber) ;
    history.push(window.location.pathname + "?" + currentUrlParams.toString()) ;
    setPageNumber(pageNumber) ;
    goToTop() ;
    }

  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize)
  }

  const getNftItems = (pageNumber, pageSize, filterData, searchKey) => {
    let tmp =[] ;
    
    if (filterData.search_val)
    {
      for(let i = 0 ; i < filterData.search_val.length ; i ++){
        if(filterData.search_val[i]=='#') tmp.push('%23');
        else tmp.push(filterData.search_val[i]) ;
      }
    }

    let rlt ="" ;
    
    for(let i = 0 ; i < tmp.length ; i ++) rlt += tmp[i] ;
    
    dispatch(actions.fetchNftDetail(pageNumber, pageSize, filterData, rlt,accessToken,header));
    
    localStorage.setItem('isSearchKey' ,'0') ;
    setLoading(true) ;
  }
  const goToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
  };
  return (
    <div className="row" style={{ padding: 10, justifyContent:'space-between' }}>
      {
        localStorage.setItem('rim' , JSON.stringify(tempArr)) 
      }
     { tempArr && tempArr.length ?
        filterData.current_view == 'detail' ?
          <>
          {
            tempArr.map((nft ,index) => (
              <NftCard
                nft={nft}
                key={index}
                nft_inx={index}
                usd_price = {UsdPrice}
                ethPrice = {ethPrice}
                loadingState={isLoading}
              />
            )) 
          }
          <EmptyCard />
          <EmptyCard />
          <EmptyCard />
          <EmptyCard />
          <EmptyCard />
          <EmptyCard />
          <EmptyCard />
          <EmptyCard />
          <EmptyCard />
          <EmptyCard />
          </>
          :
          <>
            {tempArr.map((nft, index) => (
              <NftCardSmall
                nft={nft}
                key={index}
                ethPrice={ethPrice}
                loadingState={isLoading}
              />
            ))}
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
            <EmptyCardSmall/>
          </>
        : <NoDataDiv>{!isLoading ? 'No NFTs found' : 'Loading NFTs...'}</NoDataDiv>
      }
      <div className="spacer-single"></div>
      <div className="text-center">
        <Pagination showQuickJumper defaultCurrent={1} current={isPageNumber} total={isTotalNum} defaultPageSize={25} pageSizeOptions={[15, 25, 50, 100]} onChange={handlePageEvent} onShowSizeChange={onShowSizeChange} responsive={true} />
      </div>
    </div>
  );
};

export default memo(ColumnNewRedux);
