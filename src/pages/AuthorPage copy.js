import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button ,Table, Spin, Input, Pagination } from "antd";
import { useNavigate } from "@reach/router";
import { createBrowserHistory } from 'history';
import { LoadingOutlined } from '@ant-design/icons';
import { ethers } from "ethers";
import Swal from 'sweetalert2' ;
import { useWeb3React } from "@web3-react/core";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { BsBoxArrowUpRight } from 'react-icons/bs';

import { Axios } from "../core/axios";
import * as selectors from '../store/selectors';
import * as actions from "../store/actions/thunks";
import NftCard from "../components/NftCard";
import NftCardSelectable from "../components/NftCardSelectable";
import EmptyCard from './../components/EmptyCard';
import { approveForBatchTransfer, batchTransfer, isApprovedForBatchTransfer } from "../core/nft/interact";

import Banner from './../components/author/Banner';
import UserInfo from './../components/author/UserInfo';

import defaultNFT from "./../assets/image/default_nft.jpg";
import defaultUser from "./../assets/image/default_user.png";
import vxlCurrency from "./../assets/image/vxl_currency.png";
import profileImg from "./../assets/image/profile.png";

const ColumeGroup = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer
`

const TabControls = styled.div`
  display: flex;
  flex-wrap:wrap;
  position: relative;
`;

const TransferControls = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top:20px;
  flex-wrap: wrap;
`;

const TabButton = styled(Button)`
  color: black;
  background: #f6f6f6;
  border-color: #f6f6f6;
  border-radius: 5px;
  font-weight: bold;
  margin-right: 12px;
  margin-bottom: 9px;

  &.active {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
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
  @media (max-width: 480px) {
    padding: 6.4px 5px;
  }
`;

const ActionButton = styled(Button)`
  width: auto !important;
  padding: 0px 6px !important;
  color: black;
  background: #f6f6f6;
  border-color: #f6f6f6;
  border-radius: 5px;
  font-weight: bold;
  margin-right: 12px;
  margin-bottom: 9px;

  &.active {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
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
  @media (max-width: 480px) {
    padding: 6.4px 5px;
  }
`;

const FollowButton = styled.button`
  color: white;
  background: #f70dff;
  border-color: #f70dff;
  border-radius: 15px;
  font-weight: bold;

  &:hover {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }
  
  @media (max-width: 480px) {
    padding: 6.4px 5px;
  }
`;

const TabContent = styled.div`
  margin: 42px 0px;
`;

const NoDataDiv = styled.div`
  margin: 20px 0px;
  color: grey;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const PTag = styled.p`
    margin: 0px 0px 10px 0px;
    font-size: 14px;
`;

const StyledInput = styled(Input)`
    &.ant-input {
        padding: 6px!important;
        margin-left:10px;
    }
`;

const ModalBottomDiv = styled.div`
  padding: 20px 0px 10px;
  text-align: center;
`;

const ModalCancelBtn = styled(Button)`
  height: 40px;
  color: #f70dff;
  background: white;
  padding: 0px 25px;
  border-color: #f70dff;
  border-radius: 10px;
  font-weight: bold;
  margin: 0px 10px;

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

