import React, { useState, useEffect } from "react";
import {useSelector, useDispatch } from "react-redux";
import styled, { createGlobalStyle } from 'styled-components';
import { Tabs } from 'antd';

import * as selectors from "./../store/selectors";
import * as actions from "./../store/actions/thunks";
import TabContent from './../components/TabContent';

const GlobalStyles = createGlobalStyle`
`;

const ExploreCollectionPage = ({colormodesettle}) => {
    const dispatch = useDispatch();
    const {data} = useSelector(selectors.categoryState);

    const { TabPane } = Tabs;

    const [isCategories, setCategories] = useState([]);

    useEffect(() => {
        dispatch(actions.fetchNftCategory())
    }, [dispatch]);

    useEffect(() => {
        if (data && data.length > 0) {
            setCategories(data)
        }
    }, [data])
    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
    
      },[])
    return (
        <>
            <div>
                <GlobalStyles />

                <section className='jumbotron breadcumb no-bg backgroundBannerStyleExploreCollection' style={{backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'left center'}}>
                    <div className='mainbreadcumb'>
                        <div className='custom-container'>
                            <div className='row m-10-hor'>
                                <div className='col-12'>
                                    <h1 className='text-center' style={{textShadow: 'rgb(0 0 0 / 50%) 2px 2px 2px', fontFamily:'Inter'}}>Explore Collections</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='custom-container' style={{ paddingTop: 50, paddingBottom: 60 }}>
                    <div className="row">
                        <Tabs defaultActiveKey="1" tabPosition="top" centered>
                            <TabPane tab="All">
                                <TabContent tabId={0}></TabContent>
                            </TabPane>
                            {
                                isCategories.map((category) => (
                                    <TabPane key={category.id} tab={category.label}>
                                        <TabContent 
                                            tabId={category.id}
                                        />
                                    </TabPane>
                                ))
                            }
                        </Tabs>
                    </div>
                </section>
            </div>
        </>
    )

}

export default ExploreCollectionPage;