import React, { memo, useState, useEffect } from "react";
import Carousel from "react-multi-carousel";

import { Axios } from "./../../core/axios";
import CollectionCard from "./CollectionCard";

const responsive = {
    desktop: {
      breakpoint: { max: 10000, min: 1300 },
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

const HotCollections = () => {

    const [hotCollections, setHotCollections] = useState([]);

    const getHotCollections = async () => {
        const { data } = await Axios.post("/api/collections/hot-collections");
        const collections = data;

        if(collections && collections.data) {
          setHotCollections(collections.data);
        }
    }

    useEffect(() => {
        getHotCollections();
    }, []);

    return (
      <div style={{overflow:'hidden', paddingTop: '25px'}}>
      {
        hotCollections && hotCollections.length > 0 ?
          <Carousel
            responsive={responsive}
            infinite={true}
            autoPlay={true}
            arrows={false}
            draggable={false} 
          >
            {
              hotCollections && hotCollections.map((collection, index) => (
                <CollectionCard key={index} item={collection} />
              ))
            }
          </Carousel>
        :
        null
      }
      </div>
    )
}

export default memo(HotCollections);