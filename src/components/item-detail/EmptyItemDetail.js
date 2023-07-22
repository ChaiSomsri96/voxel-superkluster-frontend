import React, { memo, useState, useEffect } from 'react';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import styled from "styled-components";
import { TabPanelDiv, SectionTitle, DetailSection, DetailsText,
    SubText, AttrDiv, AttrText, TimeSpan, MainPrice, MoreColTitle } from "./styled-components";

import ContractAddressIcon from "./../../assets/svg/item_detail/contract_address.svg";
import TokenIdIcon from "./../../assets/svg/item_detail/token_id.svg";
import TokenStandardIcon from "./../../assets/svg/item_detail/token_standard.svg";
import BlockchainIcon from "./../../assets/svg/item_detail/blockchain.svg";

import { ReactComponent as CategoryLightIcon } from "./../../assets/svg/item_detail/category_name_light.svg";
import { ReactComponent as CategoryDarkIcon } from "./../../assets/svg/item_detail/category_name_dark.svg";

import { ReactComponent as EyeLightIcon } from "./../../assets/svg/item_detail/eye_light.svg";
import { ReactComponent as EyeDarkIcon } from "./../../assets/svg/item_detail/eye_dark.svg";

import { ReactComponent as HeartLightIcon } from "./../../assets/svg/item_detail/heart_light.svg";
import { ReactComponent as HeartDarkIcon } from "./../../assets/svg/item_detail/heart_dark.svg";
import DropdownSection from "./DropdownSection";

import { ReactComponent as PriceHistoryDarkIcon } from "./../../assets/svg/item_detail/price_history_dark.svg";
import { ReactComponent as PriceHistoryLightIcon } from "./../../assets/svg/item_detail/price_history_light.svg";

import { ReactComponent as ListingsDarkIcon } from "./../../assets/svg/item_detail/listings_dark.svg";
import { ReactComponent as ListingsLightIcon } from "./../../assets/svg/item_detail/listings_light.svg";

import { ReactComponent as OffersDarkIcon } from "./../../assets/svg/item_detail/offers_dark.svg";
import { ReactComponent as OffersLightIcon } from "./../../assets/svg/item_detail/offers_light.svg";

import { ReactComponent as HistoryDarkIcon } from "./../../assets/svg/item_detail/history_dark.svg";
import { ReactComponent as HistoryLightIcon } from "./../../assets/svg/item_detail/history_light.svg";

import NoData from './NoData';

const AssetShow = styled.div`
    aspect-ratio: 1;
`;

