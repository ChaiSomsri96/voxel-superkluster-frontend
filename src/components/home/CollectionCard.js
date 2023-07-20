import styled from "styled-components";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Link } from "@reach/router";
import "./../../assets/stylesheets/CollectionCard/index.scss";

import defaultAvatarImg from "./../../assets/image/default_avatar.jpg";
import defaultUserImg from "./../../assets/image/default_user.png";
import { ReactComponent as VerifyIcon } from "./../../assets/svg/verify.svg"

const CollectionDiv = styled.div`
    border: 1px solid ${props => props.theme.cardBorderColor};
    border-radius: 16px;
    padding: 10px 10px 0px 10px;

    margin: 0 14px;
`

const CollectionTitle = styled.div`
    font-size: 24px;
    line-height: 35px;
    font-weight: 600;
    color: ${props => props.theme.primaryColor};
`

const CollectionDesc = styled.div`
    font-size: 16px;
    line-height: 35px;
    font-weight: 400;
    color: ${props => props.theme.primaryColor};
`

function CollectionCard( {item} ) {
    return (
    <CollectionDiv className="collection-card">
        <Link to={`/collection-detail/${item.collectionLink}`}>
            <div className="collection-card-featured">
                <img src={item.collectionImg ? item.collectionImg : defaultAvatarImg} className="collection-card-img" alt="collection-card-img" />
            
                <div className="creator-info">
                    <Link to={`/author/${item.creatorWallet}`}>
                        <LazyLoadImage 
                            src={item.creatorAvatar ? item.creatorAvatar : defaultUserImg} 
                            alt="creator-avatar" width="100%" height="100%"
                            className="creator-avatar-img" 
                        />
                    </Link>
                    {
                        item.creatorVerified ? <VerifyIcon className="verify-icon" /> : null
                    }
                </div>
            </div>
            <div className="collection-card-desc">
                <CollectionTitle className="ellipsis">{item.collectionName ? item.collectionName : "Unnamed"}</CollectionTitle>
                <CollectionDesc className="ellipsis">
                    Created by <span><Link to={`/author/${item.creatorWallet}`} className="creator-link">{ item.creatorName ? item.creatorName : item.creatorWallet }</Link></span>
                </CollectionDesc>
            </div>
        </Link>
    </CollectionDiv>
    );
}

export default CollectionCard;