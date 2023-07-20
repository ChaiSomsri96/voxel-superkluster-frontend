import React, { memo, useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import { Statistic } from "antd";
import { FaHeart , FaDollarSign, FaCheck } from "react-icons/fa";
import { Tooltip } from 'antd';

import { Axios } from "./../core/axios";
import * as selectors from './../store/selectors';
import { useNavigate} from "@reach/router";
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-loading-skeleton/dist/skeleton.css'
import { currencyLogo } from './../store/utils';
import defaultAvatar from "./../assets/image/default_avatar.jpg";

import goerliIcon from "./../assets/image/blockchain/goerli.png";
import ethIcon from "./../assets/image/blockchain/ethereum.png";
import polygonIcon from "./../assets/image/blockchain/polygon.png";
import arbitrumIcon from "./../assets/image/blockchain/arbitrum.png";
import bscIcon from "./../assets/image/blockchain/binance.png";
import fantomIcon from "./../assets/image/blockchain/fantom.png";
import avalancheIcon from "./../assets/image/blockchain/avalanche.png";
import defaultNFT from "./../assets/image/default_nft.jpg";
import ethereumIcon from "./../assets/icons/ethIcon.png";

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  height: 100%;
  width: 100%;
`;

const NFTCard = styled.div`
  padding: 0!important;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all ease 400ms;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 0px 15px 2px rgba(0,0,0,0.10) !important;
  }

  @media (min-width: 1200px) {
    width: calc(20% - 20px);

    .nft__item .nft__item_wrap {
      // height: 180px;
    }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    width: calc(25% - 20px);

    .nft__item .nft__item_wrap {
      // height: 160px;
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    width: calc(33.3333% - 20px);

    .nft__item .nft__item_wrap {
      // height: 170px;
    }
  }

  @media (min-width: 360px) and (max-width: 767px) {
    width: calc(50% - 15px);
    margin-right: 0!important;
    .nft__item .nft__item_wrap {
      // height: 190px;
    }
  }

  @media (min-width: 375px) and (max-width: 479px) {
    width: calc(50% - 15px);
    margin-right: 0!important;

    .nft__item .nft__item_wrap {
      // height: 150px;
    }
  }

  @media (max-width: 374px) {
    width: calc(100% - 20px);
    margin-right: auto!important;

    .nft__item .nft__item_wrap {
      // height: 200px;
    }
  }
`;

const CardBottom = styled.div`
  @media (min-width: 426px) {
    display: flex;
    justify-content: space-between;
  }
  font-size: 14px;
  margin: 0px 0px 0px 0px;
  .nItemSale.bid-value {
    @media (min-width: 426px) {
      text-align: right;
    }
    text-align: left;
    margin-bottom: 20px;
  }
  .div {
    @media (min-width: 426px) {
      min-height: 100px;
    }
    min-height: 50px;
  }
`;

const CardDescription = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
`;

const StyledStatistic = styled(Statistic)`
  margin-top: 10px;
  .ant-statistic-content {
    font-size: 14px!important;
    overflow: hidden!important;
    white-space: nowrap!important;

    .ant-statistic-content-prefix, .ant-statistic-content-value {
      font-size: 14px!important;
      font-weight: bold!important;
      color: #727272!important;
    }
  }
`;

const SkeletonCard = () => {
  return (
    <div className="nft__item m-0" style={{ height: 360 }}>
      <div className="author_list_pp" style={{ width: 40, height: 40, zIndex: 2 }}>
        <span>
            <SkeletonTheme color="#eee" highlightColor="#ccc">
              <Skeleton height={40} width ={40} circle={true} />
            </SkeletonTheme>
        </span>
      </div>
      <div className="nft__item_wrap">
        <Outer>
          <span>
            <SkeletonTheme color="#eee" highlightColor="#ccc">
              <Skeleton style={{ width: '100%', aspectRatio:'1 / 1' }} />
            </SkeletonTheme>
          </span>
        </Outer>
      </div>
      <div className="nft__item_info">
        <span>
          <h4 style={{marginTop:'5px'}} >
            <SkeletonTheme color="#eee" highlightColor="#ccc">
              <Skeleton />
            </SkeletonTheme>
          </h4>
        </span>
        <div className="has_offers" style={{ marginBottom: 5 }}>
          <SkeletonTheme color="#eee" highlightColor="#ccc">
            <Skeleton count={1} />
          </SkeletonTheme>
        </div>
        <div className="nft__item_action">
          <span >
            <SkeletonTheme color="#eee" highlightColor="#ccc">
              <Skeleton count={1} />
            </SkeletonTheme>
          </span>
        </div>
        <div className="nft__item_like">
          <span></span>
        </div>
      </div>
    </div>
  )
}

const NftCard = ({
  nft,
  nft_inx,
  use_price ,
  ethPrice = '1',
  loadingState,
  className = "d-item mb-4 card-box-shadow-style"
}) => {
  const authorInfo = useSelector(selectors.authorInfoState).data;
  const account = localStorage.getItem('account');
  const accessToken = localStorage.getItem('accessToken');
  const [isCart, setCart] = useState(false);

  useEffect(() => {
    if(!account || !nft) return;
    let timerId = setInterval(() => {
      let flg = 0;
      let cartData = JSON.parse(localStorage.getItem('cartInfo'));
      for(let i = 0; i < cartData.length; i ++) {
        if(cartData[i].asset.id == nft.id) {
          setCart(true);
          flg = 1;
          break;
        }
      }
      if(!flg) setCart(false);
    }, 1000)
    return () => clearInterval(timerId) ;
  }, [nft, account])
  
  const header = { 'Authorization': `Bearer ${accessToken}` };
  
  const navigate = useNavigate();

  const [loadImgStatus, setLoadImgStatus] = useState(false);
  const [isLikedState, setLikedState] = useState(false);
  const [heartIconState, setHeartIconState] = useState(false);
  const [isSrcType, setSrcType] = useState("");
  const [isLikeCounter, setLikeCounter] = useState(0);
  const [likeloading , setLikeloading] = useState(0) ;

  const [AuctionEndDate ,setAuctionEndDate] = useState() ;
  const [AuctionStartDate ,setAuctionStartDate] = useState() ;

  // const [nftPage , setNFTPage]= useState();
  let nftPage ={} ;
  useEffect(() => {
    if (account && account.toLowerCase() == nft.owner_of.toLowerCase()) {
      setHeartIconState(false) 
    } else {
      setHeartIconState(true)
    }
    nftPage = nft ;
    // console.log(nftPage);
    
    if(nft.favs) setLikeCounter(parseInt(nft.favs && nft.favs.length)) ;
    else if (nft.fav_cnt && nft.fav_cnt ) setLikeCounter(parseInt(nft.fav_cnt)) ;
    setInitialDate() ;
  }, [nft]);

 

  useEffect(()=>{
    const timer_duration_end = AuctionEndDate > 0 && setTimeout(()=> setAuctionEndDate(AuctionEndDate => (AuctionEndDate - 1000) >= 0 ? (AuctionEndDate - 1000) : 0) ,1000) ;
    const timer_duration_start = AuctionStartDate > 0 && setTimeout(()=> setAuctionStartDate(AuctionStartDate => (AuctionStartDate - 1000) >= 0 ? (AuctionStartDate - 1000) : 0) ,1000) ;
    return ()=> {
      clearTimeout(timer_duration_end) ;
      clearTimeout(timer_duration_start) ;
    }

  },[AuctionEndDate]);
  useEffect(()=>{
    window.addEventListener('focus', setInitialDate);
    return ()=>{
      window.removeEventListener('focus' , setInitialDate);
    }
  },[])
  useEffect(() => {
    
    if (nft && authorInfo) {
      setLikedState(false) ;
      const favs = nft.favs;
      if(nft.favs && nft.favs.length > 0){
          const myFav = favs.filter((item) => (authorInfo && authorInfo.id) == (item.user && item.user.id));
          if (myFav.length > 0) {
            setLikedState(true) ;
          }

      }
      else if(nft.fav_cnt && nft.fav_id && nft.fav_id > 0) setLikedState(true) ;
    }
  }, [authorInfo, nft])

  const blockchainData = {
    5: { name: 'Goerli-Testnet', logo: goerliIcon},
    1: { name: 'Ethereum', logo: ethIcon},
    137: { name: 'Polygon', logo: polygonIcon},
    42161: { name: 'Arbitrum', logo: arbitrumIcon},
    56: { name: 'Binance Smart Chain', logo: bscIcon},
    250: {name: 'Fantom', logo: fantomIcon},
    43114: { name: 'Avalanche', logo: avalancheIcon}
  };

  const usd_price_set=(num)=>{
    let str = '' ;
    if(num > 1000) str = parseFloat(parseInt(num / 100)/10) + 'K' ;
    if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
    if(num < 1000) str = num.toFixed(0) ;
    return str;
  }
  const usd_price_set_usd=(num)=> {
    let str = '' ;
    if(num > 1000) str = parseFloat(parseInt(num / 100)/10) + 'K' ;
    if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
    if(num < 1000) str = num.toFixed(1) ;
    return str;
  }

  const usd_price_set_eth = (num) => {
    let str = '';
    let res = (num / parseFloat(ethPrice)).toFixed(3);
    return res.toString();
  }

  const display_sttic=(name)=>{
      if(name && name.length > 16 ) return name.slice(0, 19)+ '...' ;
      return name ;
  }

  const setInitialDate = ()=>{
      if(localStorage.getItem('rim') != null && localStorage.getItem('rim') != 'null'){
        let curr_nft = JSON.parse(localStorage.getItem('rim'))[nft_inx];
        
        let end_date = curr_nft && curr_nft.auction_end_date && curr_nft.auction_end_date != null ? curr_nft.auction_end_date : 0 ;
        let start_date = curr_nft && curr_nft.auction_start_date && curr_nft.auction_start_date != null ? curr_nft.auction_start_date : 0 ;
        
        end_date = (end_date * 1000 - new Date().getTime()) > 0 ? end_date * 1000 - new Date().getTime() : 0 ;
        start_date = (start_date * 1000 - new Date().getTime()) > 0 ? start_date * 1000 - new Date().getTime() : 0 ;
        
        setAuctionEndDate(end_date) ;
        setAuctionStartDate(start_date) ;
      }
  }

  const navigateTo = (link) => {
    navigate(link);
  };
  const get_remain_date_newTemplate =(remain_date)=>{
    // console.log(remain_date, nft.id) ;
    let remain_day = getReturnValues_days(remain_date) ;
    let remain_hour = getReturnValues_hours(remain_date) ;
    let remain_min = getReturnValues_minutes(remain_date) ;
    let remain_sec = getReturnValues_seconds(remain_date) ;
    if(remain_sec + remain_day + remain_hour + remain_min == 0) return '0' ;
    if (remain_day > 0) {
      if (remain_day == 1)
        return (remain_day) + ' day';
      else
        return (remain_day) + ' days';
    } else {
      return (remain_hour+':'+remain_min+':'+remain_sec) ;
    }    
  }
  const get_remain_date =(remain_date)=>{
    // console.log(remain_date, nft.id) ;
    let remain_day = getReturnValues_days(remain_date) ;
    let remain_hour = getReturnValues_hours(remain_date) ;
    let remain_min = getReturnValues_minutes(remain_date) ;
    let remain_sec = getReturnValues_seconds(remain_date) ;
    if (remain_date >= 24 * 3600 * 1000 ) return `${remain_day} d` ;
    if (remain_date >= 3600 * 1000) return `${remain_hour} h`;
    if (remain_date >= 60 * 1000 ) return `${remain_min} m` ;
    return `${remain_sec} s` ;
  }

  const getReturnValues_days = (countDown) => {
    // calculate time left
        // console.log(Countdown,'Countdown');
        const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
        return days ;
    
    };
  const getReturnValues_hours = (countDown) => {
    // calculate time left
    // console.log(countDown) ;
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    return hours ;

  };

  const getReturnValues_minutes = (countDown) => {
      // calculate time left
      const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));

      return minutes ;

  };
  const getReturnValues_seconds = (countDown) => {
      // calculate time left
      
      const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
      return seconds ;
      
  };


  const openItems =(e,nft ,id)=>{
    // console.log(e , e.ctrlKey) ;
    // e.preventDefault() ;
    // navigate(`/ItemDetail/${id}`)
    localStorage.setItem('itemId', id);
    localStorage.setItem('itemurl' ,nft.animation) ;
    // console.log('setitemobjurl' , nft.animation) ;
  }
  const openItemsRight =(e,nft ,id)=>{
    
    // console.log(e) ;
    // navigate(`/ItemDetail/${id}`)
      // window.open(`/ItemDetail/${id}`, '_blank', 'noopener,noreferrer');

    localStorage.setItem('itemId', id);
    localStorage.setItem('itemurl' ,nft.animation) ;
    // console.log('setitemobjurl' , nft.animation) ;
  }

  // console.log("nft: ", nft)

  const calculate_k = (item_price)=>{
    let i_price = parseInt(item_price) ;
    let str= "" ;
    if (i_price >= 1000 && i_price % 1000 == 0) str += i_price/1000 + ',000';
    else str += i_price ;
    return str ;
  }

  const setLikeNFT = async () => {
    const postData = {
      id: nft.id
    }
    if(likeloading == 1) return ;
    setLikeloading(1) ;
    await Axios.post('/api/users/like', postData, { headers: header })
                .then((res) => {
                  setLikeCounter(res.data.like === true ? isLikeCounter + 1 : isLikeCounter - 1)
                  setLikedState(!isLikedState);
                  setLikeloading(0);
                })
                .catch((err) => {
                  Object.values(err).map(function(item) {
                    if (item.data && item.data.msg) {
                      // console.log(item.data.msg)
                    }
                  })
                });
  }

  const heartIconStyle = {
    fontSize: 16,
    color: isLikedState ? '#f70dff' : '#d9d9d9', 
    marginTop: -4
  }

  const cartIconStyle = {
    fontSize: 16,
    color: '#f70dff', 
    marginTop: -4
  }

  const handleAddCart = async() => {
    const postData = {
      id: nft.id
    };
    await Axios.post('/api/cart/add-cart', postData, { headers: header })
    .then((res) => {
      let cartData = JSON.parse(localStorage.getItem('cartInfo'));
      let newData = {
        asset: nft,
        collection: nft.collection
      };
      cartData.push(newData);
      localStorage.setItem('cartInfo', JSON.stringify(cartData));
      setCart(true);
    })
    .catch((e) => {

    })
    
  }

  const handleRemoveCart = async() => {
    const postData = {
      id: nft.id
    };
    await Axios.post('/api/cart/remove-cart', postData, { headers: header })
    .then((res) => {
      let cartData = JSON.parse(localStorage.getItem('cartInfo'));
      for(let i = 0; i < cartData.length; i ++) {
        if(cartData[i].asset.id == nft.id) {
          cartData.splice(i, 1);
        }
      }
      localStorage.setItem('cartInfo', JSON.stringify(cartData));
      setCart(false);
    })
    .catch((e) => {

    })
  }

  return (
    <Fragment>
      {/* {NftData.map((nftValue) => ( */}
        <NFTCard className={className} style={{minWidth:'200px', flex:'1 1 auto', maxWidth:'350px'}} >
          {loadingState && <SkeletonCard />}
          {
            !loadingState &&
            <div className="nft__item m-0 nftcardpage" style={{ position: 'relative' ,paddingRight:'4px',paddingLeft:'4px',paddingTop:'0px', height:'100%' }}>
              <Tooltip placement="top" title={nft && nft.chain_id && blockchainData[nft.chain_id] ? blockchainData[nft.chain_id].name : 'unknown'}>
                <div className="blockchainIcon" style={{right:'36px', transform:'translateX(-50%)', width:'auto', opacity:'55%', paddingBottom:'8px'}} >
                  <LazyLoadImage effect="opacity" src={nft && nft.chain_id ? blockchainData[nft.chain_id].logo : '/img/blockchain/ethereum.png'} alt="" style={{width:25, height:25}}/>
                </div>
              </Tooltip>
              { 
                account && heartIconState ? 
                  <div className="heartIconCard" onClick={setLikeNFT}>
                    <FaHeart style={heartIconStyle}  />
                    <span style={{ color:'#d9d9d9' , marginLeft: 5, fontSize: 14 }}>{isLikeCounter >= 1000 ? `${isLikeCounter / 1000}K` : isLikeCounter}</span>
                  </div>
                :  <div className="heartIconCard" >
                    <FaHeart style={heartIconStyle} />
                    <span style={{ color:'#d9d9d9' , marginLeft: 5, fontSize: 14 }}>{isLikeCounter >= 1000 ? `${isLikeCounter / 1000}K` : isLikeCounter}</span>
                  </div>
              }
              {
                account && nft.on_sale && !isCart && account.toLowerCase() !=  nft.owner_of.toLowerCase() && nft.sale_type != 2 && nft.supply_number == 1 && (!nft.reserve_address || nft.reserve_address.toLowerCase() == account.toLowerCase()) ?
                  <div className="heartIconCard" style={{top:'36%', left:'50%', transform:'translateX(-50%)', width:'75%', textAlign:'center'}} onClick={(e) => handleAddCart()}>
                    <span style={{whiteSpace:'nowrap'}}>add to cart</span>
                  </div>
                  : 
                  account && nft.on_sale && isCart && account.toLowerCase() !=  nft.owner_of.toLowerCase() && nft.sale_type != 2 && nft.supply_number == 1 && (!nft.reserve_address || nft.reserve_address.toLowerCase() == account.toLowerCase()) ?
                    <div className="heartIconCard" style={{top:'36%', left:'50%', transform:'translateX(-50%)', width:'75%', textAlign:'center'}} onClick={(e) => handleRemoveCart()}>
                      <FaCheck style={cartIconStyle}/>
                    </div>
                    :
                    null
                }
              <a className="nftcardA" onClick={(e)=>openItems(e, nft ,nft.id)} href={`/ItemDetail/${nft.id}`} style={{height:'100%' }}>
                  
                <a className="author_list_pp hoverauthor" style={{ width: 40, height: 40,marginTop:'6px' ,marginLeft:'6px'}} href = {`collection-detail/${nft.collection.link}`}>
                  <span>
                      <LazyLoadImage effect="opacity" src={nft && nft.collection && nft.collection.avatar ? nft.collection.avatar : defaultAvatar } afterLoad={() => setLoadImgStatus(true)} alt="" />
                      {
                        (nft && nft.collection && nft.collection.verified == '1') ? <i className="fa fa-check"></i> : ""
                      }
                  </span>
                  
                </a>
                <div className="nft__item_wrap" style={{marginTop:'3px'}}>
                  <Outer>
                      {
                        isSrcType == "video/mp4" || isSrcType == "audio/mpeg" || isSrcType == "application/octet-stream" ?
                          isSrcType == 'audio/mpeg' && <>
                            <div class="nft_type_wrap">
                              <audio class="track" src="https://designesia.com/Cig Swaag - Jingle Punks.mp3" type="audio/mpeg">
                              </audio>

                              <div class="player-container">
                                <div class="play-pause"></div>
                              </div>
                              
                              <div class="circle-ripple"></div>
                            </div>
                            <LazyLoadImage 
                              effect="opacity"
                              src={nft.image_preview ? (nft.image.slice(-3).toLowerCase() == "gif" ? nft.image:nft.image_preview) : (nft.image ? nft.image : (nft.raw_image? nft.raw_image : (nft.blob_raw_image)? nft.blob_raw_image:defaultNFT))}
                              className="nft__item_preview"
                              alt=""
                            />
                          </>
                        : <LazyLoadImage 
                            effect="opacity"
                            src={nft.image_preview ? (nft.image.slice(-3).toLowerCase() == "gif" ? nft.image:nft.image_preview) : (nft.image ? nft.image : (nft.raw_image? nft.raw_image : (nft.blob_raw_image)? nft.blob_raw_image:defaultNFT))}
                            className="nft__item_preview"
                            alt=""
                          />
                      }
                  </Outer>
                </div>
                {/* {console.log(get_remain_date_newTemplate(AuctionEndDate) ,'dddd',nft.auction_start_date * 1000 - new Date().getTime())} */}
                {/* {get_remain_date_newTemplate(AuctionEndDate) != '0' && nft.sale_type == 2 && nft.auction_start_date * 1000 <= new Date().getTime() && 
                  <div className="NorTxt nftCardCounter" style={{paddingRight:'16px',paddingLeft:'16px'}}> 
                    Ends in {get_remain_date_newTemplate(AuctionEndDate)}
                  </div>
                }
                {get_remain_date_newTemplate(AuctionStartDate) != '0' && nft.sale_type == 2 && nft.auction_start_date * 1000 > new Date().getTime()&& 
                  <div className="NorTxt nftCardCounter" style={{paddingRight:'16px',paddingLeft:'16px'}}> 
                    Starts in {get_remain_date_newTemplate(AuctionStartDate)}
                  </div>
                } */}
              
                  {/* <div className="de_countdown">
                    <Clock deadline='deadline' />
                  </div> */}
                <div className="nft__item_info nft_card_sub" style={(get_remain_date_newTemplate(AuctionEndDate) != '0' && nft.auction_start_date * 1000 <= new Date().getTime()) || (get_remain_date_newTemplate(AuctionStartDate) != '0' && nft.auction_start_date * 1000 > new Date().getTime()) ? {paddingRight:'8px',paddingLeft:'8px'}:{paddingTop:'0px',paddingRight:'8px',paddingLeft:'8px'}}>
                  <span>
                    <h4 style={{marginTop:'5px', marginBottom: '20px', whiteSpace:'nowrap', overflow:'hidden', fontSize:'15px !important', textOverflow:'ellipsis'}} >{nft.name}</h4>
                  </span>
                  
                  {/* <CardDescription className="has_offers">
                    {nft.description ? nft.description : <><br/></>}
                  </CardDescription> */}
                  {
                    nft && nft.sale_type == 2 && nft.auction_end_process && nft.auction_end_process == true && (nft && nft.top_bid && nft.top_bid != "null") ?
                      <CardBottom >
                        <div style={{ width: 'max-content', minHeight: 28, marginRight:'5px' }}>
                          <span className="mobile-margin" style={{ fontSize:'11px', fontWeight: 'bold', color: '#f70dff', whiteSpace:'nowrap' }}>
                            Auction ended
                          </span>
                        </div>
                        <div className="nItemSale">
                          <span style={{ fontSize:'11px', color: '#f70dff', whiteSpace:'nowrap' }}>
                            Winning Bid
                          </span>
                          {nft && nft.top_bid && nft.top_bid != "null" && <StyledStatistic style={{ margin: 0 }} value={usd_price_set(nft.top_bid/localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} />}
                          {nft && nft.top_bid && nft.top_bid != "null" ? <><div className="usd_color"><img style={{ width: 13, height: 16, marginBottom: 5 }} src={ethereumIcon} /> {`${usd_price_set_eth(nft.top_bid)} ($${usd_price_set_usd(nft.to_bid)})`} </div></> : <></>}                          
                          {nft && nft.top_bid && nft.top_bid != "null" && <></> } 
                        </div>
                      </CardBottom>  
                    :
                     nft && nft.sale_type == 2  && nft.auction_end_date * 1000 >= new Date().getTime() ?
                     nft.auction_start_date * 1000 >= new Date().getTime() ?
                      <CardBottom >
                        <div style={{ width: 'max-content', marginBottom: '15px' }}>
                          {/* <br/> */}
                          <span className="mobile-margin" style={{ fontSize:'12px', fontWeight: 'bold', color: '#f70dff' }}>
                            {/* <br/> */}
                            Time to Start
                          </span>
                          <div className="nItemSale mt-2 mobile-margin" >
                            <span>
                            {get_remain_date_newTemplate(new Date().getTime() - nft.auction_start_date * 1000) != '0' && nft.sale_type == 2 && nft.auction_start_date * 1000 <= new Date().getTime() && 
                              // <div className="NorTxt nftCardCounter" style={{paddingRight:'16px',paddingLeft:'16px'}}> 
                                  <> <div className="timeleft-txt">{get_remain_date_newTemplate(new Date().getTime() - nft.auction_start_date * 1000)}</div></> 
                              // </div>
                            }
                            {get_remain_date_newTemplate(new Date().getTime() - nft.auction_start_date * 1000) != '0' && nft.sale_type == 2 && nft.auction_start_date * 1000 >= new Date().getTime()&& 
                              // <div className="NorTxt nftCardCounter" style={{paddingRight:'16px',paddingLeft:'16px'}}> 
                              <><div className="timeleft-txt">{get_remain_date_newTemplate(nft.auction_start_date * 1000 - new Date().getTime())}</div></>
                              // </div>
                            }
                            </span>
                          </div>
                          
                        </div>
                        <div   style={{ width: 'max-content' }}>
                            <span style={{ fontSize:'12px', color: '#f70dff', whiteSpace:'nowrap' }}>
                              {nft.auction_start_date * 1000 <= new Date().getTime() ? "Highest bid" : "Starting bid"}
                              
                            </span>
                            <div className="nItemSale bid-value mobile-margin" >
                              {nft && nft.top_bid && nft.top_bid != "null" ? <StyledStatistic style={{ margin: 0 }} value={usd_price_set(nft.top_bid/localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> : <StyledStatistic style={{ margin: 0 }} value={usd_price_set(nft.price/localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> }
                              {nft && nft.top_bid && nft.top_bid != "null" ? <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethereumIcon} /> {`${usd_price_set_eth(nft.top_bid)} ($${usd_price_set_usd(nft.to_bid)})`} </div></> : <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethereumIcon} /> {`${usd_price_set_eth(nft.price)} ($${usd_price_set_usd(nft.price)})`} </div></>}
                            </div>
                        </div>
                      </CardBottom>  
                      :
                      <CardBottom >
                        <div style={{ width: 'max-content', marginBottom: '15px' }}>
                          {/* <br/> */}
                          <span className="mobile-margin" style={{ fontSize:'12px', fontWeight: 'bold', color: '#f70dff' }}>
                            {/* <br/> */}
                            Time Left
                          </span>
                          <div className="nItemSale mt-2 mobile-margin" >
                            <span>
                            {get_remain_date_newTemplate(nft.auction_end_date * 1000 - new Date().getTime()) != '0' && nft.sale_type == 2 && nft.auction_start_date * 1000 <= new Date().getTime() && 
                              // <div className="NorTxt nftCardCounter" style={{paddingRight:'16px',paddingLeft:'16px'}}> 
                                  <> <div className="timeleft-txt">{get_remain_date_newTemplate(nft.auction_end_date * 1000 - new Date().getTime())}</div></> 
                              // </div>
                            }
                            </span>
                          </div>
                          
                        </div>
                        <div   style={{ width: 'max-content' }}>
                            <span style={{ fontSize:'12px', color: '#f70dff', whiteSpace:'nowrap' }}>
                              {nft.auction_start_date * 1000 <= new Date().getTime() ? "Highest bid" : "Starting bid"}
                              
                            </span>
                            <div className="nItemSale bid-value mobile-margin" >
                              {nft && nft.top_bid && nft.top_bid != "null" ? <StyledStatistic style={{ margin: 0 }} value={usd_price_set(nft.top_bid/localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> : <StyledStatistic style={{ margin: 0 }} value={usd_price_set(nft.price/localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> }
                              {nft && nft.top_bid && nft.top_bid != "null" ? <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethereumIcon} /> {`${usd_price_set_eth(nft.top_bid)} ($${usd_price_set_usd(nft.to_bid)})`} </div></> : <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethereumIcon} /> {`${usd_price_set_eth(nft.price)} ($${usd_price_set_usd(nft.price)})`} </div></>}
                            </div>
                        </div>
                      </CardBottom>
                     :
                      <CardBottom >
                        <div className="nItemSale" style={{ width: 'max-content' }}>
                            <span  style={{ fontWeight: 'bold', color: '#f70dff', fontSize: '12px' }}>
                              {nft ? "Price" : null}
                            </span>
                            <div className="mobile-margin">
                              {nft && nft.price && nft.price != "null" && nft.price > 0 ? <StyledStatistic style={{ margin: 0 }} value={usd_price_set(nft.price / localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 13, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> : <><div style={{ fontSize: 12}}>{nft.on_sale ?"Free Item":"Not for sale" }<div style={{ width: 16, height: 16 }}></div></div></>}
                              {nft && nft.price && nft.price != "null"  && nft.price > 0  ? <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethereumIcon} /> {`${usd_price_set_eth(nft.price)} ($${usd_price_set_usd(nft.price)})`} </div ></> :<></>}
                            </div>
                            {/* {nft && nft.on_sale ? <div style={{minHeight:'26px'}}></div>:<></>} */}
                        </div>
                        <div  style={{ width: 'max-content' }}>
                            <span style={{ fontSize:'12px', color: '#f70dff', whiteSpace:'nowrap' }}>
                              {nft.auction_start_date * 1000 <= new Date().getTime() ? "Highest bid" : "Starting bid"}                       
                            </span>
                            <div className="nItemSale bid-value mobile-margin" >
                              {nft && nft.top_bid && nft.top_bid != "null" ? <><div className="usd_color "> - </div></> : <><div className="usd_color"> - </div></>}
                            </div>
                        </div>
                      </CardBottom>
                  }
                </div>
              </a>
              
            </div>
          }
          
        </NFTCard>
       
    </Fragment>
  );
};

export default memo(NftCard);