const EmptyItemDetail = ({colormodesettle}) => {
    return (
        <div className="item-detail-section">
            <div className="left-side-section">

                <div className='nft-name-mobile'>
                    <div style={{width: '100%'}}>  {/* need to change in mobile */}
                        <SkeletonTheme color="#eee" highlightColor="#ccc" height="32px">
                            <Skeleton count={1} />
                        </SkeletonTheme>
                    </div>
                    <div className='spacing'></div>
                </div>
                <AssetShow>
                    <SkeletonTheme color="#eee" highlightColor="#ccc" height="100%">
                        <Skeleton count={1} />
                    </SkeletonTheme>
                </AssetShow>
                <div className="spacing"></div>

                {/* add for mobile */}
                <div className="nft-name-mobile">
                    <>
                        <div className='owner-ship-skeleton'>
                            <div className="flex-align-center">
                                <div style={{marginRight: '15px'}}>
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="50px" height="50px" borderRadius="50%">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </div>

                                <div>
                                    <SubText>Owner</SubText>
                                    <div style={{marginTop: '10px'}}>
                                        <SkeletonTheme color="#eee" highlightColor="#ccc" width="120px" height="16px">
                                            <Skeleton count={1} />
                                        </SkeletonTheme>
                                    </div>
                                </div>
                            </div> 

                            <div className="flex-align-center">
                                <div style={{marginRight: '15px'}}>
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="50px" height="50px" borderRadius="50%">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </div>

                                <div>
                                    <SubText>Collection</SubText>
                                    <div style={{marginTop: '10px'}}>
                                        <SkeletonTheme color="#eee" highlightColor="#ccc" width="120px" height="16px">
                                            <Skeleton count={1} />
                                        </SkeletonTheme>
                                    </div>
                                </div>
                            </div>    
                        </div>
                        <AttrDiv>
                            <div className='flex-align-center'>
                                {
                                    colormodesettle.ColorMode ? 
                                    <CategoryLightIcon />
                                    :
                                    <CategoryDarkIcon />
                                }

                                <AttrText className="attr-text">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="40px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </AttrText>
                            </div>

                            <div className='flex-align-center'>
                                {
                                    colormodesettle.ColorMode ?
                                    <EyeLightIcon /> 
                                    :
                                    <EyeDarkIcon />
                                }
                                <AttrText className="attr-text">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="40px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </AttrText>
                            </div>

                            <div className='flex-align-center'>
                                {
                                    colormodesettle.ColorMode ?
                                    <HeartLightIcon />
                                    :
                                    <HeartDarkIcon />
                                }

                                <AttrText className="attr-text">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="40px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </AttrText>
                            </div>
                        </AttrDiv>
                    </>
                    <DetailSection className="tool-bar">
                        <TimeSpan>
                            <SkeletonTheme color="#eee" highlightColor="#ccc" width="40%">
                                <Skeleton count={1} />
                            </SkeletonTheme>
                        </TimeSpan>

                        <div className='spacing'></div>
                        
                        <SubText>
                            <SkeletonTheme color="#eee" highlightColor="#ccc" width="50px">
                                <Skeleton count={1} />
                            </SkeletonTheme>
                        </SubText>

                        <div className='spacing'></div>

                        <div className='price'>
                            <MainPrice>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" width="100px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </MainPrice>

                            <SubText style={{marginLeft: '27px'}}>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" width="80px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </SubText>
                        </div>

                        <div className='spacing'></div>

                        <div style={{display: 'flex', gap: '20px'}}>
                            <div style={{flex: 1}}>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" height="62px" borderRadius="6px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                            <div style={{flex: 1}}>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" height="62px" borderRadius="6px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>

                            <div style={{width: '62px'}}>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" height="62px" borderRadius="6px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                        </div>
                    </DetailSection>

                    <div className="spacing"></div>
                </div>
                {/* ---- */}

                <div>
                    <TabPanelDiv className="tab-panel-div">
                        <button className='active'>Overview</button>
                        <button>Properties</button>
                    </TabPanelDiv>
                    <div className="spacing"></div>

                    <>
                        <SectionTitle>Description</SectionTitle>
                        <div style={{marginTop: '15px'}}>
                            <SkeletonTheme color="#eee" highlightColor="#ccc" height="16px" width="50%">
                                <Skeleton count={1} />
                            </SkeletonTheme>
                        </div>

                        <SectionTitle style={{marginTop: '15px'}}>Details</SectionTitle>

                        <DetailSection className="details-section">
                            <div className='flex-align-center'>
                                <img src={ContractAddressIcon} alt="contract-address-icon" />
                                <DetailsText className="icon-margin">Contract Address</DetailsText>
                                <DetailsText className="detail-label">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="150px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </DetailsText>
                            </div>

                            <div className='flex-align-center'>
                                <img src={TokenIdIcon} alt="token-id-icon" />
                                <DetailsText className="icon-margin">Token ID</DetailsText>
                                <DetailsText className="detail-label">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="150px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </DetailsText>
                            </div>

                            <div className='flex-align-center'>
                                <img src={TokenStandardIcon} alt="token-standard-icon" />
                                <DetailsText className="icon-margin">Token Standard</DetailsText>
                                <DetailsText className="detail-label">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="180px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </DetailsText>
                            </div>

                            <div className='flex-align-center'>
                                <img src={BlockchainIcon} alt="blockchain-icon" />
                                <DetailsText className="icon-margin">Blockchain</DetailsText>
                                <DetailsText className="detail-label">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="180px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </DetailsText>
                            </div>
                        </DetailSection>
                    </>

                </div>
            </div>
            <div className="right-side-section">
                <div className="nft-name">
                    <>
                        <div style={{width: '40%'}}>
                            <SkeletonTheme color="#eee" highlightColor="#ccc" height="32px">
                                <Skeleton count={1} />
                            </SkeletonTheme>
                        </div>
                        <div className='spacing'></div>
                        <div className='owner-ship-skeleton'>
                            <div className="flex-align-center">
                                <div style={{marginRight: '15px'}}>
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="50px" height="50px" borderRadius="50%">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </div>

                                <div>
                                    <SubText>Owner</SubText>
                                    <div style={{marginTop: '10px'}}>
                                        <SkeletonTheme color="#eee" highlightColor="#ccc" width="120px" height="16px">
                                            <Skeleton count={1} />
                                        </SkeletonTheme>
                                    </div>
                                </div>
                            </div> 

                            <div className="flex-align-center">
                                <div style={{marginRight: '15px'}}>
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="50px" height="50px" borderRadius="50%">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </div>

                                <div>
                                    <SubText>Collection</SubText>
                                    <div style={{marginTop: '10px'}}>
                                        <SkeletonTheme color="#eee" highlightColor="#ccc" width="120px" height="16px">
                                            <Skeleton count={1} />
                                        </SkeletonTheme>
                                    </div>
                                </div>
                            </div>    
                        </div>

                        <AttrDiv>
                            <div className='flex-align-center'>
                                {
                                    colormodesettle.ColorMode ? 
                                    <CategoryLightIcon />
                                    :
                                    <CategoryDarkIcon />
                                }

                                <AttrText className="attr-text">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="40px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </AttrText>
                            </div>

                            <div className='flex-align-center'>
                                {
                                    colormodesettle.ColorMode ?
                                    <EyeLightIcon /> 
                                    :
                                    <EyeDarkIcon />
                                }
                                <AttrText className="attr-text">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="40px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </AttrText>
                            </div>

                            <div className='flex-align-center'>
                                {
                                    colormodesettle.ColorMode ?
                                    <HeartLightIcon />
                                    :
                                    <HeartDarkIcon />
                                }

                                <AttrText className="attr-text">
                                    <SkeletonTheme color="#eee" highlightColor="#ccc" width="40px">
                                        <Skeleton count={1} />
                                    </SkeletonTheme>
                                </AttrText>
                            </div>
                        </AttrDiv>
                    </>

                    <DetailSection className="tool-bar">
                        <TimeSpan>
                            <SkeletonTheme color="#eee" highlightColor="#ccc" width="40%">
                                <Skeleton count={1} />
                            </SkeletonTheme>
                        </TimeSpan>

                        <div className='spacing'></div>
                        
                        <SubText>
                            <SkeletonTheme color="#eee" highlightColor="#ccc" width="50px">
                                <Skeleton count={1} />
                            </SkeletonTheme>
                        </SubText>

                        <div className='spacing'></div>

                        <div className='price'>
                            <MainPrice>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" width="100px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </MainPrice>

                            <SubText style={{marginLeft: '27px'}}>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" width="80px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </SubText>
                        </div>

                        <div className='spacing'></div>

                        <div style={{display: 'flex', gap: '20px'}}>
                            <div style={{flex: 1}}>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" height="62px" borderRadius="6px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                            <div style={{flex: 1}}>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" height="62px" borderRadius="6px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>

                            <div style={{width: '62px'}}>
                                <SkeletonTheme color="#eee" highlightColor="#ccc" height="62px" borderRadius="6px">
                                    <Skeleton count={1} />
                                </SkeletonTheme>
                            </div>
                        </div>
                    </DetailSection>

                    <div className="spacing"></div>
                </div>

                <DropdownSection 
                    expand={true}
                    header={<> {colormodesettle.ColorMode ? <PriceHistoryLightIcon /> : <PriceHistoryDarkIcon />}<SectionTitle style={{marginLeft: '18px'}}>Price History</SectionTitle></>}
                >
                    <NoData />
                </DropdownSection>

                <div className="spacing"></div>

                <DropdownSection 
                    expand={false} 
                    header={<> {colormodesettle.ColorMode ? <ListingsLightIcon /> : <ListingsDarkIcon />}<SectionTitle style={{marginLeft: '18px'}}>Listings</SectionTitle></>}
                >
                    <div></div>
                </DropdownSection>

                <div className="spacing"></div> 

                <DropdownSection 
                    expand={false} 
                    header={<>{colormodesettle.ColorMode ? <OffersLightIcon /> : <OffersDarkIcon /> }<SectionTitle style={{marginLeft: '18px'}}>Offers</SectionTitle></>}
                >
                    <div></div>
                </DropdownSection>

                <div className="spacing"></div> 

                <DropdownSection 
                    expand={false} 
                    header={<>{colormodesettle.ColorMode ? <HistoryLightIcon /> : <HistoryDarkIcon /> }<SectionTitle style={{marginLeft: '18px'}}>History</SectionTitle></>}
                >
                    <div></div>
                </DropdownSection>
            </div>
        </div>
    )
}

export default memo(EmptyItemDetail);