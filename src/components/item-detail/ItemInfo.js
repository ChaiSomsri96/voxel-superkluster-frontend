import React, { memo, useState, useEffect } from 'react';
import { NFTName, Text, SubText, AttrText, AttrDiv } from "./styled-components";
import { Link } from "@reach/router";
import defaultUser from "./../../assets/image/default_user.png";
import defaultAvatar from "./../../assets/image/default_avatar.jpg";
import { ReactComponent as CategoryLightIcon } from "./../../assets/svg/item_detail/category_name_light.svg";
import { ReactComponent as CategoryDarkIcon } from "./../../assets/svg/item_detail/category_name_dark.svg";
import { ReactComponent as EyeLightIcon } from "./../../assets/svg/item_detail/eye_light.svg";
import { ReactComponent as EyeDarkIcon } from "./../../assets/svg/item_detail/eye_dark.svg";
import { ReactComponent as HeartLightIcon } from "./../../assets/svg/item_detail/heart_light.svg";
import { ReactComponent as HeartDarkIcon } from "./../../assets/svg/item_detail/heart_dark.svg";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { shortenOwnerAddress } from "./../../utils";

import { ReactComponent as VerifyIcon } from "./../../assets/svg/verify.svg"

const ItemInfo = ({itemData, colormodesettle}) => {
    const firstOwner = itemData.owners &&  itemData.owners.length > 0 ? itemData.owners[0]['owner'] : null;

    return (
        <>
            <NFTName>{itemData.name}</NFTName>
            <div className='spacing'></div>
            <div className='owner-ship'>
                <div className="flex-align-center">
                    <div className="item-avatar">
                        <Link to={`/author/${firstOwner.public_address}`}>
                            <LazyLoadImage src={firstOwner && firstOwner.avatar ? firstOwner.avatar : defaultUser} 
                            alt="owner-avatar" />
                        </Link>
                        {
                            firstOwner && firstOwner.verified ? <VerifyIcon className="verify-icon"></VerifyIcon> : null
                        }
                    </div>
                    <div>   
                        <SubText>Owner</SubText>
                        <Text style={{marginTop: '10px'}}>{ firstOwner && firstOwner.username ? firstOwner.username : shortenOwnerAddress(firstOwner.public_address) }</Text>
                    </div>
                </div>
                <div className="flex-align-center">
                    <div className="item-avatar">
                        {
                            itemData && itemData.collection ?
                            <Link to={`/collection-detail/${itemData.collection.link}`}>
                                <LazyLoadImage src={itemData.collection.avatar ? itemData.collection.avatar : defaultAvatar} 
                                alt="collection-avatar" />
                            </Link>
                            :
                            <LazyLoadImage src={defaultAvatar} alt="collection-avatar" />
                        }

                        {
                            itemData && itemData.collection && itemData.collection.verified
                            ?
                            <VerifyIcon className="verify-icon"></VerifyIcon> : null
                        }
                        
                    </div>
                    <div>
                        <SubText>Collection</SubText>
                        <Text style={{marginTop: '10px'}}>{ itemData && itemData.collection && itemData.collection.name ? itemData.collection.name : "Unnamed" }</Text>
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
                    <AttrText className="attr-text">{itemData.collection.category && itemData.collection.category.label ? itemData.collection.category.label : "No Category" }</AttrText>
                </div>

                <div className='flex-align-center'>
                    {
                        colormodesettle.ColorMode ?
                        <EyeLightIcon /> 
                        :
                        <EyeDarkIcon />
                    }
                    
                    <AttrText className="attr-text">{itemData.views && Array.isArray(itemData.views) ? itemData.views.length : 0} views</AttrText>
                </div>

                <div className='flex-align-center'>
                    {
                        colormodesettle.ColorMode ?
                        <HeartLightIcon />
                        :
                        <HeartDarkIcon />
                    }
                    <AttrText className="attr-text">{itemData.favs && Array.isArray(itemData.favs) ? itemData.favs.length : 0}</AttrText>
                </div>
            </AttrDiv>
        </>
    );
}

export default memo(ItemInfo);