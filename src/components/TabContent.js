import React, { useState, useEffect } from "react";
import { Pagination } from 'antd';
import styled from 'styled-components';

import CollectionCard from './CollectionCard';
import { Axios } from "./../core/axios";

const NoDataDiv = styled.div`
  margin: 20px 0px;
  color: grey;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const TabContent = ({ tabId }) => {
    const account = localStorage.getItem('account');
    const [isCollectionData, setCollectionData] = useState([]);
    const [isTotalNum, setTotalNum]=useState(1);
    const [isPageNumber, setPageNumber]=useState(1);
    const [isPageSize, setPageSize]=useState(24);

    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` };

    useEffect(() => {
        getCollectionData(isPageNumber, isPageSize)
    }, [tabId,isPageNumber])

    const getCollectionData = async (pageNum, pageSize) => {
        let result;
        if(!account) result = await Axios.get(`/api/collections?page=${pageNum}&per_page=${pageSize}`);
        else result = await Axios.get(`/api/collections/user_collections?page=${pageNum}&per_page=${pageSize}`, { headers: header });
        const collections = result.data;
        const collectionsData = collections.data;
        const collectionsMeta = collections.meta;
        if (tabId === 0) {
            setCollectionData(collectionsData);
            if (collectionsMeta) {
                setTotalNum(collectionsMeta.total)
            }
        } else {
            const datas = collectionsData.filter((collection) => (collection.category && collection.category.id && tabId == collection.category.id));
            setCollectionData(datas);
        }
    }

    const handlePageEvent = (pageNumber) => {
        setPageNumber(pageNumber)
    }

    const onShowSizeChange = (current, pageSize) => {
        setPageSize(pageSize)
    }

    return (
        <div className="row" style={{ padding: '0px 10px'}}>
            {
                isCollectionData && isCollectionData.length > 0 ?
                    isCollectionData.map((data) => (
                        <CollectionCard 
                            key={data.id}
                            data={[data]}
                            label="all"
                        />
                    ))
                : <NoDataDiv>No NFT collections found</NoDataDiv>
            }
            <div className="spacer-single"></div>
            <div className="text-center">
                <Pagination showQuickJumper defaultCurrent={1} total={isTotalNum} defaultPageSize={25} pageSizeOptions={[15, 25, 50, 100]} onChange={handlePageEvent} onShowSizeChange={onShowSizeChange} />
            </div>
        </div>
    )

}

export default TabContent;