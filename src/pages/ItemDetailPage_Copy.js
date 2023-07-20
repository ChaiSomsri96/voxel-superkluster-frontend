/* eslint-disable react/jsx-no-target-blank */
import React, { memo, useEffect, useState, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled, { createGlobalStyle } from "styled-components";
import { Link, useNavigate } from "@reach/router";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import { Oval } from  'react-loader-spinner';
import moment from "moment";
import { Button, Affix, Statistic, Checkbox, Switch, Select, Input,Collapse, DatePicker,Tooltip , Spin ,Progress ,  Dropdown, Menu, Table } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { FaWallet, FaTag, FaHeart ,FaDollarSign, FaGlobe,FaFacebook,FaTwitter, 
  FaTelegram , FaSyncAlt ,FaShareAlt, FaArrowCircleRight, 
  FaShoppingCart, FaFlag, FaAngleUp, FaAngleDown, FaSignal, FaRegClock, FaFileAlt } from "react-icons/fa" ;
import { AiOutlineGlobal } from 'react-icons/ai';
import { BsClockHistory, BsCardImage, BsWallet2, BsBoxArrowUpRight } from 'react-icons/bs';
import { ethers } from "ethers";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-loading-skeleton/dist/skeleton.css';
import { useWeb3React } from "@web3-react/core";
import { Line } from '@ant-design/plots';
import Swal from 'sweetalert2' ;
import 'sweetalert2/src/sweetalert2.scss' ;
import { FiInfo, FiCheckCircle } from 'react-icons/fi';
import { zonedTimeToUtc } from  'date-fns-tz' ;

import * as selectors from '../store/selectors';
import * as actions from "../store/actions/thunks";
import NftCard_Item from '../components/DetailNftCard_Item';
import { Axios } from "../core/axios";
import {getListAction , getApprove,isApproved, getAcceptAction ,getBuyAction,getBuyAction_buyer_auction, signMessage, transferItem } from '../core/nft/interact';
import ThreeDOnline from "../components/ThreeD/ThreeDOnline";
import { currencyLogo, currencyName } from "../store/utils";
import defaultAvatar from "./../assets/image/default_avatar.jpg";
import defaultNFT from "./../assets/image/default_nft.jpg";
import ethIcon from "./../assets/icons/ethIcon.png";
import defaultUser from "./../assets/image/default_user.png";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    
  }
  .mr40{
    margin-right: 40px;
  }
  .mr15{
    margin-right: 15px;
  }
  .btn2{
    background: #EEE;
    color: #0d0c22 !important;
  }

  .moveActionContainer .prevBar:hover .prevBtn, .moveActionContainer .nextBar:hover .nextBtn {
    opacity: 1 !important;
  }
  
  @media only screen and (max-width: 1199px) {
    .navbar{
      
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

const Outer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
`;

const StyledSection = styled.section`
  padding-top: 25px;
  margin-top: 20px;
  padding-bottom:0px ;

  @media (max-width: 767px) {
    margin-top: 60px;
  }
`;

const TopBar = styled.div`
  background: transparent !important;
`;

const TopSubDiv = styled.div`
  padding: 10px;
`;

const StyledButton = styled(Button)`
  width: auto;
  color: white;
  background: #f70dff;
  padding: 0px 25px;
  border-color: #f70dff;
  border-radius: 5px;
  font-weight: bold;
  margin: 0px 10px;

  &:last-child {
    // margin: 0px 15% 0px 10px;
  }

  &:hover {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }

  &:focus {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }
`;

const NoDataDiv = styled.div`
  margin: 20px 0px;
  color: grey;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const TopBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  padding-left: 15px;
`;

const Label = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

const ModalTopBar = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 15px 5px;
    align-items: center;
    border-top: 1px solid #dee2e6;
    border-bottom: 1px solid #dee2e6;
`;

const ModalTotalBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 5px 10px 15px;
  align-items: center;
`;

const ModalTopBarLeft = styled.div`
    width: 70%;
    display: flex;
    justify-content: left;
    align-items: center;
    line-height: 1.2;
`;

const ModalTopBarRight = styled.div`
    width: 50%;
    justify-content: right;
    align-items: center;
    line-height: 1.2;
`;

const StyledTopBarImg = styled.img`
    width: 40px;
    height: 45px;
    margin: 0px 10px;
`;

const ImgInfo = styled.div`

`;

const PTag = styled.p`
    margin: 0px 0px 10px 0px;
    font-size: 14px;
`;

const StyledTokenImg = styled.img`
    width: 16px;
    height: 16px;
    margin: -5px 5px 0px;
`;

const ModalBottomDiv = styled.div`
  padding: 20px 0px 10px;
  text-align: center;
`;

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
`;

const ModalBtn = styled(Button)`
  height: 40px;
  color: white;
  background: #f70dff;
  padding: 0px 25px;
  border-color: #f70dff;
  border-radius: 10px;
  font-weight: bold;
  margin: 0px 10px;

  &:hover {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }

  &:focus {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }
`;

const ModalCancelBtn = styled(Button)`
  height: 40px;
  color: #f70dff;
  background: white;
  padding: 0px 25px;
  border-color: #f70dff;
  border-radius: 10px;
  font-weight: bold;
  margin: 0px 10px 5px 10px;

  &:hover {
    color: #f70dff;
    background: white;
    border-color: #f70dff;
  }

  &:focus {
    color: #f70dff;
    background: white;
    border-color: #f70dff;
  }
`; 

const StyledStatistic = styled(Statistic)`
  .ant-statistic-content {
    font-size: 14px!important;
    overflow: hidden!important;
    white-space: nowrap!important;

    .ant-statistic-content-prefix, .ant-statistic-content-value {
      font-size: 14px!important;
    }
  }
`;

const StyledInput = styled(Input)`
    &.ant-input {
        padding: 6px!important;
    }
`;

const alarmStyle = {
  display: 'flex',
  justifyContent: 'center',
  zIndex: '100',
  background: 'rgb(249 73 255)',
  lineHeight: '0.5em',
  padding: '7px',
  width: '22px',
  borderRadius: '30px',
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: '10px',
  marginTop: '2px',
  marginLeft: '5px'
}
const iconBtnStyle = {
  cursor: "pointer", 
  fontSize: 18, 
  margin: '0px 3px 3px'
}
const SpanTag = styled.span`
    font-size: 12px;
`;

const RowDiv = styled.div`
    display: flex;
`;

const RowAvatar = styled.div`
    position: relative;
`;

const RowInfo = styled.div`
    padding-left: 10px!important;
`;

const ActionButtonEnded = styled.div`
    width: 220px;
    height: 30px;
    color: white;
    background: #f70dff;
    padding-top: 3px;
    border-color: #f70dff;
    border-radius: 5px;
    font-weight: bold;
    display:flex ;
    justify-content:center ;
    align-content: flex-end;
    
`;

const DescriptionDiv = styled.div`
    
    font-weight: 400;
    margin-top: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
const ActionButton = styled(Button)`
    width: auto;
    height: 40px;
    color: white;
    background: #f70dff;
    padding: 0px 4%;
    border-color: #f70dff;
    border-radius: 10px;
    font-weight: bold;
    margin: 5px 10px;

    &:hover {
      color: white;
      background: #f70dff;
      border-color: #f70dff;
    }

    &:focus {
      color: white;
      background: #f70dff;
      border-color: #f70dff;
    }
`;

const BuyButton = styled(Button)`
    width: auto;
    height: 40px;
    color: white;
    background: #f70dff;
    padding: 0px 4%;
    border-color: #f70dff;
    border-radius: 10px;
    font-weight: bold;
    margin: 5px 10px;

    &:hover {
      color: white;
      background: #f70dff;
      border-color: #f70dff;
    }

    &:focus {
      color: white;
      background: #f70dff;
      border-color: #f70dff;
    }
`;

const CartButton = styled(Button)`
    width: 10%;
    height: 40px;
    color: white;
    border-color: #f70dff;
    border-radius: 10px;
    font-weight: bold;
    padding: 0;
    margin: 5px 0px;

    &:hover {
      color: white;
      background: #f70dff;
      border-color: #f70dff;
    }

    &:focus {
      color: white;
      background: #f70dff;
      border-color: #f70dff;
    }
`;

const StyledCollapse = styled(Collapse)`
      background: white;
      border-radius: 15px;
      overflow: hidden;
  `; 

const CollapsePanelHeader = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const menu = ()=>{
  let itemData = JSON.parse(localStorage.getItem('itemData')) ;
  return (
    <Menu className="shareMenu"
      items={[
        {
          key: '1',
          label: (
            <a className="iconColor" href={`https://telegram.me/share/?url=${window.location.href}&title=Check%20out%20this%20amazing%20NFT%20called%20${itemData && itemData.name}%20on%20SuperKluster`} target="_blank"><FaTelegram className="socialColor"/>&nbsp;&nbsp;Telegram</a>
          ),
        },
        {
          key: '2',
          label: (
            <a className="iconColor" href={`https://twitter.com/share/?url=${window.location.href}&text=Check%20out%20this%20amazing%20NFT%20called%20${itemData && itemData.name}%20on%20SuperKluster&hashtags=SuperKluster%2CNFT%2Cnonfungible%2Cdigitalasset%2Cnft&via=VoxelXnetwork`} target="_blank"><FaTwitter className="socialColor" />&nbsp;&nbsp;Twitter</a>
          ),
        },
        {
          key: '3',
          label: (
            <a className="iconColor" href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=Check%20out%20this%20amazing%20NFT%20called%20${itemData && itemData.name}%20on%20SuperKluster`} target="_blank"><FaFacebook className="socialColor"/>&nbsp;&nbsp;Facebook</a>
          ),
        },
        {
          key: '4',
          label: (
            <a className="iconColor" href={window.location.href} target="_blank"><FaGlobe className="socialColor"/>&nbsp;&nbsp;Link</a>
          ),
        },
      ]}
    />
  )
};

const SkeletonCard = () => {
  return (
    <section className="custom-container" style={{ paddingTop: "25px", marginTop: "20px" }}>
      <div className="row mt-md-5 pt-md-4">
        <div className="col-md-6 text-center">
          <div style={{ position: 'relative', height: '50%' }}>
            <Outer>
              <span>
                <Oval
                  strokeWidth={5}
                  strokeWidthSecondary={1}
                  color="#ccc"
                  secondaryColor="white"
                  ariaLabel='loading-indicator'
                />
              </span>
            </Outer>
          </div>
        </div>
        <div className="col-md-6">
          <div className="item_info">
            <div style={{ marginBottom: 15 }}>
              <SkeletonTheme color="#eee" highlightColor="#ccc">
                <Skeleton width={250} height={35} />
              </SkeletonTheme> 
            </div>
            <div className="item_info_counts">
              <div className="item_info_type">
                <SkeletonTheme color="#eee" highlightColor="#ccc">
                  <Skeleton count={1} />
                </SkeletonTheme> 
              </div>
              <div className="item_info_views">
                <SkeletonTheme color="#eee" highlightColor="#ccc">
                  <Skeleton count={1} />
                </SkeletonTheme>
              </div>
              <div className="item_info_like">
                <SkeletonTheme color="#eee" highlightColor="#ccc">
                  <Skeleton count={1} />
                </SkeletonTheme>
              </div>
            </div>
            <p>
              <SkeletonTheme color="#eee" highlightColor="#ccc">
                <Skeleton count={3} />
              </SkeletonTheme> 
            </p>

            <div className="d-flex flex-row">
              <div className="mr40">
                <h6>
                  <SkeletonTheme color="#eee" highlightColor="#ccc">
                    <Skeleton />
                  </SkeletonTheme> 
                </h6>
                <div className="item_author">
                  <div className="author_list_pp">
                    <SkeletonTheme color="#eee" highlightColor="#ccc">
                      <Skeleton height={50} width ={50} circle={true}/>
                    </SkeletonTheme>  
                  </div>
                  <div className="author_list_info">
                    <span>
                      <SkeletonTheme color="#eee" highlightColor="#ccc">
                        <Skeleton count={1} />
                      </SkeletonTheme> 
                    </span>
                  </div>
                </div>
              </div>
              <div className="mr40">
                <h6>
                  <SkeletonTheme color="#eee" highlightColor="#ccc">
                    <Skeleton />
                  </SkeletonTheme> 
                </h6>
                <div className="item_author">
                  <div className="author_list_pp">
                    <SkeletonTheme color="#eee" highlightColor="#ccc">
                      <Skeleton height={50} width ={50} circle={true}/>
                    </SkeletonTheme>
                  </div>
                  <div className="author_list_info">
                    <span>
                      <SkeletonTheme color="#eee" highlightColor="#ccc">
                        <Skeleton count={1} />
                      </SkeletonTheme> 
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="spacer-40"></div>

            <div className="de_tab">
              <div className="tab-content" id="pills-tabContent" style={{ marginTop: 33 }}>
                <div className="tab-pane fade show active  Non-" id="pills-details" role="tabpanel" aria-labelledby="details-tab" >
                  <div className="tab-1 onStep fadeIn">
                    <div className="d-block mb-3">
                      <div className="mr40">
                        <h6>
                          <SkeletonTheme color="#eee" highlightColor="#ccc">
                            <Skeleton />
                          </SkeletonTheme>  
                        </h6>
                        <div className="item_author">
                          <div className="author_list_pp">
                            <span>
                              <SkeletonTheme color="#eee" highlightColor="#ccc">
                                <Skeleton height={50} width ={50} circle={true}/>
                              </SkeletonTheme>
                            </span>
                          </div>
                          <div className="author_list_info">
                            <span>
                              <SkeletonTheme color="#eee" highlightColor="#ccc">
                                <Skeleton count={1} />
                              </SkeletonTheme>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="row mt-5">
                        <SkeletonTheme color="#eee" highlightColor="#ccc">
                          <Skeleton count={4} />
                        </SkeletonTheme>
                      </div>
                    </div>
                  </div>

                  <div className="tab-1 onStep fadeIn">
                    <div className="p_list">
                      <div className="p_list_pp">
                        <span>
                          <SkeletonTheme color="#eee" highlightColor="#ccc">
                            <Skeleton height={50} width ={50} circle={true}/>
                          </SkeletonTheme>
                        </span>
                      </div>
                      <div className="p_list_info">
                        <SkeletonTheme color="#eee" highlightColor="#ccc">
                          <Skeleton count={2}/>
                        </SkeletonTheme>
                      </div>
                    </div>
                  </div>

                  <div className="tab-2 onStep fadeIn">
                    <div className="p_list">
                      <div className="p_list_pp">
                        <span>
                          <SkeletonTheme color="#eee" highlightColor="#ccc">
                            <Skeleton height={50} width ={50} circle={true} />
                          </SkeletonTheme>
                        </span>
                      </div>
                      <div className="p_list_info">
                        <SkeletonTheme color="#eee" highlightColor="#ccc">
                          <Skeleton count={2}/>
                        </SkeletonTheme>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="de_tab_content">
                <h6>
                  <SkeletonTheme color="#eee" highlightColor="#ccc">
                    <Skeleton />
                  </SkeletonTheme> 
                </h6>
                <div className="nft-item-price">
                  <SkeletonTheme color="#eee" highlightColor="#ccc">
                    <Skeleton height={30} width ={30} circle={true} />
                  </SkeletonTheme>
                  <span
                    style={{
                      fontColor: "#0d0c22",
                      color: "#0d0c22",
                      fontWeight: "bold",
                      paddingRight: "10px",
                      paddingLeft: "10px",
                      marginBottom: "10px",
                      fontSize: 28
                  }}>
                    <SkeletonTheme color="#eee" highlightColor="#ccc">
                      <Skeleton />
                    </SkeletonTheme>
                  </span>
                </div>

                <div className="d-flex flex-row mt-3">
                  <div style={{ width: '40%', padding: '8px 0px' }}>
                    <SkeletonTheme color="#eee" highlightColor="#ccc">
                      <Skeleton />
                    </SkeletonTheme>
                  </div>
                  <div style={{ width: '40%', padding: '8px 0px' }}>
                    <SkeletonTheme color="#eee" highlightColor="#ccc">
                      <Skeleton />
                    </SkeletonTheme>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const ItemDetailPage = ({ nftId ,colormodesettle }) => {

  const { library } = useWeb3React();
  const { RangePicker } = DatePicker;

  const dateFormat = 'YYYY-MM-DD';

  const date = new Date();
  var d = new Date(date);
  var year = d.getFullYear();
  var month = '' + (d.getMonth() + 1);
  var day = '' + d.getDate();
  
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  const today = [year, month, day].join('-');

  const closeBtnClick = useRef(null);
  const closeReportBtnClick = useRef(null);
  const buyModalClose = useRef(null);
  const buySupplyModalClose = useRef(null);
  const auction_buyModalClose = useRef(null);
  const imageOriginalModalClose = useRef(null) ;
  const acceptBidClose = useRef(null);
  const modal_acceptBidClose = useRef(null);
  const bidModalClose = useRef(null);
  const modalTransferClose = useRef(null);
  

  const dispatch = useDispatch();
  const authorInfo = useSelector(selectors.authorInfoState).data;
  const historyData = useSelector(selectors.nftHistoryState).data;
  const bidHistoryData = useSelector(selectors.nftBidHistoryState).data;

  const account = localStorage.getItem('account') ;
  const accessToken = localStorage.getItem('accessToken') ;
  const header = { 'Authorization': `Bearer ${accessToken}` } ;

  const antIcon = <LoadingOutlined style={{ fontSize: 20, borderTop:'0px !important' }} spin />;
  
  const [isLoading, setLoading] = useState(false);
  const [isShowBtnState, setShowBtnState] = useState(true);
  const [isValidTransferAddr, setValidTransferAddr] = useState(false);

  const [isAmountUSD, setAmountUSD] = useState('');
  const [isAmountVXL, setAmountVXL] = useState('');
  const [isAmountUSD_show, setAmountUSD_show] = useState('');
  const [isAmountVXL_show, setAmountVXL_show] = useState('');
  const [transferAddr, setTransferAddr] = useState('');
  const [transferAmount, setTransferAmount] = useState(1);

  const [isToDate, setToDate] = useState('');
  const [isSkeletonLoadingState, setSkeletonLoadingState]=useState(false);
  const [isTopBarOffset, setTopBarOffset] = useState(75);
  const [loadImgStatus, setLoadImgStatus] = useState(false);
  const [itemData, setItemData] = useState(null);
  const [explorerUrl, setExplorer] = useState('https://etherscan.io');
  const [isOwnerBtnShow, setOwnerBtnShow] = useState(false);
  const [isCreatorBtnShow, setCreatorBtnShow] = useState(false);
  const [isCollectionData, setCollectionData] = useState([]);
  const [isPrevItem, setPrevItem] = useState(0);
  const [isNextItem, setNextItem] = useState(0);
  const [isShowMoreStatus, setShowMoreStatus] = useState(true);
  const [isUnixTimeStamp, setUnixTimeStamp] = useState('');
  const [isUSDPrice, setUSDPrice] = useState('');
  const [isETHPrice, setETHPrice] = useState('');
  const [isChangePrice, setChangePrice] = useState('');
  const [isChangePriceUsd, setChangePriceUSD] = useState('');
  const [isActiveBtn, setActiveBtn] = useState(false);
  const [isSellPeriodState, setSellPeriodState] = useState(true);
  const [isSaleEndDate, setSaleEndDate] = useState('');
  const [remainSaleEndTime , setRemainSaleEntTime] = useState('') ;
  const [loadingState, setLoadingState] = useState(false);
  const [isHistoryData , setHistoryData ] = useState('');
  const [isOwnersData, setOwnersData ] = useState([]);
  const [isBidHistoryData, setBidHistoryData] = useState('');
  const [isBidPrice, setBidPrice] = useState('');
  const [isAgreeWithTerms, setAgreeWithTerms] = useState(false);
  const [isClickConfirm , setClickConfirm] = useState(false) ;
  const [isAuctionEndDate, setAuctionEndDate] = useState('');
  const [remainAuctionEndTime , setRemainAuctionEndTime] = useState('') ;
  const [remainAuctionDuringTime , setRemainAuctionDuringTime] = useState('') ;
  const [isAuctionStartDate, setAuctionStartDate] = useState('');
  const [isLikedState, setLikedState] = useState(false);
  const [isLikeCounter, setLikeCounter] = useState(0);
  const [bidText , setBidText] = useState("Make offer") ;
  const [bidsOffer , setBidOffer] = useState('Bids') ;
  const [bidsOfferExpiration ,setBidOfferExpiration] = useState();
  const [acceptedType , setAcceptedType] = useState('bid placed') ;
  const [bidOfferPrice,setBidOfferPrice] = useState() ;
  const [saleType , setSaleType]=useState(1) ;
  const [expirationDate , setExpirationDate] = useState() ;
  const [expirationDateString, setExpirationDateString] = useState("");
  const [likeloading , setLikeloading] = useState(0) ;
  const [bidID , setBidID] = useState() ;
  const [copyToClipboardTxt, setCopyToClipboardTxt] = useState('Copy to clipboard');
  const [ownedSupplyNum , setOwnedSupplyNum] = useState(0) ;
  const [ownerId , setOwnerId] = useState(0) ;
  const [ethOption, setEthOption] = useState(false);

  const handleEthOption = async () => {
    if(ethOption == true) setEthOption(false);
    else setEthOption(true);
  }

  const [isVerifyIconColorA, setVerifyIconColorA] = useState("grey");
  const [isVerifyBState, setVerifyBState] = useState(false);
  const [isVerifyIconColorB, setVerifyIconColorB] = useState("grey");
  const [isVerifyCState, setVerifyCState] = useState(false);
  const [isVerifyIconColorC, setVerifyIconColorC] = useState("grey");
  const [isPropertiFlg , setPropertiFlg] = useState(false);
  const [isLevelFlg , setLevelFlg] = useState(false);
  const [isStatFlg , setStatFlg] = useState(false);
  const [isAuctionRemainFlg , setAuctionRemainFlg] = useState(false) ;
  const [isSaleRemainFlg , setSaleRemainFlg] = useState(false) ;
  const [isAuctionProcess , setAuctionProcess]  = useState() ;
  const [imageSelected , setImageSelected]   = useState() ;
  const [isClickBid , setClickBid] = useState(true) ;
  const [isListingsData, setListingsData] = useState([]);
  const [isCurrentListingItem, setCurrentListingItem] = useState([]);
  const [isListingsUsdPrice, setListingsUsdPrice] = useState(0);
  const auction_infoText = <div className="text-center" style={{ maxWidth: '467px' , padding:'8px' }}> <span>Seller has 7 days to execute the sell transaction (seller will be liable for the gas fee), if they do not fulfill their responsibility, seller will receive a negative badge rating against their name. <br/><br/>Buyer will have the option to execute to buy their item 48 hours before the auction item expires (buyer will be liable for the gas fee).</span> </div>
  const auction_infoText_sell = <div className="text-center" style={{ maxWidth: '467px' , padding:'8px' }}> <span>Warning: If seller does not execute sell transaction within 7 days before expiry, they will receive a negative rating on their rating badge.<br/><br/>If seller receives 5 warnings to their rating badge, their account will automatically be deactivated for 7 days.<br/><br/>If after reactivation, seller receives another 5 warnings to their rating badge, their account will automatically be deactivated for 30 days.<br/><br/>If after another reactivation, seller receives another 5 warnings to their rating badge, their account will automatically be deactivated for 365 days.</span> </div>
  const auction_infoText_buy = <div className="text-center" style={{ maxWidth: '467px' , padding:'8px' }}> <span></span> Warning: if the buyer does not have sufficient {currencyName(itemData? itemData.chain_id:null)} tokens for the seller to reasonably execute the sell transaction within the 7 days before expiry, they will receive a negative rating on their rating badge.<br/><br/>If the buyer receives 5 warnings to their rating badge, their account will automatically be deactivated for 7 days.<br/><br/>If after the account is reactivated, the buyer receives another 5 warnings to their rating badge, their account will automatically be deactivated for 30 days.<br/><br/>If after the account is reactivated again, the buyer receives another 5 warnings to to their rating badge, their account will automatically be deactivated for 365 days.</div>

  const [isChangePrice1155, setChangePrice1155] = useState('');
  const [isChangePriceUsd1155, setChangePriceUSD1155] = useState('');
  const [lowerPriceList, setLowerPriceList] = useState(-1);
  const [isQuantityState, setQuantityState] = useState(true);
  const [lowerPriceQuantity, setLowerPriceQuantity] = useState('');
  const [isSellPeriod1155State, setSellPeriod1155State] = useState(true);
  const [isToDate1155, setToDate1155] = useState('');
  const [is_721, setIs721] = useState(true);
  const [offerQuantity, setOfferQuantity] = useState('');
  const [offerQuantity_show, setOfferQuantity_show] = useState('');
  const [reserve_addr, setReserveAddr] = useState(null);
  const [blockchain, setBlockchain] = useState('Ethereum Main-Network');
  const [isCart, setIsCart] = useState(false);
  const [isSensitive, setIsSensitive] = useState(false);

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }
  
  const [width, height] = useWindowSize();

  useEffect(() => {
    if(!itemData || !account) return;
    let timerId = setInterval(() => {
      let flg = 0;
      let cartData = JSON.parse(localStorage.getItem('cartInfo'));
      for(let i = 0; i < cartData.length; i ++) {
        if(cartData[i].asset.id == itemData.id) {
          setIsCart(true);
          flg = 1;
          break;
        }
      }
      if(!flg) setIsCart(false);
    }, 1000)
    return () => {
      clearInterval(timerId) ;
    }
  }, [account, itemData])

  useEffect(() => {
    if(!itemData || !account || !accessToken) return;
    const postData = {};
    Axios.post(`/api/cart/my-cart`, postData, { headers: {'Authorization': `Bearer ${accessToken}`} })
    .then((res) => {
      if(!res.data || !res.data.data) return;
      let cartList = res.data.data;
      for(let i = 0; i < cartList.length;i ++) {
        if(itemData.id == cartList[i].asset.id) {
          setIsCart(true);
          return;
        }
      }
    })
    .then((e) => {
    })
  }, [account, itemData])

  useEffect(() => {
    if(!itemData) return;
    setExplorer('https://etherscan.io');
    if(itemData.chain_id == 5) setExplorer('https://goerli.etherscan.io');
    if(itemData.chain_id == 1) setExplorer('https://etherscan.io');
    
  }, [itemData])

  useEffect(() => {
    if(!itemData) return;
    setBlockchain('Ethereum Main-Network');
    if(itemData.chain_id == 1) setBlockchain('Ethereum Main-Network');
    if(itemData.chain_id == 5)  setBlockchain('Goerli Test-Network');
    if(itemData.chain_id == 137) setBlockchain('Polygon-Network');
    if(itemData.chain_id == 42161) setBlockchain('Arbitrum-Network');
    if(itemData.chain_id == 56) setBlockchain('Binance Smart Chain');
    if(itemData.chain_id == 250) setBlockchain('Fantom-Network');
    if(itemData.chain_id == 43114) setBlockchain('Avalanche-Network');
  }, [itemData])

  useEffect(() => {
    if(!itemData){
      setIs721(true);
      setReserveAddr(null);
      return;
    }
    setReserveAddr(itemData.reserve_address);
    if(itemData.is_voxel && itemData.is_721 || !itemData.is_voxel && itemData.collection.is_721) setIs721(true);
    else {
      setReserveAddr(null);
      setIs721(false);
    }
  }, [itemData]);


  const usd_price_set=(num)=>{
    let str = '' ;
    if(num > 1000) str = parseInt(num / 1000) + 'K' ;
    if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
    if(num < 1000) str = num.toFixed(0) ;
    return str ;
  }

  const usdPrice_num_usd=(num)=> {
    let str = '' ;
    if(num > 1000) str = parseFloat(parseInt(num / 100)/10) + 'K' ;
    if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
    if(num < 1000) str = num.toFixed(2) ;
    return str ;
  }

  const columns = [
    {
      title: 'From',
      dataIndex: 'from',
      render: content => <DescriptionDiv><a href={`author/${content.public_address}`}><span>{content.username}</span></a></DescriptionDiv>
    },
    {
      title: 'Price',
      dataIndex: 'unit_price',
      render: content => <DescriptionDiv>
        <div className="d-flex">
          <div>
            <div><img style={{ width: 16, height: 16, marginBottom: 5 ,marginLeft: 0 }} src={currencyLogo(itemData? itemData.chain_id : null)} /></div>
            <div className="text-center">$</div>
          </div>
          <div className="text-left">
            <div className="text-left">{usdPrice_num_usd(content/isListingsUsdPrice)}</div>
            <div className="text-left">{usdPrice_num_usd(content)}</div>
          </div>
        </div>
      </DescriptionDiv>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: content =><DescriptionDiv><span>{content}</span></DescriptionDiv>
    },
    {
      title: 'Expiration',
      dataIndex: 'expiration',
      render: time =><DescriptionDiv><TimeView time={time}/></DescriptionDiv>
    },
    {
      title: 'Action',
      dataIndex: [],
      render: (statusListing, content)  => <DescriptionDiv><ActionView statusListing={statusListing} content={content}></ActionView></DescriptionDiv>
    },
  ];

  useEffect(()=>{
      localStorage.setItem('footerflg','1');
      if(window.innerWidth >= 768) document.body.style.overflow = "hidden" ;
      else if(window.innerWidth < 1440) document.body.style.overflow = "visible" ;
      return()=>{
        document.body.style.overflow = "visible" ;
      }
  },[])

  const image_original_show =(image_original)=>{
    setImageSelected(image_original) ;
  }

  const setTimerFunc = async ()=>{
    let itemDetails;
    try {
      itemDetails = accessToken ?  await Axios.get(`/api/supply-assets/users/${nftId}`, { headers: header }) : await Axios.get(`/api/supply-assets/${nftId}`);
    } catch (e) {
      if(e.response.data.msg == 'not able to view.') setIsSensitive(true);
      return;
    }
    const itemDetail = itemDetails.data.asset ;
    
    if ((itemDetail && itemDetail.auction_end_date)) {
      const time_convert_end_sale = zonedTimeToUtc(new Date(itemDetail.auction_end_date  * 1000) , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
      const now_date_local_tz = zonedTimeToUtc(new Date() , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
      setRemainAuctionEndTime((time_convert_end_sale-now_date_local_tz) > 0 ? (time_convert_end_sale-now_date_local_tz) : 0 ) ;

    }
    if((itemDetail && itemDetail.sale_end_date)) {
      const time_convert_end_sale = zonedTimeToUtc(new Date(itemDetail.sale_end_date  * 1000) , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
      const now_date_local_tz = zonedTimeToUtc(new Date() , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
      setRemainSaleEntTime((time_convert_end_sale-now_date_local_tz) > 0 ? (time_convert_end_sale-now_date_local_tz) : 0 ) ;
    }
    if((itemDetail && itemDetail.auction_end_process == true )){
      const now_date_local_tz = zonedTimeToUtc(new Date() , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
      const auction_pay_end_date_init = zonedTimeToUtc(new Date(itemDetail.auction_pay_end_date * 1000) , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
      if((auction_pay_end_date_init.getTime() - now_date_local_tz.getTime()) <=24 * 3600 * 1000) setRemainAuctionDuringTime(auction_pay_end_date_init.getTime() - now_date_local_tz.getTime() > 0 ? (auction_pay_end_date_init.getTime() - now_date_local_tz.getTime()):0) ;
    }
  }
  
  useEffect(()=>{
    window.addEventListener('focus', setTimerFunc);
    return ()=>{
      window.removeEventListener('focus' , setTimerFunc);
    }
  },[])

  const getApproveInfo = async (account)=>{
    await isApproved(account, library)
        .then((res) => {
          if(res == true) {
            setShowBtnState(true);
          }else {
            setShowBtnState(false);
          }
        })
        .catch((err) => {
            setShowBtnState(localStorage.getItem('approvedToken'+account) == 'true');
        });
  }

  useEffect(()=>{
    setShowBtnState(localStorage.getItem('approvedToken'+account) == 'true');
    getApproveInfo(account) ;
  },[account, library])

  const [priceHistoryData, setPriceHistoryData] = useState([
    {
      "avg_sale_price": 80.00,
      "sale_date": "2022-12-21"
    },
    {
      "avg_sale_price": 60.00,
      "sale_date": "2022-12-26"
    }
  ]);

  const getPriceHistoryData = async () => {
    const param = {
      id: nftId
    }
    const {data} = await Axios.post('/api/activity/get-price-history', param);
    setPriceHistoryData(data);
  }

  const [configData, setConfigData] = useState({});

  useEffect(() => {
    if(!priceHistoryData) setConfigData(null);
    const data = priceHistoryData.map((item) => {
      return {sale_date: item.sale_date, avg_sale_price: parseInt(item.avg_sale_price), sale_num: parseInt(item.sale_num)}
    })
    if(priceHistoryData && priceHistoryData.length == 0) setConfigData(null);
    if(priceHistoryData && priceHistoryData.length > 0) {
      const tmp = {
        data,
        xField: 'sale_date',
        yField: 'avg_sale_price',
        columnWidthRatio: 0.8,
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: false,
          },
        },
        point: {
          size: 5,
          shape: 'diamond',
          style: {
            fill: 'white',
            stroke: '#5B8FF9',
            lineWidth: 2,
          },
        },
        meta: {
          avg_sale_price: {
            alias: 'Price(USD)',
          },
        },
        tooltip: {
          customContent: (title, data) => {
            if(!data) return `<div></div>`;
            if(data.length == 0) return `<div></div>`;
            else {
              return `<div style="padding-top:5px; padding-bottom:5px">
                      <div style="margin-top:2px;">${title}</div>
                      <div style="margin-top:2px;">Sale num : ${data[0].data.sale_num}</div>
                      <div style="margin-top:2px;">Price : ${data[0].data.avg_sale_price} USD</div>
                    </div>`;
            }
          }
        },
        maxColumnWidth: 35,
        color: '#f70dff',
        smooth: true
      };
      setConfigData(tmp);
    }
  }, [priceHistoryData])

  useEffect(() => {
    getItemDetailData();
    getPriceHistoryData();
    if (window.innerWidth > 1199) {
      setTopBarOffset(85)
    } else if (window.innerWidth <= 1199 && window.innerWidth > 768) {
      setTopBarOffset(75)
    } else if (window.innerWidth <= 768 && window.innerWidth > 400) {
      setTopBarOffset(70)
    } else {
      setTopBarOffset(60)
    }
    
    const timestamp = Date.now() + 30;
    setUnixTimeStamp(timestamp);

    dispatch(actions.fetchAuthorInfo(account));
  }, [])

  const getReturnValues_days = (countDown) => {
    const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
    return days ;
    
    };
  const getReturnValues_hours = (countDown) => {
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    if(hours < 10) return '0' + hours;
    return hours ;

  };

  const getReturnValues_minutes = (countDown) => {
      const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
      if(minutes < 10) return '0' + minutes;
      return minutes ;

  };
  const getReturnValues_seconds = (countDown) => {
      const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
      if(seconds < 10) return '0' + seconds;
      return seconds ;
      
  };

  const deleteMe=()=>{
    let resultHtml = `<div><img style="width:220px ;height:auto; border-radius:5px ; margin-bottom:10px " src = ${itemData && (itemData.image_preview ? itemData.image_preview : (itemData.image? itemData.image : itemData.raw_image) )} /><div><div style="margin-top:25px; word-break:keep-all;"><span style="font-weight:700 ; font-size:21px; ">Congratulations!</span><br/><br/> You now own <br/><span style="color:#f70dff;font-size:18px;font-weight:500; "> ${ itemData && itemData.name }</span><br/><br/><span style='font-size:13px;'> Let's share the good news with the world!</span></div><div class='swalhtml'>
        ${
              
          `<a style='color:#f70dff;' href=${`https://telegram.me/share/?url=${window.location.href}&title=I%20just%20bought%20this%20NFT%20called%20${itemData && itemData.name}%20on%20SuperKluster!%20Come%20check%20it%20out!`} target="_blank"><div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/>
          </svg></div></a>`
        }
        ${
              
          `<a style='color:#f70dff;' href=${`https://twitter.com/share/?url=${window.location.href}&text=I%20just%20bought%20this%20NFT%20called%20${itemData && itemData.name}%20on%20SuperKluster!%20Come%20check%20it%20out!&hashtags=SuperKluster%2CNFT%2Cnonfungible%2Cdigitalasset%2Cnft&via=VoxelXnetwork `} target="_blank"><div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16">
          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
          </svg></div></a>`    
        }
        ${
              
          `<a style='color:#f70dff;' href=${`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=I%20just%20bought%20this%20NFT%20called%20${itemData && itemData.name}%20on%20SuperKluster!%20Come%20check%20it%20out!`} target="_blank"><div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
          </svg></div></a>`
        }
            

        </div>` ;
              
    Swal.fire({
      html: resultHtml,  
      confirmButtonText: 'close',
      customClass: 'swal-height'
    })
              
  }

  useEffect(()=>{
    localStorage.setItem('itemData', JSON.stringify(itemData))
    let properti_flg = false ;
    let level_flg = false ;
    let stat_flg = false ;
    
    if(itemData && itemData.traits){
      for(let i = 0 ; i < itemData.traits.length ; i ++ ){
        if(itemData.traits[i].display_type == 'text') properti_flg = true ;
        if(itemData.traits[i].display_type == 'progress') level_flg = true ;
        if(itemData.traits[i].display_type == 'number') stat_flg = true ;
      }
    }
    setPropertiFlg(properti_flg);
    setLevelFlg(level_flg);
    setStatFlg(stat_flg);
  },[itemData]) ;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [nftId])

  useEffect(() => {
    if(historyData) {
      setHistoryData(historyData)
    }
  }, [historyData])

  useEffect(() => {
    if (bidHistoryData) {
      setBidHistoryData(bidHistoryData);
    }
  }, [bidHistoryData])

  useEffect(() => {
    setSkeletonLoadingState(true);
    const timer = setTimeout(() => {
      setSkeletonLoadingState(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [isCollectionData])

  const refresh= async ()=> {
    await Axios.post(`/api/assets/refresh-item/`, {id:itemData.id} , { headers: header })
      .then((res) => {
        Swal.fire({
          title: 'It worked!',
          text: 'Your updating request is successfully accepted! please wait!',
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })      
      })
      .catch((err)=>{
        Swal.fire({
          title: 'Oops...',
          text: 'Your updating request is failed! please try again later...',
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      })
  }

  const CancelBid = async (detail_bid , inx)=>{
    await Axios.post(`/api/bid/cancel-bid/`, {id:detail_bid.id} , { headers: header })
      .then((res) => {
        getItemDetailData();
        getHistoryData();
        getBidHistoryData();
      })
      .catch((err) => {
        Swal.fire({
          title: 'Oops...',
          text: err.response.data.msg,
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      });
  }

  const TimeView = ({ time }) => {
      const calcLeft = Math.floor( time * 1000 - new Date().getTime());
      const days = parseInt(calcLeft / (3600 * 24 * 1000 )) ;
      const hours = parseInt(calcLeft / (3600 * 1000)) ;
      const mins = parseInt(calcLeft / (60  * 1000)) ;
      if (days >= 1) {
        if (days === 1) {
            return <span>{`${days} day`}</span>
        } else {
            return <span>{`${days} days`}</span>
        }
      } else if (hours < 24 && hours >= 1) {
        if (hours === 1) {
          return <span>{`${hours} hour`}</span>
        } else {
          return <span>{`${hours} hours`}</span>
        }
      } else if (mins < 60 && mins >= 1) {
        if (mins === 1) 
          return <span>{`${mins} min`}</span>
        else return <span>{`${mins} mins`}</span>
      }
  }

  const buyListingItem = async (e, list_id) => {
    e.preventDefault();
    setLoadingState(true);
    await Axios.post("/api/supply-sale/buy-item/", {id:list_id, ethOption: ethOption}, { headers: header })
    .then( async (res) => {
      if(res.data.can_buy == false) {
        buyModalClose.current.click();
        buySupplyModalClose.current.click();
        setClickConfirm(false) ;
        setLoadingState(false);
        Swal.fire({
          title: 'Oops...',
          text: 'This item is not available to buy.',
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return;
      }
      await getBuyAction(ethOption, library, account, itemData, res.data.creator, res.data._price, res.data.quantity, res.data._royaltyAmount, res.data._deadline, res.data.signature, res.data.shouldMint, res.data.tokenURI, res.data.mintQty, res.data.collectionAddr, res.data.seller)
        .then(async(txHash) => {
          if(txHash != '0x0') {
            await sendBuyItemTxHash(txHash) ; 
          }
          localStorage.setItem('currentPrice',parseFloat(itemData.price / itemData.usdPrice).toFixed(2)) ;
          buyModalClose.current.click();
          buySupplyModalClose.current.click();
          setClickConfirm(false) ;
          setLoadingState(false);
          deleteMe() ;

          getItemDetailData() ;
          getHistoryData() ;
          getPriceHistoryData();
          getBidHistoryData() ;
          getMyBalanceData('buy') ;
          buyModalClose.current.click();
          buySupplyModalClose.current.click();
        })
        .catch((err) => {
          buyModalClose.current.click();
          buySupplyModalClose.current.click();
          setLoadingState(false);
          setClickConfirm(false) ;
          if(err.code != 4001) {
            Swal.fire({
              title: 'Oops...',
              text: 'Transaction Failed',
              icon: 'error',
              confirmButtonText: 'Close',
              timer:5000,
              customClass: 'swal-height'
            })
          }
        });
    })
    .catch((err) => { 
      Swal.fire({
        title: 'Oops...',
        text: 'Something went wrong!',
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      });
      buyModalClose.current.click();
      buySupplyModalClose.current.click();
    });
    setEthOption(false);
  }

  const cancelListingItem = async (e, list_id) => {
    e.preventDefault();
    await Axios.post(`/api/supply-assets/cancel-list/`, {id:list_id} , { headers: header })
      .then(async (res) => {
        const listingsData = await Axios.post(`/api/supply-sale/get-listing-list`, { "id": nftId });
        setListingsData(listingsData.data.data);
        setListingsUsdPrice(listingsData.data.usdPrice);

        Swal.fire({
          title: 'It worked!',
          text: 'Cancel listing success!',
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
          
      })
      .catch((err) => {
        Swal.fire({
          title: 'Oops...',
          text: err.response.data.msg,
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      });
  }

  const ActionView = ({content}) => {
    if (accessToken) {
      if (content.from.public_address.toLowerCase() == account?.toLowerCase()) {
        return (
          <div>
            <button className="ant-btn ant-btn-pink ItemBtnHover" onClick={(e) => cancelListingItem(e, content.list_id)}>Cancel</button>
          </div>
        )
      } else if(!content.reserve_address || content.reserve_address.toLowerCase() == account?.toLowerCase()) {
        return <button className="ant-btn ant-btn-pink ItemBtnHover" data-bs-toggle="modal" data-bs-target="#buySupplyModal" onClick={(e) => setCurrentListingItem(content)}>Buy</button>
      } else {
        return <button className="ant-btn ItemBtnHover" disabled = {true}>Reserved</button>
      }
    } else {
      return <></>;
    }
  }

  const call_endAuction = async (pass_time) =>{
    if(pass_time >= 8 ) {
      Swal.fire({
        title: 'Oops...',
        text: 'Time is over.',
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
      setAuctionProcess(false) ;
      return ;
    }
    let itemDetails_auction;
    try {
      itemDetails_auction = accessToken ?  await Axios.get(`/api/supply-assets/users/${nftId}`, { headers: header }) : await Axios.get(`/api/supply-assets/${nftId}`);
    } catch (e) {
      Swal.fire({
        title: 'Oops...',
        text: 'Something went wrong.',
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
      setAuctionProcess(false) ;
      return ;
    }
    
    const itemDetail_auction = itemDetails_auction.data.asset.auction_end_process ;
    if(itemDetail_auction == false) setTimeout(()=> call_endAuction(pass_time+2) , 20000) ;
    else {
      setAuctionProcess(false) ;
      getItemDetailData() ;
      getHistoryData() ;
      getBidHistoryData() ;
    }
  }

  const sendBuyItemTxHash = async (txHash, times = 0) => {
    const send_Data = {
      transaction_hash : txHash
    }
    if (times > 60) {
      Swal.fire({
        title: 'Oops...',
        text: `Transaction Error - Tx Hash is invalid`,
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
    }
    try {
      const result = await Axios.post("/api/sale/check-buytxhash/", send_Data, { headers: header });
      if (result.data.data.checked) {
        return;
      }
    } catch (err) {
      Swal.fire({
        title: 'Oops...',
        text: err.response.data.msg,
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
    }
    setTimeout(() => sendAddItemTxHash(txHash, ++times), 1000);
  }  

  const sendTransferTxHash = async (txHash, times = 0) => {
    const send_Data = {
      transaction_hash : txHash
    }

    if (times > 60) {
      Swal.fire({
        title: 'Oops...',
        text: `Transaction Error - Tx Hash is invalid`,
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
    }

    try {
      const result = await Axios.post("/api/sale/register-transfertxhash/", send_Data, { headers: header });
      if (result.data.data.checked) {
        return;
      }
    } catch (err) {
      Swal.fire({
        title: 'Oops...',
        text: err.response.data.msg,
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
    }
    setTimeout(() => sendTransferTxHash(txHash, ++times), 1000);
  }

  const sendAddItemTxHash = async (txHash, times = 0) => {   
    const send_Data = {
      transaction_hash : txHash
    }
    if (times > 60) {
        Swal.fire({
          title: 'Oops...',
          text: `Transaction Error - Tx Hash is invalid`,
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
    } 
    try {
      const result = await Axios.post("/api/sale/check-addtxhash/", send_Data, { headers: header });
      if (result.data.data.checked) {
        return;
      }
    } catch (err) {
      Swal.fire({
        title: 'Oops...',
        text: err.response.data.msg,
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
    }
    setTimeout(() => sendAddItemTxHash(txHash, ++times), 1000);
  }

  const sendAcceptItemTxHash = async (txHash, times = 0) => {
    const send_Data = {
      transaction_hash : txHash
    }
    if (times > 60) {
        Swal.fire({
          title: 'Oops...',
          text: `Transaction Error - Tx Hash is invalid`,
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
    }
    try {
      const result = await Axios.post("/api/sale/check-accepttxhash/", send_Data, { headers: header });
      if (result.data.data.checked) {
        return;
      }
    } catch (err) {
      Swal.fire({
        title: 'Oops...',
        text: err.response.data.msg,
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
    }
    setTimeout(() => sendAddItemTxHash(txHash, ++times), 1000);
  }

  useEffect(()=>{
    const timer_duration = remainAuctionDuringTime > 0 && setTimeout(()=> setRemainAuctionDuringTime(remainAuctionDuringTime => (remainAuctionDuringTime - 1000) >= 0 ? (remainAuctionDuringTime - 1000) : 0) ,1000) ;
    return ()=> clearTimeout(timer_duration) ;
  },[remainAuctionDuringTime]) ;

  useEffect(() => {
    const timer = remainSaleEndTime > 0 && setTimeout(()=> setRemainSaleEntTime(remainSaleEndTime => (remainSaleEndTime - 1000) >= 0 ? (remainSaleEndTime - 1000) : 0) ,1000) ;
    return ()=> clearTimeout(timer) ;
  }, [remainSaleEndTime]) ;

  useEffect(() => {
    if(isAuctionRemainFlg && remainAuctionEndTime == 0 ) {
      setAuctionProcess(true) ;
      call_endAuction(0) ; 
    }
    const timer_auction = remainAuctionEndTime > 0 && setTimeout(()=> setRemainAuctionEndTime(remainAuctionEndTime => (remainAuctionEndTime - 1000) >= 0 ? (remainAuctionEndTime - 1000) : 0) ,1000) ;
    return ()=> clearTimeout(timer_auction) ;

  }, [remainAuctionEndTime]) ;

  const [canBuy, setCanBuy] = useState(false);
  const [lowPrice, setLowPrice] = useState(0);
  const [lowListId, setLowListId] = useState(0);
  const [saleEndDate1155, setSaleEndDate1155] = useState(0);

  useEffect(() => {
    if(isListingsData.length == 0) {
      setLowPrice(-1);
      return;
    }
    let _lowPrice = -1, listId = -1;
    for(let i = 0; i < isListingsData.length; i ++) {
      if(isListingsData[i].from.public_address.toLowerCase() == account?.toLowerCase()) continue;
      if(isListingsData[i].reserve_address && isListingsData[i].reserve_address.toLowerCase() != account?.toLowerCase()) continue;
      if(_lowPrice < 0) {
        _lowPrice = isListingsData[i].unit_price;
        listId = i;
        setSaleEndDate1155(isListingsData[i].expiration);
      }
      if(_lowPrice > isListingsData[i].unit_price) {
        _lowPrice = isListingsData[i].unit_price;
        listId = i;
        setSaleEndDate1155(isListingsData[i].expiration);
      }
    }
    if(_lowPrice > 0){
      setCanBuy(true);
      setLowPrice(_lowPrice);
      setLowListId(listId);
    } else {
      setCanBuy(false);
    }
    if(!account) setCanBuy(false);
  }, [isListingsData, account])

  const getItemDetailData = async () => {
    let itemDetails;
    try {
      itemDetails = accessToken ?  await Axios.get(`/api/supply-assets/users/${nftId}`, { headers: header }) : await Axios.get(`/api/supply-assets/${nftId}`);
    } catch (e) {
      if(e.response.data.msg == 'not able to view.') setIsSensitive(true);
      return;
    }
    
    const itemDetail = itemDetails.data.asset ;
    var Owned = false;
    itemDetail.owners.forEach(element => {
      if (account && element.owner.public_address.toLowerCase() == account.toLowerCase()) {
        setOwnerId(element.id);
        setOwnedSupplyNum(element.quantity);
        Owned = true;
      }
    });
    if(!Owned) setOwnedSupplyNum(0);
    const listingsData = await Axios.post(`/api/supply-sale/get-listing-list`, { "id": nftId });
    setListingsUsdPrice(listingsData.data.usdPrice);
    setListingsData(listingsData.data.data);

    if (itemDetail) {
      const saleEndDate = itemDetail.sale_end_date;
      var eDate = new Date(saleEndDate * 1000),
          year = eDate.getFullYear(),
          month = '' + (eDate.getMonth() + 1),
          day = '' + eDate.getDate()
  
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      setItemData(itemDetail) ;
      setLikeCounter(itemDetail.favs.length) ;
      setChangePrice(itemDetail.price) ;
      setBidPrice(itemDetail.price / itemDetail.usdPrice) ;
      setUSDPrice(itemDetail.usdPrice) ;
      setETHPrice(itemDetail.ethUsdPrice);
      setSaleType(itemDetail.sale_type);

      if (itemDetail.sale_type == 2 && is_721) {
        setBidText("Place a bid") ;
        setBidOffer("Bids") ;
        setBidOfferExpiration("Bid Expiration") ;
        setAcceptedType('bid placed') ;
        setBidOfferPrice('Please enter your bid price')
        
        const time_convert = zonedTimeToUtc(new Date(itemDetail.auction_end_date * 1000) , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
        const time_convert_start = zonedTimeToUtc(new Date(itemDetail.auction_start_date * 1000) , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
        const now_date_local_tz = zonedTimeToUtc(new Date() , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
        const auction_pay_end_date_init = zonedTimeToUtc(new Date(itemDetail.auction_pay_end_date * 1000) , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
        const auctionEndTime = (time_convert.getDate()/10 < 1 ? ('0'+time_convert.getDate()):time_convert.getDate())+
          "."+((time_convert.getMonth()+1)/10 < 1 ?('0'+(time_convert.getMonth()+1)) : (time_convert.getMonth()+1))+                            
          "."+time_convert.getFullYear().toString().slice(-2)+
          " "+(time_convert.getHours() /10 < 1 ? ('0'+time_convert.getHours()):time_convert.getHours())+
          ":"+(time_convert.getMinutes() / 10 < 1 ? ('0'+time_convert.getMinutes()):time_convert.getMinutes())+
          " "+(new Date()
          .toLocaleDateString('en-US', {
            day: '2-digit',
            timeZoneName: 'short',
          })
          .slice(4));
        setAuctionEndDate(auctionEndTime);
        setRemainAuctionEndTime(time_convert.getTime() - now_date_local_tz.getTime() > 0 ? time_convert.getTime() - now_date_local_tz.getTime() : 0) ;
        if((auction_pay_end_date_init.getTime() - now_date_local_tz.getTime()) <=24 * 3600 * 1000) setRemainAuctionDuringTime(auction_pay_end_date_init.getTime() - now_date_local_tz.getTime() > 0 ? (auction_pay_end_date_init.getTime() - now_date_local_tz.getTime()):0) ;
        setAuctionRemainFlg(true) ;
        const auctionStartTime = (time_convert_start.getDate() / 10 < 1 ? ('0'+time_convert_start.getDate()) : time_convert_start.getDate()) +
          "." + ((time_convert_start.getMonth()+1) / 10 < 1 ? ( '0'+(time_convert_start.getMonth()+1)) : ((time_convert_start.getMonth()+1)))+
          "." + time_convert_start.getFullYear().toString().slice(-2)+
          " " + (time_convert_start.getHours() / 10 < 1 ? ('0'+time_convert_start.getHours()) : time_convert_start.getHours())+
          ":" + (time_convert_start.getMinutes() / 10 < 1 ? ('0'+time_convert_start.getMinutes()) : time_convert_start.getMinutes())+
          " " + (new Date()
          .toLocaleDateString('en-US', {
            day: '2-digit',
            timeZoneName: 'short',
          })
          .slice(4));
        setAuctionStartDate(auctionStartTime);
      }else {
        setBidText("Make offer");
        setBidOffer("Offers") ;
        setBidOfferExpiration("Offer Expiration") ;
        setAcceptedType('offer made') ;
        setBidOfferPrice('Please enter your offer price')

        const time_convert_end_sale = zonedTimeToUtc(new Date(itemDetail.sale_end_date  * 1000) , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
        const now_date_local_tz = zonedTimeToUtc(new Date() , Intl.DateTimeFormat().resolvedOptions().timeZone) ;
        const saleEndTime = (time_convert_end_sale.getDate()/ 10 < 1 ? ('0'+time_convert_end_sale.getDate()) : time_convert_end_sale.getDate())+
          "."+((time_convert_end_sale.getMonth()+1) / 10 < 1 ? ('0'+(time_convert_end_sale.getMonth()+1)) : (time_convert_end_sale.getMonth()+1))+
          "."+time_convert_end_sale.getFullYear().toString().slice(-2)+
          " "+(time_convert_end_sale.getHours() / 10 < 1 ? ('0'+time_convert_end_sale.getHours()) : time_convert_end_sale.getHours())+
          ":"+(time_convert_end_sale.getMinutes() / 10 < 1 ? ('0'+time_convert_end_sale.getMinutes()):time_convert_end_sale.getMinutes())+
          " "+(new Date()
          .toLocaleDateString('en-US', {
            day: '2-digit',
            timeZoneName: 'short',
          })
          .slice(4));
        setSaleEndDate(saleEndTime);
        setRemainSaleEntTime(time_convert_end_sale.getTime() - now_date_local_tz.getTime() > 0 ? time_convert_end_sale.getTime() - now_date_local_tz.getTime()  : 0) ;
        setSaleRemainFlg(true) ;
      }
    }

    //show nfts in same collection
    const moreItemsPost = {
      collection_id: itemDetail.collection.id,
      id: itemDetail.id
    }
    const result = await Axios.post('/api/supply-assets/more-items', moreItemsPost);
    const nfts = result.data.data;
    if (nfts && nfts.length > 0) {
      if (nfts.length > 4) setCollectionData(nfts.slice(0,4)) ;
      else setCollectionData(nfts) ;
    }

    //show the sell button if the nft is minted by user
    if ((account && account.toLowerCase()) === (itemDetail && itemDetail.owner_of.toLowerCase())) {
      setOwnerBtnShow(true)
    }else{
      setOwnerBtnShow(false)
    }
    
    if ((account && account.toLowerCase()) === (itemDetail.creator && itemDetail.creator.public_address.toLowerCase())) {
      setCreatorBtnShow(true)
    }else{
      setCreatorBtnShow(false)
    }

    if(itemDetail.is_voxel && !itemDetail.is_721 || !itemDetail.is_voxel && !itemDetail.collection.is_721) {
      setOwnerBtnShow(false);
      setCreatorBtnShow(false);
    }

    try {
      let nextId = Number(nftId) + 1;
      if (nftId == 1) {
        setPrevItem(1)
        setNextItem(nextId)
      } else {
        setPrevItem(Number(nftId) - 1)
        setNextItem(nextId)
      }

    } catch(err) {
      if(err) {
        setNextItem(Number(nftId))
      }
    }
  }

  useEffect(() => {
    if (itemData && authorInfo) {
      const favs = itemData.favs;
      const myFav = favs.filter((item) => (authorInfo && authorInfo.id) == (item.user && item.user.id));
      if (myFav.length > 0) {
        setLikedState(true)
      }
    }
  }, [authorInfo, itemData])
  
  const navigate = useNavigate();
  
  const authorCollection =(public_address)=>{
    navigate(`/author/${public_address}`) ;
  }

  const authorCollection_history =(data )=>{
    if(data.activity == 'mint' || data.activity == 'sold' ) navigate(`/author/${data.to.address}`) ;
    else navigate(`/author/${data.from.address}`) ;
  }
  
  const moveToCollectionPage = (param) => {
    navigate(`/collection-detail/${param}`) ;
  }
  
  const moveToListingPage = (param) => {
    localStorage.setItem('itemData', JSON.stringify(itemData))
    localStorage.setItem('ownedSupplyNum', ownedSupplyNum)
    localStorage.setItem('ownerId', ownerId)
    navigate(`/assets/sell/${param}`)
  }

  const handleApproveAction = async (buy_price) => {
    setLoadingState(true);
    await getApprove(account, library, buy_price)
    .then((res) => {
      if(res == true) {
        setLoadingState(false);
        setShowBtnState(true);
        localStorage.setItem('approvedToken'+account, true);
      }
    })
    .catch((err) => {
      closeBtnClick.current.click();
      if(err.code != 4001) {
        Swal.fire({
          title: 'Oops...',
          text: 'Transaction Failed',
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      }
      setLoadingState(false);
    });
  }

  const handleAcceptAction = async (inx, signedData) => {
    setLoadingState(true);
    await getAcceptAction(library, account, isBidHistoryData[inx],itemData.token_id ,itemData, signedData)
      .then(async (tsHash) => {
        await sendAcceptItemTxHash(tsHash);
        setVerifyCState(false);
        setVerifyIconColorC("#1fb30d");
        localStorage.setItem('currentPrice',parseFloat(isBidHistoryData[inx].price / itemData.usdPrice).toFixed(2)) ;
        modal_acceptBidClose.current.click();
        Swal.fire({
          title: 'It worked!',
          text: 'Congratulations, the auction has now been finalized and the NFT has been transfered!',
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        getItemDetailData() ;
        getHistoryData() ;
        getPriceHistoryData();
        getBidHistoryData() ;
        getMyBalanceData('sell') ;
      })
      .catch((err) => {
        setVerifyCState(false);
        modal_acceptBidClose.current.click();
        if(err.code != 4001) {
          Swal.fire({
            title: 'Oops...',
            text: 'Transaction Failed',
            icon: 'error',
            confirmButtonText: 'Close',
            timer:5000,
            customClass: 'swal-height'
          })
        }
      });
  }

  const handleBuyAction = async () => {
    setClickConfirm(true) ;
    setLoadingState(true);
    const send_Data = {
      id : itemData.id,
      usdPrice: itemData.usdPrice,
      ethOption: ethOption
    }
    await Axios.post("/api/sale/buy-item/", send_Data, { headers: header })
      .then( async (res) => {
        if(res.data.can_buy == false) {
          buyModalClose.current.click();
          buySupplyModalClose.current.click();
          setLoadingState(false);
          setClickConfirm(false) ;
          Swal.fire({
            title: 'Oops...',
            text: 'This item is not available to buy.',
            icon: 'error',
            confirmButtonText: 'Close',
            timer:5000,
            customClass: 'swal-height'
          })
          return;
        }
        await getBuyAction(ethOption, library, account, itemData, res.data.creator, res.data._price, 1, res.data._royaltyAmount, res.data._deadline, res.data.signature, res.data.shouldMint, res.data.tokenURI, 1)
          .then(async(txHash) => {
            if(txHash != '0x0') {
              await sendBuyItemTxHash(txHash) ; 
            }
            localStorage.setItem('currentPrice',parseFloat(itemData.price / itemData.usdPrice).toFixed(2)) ;
            buyModalClose.current.click();
            buySupplyModalClose.current.click();
            setClickConfirm(false) ;
            setLoadingState(false);
            deleteMe() ;

            getItemDetailData() ;
            getHistoryData() ;
            getPriceHistoryData();
            getBidHistoryData() ;
            getMyBalanceData('buy') ;
            buyModalClose.current.click();
            buySupplyModalClose.current.click();
          })
          .catch((err) => {
            buyModalClose.current.click();
            buySupplyModalClose.current.click();
            setLoadingState(false);
            setClickConfirm(false) ;
            if(err.code != 4001) {
              Swal.fire({
                title: 'Oops...',
                text: 'Transaction failed',
                icon: 'error',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
              })
            }
          });
      })
      .catch((err) => { 
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        });
        buyModalClose.current.click();
        buySupplyModalClose.current.click();
      });
      setEthOption(false);
  }

  const handleBuyAction_auctionBetween = async (data_bid , inx) => {
    const send_Data = {
      id : itemData.id,
      usdPrice: itemData.usdPrice,
      bid_id: data_bid? data_bid['id']:0,
      ethOption: ethOption
    }
    await Axios.post("/api/sale/buy-item/", send_Data, { headers: header })
      .then( async (res) => {
        if(res.data.can_buy == false){
          Swal.fire({
            title: 'Oops...',
            text: 'Expiration time passed!',
            icon: 'error',
            confirmButtonText: 'Close',
            timer:5000,
            customClass: 'swal-height'
          })
          auction_buyModalClose.current.click();
        }else {
          setLoadingState(true);
          await getBuyAction_buyer_auction(ethOption, library, account, itemData, res.data.creator, res.data._price, res.data._royaltyAmount, res.data._deadline, res.data.signature, res.data.shouldMint, res.data.tokenURI, 1)
          .then(async(txHash) => {
            if(txHash != '0x0') {
              await sendBuyItemTxHash(txHash);
            }
            localStorage.setItem('currentPrice',parseFloat(itemData.price / itemData.usdPrice).toFixed(2)) ;
            auction_buyModalClose.current.click();
            setLoadingState(false);
            Swal.fire({
              title: 'It worked!',
              text: 'Congratulations! You now own this NFT!',
              icon: 'success',
              confirmButtonText: 'Close',
              timer:5000,
              customClass: 'swal-height'
            })
            getItemDetailData() ;
            getHistoryData() ;
            getPriceHistoryData();
            getBidHistoryData() ;
            getMyBalanceData('buy') ;

          })
          .catch((err) => {
            console.log(err);
            auction_buyModalClose.current.click();
            setLoadingState(false);
            if(err.code != 4001) {
              Swal.fire({
                title: 'Oops...',
                text: 'Transaction Failed',
                icon: 'error',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
              })
            }
          });
        }
      })
      .catch((err) => { 
        Swal.fire({
          title: 'Oops...',
          text: err.response.data.msg,
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        });
        auction_buyModalClose.current.click();
      });
  }

  const onChangeExpiration = (value, dateString) =>{
    setExpirationDateString(dateString);
    if(!value) {
      setExpirationDate('');
      return;
    }
    setExpirationDate(value.unix()) ;
  }

  const handleTermsCheck = (e) => {
    setAgreeWithTerms(e.target.checked);
  }

  const handleSwitch = (checked) => {
    setSellPeriodState(checked);
  }

  const handleSwitch1155 = (checked) => {
    setSellPeriod1155State(checked);
  }

  const handleQuantity = (checked) => {
    setQuantityState(checked);
  }
  
  const onDateChange = (dates, dateStrings) => {
    setToDate(dateStrings[1]);
  }

  const onDate1155Change = (dates, dateStrings) => {
    setToDate1155(dateStrings[1]);
  }

  const usd_price_set_usd=(num)=> {
    let str = '' ;
    if(num > 1000) str = parseFloat(parseInt(num / 100)/10) + 'K' ;
    if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
    if(num < 1000) str = num.toFixed(2) ;
    return str;
  }
  const handlePriceInput = (e) => {
    const value = e.target.value;
    setChangePrice(value)
    setChangePriceUSD((value / itemData.usdPrice).toFixed(2))
    if (value > 0 && value <= itemData.price) {
      setActiveBtn(true)
    } else {
      setActiveBtn(false)
    }
  }

  const handlePriceInput1155 = (e) => {
    const value = e.target.value;
    setChangePrice1155(value)
    setChangePriceUSD1155((value / isListingsUsdPrice).toFixed(2))
    if (value > 0 && isListingsData && lowerPriceList >= 0 && value <= isListingsData[lowerPriceList].unit_price) {
      setActiveBtn(true)
    } else {
      setActiveBtn(false)
    }
  }

  const handleLowerPriceQuantity = (e) => {
    const value = e.target.value;
    setLowerPriceQuantity(value);
  }

  const handleTransferAddress = (e) => {
    const value = e.target.value;
    if (!account || !ethers.utils.isAddress(value) || value.toLowerCase() == account.toLowerCase()) {
      setValidTransferAddr(false);
    } else {
      setValidTransferAddr(true);
    }
    setTransferAddr(value);
  }

  const handleTransferAmount = (e) => {
    const value = e.target.value;
    if(isNaN(value)) {
      setTransferAmount(1);
      return;
    }
    if(value == '') {
      setTransferAmount(1);
      return;
    }
    if(parseInt(value) > itemData.transfer_available_amount) {
      setTransferAmount(itemData.transfer_available_amount);
    }
    else {
      setTransferAmount(parseInt(value));
    }
  }

  const clearTransferAddr = async () => {
    setTransferAddr('');
  }

  const handleTransfer = async () => {
    let _transferAmount = transferAmount;
    if(itemData.is_721) {
      _transferAmount = 0;
    }
    if(itemData.status =='pending' && isValidTransferAddr && itemData.is_721) {
      const send_Data = {
        assetId : itemData.id,
        to : transferAddr,
        amount: transferAmount
      }
      setLoadingState(true);
      await Axios.post("/api/assets/offchain-transfer/", send_Data, { headers: header })
      .then( async (res) => {
        setLoadingState(false);
        modalTransferClose.current.click();
        getItemDetailData();
        getHistoryData();
        getBidHistoryData();
        setTransferAddr('');
      }).catch ((error) => {
        setLoadingState(false);
        modalTransferClose.current.click();
        if (error.response && error.response.status =='500'){
          Swal.fire({
            title: 'Oops...',
            text: `Offchain Transfer Error -${error.response.msg}`,
            icon: 'error',
            confirmButtonText: 'Close',
            timer:5000,
            customClass: 'swal-height'
          })
        }
      });
      return;
    }
    if (isValidTransferAddr) {
      setLoadingState(true);
      try {
        let tokenId = itemData.token_id;
        let collectionAddr;
        if(itemData.is_voxel) collectionAddr = itemData.contract_address;
        else collectionAddr = itemData.collection.contract_address;
        await transferItem(library, account, transferAddr, tokenId, _transferAmount, collectionAddr, itemData.collection.chain_id, itemData.is_721)
        .then(async(txHash) => {
          Swal.fire({
            title: 'It worked!',
            text: 'The NFT is transferred successfully.',
            icon: 'success',
            confirmButtonText: 'Close',
            timer:5000,
            customClass: 'swal-height'
          });
          if(txHash != '0x0') {
            await sendTransferTxHash(txHash);
          }
        }).catch((err) => {
          if(err.code != 4001) {
            Swal.fire({
              title: 'Oops...',
              text: 'Transaction failed.',
              icon: 'error',
              confirmButtonText: 'Close',
              timer:5000,
              customClass: 'swal-height'
            });
          }
        });
        setLoadingState(false);
        modalTransferClose.current.click();
        getItemDetailData();
        getHistoryData();
        getBidHistoryData();
        setTransferAddr('');
      } catch (e) {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        });
        setLoadingState(false);
        modalTransferClose.current.click();
        setTransferAddr('');
      }
    } else {
      return;
    }
  }

  const setValidFixedPriceUSD = (value) => {
    if (value > 10000000) {
      value = 10000000;
    }
    setFixedPriceUSD(value);
  } 

  const setValidFixedPriceVXL = (value) => {
    setFixedPriceVXL(value);
  }

  const handlePriceInputUSD = (e) => {
    const value = e.target.value ;
    setChangePriceUSD(value) ;
    setChangePrice((value * itemData.usdPrice).toFixed(2)) ;
    if ((value * itemData.usdPrice).toFixed(2) > 0 && (value * itemData.usdPrice).toFixed(2) <= itemData.price) {
      setActiveBtn(true)
    } else {
      setActiveBtn(false)
    }
  }

  const handlePriceInputUSD1155 = (e) => {
    const value = e.target.value ;
    setChangePriceUSD1155(value) ;
    setChangePrice1155((value * itemData.usdPrice).toFixed(2)) ;
    if ((value * itemData.usdPrice).toFixed(2) > 0 && (value * isListingsUsdPrice).toFixed(2) <= itemData.price) {
      setActiveBtn(true)
    } else {
      setActiveBtn(false)
    }
  }

  const handleCancelListing = async () => {
    const postData = {
      id: nftId
    }
    await Axios.post("/api/assets/cancel-list", postData, { headers: header })
    .then((res) => {
      Swal.fire({
        title: 'It worked!',
        text: `${res.data.msg}`,
        icon: 'success',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
      getItemDetailData();
      getHistoryData();
      getBidHistoryData();
    })
    .catch((err) => {
      Swal.fire({
        title: 'Oops...',
        text: err.response.data.msg,
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
    });
  }

  const handleSetNewPrice = async () => {
    const itemInfo = {
        type: "fixed",
        price: isChangePrice,
        toDate: isToDate,
        tokenId: itemData.token_id,
        collection: itemData.collection.name,
        quantity: 1,
        acc: account
    }
    setLoadingState(true);
    await signMessage(itemInfo, library)
      .then((res) => {
        handlePost(res);
      })
      .catch((err) => {
        setLoadingState(false)
        closeBtnClick.current.click();
        if(err.code != 4001) {
          Swal.fire({
            title: 'Oops...',
            text: `Transaction Failed`,
            icon: 'error',
            confirmButtonText: 'Close',
            timer:5000,
            customClass: 'swal-height'
          })
        }
      });
  }

  const handleSetNewPrice1155 = async () => {
    const itemInfo = {
      type: "fixed",
      price: isChangePrice1155,
      toDate: isToDate1155,
      tokenId: itemData.token_id,
      collection: itemData.collection.name,
      quantity: lowerPriceQuantity,
      acc: account
    }
    setLoadingState(true);
    await signMessage(itemInfo, library)
    .then((res) => {
      handlePost1155(res);
    })
    .catch((err) => {
      setLoadingState(false)
      closeBtnClick.current.click();
      if(err.code != 4001) {
        Swal.fire({
          title: 'Oops...',
          text: `Transaction Failed`,
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      }
    });
  }

  const handlePost = async (param) => {
    let deadline;
    let postData;
    if (isToDate) {
      deadline = Math.round(new Date(isToDate).getTime() / 1000);
      postData = {
        id: itemData.id,
        price: isChangePrice,
        sale_end_date: deadline,
        signature: param
      }
    } else {
      postData = {
        id: itemData.id,
        price: isChangePrice,
        signature: param
      }
    }
    

    await Axios.post("/api/assets/change-price", postData, { headers: header })
    .then((res) => {
      setLoadingState(false)
      closeBtnClick.current.click();
      localStorage.removeItem('itemData');
      Swal.fire({
        title: 'It worked!',
        text: `Change price succeeded.`,
        icon: 'success',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
      getItemDetailData();
      getHistoryData();
      getBidHistoryData();
      
    })
    .catch((err) => {
      setLoadingState(false)
      closeBtnClick.current.click();
      Swal.fire({
        title: 'Oops...',
        text: err.response.data.msg,
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
    });
  }

  const handlePost1155 = async (param) => {
    let deadline;
    let postData;
    if (isToDate1155) {
      deadline = Math.round(new Date(isToDate1155).getTime() / 1000);
      postData = {
        id: isListingsData[lowerPriceList].list_id,
        price: isChangePrice1155,
        sale_end_date: deadline,
        quantity: lowerPriceQuantity,
        signature: param
      }
    } else {
      postData = {
        id: isListingsData[lowerPriceList].list_id,
        price: isChangePrice1155,
        quantity: lowerPriceQuantity,
        signature: param
      }
    }
    

    await Axios.post("/api/supply-assets/change-price", postData, { headers: header })
    .then((res) => {
      setLoadingState(false)
      closeBtnClick.current.click();
      localStorage.removeItem('itemData');
      Swal.fire({
        title: 'It worked!',
        text: `${ res.data.msg }`,
        icon: 'success',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
      getItemDetailData();
      getHistoryData();
      getBidHistoryData();
    })
    .catch((err) => {
      setLoadingState(false)
      closeBtnClick.current.click();
      Swal.fire({
        title: 'Oops...',
        text: err.response.data.msg,
        icon: 'error',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      })
    });
  }

  const [reportType, setReportType] = useState('Fake');

  const handleReportTypeChange = async (e) => {
    setReportType(e.target.value);
  }

  const handleReport = async () => {
    if(!reportType) return;
    setLoadingState(true);
    const postData = {
      id: itemData.id,
      type: reportType
    };
    await Axios.post("/api/assets/report", postData, { headers: header })
      .then((res) => {
        Swal.fire({
          title: 'It worked!',
          text: `Reported Successfully`,
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      }).catch((e) => {
        Swal.fire({
          title: 'Oops...',
          text: e.response.data.msg,
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      })
    setLoadingState(false);
    closeReportBtnClick.current.click();
  }

  const checkBeforeOffer = ()=>{
    let result_offer = bidHistoryData?.filter( data => {return data.price == isBidPrice;}) ;
    if (result_offer.length > 0) return true ;
    return false ;
  }

  const handleBidAction = async () => {
    setClickBid(false) ;
    let bidPostData ;
    if(!is_721) {
      bidPostData = {
        id: itemData.id,
        price: isBidPrice,
        quantity: offerQuantity,
        expiration_date: expirationDate
      };
      setLoadingState(true);
      await Axios.post('/api/supply-bid/place-bid', bidPostData, { headers: header })
      .then((res) => {
        setClickBid(true) ;
        setOfferQuantity('');
        setOfferQuantity_show('');
        setExpirationDateString('');
        setAmountUSD('') ;
        setAmountVXL('') ;
        setAmountUSD_show('') ;
        setAmountVXL_show('') ;
        setLoadingState(false);
        bidModalClose.current.click();
        getItemDetailData();
        getHistoryData();
        getBidHistoryData();
        
        Swal.fire({
          title: 'It worked!',
          text: `Your bid has been placed successfully`,
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return;
      })
      .catch ((err) => {
        bidModalClose.current.click();
        setClickBid(true) ;
        Object.values(err).map(function(item) {
          if (item.data && item.data.msg) {
            Swal.fire({
              title: 'Oops...',
              text: `${ item.data.msg }`,
              icon: 'error',
              confirmButtonText: 'Close',
              timer:5000,
              customClass: 'swal-height'
            })
          }
        })
        setLoadingState(false);
      });
      setOfferQuantity('');
      setOfferQuantity_show('');
      setExpirationDateString("");
      setAmountUSD('') ;
      setAmountVXL('') ;
      setAmountUSD_show('') ;
      setAmountVXL_show('') ;
      return;
    }
    if(itemData.sale_type == '2'){
      bidPostData = {
        id: itemData.id,
        price: isBidPrice
      }
    }else {
      if(checkBeforeOffer() == true) {
        Swal.fire({
          title: 'Oops...',
          text: `This bid is the same amount as your previous bid. Please change the amount`,
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        setClickBid(true) ;
        return ;
      }

      bidPostData = {
        id: itemData.id,
        price: isBidPrice,
        expiration_date: expirationDate ,
      }
    }
     
    setLoadingState(true);
    await Axios.post('/api/bid/place-bid', bidPostData, { headers: header })
      .then((res) => {
        setLoadingState(false);
        bidModalClose.current.click();
        getItemDetailData();
        getHistoryData();
        getBidHistoryData();

        setClickBid(true) ;
        Swal.fire({
          title: 'It worked!',
          text: `Your bid has been placed successfully`,
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      })
      .catch((err) => {
        setLoadingState(false);
        setClickBid(true) ;
        bidModalClose.current.click();
        Object.values(err).map(function(item) {
          if (item.data && item.data.msg) {
            Swal.fire({
              title: 'Oops...',
              text: `${ item.data.msg }`,
              icon: 'error',
              confirmButtonText: 'Close',
              timer:5000,
              customClass: 'swal-height'
            })
          }
        })
      });
    setExpirationDateString("");
    setAmountUSD('') ;
    setAmountVXL('') ;
    setAmountUSD_show('') ;
    setAmountVXL_show('') ;
  }

  const getHistoryData = async () => {
    const param = {
      id: nftId
    }
    dispatch(actions.fetchNftHistory(param));
  }

  const getOwnersData = () => {
    setOwnersData(itemData.owners);
  }

  const getMyBalanceData = async (saleTypes) =>{
    if(saleTypes == 'buy'){
      let current_balance = parseFloat(localStorage.getItem("balance")) - parseFloat(localStorage.getItem("currentPrice")) ;
      localStorage.setItem("balance",parseFloat(localStorage.getItem("balance")) - parseFloat(localStorage.getItem("currentPrice"))) ;
      dispatch(actions.getMyBalance(current_balance));
    }else {
      let current_balance = parseFloat(localStorage.getItem("balance")) + parseFloat(localStorage.getItem("currentPrice")) ;
      localStorage.setItem("balance",parseFloat(localStorage.getItem("balance")) + parseFloat(localStorage.getItem("currentPrice"))) ;
      dispatch(actions.getMyBalance(current_balance));
    }
  }

  const getBidHistoryData = async () => {
    const param = {
      id: nftId
    }
    getItemDetailData() ;
    dispatch(actions.fetchBidHistory(param));
  }

  const setLikeNFT = async () => {
    const postData = {
      id: itemData.id
    }
    if(likeloading == 1) return ;
    setLikeloading(1) ;
    await Axios.post('/api/users/like', postData, { headers: header })
      .then((res) => {
        setLikeCounter(res.data.msg === "Added this asset to like list." ? isLikeCounter + 1 : isLikeCounter - 1)
        setLikedState(!isLikedState)
        setLikeloading(0);
      })
      .catch((err) => {
        Object.values(err).map(function(item) {
          if (item.data && item.data.msg) {

          }
        })
      });
  }

  function disabledDate(current) {
    return current && current < moment().endOf('day');
  }

  const moveToServicePage = () => {
    buyModalClose.current.click();
    buySupplyModalClose.current.click();
    navigate('/terms-of-service');
  }

  const setQuantityForOffer = (val) => {
    if(val == '' || isNaN(val)) {
      setOfferQuantity('');
      setOfferQuantity_show('');
      return;
    }
    setOfferQuantity(val);
    setOfferQuantity_show(val);
  }

  const setFixedPriceUSD=(val)=>{
    if(val == '' || isNaN(val)) {
      setAmountUSD('') ;
      setAmountVXL('') ;
      setAmountUSD_show('') ;
      setAmountVXL_show('') ;
      return ;
    }
    setAmountUSD(val) ;
    setAmountVXL((parseFloat(val) / itemData.usdPrice)) ;
    setAmountUSD_show(val) ;
    setAmountVXL_show((parseFloat(val) / itemData.usdPrice).toFixed(2)) ;
    if (val >= 0) {
      setBidPrice(val)
    } else {
      setBidPrice(0)
    }
  }
  const setFixedPriceVXL=(val)=>{
    if(val == '' || isNaN(val)) {
      setAmountUSD('') ;
      setAmountVXL('') ;
      setAmountUSD_show('') ;
      setAmountVXL_show('') ;
      return ;
    }
    setAmountUSD((val  * itemData.usdPrice)) ;
    setAmountVXL(val) ;
    setAmountUSD_show(parseFloat(val  * itemData.usdPrice).toFixed(2)) ;
    setAmountVXL_show(val) ;
    if (parseFloat(val  * itemData.usdPrice).toFixed(2) >= 0) {
      setBidPrice((val  * itemData.usdPrice).toFixed(2))
    } else {
      setBidPrice(0)
    }
  }

  const moveActionBtn = {
    top: 'calc(50% - 19px)',
    position: 'absolute',
    opacity: 0.2
  }

  const moveActionArrow = {
    fontSize: 20,
    color: 'white',
    background: 'rgb(247, 13, 255)',
    border: '1px solid rgb(247, 13, 255)',
    borderRadius: '50%',
  }

  const primaryBtnStyle = {
    padding: '4px 30px',
    borderRadius: 10
  }

  const voxelNameFont = {
    fontWeight: 'bold'
  }

  const iconStyle = {
    fontSize: 16,
    margin: '2px 3px 4px 2px'
  }

  const heartIconStyle = {
    fontSize: 16,
    color: isLikedState ? '#f70dff' : '#d9d9d9', 
    
  }

  const verifyIconStyle = {
    margin: '-3px 5px 0px', 
    fontSize: 22
  }

  const verifyIconColorB = {
      color: isVerifyIconColorB,
  }

  const verifyIconColorC = {
      color: isVerifyIconColorC,
  }
  const callback = (key) => {
  }

  const { Panel } = Collapse ;

  const StepB = <CollapsePanelHeader>
          <FiCheckCircle style={{ ...verifyIconStyle, ...verifyIconColorB }} />
          Approve this item for sale
      </CollapsePanelHeader>
  ;
  const StepC = <CollapsePanelHeader>
          <FiCheckCircle style={{ ...verifyIconStyle, ...verifyIconColorC }} />
          Accept the offer in your wallet
      </CollapsePanelHeader>
  ;

  const StepBText = `To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.`;
  const StepCText = <span>Accept the offer for your NFT by approving it in your wallet. This may take a couple of minutes.</span>;


  const listAction = async (chainType,bid_data,idx) => {
    const rowData = {
      id: itemData.id
    }
    if(itemData.status == 'pending') {
      const results = await Axios.post(`/api/supply-assets/mint`, rowData, { headers: header });
    }
    Axios.post(`/api/sale/accept-item/`, {id:bid_data.id, usdPrice: itemData.usdPrice} , { headers: header })
      .then( async (res) => {
        if(res.data.can_accept == false){
          Swal.fire({
            title: 'Oops...',
            text: `Expiration time passed.`,
            icon: 'error',
            confirmButtonText: 'Close',
            timer:5000,
            customClass: 'swal-height'
          })
          modal_acceptBidClose.current.click();
        }else {
          setBidID(idx) ;

          let signMsgData;
      
          signMsgData = {
            price: parseFloat(bid_data.price).toFixed(2),
            toDate: bid_data.time,
            tokenId: itemData.token_id,
            collection: itemData.collection.name,
            quantity: bid_data.quantity,
          }
      
          const params = [
              header,
              account,
              chainType
          ];
          const signedData = res.data;
          
          setVerifyBState(true)
          await getListAction(params, signMsgData, rowData ,itemData, library)
            .then(async(res) => {
                setVerifyIconColorB("#1fb30d");
                setVerifyBState(false);
                setVerifyCState(true);
                handleAcceptAction(idx, signedData) ;
            })
            .catch((err) => {
                modal_acceptBidClose.current.click();
                if(err.code != 4001) {
                  Swal.fire({
                    title: 'Oops...',
                    text: 'Transaction Failed',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    timer:5000,
                    customClass: 'swal-height'
                  })
                }
            });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: 'Oops...',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        });
        modal_acceptBidClose.current.click();
      });
    }

    const openWebsite = (url) => {
      window.open(url, '_blank');
    }

    const openUrl = (url) => {
      window.open(url, '_blank');
    }

    const handleCart = async () => {
      const postData = {
        id: itemData.id
      };
      if(isCart) {
        await Axios.post('/api/cart/remove-cart', postData, { headers: {'Authorization': `Bearer ${accessToken}`}})
          .then(() => {
            setIsCart(false);
            let cartData = JSON.parse(localStorage.getItem('cartInfo'));
            for(let i = 0; i < cartData.length; i ++) {
              if(cartData[i].asset.id == itemData.id) {
                cartData.splice(i, 1);
              }
            }
            localStorage.setItem('cartInfo', JSON.stringify(cartData));
          })
          .catch((e) => {
      
          })
      } else {
        await Axios.post('/api/cart/add-cart', postData, { headers: header })
          .then((res) => {
            setIsCart(true);
            let cartData = JSON.parse(localStorage.getItem('cartInfo'));
            let newData = {
              asset: itemData,
              collection: itemData.collection
            };
            cartData.push(newData);
            localStorage.setItem('cartInfo', JSON.stringify(cartData));
          })
          .catch((e) => {
      
          })
      }
    }

    useEffect(()=>{
      localStorage.setItem('searchValue','') ;
      getBidHistoryData();
    },[])

    const [listingCount, setListingCount] = useState(0);
    const [myListingData, setMyListingData] = useState([]);

    useEffect(() => {
      if(!isListingsData) {
        setListingCount(0);
        setMyListingData([]);
      }
      let tmp = 0;
      let tmpArr = [];
      for(let i = 0; i < isListingsData.length; i ++) {
        tmp ++;
        tmpArr.push(isListingsData[i]);
      }
      setListingCount(tmp);
      setMyListingData(tmpArr);
    }, [isListingsData])

    const [chartView, setChartView] = useState(true);
    const handlePriceChartClick = () => {
      setChartView(chartView => !chartView);
    }
    const [detailsView, setDetailsView] = useState(true);
    const handleDetailsClick = () => {
      setDetailsView(detailsView => !detailsView);
    }

    const [listingsView, setlistingsView] = useState(false);
    const handleListingsClick = () => {
      setlistingsView(listingsView => !listingsView);
    }

    const [bidsView, setBidsView] = useState(false);
    const handlebidsClick = () => {
      if(!bidsView) getBidHistoryData();
      setBidsView(bidsView => !bidsView);
    }

    const [historyView, setHistoryView] = useState(false);
    const handleHistoryClick = () => {
      if(!historyView) getHistoryData();
      setHistoryView(historyView => !historyView);
    }

    const [moreView, setMoreView] = useState(false);
    const handleMoreClick = () => {
      setMoreView(moreView => !moreView);
    }

    const data = [
      {
          avg_sale_price: 80.00,
          sale_date: "2022-12-21"
      }
    ];

  return (
    <div>
      <GlobalStyles />
      {itemData ? (
        <>
        {
          0 ? 
              ((itemData && itemData.auction_end_process )== true  && (itemData && itemData.auction_end_date * 1000 <= new Date().getTime() && new Date().getTime() <= itemData.auction_pay_end_date * 1000 )) ?
                <></>
                :
                (
                  <Affix  onChange={(affixed) => console.log(affixed)} style={{ textAlign: 'right', zIndex: 99, right: 0 ,position:'fixed' , bottom:'35px' ,width:'100%'}}>
                    <TopBar>
                      <TopSubDiv>
                        {
                          itemData.on_sale == false ?
                            <>
                              {
                                itemData.is_voxel == true ?
                                  <>
                                    {
                                      (isOwnerBtnShow || itemData.status == 'pending' && itemData.owner_of.toLowerCase() == account?.toLowerCase()) ?
                                        <>
                                          <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}}><Link to="/create" state={{ prop: itemData }}>Edit</Link></StyledButton>
                                          <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}} onClick={() => moveToListingPage(itemData.id)}>Sell</StyledButton>
                                          <Tooltip placement="top"  title={auction_infoText_sell}>
                                              <FiInfo style={iconBtnStyle} />
                                          </Tooltip> 
                                        </>
                                      : <>                                          
                                          <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}} onClick={() => moveToListingPage(itemData.id)}>Sell</StyledButton>
                                          <Tooltip placement="top"  title={auction_infoText_sell}>
                                            <FiInfo style={iconBtnStyle} />
                                          </Tooltip> 
                                        </>
                                    }
                                  </>
                                : <>
                                    <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}} onClick={() => moveToListingPage(itemData.id)}>Sell</StyledButton>
                                    <Tooltip placement="top"  title={auction_infoText_sell}>
                                      <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </>
                              }
                            </>
                          : <>
                              {
                                (itemData.status != 'pending' && ownedSupplyNum > 0) ?
                                <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}} onClick={() => moveToListingPage(itemData.id)}>Sell</StyledButton> : <></>
                              }
                              {
                                (itemData.auction_end_process == true && itemData.sale_type == 2 || !is_721 || isBidHistoryData.length > 0 && itemData.sale_type == 2) ?
                                  <></>
                                :
                                  <StyledButton className="ItemBtnHover" disabled={itemData.top_bid > 0} style={window.innerWidth>768? (itemData.sale_type=='2'?{width:'200px',fontSize:'17px',marginRight:'20px'}:{width:'200px',fontSize:'17px'}):(itemData.sale_type=='2' ?{width:'auto',marginRight:'20px'}:{width:'auto'})} data-bs-toggle="modal" data-bs-target="#cancelListing">Cancel listing</StyledButton>

                              }
                              {
                                (itemData.sale_type == '2' || itemData.price == 0)
                                  ?
                                    <></>
                                  :
                                    <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'auto',fontSize:'17px'}:{width:'auto'}} data-bs-toggle="modal" data-bs-target="#lowerPriceLower">Lower price</StyledButton>
                              }
                            </>
                        }
                      </TopSubDiv>
                    </TopBar>
                  </Affix>
                )
            : null
        }
        {isLoading && <SkeletonCard />}
        {
          !isLoading &&
            <StyledSection className="custom-container">
                {
                  (itemData && itemData.warning_message && itemData.warning_message != '') &&
                  <div className="row mt-md-5">
                    <div className="warningItem">{itemData.warning_message}</div>
                  </div>
                }
                <Spin spinning={(getReturnValues_hours(remainAuctionEndTime) + getReturnValues_minutes(remainAuctionEndTime) + getReturnValues_seconds(remainAuctionEndTime) == 0 && isAuctionProcess == true)} delay={500} tip={"Finalizing auction process..."}>

                  
              <div className={(itemData && itemData.warning_message && itemData.warning_message != '') ? "row pt-md-4 Non-scroll-tab" : 'row mt-md-5 pt-md-4 Non-scroll-tab'} style={{overflow:'scroll', maxHeight:'86vh'}}>
                
                
                
                
                <div className="col-md-6 text-center" style={itemData.asset_type === "3D" ?{maxHeight:'80%',paddingRight:'20px'}:{maxHeight:'80%',paddingRight:'40px'}}  >
                  
                  <div style={{width:'100%', backgroundColor:!colormodesettle.ColorMode? 'rgb(53, 56, 64)' : 'rgb(255, 255, 255)', border:!colormodesettle.ColorMode? '1px solid rgb(53, 56, 64)': '1px solid rgb(227, 227, 227)', height:'42px', borderTopRightRadius:'8px', borderTopLeftRadius:'8px', display:'flex', justifyContent:'flex-end', borderBottom:'none'}}>
                    <Tooltip placement="top" title="View original media">
                      <div 
                        style={{cursor:'pointer', padding:'5px 0px', margin:'0px 10px'}} 
                        onClick={() => openUrl(
                          (itemData.asset_type === "video/mp4" || itemData.asset_type === "audio/mpeg" || itemData.asset_type === "3D") ?
                            itemData.animation
                            : (itemData.image? itemData.image : itemData.raw_image?itemData.raw_image:itemData._blob_raw_image?itemData._blob_raw_image:defaultNFT))}>
                        <span style={{fontWeight:'30px'}}><BsBoxArrowUpRight /></span>
                      </div>
                      
                    </Tooltip>
                  </div>

                  {/* code point #1 */}

                  <div style={{ position: 'relative', border:!colormodesettle.ColorMode? '1px solid rgb(53, 56, 64)' : '1px solid rgb(227, 227, 227)', borderBottomRightRadius:'8px', borderBottomLeftRadius:'8px'}}>
                    
                    <Outer style={{aspectRatio: '1'}}>
                      <span style={{width:'100%'}}>
                        {
                        itemData.asset_type === "3D" ? 
                        (
                          <ThreeDOnline animation={itemData} colormodesettle={colormodesettle.ColorMode} />
                        )
                        :
                        (
                          itemData.asset_type === "video/mp4" || itemData.asset_type === "audio/mpeg" ?
                             <>
                               {
                                 itemData.asset_type === "video/mp4" &&
                                   <video style={{ width: '100%' }} controls autoPlay loop muted>
                                     <source src={itemData.animation} type="video/mp4" />
                                   </video>
                               }
                               {
                                 itemData.asset_type === "audio/mpeg" &&
                                   <audio controls autoPlay style = {{marginTop:'20vh'}}>
                                     <source src={itemData.animation} type="audio/mpeg" />
                                   </audio>
                               }
                             </>
                           : 
                              <LazyLoadImage
                               effect="opacity"
                               src={(itemData.image? itemData.image : itemData.raw_image?itemData.raw_image:itemData._blob_raw_image?itemData._blob_raw_image:defaultNFT)}
                               className="img-nft-detail img-rod mb-sm-30"
                               data-bs-toggle="modal" data-bs-target="#imageOriginalModal" size="large"  onClick={()=>image_original_show(itemData.image? itemData.image : itemData.raw_image?itemData.raw_image:itemData._blob_raw_image?itemData._blob_raw_image:defaultNFT)}    
                               alt=""
                             />
                        )
                        }
                      </span>
                    </Outer>
                    <div className="moveActionContainer" style={{display:'none'}}>
                      <div className="prevBar" style = {{ flex: 1 }}>
                        <Link className="prevBtn" to={`/ItemDetail/${isPrevItem}`} style={{ left: -20, ...moveActionBtn }}><i className="fa fa-chevron-left" style={{ padding: '7px 12px 7px 9px', ...moveActionArrow }}></i></Link>
                      </div>
                      <div className="nextBar" style = {{ flex: 1 }}>
                        <Link className="nextBtn" to={`/ItemDetail/${isNextItem}`} style={{ right: -20, ...moveActionBtn }}><i className="fa fa-chevron-right" style={{ padding: '7px 9px 7px 12px', ...moveActionArrow }}></i></Link>
                      </div>
                    </div>
                  </div>
                 {itemData.asset_type === "3D" ? 
                  <div className="threeDTXT">This is an interactive <b style={{color:"#f70dff"}}>3D NFT asset.</b> You can view it from multiple directions and zoom in or out</div>
                  : <></>}
                </div>
                <div className="col-md-6 Non-scroll-tab" style={{height: '0%', position:width >= 768 ? 'relative':''}}>
                  <div className="item_info Non-scroll-tab" style={(window.innerWidth >= 768 ) ? {overflow:'scroll',height:'85vh', marginTop:'-45px' , paddingTop:'40px', paddingBottom:'20vh'}:{paddingBottom:'30vh'} }>
                    <h2>{itemData.name}</h2>
                    <div style={{display:'flex' ,justifyContent:'space-between',flexWrap:'wrap'}}>
                      <div className="col-12 col-md-12 col-lg-12 col-xl-6">
                        {
                          !itemData.is_721 && 
                          <div className="item_info_counts">
                            <Tooltip placement="bottom" title="Current owners">
                              <div style={{ cursor: 'pointer' }} onClick={getOwnersData} data-bs-toggle="modal" data-bs-target="#ownersModal">
                                <i className="fa fa-users"></i>
                                <span style={{ marginLeft: 5, fontSize: 14 }}>{itemData.owners.length} </span>
                              </div>
                            </Tooltip>
                            <Tooltip placement="bottom" title="NFT Supply">
                              <div style={{ cursor: 'pointer' }}>
                                <i className="fa fa-th"></i>
                                <span style={{ marginLeft: 5, fontSize: 14 }}>{itemData.supply_number}</span>
                              </div>
                            </Tooltip>
                          </div>
                        }
                        
                        <div className="item_info_counts">
                          {itemData.collection.category && itemData.collection.category.name ?  
                          <Tooltip placement="bottom" title={"Category: " + (itemData.collection.category && itemData.collection.category.name ? itemData.collection.category.name : "undefined")}>
                            <div className="item_info_type" style={{ cursor: 'pointer', height: '25px',  }}>
                              <i className="fa fa-image"></i>
                            </div>
                          </Tooltip> : <></>}
                          <Tooltip placement="bottom" title="Times viewed">
                            <div className="item_info_views" style={{ cursor: 'pointer' }}>
                              <i className="fa fa-eye"></i>
                              {itemData && itemData.views.length}
                            </div>
                          </Tooltip>
                          <Tooltip placement="bottom" title="Liked">
                          { 
                            !isOwnerBtnShow ? 
                              <div  onClick={()=>setLikeNFT()} style={{ cursor: 'pointer' }}>
                                <FaHeart style={heartIconStyle}/>
                                <span style={{ marginLeft: 5, fontSize: 14 }}>{isLikeCounter >= 1000 ? `${isLikeCounter / 1000}K` : isLikeCounter}</span>
                              </div>
                            : <div style={{ cursor: 'pointer' }}>
                                <FaHeart style={heartIconStyle}/>
                                <span style={{ marginLeft: 5, fontSize: 14 }}>{isLikeCounter >= 1000 ? `${isLikeCounter / 1000}K` : isLikeCounter}</span>
                              </div>
                          }
                          </Tooltip>
                        </div>
                      </div>
                      <div className="item_info_views_Extra">
                        {
                          !(ownedSupplyNum == 0) && 
                          <Tooltip placement="bottom" title="Reload metadata">
                            <div className="RefreshButton1" disabled={ownedSupplyNum == 0}>
                              <FaSyncAlt className="extraIcon" style={{ width: '19px' }} onClick={refresh} />
                            </div>
                          </Tooltip>
                        }
                        {
                          !(!itemData.transfer_available_amount || itemData.transfer_available_amount == 0) && 
                          <Tooltip placement="bottom" title="Transfer">
                            <div className="RefreshButton" disabled={!itemData.transfer_available_amount || itemData.transfer_available_amount == 0}>
                              <FaArrowCircleRight className="extraIcon" style={{ width: '19px' }} data-bs-toggle="modal" data-bs-target="#transferItem" />
                            </div>
                          </Tooltip>
                        }
                        {
                          (itemData && itemData.collection.website && itemData.collection.website != '') && 
                          <Tooltip placement="bottom" title="View website">
                            <div className="RefreshButton">
                              <AiOutlineGlobal className="extraIcon" style={{ width: '19px' }} onClick={() => openWebsite(itemData.collection.website)} />
                            </div>
                          </Tooltip>
                        }
                        <div className="RefreshButton1">
                          <Dropdown overlay={menu} placement="bottom">
                            
                              <FaShareAlt className="extraIcon" style={{ width:'19px'}} />
                            
                          </Dropdown>
                        </div>
                        {
                          (accessToken && ownedSupplyNum == 0) && 
                          <Tooltip placement="bottom" title="Report">
                            <div className="RefreshButton" style={{borderRight:'0px'}}>
                              <FaFlag className="extraIcon" style={{ width: '19px' }} data-bs-toggle="modal" data-bs-target="#reportItem" />
                            </div>
                          </Tooltip>
                        }
                        
                      </div>
                    </div>
                    {
                      (itemData && itemData.description != "") && 
                      <p className="d-nft-inception Non-scroll-tab" style = {{overflowY: 'auto', maxHeight: '250px', margin:'2rem 0', whiteSpace:'pre-wrap'}}>{itemData.description}</p>
                    }
                        {itemData.has_unlockable_content == false || !isOwnerBtnShow
                          ?
                            ""
                          :
                              account && ownedSupplyNum > 0
                                ?
                                <a>
                                  <div  className="unlock_div unlockFontstyle" data-bs-toggle="modal" data-bs-target="#acceptBidModal" style={{wordBreak:'keep-all'}} >
                                    <i className="fa fa-unlock" style={{fontSize:'19px'}} aria-hidden="true"></i> Reveal unlockable content

                                  </div>
                                </a>
                                :
                                <a>
                                  <div  className="unlock_div" data-bs-toggle="modal" data-bs-target="#acceptBidModal" style={{wordBreak:'keep-all'}}>
                                    <i className="fa fa-lock" style={{fontSize:'19px' }} aria-hidden="true"></i> includes unlockable content
                                  </div>
                                </a>
                        }

                    <div className="d-flex flex-row mt-1">
                      { itemData.is_721 &&
                        <div className="mr40">
                          <h6>Owner</h6>
                          <div className="item_author" style={{position:'relative'}} onClick={()=>authorCollection(itemData.owners? itemData.owners[0].owner.public_address: itemData.owner_of)}>
                            <div className="author_list_pp">
                              <span>
                                <LazyLoadImage effect="opacity" className="lazy" src={(itemData.owners.length > 0 && itemData.owners[0].owner.avatar) ? itemData.owners[0].owner.avatar : defaultUser} afterLoad={() => setLoadImgStatus(!loadImgStatus)} alt="" />
                                  {
                                    (itemData.owner && itemData.owner.verified == true) 
                                      ?
                                        <i className="fa fa-check" style={{marginLeft:'3px',color:'#ffffff',background:'#f70dff',borderRadius:'100%'}}></i>
                                      :
                                        ""
                                  }
                                  {
                                    (itemData.owner && itemData.owner.warning_badge > 0)
                                      ?
                                      <Tooltip placement="top" title="This rating badge indicates the number of times the buyer or seller did not successfully complete an auction transaction after it had ended, either the seller did not execute the sell transaction within 7 days, or the buyer did not have sufficient VXL tokens for a sell to be executed within 7 days.">
                                        <b  className="badgeInfo" >{itemData.owner.warning_badge}</b>
                                      </Tooltip> 
                                      :
                                        ""
                                  }
                              </span>
                            </div>
                            <div className="author_list_info ownerInfo" style={voxelNameFont}>
                              <span>{(itemData.owners.length > 0 && itemData.owners[0].owner.username)? itemData.owners[0].owner.username : (itemData.owners.length > 0) ? itemData.owners[0].owner.public_address.slice(0, 5) + "..." + itemData.owners[0].owner.public_address.slice(-5) : itemData.owner_of.slice(0, 5) + "..." + itemData.owner_of.slice(-5)}</span>
                            </div>
                          </div>

                        </div>
                      }
                      <div className="mr40">
                        <h6>Collection</h6>
                        <div className="item_author" style={{position:'relative'}} onClick={() => moveToCollectionPage(itemData.collection.link)}>
                          <div className="author_list_pp" >
                            <Link to={"/collection-detail/" + itemData.collection.link}>
                              <LazyLoadImage effect="opacity" className="lazy" src={itemData.collection.avatar ? itemData.collection.avatar : defaultAvatar} afterLoad={() => setLoadImgStatus(!loadImgStatus)} alt="" />
                              {itemData.collection.verified ? <i className="fa fa-check"></i>:<></>}
                            </Link>
                          </div>
                          <div className="author_list_info" style={{fontWeight:'bold', overflow:'hidden'}}>
                            <span>{itemData.collection.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="spacer-30"></div>
                    
                    <div style={{border:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3', width:'100%', borderRadius:'10px'}}>
                      <div style={{padding:'13px', cursor:'pointer'}} onClick={() => handlePriceChartClick()}>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                          <div>
                            <FaSignal style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}/>
                            <span style={{color:!colormodesettle.ColorMode? 'white' : 'black', fontSize:'16px', fontWeight:'bold', marginLeft:'8px'}}>Price History</span>
                          </div>
                          <div style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}>
                            {
                              chartView ? <FaAngleUp /> : <FaAngleDown />
                            }
                          </div>
                        </div>
                      </div>
                      {
                        chartView && 
                        (
                          !configData ? 
                          <div style={{height:'150px', borderTop:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3'}}>
                            <div style={{width:'100%', display:'flex', justifyContent:'center', marginBottom:'15px'}}>
                              <FaRegClock size={35} style={{marginTop:'30px'}}/>
                            </div>
                            <div style={{display:'flex', justifyContent:'center'}}>
                              <span>No Data</span>
                            </div>
                          </div>
                          :
                          <div style={{padding:'0px 10px', borderTop:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3', height:'200px'}}>
                            <div style={{height:'180px', marginTop:'10px'}}>
                              <Line {...configData} />
                            </div>
                          </div>
                        )
                      }
                    </div>
                    <div className="spacer-20"></div>
                    <div style={{border:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3', width:'100%', borderRadius:'10px'}}>
                      <div style={{padding:'13px', cursor:'pointer'}} onClick={() => handleDetailsClick()}>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                          <div>
                            <FaFileAlt style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}/>
                            <span style={{color:!colormodesettle.ColorMode? 'white' : 'black', fontSize:'16px', fontWeight:'bold', marginLeft:'8px'}}>Details</span>
                          </div>
                          <div style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}>
                            {
                              detailsView ? <FaAngleUp /> : <FaAngleDown />
                            }
                          </div>
                        </div>
                      </div>
                      {
                        detailsView && 
                        <div style={{padding:'10px 20px', borderTop:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3'}}>
                          <div className="tab-1 onStep fadeIn">
                            <div className="d-block mb-3">

                              <div className="row">
                                {isPropertiFlg 
                                  ?
                                    <div style={{marginTop:'20px' ,marginBottom:'-11px'}}>
                                    <h6 className="color_detail">Properties</h6>
                                    
                                    <div className="" style={{display:'flex', overflowX:'auto'}}>
                                        {
                                        itemData && itemData.traits.map((elem, i) => (
                                          elem.display_type == "text" 
                                          ?
                                            <div key={i} style={{margin:'5px 17px',width:'auto'}}>
                                              <div className="nft_attr" style={{display:'flex', justifyContent:'center'}}>
                                                <div className="">
                                                  <div className="NorTxt"><h5 style={{fontSize:'16px',marginBottom:'-3px'}}>{elem.trait_type}</h5></div>
                                                  <div className="NorTxt"><b>{elem.value}</b></div>
                                                  <div style={{color:'grey', fontSize:'11px'}}>{elem.rarity}% has this trait</div>
                                                </div>
                                              </div>
                                            </div>
                                          :
                                          ""
                                        ))}
                                    </div>
                                    </div>
                                  :
                                    ""
                                }
                              {isLevelFlg
                                ?
                                  <div style={{marginTop:'20px'}}>
                                      <h6 className="color_detail">Levels</h6>
                                    <div className="" style={{marginLeft:'10px' , marginTop:'10px'}}>
                                        {
                                        itemData && itemData.traits.map((elem, i) => (
                                          elem.display_type == "progress" 
                                          ?
                                            <div key ={i}>
                                              <div className="progress-properties ">
                                                <div className="NorTxt">{elem.trait_type}</div>
                                                <div className="NorTxt" style={{fontSize:'14px',display:'flex',alignItems:'flex-end'}}>{elem.value} of {elem.max_value}</div>
                                              </div>
                                              <Progress percent={elem.value/elem.max_value*100} strokeWidth	={12} showInfo={false} strokeColor="#f70dff" />
                                            </div>
                                          :
                                          ""
                                        ))}
                                    </div>
                                  </div>
                                :
                                  ""
                                }
                              {isStatFlg
                                ?
                                  <div style={{marginTop:'20px'}} >
                                    <h6 className="color_detail">Stats</h6>
                                    <div className="" style={window.innerWidth > 1024 ? {display:'flex', flexWrap:'wrap'}:{display:'flex',overflowX:'auto'}}>
                                      {
                                      itemData && itemData.traits.map((elem, i) => (
                                        elem.display_type == "number"
                                        ?
                                          <div key={i} style={{margin:'5px 17px',width:'auto'}}>
                                            <div className="nft_attr" style={{display:'flex'}}>
                                              <div className="">
                                                <div className="NorTxt"><b>{elem.trait_type}</b></div>
                                                <div className="NorTxt" style={{fontSize:'11px', display:'flex',alignItems:'center', whiteSpace:'nowrap'}}><h5 style={{fontSize:'14px'}}>{elem.value} out of {elem.max_value}</h5></div>
                                              </div>
                                            </div>
                                          </div>
                                        :
                                        ""
                                      ))}
                                    </div>
                                  </div>
                                :
                                  ""
                                }
                              
                              </div>
                              <div className="" style={{display:''}}>
                                  <div className="" style={{marginTop:'20px'}}>
                                    <h6  className="color_detail">Contract Address</h6>
                                    <div style={{display:'flex'}}>
                                      <div className="testIcon"></div>
                                      <div className="" style={{display:'flex' , justifyContent:'space-between' ,margin:'10px', alignItems: 'center'}}>
                                        <a target="_brank" href={`${explorerUrl}/address/${itemData.is_voxel?itemData.contract_address:itemData.collection.contract_address}`}>
                                          <div className="author_list_info" style={voxelNameFont}>
                                            <span style={{color:'#f70dff',fontSize:'16px'}}>
                                              {
                                                !itemData.is_voxel
                                                ? 
                                                `${itemData.collection.contract_address.slice(0,5)}...${itemData.collection.contract_address.slice(-5)}`
                                                :
                                                `${itemData.contract_address.slice(0,5)}...${itemData.contract_address.slice(-5)}`
                                              }
                                            </span>
                                          </div>
                                        </a>
                                      </div>
                                    </div>

                                  </div>
                                  <div className="" style={{marginTop:'20px'}}>
                                    <h6 className="color_detail">Token Standard</h6>
                                    <div style={{display:'flex'}}>
                                    <div className="testIconTokenStandard"></div>
                                      <div className="" style={{display:'flex' , justifyContent:'space-between' ,margin:'10px', alignItems: 'center'}}>
                                        <div className="author_list_info" style={voxelNameFont}>
                                          <span className="NorTxt" style={{fontSize:'16px'}}>
                                            {
                                              is_721 ? "ERC 721 Standard" : "ERC 1155 Standard"
                                            }
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="" style={{marginTop:'20px'}}>
                                    <h6 className="color_detail">Token ID</h6>
                                    <div style={{display:'flex'}}>
                                    <div className="testIconTokenID"></div>
                                      <div className="" style={{display:'flex' , justifyContent:'space-between' ,margin:'10px', cursor:'pointer', alignItems: 'center'}}>
                                        <Tooltip placement="bottom"  title={copyToClipboardTxt}>
                                        <div className="author_list_info" style={voxelNameFont}>
                                          <CopyToClipboard text={itemData.token_id} onCopy={() => setCopyToClipboardTxt('Copied!')}>
                                            <span className="NorTxt" style={{fontSize:'16px'}}>{itemData.token_id.length>40 ? `${itemData.token_id.slice(0,5)}...${itemData.token_id.slice(-5)}`: itemData.token_id }</span>
                                          </CopyToClipboard>
                                        </div>
                                      </Tooltip> 
                                      </div>
                                    </div>
                                  </div>
                                  {
                                    itemData.royalty_address == '' || !itemData.royalty_address ?
                                    <></>
                                    :
                                    <>
                                      <div className="" style={{marginTop:'20px'}}>
                                        <h6 className="color_detail">Royalty Fee</h6>
                                        <div style={{display:'flex'}}>
                                        <div className="royaltyFeeIcon"></div>
                                          <div className="" style={{display:'flex' , justifyContent:'space-between' ,margin:'10px', cursor:'pointer', alignItems: 'center'}}>
                                            <Tooltip placement="bottom"  title={copyToClipboardTxt}>
                                            <div className="author_list_info" style={voxelNameFont}>
                                              <CopyToClipboard text={itemData.token_id} onCopy={() => setCopyToClipboardTxt('Copied!')}>
                                                <span className="NorTxt" style={{fontSize:'16px'}}>{itemData.royalty_fee } %</span>
                                              </CopyToClipboard>
                                            </div>
                                          </Tooltip> 
                                          </div>
                                        </div>
                                      </div>
                                      <div className="" style={{marginTop:'20px'}}>
                                        <h6  className="color_detail">Royalty Receiver</h6>
                                        <div style={{display:'flex'}}>
                                          <div className="royaltyIcon"></div>
                                          <div className="" style={{display:'flex' , justifyContent:'space-between' ,margin:'10px', alignItems: 'center'}}>
                                            <a target="_brank" href={`${explorerUrl}/address/${itemData.royalty_address}`}>
                                              <div className="author_list_info" style={voxelNameFont}>
                                                <span style={{color:'#f70dff',fontSize:'16px'}}>
                                                  { itemData.royalty_address.slice(0,5)}...{itemData.royalty_address.slice(-5)}
                                                </span>
                                              </div>
                                            </a>
                                          </div>
                                        </div>

                                      </div>
                                    </>
                                  }
                                  <div className="" style={{marginTop:'20px' }}>
                                    <h6 className="color_detail">Blockchain</h6>
                                    <div style={{display:'flex'}}>
                                    <div className="testIconBlockchain"></div>
                                      <div className="" style={{display:'flex' , justifyContent:'space-between' ,margin:'10px', alignItems: 'center'}}>
                                        <div className="author_list_info" style={voxelNameFont}>
                                          <span className="NorTxt" style={{fontSize:'16px'}}>
                                            {
                                              blockchain
                                            }
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                    { !itemData.is_721 &&
                      <>
                        <div className="spacer-20"></div>
                        <div style={{border:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3', width:'100%', borderRadius:'10px'}}>
                          <div style={{padding:'13px', cursor:'pointer'}} onClick={() => handleListingsClick()}>
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                              <div>
                                <BsWallet2 style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}/>
                                <span style={{color:!colormodesettle.ColorMode? 'white' : 'black', fontSize:'16px', fontWeight:'bold', marginLeft:'8px'}}>Listings {listingCount > 0 && <div style={alarmStyle}>{listingCount}</div>}</span>
                              </div>
                              <div style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}>
                                {
                                  listingsView ? <FaAngleUp /> : <FaAngleDown />
                                }
                              </div>
                            </div>
                          </div>
                          {
                            listingsView && 
                            <div style={{padding:'0px 20px', borderTop:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3'}}>
                              <Table columns={columns} style={{ overflowY: 'auto' }} dataSource={myListingData}/>
                            </div>
                          }
                        </div>
                      </>
                    }
                    <div className="spacer-20"></div>
                    <div style={{border:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3', width:'100%', borderRadius:'10px'}}>
                      <div style={{padding:'13px', cursor:'pointer'}} onClick={() => handlebidsClick()}>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                          <div>
                            <BsWallet2 style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}/>
                            <span style={{color:!colormodesettle.ColorMode? 'white' : 'black', fontSize:'16px', fontWeight:'bold', marginLeft:'8px'}}>{bidsOffer}{isBidHistoryData.length > 0 && <div style={alarmStyle}>{isBidHistoryData ? isBidHistoryData.length : "0"}</div>}</span>
                          </div>
                          <div style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}>
                            {
                              bidsView ? <FaAngleUp /> : <FaAngleDown />
                            }
                          </div>
                        </div>
                      </div>
                      {
                        bidsView && 
                        <div style={{padding:'10px 20px', borderTop:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3'}}>
                          {
                            isBidHistoryData && isBidHistoryData.length > 0 ?
                              isBidHistoryData.map((data, index) => (
                                <div className="mr40 mb-2" key={index} style = {{overflow:'auto'}}>
                                  <RowDiv className="item_author" style={{display:'flex' , justifyContent:'space-between', whiteSpace:'nowrap', marginBottom:'10px'}}>
                                    <div style={{display:'flex', marginTop:'10px'}}>
                                      <RowAvatar className="author_list_pp" onClick={()=>authorCollection(data.bidder && data.bidder.address)}>
                                        <span>
                                          <LazyLoadImage effect="opacity" className="lazy" src={data.bidder && data.bidder.avatar ? data.bidder.avatar : defaultUser} afterLoad={() => setLoadImgStatus(!loadImgStatus)} alt="" />
                                          <i className="fa fa-check"></i>
                                          {
                                            data.bidder.warning_badge > 0 && 
                                            <Tooltip placement="top" title="This rating badge indicates the number of times the buyer or seller did not successfully complete an auction transaction after it had ended, either the seller did not execute the sell transaction within 7 days, or the buyer did not have sufficient vxl tokens for a sell to be executed within 7 days.">
                                              <b  className="badgeInfo" >{data.bidder.warning_badge}</b>
                                          </Tooltip> 
                                          }
                                        </span>
                                      </RowAvatar>
                                      <RowInfo className="author_list_info NorTxt" style={{  paddingTop: 0, lineHeight: 1.2 }}>
                                        <PTag style={{marginBottom:'0px'}}>{acceptedType} <b>{(data.price / itemData.usdPrice).toFixed(0) ? `${(data.price / itemData.usdPrice).toFixed(0)} ${currencyName(itemData? itemData.chain_id : null)} (${data.price.toFixed(2)} USD) ${(data.quantity && data.quantity > 1)? ' for ' + data.quantity.toString()  + ' supply': ''}` : ""}</b></PTag>
                                        <SpanTag>by <b>{data.bidder && data.bidder.name ? data.bidder.name : data.bidder.address.slice(0, 7) + '...' + data.bidder.address.slice(-5)} </b> 
                                        {
                                          data.time ?
                                          <>
                                            expires at {(new Date(data.time*1000)).toLocaleString()}
                                          </>
                                          : <></>
                                        }
                                        </SpanTag>
                                      </RowInfo>
                                    </div>
                                    <div style ={{}}>
                                    {
                                      (isOwnerBtnShow || !is_721 && ownedSupplyNum > 0) &&
                                        ((itemData.sale_type=='2') == true ?
                                          (itemData.auction_end_process && itemData.auction_start_date * 1000 <= new Date().getTime() && new Date().getTime() <= itemData.auction_pay_end_date * 1000) &&
                                            <>
                                              <StyledButton size="large" disabled={data.disable_accept == true} onClick={itemData.status == "active" ? () => listAction("onChain" , data,index) : () => listAction("offChain",data,index)} data-bs-toggle="modal" data-bs-target="#listing" >
                                                {
                                                  ((itemData.auction_pay_end_date * 1000 - new Date().getTime()) >= 24 * 3600 * 1000) && (itemData && itemData.auction_end_process == true) && (new Date().getTime() >= itemData.auction_start_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) &&
                                                    `Accept ${getReturnValues_days(itemData.auction_pay_end_date * 1000 - new Date().getTime())} days`
                                                }
                                                {
                                                  ((itemData.auction_pay_end_date * 1000 - new Date().getTime()) < 24 * 3600 * 1000) && (itemData && itemData.auction_end_process == true) && (new Date().getTime() >= itemData.auction_start_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) &&
                                                      `Accept ${getReturnValues_hours(remainAuctionDuringTime)}:${getReturnValues_minutes(remainAuctionDuringTime)}:${getReturnValues_seconds(remainAuctionDuringTime)}`
                                                }
                                                </StyledButton>
                                              <Tooltip placement="top" title="You have 7 days to execute the sell transaction by clicking on the accept button, if you do not fulfill your responsibility, you will receive a negative badge rating against your profile.">
                                                  <FiInfo style={iconBtnStyle} />
                                              </Tooltip> 
                                            </>
                                          : 
                                            (!is_721 && ownedSupplyNum > 0 && data.bidder.address.toLowerCase() != account?.toLowerCase() || is_721 && data.bidder.address.toLowerCase() != account?.toLowerCase()) &&
                                            <>
                                              <StyledButton size="large" disabled={data.disable_accept == true || ownedSupplyNum < parseInt(data.quantity)} onClick={itemData.status == "active" ? () => listAction("onChain" , data,index) : () => listAction("offChain",data,index)} data-bs-toggle="modal" data-bs-target="#listing" >Accept</StyledButton>
                                              <Tooltip placement="top" title="You have 7 days to execute the sell transaction by clicking on the accept button, if you do not fulfill your responsibility, you will receive a negative badge rating against your profile.">
                                                  <FiInfo style={iconBtnStyle} />
                                              </Tooltip> 
                                            </>
                                        )
                                        
                                    }
                                    {
                                    itemData.auction_pay == true  ?
                                      <></>
                                    :
                                      !(data.bidder && data.bidder.address.toLowerCase() !== account?.toLowerCase()) && <StyledButton size="large" onClick={() => CancelBid(data,index)} >Cancel</StyledButton>
                                    }
                                    {
                                      itemData.auction_pay == true && data.bidder.address.toLowerCase() == account?.toLowerCase() && (itemData.auction_pay_end_date * 1000 >= new Date().getTime() && itemData.auction_buyer_pay_start_date * 1000 <= new Date().getTime()) ?
                                        <>
                                          <StyledButton data-bs-toggle="modal" data-bs-target="#auction_buyModal" size="large" disabled={data.disable_accept}>
                                            {
                                              ((itemData.auction_pay_end_date * 1000 - new Date().getTime()) >= 24 * 3600 * 1000) && (itemData && itemData.auction_end_process == true) && (new Date().getTime() >= itemData.auction_start_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) &&
                                                  `Buy ${getReturnValues_days(itemData.auction_pay_end_date * 1000 - new Date().getTime())} days`
                                            }
                                            {
                                              ((itemData.auction_pay_end_date * 1000 - new Date().getTime()) < 24 * 3600 * 1000) && (itemData && itemData.auction_end_process == true) && (new Date().getTime() >= itemData.auction_start_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) &&
                                                  `Buy ${getReturnValues_hours(remainAuctionDuringTime)}:${getReturnValues_minutes(remainAuctionDuringTime)}:${getReturnValues_seconds(remainAuctionDuringTime)}` 
                                            }
                                          </StyledButton>
                                          <Tooltip placement="top" title={auction_infoText}>
                                              <FiInfo style={iconBtnStyle} />
                                          </Tooltip> 
                                        </>
                                        : <></>
                                    }  
                                    </div>
                                  </RowDiv>
                                </div>
                              )) : <NoDataDiv>No Data</NoDataDiv>
                          }
                        </div>
                      }
                    </div>
                    <div className="spacer-20"></div>
                    <div style={{border:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3', width:'100%', borderRadius:'10px'}}>
                      <div style={{padding:'13px', cursor:'pointer'}} onClick={() => handleHistoryClick()}>
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                          <div>
                            <BsClockHistory style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}/>
                            <span style={{color:!colormodesettle.ColorMode? 'white' : 'black', fontSize:'16px', fontWeight:'bold', marginLeft:'8px'}}>History</span>
                          </div>
                          <div style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}>
                            {
                              historyView ? <FaAngleUp /> : <FaAngleDown />
                            }
                          </div>
                        </div>
                      </div>
                      {
                        historyView && 
                        <div style={{padding:'10px 20px', borderTop:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3'}}>
                          {
                            isHistoryData && isHistoryData.length > 0 ?
                              isHistoryData.map((data, index) => (
                                <div className="mr40 mb-4" key={index}>
                                  <RowDiv className="item_author">
                                    <RowAvatar className="author_list_pp" onClick={()=>authorCollection_history(data)}>
                                      <span>
                                        {
                                          (data.activity === "mint" || data.activity === "sale")  ? 
                                            <LazyLoadImage effect="opacity" className="lazy" src={data.to.user_avatar ? data.to.user_avatar : defaultUser} afterLoad={() => setLoadImgStatus(!loadImgStatus)} alt="" />
                                          : <LazyLoadImage effect="opacity" className="lazy" src={data.from.user_avatar ? data.from.user_avatar : defaultUser} afterLoad={() => setLoadImgStatus(!loadImgStatus)} alt="" />
                                        }
                                        <i className="fa fa-check"></i>
                                      </span>
                                    </RowAvatar>
                                    <RowInfo className="author_list_info" style={{  paddingTop: 0, lineHeight: 1.2 }}>
                                      <PTag>
                                        {
                                          data.quantity && data.quantity + " items "
                                        }
                                        {
                                          data.activity  && data.activity != 'sale' && data.activity != 'transfer' && data.activity != 'bid' && data.activity != 'auction' && data.activity != 'list' && data.activity != 'cancel' && data.activity != 'cancel_offer' && data.activity != 'cancel_auction' && data.activity != 'offer' && data.activity != 'cancel_bid'
                                            && "minted"
                                            
                                        }
                                        {
                                          data.activity  && data.activity === 'transfer'
                                            && "transfer"
                                        }
                                        {
                                          data.activity  && data.activity === 'sale'
                                            && "sold"
                                        }
                                        {
                                          data.activity  && data.activity === 'bid'
                                            && "bid"
                                        }
                                        {
                                          data.activity  && data.activity === 'auction'
                                            && "auction listed"
                                        }
                                        {
                                          data.activity  && data.activity === 'list'
                                            && "listed"
                                        }
                                        {
                                          data.activity  && data.activity === 'cancel'
                                            && "cancelled list"
                                        }
                                        {
                                          data.activity  && data.activity === 'cancel_bid'
                                            && "cancelled bid"
                                        }
                                         {
                                          data.activity  && data.activity === 'cancel_offer'
                                            && "cancelled offer"
                                        }
                                        {
                                          data.activity  && data.activity === 'cancel_auction'
                                            && "cancelled auction"
                                        }
                                        {
                                          data.activity  && data.activity === 'offer'
                                            && "offer made"
                                        }
                                        <b>
                                        {
                                          data.activity != 'sale' &&  data.activity != 'mint' && data.activity != 'transfer' && (parseFloat(data.price / itemData.usdPrice).toFixed(0) 
                                            ? ` ${parseFloat(data.quantity * data.price / itemData.usdPrice).toFixed(0)} ${currencyName(itemData? itemData.chain_id : null)} (${parseFloat(data.quantity * data.price).toFixed(2)} USD)` 
                                            : "") 
                                        } 
                                        {
                                          data.activity === 'sale'  && (parseFloat(data.other_price ) 
                                            ? ` ${(parseFloat(data.quantity * data.other_price) ).toFixed(data.currency == 'eth' ? 8:2)} ${data.currency == 'eth'? 'ETH': 'VXL'}` 
                                            : "") 
                                        }
                                        </b></PTag>
                                      {
                                        data.activity === "mint" ?
                                          <SpanTag>by <b>{data.to.user_name ? data.to.user_name : data.to.address}</b> at {(new Date(data.time*1000)).toLocaleString()}</SpanTag>
                                        : (
                                          data.activity === "sale" ?
                                          <SpanTag>to <b>{data.to.user_name ? data.to.user_name : data.to.address}</b> at {(new Date(data.time*1000)).toLocaleString()}</SpanTag>
                                          :
                                          <SpanTag>by <b>{data.from.user_name ? data.from.user_name : data.from.address}</b> at {(new Date(data.time*1000)).toLocaleString()}</SpanTag>
                                        )
                                      }
                                      
                                    </RowInfo>
                                  </RowDiv>
                                </div>
                              )) : <NoDataDiv>No Data</NoDataDiv>
                          }
                        </div>
                      }
                    </div>
                    {
                      isCollectionData.length > 0 ?
                      <>
                        <div className="spacer-20"></div>
                        <div style={{border:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3', width:'100%', borderRadius:'10px'}}>
                          <div style={{padding:'13px', cursor:'pointer'}} onClick={() => handleMoreClick()}>
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                              <div>
                                <BsCardImage style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}/>
                                <span style={{color:!colormodesettle.ColorMode? 'white' : 'black', fontSize:'16px', fontWeight:'bold', marginLeft:'8px'}}>More</span>
                              </div>
                              <div style={{color:!colormodesettle.ColorMode? 'white' : 'black'}}>
                                {
                                  moreView ? <FaAngleUp /> : <FaAngleDown />
                                }
                              </div>
                            </div>
                          </div>
                          {
                            moreView && 
                            <div style={{padding:'20px 20px', borderTop:!colormodesettle.ColorMode? 'solid 1px rgb(53, 56, 64)' : 'solid 1px #e3e3e3'}}>
                              {
                                isShowMoreStatus ? 
                                  <div >
                                        <div style={{ display:'flex' , flexWrap:'wrap' , borderTop: 'none', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, justifyContent:'center' }}>
                                        {localStorage.setItem('usdPrice',itemData.usdPrice)}
                                        { 
                                          isCollectionData && isCollectionData.length > 0 ? isCollectionData.map((nft, index) => (
                                            <NftCard_Item
                                              nft={nft}
                                              key={index}
                                              loadingState={isSkeletonLoadingState}
                                              ethPrice={isETHPrice}
                                            />
                                          )) : <NoDataDiv>No Data</NoDataDiv>
                                        }
                                      </div>
                                      <div style={{ padding: 10, textAlign: 'center'}}>
                                      <Link to={`/collection-detail/${itemData.collection.link}`} style={{ color: 'inherit' }}><button className="btn_viewColet" style={primaryBtnStyle}>View collection</button></Link>
                                    </div>
                                  
                                  </div> : null
                              }
                            </div>
                          }
                        </div>
                      </>
                      :<></>
                    }
                  </div>
                  <div className="de_tab_content Non-scroll-tab" style={{ position: 'absolute' ,bottom: '0px',right: '0px', width: '100%', borderTop:'1px solid rgba(0,0,0,0.1)' , paddingTop:'15px' , backdropFilter: 'blur(5px)', paddingBottom: '12px'}}>
                   
                   <div className="row">
                      <div className="col-md-6">
                        {
                          (itemData.auction_end_process && is_721 && itemData.auction_end_process == true &&  new Date().getTime() >= itemData.auction_end_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) ?
                            <div className="d-flex flex-row mt-3" >
                              
                              <ActionButtonEnded>AUCTION ENDED</ActionButtonEnded>
                              
                            </div>
                          : is_721 &&
                            <>
                              <h6>
                                {
                                  itemData.sale_type =='2'?
                                      (
                                        itemData.top_bid ?  "Top bid" : "Bidding starts from"
                                      )
                                    :
                                    itemData.on_sale && itemData.sale_type == '1' ? "Price" : ""
                                }
                              </h6>
                              <div className="nft-item-price">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <img src={currencyLogo(itemData? itemData.chain_id : null)} alt="" width={25} style={{ marginTop: -12 }}/>
                                  <Statistic 
                                    style={{ fontColor: "#0d0c22", color: "#0d0c22", fontWeight: "bold", paddingRight: "10px", paddingLeft: "10px", marginBottom: "10px", fontSize: 20 }} 
                                    value={
                                      itemData.top_bid && itemData.auction_start_date * 1000 < new Date().getTime() ? (itemData.top_bid / itemData.usdPrice).toFixed(0) :
                                      (itemData.on_sale && (itemData.sale_type == '1' || itemData.sale_type == '2') ? 
                                        (reserve_addr == null || reserve_addr != null && (reserve_addr.toLowerCase() == account?.toLowerCase() || isOwnerBtnShow)) ? 
                                          itemData.price=='0' ? 
                                            "Free Item" 
                                            :(itemData.price / itemData.usdPrice).toFixed(0) 
                                          : "Reserved Sale"
                                        : "Not for sale")
                                    }  
                                  />
                                </div>
                                  
                              </div>
                              {
                                (itemData.top_bid && itemData.auction_start_date * 1000 < new Date().getTime()) ||  
                                ((itemData.on_sale && (itemData.sale_type == '1' || itemData.sale_type == '2') && (reserve_addr == null || reserve_addr != null && (reserve_addr.toLowerCase() == account?.toLowerCase() || isOwnerBtnShow)) && itemData.price != "0")) ?
                                <div className="nft-item-price" style={{marginTop:'-15px'}}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <img src={ethIcon} alt="" width={25} style={{marginTop:'-10px'}} />
                                  <Statistic 
                                    style={{ fontColor: "#0d0c22", color: "#0d0c22", fontWeight: "bold", paddingRight: "10px", paddingLeft: "10px", marginBottom: "10px", fontSize: 28 }} 
                                    value={
                                      // itemData.
                                      itemData.top_bid && itemData.auction_start_date * 1000 < new Date().getTime() ? (itemData.top_bid / itemData.ethUsdPrice).toFixed(5) :
                                      (itemData.on_sale && (itemData.sale_type == '1' || itemData.sale_type == '2') ? 
                                        (reserve_addr == null || reserve_addr != null && (reserve_addr.toLowerCase() == account?.toLowerCase() || isOwnerBtnShow)) ? 
                                          itemData.price=='0' ? 
                                            "" 
                                            :(itemData.price / itemData.ethUsdPrice).toFixed(3) 
                                          : ""
                                        : "")
                                    } 
                                    // precision={2} 
                                  />
                                  <div className="nft-item-price-value" style={{ fontSize: 14, display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>
                                    {
                                      itemData.top_bid && itemData.auction_start_date * 1000 < new Date().getTime()  ? 
                                      <>
                                        ($<Statistic className="styledStatic" value={itemData.top_bid} precision={2} />)
                                      </> :

                                      (itemData.on_sale && (reserve_addr == null || reserve_addr != null && (reserve_addr.toLowerCase() == account?.toLowerCase() || isOwnerBtnShow)) ?
                                      (itemData.price == '0' ? null :<>
                                        ($<Statistic className="styledStatic" value={itemData.price} precision={2} />)
                                      </>) : null)
                                    }
                                  </div>
                                </div>
                              </div>:<></>
                              }
                            </>
                        }

                      </div>
                      <div className="col-md-6">
                        {
                          (itemData && is_721 && itemData.sale_type =='2'  && new Date().getTime() < itemData.auction_end_date * 1000 &&  itemData.auction_start_date * 1000 < new Date().getTime()) &&
                            <>
                              <h6>
                                Auction ends on
                              </h6>
                              <div className="NorTxt" style={{fontSize:'24px' , color:'white' , fontWeight:'500'}}>
                                { getReturnValues_days(remainAuctionEndTime) + getReturnValues_hours(remainAuctionEndTime) + getReturnValues_minutes(remainAuctionEndTime) + getReturnValues_seconds(remainAuctionEndTime) != 0 &&
                                  <div style={{display:'flex'}}>
                                    {
                                      getReturnValues_days(remainAuctionEndTime) != 0 && 
                                      <div className="auctionSet">
                                        <div className="NorTxt">
                                          {getReturnValues_days(remainAuctionEndTime)}
                                        </div>
                                        <div className="auctionsub NorTxt">
                                          days
                                        </div>
                                      </div>
                                    }
                                    <div className="auctionSet">
                                      <div className="NorTxt">
                                        {getReturnValues_hours(remainAuctionEndTime)}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        hrs
                                      </div>
                                    </div>
                                    <div className="auctionSet NorTxt">
                                      <div className="NorTxt">
                                      {getReturnValues_minutes(remainAuctionEndTime)}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        mins
                                      </div>
                                    </div>
                                    <div className="auctionSet NorTxt">
                                      <div className="NorTxt">
                                      {getReturnValues_seconds(remainAuctionEndTime)}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        sec
                                      </div>
                                    </div>
                                  </div>
                                }
                              </div>
                            </>
                        }  
                        {
                          (itemData && is_721 && itemData.sale_type =='2'  && itemData.auction_start_date * 1000 > new Date().getTime()) &&
                            <>
                              <h6>
                                Time to Start
                              </h6>
                              <div className="NorTxt" style={{fontSize:'24px' , color:'white' , fontWeight:'500'}}>
                                { getReturnValues_days(itemData.auction_start_date * 1000 - new Date().getTime()) + getReturnValues_hours(itemData.auction_start_date * 1000 - new Date().getTime()) + getReturnValues_minutes(itemData.auction_start_date * 1000 - new Date().getTime()) + getReturnValues_seconds(itemData.auction_start_date * 1000 - new Date().getTime()) != 0 &&
                                  <div style={{display:'flex'}}>
                                    {
                                      getReturnValues_days(itemData.auction_start_date * 1000 - new Date().getTime()) != 0 && 
                                      <div className="auctionSet">
                                        <div className="NorTxt">
                                          {getReturnValues_days(itemData.auction_start_date * 1000 - new Date().getTime())}
                                        </div>
                                        <div className="auctionsub NorTxt">
                                          days
                                        </div>
                                      </div>
                                    }
                                    <div className="auctionSet">
                                      <div className="NorTxt">
                                        {getReturnValues_hours(itemData.auction_start_date * 1000 - new Date().getTime())}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        hrs
                                      </div>
                                    </div>
                                    <div className="auctionSet NorTxt">
                                      <div className="NorTxt">
                                      {getReturnValues_minutes(itemData.auction_start_date * 1000 - new Date().getTime())}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        mins
                                      </div>
                                    </div>
                                    <div className="auctionSet NorTxt">
                                      <div className="NorTxt">
                                      {getReturnValues_seconds(itemData.auction_start_date * 1000 - new Date().getTime())}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        sec
                                      </div>
                                    </div>
                                  </div>
                                }
                              </div>
                            </>
                        }  
                        {
                          (itemData && is_721 && itemData.sale_type =='1'  && new Date().getTime() < itemData.sale_end_date * 1000 ) &&
                            <>
                              <h6>
                                Sale ends on
                              </h6>
                              <div className="NorTxt" style={{fontSize:'24px' , color:'white' , fontWeight:'500'}}>
                                {getReturnValues_hours(remainSaleEndTime) + getReturnValues_minutes(remainSaleEndTime) + getReturnValues_seconds(remainSaleEndTime) != 0 &&
                                  <div style={{display:'flex'}}>
                                    <div className="auctionSet p-0">
                                      <div className="NorTxt">
                                        {getReturnValues_days(remainSaleEndTime)}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        days
                                      </div>
                                    </div>
                                    <div className="auctionSet">
                                      <div className="NorTxt">
                                        {getReturnValues_hours(remainSaleEndTime)}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        hrs
                                      </div>
                                    </div>
                                    <div className="auctionSet NorTxt">
                                      <div className="NorTxt">
                                      {getReturnValues_minutes(remainSaleEndTime)}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        mins
                                      </div>
                                    </div>
                                    <div className="auctionSet NorTxt">
                                      <div className="NorTxt">
                                      {getReturnValues_seconds(remainSaleEndTime)}
                                      </div>
                                      <div className="auctionsub NorTxt">
                                        sec
                                      </div>
                                    </div>
                                  </div>
                                }
                              </div>
                            </>
                        }  
                      </div>
                   </div>
                    {(isOwnerBtnShow && is_721 || !isOwnerBtnShow && ownedSupplyNum > 0) ?
                      itemData.on_sale == false ?
                        <>
                          {
                            itemData.is_voxel == true ?
                              <>
                                {
                                  (isOwnerBtnShow && is_721 || itemData && itemData.status == 'pending' && itemData.owner_of.toLowerCase() == account?.toLowerCase()) ?
                                    <>
                                      {
                                        itemData.status != 'active' && <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}}><Link to="/create" state={{ prop: itemData }}>Edit</Link></StyledButton>
                                      }
                                      <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}} onClick={() => moveToListingPage(itemData.id)}>Sell</StyledButton>
                                      <Tooltip placement="top"  title={auction_infoText_sell}>
                                          <FiInfo style={iconBtnStyle} />
                                      </Tooltip> 
                                    </>
                                  : 
                                  <>
                                    {
                                      (isOwnerBtnShow && is_721 || itemData && itemData.status == 'active' && ownedSupplyNum > 0) ?
                                        <div className="d-flex flex-row">
                                          {
                                            (is_721 && !isOwnerBtnShow || !is_721 && parseInt(ownedSupplyNum) < parseInt(itemData.supply_number)) && !(itemData.auction_end_process && is_721 && itemData.auction_end_process == true && new Date().getTime() >= itemData.auction_end_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) &&
                                            <StyledButton 
                                              data-bs-toggle="modal" 
                                              data-bs-target="#placeBid" 
                                              className="btn-main lead ItemBtnHover" 
                                              onClick={getBidHistoryData} 
                                              icon={<FaTag style={iconStyle} />} 
                                              disabled={  !(accessToken && (isOwnerBtnShow == false && is_721 || !is_721))  || (itemData.auction_end_process == true && (new Date().getTime() >= itemData.auction_end_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) || itemData.sale_type == 2 && new Date().getTime() <= itemData.auction_start_date * 1000) || isAuctionProcess == true || !is_721 && ownedSupplyNum == itemData.supply_number ? true : false } 
                                              style={window.innerWidth>768?{width:'150px'}:{width:'100px'}}>
                                                {bidText}
                                            </StyledButton>
                                          }
                                          <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}} onClick={() => moveToListingPage(itemData.id)}>Sell</StyledButton>
                                          <Tooltip placement="top"  title={auction_infoText_sell}>
                                              <FiInfo style={iconBtnStyle} />
                                          </Tooltip> 
                                        </div>
                                        :
                                        <></>
                                    }
                                  </>
                                }
                              </>
                            : <>
                                <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}} onClick={() => moveToListingPage(itemData.id)}>Sell</StyledButton>
                                <Tooltip placement="top"  title={auction_infoText_sell}>
                                    <FiInfo style={iconBtnStyle} />
                                </Tooltip> 
                              </>
                          }
                          
                        </>
                      : <>
                          {
                            canBuy || lowPrice > 0 ?
                            <>
                            
                              <div className="row">
                                <div className="col-md-6">
                                  <h6>Price</h6>
                                  <div className="nft-item-price">
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <img src={currencyLogo(itemData? itemData.chain_id : null)} alt="" width={30} style={{ marginTop: -12 }}/>
                                      <Statistic 
                                        style={{ fontColor: "#0d0c22", color: "#0d0c22", fontWeight: "bold", paddingRight: "10px", paddingLeft: "10px", marginBottom: "10px", fontSize: 28 }} 
                                        value={(lowPrice / isListingsUsdPrice).toFixed(0)} 
                                        // precision={2} 
                                      />
                                      
                                    </div>
                                  </div>
                                  <div className="nft-item-price" style={{marginTop:'-15px'}}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <img src={ethIcon} alt="" width={25} style={{marginTop:'-10px'}} />
                                      <Statistic 
                                        style={{ fontColor: "#0d0c22", color: "#0d0c22", fontWeight: "bold", paddingRight: "10px", paddingLeft: "10px", marginBottom: "10px", fontSize: 28 }} 
                                        value={(lowPrice / itemData.ethUsdPrice).toFixed(3) } 
                                      />
                                      <div className="nft-item-price-value" style={{ fontSize: 14, display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>
                                        ($<Statistic className="styledStatic" value={lowPrice} precision={2} />)
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                {
                                    (itemData && !is_721 && saleEndDate1155 > 0  && new Date().getTime() < saleEndDate1155 * 1000) &&
                                    <>
                                      <h6>
                                        Sale ends on
                                      </h6>
                                      <div className="NorTxt" style={{fontSize:'24px' , color:'white' , fontWeight:'500'}}>
                                        {getReturnValues_hours(saleEndDate1155 * 1000 - new Date().getTime()) + getReturnValues_minutes(saleEndDate1155 - new Date().getTime()) + getReturnValues_seconds(saleEndDate1155 * 1000 - new Date().getTime()) != 0 &&
                                          <div style={{display:'flex'}}>
                                            <div className="auctionSet p-0">
                                              <div className="NorTxt">
                                                {getReturnValues_days(saleEndDate1155 * 1000 - new Date().getTime())}
                                              </div>
                                              <div className="auctionsub NorTxt">
                                                days
                                              </div>
                                            </div>
                                            <div className="auctionSet">
                                              <div className="NorTxt">
                                                {getReturnValues_hours(saleEndDate1155 * 1000 - new Date().getTime())}
                                              </div>
                                              <div className="auctionsub NorTxt">
                                                hrs
                                              </div>
                                            </div>
                                            <div className="auctionSet NorTxt">
                                              <div className="NorTxt">
                                              {getReturnValues_minutes(saleEndDate1155 * 1000 - new Date().getTime())}
                                              </div>
                                              <div className="auctionsub NorTxt">
                                                mins
                                              </div>
                                            </div>
                                            <div className="auctionSet NorTxt">
                                              <div className="NorTxt">
                                              {getReturnValues_seconds(saleEndDate1155 * 1000 - new Date().getTime())}
                                              </div>
                                              <div className="auctionsub NorTxt">
                                                sec
                                              </div>
                                            </div>
                                          </div>
                                        }
                                      </div>
                                    </>
                                  }
                                </div>
                              </div>
                            </>
                            : <></>
                          }
                          <div className="d-flex flex-row">
                            {
                              canBuy ?
                                <>
                                  <StyledButton data-bs-toggle="modal" data-bs-target="#buySupplyModal" className="btn-main lead mr15 ItemBtnHover"  icon={<FaWallet style={iconStyle} disabled = {account ? false: true}/>} onClick={() => setCurrentListingItem(isListingsData[lowListId])}>Buy Now</StyledButton>
                                </>
                                : <></>
                            }
                            { (!is_721 && ownedSupplyNum > 0 && itemData.status == 'pending') &&
                              <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}}><Link to="/create" state={{ prop: itemData }}>Edit</Link></StyledButton>
                            }
                            { (!is_721 && ownedSupplyNum > 0) &&
                              <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}} onClick={() => moveToListingPage(itemData.id)}>Sell</StyledButton>
                            }
                            {
                              (is_721 && !isOwnerBtnShow || !is_721 && parseInt(ownedSupplyNum) < parseInt(itemData.supply_number)) && !(itemData.auction_end_process && is_721 && itemData.auction_end_process == true &&  new Date().getTime() >= itemData.auction_end_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) &&
                              <StyledButton data-bs-toggle="modal" data-bs-target="#placeBid" className="btn-main lead ItemBtnHover" onClick={getBidHistoryData} icon={<FaTag style={iconStyle} />} disabled={  !(accessToken && (isOwnerBtnShow == false && is_721 || !is_721))  || (itemData.auction_end_process == true && (new Date().getTime() >= itemData.auction_end_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) || itemData.sale_type == 2 && new Date().getTime() <= itemData.auction_start_date * 1000) || isAuctionProcess == true || !is_721 && ownedSupplyNum == itemData.supply_number ? true : false }>{bidText}</StyledButton>
                            }
                            {
                              (itemData.auction_end_process == true && itemData.sale_type == 2 || !is_721 || isBidHistoryData.length > 0 && itemData.sale_type == 2) ?
                                <></>
                              :
                                <StyledButton className="ItemBtnHover" disabled={itemData.top_bid > 0} style={window.innerWidth>768? (itemData.sale_type=='2'?{width:'200px',fontSize:'17px',marginRight:'20px'}:{width:'200px',fontSize:'17px'}):(itemData.sale_type=='2' ?{width:'auto',marginRight:'20px'}:{width:'auto'})} data-bs-toggle="modal" data-bs-target="#cancelListing">Cancel listing</StyledButton>

                            }
                            {
                              (!is_721 || itemData.sale_type == '2' || itemData.price == 0)
                                ?
                                  <></>
                                :
                                  <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'auto',fontSize:'17px'}:{width:'auto'}} data-bs-toggle="modal" data-bs-target="#lowerPriceLower">Lower price</StyledButton>
                            }
                            {
                              (itemData.status == 'pending' && !itemData.on_sale && itemData.owner_of.toLowerCase() == account?.toLowerCase()) &&
                              <>
                                <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}}><Link to="/create" state={{ prop: itemData }}>Edit</Link></StyledButton>
                                <StyledButton className="ItemBtnHover" style={window.innerWidth>768?{width:'150px'}:{width:'100px'}} onClick={() => moveToListingPage(itemData.id)}>Sell</StyledButton>
                              </>
                            }
                          </div>
                        </>
                     :
                      <>
                        {
                          canBuy || lowPrice > 0 ?
                          <>
                            <div className="row">
                              <div className="col-md-6">
                                <h6>Price</h6>
                                <div className="nft-item-price">
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={currencyLogo(itemData? itemData.chain_id : null)} alt="" width={30} style={{ marginTop: -12 }}/>
                                    <Statistic 
                                      style={{ fontColor: "#0d0c22", color: "#0d0c22", fontWeight: "bold", paddingRight: "10px", paddingLeft: "10px", marginBottom: "10px", fontSize: 28 }} 
                                      value={(lowPrice / isListingsUsdPrice).toFixed(0)} 
                                      // precision={2} 
                                    />
                                  </div>
                                </div>
                                <div className="nft-item-price" style={{marginTop:'-15px'}}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <img src={ethIcon} alt="" width={25} style={{marginTop:'-10px'}} />
                                      <Statistic 
                                        style={{ fontColor: "#0d0c22", color: "#0d0c22", fontWeight: "bold", paddingRight: "10px", paddingLeft: "10px", marginBottom: "10px", fontSize: 28 }} 
                                        value={(lowPrice / itemData.ethUsdPrice).toFixed(3) } 
                                      />
                                      <div className="nft-item-price-value" style={{ fontSize: 14, display: 'flex', alignItems: 'center', fontWeight: 'bold'}}>
                                        ($<Statistic className="styledStatic" value={lowPrice} precision={2} />)
                                      </div>
                                    </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                {
                                  (itemData && !is_721 && saleEndDate1155 > 0  && new Date().getTime() < saleEndDate1155 * 1000) &&
                                  <>
                                    <h6>
                                      Sale ends on
                                    </h6>
                                    <div className="NorTxt" style={{fontSize:'24px' , color:'white' , fontWeight:'500'}}>
                                      {getReturnValues_hours(saleEndDate1155 * 1000 - new Date().getTime()) + getReturnValues_minutes(saleEndDate1155 - new Date().getTime()) + getReturnValues_seconds(saleEndDate1155 * 1000 - new Date().getTime()) != 0 &&
                                        <div style={{display:'flex'}}>
                                          <div className="auctionSet p-0">
                                            <div className="NorTxt">
                                              {getReturnValues_days(saleEndDate1155 * 1000 - new Date().getTime())}
                                            </div>
                                            <div className="auctionsub NorTxt">
                                              days
                                            </div>
                                          </div>
                                          <div className="auctionSet">
                                            <div className="NorTxt">
                                              {getReturnValues_hours(saleEndDate1155 * 1000 - new Date().getTime())}
                                            </div>
                                            <div className="auctionsub NorTxt">
                                              hrs
                                            </div>
                                          </div>
                                          <div className="auctionSet NorTxt">
                                            <div className="NorTxt">
                                            {getReturnValues_minutes(saleEndDate1155 * 1000 - new Date().getTime())}
                                            </div>
                                            <div className="auctionsub NorTxt">
                                              mins
                                            </div>
                                          </div>
                                          <div className="auctionSet NorTxt">
                                            <div className="NorTxt">
                                            {getReturnValues_seconds(saleEndDate1155 * 1000 - new Date().getTime())}
                                            </div>
                                            <div className="auctionsub NorTxt">
                                              sec
                                            </div>
                                          </div>
                                        </div>
                                      }
                                    </div>
                                  </>
                                }
                              </div>
                            </div>
                          </>
                          
                          : <></>
                        }
                        <div className="d-flex flex-row">
                          { !(itemData.auction_end_process && is_721 && itemData.auction_end_process == true &&  new Date().getTime() >= itemData.auction_end_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) && is_721 && 
                            <>
                              <BuyButton data-bs-toggle="modal" data-bs-target="#buyModal" className="btn-main lead mr15 ItemBtnHover"  icon={<FaWallet style={iconStyle} />} disabled={ itemData.on_sale == true && accessToken && isOwnerBtnShow == false && itemData.sale_type !='2' && (reserve_addr != null && reserve_addr.toLowerCase() == account?.toLowerCase() || reserve_addr == null) ? false : true } >Buy Now</BuyButton>
                              <CartButton className = "ItemBtnHover" onClick={handleCart} style={{background: isCart? '#f70dff':'#eeeeee', paddingLeft:'3px', paddingRight:'3px'}} disabled={ itemData.on_sale == true && accessToken && isOwnerBtnShow == false && itemData.sale_type !='2' && (reserve_addr != null && reserve_addr.toLowerCase() == account?.toLowerCase() || reserve_addr == null) && itemData.supply_number == 1 ? false : true }><FaShoppingCart style ={{width:'1rem', height: '1rem', color: isCart? 'white':'rgba(0, 0, 0, 0.25)'}}></FaShoppingCart></CartButton>
                            </>
                          }
                          {isAuctionProcess ? 
                          <Tooltip placement="top" title={auction_infoText_buy}>
                              <FiInfo style={iconBtnStyle} />
                          </Tooltip> 
                          : 
                          <></>
                          }
                          {
                            canBuy ?
                              <>
                                <BuyButton data-bs-toggle="modal" data-bs-target="#buySupplyModal" className="btn-main lead mr15 ItemBtnHover"  icon={<FaWallet style={iconStyle} disabled = {account ? false: true}/>} onClick={() => setCurrentListingItem(isListingsData[lowListId])}>Buy Now</BuyButton>
                                <CartButton onClick={handleCart} style={{background: isCart? '#f70dff':'grey'}} disabled={ itemData.on_sale == true && accessToken && isOwnerBtnShow == false && itemData.sale_type !='2' && (reserve_addr != null && reserve_addr.toLowerCase() == account?.toLowerCase() || reserve_addr == null) && itemData.supply_number == 1 ? false : true }><FaShoppingCart style ={{width:'23px', height: '23px', padding:'0px 2px'}}></FaShoppingCart></CartButton>
                              </>
                              : <></>
                          }
                          {
                            (is_721 && !isOwnerBtnShow || !is_721 && parseInt(ownedSupplyNum) < parseInt(itemData.supply_number)) && !(itemData.auction_end_process && is_721 && itemData.auction_end_process == true &&  new Date().getTime() >= itemData.auction_end_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) &&
                            <ActionButton data-bs-toggle="modal" data-bs-target="#placeBid" className="btn-main lead ItemBtnHover" onClick={getBidHistoryData} icon={<FaTag style={iconStyle} />} disabled={  !(accessToken && (isOwnerBtnShow == false && is_721 || !is_721))  || (itemData.auction_end_process == true && (new Date().getTime() >= itemData.auction_end_date * 1000 && new Date().getTime() <= itemData.auction_pay_end_date * 1000) || itemData.sale_type == 2 && new Date().getTime() <= itemData.auction_start_date * 1000) || isAuctionProcess == true || !is_721 && ownedSupplyNum == itemData.supply_number ? true : false }>{bidText}</ActionButton>
                          }
                          {
                            (!is_721 && parseInt(ownedSupplyNum) > 0) &&
                            <ActionButton className="btn-main lead ItemBtnHover" onClick={() => moveToListingPage(itemData.id)}>Sell</ActionButton>
                          }
                          
                          {isAuctionProcess ?
                          <Tooltip placement="top" title={auction_infoText}>
                              <FiInfo style={iconBtnStyle} />
                          </Tooltip>
                          : <></>
                          }                         
                        </div>
                      </>
                     }
                  </div>
                </div>
              </div>
              </Spin>
            </StyledSection>
        }
        <div className="modal fade" id="buyModal" tabIndex="-1" aria-labelledby="buyModalLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Complete checkout</h4>
                      <input type="button" id="modalClose" ref={buyModalClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                      <TopBarLabel>
                        <Label>Item</Label>
                        <Label>Subtotal</Label>
                      </TopBarLabel>
                      <div className="modal-top-bar">
                          <ModalTopBarLeft>
                              <StyledTopBarImg src={(itemData && itemData.image)? itemData.image : itemData.raw_image} alt="image" />
                              <ImgInfo className='NorTxt'>
                                  <PTag>{itemData.collection && itemData.collection.name ? itemData.collection.name : "Unnamed"}</PTag>
                                  <PTag style={{ fontWeight: 'bold' }}>{itemData.name ? itemData.name : "Unnamed"}</PTag>
                              </ImgInfo>
                          </ModalTopBarLeft>
                          <ModalTopBarRight>
                              <div style={{ textAlign: 'right' }}>
                                <StyledStatistic className="vxlPrice" value={itemData.price && `${parseFloat(itemData.price / (ethOption? isETHPrice:isUSDPrice)).toFixed(ethOption? 3:0).toString()} ` } precision={0} prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={!ethOption? currencyLogo(itemData? itemData.chain_id : null): ethIcon} />} />
                                <StyledStatistic  value={itemData.price && itemData.price } prefix={<span style={{ width: 16, height: 16, marginBottom: 5 }}>$</span>} precision={2} />
                              </div>
                          </ModalTopBarRight>
                      </div>
                      <ModalTotalBar>
                        <div className="NorTxt">
                          <PTag  style={{  fontWeight: 'bold' }}>Total</PTag>
                        </div>
                        <ModalTopBarRight>
                            <div style={{ textAlign: 'right' }}>
                              <StyledStatistic className="vxlPrice vxlTotalPrice vxlPriceColorFul" value={itemData.price && `${parseFloat(itemData.price / (ethOption? isETHPrice:isUSDPrice)).toFixed(ethOption? 3:0)}*` } precision={0} prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={!ethOption? currencyLogo(itemData? itemData.chain_id : null): ethIcon} />} />
                              <StyledStatistic className="vxlTotalPrice" value={itemData.price && itemData.price } prefix={<span style={{ width: 16, height: 16, marginBottom: 5 }}>$</span>} precision={2} />
                            </div>
                        </ModalTopBarRight>
                      </ModalTotalBar>
                      <div style={{textAlign:'left'}}>
                        
                        <Checkbox onChange={handleTermsCheck}>By checking this box, I agree to SuperKluster's <span style={{ fontWeight: 'bold', color: 'rgb(247 13 255)' }} onClick={moveToServicePage}>Terms of Service</span></Checkbox>
                        <Checkbox style={{marginLeft:'0px'}} checked = {ethOption} onClick={handleEthOption}>Check this box to pay with your<b> Ethereum balance**</b></Checkbox>
                      </div>
                    </Spin>
                    <div className="modal-bottom-bar">
                      {
                        isShowBtnState == true ?
                          <ModalBtn onClick={handleBuyAction} disabled={(isAgreeWithTerms && !isClickConfirm) ? false : true}>Confirm checkout</ModalBtn>
                        : <ModalBtn onClick={()=>handleApproveAction(itemData.price)}>Approve</ModalBtn>
                      }
                      <div style={{textAlign:'left'}}>
                        <PTag className='NorTxt' style={{marginLeft:'5px', marginTop:'10px' ,  fontSize:'12px'}}>*This transaction will include the SuperKluster 1.5% transaction fee {itemData.royalty_fee > 0 && `, as well as the ${itemData.royalty_fee}% royalty fee.`}</PTag>
                        <PTag className='NorTxt' style={{marginLeft:'5px' ,  fontSize:'12px'}}>**You will be paying for gas fee to swap $ETH to $VXL into your wallet.</PTag>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        <div className="modal fade" id="buySupplyModal" tabIndex="-1" aria-labelledby="buySupplyModalLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Complete checkout</h4>
                      <input type="button" id="modalClose" ref={buySupplyModalClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                      <TopBarLabel>
                        <Label>Item</Label>
                        <Label>Subtotal</Label>
                      </TopBarLabel>
                      <div className="modal-top-bar">
                          <ModalTopBarLeft>
                              <StyledTopBarImg src={(itemData && itemData.image)? itemData.image : itemData.raw_image} alt="image" />
                              <ImgInfo className='NorTxt'>
                                  <PTag>{itemData.collection && itemData.collection.name ? itemData.collection.name : "Unnamed"}</PTag>
                                  <PTag style={{ fontWeight: 'bold' }}>{itemData.name ? itemData.name : "Unnamed"}</PTag>
                              </ImgInfo>
                          </ModalTopBarLeft>
                          <ModalTopBarRight>
                              <div style={{ textAlign: 'right' }}>
                                <StyledStatistic className="vxlPrice" value={isCurrentListingItem.unit_price && `${parseFloat(isCurrentListingItem.unit_price / (ethOption? isETHPrice:isListingsUsdPrice)).toFixed(ethOption? 3:0)} ` } precision={0} prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={!ethOption? currencyLogo(itemData? itemData.chain_id : null):ethIcon} />} />
                                <StyledStatistic  value={isCurrentListingItem.unit_price && isCurrentListingItem.unit_price } prefix={<span style={{ width: 16, height: 16, marginBottom: 5 }}>$</span>} precision={2} />
                                <StyledStatistic  value={isCurrentListingItem.quantity && isCurrentListingItem.quantity } prefix={<span style={{ width: 16, height: 16, marginBottom: 5 }}>quantity </span>} precision={0} />
                              </div>
                          </ModalTopBarRight>
                      </div>
                      <ModalTotalBar>
                        <div className="NorTxt">
                          <PTag  style={{  fontWeight: 'bold' }}>Total</PTag>
                        </div>
                        <ModalTopBarRight>
                            <div style={{ textAlign: 'right' }}>
                              <StyledStatistic className="vxlPrice vxlTotalPrice vxlPriceColorFul" value={isCurrentListingItem.unit_price && `${parseFloat(isCurrentListingItem.unit_price / (ethOption? isETHPrice:isListingsUsdPrice) * isCurrentListingItem.quantity).toFixed(ethOption? 3:0)} ` } precision={0} prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={!ethOption? currencyLogo(itemData? itemData.chain_id : null):ethIcon} />} />
                              <StyledStatistic className="vxlTotalPrice" value={isCurrentListingItem.unit_price && isCurrentListingItem.unit_price*isCurrentListingItem.quantity } prefix={<span style={{ width: 16, height: 16, marginBottom: 5 }}>$</span>} precision={2} />
                            </div>
                        </ModalTopBarRight>
                      </ModalTotalBar>
                      <div style={{textAlign:'left'}}>
                        
                        <Checkbox onChange={handleTermsCheck}>By checking this box, I agree to SuperKluster's <span style={{ fontWeight: 'bold', color: 'rgb(247 13 255)' }} onClick={moveToServicePage}>Terms of Service</span></Checkbox>
                        <Checkbox style={{marginLeft:'0px'}} checked = {ethOption} onClick={handleEthOption}>Check this box to pay with your<b> Ethereum balance**</b></Checkbox>
                      </div>
                    </Spin>
                    <div className="modal-bottom-bar">
                      {
                        isShowBtnState == true ?
                          <ModalBtn onClick={(e) => buyListingItem(e, isCurrentListingItem.list_id)} disabled={(isAgreeWithTerms && !isClickConfirm) ? false : true}>Confirm checkout</ModalBtn>
                        : <ModalBtn onClick={()=>handleApproveAction(itemData.price)}>Approve</ModalBtn>
                      }
                      <div style={{textAlign:'left'}}>
                        <PTag className='NorTxt' style={{marginLeft:'5px', marginTop:'10px' ,  fontSize:'12px'}}>*This transaction will include the SuperKluster 1.5% transaction fee</PTag>
                        <PTag className='NorTxt' style={{marginLeft:'5px' ,  fontSize:'12px'}}>**You will be paying for gas fee to swap $ETH to $VXL into your wallet.</PTag>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        
        <div className="modal fade" id="imageOriginalModal" tabIndex="-1" aria-labelledby="imageOriginalModal" aria-hidden="true" onClick={imageOriginalModalClose} data-bs-dismiss="modal">
          <div className="modal-dialog modal_dialog_original" >
              <div className="modal-content modal_content_original" style={{backdropFilter:'blur(2px', background:!colormodesettle.ColorMode? 'rgba(0,0,0,0.7)' :'rgba(255,255,255,0.7)', height:'auto'}}>
                  <div className="modal-header" style={{border:'none'}}>
                      <input type="button" id="modalClose" ref={imageOriginalModalClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body" onClick={imageOriginalModalClose} >
                      <LazyLoadImage
                        effect="opacity"
                        src={imageSelected}
                        className="img-fluid img-rod mb-sm-30 img_original"
                        alt=""
                      />
                  </div>
              </div>
          </div>
        </div>
        
        <div className="modal fade" id="auction_buyModal_new" tabIndex="-1" aria-labelledby="buyModalLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Complete buying</h4>
                      <input type="button" id="modalClose" ref={auction_buyModalClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                      <ModalTopBar>
                          <div className="Nortxt">
                            You can purchase only between 5 and 7 days after the auction ends.
                          </div>
                      </ModalTopBar>
                      <ModalTotalBar>
                        <div>
                          <div className="NorTxt">
                            <PTag style={{  fontWeight: 'bold' }}>Price</PTag>
                          </div>
                          <div className="NorTxt">
                            <PTag style={{  fontWeight: 'bold' }}>Token ID</PTag>
                          </div>
                        </div>
                        <ModalTopBarRight>
                            {
                              isBidHistoryData.length > 0 ?
                                <>
                                  <div style={{ textAlign: 'right' ,display:'flex' , justifyContent:'flex-end' , alignItems:'center'}}>
                                      <StyledStatistic className="vxlPrice vxlTotalPrice vxlPriceColorFul" value={isBidHistoryData &&  isBidHistoryData[0]['price'] && usd_price_set(isBidHistoryData[0]['price'] / itemData.usdPrice) }  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(itemData? itemData.chain_id : null)} />} />
                                      {
                                        isBidHistoryData &&  isBidHistoryData[0]['price'] && (`($USD ${usd_price_set_usd(isBidHistoryData[0]['price'])})`)
                                      }
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      <StyledStatistic className="vxlPrice vxlTotalPrice vxlPriceColorFul" value={isBidHistoryData &&  isBidHistoryData[0]['id'] && isBidHistoryData[0]['id'] }  /> 
                                    </div>
                                </>
                              :
                                <></>
                            }
                        </ModalTopBarRight>
                      </ModalTotalBar>
                    </Spin>
                  </div>
              </div>
          </div>
        </div>

        <div className="modal fade" id="auction_buyModal" tabIndex="-1" aria-labelledby="buyModalLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Complete auction</h4>
                      <input type="button" id="modalClose" ref={auction_buyModalClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                      <TopBarLabel>
                        <Label>Item</Label>
                        <Label>Subtotal</Label>
                      </TopBarLabel>
                      <div className="modal-top-bar">
                          <ModalTopBarLeft>
                              <StyledTopBarImg src={(itemData && itemData.image)? itemData.image : itemData.raw_image} alt="image" />
                              <ImgInfo className='NorTxt'>
                                  <PTag>{itemData.collection && itemData.collection.name ? itemData.collection.name : "Unnamed"}</PTag>
                                  <PTag style={{ fontWeight: 'bold' }}>{itemData.name ? itemData.name : "Unnamed"}</PTag>
                              </ImgInfo>
                          </ModalTopBarLeft>
                          <ModalTopBarRight>
                              <div style={{ textAlign: 'right' }}>
                                <StyledStatistic className="vxlPrice" value={isBidHistoryData[0]? isBidHistoryData[0]['price'] && `${parseFloat(isBidHistoryData[0]['price'] / (ethOption? isETHPrice:isUSDPrice)).toFixed(ethOption? 3:0).toString()} `:0 } precision={0} prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={!ethOption? currencyLogo(itemData? itemData.chain_id : null): ethIcon} />} />
                                <StyledStatistic  value={isBidHistoryData[0]? isBidHistoryData[0]['price']:0} prefix={<span style={{ width: 16, height: 16, marginBottom: 5 }}>$</span>} precision={2} />
                              </div>
                          </ModalTopBarRight>
                      </div>
                      <ModalTotalBar>
                        <div className="NorTxt">
                          <PTag  style={{  fontWeight: 'bold' }}>Total</PTag>
                        </div>
                        <ModalTopBarRight>
                            <div style={{ textAlign: 'right' }}>
                              <StyledStatistic className="vxlPrice vxlTotalPrice vxlPriceColorFul" value={isBidHistoryData[0]? isBidHistoryData[0]['price'] && `${parseFloat(isBidHistoryData[0]['price'] / (ethOption? isETHPrice:isUSDPrice)).toFixed(ethOption? 3:0)}*`:0 } precision={0} prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={!ethOption? currencyLogo(itemData? itemData.chain_id : null): ethIcon} />} />
                              <StyledStatistic className="vxlTotalPrice" value={isBidHistoryData[0]? isBidHistoryData[0]['price'] && isBidHistoryData[0]['price']:0} prefix={<span style={{ width: 16, height: 16, marginBottom: 5 }}>$</span>} precision={2} />
                            </div>
                        </ModalTopBarRight>
                      </ModalTotalBar>
                      <div style={{textAlign:'left'}}>
                        
                        <Checkbox onChange={handleTermsCheck}>By checking this box, I agree to SuperKluster's <span style={{ fontWeight: 'bold', color: 'rgb(247 13 255)' }} onClick={moveToServicePage}>Terms of Service</span></Checkbox>
                        <Checkbox style={{marginLeft:'0px'}} checked = {ethOption} onClick={handleEthOption}>Check this box to pay with your<b> Ethereum balance**</b></Checkbox>
                      </div>
                    </Spin>
                    <div className="modal-bottom-bar">
                      {
                        isShowBtnState == true ?
                          <ModalBtn onClick={() => handleBuyAction_auctionBetween(isBidHistoryData[0], 0)} disabled={(isAgreeWithTerms && !isClickConfirm) ? false : true}>Confirm Checkout</ModalBtn>
                        : <ModalBtn onClick={()=>handleApproveAction(itemData.price)}>Approve</ModalBtn>
                      }
                      <div style={{textAlign:'left'}}>
                        <PTag className='NorTxt' style={{marginLeft:'5px', marginTop:'10px' ,  fontSize:'12px'}}>*This transaction will include the SuperKluster 1.5% transaction fee {itemData.royalty_fee > 0 && `, as well as the ${itemData.royalty_fee}% royalty fee.`}</PTag>
                        <PTag className='NorTxt' style={{marginLeft:'5px' ,  fontSize:'12px'}}>**You will be paying for gas fee to swap $ETH to $VXL into your wallet.</PTag>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        </div>
          
        <div className="modal fade" id="acceptBidModal" tabIndex="-1" aria-labelledby="acceptBidLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Unlockable Content</h4>
                      <input type="button" id="modalClose" ref={acceptBidClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                    {account && ownedSupplyNum > 0 && itemData.has_unlockable_content == true
                    ?
                      <div className="NorTxt" style={{overflowWrap:"break-word"}}>
                        {itemData.unlockable_content}
                        <br/>
                        <br/>
                      </div>
                    :
                      <div className="NorTxt" style={{overflow:'hidden'}}>
                        ------------------------------------<b/>
                        ------------------------------------<b/>
                        ------------------------------------<b/>
                        ------------------------------------<b/>
                        ------------------------------------<b/>
                        ------------------------------------<b/>
                      </div>
                    
                    }
                    <ModalBottomDiv>
                        
                        {account && ownedSupplyNum > 0 && itemData.has_unlockable_content == true
                          ?
                          ""
                          :
                          <div className="NorTxt">
                            <br/>
                              This content can only be unlocked and revealed by the owner of this item.
                            <br/>
                            <br/>
                          </div>
                        }
                          
                        
                          <ModalBtn onClick={(e)=>acceptBidClose.current.click()} >close</ModalBtn>
                        
                      
                    </ModalBottomDiv>
                  </div>
              </div>
          </div>
        </div>

        <div className="modal fade" id="placeBid" tabIndex="-1" aria-labelledby="placeBidLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">{bidText}</h4>
                      <input type="button" id="modalClose" ref={bidModalClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                      <div style={{ padding: '10px 0px 5px 0px'}}>
                       {
                         itemData.sale_type == '2' ?
                            <></>
                          :
                            <>
                              <PTag className="NorTxt" style={{margin:'10px', fontWeight:'bold'}}>{bidsOfferExpiration} <span style={{color:"red"}}>*</span></PTag>
                              <DatePicker 
                                format="YYYY-MM-DD HH:mm" 
                                showTime={{ format: 'HH:mm' }} 
                                onChange={onChangeExpiration}  
                                disabledDate={(current) => {
                                  return moment().add(-1, 'days')  >= current 
                                  }
                                }
                              />
                            </>
                       }
                      </div>
                      <div style={{ padding: '5px 0px 25px 0px'}}>
                        <PTag className="NorTxt" style={{marginTop:'10px' ,marginLeft:'10px', marginBottom: '0px', fontWeight:'bold'}}>{bidOfferPrice}</PTag>
                        <FlexDiv>
                          <div style={{ width: '45%', margin: '0px 0px 0px 5px' }}>
                              <FaDollarSign className='dollarSign'/> USD
                              <StyledInput placeholder="Amount" onChange={(e) => setValidFixedPriceUSD(e.target.value)} value={isAmountUSD_show ?? ""} />
                          </div>
                          <div style={{ width: '55%', margin: '0px 0px 0px 5px' }}>
                              <StyledTokenImg src={currencyLogo(itemData? itemData.chain_id : null)} />{currencyName(itemData? itemData.chain_id : null)}
                              <StyledInput placeholder="Amount" onChange={(e) => setValidFixedPriceVXL(e.target.value)} value={isAmountVXL_show ?? ""} />
                          </div>
                        </FlexDiv>
                        {
                          !is_721 &&
                          <FlexDiv>
                          <div style={{ width: '100%', margin: '0px 0px 0px 5px' }}>
                              {itemData ? itemData.supply_number - ownedSupplyNum : 0} Available
                              <StyledInput placeholder="Quantity" onChange={(e) => setQuantityForOffer(e.target.value)} value={offerQuantity_show ?? ""} />
                          </div>
                        </FlexDiv>
                        }
                      </div>
                    </Spin>
                    <ModalBottomDiv>
                      <ModalCancelBtn style={{marginBottom:'5px'}} data-bs-dismiss="modal">Never mind</ModalCancelBtn>
                      {
                        isShowBtnState == true ?
                          <ModalBtn onClick={handleBidAction} disabled={(isBidPrice && isBidPrice > 0) && isClickBid && (itemData.sale_type != '2' && expirationDate || itemData.sale_type == '2') ? false : true}>{bidText}</ModalBtn>
                        : <ModalBtn onClick={()=>handleApproveAction(isBidPrice)} disabled={isBidPrice && isBidPrice > 0 ? false : true}>Approve</ModalBtn>
                      }
                    </ModalBottomDiv>
                  </div>
              </div>
          </div>
        </div>

        <div className="modal fade" id="cancelListing" tabIndex="-1" aria-labelledby="cancelListingLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Are you sure you want to cancel your listing?</h4>
                      <input type="button" id="modalClose" className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                    <div style={{ padding: '10px 0px 25px 0px'}}>
                      <PTag>Canceling your listing will unpublish this sale from SuperKluster and requires a transaction to make sure it will never be fulfillable.</PTag>
                    </div>
                    <ModalBottomDiv>
                      <ModalCancelBtn data-bs-dismiss="modal">Never mind</ModalCancelBtn>
                      <ModalBtn data-bs-dismiss="modal" onClick={handleCancelListing}>Cancel listing</ModalBtn>
                    </ModalBottomDiv>
                  </div>
              </div>
          </div>
        </div>

        <div className="modal fade" id="transferItem" tabIndex="-1" aria-labelledby="transferItem" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h6 className="modal-title mt-3 mb-3" id="listingLabel">Transfer your NFT to another address</h6>
                      <input type="button" id="modalClose" className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} ref = {modalTransferClose}/>
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                      <div style={{ padding: '10px 0px 0px 0px'}}>
                        <PTag>Input wallet address to transfer</PTag>
                        <StyledInput placeholder="wallet address" onChange={handleTransferAddress} value = {transferAddr} />
                        {isValidTransferAddr?<></>:<PTag className="warning-invalid-wallet-address">Invalid wallet address!</PTag>}
                      </div>
                      {
                        !itemData.is_721 && 
                        <div style={{ padding: '10px 0px 25px 0px'}}>
                        <PTag>Input amount</PTag>
                        <StyledInput placeholder="amount" onChange={handleTransferAmount} value = {transferAmount} />
                        <div className='w-100' style={{textAlign: 'right'}}>
                            <span>{itemData.transfer_available_amount? itemData.transfer_available_amount:0} available</span>
                        </div>
                      </div>
                      }
                      <ModalBottomDiv>
                        <ModalCancelBtn data-bs-dismiss="modal" onClick = {clearTransferAddr}>Cancel</ModalCancelBtn>
                        <ModalBtn onClick={handleTransfer} disabled={!isValidTransferAddr}>Transfer</ModalBtn>
                      </ModalBottomDiv>
                    </Spin>
                  </div>
              </div>
          </div>
        </div>

        <div className="modal fade" id="reportItem" tabIndex="-1" aria-labelledby="reportItem" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h6 className="modal-title mt-3 mb-3" id="listingLabel">Report this item</h6>
                      <input type="button" id="modalClose" className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} ref = {closeReportBtnClick}/>
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                        <PTag>I think this item is...</PTag>
                        <div>
                          <select onChange={(e) => handleReportTypeChange(e)} style={{width:'100%', height:'35px', borderRadius:'5px', background:'rgba(255,255,255,0.1)'}} defaultValue={null} placeholder="Select a reason">
                            <option style ={{background:'rgba(255,255,255,0.1)'}} value='Fake'>Fake / Scam / Harmful</option>
                            <option style ={{background:'rgba(255,255,255,0.1)'}} value='Sensitive'>Sensitive & Explicit content</option>
                            <option style ={{background:'rgba(255,255,255,0.1)'}} value='Spam'>Spam</option>
                            <option style ={{background:'rgba(255,255,255,0.1)'}} value='Other'>Other</option>
                          </select>
                        </div>
                      <ModalBottomDiv>
                        <ModalCancelBtn data-bs-dismiss="modal">Cancel</ModalCancelBtn>
                        <ModalBtn onClick={handleReport} disabled={!reportType}>Report</ModalBtn>
                      </ModalBottomDiv>
                    </Spin>
                  </div>
              </div>
          </div>
        </div>

        <div className="modal fade" id="lowerPriceLower" tabIndex="-1" aria-labelledby="lowerPriceLowerLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Lower the listing price</h4>
                      <input type="button" id="modalClose" ref={closeBtnClick} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                      <FlexDiv>
                          <div style={{ width: '50%', margin: '0px 0px 0px 5px' }}>
                              <FaDollarSign className='dollarSign'/> USD
                              <StyledInput placeholder="Price" defaultValue={isChangePrice} onChange={handlePriceInput} value={isChangePrice} />
                          </div>
                          <div style={{ width: '50%', margin: '0px 0px 0px 5px' }}>
                              <StyledTokenImg src={currencyLogo(itemData? itemData.chain_id : null)} /> {currencyName(itemData? itemData.chain_id : null)}
                              <StyledInput placeholder="Price" defaultValue={isChangePriceUsd} onChange={handlePriceInputUSD} value={isChangePriceUsd} />
                          </div>
                      </FlexDiv>
                      <FlexDiv>
                        <div>
                          <PTag style={{ color: '#222', fontWeight: 'bold' }}>Use previous listing expiration date</PTag>
                          {itemData.sale_type == 1 && <PTag>{isSaleEndDate ? isSaleEndDate : "undefined"}</PTag>}
                          {itemData.sale_type == 2 && <PTag>{isAuctionEndDate ? isAuctionEndDate : "undefined"}</PTag>}
                          
                        </div>
                        <div>
                          <Switch defaultChecked onChange={handleSwitch} style={{background:'#f70dff'}}/>
                        </div>
                      </FlexDiv>
                      {
                        !isSellPeriodState &&
                          <div style={{ padding: '10px 0px' }} className='date-picker-div'>
                            {itemData.sale_type == 1 && <RangePicker onChange={onDateChange} size="large" defaultValue={[moment(today, dateFormat), moment(isSaleEndDate, dateFormat)]} disabled={[true, false]} />}
                            {itemData.sale_type == 2 && <RangePicker
                                                size="large"
                                                onChange={onDateChange}
                                                disabledDate={disabledDate}
                                                showTime={{
                                                    hideDisabledOptions: true,
                                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                                }}
                                                format="YYYY-MM-DD HH:mm:ss"
                                            />
                            }
                          </div>
                      }
                      <div style={{ padding: '10px 0px' }}>
                        <PTag>You must pay an additional gas fee if you want to cancel this listing at a later point.</PTag>
                      </div>
                    </Spin>
                    <ModalBottomDiv>
                      <ModalCancelBtn data-bs-dismiss="modal">Never mind</ModalCancelBtn>
                      <ModalBtn onClick={handleSetNewPrice} disabled={isActiveBtn || isSellPeriodState == false ? false : true}>Set new price</ModalBtn>
                    </ModalBottomDiv>
                  </div>
              </div>
          </div>
        </div>

        <div className="modal fade" id="lowerPriceLower_1155" tabIndex="-1" aria-labelledby="lowerPriceLower1155Label" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Lower the listing price</h4>
                      <input type="button" id="modalClose" ref={closeBtnClick} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                      <FlexDiv>
                          <div style={{ width: '50%', margin: '0px 0px 0px 5px' }}>
                              <FaDollarSign className='dollarSign'/> USD
                              <StyledInput placeholder="Price" defaultValue={isChangePrice1155} onChange={handlePriceInput1155} value={isChangePrice1155} />
                          </div>
                          <div style={{ width: '50%', margin: '0px 0px 0px 5px' }}>
                              <StyledTokenImg src={currencyLogo(itemData? itemData.chain_id : null)} /> {currencyName(itemData? itemData.chain_id : null)}
                              <StyledInput placeholder="Price" defaultValue={isChangePriceUsd1155} onChange={handlePriceInputUSD1155} value={isChangePriceUsd1155} />
                          </div>
                      </FlexDiv>
                      <FlexDiv>
                        <div style={{ width: '50%', margin: '0px 0px 0px 5px' }}>
                          {ownedSupplyNum} Available
                          <StyledInput placeholder="Quantity" onChange={handleLowerPriceQuantity} value={lowerPriceQuantity} disabled = {isQuantityState}/>
                        </div>
                        <div>
                          <Switch defaultChecked onChange={handleQuantity} style={{background:'#f70dff'}}/>
                        </div>
                      </FlexDiv>
                      <FlexDiv>
                        <div>
                          <PTag style={{ color: '#222', fontWeight: 'bold' }}>Use previous listing expiration date</PTag>
                          {itemData.sale_type == 1 && <PTag>{isSaleEndDate ? isSaleEndDate : "undefined"}</PTag>}
                          {itemData.sale_type == 2 && <PTag>{isAuctionEndDate ? isAuctionEndDate : "undefined"}</PTag>}
                          
                        </div>
                        <div>
                          <Switch defaultChecked onChange={handleSwitch1155} style={{background:'#f70dff'}}/>
                        </div>
                      </FlexDiv>
                      {
                        !isSellPeriod1155State &&
                          <div style={{ padding: '10px 0px' }} className='date-picker-div'>
                            <RangePicker onChange={onDate1155Change} size="large" defaultValue={[moment(today, dateFormat), moment(isSaleEndDate, dateFormat)]} disabled={[true, false]} />
                          </div>
                      }
                      <div style={{ padding: '10px 0px' }}>
                        <PTag>You must pay an additional gas fee if you want to cancel this listing at a later point.</PTag>
                      </div>
                    </Spin>
                    <ModalBottomDiv>
                      <ModalCancelBtn data-bs-dismiss="modal">Never mind</ModalCancelBtn>
                      <ModalBtn onClick={handleSetNewPrice1155} disabled={isActiveBtn || isSellPeriodState == false ? false : true}>Set new price</ModalBtn>
                    </ModalBottomDiv>
                  </div>
              </div>
          </div>
        </div>
        </>  
      ) : 
        isSensitive ?
        <StyledSection className="custom-container">
              <div className="pt-md-4" style={{marginTop:'30vh'}}>
                <div className="col-md-12 text-center" style={{wordBreak:'keep-all', fontSize:'20px'}}>
                  To view this item, you must turn 'View Explicit & Sensitive Content' Toggle on your profile page
                </div>
              </div>
        </StyledSection>
        : null
      }


     <div>
        <div className="modal fade" id="listing" tabIndex="-1" aria-labelledby="listingLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Accept bidding</h4>
                      <input type="button" id="modalClose" ref={modal_acceptBidClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body">
                     
                  </div>
                  <div className="modal-body">
                      <StyledCollapse defaultActiveKey={['1', '2']} onChange={callback} expandIconPosition="start">
                          <Panel header={StepB} key="1">
                              <Spin spinning={isVerifyBState} indicator={antIcon} delay={500}>
                                  {StepBText}
                              </Spin>
                          </Panel>
                          <Panel header={StepC} key="2">
                              <Spin spinning={isVerifyCState} indicator={antIcon} delay={500}>
                                  {StepCText}
                              </Spin>
                          </Panel>
                      </StyledCollapse>
                  </div>
              </div>
          </div>
      </div>
      <div className="modal fade" id="ownersModal" tabIndex="-1" aria-labelledby="ownersModalLabel" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15, width: '98%', height: '500px' }}>
                  <div className="modal-header">
                      <h4 className="modal-title mt-3 mb-3" id="listingLabel">Owned by</h4>
                      <input type="button" id="modalClose" ref={closeBtnClick} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                  </div>
                  <div className="modal-body text-white" style={{overflowY: 'auto'}}>
                    {
                    isOwnersData && isOwnersData.length > 0 ?
                      isOwnersData.map((data, index) => (
                        <Link to={`/author/${data.owner.public_address}`}>
                        <div className="mr40 mb-4 border-top-0" key={index} data-bs-dismiss="modal">
                          <RowDiv className="item_author justify-content-between color-blue" >
                            <div className="d-flex">
                            <RowAvatar className="author_list_pp" onClick={()=>authorCollection_history(data)}>
                              <span>
                                <LazyLoadImage effect="opacity" className="lazy" src={data.owner.avatar ? data.owner.avatar : defaultUser} afterLoad={() => setLoadImgStatus(!loadImgStatus)} alt="" />
                                {
                                  (data.owner.verified == '0')? <i className="fa fa-check"></i> : <></>
                                }
                              </span>
                            </RowAvatar>
                            <RowInfo className="author_list_info" style={{  paddingTop: 0, lineHeight: 1.2 }}>
                              <PTag>
                                {data.owner.username}
                              </PTag>
                              {
                              `${data.owner.public_address.slice(0,5)}...${data.owner.public_address.slice(37,41)}`
                              }
                            </RowInfo>
                            </div>
                            <div className="">
                              {data.quantity} items
                            </div>
                          </RowDiv>
                        </div>
                        </Link>
                      )) : <NoDataDiv>No Data</NoDataDiv>
                    }
                  </div>
              </div>
          </div>
        </div>
     </div>
    </div>
  );
};

export default memo(ItemDetailPage);