import React, { useState, useEffect, Fragment } from "react";
import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-loading-skeleton/dist/skeleton.css'

import collectionDefaultCardImg from "./../assets/image/collection_default_card.jpg";
import defaultAvatar from "./../assets/image/default_avatar.jpg";

const CreatorName = styled.span`
    color: #f70dff;
`;

const DescriptionDiv = styled.div`
    color: #6c757d;
    font-weight: 400;
    margin-top: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const CollectionDiv = styled.div`
    padding: 0px;
    margin: 10px;
    width: calc(100%/3 - 20px);
    cursor: pointer;
    
    @media (max-width: 992px) {
        width: calc(50% - 20px);
    }

    @media (max-width: 480px) {
        width: calc(100% - 20px);
    }

`;

const CardDiv = styled.div`
    border-radius: 15px;
    overflow: hidden;
    transition: all ease 300ms;

    &:hover {
        transform: scale(1.01);
        box-shadow: 0 10px 20px -5px hsla(240, 30.1%, 28%, 0.12);
    }
`;


const SkeletonCard = () => {
    return (
        <CollectionDiv>
            <CardDiv className="card" style={{ textAlign: 'center', height: 360 }}>
                <SkeletonTheme color="#eee" highlightColor="#ccc" style={{ height: 175 }} >
                    <Skeleton height={150} width ={150} circle={true} />
                </SkeletonTheme> 
                <div style={{ textAlign: 'center', marginTop: -27, marginBottom: 10 }}>
                    <SkeletonTheme color="#eee" highlightColor="#ccc" style={{ height: 175 }} >
                        <Skeleton height={50} width ={50} circle={true} />
                    </SkeletonTheme> 
                </div>
                <div className="card-body text-center">
                    <h4 className="card-title">
                        <SkeletonTheme color="#eee" highlightColor="#ccc">
                            <Skeleton count={1} />
                        </SkeletonTheme> 
                    </h4>
                    <h6 className="card-subtitle mb-2 ">
                        <SkeletonTheme color="#eee" highlightColor="#ccc">
                            <Skeleton count={1} />
                        </SkeletonTheme> 
                    </h6>
                    <DescriptionDiv className="card-text">
                        <SkeletonTheme color="#eee" highlightColor="#ccc">
                            <Skeleton count={3} />
                        </SkeletonTheme>
                    </DescriptionDiv>
                </div>
            </CardDiv>
        </CollectionDiv>
    )
}

const CollectionCard = ( data, label ) => {

    const [isCollections, setCollections] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [loadImgStatus, setLoadImgStatus] = useState(false);

    useEffect(() => {
        setLoading(true);
        if(data.data && data.data.length > 0) {
            setCollections(data.data)
            localStorage.setItem('rim' , JSON.stringify(data.data)) 

        }
        const timer = setTimeout(() => {
          setLoading(false)
        }, 2000);
        return () => clearTimeout(timer);
    }, [data])

    const setLimitText =(txt , len) =>{
        if(txt == null) return ;
        if( txt.length >= len) return txt.slice(0,len)+'...' ;
        return txt ;
    }

    return (
        <Fragment>
            {isLoading && <SkeletonCard />}
            {
                !isLoading &&
                <>
                    {   
                        isCollections.map((collection) => (
                            <CollectionDiv className="card-box-shadow-style" style={{borderRadius:'15px'}} key={collection.id}>
                                <a href={`collection-detail/` + collection.link}>
                                    <CardDiv className="card" style={{ height: 'auto' }}>
                                        <LazyLoadImage effect="opacity" className="lazy card-img-top" src={collection.featured ? collection.featured : collectionDefaultCardImg} afterLoad={() => setLoadImgStatus(!loadImgStatus)} style={{ aspectRatio:'8/5', objectFit:'cover', objectPosition:'50% 15%'}} alt="Bologna" />
                                        <div style={{ textAlign: 'center', marginTop: -20, marginBottom: 10}}>
                                            <div style={{position:'relative', width:50, height:50, display:'inline-block'}}>
                                                <div>
                                                    <LazyLoadImage effect="opacity" className="lazy card-img-top" src={collection.avatar ? collection.avatar : defaultAvatar} afterLoad={() => setLoadImgStatus(!loadImgStatus)} style={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid white' }} alt="Bologna" />
                                                    {collection.is_verified == "1" ? <i className="fa fa-check" style={{background:'#f70dff', borderRadius:'100%', padding:'3px', position:'absolute', bottom:0, right:0, color:'#ffffff'}}></i>:<></>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body text-center" style={{ padding: '0px 20px 20px'}} >
                                            <h4 className="card-title">{collection.name ? setLimitText(collection.name,20) : "Unnamed"}</h4>
                                            <span className="card-subtitle mb-2 ">by {data.label == "all" && <CreatorName>{setLimitText(collection.creator.username ? collection.creator.username:collection.creator.public_address,11)}</CreatorName>}{ data.label == "user" && <CreatorName>you</CreatorName> }</span>
                                            <DescriptionDiv className="card-text">{(collection.description && collection.description != 'null') ? setLimitText(collection.description,35) : "No Description"}</DescriptionDiv>
                                        </div>
                                    </CardDiv>
                                </a>
                            </CollectionDiv>
                            
                        ))
                    }
                </>
            }
        </Fragment>
    )
}

export default CollectionCard;