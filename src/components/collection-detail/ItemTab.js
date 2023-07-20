import React, { memo, useState, useEffect } from 'react';
import TopFilterBar from "./../TopFilterBar";
import LeftFilterBar from "./../LeftFilterBar";
import NftCardsContainer from "./../NftCardsContainer";

const ItemTab = ({ colormodesettle, collectionId }) => {
    const [isLeftFilterBarVisible, setLeftFilterBarVisibility] = useState(true);
    const [filterData, setFilterData] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const filterStatusParams = [];
        queryParams.forEach((value, key) => {
            if (key.startsWith('filterdata[status]')) {
              filterStatusParams.push(value);
            }
        });
        
        let initialFilterData = {};
        if(filterStatusParams.length > 0) {
            initialFilterData = { ...initialFilterData, sale_type: filterStatusParams}  
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

    const handleToggleLeftFilterBar = () => {
        setLeftFilterBarVisibility(!isLeftFilterBarVisible);
    };

    const handleOnFilter = (_filterData) => {
        setFilterData({...filterData, ..._filterData})
    }

    return (
        <>
            <div>
                <div>
                    <TopFilterBar 
                        colormodesettle={colormodesettle}
                        clickFilterButton={handleToggleLeftFilterBar}
                        onFilter={handleOnFilter} />
                </div>
                <div style={{paddingTop: '20px', display: 'flex', gap: '25px'}}>
                    {
                        isLeftFilterBarVisible && <LeftFilterBar onFilter={handleOnFilter} colormodesettle={colormodesettle} detail={true} />
                    }  
                    <NftCardsContainer filterData={{ ...filterData, collection: collectionId }}  />
                </div>
            </div>
        </>
    );
}

export default memo(ItemTab);