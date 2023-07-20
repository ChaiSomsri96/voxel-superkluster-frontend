/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
import React, { memo, useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "@reach/router";
import { Axios } from "../../core/axios";
import Carousel from "react-multi-carousel";
import LocalButton from "../common/Button";
import "./../../assets/stylesheets/Home/trendingItemsCarousel.scss";
import { ReactComponent as VerifyIcon } from "./../../assets/svg/verify.svg"

const TrendingCard = styled.div`
    border: 1px solid ${props => props.theme.cardBorderColor};
    border-radius: 16px;
    display: flex;
    padding: 10px;

    margin: 0 15px;
    
    @media (min-width: 526px) {
        height: 350px;
    }

    @media (max-width: 525px) {
        flex-direction: column;
    }
`

const ItemLabel = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 24px;
    line-height: 35px;
    font-style: normal;
    font-weight: 600;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
`

const TrendingItemsCarousel = function({colormodesettle}) {
    const navigate = useNavigate();

    const [itemData, setItemData] = useState([]);

    const getTrendingItems = async () => {
        const { data } = await Axios.post(`/api/supply-assets/trending-items`);
        const assets = data;
        if(assets && assets.data) {
            const temp = assets.data.map((item) => {
                const saleType = item.saleType !== "2" ? 1 : 2;
                const endTime = saleType !== 2 ? item.saleEndDate : item.auctionEndDate;
                const saleEndDate = endTime * 1000 - new Date().getTime() > 0 ? endTime * 1000 - new Date().getTime() : 0;
                return { ...item, saleType, endTime, saleEndDate };
            });

            setItemData(temp);
        }    
    }

    const moveToDetailPage = (itemId) => {
        navigate(`/ItemDetail/${itemId}`);
    }

    const responsive = {
        tablet: {
          breakpoint: { max: 10000, min: 1800 },
          items: 3
        },
        smallTablet: {
          breakpoint: { max: 1800, min: 1000 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 999, min: 0 },
          items: 1
        }
    };

    useEffect(() => {
        getTrendingItems();
    }, []);

    return (
        <div style={{overflow:'hidden', paddingTop: '25px'}}>
            {
                itemData && itemData.length > 0 ?
                <Carousel responsive={responsive} infinite={true} arrows={false} autoPlay={true}>
                    {
                        itemData.map((item, index) => (

                            <TrendingCard className="trending-card" key={index}>
                                <div className="col-lg-5" onClick={()=>moveToDetailPage(item.assetId)} style={{ cursor: 'pointer'}}>
                                    <img src={item.image} className="trending-item-img" alt="trending-item-img" />
                                </div>
                                <div className={`col-lg-7 trending-item-right`}>
                                    <ItemLabel>
                                        {item.name ? item.name : "Unnamed"}
                                    </ItemLabel>

                                    <div className="collection-info">
                                        <div className="avatar">
                                            <Link to={`/collection-detail/${item.collection.link}`}>
                                                <img className="collection-img" src={item.collection && item.collection.avatar ? item.collection.avatar : "/img/collections/coll-1.jpg"} alt="trending-item-collection" />
                                            </Link>                                             
                                            {
                                                item.collection.verified ? <VerifyIcon className="verify-icon" /> : <></>
                                            }
                                        </div>
                                        <div className="collection-name">
                                            <Link to={`/collection-detail/${item.collection.link}`} className="collection-link">
                                                { item.collection && item.collection.name ? item.collection.name : "Unnamed" }
                                            </Link>
                                        </div>     
                                    </div>

                                    <LocalButton className="view-artwork-btn" onClick={()=>moveToDetailPage(item.assetId)}>
                                        View Artwork
                                    </LocalButton>
                                </div>    
                            </TrendingCard>

                        ))
                    }
                </Carousel>    
                :   
                null    
            }
        </div>
    )
}

export default memo(TrendingItemsCarousel);