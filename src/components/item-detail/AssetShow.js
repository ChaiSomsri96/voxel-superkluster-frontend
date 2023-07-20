import React, { memo } from 'react';
import ThreeDOnline from "./../ThreeD/ThreeDOnline";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import defaultNFT from "./../../assets/image/default_nft.jpg";

const AssetShow = ({itemData, colormodesettle}) => {
    return (
        <div className='asset-show'>
        {
            itemData.asset_type === "3D" ?
            (
                <ThreeDOnline animation={itemData} colormodesettle={colormodesettle.ColorMode} />
            )
            : itemData.asset_type === "video/mp4" ?
            <video style={{ width: '100%' }} controls autoPlay loop muted>
                <source src={itemData.animation} type="video/mp4" />
            </video>
            : itemData.asset_type === "audio/mpeg" ?
            <audio controls autoPlay loop>
                <source src={itemData.animation} type="audio/mpeg" />
            </audio>
            :
            <LazyLoadImage src={(itemData.image? itemData.image : itemData.raw_image?itemData.raw_image:itemData._blob_raw_image?itemData._blob_raw_image:defaultNFT)} />
        }
        </div>
    )
}

export default memo(AssetShow);