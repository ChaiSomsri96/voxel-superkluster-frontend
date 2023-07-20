import React, { memo, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from "@reach/router";
import { Button  } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';

import * as selectors from '../store/selectors';
import { Axios } from "../core/axios";

import CollectionCard from './../components/CollectionCard';

const GlobalStyles = createGlobalStyle`
`;

const Div = styled.div`
    align-items: center;
    margin: 5px 0px;
`;

const CreateBtn = styled(Button)`
    margin:5px ;
    width: 180px;
    height: 45px;
    color: white;
    background: #f70dff;
    font-size: 16px;
    font-weight: bold;
    border: 1px solid #f70dff;
    border-radius: 8px;

    &:hover {
        color: white;
        background: #f70dff;
        border: 1px solid #f70dff;
    }

    &:focus {
        color: white;
        background: #f70dff;
        border: 1px solid #f70dff;
    }
`;
const ImportBtn = styled(Button)`
    margin:5px ;
    width: 180px;
    height: 45px;
    color: white;
    background: grey;
    font-size: 16px;
    font-weight: bold;
    border: 1px solid grey !important;
    border-radius: 8px;

    &:hover {
        color: white;
        background: grey;
        border: 1px solid grey !important ;
    }

    &:focus {
        color: white;
        background: grey;
        border: 1px solid grey !important;
    }
`;

const UserCollectionPage = function ({colormodesettle}) {
    const { data } = useSelector(selectors.accessToken);
    const navigate = useNavigate();

    const [isUserCollections, setUserCollections] = useState([]);

    useEffect(() => {
        if(data) {
            getCollections()
        }
    }, [data])

    const getCollections = async () => {
        const header = { 'Authorization': `Bearer ${data}` }
        const result = await Axios.get("/api/users/collections", { headers: header });
        setUserCollections(result.data.data)
    }

    const moveToCreaetCollectionPage = () => {
        navigate("/create-collection");
    }

    const moveToImportCollectionPage = () => {
        navigate("/import-collections");
    }
    
    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
    
      },[])
    return (
        <>
            <div>
                <GlobalStyles />

                <section className='custom-container'>
                    <Div className="row">
                        <Div>
                            <h2 style={{fontFamily:'Inter'}}>My Collections</h2>
                            <Div>
                                <span>Create, curate, and manage collections of unique NFTs to share and sell.</span>
                            </Div>
                        </Div>
                        <div>
                            <CreateBtn onClick={moveToCreaetCollectionPage}>Create collection</CreateBtn>
                            <ImportBtn onClick={moveToImportCollectionPage}>Import collection</ImportBtn>
                        </div>
                    </Div>
                    <div className="row" >
                        {
                            isUserCollections.map((collection) => (
                                <CollectionCard 
                                    key={collection.id}
                                    data={[collection]}
                                    label="user"
                                />
                            ))
                        }
                    </div>
                </section>
            </div>
        </>
    );
}
export default memo(UserCollectionPage);