const AuthorPage = ({ authorId ,colormodesettle}) => {
  const dispatch = useDispatch();
  const { library } = useWeb3React();
  const authorInfo = useSelector(selectors.authorInfoState).data;
  const authorOnSaled= useSelector(selectors.authorOnSaledNftState).data;
  const authorCreated= useSelector(selectors.authorCreatedNftState).data;
  const authorLiked= useSelector(selectors.authorLikedNftState).data;
  const authorHidden = useSelector(selectors.authorHiddenNftState).data;
  const authorCollected= useSelector(selectors.authorCollectedNftState).data;
  const authorBid= useSelector(selectors.authorBidNftState).data;
  const authorSell= useSelector(selectors.authorSellNftState).data;
  const account = localStorage.getItem('account');
  const accessToken = localStorage.getItem('accessToken');
  const header = { 'Authorization': `Bearer ${accessToken}` };

  const [isFollowNumCount, setFollowNumCount] = useState(0);
  const [isAuthorInfo, setAuthorInfo] = useState({});
  const [tab, setTab] = useState(() => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    let tabName = currentUrlParams.get('tab') ;
    return tabName ? tabName: 'collected';
  });

  const history = createBrowserHistory();
  const [isLoading, setLoading] = useState(false) ;
  const [isOwnderShow , setOwnerShow] = useState(false) ;
  const [userInfo, setUserInfo] = useState({});
  const [followStatus, setFollowStatus] = useState(false) ;
  const [isFollowerEnd , setFollowerEnd] = useState(true) ;
  const [proAuthorSell , setProAuthorSell] = useState([]) ;
  const [followersList , setFollowersList] = useState([]) ;
  const [followingList, setFollowingList] = useState([]);

  const [selectedNum, setSelectedNum] = useState(0);
  const [selectedNFT, setSelectedNFT] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [isValidTransferAddr, setValidTransferAddr] = useState(false);
  const [isValidTransferAddrPink, setValidTransferAddrPink] = useState(false);
  const [isValidTransferAddrBlue, setValidTransferAddrBlue] = useState(false);
  const [isValidTransferAddrGreen, setValidTransferAddrGreen] = useState(false);
  const [isValidTransferAddrOrange, setValidTransferAddrOrange] = useState(false);
  const [isValidTransferAddrAqua, setValidTransferAddrAqua] = useState(false);
  const [isValidTransferAddrDred, setValidTransferAddrDred] = useState(false);
  const [isValidTransferAddrOlive, setValidTransferAddrOlive] = useState(false);
  const [isValidTransferAddrDgray, setValidTransferAddrDgray] = useState(false);
  const [isValidTransferAddrDgreen, setValidTransferAddrDgreen] = useState(false);
  const [isValidTransferAddrMpurple, setValidTransferAddrMpurple] = useState(false);

  const [transferAddrPink, setTransferAddrPink] = useState('');
  const [transferAddrGreen, setTransferAddrGreen] = useState('');
  const [transferAddrBlue, setTransferAddrBlue] = useState('');
  const [transferAddrOrange, setTransferAddrOrange] = useState('');
  const [transferAddrAqua, setTransferAddrAqua] = useState('');
  const [transferAddrDred, setTransferAddrDred] = useState('');
  const [transferAddrOlive, setTransferAddrOlive] = useState('');
  const [transferAddrDgray, setTransferAddrDgray] = useState('');
  const [transferAddrDgreen, setTransferAddrDgreen] = useState('');
  const [transferAddrMpurple, setTransferAddrMpurple] = useState('');

  const [followingNum, setFollowingNum] = useState(0);
  const [page_created, setPageCreated] = useState(1);
  const [page_on_sale, setPageOnSale] = useState(1);
  const [page_liked, setPageLiked] = useState(1);
  const [page_hidden, setPageHidden] = useState(1);
  const [page_collected, setPageCollected] = useState(1);
  const [page_history, setPageHistory] = useState(1);

  const [pinkChecked, setPinkChecked] = useState(true);
  const [greenChecked, setGreenChecked] = useState(false);
  const [blueChecked, setBlueChecked] = useState(false);
  const [orangeChecked, setOrangeChecked] = useState(false);
  const [aquaChecked, setAquaChecked] = useState(false);
  const [dredChecked, setDredChecked] = useState(false);
  const [oliveChecked, setOliveChecked] = useState(false);
  const [dgrayChecked, setDgrayChecked] = useState(false);
  const [dgreenChecked, setDgreenChecked] = useState(false);
  const [mpurpleChecked, setMpurpleChecked] = useState(false);

  const [curentColor, setCurrentColor] = useState('pink');

  const [greenNum, setGreenNum] = useState(0);
  const [blueNum, setBlueNum] = useState(0);
  const [pinkNum, setPinkNum] = useState(0);
  const [orangeNum, setOrangeNum] = useState(0);
  const [aquaNum, setAquaNum] = useState(0);
  const [dredNum, setDredNum] = useState(0);
  const [oliveNum, setOliveNum] = useState(0);
  const [dgrayNum, setDgrayNum] = useState(0);
  const [dgreenNum, setDgreenNum] = useState(0);
  const [mpurpleNum, setMpurpleNum] = useState(0);

  const [deselectTime, setDeselectTime] = useState(0);

  const [collections, setCollections] = useState([]);

  const handleCheck = async(str) => {
    setCurrentColor(str);
    setGreenChecked(false);
    setBlueChecked(false);
    setPinkChecked(false);
    setOrangeChecked(false);
    setAquaChecked(false);
    setDredChecked(false);
    setOliveChecked(false);
    setDgrayChecked(false);
    setDgreenChecked(false);
    setMpurpleChecked(false);

    if(str == 'pink') setPinkChecked(true);
    if(str == 'green') setGreenChecked(true);
    if(str == 'blue') setBlueChecked(true);
    if(str == 'orange') setOrangeChecked(true);
    if(str == 'aqua') setAquaChecked(true);
    if(str == 'dred') setDredChecked(true);
    if(str == 'olive') setOliveChecked(true);
    if(str == 'dgray') setDgrayChecked(true);
    if(str == 'dgreen') setDgreenChecked(true);
    if(str == 'mpurple') setMpurpleChecked(true);
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

  const navigate = useNavigate();

  const tmp = [
    {
      image:"https://superkluster-main.s3.amazonaws.com/assets/133/0x8bAE54A2EBc40408D56dBdA88F63a0252f8a00d40000002a/asset_1663340046233.jfif",
      name:'Denis',
      date:'Sunday, September 11, 2022 '
    },
    {
      image:"https://superkluster-main.s3.amazonaws.com/assets/133/0x8bAE54A2EBc40408D56dBdA88F63a0252f8a00d40000002a/asset_1663340046233.jfif",
      name:'Denis',
      date:'Sunday, September 11, 2022 '
    },
    {
      image:"https://superkluster-main.s3.amazonaws.com/assets/133/0x8bAE54A2EBc40408D56dBdA88F63a0252f8a00d40000002a/asset_1663340046233.jfif",
      name:'Denis',
      date:'Sunday, September 11, 2022 '
    },
    {
      image:"https://superkluster-main.s3.amazonaws.com/assets/133/0x8bAE54A2EBc40408D56dBdA88F63a0252f8a00d40000002a/asset_1663340046233.jfif",
      name:'Denis',
      date:'Sunday, September 11, 2022 '
    },
    {
      image:"https://superkluster-main.s3.amazonaws.com/assets/133/0x8bAE54A2EBc40408D56dBdA88F63a0252f8a00d40000002a/asset_1663340046233.jfif",
      name:'Denis',
      date:'Sunday, September 11, 2022 '
    },
   
  
  ]


  useEffect(()=>{
    localStorage.setItem('searchValue','') ;
    // setFollowersList(tmp) ;
  },[]) ;
  
  useEffect(()=>{
    // let tmp = authorSell.filter(element => {
    //   if(element.asset.sale_type == '2')
    // });
    let tmp =[] ;
    if(authorSell == null) return ;
    for(let i = 0 ; i < authorSell.length ; i++){
      let isDuplicate = 0 ;
      for(let j = 0 ; j < i ; j ++ ) {
        if(authorSell[i].asset.sale_type !=2) isDuplicate = 0 ;
        else if(authorSell[i].asset.id == authorSell[j].asset.id ) isDuplicate = 1 ;
      }

      // console.log(tmp.includes(authorSell[i].asset.id),authorSell[i].asset.id ,authorSell[i].asset.sale_type ) ;
      if(!isDuplicate || authorSell[i].asset.sale_type =='1') tmp.push(authorSell[i]) ;
    }
    // console.log(tmp,'result tmp') ;
    setProAuthorSell(tmp) ;
  },[authorSell]) ;

  
  const handleTableSort = (pagination, filters, sorter, extra) => {
    // console.log('params', pagination, filters, sorter, extra);
  }
  const fectchAuthor = async()=>{
    if(authorId) {
      dispatch(actions.fetchAuthorInfo(authorId));
    }

    if (account !== authorId) {
      await Axios.get(`/api/users/?public_address=${account}`)
      .then(res => {
        setUserInfo(res.data)
      })
      .catch(err => {
        // console.log(err)
      })
    }
  }

  useEffect( () => {
    fectchAuthor();
  }, [authorId]);

  useEffect(() => {
    setLoading(false);
  }, [authorCollected])
  
  useEffect(() => {
    if (authorInfo) {
      // console.log(authorInfo);
      setAuthorInfo(authorInfo);
      setFollowNumCount(authorInfo.followers && authorInfo.followers.length);
      setLoading(true);
      // dispatch(actions.fetchAuthorCollectedNfts(authorInfo.public_address, 1))
      if (tab == "onsale") {
        dispatch(actions.fetchAuthorOnSaledNfts(authorInfo.public_address, page_on_sale)) ;
      }
      if (tab == "created") {
        dispatch(actions.fetchAuthorCreatedNfts(authorInfo.public_address, page_created)) ;
      }
      if (tab == "liked") {
        dispatch(actions.fetchAuthorLikedNfts(authorInfo.public_address, page_liked)) ;
      }
      if (tab == "collected") {
        setSelectedNFT([]);
        dispatch(actions.fetchAuthorCollectedNfts(authorInfo.public_address, page_collected)) ;
      }
      if (tab == "activity") {
        dispatch(actions.fetchAuthorBidNfts(authorInfo.public_address, 1, 25));
      }
      if(tab == "hidden") {
        dispatch(actions.fetchAuthorHiddenNfts(authorInfo.public_address, page_hidden)) ;
      }
      if (tab == "buyers") {
        dispatch(actions.fetchAuthorSellNfts(authorInfo.public_address))
      }
      if (tab == "followers") {
        getFollowersData();
      }
      if(tab == "followings") {
        getFollowingData();
      }
      setTimeout(() => {setLoading(false)}, 2500);
    }

    if (authorInfo && userInfo) {
      const followers = authorInfo.followers;
      const myFollow = followers.filter((item) => (userInfo.id) === (item.follower));
      if (myFollow.length > 0) {
        setFollowStatus(true)
      }
    }
    // console.log(account , authorInfo.public_address,(account && account) == (authorInfo &&  authorInfo.public_address)) ;
    if((account && account.toLowerCase()) == (authorInfo &&  authorInfo.public_address.toLowerCase())) setOwnerShow(true) ;
    else setOwnerShow(false) ;
  }, [authorInfo, userInfo, tab])

  useEffect(() => {
    getFollowingData();
  }, [isAuthorInfo])

  const handleFollow = async () => {
    const userId = {
      id: isAuthorInfo.id,
      public_address: isAuthorInfo.public_address
    }
    if(isFollowerEnd == false) return ;
    setFollowerEnd(false) ;
   await Axios.post('/api/users/follow', userId, { headers: header})
    .then((res) => {
      setFollowNumCount(res.data.msg === "Follow" ? isFollowNumCount + 1 : isFollowNumCount - 1)
      setFollowStatus(!followStatus);
      setFollowerEnd(true) ;
      getFollowersData();
    })
    .catch((err) => {
      Object.values(err).map(function(item) {
        if (item.data && item.data.msg) {
          // console.log(item.data.msg)
        }
      })
    });
  }

  const handleTab = (_tab) => {
    setTab(_tab);
    setSelectedNFT([]);
    localStorage.removeItem('selectedItem');
    // navigate(`/author/${isAuthorInfo.public_address}?tab=${_tab}`)
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('tab', _tab);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
    return;
    if (_tab == "onsale") {
      setLoading(true);
      dispatch(actions.fetchAuthorOnSaledNfts(isAuthorInfo.public_address, page_on_sale)) ;
      localStorage.setItem('rim' , JSON.stringify(authorOnSaled? authorOnSaled.data:null)) ; 
      
    }
    if (_tab == "created") {
      setLoading(true);
      dispatch(actions.fetchAuthorCreatedNfts(isAuthorInfo.public_address, page_created)) ;
      localStorage.setItem('rim' , JSON.stringify(authorCreated? authorCreated.data: null))  ;
    }
    if (_tab == "liked") {
      setLoading(true);
      dispatch(actions.fetchAuthorLikedNfts(isAuthorInfo.public_address, page_liked)) ;
      localStorage.setItem('rim' , JSON.stringify(authorLiked? authorLiked.data : null))  ;
    }
    if (_tab == "collected") {
      localStorage.removeItem('selectedItem');
      setLoading(true);
      setSelectedNFT([]);
      dispatch(actions.fetchAuthorCollectedNfts(isAuthorInfo.public_address, page_collected)) ;
      localStorage.setItem('rim' , JSON.stringify(authorCollected? authorCollected.data:null)) ;
    }
    if (_tab == "activity") {
      // console.log(authorId , authorInfo , isAuthorInfo.id,'isAuthorInfo.id') ;
      dispatch(actions.fetchAuthorBidNfts(authorInfo.public_address, 1, 25));
      localStorage.setItem('rim' , JSON.stringify(authorHidden? authorHidden.data : null))  ;
    }

    if(_tab == "hidden") {
      localStorage.removeItem('selectedItem');
      setLoading(true);
      dispatch(actions.fetchAuthorHiddenNfts(isAuthorInfo.public_address, page_hidden)) ;
      localStorage.setItem('rim' , JSON.stringify(authorHidden? authorHidden.data : null))  ;
    }
    
    if (_tab == "buyers") {
      // console.log(authorId , authorInfo , isAuthorInfo.id,'isAuthorInfo.id') ;
      dispatch(actions.fetchAuthorSellNfts(authorInfo.public_address))
    }
    if (_tab == "followers") {
      getFollowersData();
    }
    if(_tab == "followings") {
      getFollowingData();
    }
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500);
    return () => clearTimeout(timer);
  }

  const getFollowersData = async() => {
    const requestData = {
      public_address: isAuthorInfo.public_address,
      user_id: userInfo.id ? userInfo.id: authorInfo? authorInfo.id:null
    };
    await Axios.post('/api/supply-assets/user-follower-list', requestData, { headers: header})
    .then((res) => {
      setFollowersList(res.data.data);
    })
    .catch((err) => {
      
    });
  }

  const getFollowingData = async() => {
    if(!isAuthorInfo || !isAuthorInfo.public_address) return;
    const requestData = {
      public_address: isAuthorInfo.public_address,
      user_id: userInfo.id ? userInfo.id: authorInfo? authorInfo.id:null
    };
    await Axios.post('/api/supply-assets/user-following-list', requestData, { headers: header})
    .then((res) => {
      setFollowingList(res.data.data);
      setFollowingNum(res.data.data.length);
    })
    .catch((err) => {
      
    });
  }

  const usd_price_set=(num)=>{
    // console.log(use_price , num,'ddddddddddddd')
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

  const TimeView = ({ time, tx_hash }) => {
    
    // console.log(time * 1000 ,'current',new Date().getTime() ,(new Date().getTime() - time * 1000)/3600/24/1000);
      // const today = new Date();
      const calcLeft = Math.floor(new Date().getTime() - time * 1000);
      const days = parseInt(calcLeft / (3600 * 24 * 1000 )) ;
      const hours = parseInt(calcLeft / (3600 * 1000)) ;
      const mins = parseInt(calcLeft / (60  * 1000)) ;
      // console.log(days , hours , mins);
      if (days >= 1) {
        if (days === 1) {
            // setTimeSheet(`${days} day`)
            return tx_hash? <a target='_blank' href={`https://goerli.etherscan.io/tx/${tx_hash}`}><span>{`${days} day` + ' ' + 'ago '}</span> <BsBoxArrowUpRight /></a>:<span>{`${days} day` + ' ' + 'ago'}</span>
        } else {
            // setTimeSheet(`${days} days`)
            return tx_hash? <a target='_blank' href={`https://goerli.etherscan.io/tx/${tx_hash}`}><span>{`${days} days` + ' ' + 'ago '}</span> <BsBoxArrowUpRight /></a>:<span>{`${days} days` + ' ' + 'ago'}</span>
        }
      } else if (hours < 24 && hours >= 1) {
          if (hours === 1) {
            // setTimeSheet(`${hours} hour`)
            return tx_hash? <a target='_blank' href={`https://goerli.etherscan.io/tx/${tx_hash}`}><span>{`${hours} hour` + ' ' + 'ago '}</span> <BsBoxArrowUpRight /></a>:<span>{`${hours} hour` + ' ' + 'ago'}</span>
          } else {
            // setTimeSheet(`${hours} hours`)
            return tx_hash? <a target='_blank' href={`https://goerli.etherscan.io/tx/${tx_hash}`}><span>{`${hours} hours` + ' ' + 'ago '}</span> <BsBoxArrowUpRight /></a>:<span>{`${hours} hours` + ' ' + 'ago'}</span>
          }
      } else if (mins < 60 && mins >= 1) {
          if (mins === 1) 
              return tx_hash? <a target='_blank' href={`https://goerli.etherscan.io/tx/${tx_hash}`}><span>{`${mins} min` + ' ' + 'ago '}</span> <BsBoxArrowUpRight /></a>:<span>{`${mins} min` + ' ' + 'ago'}</span>
          else return tx_hash? <a target='_blank' href={`https://goerli.etherscan.io/tx/${tx_hash}`}><span>{`${mins} mins` + ' ' + 'ago '}</span> <BsBoxArrowUpRight /></a>:<span>{`${mins} mins` + ' ' + 'ago'}</span>
      }

      // return <span>{timeSheet + ' ' + 'ago'}</span>
  }
  const handleMoveDetailitem =(id)=>{
    navigate(`/ItemDetail/${id}`)
    localStorage.setItem('itemId', id);
  }

  const ItemColumn = ({content}) => {
    return (
      <ColumeGroup onClick={() => handleMoveDetailitem(content && content.asset? content.asset.id:0)} style={{width:'auto'}}>
        <div className="author_list_pp" style={{ width: 40, height: 40, position:'relative' }}>
          <span>
              <img effect="opacity" src={content && content.asset && content.asset.image ? content.asset.image : defaultNFT } alt="avatar" />
          </span>
        </div>
        <div style={{ marginLeft: 5, whiteSpace:'nowrap' }}>{content && content.asset ? content.asset.name.length > 15?  content.asset.name.slice(0,15) + '...':content.asset.name:''}</div>
      </ColumeGroup>
    )
  }
  const actionTimeCheck =(content)=>{
    let endTime ;
    if(content.on_sale ==1 && content.sale_type == 1) {
      endTime = content.sale_end_date ;
    }
    if(content.on_sale ==1 && content.sale_type == 2) {
      endTime = content.auction_end_date ;
    }
    let current_time = new Date().getTime() ;
    // console.log(current_time , endTime + 5 + ) ;
    return (current_time >= (endTime+5 * 24 * 3600)*1000 && current_time <= (endTime+7 * 24 * 3600)*1000) ;
    return true ;
  }
  const actionTimeCheckSell =(content)=>{
    let endTime ;
    endTime = content.auction_end_date ;
    let current_time = new Date().getTime() ;
    // console.log(current_time , endTime + 5 + ) ;
    return (current_time >= (endTime)*1000 && current_time <= (endTime+7 * 24 * 3600)*1000) ;
  }
  const ItemColumnAction = ({content}) => {
    return (
      <ColumeGroup>
      {
        content.activity
      }
      </ColumeGroup>
    )
  }
  const ItemColumnActionSell = ({content}) => {
    return (
      <ColumeGroup onClick={() => handleMoveDetailitem(content.asset.id)}>
      {/* {console.log(content)} */}
      {
        actionTimeCheckSell(content.asset)  ?
          <ActionButton size="small" className='active' style={{width:'auto !important', padding: '0px 0px !important'}}>
            Execute sell
          </ActionButton>
          :
          <ActionButton size="small" className='active' style={{width:'auto !important', padding: '0px 0px !important'}}>
            Accept offer
          </ActionButton>
      }
      </ColumeGroup>
    )
  }

  const authorCollection =(public_address)=>{
    if(public_address.toLowerCase() == account.toLowerCase()) return;
    navigate(`/author/${public_address}`) ;
  }

  const UserDetail = ({user}) => {
    if(!user.address) {
      return (
        <span>
          ---
        </span>
        
      )
    }
    return(
      <div className="item_author" style={{position:'relative', cursor:'pointer'}} onClick={()=>authorCollection(user.address)}>
        <div className="author_list_pp" style={{cursor:'pointer'}}>
          <span>
            <LazyLoadImage effect="opacity" className="lazy" src={user && user.avatar ? user.avatar:defaultUser} alt="" />
          </span>
        </div>
        <div className="author_list_info ownerInfo">
          <span style={{whiteSpace:'nowrap'}}>{user && user.username? (user.username.length > 15 ? user.username.slice(0,10) + '...':user.username):user.address.slice(0,5) + "..." + user.address.slice(-4)}</span>
        </div>
      </div>
    )
  }

  const columns = [
    {
      title: 'Action',
      dataIndex: [],
      render: (content) => <ItemColumnAction content={content}/>
    }
    ,
    {
      title: 'Item',
      dataIndex: [],
      render: (content) => <ItemColumn content={content}/>
    },
    {
      title: '',
      dataIndex: [],
      render: (content) => <span style={{whiteSpace:'nowrap'}}>x {content.quantity}</span>
    },
    {
      title: 'From',
      dataIndex: [],
      render: (content) => <UserDetail user={content.from}/>
    },
    {
      title: 'To',
      dataIndex: [],
      render: content => <UserDetail user={content.to}/>
    },
    {
      title: 'Price',
      dataIndex: [],
      render: content => (
        content.activity == 'Sale' || content.activity == 'Listing' || content.activity == 'Bid' || content.activity == 'Auction' ?
        <div>
          <div style={{display:'flex', justifyContent:'left'}}>
            <img src={content.currency=='eth'? "/img/blockchain/ethereum.png":vxlCurrency} alt="balance" style={{ width: 18, height:18, margin: '0px 3px 3px 0px'}}/>
            <span style={{marginTop:'-2px'}}>{content.other_price? usd_price_set(content.other_price) : usd_price_set(content.price / authorBid.usdPrice)}</span>
          </div>
          <span style={{whiteSpace:'nowrap', paddingLeft:'3px'}}>{content.price + " USD"}</span>
        </div>
        :<span>-</span>
      )
    },
    {
      title: 'Time',
      dataIndex: [],
      render: content => <TimeView time={content.create_date} tx_hash={content.tx_hash}/>
    },
  ];
  const columnsSell = [
    {
      title: 'Action',
      dataIndex: ['bid_amount','asset'],
      render: ( bid,content) => <ItemColumnActionSell content={content}/>
    },
    {
      title: 'Item',
      dataIndex: 'asset',
      render: (content) => <ItemColumn content={content}/>
    },
    
    {
      title: 'Highest Bid',
      dataIndex: 'highest_bid',
      render: content => <><span><img style={{ width: 16, height: 16, marginBottom: 5 ,marginLeft: -5 }} src={vxlCurrency} />&nbsp;{usd_price_set(content/localStorage.getItem('usdPrice'))}</span><br/><span>${usdPrice_num_usd(content)}</span></> 
    },
    {
      title: 'Time',
      dataIndex: 'bid_date',
      render: time => <span><TimeView time={time}/></span>
    },
    
  ];

  const handleMoveAuthorPage = (address) => {
    navigate(`/author/${address}`)
  }

  const followUser = async(e, userAddr) => {
    const data = {
      public_address: userAddr
    }
    await Axios.post('/api/users/follow', data, { headers: header})
    .then((res) => {
      if(e.target.innerHTML == 'follow') e.target.innerHTML = 'unfollow';
      else e.target.innerHTML = 'follow';
      getFollowingData();
    })
    .catch((e) => {

    })
    
  }

  const changeBtnUnfollow = async (e) => {
    if(e.target.innerHTML == 'following') e.target.innerHTML = 'unfollow';
  }

  const changeBtnFollowing = async (e) => {
    if(e.target.innerHTML == 'unfollow') e.target.innerHTML = 'following';
  }
  
  const columnsFollowers = [
    {
      title: 'Followed by',
      width: '40%',
      dataIndex: [],
      render: (content) => <div className="item_author" style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}} onClick={() => handleMoveAuthorPage(content.follower.public_address)}>
            <div className="author_list_pp">
              <span>
                  <img effect="opacity" src={content.follower.avatar ? content.follower.avatar : profileImg } alt="avatar" />
              </span>
            </div>
            <div className="author_list_info" style = {{paddingLeft: '50px'}}>
              <span>{content.follower.name}</span>
            </div>
      </div>
    },
    
    {
      width: '40%',
      title: 'Following since',
      dataIndex: 'date',
      render: time => <TimeView time={time}/>
    },
    {
      width: '20%',
      title: '',
      dataIndex: 'follower',
      render: follower => (
        follower.public_address != userInfo.public_address ?
          <FollowButton onClick={(e) => followUser(e, follower.public_address)} >{follower.following == false? 'follow' : 'unfollow'}</FollowButton>
          : null

      )
    }
  ];

  const columnsFollowings = [
    {
      width: '40%',
      title: 'Followed',
      dataIndex: [],
      render: (content) => <div className="item_author" style = {{display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}} onClick={() => handleMoveAuthorPage(content.following.public_address)}>
            <div className="author_list_pp">
              <span>
                  <img effect="opacity" src={content.following.avatar ? content.following.avatar : profileImg } alt="avatar" />
              </span>
            </div>
            <div className="author_list_info" style = {{paddingLeft: '50px'}}>
              <span>{content.following.name}</span>
            </div>
            
      </div>
    },
    
    {
      width: '40%',
      title: 'Following since',
      dataIndex: 'date',
      render: time => <TimeView time={time}/>
    },
    {
      width: '20%',
      title: '',
      dataIndex: 'following',
      render: following => (
        following.public_address != userInfo.public_address ?
          <FollowButton onClick={(e) => followUser(e, following.public_address)} >{following.following == false? 'follow' : 'unfollow'}</FollowButton>
          : null

      )
    }
  ];

  const handleHiddenSelection = async (nftId, tokenId, collection, is_1155, is_voxel) => {
    let tmp = selectedNFT;
    let index = -1;
    for (let i = 0; i < tmp.length; i ++) {
      if(tmp[i][0] == nftId) {
        index = i;
        break;
      }
    }
    if(index > -1) tmp.splice(index, 1);
    else tmp.push([nftId, tokenId, collection, is_1155, is_voxel, 'pink']);
    setSelectedNum(tmp.length);
    setSelectedNFT(tmp);
    localStorage.setItem('selectedItem', JSON.stringify(tmp));
  }

  const handleSelection = async (nftId, tokenId, collection, is_1155, is_voxel) => {
    let tmp = selectedNFT;
    let index = -1;
    for (let i = 0; i < tmp.length; i ++) {
      if(tmp[i][0] == nftId) {
        index = i;
        break;
      }
    }
    if(index > -1) {
      if(tmp[index][5] == 'pink') setPinkNum(pinkNum => pinkNum - 1);
      if(tmp[index][5] == 'green') setGreenNum(greenNum => greenNum - 1);
      if(tmp[index][5] == 'blue') setBlueNum(blueNum => blueNum - 1);
      if(tmp[index][5] == 'orange') setOrangeNum(orangeNum => orangeNum - 1);
      if(tmp[index][5] == 'aqua') setAquaNum(aquaNum => aquaNum - 1);
      if(tmp[index][5] == 'dred') setDredNum(dredNum => dredNum - 1);
      if(tmp[index][5] == 'olive') setOliveNum(oliveNum => oliveNum - 1);
      if(tmp[index][5] == 'dgray') setDgrayNum(dgrayNum => dgrayNum - 1);
      if(tmp[index][5] == 'dgreen') setDgreenNum(dgreenNum => dgreenNum - 1);
      if(tmp[index][5] == 'mpurple') setMpurpleNum(mpurpleNum => mpurpleNum - 1);
      tmp.splice(index, 1);
    }
    else {
      if(curentColor == 'pink') setPinkNum(pinkNum => pinkNum + 1);
      if(curentColor == 'green') setGreenNum(greenNum => greenNum + 1);
      if(curentColor == 'blue') setBlueNum(blueNum => blueNum + 1);
      if(curentColor == 'orange') setOrangeNum(orangeNum => orangeNum + 1);
      if(curentColor == 'aqua') setAquaNum(aquaNum => aquaNum + 1);
      if(curentColor == 'dred') setDredNum(dredNum => dredNum + 1);
      if(curentColor == 'olive') setOliveNum(oliveNum => oliveNum + 1);
      if(curentColor == 'dgray') setDgrayNum(dgrayNum => dgrayNum + 1);
      if(curentColor == 'dgreen') setDgreenNum(dgreenNum => dgreenNum + 1);
      if(curentColor == 'mpurple') setMpurpleNum(mpurpleNum => mpurpleNum + 1);
      tmp.push([nftId, tokenId, collection, is_1155, is_voxel, curentColor]);
    }
    setSelectedNum(tmp.length);
    setSelectedNFT(tmp);
    let tmpCollection = [];
    for(let i = 0; i < tmp.length; i ++) {
      let res = tmpCollection.indexOf(tmp[i][2]);
      if(res > -1) continue;
      tmpCollection.push(tmp[i][2]);
    }
    setCollections(tmpCollection);
    setIsApproveProgress(true);
    const res = await isApprovedForBatchTransfer(library, tmpCollection, account);
    setIsApprovedForMultiSend(res);
    setIsApproveProgress(false);
    localStorage.setItem('selectedItem', JSON.stringify(tmp));
  }

  // useEffect(() => {
  //   let tmp = [];
  //   for(let i = 0; i < selectedNFT.length; i ++) {
  //     let res = tmp.indexOf(selectedNFT[2]);
  //     if(res > -1) continue;
  //     tmp.push(selectedNFT[2]);
  //   }
  //   setCollections(tmp);
  // }, [selectedNFT]);

  const [emptyWallet, setEmptyWallet] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);

  useEffect(() => {
    setValidTransferAddr(
      (isValidTransferAddrPink || !pinkNum) && 
      (!greenNum || isValidTransferAddrGreen) && 
      (!blueNum || isValidTransferAddrBlue) && 
      (!orangeNum || isValidTransferAddrOrange) &&
      (!aquaNum || isValidTransferAddrAqua) &&
      (!dredNum || isValidTransferAddrDred) && 
      (!oliveNum || isValidTransferAddrOlive) &&
      (!dgrayNum || isValidTransferAddrDgray) &&
      (!dgreenNum || isValidTransferAddrDgreen) &&
      (!mpurpleNum || isValidTransferAddrMpurple)
    );

    setEmptyWallet(false);
    setSameAddress(false);

    if(pinkNum > 0 && transferAddrPink == '') setEmptyWallet(true);
    if(greenNum > 0 && transferAddrGreen == '') setEmptyWallet(true);
    if(blueNum > 0 && transferAddrBlue == '') setEmptyWallet(true);
    if(orangeNum > 0 && transferAddrOrange == '') setEmptyWallet(true);
    if(aquaNum > 0 && transferAddrAqua == '') setEmptyWallet(true);
    if(dredNum > 0 && transferAddrDred == '') setEmptyWallet(true);
    if(oliveNum > 0 && transferAddrOlive == '') setEmptyWallet(true);
    if(dgrayNum > 0 && transferAddrDgray == '') setEmptyWallet(true);
    if(dgreenNum > 0 && transferAddrDgreen == '') setEmptyWallet(true);
    if(mpurpleNum > 0 && transferAddrMpurple == '') setEmptyWallet(true);

    if(pinkNum > 0 && transferAddrPink == account) setSameAddress(true);
    if(greenNum > 0 && transferAddrGreen == account) setSameAddress(true);
    if(blueNum > 0 && transferAddrBlue == account) setSameAddress(true);
    if(orangeNum > 0 && transferAddrOrange == account) setSameAddress(true);
    if(aquaNum > 0 && transferAddrAqua == account) setSameAddress(true);
    if(dredNum > 0 && transferAddrDred == account) setSameAddress(true);
    if(oliveNum > 0 && transferAddrOlive == account) setSameAddress(true);
    if(dgrayNum > 0 && transferAddrDgray == account) setSameAddress(true);
    if(dgreenNum > 0 && transferAddrDgreen == account) setSameAddress(true);
    if(mpurpleNum > 0 && transferAddrMpurple == account) setSameAddress(true);

  }, [isValidTransferAddrPink, isValidTransferAddrGreen, isValidTransferAddrBlue, isValidTransferAddrOrange, isValidTransferAddrAqua, isValidTransferAddrDred, isValidTransferAddrOlive, isValidTransferAddrDgray, isValidTransferAddrDgreen, isValidTransferAddrMpurple, 
      pinkNum, greenNum, blueNum, orangeNum, aquaNum, dredNum, oliveNum, dgrayNum, dgreenNum, mpurpleNum, 
      transferAddrPink, transferAddrGreen, transferAddrBlue, transferAddrOrange, transferAddrAqua, transferAddrDred, transferAddrOlive, transferAddrDgray, transferAddrDgreen, transferAddrMpurple,
      account]);

  const handleTransferAddress = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddr(false);
    } else {
      setValidTransferAddr(true);
    }
  }

  const handleTransferAddressPink = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrPink(false);
    } else {
      setValidTransferAddrPink(true);
    }
    setTransferAddrPink(value);
  }

  const handleTransferAddressGreen = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrGreen(false);
    } else {
      setValidTransferAddrGreen(true);
    }
    setTransferAddrGreen(value);
  }

  const handleTransferAddressBlue = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrBlue(false);
    } else {
      setValidTransferAddrBlue(true);
    }
    setTransferAddrBlue(value);
  }

  const handleTransferAddressOrange = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrOrange(false);
    } else {
      setValidTransferAddrOrange(true);
    }
    setTransferAddrOrange(value);
  }

  const handleTransferAddressAqua = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrAqua(false);
    } else {
      setValidTransferAddrAqua(true);
    }
    setTransferAddrAqua(value);
  }

  const handleTransferAddressDred = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrDred(false);
    } else {
      setValidTransferAddrDred(true);
    }
    setTransferAddrDred(value);
  }

  const handleTransferAddressOlive = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrOlive(false);
    } else {
      setValidTransferAddrOlive(true);
    }
    setTransferAddrOlive(value);
  }

  const handleTransferAddressDgray = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrDgray(false);
    } else {
      setValidTransferAddrDgray(true);
    }
    setTransferAddrDgray(value);
  }

  const handleTransferAddressDgreen = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrDgreen(false);
    } else {
      setValidTransferAddrDgreen(true);
    }
    setTransferAddrDgreen(value);
  }

  const handleTransferAddressMpurple = (e) => {
    const value = e.target.value;
    if (!ethers.utils.isAddress(value)) {
      setValidTransferAddrMpurple(false);
    } else {
      setValidTransferAddrMpurple(true);
    }
    setTransferAddrMpurple(value);
  }

  const clearTransferAddr = async () => {
    setTransferAddrPink('');
    setTransferAddrBlue('');
    setTransferAddrGreen('');
    setTransferAddrAqua('');
    setTransferAddrDgray('');
    setTransferAddrDgreen('');
    setTransferAddrDred('');
    setTransferAddrMpurple('');
    setTransferAddrOlive('');
    setTransferAddrOrange('');
  }

  const closeModalClick = useRef(null);
  const closeUnhideModalClick = useRef(null);

  const sendBatchTransferTxHash = async(txHash, times = 0) => {
    const send_Data = {
      transaction_hash : txHash,
      batch_count: selectedNFT? selectedNFT.length : 0
    }
    if (times > 60) {
      setLoadingState(false);
      closeModalClick.current.click();
      Swal.fire({
          title: 'Oops...',
          text: `Transaction Error - Tx Hash is invalid`,
          icon: 'error',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
      });
      return;
    }
    try {
      const result = await Axios.post("/api/sale/check-batch-transfertxhash", send_Data, { headers: header });
      if (result.data.data.checked) {
        Swal.fire({
          title: 'It worked!',
          text: 'Transferred Successfully',
          icon: 'success',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        });
        setLoadingState(false);
        setLoading(true);
        closeModalClick.current.click();
        setSelectedNFT([]);
        dispatch(actions.fetchAuthorCollectedNfts(isAuthorInfo.public_address, 1)) ;
        localStorage.setItem('rim' , JSON.stringify(authorCollected? authorCollected.data:null)) ;
        setPageCollected(1);
        const timer = setTimeout(() => {
          setLoading(false)
        }, 2500);
        return () => clearTimeout(timer);
      }
    } catch (err) {
      Swal.fire({
          title: 'Oops...',
          text: err.response.data.msg,
          icon: 'error',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
      })
    }
    setTimeout(() => sendBatchTransferTxHash(txHash, ++times), 1000);
  }

  const handleTransfer = async () => {
    setLoadingState(true);
    await batchTransfer(library, selectedNFT, collections, 
      transferAddrPink, 
      transferAddrGreen, 
      transferAddrBlue, 
      transferAddrOrange, 
      transferAddrAqua, 
      transferAddrDred,
      transferAddrOlive,
      transferAddrDgray,
      transferAddrDgreen,
      transferAddrMpurple,
      account)
      .then(async(res) => {
        if(res == '0x0' || res == '4001') {
          setLoadingState(false);
          closeModalClick.current.click();
          if(res != '4001') {
            Swal.fire({
              title: 'Batch Transfer Error',
              text: 'Transaction Failed',
              icon: 'error',
              confirmButtonText: 'Close',
              timer: 5000,
              customClass: 'swal-height'
            });
          }
          return;
        } else {
          await sendBatchTransferTxHash(res);
        }
      }).catch((err) => {
        setLoadingState(false);
        closeModalClick.current.click();
        if(err.code != 4001) {
          Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
          })
        }
      });
    // setTimeout(4000);
    // setLoadingState(false);
    // modalTransferClose.current.click();
  }

  const handleApprove = async () => {
    setLoadingState(true);
    await approveForBatchTransfer(library, collections, account)
      .then((res) => {

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
    setIsApprovedForMultiSend(true);
    setLoadingState(false);
  }

  const handleCreatedPageChange = (pageNumber) => {
    setLoading(true);
    dispatch(actions.fetchAuthorCreatedNfts(isAuthorInfo.public_address, pageNumber)) ;
    localStorage.setItem('rim' , JSON.stringify(authorCreated? authorCreated.data: null))  ;
    setPageCreated(pageNumber);
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500);
    return () => clearTimeout(timer);
  }

  const handleOnsalePageChange = (pageNumber) => {
    setLoading(true);
    dispatch(actions.fetchAuthorOnSaledNfts(isAuthorInfo.public_address, pageNumber)) ;
    localStorage.setItem('rim' , JSON.stringify(authorOnSaled? authorOnSaled.data:null)) ; 
    setPageOnSale(pageNumber);
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500);
    return () => clearTimeout(timer);
  }

  const handleLikedPageChange = (pageNumber) => {
    setLoading(true);
    dispatch(actions.fetchAuthorLikedNfts(isAuthorInfo.public_address, pageNumber)) ;
    localStorage.setItem('rim' , JSON.stringify(authorLiked? authorLiked.data : null))  ;
    setPageLiked(pageNumber);
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500);
    return () => clearTimeout(timer);
  }

  const handleHiddenPageChange = (pageNumber) => {
    setLoading(true);
    dispatch(actions.fetchAuthorHiddenNfts(isAuthorInfo.public_address, pageNumber)) ;
    localStorage.setItem('rim' , JSON.stringify(authorHidden? authorHidden.data : null))  ;
    setPageHidden(pageNumber);
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500);
    return () => clearTimeout(timer);
  }

  const handleDeselect = async () => {
    // setGreenNum(0);
    // setBlueNum(0);
    // setPinkNum(0);
    // setOrangeNum(0);
    // setAquaNum(0);
    // setDredNum(0);
    // setOliveNum(0);
    // setDgrayNum(0);
    // setDgreenNum(0);
    // setMpurpleNum(0);
    setDeselectTime(new Date().getTime());
  }

  const handleUnhide = async () => {
    setLoadingState(true);
    let res = [];
    for (let i =0 ;i < selectedNFT.length; i ++) { 
      res.push(selectedNFT[i][0]);
    }
    let sendData = {
      ids: res
    };
    setLoadingState(true);
    await Axios.post('/api/supply-assets/set-item-visible', sendData, { headers: header})
    .then((res) => {
      setDeselectTime(new Date().getTime());
      closeUnhideModalClick.current.click();
      localStorage.removeItem('selectedItem');
      setLoadingState(false);
      setLoading(true);
      setSelectedNFT([]);
      dispatch(actions.fetchAuthorHiddenNfts(isAuthorInfo.public_address, 1)) ;
      localStorage.setItem('rim' , JSON.stringify(authorHidden? authorHidden.data:null)) ;
      setPageHidden(1);
      const timer = setTimeout(() => {
        setLoading(false)
      }, 2500);
      return () => clearTimeout(timer);
    })
    .catch ((e) => {
      
      closeUnhideModalClick.current.click();
      setLoadingState(false);
      Swal.fire({
        title: 'Error',
        text: 'Unhide failed',
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      });
    })
    setLoadingState(false);
  }

  const handleCollectedPageChange = (pageNumber) => {
    setLoading(true);
    dispatch(actions.fetchAuthorCollectedNfts(isAuthorInfo.public_address, pageNumber)) ;
    localStorage.setItem('rim' , JSON.stringify(authorCollected? authorCollected.data:null)) ;
    setPageCollected(pageNumber);
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500);
    return () => clearTimeout(timer);
  }

  const handleHistoryPageChange = (pageNumber) => {
    setLoading(true);
    dispatch(actions.fetchAuthorBidNfts(isAuthorInfo.public_address, pageNumber, 25)) ;
    localStorage.setItem('rim' , JSON.stringify(authorCollected? authorCollected.data:null)) ;
    setPageHistory(pageNumber);
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500);
    return () => clearTimeout(timer);
  }

  const [isApprovedForMultiSend, setIsApprovedForMultiSend] = useState(false);
  const [isApproveProgress, setIsApproveProgress] = useState(false);

  return (
    <>
      <div>

        <Banner isAuthorInfo={isAuthorInfo}/>

        <section className='custom-container' style={{marginTop:'-8px' , paddingTop:'0px'}}>
          <div className="row">
            <UserInfo
              isAuthorInfo={isAuthorInfo}
              isOwner={isOwnderShow}
              handleTab={handleTab}
              authorId={authorId}
              handleFollow={handleFollow}
              isFollowNumCount={isFollowNumCount}
              tab={tab}
              followingNum={followingNum}
              followStatus={followStatus}
            />
            <div className="mt-2 mo-flex-btn">
              <TabControls>
                <TabButton size="large" className={tab === 'collected' ? 'active' : ''}
                  onClick={() => handleTab('collected')}>
                  Collected
                </TabButton>
                <TabButton size="large" className={tab === 'onsale' ? 'active' : ''}
                  onClick={() => handleTab('onsale')}>
                  On Sale
                </TabButton>
                <TabButton size="large" className={tab === 'created' ? 'active' : ''}
                  onClick={() => handleTab('created')}>
                  Created
                </TabButton>
                <TabButton size="large" className={tab === 'liked' ? 'active' : ''}
                  onClick={() => handleTab('liked')}>
                  Liked
                </TabButton>
                <TabButton size="large" className={tab === 'activity' ? 'active' : ''}
                  onClick={() => handleTab('activity')}>
                  Activity
                </TabButton>
                {isOwnderShow && <TabButton size="large" className={tab === 'hidden' ? 'active' : ''}
                  onClick={() => handleTab('hidden')}>
                  Hidden
                </TabButton>}
                {(isOwnderShow && false) && <TabButton size="large" className={tab === 'buyers' ? 'active' : ''}
                  onClick={() => handleTab('buyers')}>
                  Sell
                </TabButton>}
              </TabControls>
              <TransferControls>
                {
                  (tab == 'collected' && isOwnderShow) && 
                  <>
                    <div style ={{display:'flex', justifyContent: 'flex-start', flexWrap:'wrap'}}>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "pinkSelect">
                          <input type='checkbox' checked = {pinkChecked} onChange ={() => handleCheck('pink')}/>
                          <span className = "pinkCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "greenSelect">
                          <input type='checkbox' checked = {greenChecked} onChange ={() => handleCheck('green')}/>
                          <span className = "greenCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "blueSelect">
                          <input type='checkbox' checked = {blueChecked} onChange ={() => handleCheck('blue')}/>
                          <span className = "blueCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "orangeSelect">
                          <input type='checkbox' checked = {orangeChecked} onChange ={() => handleCheck('orange')}/>
                          <span className = "orangeCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "aquaSelect">
                          <input type='checkbox' checked = {aquaChecked} onChange ={() => handleCheck('aqua')}/>
                          <span className = "aquaCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "dredSelect">
                          <input type='checkbox' checked = {dredChecked} onChange ={() => handleCheck('dred')}/>
                          <span className = "dredCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "oliveSelect">
                          <input type='checkbox' checked = {oliveChecked} onChange ={() => handleCheck('olive')}/>
                          <span className = "oliveCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "dgraySelect">
                          <input type='checkbox' checked = {dgrayChecked} onChange ={() => handleCheck('dgray')}/>
                          <span className = "dgrayCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "dgreenSelect">
                          <input type='checkbox' checked = {dgreenChecked} onChange ={() => handleCheck('dgreen')}/>
                          <span className = "dgreenCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                      <div style={{position:'relative', paddingRight:'10px', marginRight:'10px', paddingBottom:'10px'}}>
                        <label className = "mpurpleSelect">
                          <input type='checkbox' checked = {mpurpleChecked} onChange ={() => handleCheck('mpurple')}/>
                          <span className = "mpurpleCheckBox"></span>
                          {/* <input name="cssCheckbox" id={nft.id} type="checkbox" class="css-checkbox" />
                          <label for={nft.id}></label> */}
                        </label>
                      </div>
                    </div>
                    <div>
                      <TabButton className={selectedNFT.length > 0 ? 'active' : ''} disabled = {selectedNFT.length > 0 ? false : true} onClick={handleDeselect}>
                        Clear All
                      </TabButton>
                      <TabButton className={selectedNFT.length > 0 ? 'active' : ''} disabled = {selectedNFT.length > 0 ? false : true} data-bs-toggle="modal" data-bs-target="#transferItem">
                        Transfer {selectedNFT.length > 0 ? '(' + selectedNFT.length + ' item' + (selectedNFT.length > 1 ? 's':'') + ')' : ''}
                      </TabButton>
                    </div>
                  </>
                }
                {
                  (tab == 'hidden' && isOwnderShow) && 
                  <>
                    <div></div>
                    <div>
                      <TabButton className={selectedNFT.length > 0 ? 'active' : ''} disabled = {selectedNFT.length > 0 ? false : true} data-bs-toggle="modal" data-bs-target="#unhideItem">
                          Unhide {selectedNFT.length > 0 ? '(' + selectedNFT.length + ' item' + (selectedNFT.length > 1 ? 's':'') + ')' : ''}
                      </TabButton>
                    </div>
                  </>
                }
              </TransferControls>
              <TabContent>
                <div className={tab !== 'onsale' ? 'hide' : ''}>
                  <div className="row">
                    {
                      localStorage.setItem('rim' , JSON.stringify(authorOnSaled? authorOnSaled:null)) 
                    }
                    {
                        !isLoading && authorOnSaled && authorOnSaled.data.length > 0 ? 
                          <>
                            {
                              authorOnSaled.data.map((nft, index) => (
                                <NftCard
                                  nft={nft}
                                  key={index}
                                  nft_inx={index}
                                  ethPrice = {authorOnSaled.ethUsdPrice}
                                  loadingState={isLoading}
                                />
                              ))
                            }
                            <EmptyCard />
                            <EmptyCard />
                            <EmptyCard />
                            <EmptyCard />
                            <EmptyCard />
                          </> : <NoDataDiv>{!isLoading ? 'No NFTs found' : 'Loading...'}</NoDataDiv>
                    }
                    <div className="spacer-single"></div>
                    <div className="text-center">
                      <Pagination showQuickJumper defaultCurrent={page_on_sale} current={page_on_sale} total={authorOnSaled? authorOnSaled.meta.total:0} defaultPageSize={20} onChange = {handleOnsalePageChange}/>
                    </div>
                  </div>
                </div>
                <div className={tab !== 'created' ? 'hide' : ''}>
                  <div className="row">
                    {/* {
                      localStorage.setItem('rim' , JSON.stringify(authorCreated)) 
                    } */}
                      {
                        !isLoading && authorCreated && authorCreated.data.length > 0 ?
                          <>
                            {
                              authorCreated.data.map((nft, index) => (
                                <NftCard
                                  nft={nft}
                                  key={index}
                                  loadingState={isLoading}
                                  ethPrice = {authorCreated.ethUsdPrice}
                                />
                              ))
                            }
                            <EmptyCard />
                            <EmptyCard />
                            <EmptyCard />
                            <EmptyCard />
                            <EmptyCard />
                          </> : <NoDataDiv>{!isLoading ? 'No NFTs found' : 'Loading...'}</NoDataDiv>
                    }
                    <div className="spacer-single"></div>
                    <div className="text-center">
                      <Pagination showQuickJumper defaultCurrent={page_created} current={page_created} total={authorCreated? authorCreated.meta.total:0} defaultPageSize={20} onChange = {handleCreatedPageChange}/>
                    </div>
                  </div>
                </div>
                <div className={tab !== 'hidden' ? 'hide' : ''}>
                  <div className="row">
                    {/* {
                      localStorage.setItem('rim' , JSON.stringify(authorCreated)) 
                    } */}
                      {
                        !isLoading && authorHidden && authorHidden.data.length > 0 ?
                          authorHidden.data.map((nft, index) => (
                            <NftCardSelectable
                              nft={nft}
                              key={index}
                              loadingState={isLoading}
                              onSelect={handleHiddenSelection}
                              currentCol = {'pink'}
                              time = {deselectTime}
                              ethPrice = {authorHidden.ethUsdPrice}
                            />
                          )) : <NoDataDiv>{!isLoading ? 'No NFTs found' : 'Loading...'}</NoDataDiv>
                    }
                    <div className="spacer-single"></div>
                    <div className="text-center">
                      <Pagination showQuickJumper defaultCurrent={page_hidden} current={page_hidden} total={authorHidden? authorHidden.meta.total:0} defaultPageSize={20} onChange = {handleHiddenPageChange}/>
                    </div>
                  </div>
                </div>
                <div className={tab !== 'liked' ? 'hide' : ''}>
                  <div className="row">
                    {/* {
                      localStorage.setItem('rim' , JSON.stringify(authorLiked)) 
                    } */}
                      {
                        !isLoading && authorLiked && authorLiked.data.length > 0 ?
                          <>
                            {
                              authorLiked.data.map((nft, index) => (
                                <NftCard
                                  nft={nft}
                                  key={index}
                                  loadingState={isLoading}
                                  ethPrice = {authorLiked.ethUsdPrice}
                                />
                              ))    
                            }
                            <EmptyCard />
                            <EmptyCard />
                            <EmptyCard />
                            <EmptyCard />
                            <EmptyCard />
                          </>
                           : <NoDataDiv>{!isLoading ? 'No NFTs found' : 'Loading...'}</NoDataDiv>
                    }
                    <div className="spacer-single"></div>
                    <div className="text-center">
                      <Pagination showQuickJumper defaultCurrent={page_liked} current={page_liked} total={authorLiked? authorLiked.meta.total:0} defaultPageSize={20} onChange = {handleLikedPageChange}/>
                    </div>
                  </div>
                </div>
                <div className={tab !== 'collected' ? 'hide' : ''}>
                  <div className="row">
                  {/* {
                    localStorage.setItem('rim' , JSON.stringify(authorCollected)) 
                  } */}
                    {
                      !isLoading && authorCollected && authorCollected.data.length > 0 ?
                      <>
                        {
                          authorCollected.data.map((nft, index) => (
                            isOwnderShow ?
                              <NftCardSelectable
                                nft={nft}
                                key={index}
                                loadingState={isLoading}
                                onSelect={handleSelection}
                                currentCol = {curentColor}
                                time = {deselectTime}
                                ethPrice = {authorCollected.ethUsdPrice}
                              />
                              :
                              <NftCard
                                nft={nft}
                                key={index}
                                loadingState={isLoading}
                                ethPrice = {authorCollected.ethUsdPrice}
                              />
                          ))
                        }
                        <EmptyCard />
                        <EmptyCard />
                        <EmptyCard />
                        <EmptyCard />
                        <EmptyCard />
                      </>
                      :
                      <NoDataDiv>{!isLoading ? 'No NFTs found' : 'Loading...'}</NoDataDiv>
                    }
                    <div className="spacer-single"></div>
                    <div className="text-center">
                      <Pagination showQuickJumper defaultCurrent={page_collected} current={page_collected} total={authorCollected? authorCollected.meta.total:1} defaultPageSize={20} onChange = {handleCollectedPageChange} />
                    </div> 
                  </div>
                </div>
                <div className={tab !== 'activity' ? 'hide' : ''}>
                  <div className="row">
                    <Table columns={columns} style={{ overflowY: 'auto' }} dataSource={authorBid? authorBid.data:[]} onChange={handleTableSort} pagination={false}/>
                  </div>
                  <div className="spacer-single"></div>
                    <div className="text-center">
                      <Pagination showQuickJumper defaultCurrent={page_history} current={page_history} total={authorBid? authorBid.meta.total:1} defaultPageSize={25} onChange = {handleHistoryPageChange} />
                    </div> 
                </div>
                <div className={tab !== 'buyers' ? 'hide' : ''}>
                  <div className="row">
                    <Table columns={columnsSell} style={{ overflowY: 'auto' }} dataSource={proAuthorSell} onChange={handleTableSort} />
                    {/* {authorSell && console.log(authorSell,'buatiohr bid')} */}
                  </div>
                </div>
                <div className={tab !== 'followers' ? 'hide' : ''}>
                  <div className="row">
                    <Table columns={columnsFollowers} style={{ overflowY: 'auto' }} dataSource={followersList} onChange={handleTableSort} locale={{emptyText:<span className="NorTxt">No followers yet</span>}} />
                  </div>
                </div>
                <div className={tab !== 'followings' ? 'hide' : ''}>
                  <div className="row">
                    <Table columns={columnsFollowings} style={{ overflowY: 'auto' }} dataSource={followingList} onChange={handleTableSort} locale={{emptyText:<span className="NorTxt">Not following any user yet</span>}} />
                  </div>
                </div>
              </TabContent>
            </div>
          </div>
        </section>
      </div>
      <div className="modal fade" id="transferItem" tabIndex="-1" aria-labelledby="transferItem" aria-hidden="true">
          <div className="modal-dialog">
              <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                  <div className="modal-header">
                      <h6 className="modal-title mt-3 mb-3" id="listingLabel">Transfer your NFTs to a wallet or multiple wallets</h6>
                      <input type="button" id="modalClose" ref={closeModalClick} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }}/>
                  </div>
                  <div className="modal-body">
                    <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                      <PTag>Input wallet address to transfer</PTag>
                      {
                        pinkNum > 0 && 
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'#f70dff', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressPink} value = {transferAddrPink} />
                        </div>
                      }
                      {
                        greenNum > 0 &&
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'#5cff00', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressGreen} value = {transferAddrGreen} />
                        </div>
                      }
                      {
                        blueNum > 0 &&
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'#0000ff', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressBlue} value = {transferAddrBlue} />
                        </div>
                      }
                      {
                        orangeNum > 0 &&
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'orange', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressOrange} value = {transferAddrOrange} />
                        </div>
                      }
                      {
                        aquaNum > 0 &&
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'aqua', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressAqua} value = {transferAddrAqua} />
                        </div>
                      }
                      {
                        dredNum > 0 &&
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'darkred', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressDred} value = {transferAddrDred} />
                        </div>
                      }
                      {
                        oliveNum > 0 &&
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'olive', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressOlive} value = {transferAddrOlive} />
                        </div>
                      }
                      {
                        dgrayNum > 0 &&
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'darkgray', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressDgray} value = {transferAddrDgray} />
                        </div>
                      }
                      {
                        dgreenNum > 0 &&
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'darkgreen', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressDgreen} value = {transferAddrDgreen} />
                        </div>
                      }
                      {
                        mpurpleNum > 0 &&
                        <div style={{ padding: '10px 0px 0px 0px', display:'flex', justifyContent:'flex-start'}}>
                          <span style={{width:'30px', height: '30px', backgroundColor:'mediumpurple', margin:'auto', borderRadius:'20%'}}></span>
                          <StyledInput placeholder="0x.." onChange={handleTransferAddressMpurple} value = {transferAddrMpurple} />
                        </div>
                      }
                      {
                        !isValidTransferAddr ?
                          emptyWallet?
                            <PTag className="warning-invalid-wallet-address">Input wallet address</PTag>
                            :<PTag className="warning-invalid-wallet-address">Invalid wallet address!</PTag>
                          : sameAddress?
                            <PTag className="warning-invalid-wallet-address">It's not allowed to send to your wallet</PTag>
                            :<></>
                      }
                    </Spin>
                    <ModalBottomDiv>
                      <ModalCancelBtn data-bs-dismiss="modal">Cancel</ModalCancelBtn>
                      {
                        (!isApproveProgress && isApprovedForMultiSend) && <ModalBtn onClick={handleTransfer} disabled = {(isValidTransferAddr && !sameAddress) ? false:true}>Transfer</ModalBtn>
                      }
                      {
                        (!isApproveProgress && !isApprovedForMultiSend) && <ModalBtn onClick={handleApprove} disabled = {(isValidTransferAddr && !sameAddress) ? false:true}>Approve</ModalBtn>
                      }
                      {
                        isApproveProgress && <ModalBtn onClick={handleApprove} disabled = {true}>Loading...</ModalBtn>
                      }
                    </ModalBottomDiv>
                  </div>
              </div>
          </div>
      </div>
      <div className="modal fade" id="unhideItem" tabIndex="-1" aria-labelledby="unhideItem" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                <div className="modal-header">
                    <h6 className="modal-title mt-3 mb-3" id="listingLabel">Set visible items</h6>
                    <input type="button" id="modalClose" ref={closeUnhideModalClick} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }}/>
                </div>
                <div className="modal-body">
                  <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                  <PTag className="NorTxt" style={{marginTop:'10px' ,marginLeft:'10px', marginBottom: '0px', fontWeight:'bold'}}>Are you sure to unhide selected item(s) ?</PTag>
                  </Spin>
                  <ModalBottomDiv>
                    <ModalBtn onClick={handleUnhide} disabled = {loadingState}>Confirm</ModalBtn>
                    <ModalCancelBtn data-bs-dismiss="modal">Cancel</ModalCancelBtn>
                  </ModalBottomDiv>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default AuthorPage;
