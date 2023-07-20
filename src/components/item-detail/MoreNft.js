import React, { memo, useState, useEffect } from 'react';
import { MoreColTitle } from "./styled-components";
import NFTCard from '../home/NFTCard';
import { Axios } from "./../../core/axios";
import Carousel from 'react-multi-carousel';
import EmptyCard from "./../home/EmptyCard";

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

const MoreNft = ({collectionId, assetId}) => {
    const [nftArr, setNftArr]= useState([]);
    const [loaded, setLoaded] = useState(false)
    const [skeletonCount, setSkeletonCount] = useState(5);

    const handleResize = () => {
        const browserWidth = window.innerWidth;
        
        if(browserWidth >= 1600) {
            setSkeletonCount(5);
        }
        else if(browserWidth >= 1300) {
            setSkeletonCount(4);
        }
        else if(browserWidth >= 950) {
            setSkeletonCount(3);
        }
        else if(browserWidth >= 650) {
            setSkeletonCount(2);
        }
        else {
            setSkeletonCount(1);
        }
    };

    useEffect(() => {
        getMoreNftItems();
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    const getMoreNftItems = async () => {
        try {
            
            const moreItemsPost = {
                collection_id: collectionId,
                id: assetId
            };

            const {data} = await Axios.post('/api/supply-assets/more-items', moreItemsPost);
            
            setNftArr(data.data);
            setLoaded(true);
        }
        catch (err) {
            console.error("getMoreNftItems error: ", err);
            setLoaded(true);
        }
    }

    return (
        <div className="more-nft">
            <MoreColTitle className="more-label">
                More From This Collection
            </MoreColTitle>

            {
                loaded ?
                
                <div className="more-items">
                    {
                        nftArr && nftArr.length > 0 ?
                        <Carousel
                        responsive={responsive}
                        infinite={true}
                        autoPlay={true}
                        arrows={false}
                        draggable={false}
                        >
                            {
                                nftArr.map((nft ,index) => (
                                    <NFTCard key={index} nft={nft.asset} />
                                ))
                            }
                        </Carousel>
                        :
                        null
                    }
                </div>

                :
                <div className="empty-more-items">
                    {
                        Array.from({ length: skeletonCount }, (_, index) => (
                            <EmptyCard key={index} />
                        ))
                    }
                </div>
            }
        </div>
    )
}

export default memo(MoreNft);