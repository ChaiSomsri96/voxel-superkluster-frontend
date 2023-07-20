import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "@reach/router";
import styled, { createGlobalStyle} from "styled-components";
import { Tooltip, Select, Button, Input, DatePicker, Affix, Collapse, Spin, Statistic } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FiInfo, FiClock, FiChevronLeft, FiChevronDown, FiCheckCircle } from 'react-icons/fi';
import {FaDollarSign} from "react-icons/fa";
import { Axios } from "../core/axios";
import { getListAction, signMessage } from '../core/nft/interact';
import Switch from "react-switch";
import { ethers } from 'ethers';
import { useWeb3React } from "@web3-react/core";
import { currencyName, currencyLogo } from '../store/utils';

import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

import defaultNFT from "./../assets/image/default_nft.jpg";
import ethIcon from "./../assets/icons/ethIcon.png";

const GlobalStyles = createGlobalStyle`
`;

const CardDiv = styled.div`
    width: 100%;
    height: auto;
    border: 1px solid #e5e8eb;
    padding: 15px 0px;
    cursor: pointer;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &.active {
        background: #f3a3f540;
        border: 1px solid #f3a3f540; 
    }

    &:hover {
        color: rgba(0, 0, 0, 0.85);
        box-shadow: 0 0 12px rgba(205, 205, 205, 0.7);
        border: 1px solid #d9d9d9;
    }

    &:first-child {
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    &:last-child {
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }
`;

const StyledSelect = styled(Select)`
    &.ant-select {
        margin: 0px!important;
        width: 100%!important;

        img {
            filter: opacity(0.4) drop-shadow(0 0 0 white);
        }
    }
`;

const StyledInput = styled(Input)`
    &.ant-input {
        padding: 6px!important;
    }
`;

const StyledImg = styled.img`
    width: 100%;
    height: 285px;
`;

const PreContainer = styled.div`
    margin: 0px 30px;
    text-align: left;

    @media (max-width: 768px) {
        margin: 30px 0px 0px;
    }
`;

const PreviewDiv = styled.div`
    margin: 0px auto;
    width: 300px;

    @media (max-width: 380px) {
        width: 100%;
    }
`;

const StyledButton = styled(Button)`
    color: white;
    background: #f70dff;
    border-color: #f70dff;
    border-radius: 5px;
    font-weight: bold;

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
`;

const ContentDiv = styled.div`
    margin: 0px 0px 0px 0px;
    cursor: pointer;
    display: flex;
    align-items: center;
`;

const TopBar = styled.div`
  background: #fee5ff;
`;

const TopSubDiv = styled.div`
  padding: 10px;
`;

const ModalTopBar = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 5px;
`;

const ModalTopBarLeft = styled.div`
    width: 70%;
    display: flex;
    justify-content: left;
    align-items: center;
    line-height: 1.2;
`;

const ModalTopBarRight = styled.div`
    width: 30%;
    display: flex;
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
    margin: 0px;
    font-size: 14px;
`;

const StyledTokenImg = styled.img`
    width: 16px;
    height: 16px;
    margin: -5px 5px 0px;
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

const usd_price_set_usd=(num)=> {
  let str = '' ;
  if(num > 1000) str = parseFloat(parseInt(num / 100)/10) + 'K' ;
  if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
  if(num < 1000) str = num.toFixed(2) ;
  return str;
}

