/* eslint-disable eqeqeq */
import React, { memo, useState, useEffect } from "react";
import { useNavigate } from "@reach/router";
import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Axios } from "./../../core/axios";
import { Tooltip } from "antd";
import defaultAvatar from "./../../assets/image/default_avatar.jpg";
import defaultUser from "./../../assets/image/default_user.png";

const CreatorName = styled.span`
    color: #f70dff;
`;

const DescriptionDiv = styled.div`
    color: #6c757d;
    font-weight: 400;
    margin-top: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const CollectionDiv = styled.div`
    padding: 0px;
    margin: 10px;
    width: calc(100% - 20px);
    cursor: pointer;
    border-radius: 15px;
    overflow: hidden;
    transition: all ease 400ms;

    &:hover {
      transform: scale(1.05);
    }
`;

const CardDiv = styled.div`
    border-radius: 15px;
    overflow: hidden;
    transition: all ease 300ms;

    &:hover {
      transform: scale(1.05);
    }
`;
const RowAvatar = styled.div`
    position: relative;
`;

const responsive = {
  desktop: {
    breakpoint: { max: 10000, min: 1200 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1199, min: 768 },
    items: 3
  },
  smallTablet: {
    breakpoint: { max: 767, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

const CarouselCollectionRedux = () => {

  const navigate = useNavigate();
  const [isHotCollections, setHotCollections] = useState([]);

  useEffect(() => {
    getHotCollections();
  }, [])

  const getHotCollections = async () => {
    const hotCollections = await Axios.post("/api/collections/hot-collections");
    setHotCollections(hotCollections.data.data);
  }

  const moveToItemPage = (collectionId) => {
    navigate(`/collection-detail/${collectionId}`);
  }

  return (
      <div className='nft' style={{overflow:'hidden'}}>
        <Carousel responsive={responsive}>
          { isHotCollections && isHotCollections.map((item, index) => (
            <CollectionDiv className='card-box-shadow-style' style={{borderRadius:'20px'}} onClick={() => moveToItemPage(item.collectionLink)} key={index} index={index + 1}>
                <CardDiv className="card" style={{ height: 'auto' }}>
                    <LazyLoadImage effect="opacity" className="lazy card-img-top" src={item.collectionImg ? item.collectionImg : defaultAvatar} style={{ aspectRatio:'8/5', objectFit:'cover', objectPosition:'top'}} alt="Bologna" />
                    <div style={{textAlign:'center',marginTop: -20 , marginBottom: 10}}>
                      <RowAvatar className="author_list_pp">
                        <div>
                            <LazyLoadImage effect="opacity" className="lazy card-img-top" src={item.creatorAvatar ? item.creatorAvatar : defaultUser} style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid white' }} alt="Bologna" />
                            {item.collectionVerified == "1" ? <i className="fa fa-check"></i>:<></>}
                        </div>
                      </RowAvatar>
                    </div>
                    <div className="card-body text-center" style={{ padding: '0px 20px 20px' ,display:'flex' , flexDirection:'column' , justifyContent:'space-between'}} >
                        <Tooltip placement="top" title = {item.collectionName ? item.collectionName : "Unnamed"} >
                          <h4 className="card-title" style={{overflow:'hidden', whiteSpace:'nowrap'}}>{item.collectionName ? item.collectionName : "Unnamed"}</h4>
                        </Tooltip>
                        <div>
                          <Tooltip placement="top" title = {'by ' + item.creatorName}>
                            <span className="card-subtitle mb-2" style={{overflow:'hidden'}}>by <CreatorName>{item.creatorName}</CreatorName></span>
                          </Tooltip>
                          <Tooltip placement='top' title ={item.collectionDesc ? item.collectionDesc : "No Description"}>
                            <DescriptionDiv className="card-text" style={{overflow:'hidden'}}>
                              {item.collectionDesc ? item.collectionDesc : "No Description"}
                            </DescriptionDiv>
                          </Tooltip>
                        </div>
                    </div>
                </CardDiv>
            </CollectionDiv>
          ))}
        </Carousel>
      </div>
  );
}

export default memo(CarouselCollectionRedux);
