import React, { memo, useEffect, useState } from "react";
import { Container, SectionTitle } from "./../components/item-detail/styled-components";
import "./../assets/stylesheets/ItemDetail/index.scss";

import AssetShow from "./../components/item-detail/AssetShow";
import ItemInfo from "./../components/item-detail/ItemInfo";
import ToolBar from "../components/item-detail/ToolBar";
import MoreNft from "../components/item-detail/MoreNft";
import DropdownSection from "../components/item-detail/DropdownSection";

import PriceHistory from "../components/item-detail/PriceHistory";
import Listings from "../components/item-detail/Listings";
import Offers from "../components/item-detail/Offers";
import History from "../components/item-detail/History";
import TabPanel from "../components/item-detail/TabPanel";
import EmptyItemDetail from "../components/item-detail/EmptyItemDetail";

import { ReactComponent as PriceHistoryDarkIcon } from "./../assets/svg/item_detail/price_history_dark.svg";
import { ReactComponent as PriceHistoryLightIcon } from "./../assets/svg/item_detail/price_history_light.svg";

import { ReactComponent as ListingsDarkIcon } from "./../assets/svg/item_detail/listings_dark.svg";
import { ReactComponent as ListingsLightIcon } from "./../assets/svg/item_detail/listings_light.svg";

import { ReactComponent as OffersDarkIcon } from "./../assets/svg/item_detail/offers_dark.svg";
import { ReactComponent as OffersLightIcon } from "./../assets/svg/item_detail/offers_light.svg";

import { ReactComponent as HistoryDarkIcon } from "./../assets/svg/item_detail/history_dark.svg";
import { ReactComponent as HistoryLightIcon } from "./../assets/svg/item_detail/history_light.svg";

import { useSelector, useDispatch } from "react-redux";
import * as selectors from "./../store/selectors";
import * as actions from "./../store/actions/thunks";

const ItemDetailPage = ({ nftId, colormodesettle }) => {

    const dispatch = useDispatch();

    let offerData = useSelector(selectors.nftBidHistoryState).data;
    let itemData = useSelector(selectors.nftDetailInfoState).data;

    const account = localStorage.getItem('account');
    const accessToken = localStorage.getItem('accessToken');

    const header = { 'Authorization': `Bearer ${accessToken}` } ;
    // const [itemData, setItemData] = useState(null);
    const [isSensitive, setIsSensitive] = useState(false);

    const [isPriceHistoryExpand, setPriceHistoryExpand] = useState(true);
    const [isListingsExpand, setListingsExpand] =  useState(false);
    const [isOffersExpand, setOffersExpand] =  useState(false);
    const [isHistoryExpand, setHistoryExpand] =  useState(false);

    useEffect(()=>{
        dispatch(actions.fetchNftDetailInfo(accessToken, header, nftId))
        dispatch(actions.fetchBidHistory({id: nftId}));
    },[dispatch]);

    useEffect(() => {
        if(itemData) {
            if(itemData.on_sale && itemData.sale_type === 1) {
                setListingsExpand(true);
            }
        }
        else {
            setIsSensitive(true);
        }
    }, [itemData]);

    return (
        <Container className="nft-detail-container">
        {
            itemData ?
            <>
                <div className="item-detail-section">
                    <div className="left-side-section">
                        <AssetShow itemData={itemData} colormodesettle={colormodesettle} />
                        <div className="spacing"></div>
                        
                        {
                            /*
                            <div className="nft-name-mobile">
                                <ItemInfo itemData={itemData} colormodesettle={colormodesettle} />
                                <ToolBar itemData={itemData} colormodesettle={colormodesettle} nftId={nftId} />
                                <div className="spacing"></div>
                            </div>
                            */
                        }
                        <TabPanel itemData={itemData} />
                    </div>

                    <div className="right-side-section">
                        <div className="nft-name">
                            <ItemInfo itemData={itemData} colormodesettle={colormodesettle} />
                            <ToolBar itemData={itemData} colormodesettle={colormodesettle} nftId={nftId} />
                            <div className="spacing"></div>
                        </div>
                        
                        <DropdownSection expand={isPriceHistoryExpand} header={<> {colormodesettle.ColorMode ? <PriceHistoryLightIcon /> : <PriceHistoryDarkIcon />}<SectionTitle style={{marginLeft: '18px'}}>Price History</SectionTitle></>}>
                            <PriceHistory nftId={nftId} colormodesettle={colormodesettle} />
                        </DropdownSection>

                        <div className="spacing"></div>
                        <DropdownSection expand={isListingsExpand} header={<> {colormodesettle.ColorMode ? <ListingsLightIcon /> : <ListingsDarkIcon />}<SectionTitle style={{marginLeft: '18px'}}>Listings</SectionTitle></>}>
                            <Listings nftId={nftId} usdPrice={itemData.usdPrice} />
                        </DropdownSection>

                        <div className="spacing"></div>    
                        <DropdownSection 
                            expand={isOffersExpand} 
                            header={<>
                                    {colormodesettle.ColorMode ? <OffersLightIcon /> : <OffersDarkIcon /> }
                                    <SectionTitle style={{marginLeft: '18px'}}>Offers{!offerData || offerData.length === 0 ? null : <div className="badge"><span>{offerData.length}</span></div>}</SectionTitle>
                                    </>}>
                            <Offers nftId={nftId} usdPrice={itemData.usdPrice} />
                        </DropdownSection>    

                        <div className="spacing"></div>    
                        <DropdownSection expand={isHistoryExpand} header={<>{colormodesettle.ColorMode ? <HistoryLightIcon /> : <HistoryDarkIcon /> }<SectionTitle style={{marginLeft: '18px'}}>History</SectionTitle></>}>
                            <History nftId={nftId} />
                        </DropdownSection>
                    </div>
                </div>
                <div className="home-page-container">
                    <MoreNft assetId={nftId} collectionId={itemData.collection.id} />
                </div>
            </>
            :
            <EmptyItemDetail colormodesettle={colormodesettle} />
        }

        </Container>
    );
};

export default memo(ItemDetailPage);