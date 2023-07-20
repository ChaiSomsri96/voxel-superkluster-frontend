import React, { memo } from 'react';
import { Link } from "@reach/router";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styled from "styled-components";
import defaultUser from "./../../assets/image/default_user.png";
import "./../../assets/stylesheets/Home/topSeller.scss";

import { formatUSDPrice } from "./../../utils";

import { ReactComponent as VerifyIcon } from "./../../assets/svg/verify.svg"

const AuthorItem = styled.div`
    @media (min-width: 769px) {
        width : 500px;
    }

    padding: 15px 22px;
    
    display: flex;
    align-items: center;

    border-radius: 12px;
    border: 1px solid ${props => props.theme.cardBorderColor};
    background: ${props => props.theme.AuthorItemBgColor};

    position: relative;
    top: 0;
    transition: top 0.2s ease-in-out;

    &:hover {
        top: -5px;
    }
`

const Number = styled.span`
    font-size: 17px;
    font-weight: 400;
    line-height: 22px;
    color: ${props => props.theme.primaryColor};
`
const AuthorLogo = styled.div`
    width: 60px;
    height: 60px;
    margin: 0px 22px;
    position: relative;
`
const AuthorInfo = styled.div`
    overflow: hidden;
`
const AuthorName = styled.div`
    font-size: 17px;
    line-height: 22px;
    font-weight: 400;
    color: ${props => props.theme.primaryColor};

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const TotalSales = styled.div`
    display: flex;
    margin-top: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const Title = styled.div`
    font-size: 14px;
    line-height: 19px;
    font-weight: 400;
    color: ${props => props.theme.secondValueColor};
`

const Value = styled.div`
    font-size: 14px;
    line-height: 19px;
    font-weight: 500;
    color: ${props => props.theme.primaryColor};

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`
//sellerVerified
const UserTopSeller = ({ user, number }) => {

    return (
        <div>
            <Link to={`/author/${user.sellerAddress}`}>
                <AuthorItem className="author-item">
                    <Number>{number}.</Number>
                    <AuthorLogo>
                        <LazyLoadImage src={user && user.sellerAvatar ? user.sellerAvatar : defaultUser} alt="" width='100%' height='100%' className="top-seller-avatar"/>
                        {
                            user.sellerVerified ?
                            <VerifyIcon className="verify-icon" />
                            :
                            null
                        }
                    </AuthorLogo>
                    <AuthorInfo>
                        <AuthorName>
                            {user && user.sellerName ? user.sellerName : "unnamed"}
                        </AuthorName>
                       
                        <TotalSales>
                            <Title>Total Sales: &nbsp;</Title>
                            <Value>{formatUSDPrice(user.sellerSaleUsdSum)} USD</Value>
                        </TotalSales>
                       
                    </AuthorInfo>
                </AuthorItem>
            </Link>
        </div>
    );
};

export default memo(UserTopSeller);