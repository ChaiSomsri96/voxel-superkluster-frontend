import React, { useEffect } from "react";
import styled from "styled-components";
import "./../../assets/stylesheets/Wallet/index.scss";

const WalletName = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 20px;
    line-height: 25px;
    font-weight: 700;
    margin-bottom: 10px;
    transition: .3s;
`

const WalletDesc = styled.div`
    color: ${props => props.theme.ExpolerCollectionSubTxt};

    font-size: 16px;
    line-height: 21px;
    font-weight: 400;
`

const WalletItem = styled.div`
    padding: 30px;
    background: ${props => props.theme.collectionBgc};
    border: 1px solid rgba(0,0,0,.2);
    border-radius: 20px;
    box-shadow: 1px 1px 8px 1px rgb(0 0 0 / 10%);

    cursor: pointer;
    
    &:hover {
        background: ${props => props.theme.walletCardHoverColor};
    }
`

const WalletCard = (props) => {
    return (
        <WalletItem onClick={props.onClick}>
            <img src={props.item.icon} alt={props.item.alt} className="wallet-icon" />
            
            <WalletName>
                { props.item.name }
            </WalletName>

            <WalletDesc>
                { props.item.description }
            </WalletDesc>
        </WalletItem>
    );
}

export default WalletCard;