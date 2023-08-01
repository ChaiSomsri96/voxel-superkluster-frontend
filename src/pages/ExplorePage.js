import React, { useState , useEffect} from 'react' ;
import styled from "styled-components";
import { useLocation } from "@reach/router";

import TopFilterBar from "./../components/TopFilterBar";
import LeftFilterBar from "./../components/LeftFilterBar";
import NftCardsContainer from "./../components/NftCardsContainer";

import "./../assets/stylesheets/Explore/index.scss";

const Container = styled.div`
  background-color: ${props => props.theme.primBgColor};
  padding-top: 100px;
  padding-bottom: 100px;
`;

const ExplorePage = ({colormodesettle}) => {

  let location = useLocation();
  const { value } = location.state ? location.state : '';

  const [isLeftFilterBarVisible, setLeftFilterBarVisibility] = useState(true);
  const [filterData, setFilterData] = useState(() => {
    const queryParams = new URLSearchParams(window.location.search);
    
    const filterStatusParams = [];
    queryParams.forEach((value, key) => {
      if (key.startsWith('filterdata[status]')) {
        filterStatusParams.push(value);
      }
    });
    const filterCategoryParams = [];
    queryParams.forEach((value, key) => {
      if (key.startsWith('filterdata[category]')) {
        filterCategoryParams.push(parseInt(value));
      }
    });
    const filterChainParams = [];
    queryParams.forEach((value, key) => {
      if (key.startsWith('filterdata[chain]')) {
        filterChainParams.push(value);
      }
    });

    let initialFilterData = {};

    if(filterStatusParams.length > 0) {
      initialFilterData = { ...initialFilterData, sale_type: filterStatusParams}  
    }

    if(filterCategoryParams.length > 0) {
      initialFilterData = { ...initialFilterData, category: filterCategoryParams}
    }

    if(filterChainParams.length > 0) {
      initialFilterData = { ...initialFilterData, chain: filterChainParams}
    }

    let priceRangeParams = null;
    let priceValueParam = queryParams.get('filterdata[price_range][currency_type]');
    if(priceValueParam) {
      priceRangeParams = {currency_type: parseInt(priceValueParam)};

      priceValueParam = queryParams.get('filterdata[price_range][min_price]');
      priceRangeParams = {...priceRangeParams, min_price: (priceValueParam ? priceValueParam : '')};

      priceValueParam = queryParams.get('filterdata[price_range][max_price]');
      priceRangeParams = {...priceRangeParams, max_price: (priceValueParam ? priceValueParam : '')};
    }

    if(priceRangeParams) {
      initialFilterData = { ...initialFilterData, price_range: priceRangeParams};
    }

    priceValueParam = queryParams.get('order_type');

    if(priceValueParam) {
      initialFilterData = { ...initialFilterData, order_type: parseInt(priceValueParam) };
    }

    priceValueParam = queryParams.get('search_value');

    if(priceValueParam) {
      initialFilterData = { ...initialFilterData, search_value: priceValueParam };
    }

    return initialFilterData;
  });

  const [isSearchValue , setSearchValue] = useState(()=>{
    if(localStorage.getItem('isSearchKey') == '1') return value ;
    return '' ;
  });

  const handleToggleLeftFilterBar = () => {
    setLeftFilterBarVisibility(!isLeftFilterBarVisible);
  };

  const handleOnFilter = (_filterData) => {
    setFilterData({...filterData, ..._filterData})
  }

  useEffect(()=>{
    return ()=>{
      setSearchValue('');
    }
  },[]) ;

  return (
    <Container>
      <div className="main-container">
        <section className='explore-banner label-center'>
          <div className='banner-label'>
            Explore
          </div>
        </section>
        <div style={{paddingTop: '50px'}}>
          <TopFilterBar 
            colormodesettle={colormodesettle}
            clickFilterButton={handleToggleLeftFilterBar}
            onFilter={handleOnFilter}
             />
        </div>
        <div style={{paddingTop: '20px', display: 'flex', gap: '25px'}}>
          { isLeftFilterBarVisible && <LeftFilterBar onFilter={handleOnFilter}  colormodesettle={colormodesettle} /> }
          <NftCardsContainer filterData={filterData} isLeftFilterBarVisible={isLeftFilterBarVisible} />
        </div>
      </div>
    </Container>
  )
}

export default ExplorePage;