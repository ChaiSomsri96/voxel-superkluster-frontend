import React, { memo, useState, useEffect } from "react";
import styled from "styled-components";

import { Axios } from "./../../core/axios";
import UserTopSeller from './UserTopSeller';

const TopSellerPad = styled.div`
    display: grid;
    justify-content: center;
    padding-top: 25px;

    grid-template-columns: repeat(3, auto);
    grid-gap: 15px;

    
    @media (max-width: 1620px) {
        grid-template-columns: repeat(2, auto);
    }
    @media (max-width: 1100px) {
        grid-template-columns: repeat(1, auto);
    }
    @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, minmax(calc((100% - 0px) / 1), 1fr));
    }
`

const AuthorList = () => {

    const [isTopSellers, setTopSellers] = useState([]);

    const getTopSellers = async () => {
        const { data } = await Axios.post("/api/users/top-sellers");
        const authors = data;

        if(authors && authors.data) {
            setTopSellers(authors.data);
            localStorage.setItem('usePrice', authors.data.usdPrice);
        }
    }

    useEffect(() => {
        getTopSellers();
    }, []);

    return (
        <TopSellerPad>
            { 
            isTopSellers && isTopSellers.length > 0 ?
            
            isTopSellers && isTopSellers.map((author, index) => (
                <UserTopSeller user={author} key = {index} number={index + 1}/>
            ))

            : null
            
            }
        </TopSellerPad>
    );
};

export default memo(AuthorList);