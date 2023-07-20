import React, { memo, useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import { Statistic } from "antd";
import { useNavigate} from "@reach/router";
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-loading-skeleton/dist/skeleton.css'
import { currencyLogo } from "./../store/utils";

import { formatUsdPrice, formatUSD } from "./../utils";

import defaultAvatar from "./../assets/image/default_avatar.jpg";
import defaultNFT from "./../assets/image/default_nft.jpg";
import ethIcon from "./../assets/icons/ethIcon.png";

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

  @media (min-width: 425px) and (max-width: 767px) {
    width: calc(50% - 20px);

    .nft__item .nft__item_wrap {
      // height: 190px;
    }
  }

  @media (min-width: 375px) and (max-width: 479px) {
    width: calc(50% - 20px);

    .nft__item .nft__item_wrap {
      // height: 250px;
    }
  }

  @media (max-width: 374px) {
    width: calc(90% - 20px);

    .nft__item .nft__item_wrap {
      // height: 200px;
    }
  }
`;

const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;

  margin: 10px 0px 18px 0px;
  align-items: flex-end;
`;

const CardDescription = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
`;

const StyledStatistic = styled(Statistic)`
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
    <div className="nft__item m-0">
      <div className="icontype">
        <i className="fa fa-bookmark"></i>
      </div>
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
              <Skeleton style={{ width: '100%', height: 200 }} />
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
        <div className="has_offers" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: 5 }}>
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

