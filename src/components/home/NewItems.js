import React, { useEffect, useState, memo } from "react";
import Carousel from 'react-multi-carousel';
import NFTCard from "./NFTCard";

import { Axios } from "./../../core/axios";


const responsive = {
    desktop: {
      breakpoint: { max: 10000, min: 1600 },
      items: 5
    },
    largeTable: {
      breakpoint: { max: 1599, min: 1300 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1299, min: 950 },
      items: 3
    },
    smallTablet: {
      breakpoint: { max: 949, min: 650 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 649, min: 0 },
      items: 1
    }
};

const NewItems = () => {

    const [newItems, setNewItems] = useState([]);

    const getNewItems = async () => {
        const { data } = await Axios.post('/api/supply-assets/new-items');
        const assets = data;

        if(assets && assets.data) {
          setNewItems(assets.data);
        }
    }

    useEffect(() => {
        getNewItems();
    }, []);

    return (
        <div style={{overflow:'hidden', paddingTop: '25px'}}>
        {
          newItems && newItems.length > 0 ?
          <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          arrows={false}
          draggable={false}
          >
            {
              newItems.map((item, index) => (
                <NFTCard key={index} nft={item} />
              ))
            }
          </Carousel>
          :
          null
        }
        </div>
    )
}

export default memo(NewItems);