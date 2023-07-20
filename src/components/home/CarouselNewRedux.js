/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { Axios } from "./../../core/axios";
import * as actions from "./../../store/actions/thunks";
import NftCard from './../common/NFTCard';

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1200 },
    items: 5
  },
  largeTable: {
    breakpoint: { max: 1199, min: 992 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 991, min: 768 },
    items: 3
  },
  smallTablet: {
    breakpoint: { max: 767, min: 430 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 430, min: 0 },
    items: 1
  }
};

const CarouselNewRedux = () => {
    const dispatch = useDispatch();

    const account = localStorage.getItem('account');
    const [isNewItems, setNewItems] = useState([]);
    const [ethPrice, setEthPrice] = useState(1);
    
    useEffect(() => {
        getNewItemFunc();
    }, [])

    const getNewItemFunc = async () => {
        dispatch(actions.fetchAuthorInfo(account));
        const newItems = await Axios.post('/api/supply-assets/new-items');
        setNewItems(newItems.data.data);
        setEthPrice(newItems.data.ethUsdPrice);
        localStorage.setItem('usdPrice',newItems.data.usdPrice) ;
    }

    return (
      <>
        <Carousel responsive={responsive}>
            {
                isNewItems && isNewItems.map( (nft, index) => (
                  <NftCard nft={nft} key={index} index={index} account={account} ethPrice={ethPrice} />
                ))
            }
        </Carousel>
      </>
    );
}

export default memo(CarouselNewRedux);
