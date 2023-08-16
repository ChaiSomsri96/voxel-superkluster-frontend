import React, { memo, useState, useEffect } from 'react';
import TopFilterBar from "./../TopFilterBar";
import LeftFilterBar from "./../LeftFilterBar";
import LeftFilterBarModal from "./../LeftFilterBarModal";
import NftCardsContainer from "./../NftCardsContainer";

const ItemTab = ({ colormodesettle, collectionId }) => {

    const [browserWidth, setBrowserWidth] = useState(window.innerWidth);
    const [isLeftFilterBarVisible, setLeftFilterBarVisibility] = useState(true);
    const [modalLeftFilterBar, setModalLeftFilterBar] = useState(false);

    const [filterData, setFilterData] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);

        const filterStatusParams = [];
        queryParams.forEach((value, key) => {
            if (key.startsWith('filterdata[status]')) {
              filterStatusParams.push(value);
            }
        });
        
        let initialFilterData = {collection: collectionId};
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

    const handleCancel = () => {
        setLeftFilterBarVisibility(false);
    };

    useEffect(() => {
        const handleResize = () => {
            setBrowserWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (browserWidth < 1040) {
            if(!modalLeftFilterBar) {
                setModalLeftFilterBar(true);
                setLeftFilterBarVisibility(false);
            }
        } else {
            if(modalLeftFilterBar) {
                setModalLeftFilterBar(false);
                setLeftFilterBarVisibility(false);
            }
        }
    }, [browserWidth]);

    return (
        <>
            <div>
                <div>
                    <TopFilterBar 
                        colormodesettle={colormodesettle}
                        clickFilterButton={handleToggleLeftFilterBar}
                        onFilter={handleOnFilter}
                        isLeftFilterBarVisible={isLeftFilterBarVisible}
                    />
                </div>
                <div style={{paddingTop: '20px', display: 'flex', gap: '25px'}}>
                    {
                        modalLeftFilterBar ?
                        <LeftFilterBarModal
                            cartPopupOpen={isLeftFilterBarVisible}
                            handleCancel={handleCancel}
                            colormodesettle={colormodesettle}
                            onFilter={handleOnFilter}
                            detail={true}
                        />
                        :
                        <LeftFilterBar 
                            onFilter={handleOnFilter}  
                            colormodesettle={colormodesettle} 
                            isLeftFilterBarVisible={isLeftFilterBarVisible}
                            detail={true} 
                        />
                    }

                    <NftCardsContainer filterData={filterData} isLeftFilterBarVisible={isLeftFilterBarVisible} modalLeftFilterBar={modalLeftFilterBar} />
                </div>
            </div>
        </>
    );
}

export default memo(ItemTab);