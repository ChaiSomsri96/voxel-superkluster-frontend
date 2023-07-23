import React, { memo, useState, useEffect } from 'react';
import { TimeSpan, DetailSection, SubText, MainPrice, MakeOfferBtn, PTag, 
    FaEditIcon, ImPriceTagsIcon, RemoveIcon } from "./styled-components";
import { ReactComponent as OfferButtonDarkIcon } from "./../../assets/svg/item_detail/offer_button_icon_dark.svg";
import { ReactComponent as OfferButtonLightIcon } from "./../../assets/svg/item_detail/offer_button_icon_light.svg";
import { ReactComponent as CartDarkIcon } from "./../../assets/svg/item_detail/cart_dark.svg";
import { ReactComponent as CartLightIcon } from "./../../assets/svg/item_detail/cart_light.svg";
import { useNavigate } from "@reach/router";
import { usdPriceItemDetailPage, formatUSDPrice, formatSaleEndDate } from "./../../utils";
import { Axios } from './../../core/axios';
import { currencyLogo } from "./../../store/utils";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "./../../store/actions/thunks";
import * as selectors from "./../../store/selectors";

import MakeOfferModal from "./modals/MakeOfferModal";
import CancelListingModal from './modals/CancelListingModal';
import LowerPriceModal from './modals/LowerPriceModal';
import CheckoutModal from './modals/CheckoutModal';