const ListItemPage = ({ nftId ,colormodesettle }) => {
    const { library } = useWeb3React();
    const { Option } = Select;
    const { Panel } = Collapse;
    const { RangePicker } = DatePicker;
    const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;
    const dateFormat_auction = 'YYYY-MM-DD HH:mm';

    const date = new Date();
    var d = new Date(date),
            year = d.getFullYear(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            tday = d.getDate() + 1,
            to_date = '' + tday;
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
        if (to_date.length < 2)
            to_date = '0' + to_date;

    const today = [year, month, day].join('-');

    const navigate = useNavigate();
    const ref = useRef(null);

    const account = localStorage.getItem('account');
    const [ethPrice, setEthPrice] = useState(1);
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` }
    const [isTopBarOffset, setTopBarOffset] = useState(75);
    const [isItemDetailData, setItemDetailData] = useState(null);
    const [isType, setType] = useState("fixed");
    const [isAmountUSD, setAmountUSD] = useState('');
    const [isAmountUSDDisplay, setAmountUSDDisplay] = useState('');
    const [isAmountVXL, setAmountVXL] = useState('');
    const [isClickList, setClickList] = useState(true);
    const [isTokenETH, setTokenETH] = useState("VXL");
    const [isFromDate, setFromDate] = useState(()=>{
        let date1 = new Date() ;
        return date1.setDate(new Date().getDate()) ;
    });
    const [isToDate, setToDate] = useState(()=>{
        let date1 = new Date() ;
        return date1.setDate(new Date().getDate()+90) ;
    });
    const [isStartDate, setStartDate] = useState(moment(today, dateFormat_auction));
    const [isEndDate, setEndDate] = useState(()=>{
        let date1 = new Date() ;
        return date1.setDate(new Date().getDate()+7) ;
    });
    const [isMethod, setMethod] = useState(1);
    const [isVerifyIconColorA, setVerifyIconColorA] = useState("grey");
    const [isVerifyBState, setVerifyBState] = useState(false);
    const [isVerifyIconColorB, setVerifyIconColorB] = useState("grey");
    const [isVerifyCState, setVerifyCState] = useState(false);
    const [isVerifyIconColorC, setVerifyIconColorC] = useState("grey");
    const [listingQuantity, setListingQuantity] = useState(1);
    const [is_721, setIs721] = useState(true);

    const [isReserve, setReserve] = useState(false);
    const [reserveAddr, setReserveAddr] = useState('');
    const [isValidReserveAddr, setValidReserveAddr] = useState(false);

    useEffect(() => {
        const itemDetailData = localStorage.getItem('itemData');
        if (itemDetailData) {
            setItemDetailData(JSON.parse(itemDetailData)) ;
        }
    }, [nftId])

    useEffect(() => {
        setEthPrice('1170');
    },[])

    useEffect(() => {
        if(!isItemDetailData) {
            setIs721(true);
        } else {
            if(isItemDetailData.is_voxel && isItemDetailData.is_721 || !isItemDetailData.is_voxel && isItemDetailData.collection.is_721) {
                setIs721(true);
            } else {
                setIs721(false);
            }
        }

    }, [isItemDetailData])

    useEffect(() => {
        if (window.innerWidth > 1199) {
          setTopBarOffset(85)
        } else if (window.innerWidth <= 1199 && window.innerWidth > 768) {
          setTopBarOffset(75)
        } else if (window.innerWidth <= 768 && window.innerWidth > 400) {
          setTopBarOffset(70)
        } else {
          setTopBarOffset(60)
        }
    }, [])

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
                timer: 5000,
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
              timer: 5000,
              customClass: 'swal-height'
          })
        }
        setTimeout(() => sendAddItemTxHash(txHash, ++times), 1000);
      }

      const listAction = async (chainType) => {
        setClickList(false) ;
        let signMsgData;
        
        if (isType === "fixed") {
            signMsgData = {
                type: isType,
                price: parseFloat(isAmountUSD).toFixed(2),
                toDate: isToDate,
                tokenId: isItemDetailData.token_id,
                collection: isItemDetailData.collection.name,
                quantity: listingQuantity,
            }
        }
        if (isType === "auction") {
            signMsgData = {
                type: isType,
                price: parseFloat(isAmountUSD).toFixed(2),
                auction_start_date: isStartDate,
                auction_end_date: isEndDate,
                tokenId: isItemDetailData.token_id,
                method: isMethod,
                quantity: listingQuantity,
            }
        }

        const rowData = {
            id: isItemDetailData.id
        }

        const params = [
            header,
            account,
            chainType
        ];

        setVerifyBState(true)

        await getListAction(params, signMsgData, rowData ,isItemDetailData, library)
        .then(async (res) => {
            setVerifyIconColorB("#1fb30d");
            setVerifyBState(false);
            setVerifyCState(true);
            getSignMessage(signMsgData) ;
            localStorage.setItem(isItemDetailData.collection.name , true) ;
        })
        .catch((err) => {
            ref.current.click();
            
            setClickList(true) ;
            if(err.code != 4001) {
                Swal.fire({
                    title: 'Oops...',
                    text: 'Transaction Failed',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    timer: 5000,
                    customClass: 'swal-height'
                })
            }
        });
    }

    const getSignMessage = async (data) => {
        await signMessage(data, library)
                            .then((res) => {
                                setVerifyCState(false);
                                setVerifyIconColorC("#1fb30d");
                                if (isType === "fixed") {
                                    handlePost(res);
                                }
                                if (isType === "auction") {
                                    auctionPostData(res)
                                }
                                setClickList(true) ;
                            })
                            .catch((err) => {
                                ref.current.click();
                                setVerifyCState(false);
                                setClickList(true);
                                if(err.code != 4001) {
                                    Swal.fire({
                                        title: 'Oops...',
                                        text: 'Transaction Failed',
                                        icon: 'error',
                                        confirmButtonText: 'Close',
                                        timer: 5000,
                                        customClass: 'swal-height'
                                    })
                                }
                                
                            })
    }

    const handlePost = async (param) => {
        const deadline = Math.round(new Date(isToDate).getTime() / 1000);
        if (isItemDetailData.is_721) {
            const postData = {
                id: isItemDetailData.id,
                price: parseFloat(isAmountUSD).toFixed(2),
                sale_end_date: deadline,
                signature: param,
                reserveAddress: (isReserve && isValidReserveAddr) ? reserveAddr : null
            }

            const res = await Axios.post("/api/assets/list", postData, { headers: header });
            if (res && res.status == 200) {
                ref.current.click();    
                Swal.fire({
                title: 'It worked!',
                text: 'Your NFT is successfully listed for sale. Good luck!',
                icon: 'success',
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
                })
                localStorage.removeItem('itemData');
                moveToItemDetailPage(isItemDetailData.id);
            } else {
                ref.current.click();
                
                Swal.fire({
                title: 'Oops...',
                text: 'Something went wrong!',
                icon: 'error',
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
                })
            }
        } else {
            const postData = {
                id: localStorage.getItem('ownerId'),
                price: parseFloat(isAmountUSD).toFixed(2),
                sale_end_date: deadline,
                signature: param,
                quantity: listingQuantity,
                reserveAddress: (isReserve && isValidReserveAddr) ? reserveAddr : null
            }
            try {
                const res = await Axios.post("/api/supply-assets/list", postData, { headers: header });
                if (res && res.status == 200) {
                    ref.current.click();    
                    Swal.fire({
                        title: 'It worked!',
                        text: 'Your NFT is successfully listed for sale. Good luck!',
                        icon: 'success',
                        confirmButtonText: 'Close',
                        timer: 5000,
                        customClass: 'swal-height'
                    })
                    localStorage.removeItem('itemData');
                    moveToItemDetailPage(isItemDetailData.id);
                } else {
                }
            } catch (err) {
                ref.current.click();
                Swal.fire({
                    title: 'Oops...',
                    text: err.response.data.msg,
                    icon: 'error',
                    confirmButtonText: 'Close',
                    timer: 5000,
                    customClass: 'swal-height'
                })
            }

        }
    }

    const auctionPostData = async (signMsg) => {

        const auction_sDate = Math.round(new Date(isStartDate).getTime() / 1000);
        const auction_eDate = Math.round(new Date(isEndDate).getTime() / 1000);

        const postData = {
            id: isItemDetailData.id,
            start_price: parseFloat(isAmountUSD).toFixed(2),
            auction_start_date: auction_sDate,
            auction_end_date: auction_eDate,
            method: isMethod,
            signature: signMsg
        }

        await Axios.post(`/api/assets/auction`, postData, { headers: header })
                    .then((res) => {
                        ref.current.click();
                        
                        Swal.fire({
                            title: 'It worked!',
                            text: 'Your item has been successfully listed for auction.',
                            icon: 'success',
                            confirmButtonText: 'Close',
                            timer: 5000,
                            customClass: 'swal-height'
                        })
                        localStorage.removeItem('itemData');
                        moveToItemDetailPage(isItemDetailData.id);
                    })
                    .catch((err) => {
                        ref.current.click();
                        // notification['error']({
                        //     message: 'Something went wrong!',
                        //     description:
                        //       `${ err }`,
                        // });
                        Swal.fire({
                            title: 'Oops...',
                            text: 'Something went wrong!',
                            icon: err.response.data.msg,
                            confirmButtonText: 'Close',
                            timer: 5000,
                            customClass: 'swal-height'
                        })
                    });
    }

    const onAuctionDateChange = (dates, dateStrings) => {
        // console.log(dateStrings,'dateStrings');
        setStartDate(dateStrings[0]);
        setEndDate(dateStrings[1]);
    }

    const handleSelectChange = (value) => {
        setMethod(value);
        if (value == 1) {
            setTokenETH("VXL");
        }
        if (value == 2) {
            setTokenETH("ETH");
        }
    }

    const onDateChange = (dates, dateStrings) => {
        setFromDate(dateStrings[0]) ;
        setToDate(dateStrings[1]) ;
        // console.log(dateStrings[0] , dateStrings[1]) ;
    }

    const moveToItemDetailPage = (param) => {
        navigate(`/ItemDetail/${param}`)
    }

    const callback = (key) => {
        console.log(key);
    }

    function disabledDate(current) {
        return current && current.valueOf() < Date.now() - 300000;
    }

    const setQuantity = (e) => {
        let val = e.target.value;
        if(val == '' || isNaN(val)) {
            setListingQuantity('');
            return ;
        }
        if (val > Number(localStorage.getItem('ownedSupplyNum'))) {
            return;
        }
        if (val == 0) {
            setListingQuantity(1);
        } else {
            setListingQuantity(val);
        }
    }
    
    const iconBtnStyle = {
        cursor: "pointer", 
        fontSize: 18, 
        margin: '0px 3px 3px'
    }

    const labelStyle = {
        margin: '15px 0px 5px 0px',
        fontWeight: 'bold',
    }

    const displayStyle1 = {
        display: 'flex',
        justifyContent: 'space-between',
    }

    const displayStyle2 = {
        display: 'flex',
        justifyContent: 'center',
    }

    const verifyIconStyle = {
        margin: '-3px 5px 0px', 
        fontSize: 22
    }

    const verifyIconColorA = {
        color: isVerifyIconColorA,
    }

    const verifyIconColorB = {
        color: isVerifyIconColorB,
    }

    const verifyIconColorC = {
        color: isVerifyIconColorC,
    }
    const iconStyle = {
        fontSize: 18,
        padding: '5px 10px 5px 0px'
    }

    const handleReserve = () => {
        setReserve(!isReserve);
    }

    const handleReserveAddr = (newAddr) => {
        if(account.toLowerCase() == newAddr.toLowerCase()) {
            return;
        }
        setReserveAddr(newAddr);
    }

    useEffect(() => {
        setValidReserveAddr(ethers.utils.isAddress(reserveAddr));
    }, [reserveAddr]) 

    const typeTooltipText = <div className="p-3 text-center" style={{ maxWidth: 400 }}><span>Learn more about the two types of listing options in our <a href="#" target="_blank">Help Center</a></span></div>;
    const priceTooltipText = <div className="p-3 text-center" style={{ maxWidth: 400 }}><span>List price and listing schedule cannot be edited once the item is listed. You will need to cancel your listing and relist the item with the updated price and dates.</span></div>;
    const auctionTooltipText = <div className="p-3 text-center" style={{ maxWidth: 400 }}><span>Sell to the highest bidder or sell with a declining price, which allows the listing to reduce in price until a buyer is found <br /><a href="#" target="_blank">Learn more</a></span></div>;
    const feeTooltipText = <div className="p-3 text-center" style={{ maxWidth: 400 }}><span>Listing is free. Once sold, the following fees will be deducted. <a href="#" target="_blank">Learn more</a></span></div>;
    
    const auction_infoText = <div className=" text-center" style={{ maxWidth: '467px' , padding:'8px' }}> <span>Seller has 7 days to execute sell transaction (seller will be liable for gas fee), if they do not fulfill their responsibility, they will receive a negative badge rating against your name. <br/><br/>Buyer will have the option to execute the buy item 48 hours before the auction item expires if they so desire (buyer will be liable for gas fee).</span> </div>
    const StepA = <CollapsePanelHeader><FiCheckCircle style={{ ...verifyIconStyle, ...verifyIconColorA }} />Initialize your wallet</CollapsePanelHeader>
    const StepB = <CollapsePanelHeader>
            <FiCheckCircle style={{ ...verifyIconStyle, ...verifyIconColorB }} />
            Approve this item for sale
        </CollapsePanelHeader>
    ;
    const StepC = <CollapsePanelHeader>
            <FiCheckCircle style={{ ...verifyIconStyle, ...verifyIconColorC }} />
            Confirm <span style={{ color: '#f70dff' }}>{isAmountUSD ? (isAmountUSD/isItemDetailData.usdPrice).toFixed(0) : "0" }  {" " + currencyName(isItemDetailData? isItemDetailData.chain_id : null)}</span> listing
        </CollapsePanelHeader>
    ;

    const StepAText = `To get set up for selling on SuperKluster for the first time, you must initialize your wallet, which requires a one-time gas fee.`;
    const StepBText = `To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.`;
    const StepCText = <span>Accept the <span style={{ color: '#f70dff' }}>signature request</span> in your wallet and wait for your listing to process.</span>;

    const setFixedPriceUSD=(val)=>{
        if(parseFloat(val) / isItemDetailData.usdPrice > 1000000.0) {
            return;
        }
        // console.log(val) ;
        if(val == '' || isNaN(val)) {
            setAmountUSD('') ;
            setAmountVXL('') ;
            setAmountUSDDisplay('');
            return ;
        }
        setAmountUSD(val) ;
        setAmountUSDDisplay(val) ;
        setAmountVXL((parseFloat(val) / isItemDetailData.usdPrice).toFixed(0)) ;
        // console.log(typeof(val)) ;
    }
    const setFixedPriceVXL=(val)=>{
        if(parseFloat(val) > 1000000.0) {
            return;
        }
        if(val == '' || isNaN(val)) {
            setAmountUSD('') ;
            setAmountVXL('') ;
            setAmountUSDDisplay('');
            return ;
        }
        setAmountUSD((val  * isItemDetailData.usdPrice).toString()) ;
        setAmountUSDDisplay((val  * isItemDetailData.usdPrice).toFixed(2)) ;
        setAmountVXL(val) ;
        // console.log(typeof(val  * isItemDetailData.usdPrice)) ;
    }

    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
    
      },[])

    return (
        <>
            <div>
                {
                    isItemDetailData &&
                    <>
                        <GlobalStyles />
                        <Affix offsetTop={isTopBarOffset} onChange={(affixed) => console.log(affixed)} style={{ textAlign: 'left', zIndex: 99 }} className='custom-container'>
                            <TopBar>
                                <TopSubDiv>
                                    <ContentDiv onClick={() => moveToItemDetailPage(isItemDetailData.id)}>
                                        <FiChevronLeft />
                                        <StyledTopBarImg src={isItemDetailData && (isItemDetailData.image_preview ? isItemDetailData.image_preview : isItemDetailData.image)} alt="image" />
                                        <div style={{maxWidth:'75%'}}>
                                            <PTag style={{maxWidth:'100%', overflow:'hidden', textOverflow:'ellipsis'}}>{isItemDetailData.collection && isItemDetailData.collection.name ? isItemDetailData.collection.name : "Unnamed"}</PTag>
                                            <PTag style={{ color: '#222', fontWeight: 'bold', maxWidth:'100%', overflow:'hidden', textOverflow:'ellipsis'}}>{isItemDetailData.name ? isItemDetailData.name : "Unnamed"}</PTag>
                                        </div>
                                    </ContentDiv>
                                </TopSubDiv>
                            </TopBar>
                        </Affix>
                        <section className="custom-container">
                            <div className="row mt-3">
                        
                                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12'>
                                    <h3>List item for sale</h3>
                                    <div style={{ width: '100%', margin: '30px 0px 0px'}}>
                                        <div style={{ ...labelStyle, ...displayStyle1 }}>
                                            <span>Type</span>
                                            {/* <span>
                                                <Tooltip placement="top" title={typeTooltipText}>
                                                    <FiInfo style={iconBtnStyle} />
                                                </Tooltip>
                                            </span> */}
                                        </div>
                                        <div style={ displayStyle2 }>
                                            <CardDiv className={ isType === "fixed" ? "active card-border" : "card-border" } onClick={() => setType("fixed")} >
                                                <h3>$</h3>
                                                <span className='NorTxt'>Fixed Price</span>
                                            </CardDiv>
                                            {
                                                is_721 ? 
                                                <CardDiv className={ isType === "auction" ? "active card-border" : "card-border" } onClick={() => setType("auction")}>
                                                    <h3><FiClock /></h3>
                                                    <span className='NorTxt'>Timed Auction</span>
                                                </CardDiv>
                                                : <></>
                                            }
                                            
                                        </div>
                                    </div>
                                    {!isItemDetailData.is_721 &&
                                    <div className={ isType === "auction" ? "hide" : "" } >
                                        <div style={{ width: '100%', margin: '30px 0px 0px'}}>
                                            <div style={{ ...labelStyle, ...displayStyle1 }}>
                                                <span>Quantity</span>
                                            </div>
                                            <div style={{ ...displayStyle2, alignItems: 'center' }}>
                                                <div style={{ width: '100%', margin: '0px 0px 0px 5px' }}>
                                                    For quantities listed greater than 1, buyers will need to purchase the entire quantity. Users are not able to purchase partial amounts on Ethereum
                                                    <StyledInput placeholder="Amount" onChange={setQuantity} value={listingQuantity} />
                                                <div className='w-100' style={{textAlign: 'right'}}>
                                                    <span>{localStorage.getItem('ownedSupplyNum')} available</span>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                    <div className={ isType === "auction" ? "hide" : "" } >
                                        <div style={{ ...labelStyle, ...displayStyle1 }}>
                                            <span>Price</span>
                                            {/* <span>
                                                <Tooltip placement="top" title={priceTooltipText}>
                                                    <FiInfo style={iconBtnStyle} />
                                                </Tooltip>
                                            </span> */}
                                        </div>
                                        <div style={{ ...displayStyle2, alignItems: 'center' }}>
                                            <div style={{ width: '45%', margin: '0px 0px 0px 0px' }}>
                                                <FaDollarSign className='dollarSign'/> USD
                                                <StyledInput placeholder="Amount" onChange={(e) => setFixedPriceUSD(e.target.value)} value={isAmountUSDDisplay ?? ""}  />
                                            </div>
                                            <div style={{ width: '55%', margin: '0px 0px 0px 5px' }}>
                                                <StyledTokenImg src={currencyLogo(isItemDetailData? isItemDetailData.chain_id : null)} />{currencyName(isItemDetailData? isItemDetailData.chain_id : null)}
                                                &nbsp;(<img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethIcon} /><span style={{fontWeight:'bold'}}>{(!isAmountUSD || isAmountUSD == '') ? '0':(parseFloat(isAmountUSD) / parseFloat(ethPrice)).toFixed(2)}</span>)
                                                <StyledInput placeholder="Amount" onChange={(e) => setFixedPriceVXL(e.target.value)} value={isAmountVXL ?? ""} />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ ...labelStyle }}>
                                                <span>Duration</span>
                                            </div>
                                            <div className='date-picker-div'>
                                                <RangePicker 
                                                    onChange={onDateChange} 
                                                    showTime={{
                                                        hideDisabledOptions: true,
                                                        defaultValue: [moment(today, dateFormat_auction), moment(dateFormat_auction).subtract(1,'days')],
                                                    }}
                                                    format="YYYY-MM-DD HH:mm"
                                                    disabled={[true, false]}
                                                    size = {window.innerWidth < 420 ? 5 : 'large'}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={ isType === "fixed" ? "hide" : "" } >
                                        <div>
                                            <div style={{ ...labelStyle, ...displayStyle1 }}>
                                                <span>Method</span>
                                                <span>
                                                    {/* <Tooltip placement="top" title={auctionTooltipText}>
                                                        <FiInfo style={iconBtnStyle} />
                                                    </Tooltip> */}
                                                </span>
                                            </div>
                                            <div style={{ alignItems: 'center' }}>
                                                <StyledSelect defaultValue="1" onChange={handleSelectChange}>
                                                    <Option value='1'>Sell to highest bidder</Option>
                                                    {/* <Option value='2'>Sell with declining price</Option> */}
                                                </StyledSelect>
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ ...labelStyle }}>
                                                <span>Starting price</span>
                                            </div>
                                            <div style={{ ...displayStyle2, alignItems: 'center' }}>
                                                <div style={{ width: '45%', margin: '0px 0px 0px 0px' }}>
                                                    <FaDollarSign className='dollarSign'/> USD
                                                    <StyledInput placeholder="Amount" onChange={(e) => setFixedPriceUSD(e.target.value)} value={isAmountUSDDisplay ?? ""}  />
                                                </div>
                                                <div style={{ width: '55%', margin: '0px 0px 0px 5px' }}>
                                                    <StyledTokenImg src={currencyLogo(isItemDetailData? isItemDetailData.chain_id : null)} />{currencyName(isItemDetailData? isItemDetailData.chain_id : null)}
                                                    &nbsp;(<img style={{ width: 16, height: 16, marginBottom: 5 }} src={ethIcon} /><span style={{fontWeight:'bold'}}>{(!isAmountUSD || isAmountUSD == '') ? '0':(parseFloat(isAmountUSD) / parseFloat(ethPrice)).toFixed(2)}</span>)
                                                    <StyledInput placeholder="Amount" onChange={(e) => setFixedPriceVXL(e.target.value)} value={isAmountVXL ?? ""} />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{display:'block'}}>
                                            <div style={{ ...labelStyle }}>
                                                <span>Duration</span>
                                            </div>
                                            <div className='date-picker-div'>
                                                {/* <RangePicker onChange={onDateChange} size="large" defaultValue={[moment(today, dateFormat), moment(tomorrow, dateFormat)]} disabled={[false, false]} /> */}
                                                <RangePicker
                                                    size = {window.innerWidth < 420 ? 5 : 'large'}
                                                    onChange={onAuctionDateChange}
                                                    disabledDate={disabledDate}
                                                    showTime={{
                                                        // hideDisabledOptions: true,
                                                        // format: "YYYY-MM-DD HH:mm"
                                                        // defaultValue: [moment(new Date(), dateFormat_auction)],
                                                    }}
                                                    defaultValue={[moment(new Date() , dateFormat_auction) ]} 
                                                    format="YYYY-MM-DD HH:mm"
                                                    disabled={[false, false]} 
                                                />
                                                {/* <DatePicker
                                                    name="Campaign-date"
                                                    defaultValue={moment(today, "YYYY/MM/DD HH:mm")}
                                                    format={"YYYY/MM/DD HH:mm"}
                                                    showTime={{ format: "HH:mm" }}
                                                    onChange={onAuctionDateChange}
                                                /> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ ...labelStyle, ...displayStyle1, margin: '10px 0px 0px' }}>
                                            <span>Fees</span>
                                            {/* <span>
                                                <Tooltip placement="top" title={feeTooltipText}>
                                                    <FiInfo style={iconBtnStyle} />
                                                </Tooltip>
                                            </span> */}
                                        </div>
                                        <div style={{ fontSize: 14 , ...displayStyle1 }}>
                                            <span>Service Fee</span>
                                            <span>1.5%</span>
                                        </div>
                                    </div>
                                    <div className="spacer-10"></div>
                                    <div className={ isType === "auction" ? "hide" : "" } >
                                        <div className="row align-items-center">
                                            <div className="col-10" style={{ display: 'flex' }}>
                                                <div>
                                                    <h5 style = {{margin : '0'}}>Reserve an item to a specific buyer</h5>
                                                    <span>Item will be available to purchased once listed</span>
                                                </div>
                                            </div>
                                            <div className="col-2" style={{ textAlign: 'right' }}>
                                                <Switch checked={isReserve} onColor="#f70dff" onChange = {handleReserve} />
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (isReserve && isType != 'auction') && 
                                        <>
                                            <div className="spacer-10"></div>
                                            <div style={{ width: '100%'}}>
                                                <div style={{ ...displayStyle2, alignItems: 'center' }}>
                                                    <div style={{ width: '100%'}}>
                                                        <StyledInput placeholder="0x.." value={reserveAddr} onChange = {(e) => handleReserveAddr(e.target.value)} />
                                                    <div className='w-100' style={{textAlign: 'right'}}>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12'>
                                    <PreContainer>
                                        <PreviewDiv>
                                            <h5>Preview</h5>
                                            <div style={{ borderRadius: 10, overflow: 'hidden', width: '100%' }} className="card-border">
                                                <div>
                                                    <div>
                                                        <StyledImg src={isItemDetailData.image_preview ? isItemDetailData.image_preview : (isItemDetailData.image ? isItemDetailData.image : defaultNFT)} />
                                                    </div>
                                                    <div style={{ padding: 15, fontSize: 14, textAlign: 'left', ...displayStyle1 }}>
                                                        <div style = {{maxWidth:'60%', overflow:'hidden', textOverflow:'ellipsis'}}>
                                                            <span>{isItemDetailData.collection && isItemDetailData.collection.name ? isItemDetailData.collection.name : "Unnamed"}</span><br />
                                                            <span className='previewCardTSy' style={{fontWeight: 'bold' }}>{isItemDetailData.name ? isItemDetailData.name : "Unnamed"}</span>
                                                        </div>
                                                        <div style={{ maxWidth: '40%' }}>
                                                            <span>Price</span><br />
                                                            <span className='previewCardTSy' style={{fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                                                <StyledTokenImg src={currencyLogo(isItemDetailData? isItemDetailData.chain_id : null)} />
                                                                {isAmountVXL ? isAmountVXL : "0"}
                                                            </span>
                                                            <div className="usd_color" style={{paddingLeft:10}}>${usd_price_set_usd(parseFloat(isAmountUSDDisplay))} </div >

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </PreviewDiv>
                                    </PreContainer>
                                </div>
                            </div>
                            <div className="spacer-10"></div>
                            <div className='mt-3 mb-3' style ={window.innerWidth < 768 ? {display:'flex', justifyContent:'center'}:{}}>
                                {/* {console.log(isItemDetailData,'isItemDetailData')} */}
                                <StyledButton 
                                    size="large" 
                                    onClick={isItemDetailData.status == "active" ? () => listAction("onChain") : () => listAction("offChain")} 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#listing" 
                                    disabled={listingQuantity != '' && listingQuantity > 0 && isAmountUSD && isAmountUSD >= 0 && (isType != 'fixed' || isType === 'fixed' && isToDate) && (isType != 'auction' || isType === 'auction' && isStartDate && isEndDate) && isClickList && (!isReserve || isReserve && isValidReserveAddr) ? false : true}>
                                        Complete listing
                                </StyledButton>
                                {isType == 'auction' &&
                                <Tooltip placement="top" title={auction_infoText}>
                                    <FiInfo style={iconBtnStyle} />
                                </Tooltip> 
                                }
                                
                            </div>
                        </section>

                        <div className="modal fade" id="listing" tabIndex="-1" aria-labelledby="listingLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                                    <div className="modal-header">
                                        <h4 className="modal-title mt-3 mb-3" id="listingLabel">Complete your listing</h4>
                                        <input type="button" id="modalClose" ref={ref} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                                    </div>
                                    <div className="modal-body">
                                        <ModalTopBar>
                                            <ModalTopBarLeft>
                                                <StyledTopBarImg src={isItemDetailData && (isItemDetailData.image_preview ? isItemDetailData.image_preview :  isItemDetailData.image)} alt="image" />
                                                <ImgInfo style={{maxWidth:'83%'}}>
                                                    <PTag style={{overflow:'hidden', textOverflow:'ellipsis'}}>{isItemDetailData.collection && isItemDetailData.collection.name ? isItemDetailData.collection.name : "Unnamed"}</PTag>
                                                    <PTag className='previewCardTSy' style={{  fontWeight: 'bold', overflow:'hidden', textOverflow:'ellipsis'}}>{isItemDetailData.name ? isItemDetailData.name : "Unnamed"}</PTag>
                                                    <PTag>quantity: { is_721? '1' : listingQuantity }</PTag>
                                                </ImgInfo>
                                            </ModalTopBarLeft>
                                            <ModalTopBarRight>
                                                <div style={{ textAlign: 'right' }}>
                                                    <PTag>Price</PTag>
                                                    <PTag  style={{  fontWeight: 'bold' }}><StyledTokenImg src={currencyLogo(isItemDetailData? isItemDetailData.chain_id : null)} />{isAmountVXL ? isAmountVXL : "0"}</PTag>
                                                    <StyledStatistic value={isAmountUSD} precision={2} prefix={<span style={{ width: 16, height: 16, marginBottom: 5 }}>$</span>} src={currencyLogo(isItemDetailData? isItemDetailData.chain_id : null)} />    
                                                    {/* <PTag>${isAmountVXL * isItemDetailData.usdPrice} USD</PTag> */}
                                                </div>
                                                <div style={{ margin: '0px 10px'}}>
                                                    <FiChevronDown />
                                                </div>
                                            </ModalTopBarRight>
                                        </ModalTopBar>
                                    </div>
                                    <div className="modal-body">
                                        <StyledCollapse defaultActiveKey={['1', '2']} onChange={callback} expandIconPosition="right">
                                            {/* <Panel header={StepA} key="1">
                                                {StepAText}
                                            </Panel> */}
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


                    </>
                }
            </div>
        </>
    )
}

export default ListItemPage;