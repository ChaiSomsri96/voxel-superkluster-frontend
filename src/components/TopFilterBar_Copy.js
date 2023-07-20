import React, { memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select, Popover, Input } from 'antd';
import styled from 'styled-components';
import { createBrowserHistory } from 'history';

import * as actions from "../store/actions/thunks";
import * as selectors from '../store/selectors';
import { FaDollarSign } from "react-icons/fa";
import { BsGridFill, BsGrid3X3GapFill } from 'react-icons/bs';
import ethIcon from "./../assets/icons/ethIcon.png";
import vxlCurrency from "./../assets/image/vxl_currency.png";

const MainDiv = styled.div`
    display: flex;
    justify-content: space-between;

    @media (max-width: 768px) {
        display: block;
    }
`;

const SubDiv = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;

    @media (max-width: 768px) {
        width: 100%
    }
    
    @media (max-width: 480px) {
        display: block;
    }
`;
const SubDiv1 = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 50%;

    @media (max-width: 768px) {
        width: 100%
    }
    
    @media (max-width: 480px) {
        display: block;
    }
`;

const Div = styled.div`
    width: calc(50% - 20px);
    margin: 0px 10px 0px;

    @media (max-width: 480px) {
        width: calc(100% - 20px);
    }
`;

const StyledSelect = styled(Select)`
    width: 100%;
    border: none !important;
`;

const RangeDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ShowPriceRange = styled(Input)`
    & .ant-input {
        font-size: 14px!important;
        padding: 8px!important;
        cursor: pointer;
        border" none !important;
    }
`;

const TokenImgDiv = styled.div`
    width: 50px;
`;

const TokenSelectDiv = styled.div`
    width: 170px;
    margin-bottom: 10px;
`;
const TokenResetDiv = styled.div`
    width: 70px;
`;
const TokenResetButtonDiv = styled.div`
    width: max-content;
    color: white;
    background: #f70dff;
    font-size: 11px;
    font-weight: bold;
    border-radius: 10px;
    padding: 8px;
    margin-bottom: 5px
`;

const TokenSubDiv = styled.div`
    width: max-content;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    padding: 8px;
    margin-bottom: 5px
`;

const PriceRangeInput = styled(Input)`
    width: 43%;
`;

const BoldSpan = styled.span`
    font-size: 18px;
    font-weight: bold;
    color: #626262'
`;

const Label = styled.label`
    font-size: 12px;
    font-weight: 600;
`;

