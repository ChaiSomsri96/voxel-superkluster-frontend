/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable eqeqeq */
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { FaTwitter, FaInstagram, FaGlobe } from 'react-icons/fa';
import { ReactComponent as YourSvg } from './../../assets/svg/userfollow.svg';
import defaultUser from "./../../assets/image/default_user.png";
import ethSVG from "./../../assets/icons/ethereum.svg";

const AvatarImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

const SocialLinkDiv = styled.div`
  text-align: center;
  margin-right: 10px;
  display:flex ;
`;

const primaryBtnStyle = {
    color: 'white', 
    backgroundColor: '#f70dff', 
    border: '1px solid #f70dff', 
    borderRadius: '5px',
    padding: '5px 10px',
    fontSize: '14px',
    marginLeft: '10px',
}

const SocialIconBtn = styled.div`
  font-size: 20px;
  
  cursor: pointer;
  color: #f70dff;
  border: none;
  padding: 0px 10px;

  &:hover {
    color: #f70dff;
    border: none;
  }

  &:focus {
    color: #f70dff;
    border: none;
  }

  @media (max-width: 480px) {
    margin: 0px 5px!important;
  }
`;

const UserInfo = function ({ 
    isAuthorInfo, 
    isOwner, 
    handleTab, 
    authorId, 
    handleFollow, 
    isFollowNumCount, 
    tab, 
    followingNum, 
    followStatus
}) {

    const account = localStorage.getItem('account');
    const authorEtherscanAddress = `https://etherscan.io/address/${authorId}`;

    const [isExternalLink, setIsExternalLink] = useState(false);

    useEffect(() => {
      if (!isAuthorInfo) {
        setIsExternalLink(false);
        return;
      }
      if (isAuthorInfo.link_twitter && isAuthorInfo.link_twitter !== "null" && isAuthorInfo.link_twitter !== "https://") {
        setIsExternalLink(true);
        return;
      }
      if (isAuthorInfo.link_instagram && isAuthorInfo.link_instagram !== "null" && isAuthorInfo.link_instagram !== "https://") {
        setIsExternalLink(true);
        return;
      }
      if (isAuthorInfo.link_external && isAuthorInfo.link_external !== "null" && isAuthorInfo.link_external !== "https://") {
        setIsExternalLink(true);
        return;
      }
      setIsExternalLink(false);
    }, [isAuthorInfo]);

    const direct_link = (o_url) => {
      if (!o_url.startsWith("http")) {
          return `https://${o_url}`;
      }
      return o_url;
    };

    return (
        <div className="author-top-div">
          <div className="mb-4 user-info-div">
            <div className="author-avatar profile_avatar" style={{ marginRight: 15}}>
              <AvatarImg src={(isAuthorInfo && isAuthorInfo.avatar) ? isAuthorInfo.avatar : defaultUser} />
              <i className="fa fa-check"></i>
            </div>
            <div className="author-info author-info-margin">
              <h3>{(isAuthorInfo && isAuthorInfo.username) ? isAuthorInfo.username : "Unnamed" }</h3>
              {isOwner && <span style={{display: 'block'}}>{(isAuthorInfo && isAuthorInfo.email) ? isAuthorInfo.email : null }</span>}
              <span style={{display: 'block', width: 'max-content', border: '1px solid #dfdfdf', borderRadius: 13, padding: '2px 10px', cursor: 'pointer', marginTop: 5}}><a href={authorEtherscanAddress} target="_blank" style={{ color: "#727272"}}><img className="eth_logo" src={ethSVG} style={{ width: 16, height: 16, marginTop: '-5px' }} />{isAuthorInfo && isAuthorInfo.public_address ? ` ${isAuthorInfo.public_address.slice(0, 6)}...${isAuthorInfo.public_address.slice(-4)}` : "---" }</a></span>
            </div>
          </div>
          <div>
          </div>
          <div className="follow-div" style = {{flexWrap:'wrap'}}>
          {
            isExternalLink && 
            <SocialLinkDiv style={{paddingRight:'15px'}}>
              { isAuthorInfo && isAuthorInfo.link_twitter && isAuthorInfo.link_twitter != "null" && isAuthorInfo.link_twitter != "https://" && <SocialIconBtn className="socialIconColor"><a href={direct_link(isAuthorInfo.link_twitter)} target="_blank"><FaTwitter style={{color:'#f70dff'}} /></a></SocialIconBtn> }
              { isAuthorInfo && isAuthorInfo.link_instagram && isAuthorInfo.link_instagram != "null" && isAuthorInfo.link_instagram != "https://" && <SocialIconBtn className="socialIconColor"><a href={direct_link(isAuthorInfo.link_instagram)} target="_blank"><FaInstagram style={{color:'#f70dff'}} /></a></SocialIconBtn> }
              { isAuthorInfo && isAuthorInfo.link_external && isAuthorInfo.link_external != "null"  && isAuthorInfo.link_external != "https://"  && <SocialIconBtn className="socialIconColor"><a href={direct_link(isAuthorInfo.link_external)} target="_blank"><FaGlobe style={{color:'#f70dff'}} /></a></SocialIconBtn>}
            </SocialLinkDiv>
          }
            <div style = {{display:'flex', alignItems:'center'}}>
              <span>
                <div style={{display: 'flex'}}>
                  <div onClick={(e) => handleTab('followers')} style={{cursor: 'pointer', paddingRight: '10px'}}>
                    <b className="followInfo">
                      {isFollowNumCount}
                    </b>
                    {isFollowNumCount == '1' ? tab == 'followers'? <b> follower       </b>:' follower       ' : tab == 'followers'? <b> followers       </b>: ' followers       '}
                  </div>
                      &nbsp;
                  <div onClick={(e) => handleTab('followings')} style={{cursor: 'pointer'}}>
                    <b className="followInfo">{followingNum}</b>{tab == 'followings' ? <b> following </b>:' following'}
                  </div>
                </div>
              </span>
              { (account !== authorId && account) ? <button style={primaryBtnStyle} onClick={handleFollow}> 
                  <YourSvg width = '18' height='18' style={{paddingRight:'2px'}} />
                  &nbsp;{followStatus ? "Unfollow" : "Follow"}</button> : null}
            </div>
          </div>
        </div>
    )
}

export default UserInfo;