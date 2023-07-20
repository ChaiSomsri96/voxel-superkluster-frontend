import React, { useState, useEffect, memo } from 'react';
import styled from "styled-components";
import "./../../assets/stylesheets/NFTCard/index.scss";
import defaultNFT from "./../../assets/image/default_nft.jpg"; 
import { ReactComponent as VerifyIcon } from "./../../assets/svg/small_verify.svg";
import { formatUSDPrice } from "./../../utils";
import { navigate } from "@reach/router";
import { FiPlus, FiX } from "react-icons/fi"
import { Axios } from "./../../core/axios";

import { useSelector, useDispatch } from "react-redux";
import * as selectors from "./../../store/selectors";
import * as actions from "./../../store/actions/thunks";

const NFTItem = styled.div`    
    border: 1px solid ${props => props.theme.cardBorderColor};
    border-radius: 10px;
    padding: 10px;
    position: relative;
    top: 0;
    transition: top 0.2s ease-in-out;

    &:hover {
        top: -5px;
    }
`

const CollectinoName = styled.div`
    font-size: 14px;
    line-height: 19px;
    font-weight: 400;
    color: ${props => props.theme.subCaptionColor};
    &:hover {
        filter: ${props => props.theme.linkHoverEffect};
    }
`
const NFTName = styled.div`
    font-size: 17px;
    line-height: 22px;
    font-weight: 800;
    color: ${props => props.theme.primaryColor};

    margin-top: 10px;
`

const SeparateLine = styled.div`
    border-top: 1px solid ${props => props.theme.cardBorderColor};

    margin-top: 10px;
`

const SaleCaption = styled.div`
    color: ${props => props.theme.saleCaptionColor};
    font-size: 15px;
    line-height: 20px;
    font-weight: 500;
`

const SaleInfo = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 16px;
    line-height: 21px;
    font-weight: 400;
`

const NFTImg = styled.div`
    width: 100%;
    aspect-ratio: 16/15;
    background: ${props => props.theme.previewNFTBkColor};
    position: relative;
`

const ToolButton = styled.button`
    height: 40px;
    border: none;
    outline: 0;
    border-radius: 12px;
    color: ${props => props.theme.editProfileBtnColor};
    background: ${props => props.theme.primaryColor};
    font-size: 14px;
    line-height: 14px;
    font-weight: 600;
    padding-left: 15px;
    padding-right: 15px;
    transition: all 0.15s ease-in-out 0s;
    &:hover {
        background: ${props => props.theme.clearAllHover};    
    }