const DetailNftCard_Item = ({
  nft,
  className = "d-item mb-4 nftcards minWidthNft",
  loadingState,
  ethPrice
}) => {
  
  const navigate = useNavigate();

  const [loadImgStatus, setLoadImgStatus] = useState(false);
  const [AuctionEndDate ,setAuctionEndDate] = useState() ;

  const setInitialDate = ()=>{
    let end_date = nft && nft.asset.auctionEndDate && nft.asset.auctionEndDate != null ? nft.asset.auctionEndDate : 0 ;
    end_date = (end_date * 1000 - new Date().getTime()) > 0 ? end_date * 1000 - new Date().getTime() : 0 ;
    setAuctionEndDate(end_date) ;
  }

  useEffect(()=>{
    // console.log(AuctionEndDate,`AuctionEndDate${nft.assetId}`);
    const timer_duration = AuctionEndDate > 0 && setTimeout(()=> setAuctionEndDate(AuctionEndDate => (AuctionEndDate - 1000) >= 0 ? (AuctionEndDate - 1000) : 0) ,1000) ;
    return ()=> clearTimeout(timer_duration) ;

  },[AuctionEndDate]);

  useEffect(()=>{
    window.addEventListener('focus', setInitialDate);
    return ()=>{
      window.removeEventListener('focus' , setInitialDate);
    }
  },[])
  useEffect(()=>{
    setInitialDate() ;
  },[nft]) ;
  
  const usd_price_set_eth = (num) => {
    let str = '';
    let res = (num / parseFloat(ethPrice)).toFixed(3);
    return res.toString();
  }
  
  const calculate_k = (item_price)=>{
    let i_price = parseInt(item_price) ;
    let str= "" ;
    if (i_price >= 1000 && i_price % 1000 == 0) str += i_price/1000 + ',000';
    else str += i_price ;
    return str ;
  }
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

  const navigateTo = (link) => {
    navigate(link);
  };
  
  const openItems =(id)=>{
    navigate(`/ItemDetail/${id}`)
    localStorage.setItem('itemId', id);
  }
  
  return (
    <Fragment>
      {/* {NftData.map((nftValue) => ( */}

        <NFTCard className={className} onClick={()=>openItems(nft.asset.id)} style={{maxWidth:'350px'}}>
          {loadingState && <SkeletonCard />}
          {
            !loadingState &&
            <div className="nft__item m-0 nftcardpage" style={{position: 'relative' ,paddingRight:'4px',paddingLeft:'4px',paddingTop:'0px', height:'100%' }}>
            
              <div className="icontype heartIconCard">
                <i className="fa fa-bookmark"></i>
              </div>
              
              <a className="author_list_pp hoverauthor" style={{ width: 40, height: 40,marginTop:'6px' ,marginLeft:'6px' }} href = {`collection-detail/${nft.collection.link}`}>
                <span>
                    <LazyLoadImage effect="opacity" src={nft && nft.collection.avatar ? nft.collection.avatar : defaultAvatar } afterLoad={() => setLoadImgStatus(true)} alt="" />
                    {nft && nft.asset.owner_verified == true? <i className="fa fa-check"></i>:<></>}
                </span>
              </a>
              <div className="nft__item_wrap" style={{marginTop:'3px'}}>
                <Outer>
                  <span>
                    <LazyLoadImage
                      effect="opacity"
                      src={nft.asset.image_preview ? nft.asset.image_preview :  (nft.asset.image ? nft.asset.image : nft.asset.blob_raw_image? nft.asset.blob_raw_image: defaultNFT)}
                      className="nft__item_preview"
                      alt=""
                    />
                  </span>
                </Outer>
              </div>
              
              <div className="nft__item_info nft_card_sub nft_card_flex_end" style={(get_remain_date_newTemplate(AuctionEndDate) != '0' && nft.asset.auctionStartDate * 1000 <= new Date().getTime()) ? {paddingRight:'19px',paddingLeft:'19px'}:{paddingRight:'19px',paddingLeft:'19px'  }}>
                <span>
                  <h4 style={{marginTop:'5px', overflow:'hidden', textOverflow:'ellipsis'}} >{nft.asset.name ? nft.asset.name : "Unnamed"}</h4>
                </span>
                
                {
                    nft.asset && nft.asset.saleType == 2 && nft.asset.auction_end_process && nft.asset.auction_end_process == true && (nft.asset && nft.asset.top_bid && nft.asset.top_bid != "null") ?
                      <CardBottom >
                        <div style={{ width: 'max-content', minHeight: 28 }}>
                          <span style={{ fontSize:'12px', fontWeight: 'bold', color: '#f70dff' }}>
                            Auction finished
                          </span>
                        </div>
                        <div className="nItemSale" style={{ textAlign: 'right' }}>
                        {nft.asset && nft.asset.top_bid && nft.asset.top_bid ? <><div className="usd_color">${formatUSD(nft.asset.top_bid)} </div></> : <></>}
                            {nft.asset && nft.asset.top_bid && nft.asset.top_bid != "null" && <StyledStatistic style={{ margin: 0 }} value={formatUsdPrice(nft.asset.top_bid / localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} />}
                            {nft.asset && nft.asset.top_bid && nft.asset.top_bid != "null" && <></> } 
                            <span style={{ fontSize:'11px', color: '#f70dff' }}>
                              winning bid
                          </span>
                        </div>
                      </CardBottom>  
                    :
                    nft.asset && nft.asset.saleType == 2 && nft.asset.auctionEndDate * 1000 >= new Date().getTime() ?
                      nft.asset.auctionStartDate * 1000 >= new Date().getTime() ?
                      <CardBottom >
                          <div style={{ width: 'max-content', marginBottom: '15px' }}>
                            {/* <br/> */}
                            <span className="mobile-margin" style={{ fontSize:'12px', fontWeight: 'bold', color: '#f70dff' }}>
                              {/* <br/> */}
                              Time to Start
                            </span>
                            <div className="nItemSale mt-2 mobile-margin" >
                              <span>
                              {get_remain_date_newTemplate(new Date().getTime() - nft.asset.auctionStartDate * 1000) != '0' && nft.asset.auctionStartDate * 1000 <= new Date().getTime() && 
                                // <div className="NorTxt nftCardCounter" style={{paddingRight:'16px',paddingLeft:'16px'}}> 
                                    <> <div className="timeleft-txt">{get_remain_date_newTemplate(new Date().getTime() - nft.asset.auctionStartDate * 1000)}</div></> 
                                // </div>
                              }
                              {get_remain_date_newTemplate(new Date().getTime() - nft.asset.auctionStartDate * 1000) != '0' && nft.asset.auctionStartDate * 1000 >= new Date().getTime()&& 
                                // <div className="NorTxt nftCardCounter" style={{paddingRight:'16px',paddingLeft:'16px'}}> 
                                <><div className="timeleft-txt">{get_remain_date_newTemplate(nft.asset.auctionStartDate * 1000 - new Date().getTime())}</div></>
                                // </div>
                              }
                              </span>
                            </div>
                            
                          </div>
                          <div   style={{ width: 'max-content' }}>
                              <span style={{ fontSize:'12px', color: '#f70dff', whiteSpace:'nowrap' }}>
                                {nft.asset.auctionStartDate * 1000 <= new Date().getTime() ? "Highest bid" : "Starting bid"}
                                
                              </span>
                              <div className="nItemSale bid-value mobile-margin" >
                                {nft.asset && nft.asset.top_bid && nft.asset.top_bid != "null" ? <StyledStatistic style={{ margin: 0 }} value={formatUsdPrice(nft.asset.top_bid/localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> : <StyledStatistic style={{ margin: 0 }} value={formatUsdPrice(nft.asset.price/localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> }
                                {nft.asset && nft.asset.top_bid && nft.asset.top_bid != "null" ? <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethIcon} /> {`${usd_price_set_eth(nft.asset.top_bid)} ($${formatUSD(nft.asset.to_bid)})`} </div></> : <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethIcon} /> {`${usd_price_set_eth(nft.asset.price)} ($${formatUSD(nft.asset.price)})`} </div></>}
                              </div>
                          </div>
                      </CardBottom>
                      :
                      <CardBottom >
                        <div style={{ width: 'max-content', minHeight: 80 }}>
                          {/* <br/> */}
                          
                          {/* <div className="nItemSale" >
                            <span style={{ fontSize: 14 }}>
                              {get_remain_date(AuctionEndDate)} left
                            </span>
                          </div> */}
                          <span style={{ fontSize:'12px', fontWeight: 'bold', color: '#f70dff' }}>
                            {/* <br/> */}
                            Time Left
                          </span>
                          <div className="nItemSale mt-2" >
                            <span style={{ fontSize: 12  , fontWeight:'200'}}>
                            {get_remain_date_newTemplate(AuctionEndDate) != '0' && nft.asset.auctionStartDate * 1000 <= new Date().getTime()&& 
                              <div className="timeleft-txt"> 
                                {get_remain_date_newTemplate(AuctionEndDate)}
                              </div>
                            }
                            </span>
                          </div>
                        </div>
                        <div className="nItemSale" style={{ textAlign: 'right', width: 'max-content', minHeight: 80 }}>
                            <span style={{ fontSize:'11px', color: '#f70dff' }}>
                              Highest bid
                            </span>
                            {nft && nft.asset && nft.asset.top_bid && nft.asset.top_bid != "null" ? <StyledStatistic style={{ margin: 0 }} value={formatUsdPrice(nft.asset.top_bid/localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> : <StyledStatistic style={{ margin: 0 }} value={formatUsdPrice(nft.asset.price/localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> }
                            {nft && nft.asset && nft.asset.top_bid && nft.asset.top_bid != "null" ? <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethIcon} /> {`${usd_price_set_eth(nft.asset.top_bid)} ($${formatUSD(nft.asset.to_bid)})`} </div></> : <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethIcon} /> {`${usd_price_set_eth(nft.asset.price)} ($${formatUSD(nft.asset.price)})`} </div></>}
                        </div>
                      </CardBottom>  
                     :
                     <CardBottom >
                       <div className="nItemSale" style={{ width: 'max-content', minHeight: 80 }}>
                           <span style={{ fontWeight: 'bold', color: '#f70dff', fontSize: '12px' }}>
                             {nft ? "Price" : null}
                           </span>
                           {nft && nft.asset && nft.asset.price && nft.asset.price != "null" && nft.asset.price > 0 ? <StyledStatistic style={{ margin: 0 }} value={formatUsdPrice(nft.asset.price / localStorage.getItem('usdPrice'))}  prefix={<img style={{ width: 13, height: 16, marginBottom: 5 }} src={currencyLogo(nft? nft.chain_id : null)} />} /> : <><div style={{ fontSize: 12}}>{nft.asset.onSale ?"Free Item":"Not for sale" }<div style={{ width: 16, height: 16 }}></div></div></>}
                            {nft && nft.asset && nft.asset.price && nft.asset.price != "null"  && nft.asset.price > 0  ? <><div className="usd_color"><img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethIcon} /> {`${usd_price_set_eth(nft.asset.price)} ($${formatUSD(nft.asset.price)})`} </div ></> :<></>}
                           {/* {nft && nft.on_sale ? <div style={{minHeight:'26px'}}></div>:<></>} */}
                       </div>
                       <div style={{ textAlign: 'right' , width: 'max-content', minHeight: 80 }}>
                           <span style={{ fontSize:'12px', color: '#f70dff' }}>
                            {nft.auctionStartDate * 1000 <= new Date().getTime() ? "Highest bid" : "Starting bid"}                          
                           </span>
                            <div className="nItemSale" >
                              {nft && nft.asset && nft.asset.top_bid && nft.asset.top_bid != "null" ? <><div className="usd_color"> - </div></> : <><div className="usd_color"> - </div></>}
                            </div>
                       </div>
                     </CardBottom>
                  }
              </div>
            </div>
          }
          
        </NFTCard>
       
    </Fragment>
  );
};

export default memo(DetailNftCard_Item);
