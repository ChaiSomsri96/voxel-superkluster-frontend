import React, { memo, useEffect, useState } from "react";
import { useLocation } from "@reach/router";
import { Axios } from "./../core/axios";
import { createBrowserHistory } from 'history';
import styled from 'styled-components';
import { Pagination } from 'antd';
import NFTCard from "./home/NFTCard";
import EmptyCard from "./home/EmptyCard";
import "./../assets/stylesheets/nft_cards_container.scss";

const NoDataDiv = styled.div`
  margin: 20px 0px;
  color: grey;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const NftCardsContainer = ({ filterData, isLeftFilterBarVisible, modalLeftFilterBar }) => {
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` };
    const history = createBrowserHistory();
    
    const [isLoading, setLoading]=useState(false);
    const [tempArr,setTempArr]= useState([]);
    const [totalNum, setTotalNum]=useState(1);
    const [pageNumber , setPageNumber] = useState(()=>{
        const currentUrlParams = new URLSearchParams(window.location.search);
        const pageCurrent = currentUrlParams.get('pagenumber') ;
        if(pageCurrent == null || pageCurrent == "" ) return 1 ;

        if(isNaN(pageCurrent)) return 1;

        return parseInt(pageCurrent) || 1 ;
    });

    const [pageSize, setPageSize]=useState(24);
    const [searchKey, setSearchKey]=useState('');

    useEffect(()=>{
        setSearchKey(localStorage.getItem('searchValue')) ;
    },[localStorage.getItem('searchValue')]) ;

    useEffect(() => {
        getNftItems(pageNumber, pageSize, filterData, searchKey) ;
    }, [filterData, pageNumber, pageSize, searchKey, accessToken]);

    const setURLFilterData = () => {
        let queryParams = new URLSearchParams();
        queryParams.append('pagenumber', pageNumber);

        console.log("setURLFilterData:     ", filterData);

        if(filterData.sale_type && Array.isArray(filterData.sale_type) && filterData.sale_type.length > 0) {
            filterData.sale_type.forEach((item, index) => {
                queryParams.append(`filterdata[status][${index}]`, item);
            });
        }

        if(filterData.category && Array.isArray(filterData.category) && filterData.category.length > 0) {
            filterData.category.forEach((item, index) => {
                queryParams.append(`filterdata[category][${index}]`, item);
            });
        }

        if(filterData.chain && Array.isArray(filterData.chain) && filterData.chain.length > 0) {
            filterData.chain.forEach((item, index) => {
                queryParams.append(`filterdata[chain][${index}]`, item);
            });
        }

        if(filterData.order_type) {
            queryParams.append(`order_type`, filterData.order_type);
        }

        if(filterData.search_value && filterData.search_value.length > 0) {
            queryParams.append(`search_value`, filterData.search_value);
        }

        if(filterData.price_range) {
            if(filterData.price_range.currency_type) {
                queryParams.append(`filterdata[price_range][currency_type]`, filterData.price_range.currency_type);
            }

            if(filterData.price_range.min_price && filterData.price_range.min_price.length > 0) {
                queryParams.append(`filterdata[price_range][min_price]`, filterData.price_range.min_price);
            }

            if(filterData.price_range.max_price && filterData.price_range.max_price.length > 0) {
                queryParams.append(`filterdata[price_range][max_price]`, filterData.price_range.max_price);
            }
        }

        const encodedParams = queryParams.toString(); // Get the encoded query string
        const decodedParams = decodeURIComponent(encodedParams); // Decode the query string

        history.push(window.location.pathname + `?${decodedParams}`);
    }

    const getNftItems = async (pageNumber, pageSize, filterData, searchKey) => {
        setLoading(true);
        try {
            setURLFilterData();

            let result;
            let url = `/api/assets/explorer_assets`;
            
            if(accessToken)
                url = `/api/assets/explorer_user_assets`; 
            
            let requestData = {
                page: pageNumber,
                per_page: pageSize,
                search_key: searchKey !== "" && searchKey !== null ? searchKey : null
            };

            if(filterData && filterData.tab) {
                url = `/api/supply-assets/user-profile-data`;
                requestData[filterData['tab']['key']] = filterData['tab']['value'];
            }

            requestData = {
                ...filterData,
                ...requestData
            }

            if(!accessToken) result = await Axios.post(url, requestData);
            else result = await Axios.post(url, requestData, {headers:header});
            
            if(result.data.data) {
                setTempArr(result.data.data);
            }

            if (result.data.meta) {
                setTotalNum(result.data.meta.total)
            }

            setLoading(false);
        }
        catch (err) {
            setLoading(false);
            
            setTempArr([]);
            setTotalNum(0);

            console.error("get NftData api error: ", err);
        }
    }

    // change pagination state variable
    const handlePageEvent = (_pageNumber) => {

        if(_pageNumber > 1 && _pageNumber > parseInt(totalNum / pageSize) + (totalNum % pageSize) ? 1 : 0) {
            _pageNumber = 1;
        }
        
        setPageNumber(_pageNumber);
        goToTop();
    }

    const onShowSizeChange = (current, pageSize) => {
        setPageSize(pageSize)
    }

    const goToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            <div className="nft-cards-container">
                {
                    isLoading ?
                    <div className={`cards-component ${!modalLeftFilterBar && isLeftFilterBarVisible ? 'filter_on' : 'filter_off'}`}>
                        {
                            Array.from({ length: pageSize }, (_, index) => (
                                <EmptyCard key={index} />
                            ))
                        }
                    </div>
                    : tempArr && tempArr.length  ?
                    <div className={`cards-component ${!modalLeftFilterBar && isLeftFilterBarVisible ? 'filter_on' : 'filter_off'}`}>
                        {
                            tempArr.map((nft ,index) => (
                                <NFTCard key={index} nft={nft} margin={0} canPurchase={true} />
                            ))
                        }
                    </div>
                    :
                    <div>
                        <NoDataDiv>No NFTs found</NoDataDiv>
                    </div>
                }

                <div className="pagination-bar">
                    <Pagination
                        showQuickJumper
                        showSizeChanger
                        defaultCurrent={1} 
                        current={pageNumber} 
                        total={totalNum} 
                        defaultPageSize={60}
                        pageSizeOptions={[60, 120]}
                        onChange={handlePageEvent} 
                        onShowSizeChange={onShowSizeChange} 
                        responsive={true}  />
                </div>
            </div>
        </>
    )
}

export default memo(NftCardsContainer);