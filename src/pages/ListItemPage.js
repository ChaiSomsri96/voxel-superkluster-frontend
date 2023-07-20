import React, { memo, useEffect, useState } from "react";
import { Title, SubTitle, TabButton, Container, BtnSpan, FaDollarSignIcon, BiTimeIcon } from "./../components/listing/styled-components";
import "./../assets/stylesheets/listing.scss";
import { ReactComponent as BackIconDark } from "./../assets/svg/back_icon_dark.svg";
import { ReactComponent as BackIconLight } from "./../assets/svg/back_icon_light.svg";
import FixedPrice from "./../components/listing/FixedPrice";
import TimedAuction from "./../components/listing/TimedAuction";
import NFTCard from "../components/home/NFTCard";
import { useNavigate } from "@reach/router";
import moment from 'moment';

const ListItemPage = ({ nftId ,colormodesettle, location }) => {
    const navigate = useNavigate();

    const itemDetailData = location?.state?.itemDetailData || null;

    const [tabId, setTabId] = useState('fixed_price');

    const [fixedPriceState, setFixedPriceState] = useState({
        durationId: 1, isReserve: false, reserveAddr: '', isValidReserveAddr: false, amountUSD: '', amountVXL: '',
        isFromDate: moment(),
        isToDate: null
    });

    const [timedAuctionState, setTimedAuctionState] = useState({
        isMethod: 1, amountUSD: '', amountVXL: '', durationId: 1, isFromDate: moment(), isToDate: null
    });

    const handleFixedPriceStateChange = (newState) => {
        setFixedPriceState(newState);
    };

    const handleTimedAuctionStateChange = (newState) => {
        setTimedAuctionState(newState);
    };

    useEffect(() => {
    },[])

    const clickTabItem = (_tabId) => {
        setTabId(_tabId);
    }

    return (
        <Container>
            <div className="list-item-page">
                <div  
                onClick={() => navigate(`/ItemDetail/${nftId}`)}
                style={{display: 'inline-flex', alignItems: 'center', marginBottom: '50px', cursor: 'pointer', flex: '0 0 auto'}}>
                    {
                        colormodesettle.ColorMode ?
                        <BackIconLight /> :
                        <BackIconDark />
                    }

                    <Title>Sell</Title>

                </div>
                
                <div style={{display: 'flex', gap: '100px'}}>
                    <div style={{flexGrow: 1}}>
                        <SubTitle>Type</SubTitle>

                        <div style={{display: 'flex', marginTop: '20px'}}>
                            <TabButton className={`fixed-price-tab ${(tabId === 'fixed_price' && !colormodesettle.ColorMode) ? 'dark-mode-active-btn' : (tabId === 'fixed_price' && colormodesettle.ColorMode) ? 'light-mode-active-btn' : ''}`}
                            onClick={() => clickTabItem('fixed_price')}>
                                <div className="flex-align-center-row-center">
                                    <FaDollarSignIcon />
                                    <BtnSpan>Fixed Price</BtnSpan>
                                </div>
                            </TabButton>
                            <TabButton className={`timed-auction-tab ${(tabId === 'timed_auction' && !colormodesettle.ColorMode) ? 'dark-mode-active-btn' : (tabId === 'timed_auction' && colormodesettle.ColorMode) ? 'light-mode-active-btn' : ''}`}
                            onClick={() => clickTabItem('timed_auction')}>
                                <div className="flex-align-center-row-center">
                                    <BiTimeIcon />
                                    <BtnSpan>Timed Auction</BtnSpan>
                                </div>
                            </TabButton>
                        </div>
                        
                        {
                            tabId === 'fixed_price' && (
                                <FixedPrice 
                                    colormodesettle={colormodesettle} 
                                    itemDetailData={itemDetailData}
                                    state={fixedPriceState}
                                    onStateChange={handleFixedPriceStateChange} />
                        )}

                        {
                            tabId === 'timed_auction' && (
                                <TimedAuction 
                                    colormodesettle={colormodesettle} 
                                    itemDetailData={itemDetailData}
                                    state={timedAuctionState}
                                    onStateChange={handleTimedAuctionStateChange} />
                            )
                        }
                    </div>

                    <div style={{width: '340px'}}>
                        <SubTitle style={{marginBottom: '20px'}}>Item</SubTitle>
                        <NFTCard nft={itemDetailData} margin={0} />
                    </div>
                </div>
            </div>      
        </Container>
    )
}

export default ListItemPage;