const ToolBar = ({colormodesettle, itemData, nftId}) => {
    const dispatch = useDispatch();

    let cartInfo = useSelector(selectors.cartInfoState).data;

    const navigate = useNavigate();

    const account = localStorage.getItem('account') ;
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` } ;

    const is721 = itemData.is_voxel ? itemData.is_721 : itemData.collection.is_721;
    const isOwner = !account ? false : itemData.owners.some(owner => owner.owner.public_address === account);

    const [ethOption, setEthOption] = useState(false);
    const [isAddBtnVisible, setAddBtnVisible] = useState(true);

    //popup
    const [makeOfferOpen, setMakeOfferOpen] = useState(false);
    const [cancelListingOpen, setCancelListingOpen] = useState(false);
    const [lowerPriceOpen, setLowerPriceOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);

    useEffect(() => {
        if(cartInfo && cartInfo.data) {
            setAddBtnVisible(!cartInfo.data.some((item) => parseInt(item.asset.id) === parseInt(nftId)));
        }
        else {
            setAddBtnVisible(true);
        }
    }, [cartInfo]);

    const makeOffer = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        setMakeOfferOpen(true);
    }

    const handleMakeOfferCancel = () => {
        setMakeOfferOpen(false);
    }

    const cancelListing = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        setCancelListingOpen(true);
    }

    const handleCancelListingCancel = () => {
        setCancelListingOpen(false);
    }

    const triggerLowerPrice = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        setLowerPriceOpen(true);
    }

    const handleLowerPriceCancel = () => {
        setLowerPriceOpen(false);
    }

    const triggerCheckout = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        setCheckoutOpen(true);
    }

    const handleCheckoutCancel = () => {
        setCheckoutOpen(false);
    }

    const addCart = async () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        try {
            const postData = {
                id: nftId
            };
    
            if(isAddBtnVisible) {
                await Axios.post('/api/cart/add-cart', postData, { headers: header });
            }
            else {
                await Axios.post('/api/cart/remove-cart', postData, { headers: header });
            }
            dispatch(actions.fetchCartInfo(accessToken));
        }
        catch(err) {
            console.error("addCart Err: ", err);
        }
    }

    const editNFT = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        navigate(`/create`, { state: { prop: itemData } });
    }

    const sellNFT = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        navigate(`/assets/sell/${nftId}`, { state: { itemDetailData: itemData } });
    }

    return (
        <>
        <DetailSection className="tool-bar">
            {
                itemData.on_sale && itemData.sale_type === 1?
                
                <TimeSpan>
                    Sale ends {formatSaleEndDate(itemData.sale_end_date)}
                </TimeSpan>

                : itemData.on_sale && itemData.sale_type === 2 ?
                <TimeSpan>
                    Auction ends {formatSaleEndDate(itemData.auction_end_date)}
                </TimeSpan>
                :
                null
            }

            {
                itemData.on_sale ?
                <>
                <div className='spacing'></div>
                <SubText>
                    Price
                </SubText>
                <div className='spacing'></div>
                <div className='price'>
                    <MainPrice>
                        {usdPriceItemDetailPage(itemData.price)} USD
                    </MainPrice>

                    <SubText style={{marginLeft: '27px'}}>{formatUSDPrice(parseInt(itemData.price / itemData.usdPrice))} VXL</SubText>
                </div>
                </>
                :
                <div className='not-for-sale'>
                    <img src={currencyLogo(itemData ? itemData.chain_id : null)} alt="currency-logo" width={25}  />
                    <MainPrice>
                        Not for sale
                    </MainPrice>
                </div>
            }

            <div className='spacing'></div>

            {
                is721 && 
                <div className='button-container'>

                    {
                        isOwner && !itemData.on_sale ?
                        <>
                        <button onClick={() => sellNFT()} className='button-style button-width pink-button'>
                            Sell
                        </button> 
                        {
                            itemData.status === 'pending' ?
                            <MakeOfferBtn className='button-style button-width offer-button' onClick={() => editNFT()}>
                                <div className="flex-align-center-row-center">
                                    <FaEditIcon />
                                    <div style={{marginLeft: '15px'}}>Edit</div>
                                </div>
                            </MakeOfferBtn> :
                            <div className='button-width'></div>
                        }
                        </>
                        : isOwner && itemData.on_sale && itemData.sale_type === 1 ?
                        <>
                        <button 
                        className='button-style button-width pink-button' 
                        onClick={() => cancelListing()} 
                        >
                            Cancel listing
                        </button>
                        <MakeOfferBtn 
                        className='button-style button-width offer-button' 
                        onClick={() => triggerLowerPrice()}
                        >
                                <div className="flex-align-center-row-center">
                                    <ImPriceTagsIcon />
                                    <div style={{marginLeft: '15px'}}>Lower price</div>
                                </div>
                        </MakeOfferBtn>
                        </>
                        : isOwner && itemData.on_sale && itemData.sale_type === 2 ?
                        <>
                            <button 
                            className='button-style button-width pink-button'
                            onClick={() => cancelListing()}
                            >
                                Cancel listing
                            </button>
                            <div className='button-width'></div>
                        </>
                        :
                        <>
                                <button  
                                    className='button-style button-width pink-button' 
                                    disabled={itemData.on_sale && itemData.sale_type === 1 ? false : true}
                                    onClick={() => triggerCheckout()}
                                >
                                    Buy Now
                                </button>    
                           
                                <MakeOfferBtn 
                                    className={`button-style button-width offer-button ${itemData.on_sale && itemData.sale_type === 1 ? 'button-make-offer-width' : ''}`}  
                                    onClick={() => makeOffer()}
                                >
                                    <div className="flex-align-center-row-center">
                                        {
                                        colormodesettle.ColorMode ?
                                        <OfferButtonLightIcon />
                                        :
                                        <OfferButtonDarkIcon />
                                        }
                                        <div style={{marginLeft: '15px'}}>Make Offer</div>
                                    </div>
                                </MakeOfferBtn>
                           
                        
                        {
                            itemData.on_sale && itemData.sale_type === 1 ?
                            <MakeOfferBtn className='button-style add-cart-button' onClick={() => addCart()}>
                                {
                                    isAddBtnVisible ?
                                    (
                                        colormodesettle.ColorMode ?
                                        <CartLightIcon />
                                        :
                                        <CartDarkIcon />
                                    )
                                    :
                                    <RemoveIcon />
                                }
                            </MakeOfferBtn>
                            :
                            null   
                        }
                        </>
                    }
                </div>
            }
            
        </DetailSection>

        <MakeOfferModal cartPopupOpen={makeOfferOpen} handleCancel={handleMakeOfferCancel} itemData={itemData} />
        <CancelListingModal cartPopupOpen={cancelListingOpen} handleCancel={handleCancelListingCancel} nftId={nftId}  />
        <LowerPriceModal cartPopupOpen={lowerPriceOpen} handleCancel={handleLowerPriceCancel} itemData={itemData} colormodesettle={colormodesettle} />
        <CheckoutModal cartPopupOpen={checkoutOpen} handleCancel={handleCheckoutCancel} itemData={itemData} colormodesettle={colormodesettle} />
        </>
    )
}

export default memo(ToolBar);