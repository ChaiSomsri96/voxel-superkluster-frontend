import React, { memo, useState , useEffect} from 'react' ;
import { Axios } from "./../core/axios";
import { formatMarketplaceNumber, formatCreatedDate, directLink } from "./../utils";
import collectionDefaultBanner from "./../assets/image/collection_default_banner.jpg";
import "./../assets/stylesheets/CollectionDetail/index.scss";
import { ReactComponent as VerifyIcon } from "./../assets/svg/small_verify.svg";
import { Container, CollectionName, CollectionCon, CollectionPre, CollectionFactor, SocialIconBtn,
  ColAvatar, CollectionDesc, FaTwitterIcon, FaInstagramIcon,
  FaDiscordIcon, FaTelegramPlaneIcon, FaGlobeIcon, FaRegStarIcon, FaShareAltIcon, Splitter
} from "./../components/collection-detail/styled-components";
import defaultAvatar from "./../assets/image/default_avatar.jpg";
import ItemTab from "./../components/collection-detail/ItemTab";
import ActivityTab from "./../components/collection-detail/ActivityTab";
import { Link, useParams, useLocation  } from "@reach/router";
import { createBrowserHistory } from 'history';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./../assets/stylesheets/react-tabs.scss";


const CollectionDetailPage = function ({ colormodesettle }) {
  const { collectionId } = useParams();

  const accessToken = localStorage.getItem('accessToken');
  const header = { 'Authorization': `Bearer ${accessToken}` };

  const history = createBrowserHistory();

  const [isSelectCollectionId, selectCollectionId] = useState('');
  const [isDetailData, setDetailData] = useState([]);
  const [isCollectionCreator, setCollectionCreator] = useState(null);
  const [isShowUserBtn, setShowUserBtn]=useState(false);
  const [isVerified , setVerified] = useState(false) ;
  const [isusdPrice , setUsdPrice] = useState();
  const [ethPrice , setEthPrice] = useState(1);

  const [tabIndex, setTabIndex] = useState(() => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    let tabName = currentUrlParams.get('tab');

    return tabName && tabName.toLowerCase() === 'activity' ? 1 : 0;
  });

  const selectTab = (index) => {
    let currentUrlParams = new URLSearchParams(window.location.search);

    let _tab = index === 0 ? 'items' : 'activity';
    currentUrlParams.set('tab', _tab);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
  };

  const getCollectionDetail = async () => {
    selectCollectionId(collectionId);
    const account = localStorage.getItem('account');
    let result;
    const header = { 'Authorization': `Bearer ${accessToken}` };

    if(!accessToken) 
      result = await Axios.get(`/api/collections/${collectionId}`);
    else
      result = await Axios.get(`/api/collections/users/${collectionId}`, {headers:header});

    const details = result.data;
    setDetailData(details);
    setUsdPrice(result.data.usdPrice) ;
    setEthPrice(result.data.ethUsdPrice);
    setCollectionCreator(details.creator);

    if ((account && account) === (details && details.creator && details.creator.public_address)) {
      setShowUserBtn(true) ;
    }

    if(details && details.verified)
      setVerified(details.verified);
  }

  useEffect(() => {
    if (collectionId) {
      getCollectionDetail();
    }
  }, [collectionId]);

  return (
    <Container>
      <div className="main-container collection-detail">
        <div
        className='collection-detail-banner'
        style={{ backgroundImage: `url(${ isDetailData.banner ? isDetailData.banner : collectionDefaultBanner })`}}>

            <ColAvatar>
              <img className="col-avatar" src={isDetailData && isDetailData.avatar ? isDetailData.avatar : defaultAvatar} alt="col-avatar" />
            </ColAvatar>

        </div>

        <div className='flex-space-between' style={{marginTop: '50px'}}>
          <div>
            <CollectionName>{isDetailData && isDetailData.name ? isDetailData.name : "Unnamed"}</CollectionName>

            <div className='paragraph'></div>

            <div className='flex-align-center'>
              <CollectionPre>by</CollectionPre>
              <CollectionCon style={{marginRight: '12px'}}>&nbsp;JackBrowny</CollectionCon>
              <VerifyIcon></VerifyIcon>
            </div>

            <div className='paragraph'></div>

            <div style={{display: 'flex'}}>
              <CollectionPre>Created</CollectionPre>
              <CollectionCon>&nbsp;{isDetailData && isDetailData.created_at ? formatCreatedDate(isDetailData.created_at) : ''}</CollectionCon>
            </div>

            <div className='paragraph'></div>

            <CollectionDesc>
              {isDetailData && isDetailData.description ? isDetailData.description : null}
            </CollectionDesc>
            <div style={{display: 'flex', marginTop: '30px'}}>
              <div>
                <CollectionFactor>{formatMarketplaceNumber(isDetailData ? isDetailData.total_assets : 0)}</CollectionFactor>
                <CollectionPre style={{marginTop: '16px'}}>items</CollectionPre>
              </div>

              <div style={{marginLeft: '40px'}}>
                <CollectionFactor>{formatMarketplaceNumber(isDetailData ? isDetailData.total_owners : 0)}</CollectionFactor>
                <CollectionPre style={{marginTop: '16px'}}>owners</CollectionPre>
              </div>

              <div style={{marginLeft: '40px'}}>
                <CollectionFactor>{isDetailData ? isDetailData.floor_price : 0} USD</CollectionFactor>
                <CollectionPre style={{marginTop: '16px'}}>floor price</CollectionPre>
              </div>

              <div style={{marginLeft: '40px'}}>
                <CollectionFactor>{isDetailData ? isDetailData.usd_volume_traded : 0} USD</CollectionFactor>
                <CollectionPre style={{marginTop: '16px'}}>volume traded</CollectionPre>
              </div>
            </div>
          </div>
          <div>
            <div className="social-line">
                {
                  isDetailData && isDetailData.twitter 
                  ?
                  <a href={directLink(isDetailData.twitter)} target="R" className="social-icon">
                    <FaTwitterIcon />                  
                  </a>
                  : 
                  null  
                }

                {
                  isDetailData && isDetailData.instagram
                  ?
                  <a href={directLink(isDetailData.instagram)} target="R" className="social-icon">
                    <FaInstagramIcon />
                  </a>
                  :
                  null
                }

                {
                  isDetailData && isDetailData.discord
                  ?
                  <a href={directLink(isDetailData.discord)} target="R" className="social-icon">
                    <FaDiscordIcon />
                  </a>
                  :
                  null
                }
                
                {
                  isDetailData && isDetailData.telegram
                  ?
                  <a to={directLink(isDetailData.telegram)} target="R" className="social-icon">
                    <FaTelegramPlaneIcon />
                  </a>
                  :
                  null
                }

                {
                   isDetailData && isDetailData.website
                   ?
                   <a to={directLink(isDetailData.website)} target="R" className="social-icon">
                    <FaGlobeIcon />
                   </a>
                   :
                   null
                }
                <Splitter className="social-icon"></Splitter>
                <FaRegStarIcon className="social-icon" />
                <FaShareAltIcon className="social-icon" />
            </div> 
          </div>
        </div>

        <div style={{marginTop: '36px'}}>
          <Tabs defaultIndex={tabIndex} onSelect={(index) => selectTab(index)}>
              <TabList>
                <Tab>Items</Tab>
                <Tab>Activity</Tab>
              </TabList>

              <TabPanel>
                <ItemTab colormodesettle={colormodesettle} collectionId={collectionId} />
              </TabPanel>
              <TabPanel>
                <ActivityTab colormodesettle={colormodesettle} collectionId={collectionId} />
              </TabPanel>
          </Tabs>
        </div>
      </div>
    </Container>
  );
}
export default memo(CollectionDetailPage);