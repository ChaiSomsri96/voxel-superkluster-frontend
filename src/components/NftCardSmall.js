import React, { memo, useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import { Statistic } from "antd";

import { Axios } from "../core/axios";
import * as selectors from '../store/selectors';
import { useNavigate} from "@reach/router";
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-loading-skeleton/dist/skeleton.css'
import { currencyLogo } from '../store/utils';
import defaultNFT from "./../assets/image/default_nft.jpg";

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
  margin-right: 5px;
  margin-left: 5px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all ease 400ms;

  &:hover {
    transform: scale(1.03);
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
    <div className="nft__item m-0" style={{ height: 250 }}>
      {/* <div className="author_list_pp" style={{ width: 40, height: 40, zIndex: 2 }}>
        <span>
            <SkeletonTheme color="#eee" highlightColor="#ccc">
              <Skeleton height={40} width ={40} circle={true} />
            </SkeletonTheme>
        </span>
      </div> */}
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
        {/* <div className="has_offers" style={{ marginBottom: 5 }}>
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
        </div> */}
        <div className="nft__item_like">
          <span></span>
        </div>
      </div>
    </div>
  )
}

const NftCardSmall = ({
  nft,
  key,
  nft_inx,
  use_price ,
  ethPrice = '1',
  loadingState,
  className = "d-item mb-3 card-box-shadow-style"
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
    // console.log(AuctionEndDate,`AuctionEndDate${nft.assetId}`);
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
      // console.log(isLikedState , nft.favs , nft.favs.length) ;
      if(nft.favs && nft.favs.length > 0){
          const myFav = favs.filter((item) => (authorInfo && authorInfo.id) == (item.user && item.user.id));
          // console.log(myFav,nft.favs) ;
          if (myFav.length > 0) {
            setLikedState(true) ;
          }

      }
      else if(nft.fav_cnt && nft.fav_id && nft.fav_id > 0) setLikedState(true) ;
    }
  }, [authorInfo, nft])

  const usd_price_set=(num)=>{
    // console.log(use_price , num,'ddddddddddddd')
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
      // console.log(localStorage.getItem('rim') , nft_inx)
      if(localStorage.getItem('rim') != null && localStorage.getItem('rim') != 'null'){

        // console.log(JSON.parse(localStorage.getItem('rim')),nft_inx);
        let curr_nft = JSON.parse(localStorage.getItem('rim'))[nft_inx];
        // console.log(curr_nft) ;
        let end_date = curr_nft && curr_nft.auction_end_date && curr_nft.auction_end_date != null ? curr_nft.auction_end_date : 0 ;
        let start_date = curr_nft && curr_nft.auction_start_date && curr_nft.auction_start_date != null ? curr_nft.auction_start_date : 0 ;
        // console.log(curr_nft );
        // console.log('end_date');
        // console.log(curr_nftPage) ;
        end_date = (end_date * 1000 - new Date().getTime()) > 0 ? end_date * 1000 - new Date().getTime() : 0 ;
        start_date = (start_date * 1000 - new Date().getTime()) > 0 ? start_date * 1000 - new Date().getTime() : 0 ;
        // console.log(end_date * 1000 - new Date().getTime() ,end_date);
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
        <NFTCard className={className} style={{maxWidth:'220px', flex:'1 1 auto', width:'140px'}} >
          {loadingState && <SkeletonCard />}
          {
            !loadingState &&
            <div className="nft__item m-0 nftcardpage" style={{ position: 'relative' ,paddingRight:'4px',paddingLeft:'4px',paddingTop:'0px', height:'100%', paddingBottom:'0px' }}>

              <a className="nftcardA" onClick={(e)=>openItems(e, nft ,nft.id)} href={`/ItemDetail/${nft.id}`} style={{height:'100%' }}>
                  
                <div className="nft__item_wrap" style={{marginTop:'3px', marginBottom:'10px'}}>
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
                    <h5 style={{whiteSpace:'nowrap', overflow:'hidden', fontSize:'13px !important', textOverflow:'ellipsis', marginBottom:'0px'}} >{nft.name}</h5>
                  </span>
                  <div style={{display:'flex'}}>
                    {nft && nft.price && nft.price != "null" && nft.price > 0 ? <span style={{color:'grey'}}>Price: <img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />{usd_price_set(nft.price / localStorage.getItem('usdPrice'))}</span> : <><span style={{ fontSize: 12, color:'grey'}}>{nft.on_sale ?"Free Item":"Not for sale" }</span></>}
                  </div>
                  
                  {/* <CardDescription className="has_offers">
                    {nft.description ? nft.description : <><br/></>}
                  </CardDescription> */}
                  
                </div>
              </a>
              
            </div>
          }
          
        </NFTCard>
       
    </Fragment>
  );
};

export default memo(NftCardSmall);
