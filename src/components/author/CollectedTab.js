import React, { memo, useState, useEffect } from 'react';
import TopFilterBar from "./../TopFilterBar";
import LeftFilterBar from "./../LeftFilterBar";
import NftCardsContainer from "./../NftCardsContainer";

const CollectedTab = ({ colormodesettle, tab, author }) => {
    
    const [isLeftFilterBarVisible, setLeftFilterBarVisibility] = useState(true);
    const [filterData, setFilterData] = useState({});

    const handleToggleLeftFilterBar = () => {
        setLeftFilterBarVisibility(!isLeftFilterBarVisible);
    };

    const handleOnFilter = (_topFilterData) => {
        setFilterData({...filterData, ..._topFilterData})
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
                        isLeftFilterBarVisible && <LeftFilterBar onFilter={handleOnFilter} colormodesettle={colormodesettle} author={true} /> 
                    }
                    <NftCardsContainer filterData={{ ...filterData, tab: { key: tab, value: author } }} />
                </div>
            </div>
        </>
    );
}

export default memo(CollectedTab);