import React, { memo, useState, useEffect } from 'react';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import styled from "styled-components";
import "./../../assets/stylesheets/EmptyCard/index.scss";

const NFTItem = styled.div`
    border: 1px solid ${props => props.theme.cardBorderColor};
    border-radius: 10px;
    padding: 10px;
    position: relative;
    top: 0;
    transition: top 0.2s ease-in-out;

    &:hover {
        top: -5px;
    }
`
const NFTImg = styled.div`
    width: 100%;
    aspect-ratio: 16/15;
`

const SeparateLine = styled.div`
    border-top: 1px solid ${props => props.theme.cardBorderColor};

    margin-top: 10px;
`

const EmptyCard = () => {
    return (
        <NFTItem className="empty-card-item" style={{cursor: 'pointer'}}>
            <NFTImg>
                <SkeletonTheme color="#eee" highlightColor="#ccc" height="100%">
                        <Skeleton count={1} />
                </SkeletonTheme>
            </NFTImg>

            <div className='nft-card-info'>
                <div style={{width: '50%'}}>
                    <SkeletonTheme color="#eee" highlightColor="#ccc" height="14px">
                            <Skeleton count={1} />
                    </SkeletonTheme>
                </div>

                <div style={{width: '60%'}}>
                    <SkeletonTheme color="#eee" highlightColor="#ccc" height="17px">
                            <Skeleton count={1} />
                    </SkeletonTheme>
                </div>

                <SeparateLine></SeparateLine>

                <div className='sale-line' style={{marginTop: '10px'}}>
                    <div style={{width: '25%'}}>
                        <SkeletonTheme color="#eee" highlightColor="#ccc" height="15px">
                                <Skeleton count={1} />
                        </SkeletonTheme>
                    </div>
                    <div style={{width: '25%'}}>
                        <SkeletonTheme color="#eee" highlightColor="#ccc" height="15px">
                                <Skeleton count={1} />
                        </SkeletonTheme>
                    </div>
                </div>

                <div className='sale-line'>
                    <div style={{width: '35%'}}>
                        <SkeletonTheme color="#eee" highlightColor="#ccc" height="16px">
                                <Skeleton count={1} />
                        </SkeletonTheme>
                    </div>
                    <div style={{width: '35%'}}>
                        <SkeletonTheme color="#eee" highlightColor="#ccc" height="16px">
                                <Skeleton count={1} />
                        </SkeletonTheme>
                    </div>
                </div>
            </div>
        </NFTItem>
    )
}

export default memo(EmptyCard);