const TopFilterBar = ({ funcs, filterData, colormodesettle }) => {

    const { Option } = Select;

    const [maxprice , SetMaxprice] = useState(filterData.max_price) ;
    const [maxPriceWarning , SetMaxPriceWarning] = useState(true) ;
    const dispatch = useDispatch();

    const category = useSelector(selectors.categoryState).data;
    const collections = useSelector(selectors.collectionState).data;
    
    const [isHistoryUrl , sethistoryUrl] = useState([{}]) ;
    const history = createBrowserHistory();
    // const history = useHistory()
    const [isDefaultSale , setDefaultSale] =  useState(()=>{
        let currentUrlParams = new URLSearchParams(window.location.search);
        let saleUrl = currentUrlParams.get('saleUrl') ;
        if(saleUrl == null || saleUrl == "" ) return 0 ;
        return JSON.parse(saleUrl) || 0 ;
    }) ;
    const [isDefaultChain , setDefaultChain] =  useState(()=>{
        let currentUrlParams = new URLSearchParams(window.location.search);
        let chainUrl = currentUrlParams.get('chainUrl') ;
        if(chainUrl == null || chainUrl == "" ) return 0 ;
        return JSON.parse(chainUrl) || 0 ;
    }) ;
    const [isDefaultCategory , setDefaultCategory] =  useState(()=>{
        let currentUrlParams = new URLSearchParams(window.location.search) ;
        let categoryUrl = currentUrlParams.get('categoryUrl') ;
        if(categoryUrl == null || categoryUrl == "" ) return "" ;
        return JSON.parse(categoryUrl) || "" ;
    }) ;
    const [isDefaultSort , setDefaultSort] =  useState(()=>{
        let currentUrlParams = new URLSearchParams(window.location.search) ;
        let sortUrl = currentUrlParams.get('OrderUrl') ;
        if(sortUrl == null || sortUrl == "" ) return '' ;
        return JSON.parse(sortUrl) || null ;
    }) ;
    const [isDefaultCurrency , setDefaultCurrency] =  useState(()=>{
        let currentUrlParams = new URLSearchParams(window.location.search) ;
        let currencyUrl = currentUrlParams.get('CurrencyUrl') ;
        if(currencyUrl == null || currencyUrl == "" ) return 2 ;
        return JSON.parse(currencyUrl) || 2 ;
    }) ;
    const [isDefaultPriceTo , setDefaultPriceTo] =  useState(()=>{
        let currentUrlParams = new URLSearchParams(window.location.search) ;
        let PriceToUrl = currentUrlParams.get('PriceToUrl') ;
        if(PriceToUrl == null || PriceToUrl == "" ) return 0 ;
        return JSON.parse(PriceToUrl) || 0 ;
    }) ;
    const [isDefaultPriceFrom , setDefaultPriceFrom] =  useState(()=>{
        let currentUrlParams = new URLSearchParams(window.location.search) ;
        let PriceFromUrl = currentUrlParams.get('PriceFromUrl') ;
        if(PriceFromUrl == null || PriceFromUrl == "" ) return 0 ;
        return JSON.parse(PriceFromUrl) || 0 ;
    }) ;
    const [isPageCurrent , setPageCurrent] = useState(()=>{
        let currentUrlParams = new URLSearchParams(window.location.search);
        let PageCurrent = currentUrlParams.get('PageCurrent') ;
        if(PageCurrent == null || PageCurrent == "" ) return null ;
        return JSON.parse(PageCurrent) || null ;
      }) ;

    const [currentView, setCurrentView] = useState(localStorage.getItem('viewMethod')? localStorage.getItem('viewMethod'):'detail');
    const [isTokenState, setTokenState] = useState(1) ;

    useEffect(() => {
        dispatch(actions.fetchNftCategory())
        dispatch(actions.fetchNftCollections())
    }, [dispatch]);

    useEffect(()=>{
        funcs.setFilterSaleTypeFunc(isDefaultSale) ;
        funcs.setFilterChainTypeFunc(isDefaultChain) ;
        funcs.setFilterCategoryFunc(isDefaultCategory) ;
        funcs.setOrderValueFunc(isDefaultSort) ;
        funcs.setRangeMinValueFunc(isDefaultPriceFrom) ;
        funcs.setRangeMaxValueFunc(isDefaultPriceTo) ;
        funcs.setFilterPriceValueFunc(isDefaultCurrency) ;
        funcs.setPageCurrentFunc(isPageCurrent) ;
        funcs.setCurrentViewFunc(currentView);
    },[]) ;

    const handleCategoryChange = (value) => {
        funcs.setFilterCategoryFunc(value ? value : "") ;
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('categoryUrl', value);
        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }
    const handleSaleTypeChange = (value) => {
        funcs.setFilterSaleTypeFunc(value)
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('saleUrl', value);
        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }
    const handleChainTypeChange = (value) => {
        setPageCurrent(1);
        funcs.setPageCurrentFunc(1);
        funcs.setFilterChainTypeFunc(value)
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('chainUrl', value);
        currentUrlParams.set('PageCurrent', 1) ;
        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }
    const handleOrderChange = (value) => {
        if(value == 0) return;
        funcs.setOrderValueFunc(value ? value : "") ;
        let currentUrlParams = new URLSearchParams(window.location.search);
        currentUrlParams.set('OrderUrl', value);
        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }
    
    const handleCategorySearch = (val) => {
    }
    const handleOrderSearch = (val) => {
    }
    
    const handleCollectionChange = (value) => {
        funcs.setFilterCollectionFunc(value)
    }

    const handleCollectionSearch = (val) => {
    }

    const handleDetailClick = async () => {
        funcs.setCurrentViewFunc('detail');
        setCurrentView('detail');
        // let currentUrlParams = new URLSearchParams(window.location.search);
        // currentUrlParams.set('view', 'detail');
        // history.push(window.location.pathname + "?" + currentUrlParams.toString());
        localStorage.setItem('viewMethod', 'detail');
    }

    const handleTileClick = async () => {
        funcs.setCurrentViewFunc('tile');
        setCurrentView('tile');
        // let currentUrlParams = new URLSearchParams(window.location.search);
        // currentUrlParams.set('view', 'tile');
        // history.push(window.location.pathname + "?" + currentUrlParams.toString());
        localStorage.setItem('viewMethod', 'tile');
    }

    const handleTokenChange = (value) => {
        funcs.setFilterPriceValueFunc(value) ;
        let currentUrlParams = new URLSearchParams(window.location.search) ;
        currentUrlParams.set('CurrencyUrl', value) ;
        history.push(window.location.pathname + "?" + currentUrlParams.toString()) ;
        setTokenState(value)
        setDefaultCurrency(value)
        // console.log(`selected ${value}`);
    }

    const handlePriceRangeFromChange = (e) => {
        let currentUrlParams = new URLSearchParams(window.location.search);
        let fromNum = parseFloat(e.target.value);
        if(isNaN(fromNum)) fromNum = 0;
        funcs.setRangeMinValueFunc(fromNum);
        currentUrlParams.set('PriceFromUrl', fromNum);
        setDefaultPriceFrom(e.target.value);
        if (fromNum > parseFloat(filterData.max_price)) {
            funcs.setRangeMaxValueFunc(fromNum);
            currentUrlParams.set('PriceToUrl', fromNum);
            setDefaultPriceTo(fromNum);

            SetMaxprice(fromNum);
        }
        if (fromNum < 0) {
            funcs.setRangeMinValueFunc(0);
            currentUrlParams.set('PriceFromUrl', 0);
            setDefaultPriceFrom(0);
        }
        history.push(window.location.pathname + "?" + currentUrlParams.toString());

    }
    const ResetRange =()=>{
        let currentUrlParams = new URLSearchParams(window.location.search);
        setDefaultPriceTo(0) ;
        setDefaultPriceFrom(0) ;
        funcs.setRangeMaxValueFunc(0) ;
        funcs.setRangeMinValueFunc(0) ;
        currentUrlParams.set('PriceFromUrl', 0);
        currentUrlParams.set('PriceToUrl', 0);
        history.push(window.location.pathname + "?" + currentUrlParams.toString());

    }
    const handlePriceRangeToChange = (e) => {
        let currentUrlParams = new URLSearchParams(window.location.search);
        let toNum = parseFloat(e.target.value);
        if(isNaN(toNum)) toNum = 0;
        currentUrlParams.set('PriceToUrl', toNum);
        setDefaultPriceTo(e.target.value);
        funcs.setRangeMaxValueFunc(toNum);
        if (toNum < parseFloat(filterData.min_price)) {
            // funcs.setRangeMaxValueFunc(filterData.min_price);
            SetMaxPriceWarning(false) ;
        }else {
            SetMaxPriceWarning(true) ;
        }
        history.push(window.location.pathname + "?" + currentUrlParams.toString());
    }

    const saleTypeOpt = [
        { id: 0, label: 'All' },
        { id: 1, label: 'Buy Now' },
        { id: 2, label: 'Auction' },
        { id: 3, label: 'Has Offers' },
    ];
    
    const chainTypeOpt = [
        { id: 0, label: 'All Chains', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
        { id: 1, label: 'Ethereum', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
        { id: 2, label: 'Polygon', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png' },
        { id: 3, label: 'Arbitrum', logoUrl: 'https://www.xdefi.io/wp-content/uploads/2022/05/logo-9.png' },
        { id: 4, label: 'Binance Smart Chain', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png' },
        { id: 5, label: 'Fantom', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png' },
        { id: 6, label: 'Avalanche', logoUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png' },
    ];

    const orderList =[
        {id:8,label:"Recently created"} ,
        {id:1,label:"Recently listed"} ,
        {id:2,label:"Recently sold"} ,
        {id:3,label:"Lowest price"} ,
        {id:4,label:"Highest price"} ,
        {id:5,label:"Most viewed"} ,
        {id:6,label:"Most popular"} ,
        {id:7,label:"Ending soon"} 
    ]
    const priceRangeTitle = <BoldSpan>Set the price range</BoldSpan>;

    const tokens = [
        { id: 1, label: 'VXL' },
        { id: 2, label: 'USD' },
        { id: 3, label: 'ETH' },
    ];

    const styledImg = {
        width: 16,
        height: 16,
        margin: '-5px 5px 0px'
    }

    const priceRangeDiv = (
        <div style={{ width: 300, height: 120 }}>
            <RangeDiv>
                <TokenSelectDiv>
                    <StyledSelect defaultValue={isDefaultCurrency} onChange={handleTokenChange}>
                        {
                            tokens?.map((token) => (
                                <Option key={token.id} value={token.id}>{token.label}</Option>
                            ))
                        }
                    </StyledSelect>
                </TokenSelectDiv>
                <TokenResetDiv>
                    <TokenResetButtonDiv onClick={ResetRange}>Reset</TokenResetButtonDiv>
                </TokenResetDiv>
            </RangeDiv>
            <RangeDiv>
                <PriceRangeInput onChange={(e) => handlePriceRangeFromChange(e)} value={isDefaultPriceFrom} placeholder='Min' />
                <BoldSpan>to</BoldSpan>
                <PriceRangeInput className={!maxPriceWarning ? "warning_price": "" } onChange={(e) => handlePriceRangeToChange(e)} value={isDefaultPriceTo} placeholder='Max' />
            </RangeDiv>
        </div>
    );

    const showRangeValue = <>{isDefaultCurrency == '1' ? <img src={vxlCurrency} style={{ ...styledImg, margin: '0px 5px' }} /> : isDefaultCurrency == '2' ? <FaDollarSign/>:<img src={ethIcon} style={{ ...styledImg, margin: '0px 5px' }} /> }<span style={{ color: '#d9d9d9', margin: '0px 3px' }}>|</span> </>;
    
    return (
        <MainDiv>
            <SubDiv>
                
                <Div>
                    <Label htmlFor="category">Category</Label>
                    <StyledSelect
                        id="category"
                        showSearch
                        placeholder="Select a category"
                        optionFilterProp="children"
                        defaultValue={isDefaultCategory}
                        onChange={handleCategoryChange}
                        onSearch={handleCategorySearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Option value="">All</Option>
                        {
                            category?.map((item) => (
                                <Option key={item.id} value={item.id}>{item.label}</Option>
                            ))
                        }
                    </StyledSelect>
                </Div>
                <Div>
                    <Label htmlFor="saleType">Status</Label>
                    <StyledSelect id="saleType" defaultValue={isDefaultSale} onChange={handleSaleTypeChange}>
                        
                        {
                            saleTypeOpt?.map((item, index) => (
                                <Option key={index} value={item.id}>{item.label}</Option>
                            ))
                        }
                    </StyledSelect>
                </Div>
                <Div>
                    <Label htmlFor="range">Range</Label>
                    <Popover id="range" placement="bottomRight" title={priceRangeTitle} content={priceRangeDiv} trigger="click">
                        <ShowPriceRange className={!maxPriceWarning ? "warning_price": "" } placeholder="Price" value={isDefaultPriceFrom == 0 && isDefaultPriceTo ==0 ? "" : `${isDefaultPriceFrom} ~ ${isDefaultPriceTo}`} prefix={showRangeValue} readOnly />
                    </Popover>
                    {/* <Popover id="range" placement="bottomRight" title={priceRangeTitle} content={priceRangeDiv} trigger="click">
                        <input placeholder='test for only'/>
                    </Popover> */}
                </Div>
                <Div>
                    <Label htmlFor="chainType">Chain Type</Label>
                    <StyledSelect id="chainType" defaultValue={isDefaultChain} onChange={handleChainTypeChange}>
                        {
                            chainTypeOpt?.map((item, index) => (
                                <Option key={index} value={item.id}>{item.id!=0&&<img src={item.logoUrl} width="20px" className='m-1 pr-1'></img>}{item.label}</Option>
                            ))
                        }
                    </StyledSelect>
                </Div>
            </SubDiv>
            <SubDiv1>
                <Div>
                    <Label htmlFor="sort">Sort</Label>
                    {/* {console.log(isDefaultSort,'isDefaultSort')} */}
                    <StyledSelect
                        id="sort"
                        defaultValue={isDefaultSort}
                        onChange={handleOrderChange}
                        
                        // filterOption={(input, option) =>
                        //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        // }
                    >
                        {/* <Option value={null}>created time</Option> */}
                        {
                            orderList?.map((item) => (
                                <Option key={item.id} value={item.id}>{item.label}</Option>
                            ))
                        }
                    </StyledSelect>
                    {/* <StyledSelect id="saleType" defaultValue={isDefaultSale} onChange={handleSaleTypeChange}>
                        
                        {
                            saleTypeOpt?.map((item, index) => (
                                <Option key={index} value={item.id}>{item.label}</Option>
                            ))
                        }
                    </StyledSelect> */}
                </Div>
                <div className={!colormodesettle.ColorMode? 'card-view-dark':'card-view-light'} style={{margin:'25px 0px auto 10px', borderRadius:'8px', display:'flex', padding:'4px 10px', alignItems:'center', flexShrink:'0', flexGrow:'0', marginRight:'10px', width: '100px', justifyContent:'space-between', maxHeight:'42px'}}>
                    <div style={{cursor:'pointer', padding:'5px 7px', borderRadius:'5px', backgroundColor:currentView == 'detail'? 'rgba(247,13,255, 1)' :''}} onClick={handleDetailClick}><BsGridFill style={{width:'21px', height:'21px', color:'white'}} /></div>
                    <div style={{cursor:'pointer', padding:'5px 7px', borderRadius:'5px', backgroundColor:currentView == 'tile'? 'rgba(247,13,255, 1)' :''}}><BsGrid3X3GapFill style={{width:'21px', height:'21px', color:'white'}} onClick={handleTileClick} /></div>
                </div>
            </SubDiv1>
        </MainDiv>
    )
}

export default memo(TopFilterBar);