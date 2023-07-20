import React, { useState , useEffect} from 'react' ;
import ColumnNewRedux from "./../components/ColumnNewRedux";
import styled, { createGlobalStyle } from 'styled-components' ;
import TopFilterBar from './../components/TopFilterBar' ;
import { useLocation } from "@reach/router";

const GlobalStyles = createGlobalStyle`
`;

const StyledSection = styled.section`
  padding-top: 25px;
  margin-top: 20px;
  padding-bottom:0px ;

  @media (max-width: 767px) {
    margin-top: 60px;
  }
`;

const ExplorePage = ({colormodesettle}) => {

  let location = useLocation();
  const { value } = location.state ? location.state : '';
  
  const [isSearchValue , setSearchValue] = useState(()=>{
     if(localStorage.getItem('isSearchKey')== '1') return value ;
     return '' ;
  }) ;

  useEffect(()=>{
  },[]) ;

  useEffect(()=>{
    return ()=>{
      setSearchValue('');
    }
  },[]) ;

  const [isFilterCategory, setFilterCategory] = useState(()=>{
    let currentUrlParams = new URLSearchParams(window.location.search);
    let categoryUrl = currentUrlParams.get('categoryUrl') ;
    if(categoryUrl == null || categoryUrl == "" ) return "" ;
    return JSON.parse(categoryUrl) || "" ;
  }) ;
  const [isFilterCollection, setFilterCollection] = useState([]);
  const [isFilterSaleType, setFilterSaleType] = useState(()=>{
    let currentUrlParams = new URLSearchParams(window.location.search);
    let saleUrl = currentUrlParams.get('saleUrl') ;
    if(saleUrl == null || saleUrl == "" ) return 0 ;
    return JSON.parse(saleUrl) || 0 ;
  }) ;
  const [isFilterChainType, setFilterChainType] = useState(()=>{
    let currentUrlParams = new URLSearchParams(window.location.search);
    let chainUrl = currentUrlParams.get('chainUrl') ;
    if(chainUrl == null || chainUrl == "" ) return 0 ;
    return JSON.parse(chainUrl) || 0 ;
  }) ;
  const [isRangeMinValue, setRangeMinValue] = useState(()=>{
    let currentUrlParams = new URLSearchParams(window.location.search);
    let PriceFromUrl = currentUrlParams.get('PriceFromUrl') ;
    if(PriceFromUrl == null || PriceFromUrl == "" ) return 0 ;
    return JSON.parse(PriceFromUrl) || 0 ;
  }) ;
  const [isRangeMaxValue, setRangeMaxValue] = useState(()=>{
    let currentUrlParams = new URLSearchParams(window.location.search);
    let PriceToUrl = currentUrlParams.get('PriceToUrl') ;
    if(PriceToUrl == null || PriceToUrl == "" ) return 0 ;
    return JSON.parse(PriceToUrl) || 0 ;
  }) ;
  const [isFilterPriceValue , setFilterPriceValue] = useState(()=>{
    let currentUrlParams = new URLSearchParams(window.location.search);
    let currencyUrl = currentUrlParams.get('CurrencyUrl') ;
    if(currencyUrl == null || currencyUrl == "" ) return 2 ;
    return JSON.parse(currencyUrl) || 2 ;
  }) ;
  const [isOrderValue , setOrderValue] = useState(()=>{
    let currentUrlParams = new URLSearchParams(window.location.search);
    let sortUrl = currentUrlParams.get('OrderUrl') ;
    if(sortUrl == null || sortUrl == "" ) return null ;
    return JSON.parse(sortUrl) || null ;
  }) ;
  const [isPageCurrent , setPageCurrent] = useState(()=>{
    let currentUrlParams = new URLSearchParams(window.location.search);
    let PageCurrent = currentUrlParams.get('PageCurrent') ;
    if(PageCurrent == null || PageCurrent == "" ) return null ;
    return JSON.parse(PageCurrent) || null ;
  }) ;

  const [currentView, setCurrentView] = useState(localStorage.getItem('viewMethod')? localStorage.getItem('viewMethod'):'detail');

  const funcs = {
    setFilterCategoryFunc: (category) => {
      setFilterCategory(category)
    },
    setFilterCollectionFunc: (collection) => {
      setFilterCollection(collection)
    },
    setOrderValueFunc: (order) => {
      setOrderValue(order)
    },
    setFilterPriceValueFunc: (priceType) => {
      setFilterPriceValue(priceType)
    },
    setFilterSaleTypeFunc: (saleType) => {
      setFilterSaleType(saleType)
    },
    setFilterChainTypeFunc: (chainType) => {
      setFilterChainType(chainType)
    },
    setRangeMinValueFunc: (minValue) => {
      setRangeMinValue(minValue)
    },
    setRangeMaxValueFunc: (maxValue) => {
      setRangeMaxValue(maxValue)
    },
    setPageCurrentFunc: (pageCurrent) => {
      setPageCurrent(pageCurrent)
    },
    setCurrentViewFunc: (currentView) => {
      setCurrentView(currentView);
    }
  }

  const filterData = {
    sale_type : isFilterSaleType ,
    collection : isFilterCollection ,
    category : isFilterCategory ,
    min_price : isRangeMinValue ,
    max_price : isRangeMaxValue ,
    price_type : isFilterPriceValue ,
    order_type : isOrderValue ,
    search_val : isSearchValue ,
    chain_url : isFilterChainType ,
    page_current : isPageCurrent ,
    current_view: currentView
  }

  return (
    <>
      <div>
        <GlobalStyles />
          <section id="section-explore" className='jumbotron breadcumb no-bg text-light backgroundBannerStyleExplore' style={{backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'right center'}}>
            <div className='mainbreadcumb'>
              <div className='custom-container'>
                <div className='row m-10-hor'>
                  <div className='col-12 text-center'>
                    <h1 className='text-center' style={{textShadow:'2px 2px 2px rgba(0,0,0,.5)', fontFamily:'Inter'}}>Explore</h1>
                  </div>
                </div>
              </div>
            </div>
          </section>
        <StyledSection className='custom-container'>
          <section className='' style={{ paddingTop: 50}}>
            <div className='row'>
              <div className='col-lg-12'>
                <TopFilterBar funcs={funcs} filterData={filterData} colormodesettle = {colormodesettle} />
              </div>
            </div>
            <ColumnNewRedux filterData={filterData} />
          </section>
        </StyledSection>
      </div>
    </>
  )
}
export default ExplorePage;