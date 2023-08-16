import React, { memo, useState, useEffect } from 'react';
import TopFilterBar from "./../TopFilterBar";
import LeftFilterBar from "./../LeftFilterBar";
import LeftFilterBarModal from "./../LeftFilterBarModal";
import NftCardsContainer from "./../NftCardsContainer";

const CollectedTab = ({ colormodesettle, tab, author }) => {
    
    const [browserWidth, setBrowserWidth] = useState(window.innerWidth);
    const [isLeftFilterBarVisible, setLeftFilterBarVisibility] = useState(true);
    const [modalLeftFilterBar, setModalLeftFilterBar] = useState(false);

    const [filterData, setFilterData] = useState({tab: { key: tab, value: author }});

    const handleToggleLeftFilterBar = () => {
        setLeftFilterBarVisibility(!isLeftFilterBarVisible);
    };

    const handleOnFilter = (_topFilterData) => {
        setFilterData({...filterData, ..._topFilterData})
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
                            author={true}
                        />
                        :
                        <LeftFilterBar
                            onFilter={handleOnFilter}  
                            colormodesettle={colormodesettle} 
                            isLeftFilterBarVisible={isLeftFilterBarVisible}
                            author={true}
                        />
                    }

                    <NftCardsContainer filterData={filterData} isLeftFilterBarVisible={isLeftFilterBarVisible} modalLeftFilterBar={modalLeftFilterBar} />
                </div>
            </div>
        </>
    );
}

export default memo(CollectedTab);