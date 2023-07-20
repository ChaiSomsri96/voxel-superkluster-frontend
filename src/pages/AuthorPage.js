import React, { memo, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "@reach/router";
import * as selectors from '../store/selectors';
import * as actions from "../store/actions/thunks";
import { Axios } from "../core/axios";
import { Container, AuthorAvatar, AuthorName, FollowSection,
  FollowCaption, FollowNumber, WalletSection, WalletAddress } from "./../components/author/styled-components";
import { truncateWalletAddress } from "./../utils";
import "./../assets/stylesheets/Author/index.scss";
import authorDefaultBanner from "./../assets/image/background/author-default-banner.png";
import defaultUser from "./../assets/image/default_user.png";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./../assets/stylesheets/react-tabs.scss";

import { ReactComponent as NetworkIcon } from "./../assets/svg/ethereum_icon.svg";
import { ReactComponent as VerifyIcon } from "./../assets/svg/big_verify.svg";

import CollectedTab from "./../components/author/CollectedTab";
import ActivityTab from "./../components/collection-detail/ActivityTab";
import { createBrowserHistory } from 'history';

const AuthorPage = ({colormodesettle}) => {
  const dispatch = useDispatch();
  const { authorId } = useParams();
  const account = localStorage.getItem('account');
  const authorInfo = useSelector(selectors.authorInfoState).data;

  const history = createBrowserHistory();

  const accessToken = localStorage.getItem('accessToken');
  const header = { 'Authorization': `Bearer ${accessToken}` };

  const [userInfo, setUserInfo] = useState({});
  const [isAuthorInfo, setAuthorInfo] = useState({});
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [tabIndex, setTabIndex] = useState(() => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    let tabName = currentUrlParams.get('tab');

    if(tabName) {
      switch(true) {
        case tabName.toLowerCase() === 'collected':
          return 0;
        case tabName.toLowerCase() === 'onsale':
          return 1;
        case tabName.toLowerCase() === 'created':
          return 2;
        case tabName.toLowerCase() === 'liked':
          return 3;
        case tabName.toLowerCase() === 'activity':
          return 4;
        default: 
          return 0;
      }
    }
    else {
      return 0;
    }
  });

  const selectTab = (index) => {
    let currentUrlParams = new URLSearchParams(window.location.search);

    let _tab = index === 0 ? 'collected' : 
                index === 1 ? 'onsale' :
                index === 2 ? 'created' :
                index === 3 ? 'liked' : 'activity';

    currentUrlParams.set('tab', _tab);

    history.push(window.location.pathname + "?" + currentUrlParams.toString());
  }

  const fectchAuthor = async() => {
    if(authorId) {
      dispatch(actions.fetchAuthorInfo(authorId));
    }

    if (account !== authorId) {
      await Axios.get(`/api/users/?public_address=${account}`)
      .then(res => {
        setUserInfo(res.data)
      })
      .catch(err => {
        console.error(err)
      })
    }
  }

  const getFollowingData = async() => {

    if(!isAuthorInfo || !isAuthorInfo.public_address) 
      return;

    const requestData = {
      public_address: isAuthorInfo.public_address,
      user_id: userInfo.id ? userInfo.id : authorInfo ? authorInfo.id : null
    };

    await Axios.post('/api/supply-assets/user-following-list', requestData, { headers: header})
    .then((res) => {
      setFollowingCount(res.data.data.length);
    })
    .catch((err) => {  
    });

  }

  useEffect( () => {
    if(authorInfo) {
      setAuthorInfo(authorInfo);
      setFollowerCount(authorInfo.followers && authorInfo.followers.length);
    }
  });

  useEffect( () => {
    fectchAuthor();
  }, [authorId]);

  useEffect(() => {
    getFollowingData();
  }, [isAuthorInfo]);

  return (
    <Container>
      <div className="main-container author-page">
        <div className="author-banner"
        style={{ backgroundImage: `url(${ isAuthorInfo && isAuthorInfo.banner ? isAuthorInfo.banner : authorDefaultBanner })`}}>
          
          <AuthorAvatar>
            <img className="author-avatar" src={isAuthorInfo && isAuthorInfo.avatar ? isAuthorInfo.avatar : defaultUser} alt="author-avatar" />
          </AuthorAvatar>
        
        </div>

        <div className="user-info">
          <div style={{marginTop: '30px'}}>
            <div className="flex-align-center">
              <AuthorName>{isAuthorInfo && isAuthorInfo.username ? isAuthorInfo.username : "Unnamed"}</AuthorName>
              <VerifyIcon />
            </div>
            <WalletSection>
              <NetworkIcon />
              <WalletAddress>
                { isAuthorInfo && isAuthorInfo.public_address ? truncateWalletAddress(isAuthorInfo.public_address) : "No wallet"}
              </WalletAddress>
            </WalletSection>
          </div>

          <FollowSection className="follow-section">
            <div className="space-between">
              <FollowCaption>
                Followers
              </FollowCaption>
              <FollowNumber>
                {followerCount}
              </FollowNumber>
            </div>
            <div className="space-between">
              <FollowCaption>
                Following
              </FollowCaption>
              <FollowNumber>
                {followingCount}
              </FollowNumber>
            </div>
          </FollowSection>
        </div>

        <div style={{marginTop: '36px'}}>
          <Tabs defaultIndex={tabIndex} onSelect={(index) => selectTab(index)}>
            <TabList>
              <Tab>Collected</Tab>
              <Tab>On Sale</Tab>
              <Tab>Created</Tab>
              <Tab>Liked</Tab>
              <Tab>Activity</Tab>
            </TabList>

            <TabPanel>
              <CollectedTab colormodesettle={colormodesettle} tab="owner" author={authorId} />
            </TabPanel>
            <TabPanel>
              <CollectedTab colormodesettle={colormodesettle} tab="sale" author={authorId} />
            </TabPanel>
            <TabPanel>
              <CollectedTab colormodesettle={colormodesettle} tab="creator" author={authorId} />
            </TabPanel>
            <TabPanel>
              <CollectedTab colormodesettle={colormodesettle} tab="liked" author={authorId} />
            </TabPanel>
            <TabPanel>
              <ActivityTab colormodesettle={colormodesettle} authorId={authorId} author={authorId} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </Container>
  );
}

export default memo(AuthorPage);