`;

const NFTCard = ({ nft, margin, canPurchase }) => {
    let accessToken = useSelector(selectors.accessToken).data;
    let account = useSelector(selectors.authorAccount).data;

    const header = { 'Authorization': `Bearer ${accessToken}` };

    let cartInfo = useSelector(selectors.cartInfoState).data;
    const dispatch = useDispatch();

    const [hovered, setHovered] = useState(false);
    const [isButtonsVisible, setButtonsVisible] = useState(false);
    const [isAddBtnVisible, setAddBtnVisible] = useState(true);

    useEffect(() => {
        if(cartInfo && cartInfo.data) {
            setAddBtnVisible(!cartInfo.data.some((item) => item.asset.id === nft.id));
        }
        else {
            setAddBtnVisible(true);
        }
    }, [cartInfo]);

    useEffect(() => {
        if(!canPurchase) {
            setButtonsVisible(false);
        }
        else if(!accessToken) {
            setButtonsVisible(true);
        }
        else {
            if (nft.on_sale && nft.sale_type === "1") {
                if ((nft.is_voxel && nft.is_721) || (!nft.is_voxel && nft.collection.is_721)) {
                    setButtonsVisible(nft.owner_of.toLowerCase() !== account.toLowerCase());
                } else if((nft.is_voxel && !nft.is_721) || (!nft.is_voxel && nft.collection.is_1155)) {
                    if (nft.supply_number === 1) {
                        setButtonsVisible(nft.owner_of.toLowerCase() !== account.toLowerCase());
                    } else {
                        setButtonsVisible(true);
                    }
                } else {
                    setButtonsVisible(false);
                }
            } else {
                setButtonsVisible(false);
            }
        }
    }, [accessToken, account]);

    const navigateToDetail = (e) => {
        if(nft && nft.id) {
            window.open(`/ItemDetail/${nft.id}`, '_blank');
        }
    };
    
    const handleCollectionClick = (e) => {
        e.stopPropagation();
        if (nft && nft.collection) {
            navigate(`/collection-detail/${nft.collection.link}`);
        }
    };

    const handleAddCart = async() => {
        if(!accessToken) {
            navigate(`/wallet`);
            return;
        }
        
        const postData = {
            id: nft.id
        };

        try {
            await Axios.post('/api/cart/add-cart', postData, { headers: header });
            dispatch(actions.fetchCartInfo(accessToken));
        }
        catch(e) {
            console.error("handleAddCart Err: ", e);
        }
    }

    const handleRemoveCart = async() => {
        if(!accessToken) {
            navigate(`/wallet`);
            return;
        }

        const postData = {
            id: nft.id
        };

        try {
            await Axios.post('/api/cart/remove-cart', postData, { headers: header });
            dispatch(actions.fetchCartInfo(accessToken));
        }
        catch(e) {
            console.error("handleRemoveCart Err: ", e);
        }
    }

    const buyNow = async() => {
        if(!accessToken) {
            navigate(`/wallet`);
            return;
        }
    }

    return (
        <NFTItem 
            className="nft-card-item"
            style={{
                margin: (margin == undefined ? `0 12px` : `0 ${margin}px`),
                cursor: (nft && nft.id) ? 'pointer' : 'default'
            }}
            onClick={navigateToDetail}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)} 
        >
            <NFTImg>
                {
                    nft ?
                    <img 
                        src={
                            nft.image_preview ? 
                            (
                                nft.image ? (
                                    nft.image.slice(-3).toLowerCase() == "gif" ? 
                                    nft.image 
                                    : 
                                    nft.image_preview
                                )
                                :
                                nft.image_preview
                            ) 
                            : 
                            (nft.image 
                                ? 
                                nft.image 
                                : 
                                (nft.raw_image 
                                    ? 
                                    nft.raw_image 
                                    : 
                                    ( nft.blob_raw_image 
                                        ? 
                                        nft.blob_raw_image 
                                        : 
                                        defaultNFT)))} 
                            className="nft-card-img" 
                            alt="nft-card-img" 
                    />
                    :
                    null 
                }

                {
                    isButtonsVisible ? 
                        <div className="nft-opacity" style={{
                            opacity: hovered ? 1 : 0
                        }}>
                            <div className="button-toolbar">
                                <ToolButton onClick={(e) => { e.stopPropagation(); buyNow(); }}>
                                    Buy Now
                                </ToolButton>
                                {
                                    isAddBtnVisible ?
                                    <ToolButton onClick={(e) => { e.stopPropagation(); handleAddCart(); }}>
                                        <FiPlus />
                                    </ToolButton>
                                    : 
                                    <ToolButton onClick={(e) => { e.stopPropagation(); handleRemoveCart(); }}>
                                        <FiX />
                                    </ToolButton>
                                }
                                
                            </div>
                        </div>
                    :
                    null   
                }
            </NFTImg>

            <div className="nft-card-info">
                    <div className="collection-info">
                            <CollectinoName className="ellipsis"
                            style={{
                                paddingRight: ((nft && nft.collection && nft.collection.verified) ? `16px` : `0px`)
                            }}
                            onClick={handleCollectionClick}>
                                {(nft && nft.collection) ? nft.collection.name : "Collection Name"}
                            </CollectinoName>
                            {
                                nft && nft.collection && nft.collection.verified ? 
                                <div onClick={handleCollectionClick}>
                                    <VerifyIcon></VerifyIcon>
                                </div>
                                : 
                                null 
                            }
                    </div>
                <NFTName className="ellipsis">
                    {(nft && nft.name) ? nft.name : "NFT Name"}
                </NFTName>

                <SeparateLine></SeparateLine>

                <div className="sale-line">
                    <SaleCaption>
                        Price
                    </SaleCaption>

                    <SaleCaption>
                        Highest Bid
                    </SaleCaption>
                </div>
                <div className="sale-line">
                    <SaleInfo>
                        {
                            nft && nft.on_sale ? 
                            `${formatUSDPrice(nft.price)} USD` : "Not for sale" 
                        }
                    </SaleInfo>
                    <SaleInfo>
                        {
                            (!nft || !nft.top_bid) ? "No bids yet"
                            : `${formatUSDPrice(nft.top_bid)} USD`
                        }
                    </SaleInfo>
                </div>
            </div>
        </NFTItem>
    );   
}
export default NFTCard;