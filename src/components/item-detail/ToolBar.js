import React, { memo, useState, useEffect, useRef } from 'react';
import { TimeSpan, DetailSection, SubText, MainPrice, MakeOfferBtn, PTag, 
    FaEditIcon, ImPriceTagsIcon, ModalBottomDiv, ModalCancelBtn, ModalBtn, FlexDiv,
    StyledInput, StyledTokenImg, TopBarLabel, Label, ModalTopBarLeft,
    StyledTopBarImg, ImgInfo, ModalTopBarRight, StyledStatistic, ModalTotalBar, RemoveIcon } from "./styled-components";
import { ReactComponent as OfferButtonDarkIcon } from "./../../assets/svg/item_detail/offer_button_icon_dark.svg";
import { ReactComponent as OfferButtonLightIcon } from "./../../assets/svg/item_detail/offer_button_icon_light.svg";
import { ReactComponent as CartDarkIcon } from "./../../assets/svg/item_detail/cart_dark.svg";
import { ReactComponent as CartLightIcon } from "./../../assets/svg/item_detail/cart_light.svg";
import { useNavigate } from "@reach/router";
import { usdPriceItemDetailPage, formatUSDPrice, formatSaleEndDate, checkBeforeOffer } from "./../../utils";
import { Axios } from './../../core/axios';
import Swal from 'sweetalert2' ;
import { Spin, DatePicker, Checkbox } from "antd";
import Switch from "react-switch";
import { LoadingOutlined } from '@ant-design/icons';
import { FaDollarSign } from "react-icons/fa" ;
import { currencyLogo, currencyName } from "./../../store/utils";
import moment from "moment";
import { signMessage, getApprove, isApproved, getBuyAction } from "./../../core/nft/interact";
import { useWeb3React } from "@web3-react/core";

import { useSelector, useDispatch } from "react-redux";
import * as actions from "./../../store/actions/thunks";
import * as selectors from "./../../store/selectors";
import ethIcon from "./../../assets/icons/ethIcon.png";

const ToolBar = ({colormodesettle, itemData, nftId}) => {
    const dispatch = useDispatch();

    let offerData = useSelector(selectors.nftBidHistoryState).data;
    let cartInfo = useSelector(selectors.cartInfoState).data;

    const closeBtnClick = useRef(null);

    const { library } = useWeb3React();
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;

    const dateFormat = 'YYYY-MM-DD HH:mm';

    const today = moment();
    const endDate = moment(itemData.sale_end_date * 1000);

    const account = localStorage.getItem('account') ;
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` } ;

    const antIcon = <LoadingOutlined style={{ fontSize: 20, borderTop:'0px !important' }} spin />;

    const is721 = itemData.is_voxel ? itemData.is_721 : itemData.collection.is_721;

    const isOwner = !account ? false : itemData.owners.some(owner => owner.owner.public_address === account);
    
    const bidModalClose = useRef(null);
    const buyModalClose = useRef(null);

    const [offerQuantity, setOfferQuantity] = useState('');
    const [offerQuantity_show, setOfferQuantity_show] = useState('');
    
    const [isShowBtnState, setShowBtnState] = useState(true);

    const [loadingState, setLoadingState] = useState(false);
    const [isChangePrice, setChangePrice] = useState('');
    const [isChangePriceUsd, setChangePriceUSD] = useState('');
    const [isActiveBtn, setActiveBtn] = useState(false);
    const [isSaleEndDate, setSaleEndDate] = useState('');
    const [isAuctionEndDate, setAuctionEndDate] = useState('');
    const [isSellPeriodState, setSellPeriodState] = useState(false);
    const [isToDate, setToDate] = useState(null);
    const [isBidPrice, setBidPrice] = useState('');
    const [isBidPriceVXL, setBidPriceVXL] = useState('');
    const [isBidActiveBtn, setBidActiveBtn] = useState(false);
    const [isClickBid , setClickBid] = useState(true) ;
    const [expirationDate, setExpirationDate] = useState();

    const [isClickConfirm , setClickConfirm] = useState(false);
    const [isAgreeWithTerms, setAgreeWithTerms] = useState(false);
    const [ethOption, setEthOption] = useState(false);
    const [isAddBtnVisible, setAddBtnVisible] = useState(true);

    const handleEthOption = async () => {
        if(ethOption == true) setEthOption(false);
        else setEthOption(true);
    }

    useEffect(() => {
        if(itemData.on_sale) {
            setSaleEndDate(formatSaleEndDate(itemData.sale_end_date));
            setToDate(itemData.sale_end_date);
        }
        else {
            setSaleEndDate("");
            setToDate(null);
        }
    }, [itemData.sale_end_date, itemData.on_sale]);

    useEffect(() => {
        if(cartInfo && cartInfo.data) {
            setAddBtnVisible(!cartInfo.data.some((item) => parseInt(item.asset.id) === parseInt(nftId)));
        }
        else {
            setAddBtnVisible(true);
        }
    }, [cartInfo]);

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

    useEffect(() => {
        setShowBtnState(localStorage.getItem('approvedToken'+account) == 'true');
        getApproveInfo(account);
    }, [account, library])

    const handlePriceInput = (e) => {
        const value = e.target.value;

        if(!(/^[\d.]+$/.test(value) || value.length === 0))
            return;

        setChangePrice(value);
        
        if(value.length === 0) {
            setChangePriceUSD("");
            setActiveBtn(false);
            return;
        }

        setChangePriceUSD((parseFloat(value) / itemData.usdPrice).toFixed(0));

        if (parseFloat(value) > 0 && parseFloat(value) <= itemData.price) {
          setActiveBtn(true)
        } else {
          setActiveBtn(false)
        }
    }

    const handlePriceInputUSD = (e) => {
        const value = e.target.value;

        if(!(/^[\d.]+$/.test(value) || value.length === 0))
            return;

        setChangePriceUSD(value);

        if(value.length === 0) {
            setChangePrice("");
            setActiveBtn(false);
            return;
        }

        setChangePrice((parseFloat(value) * itemData.usdPrice).toFixed(2));

        if (parseFloat((parseFloat(value) * itemData.usdPrice).toFixed(2)) > 0 && parseFloat((parseFloat(value) * itemData.usdPrice).toFixed(2)) <= itemData.price) {
          setActiveBtn(true)
        } else {
          setActiveBtn(false)
        }
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

    const changeBidPriceUSD = (value) => {
        if(!(/^[\d.]+$/.test(value) || value.length === 0))
            return;

        setBidPrice(value);
        
        if(value.length === 0) {
            setBidPriceVXL("");
            setBidActiveBtn(false);
            return;
        }

        setBidPriceVXL((parseFloat(value) / itemData.usdPrice).toFixed(0));

        setBidActiveBtn(true);
    }

    const changeBidPriceVXL = (value) => {
        if(!(/^[\d.]+$/.test(value) || value.length === 0))
              return;

        setBidPriceVXL(value);

        if(value.length === 0) {
            setBidPrice("");
            setBidActiveBtn(false);
            return;
        }

        setBidPrice((parseFloat(value) * itemData.usdPrice).toFixed(2));

        setBidActiveBtn(true);
    }

    const onChangeExpiration = (value, dateString) => {
        setExpirationDate(value);
    }

    const onOKExpiration = (date) => {
        setExpirationDate(date);
    }

    const handleTermsCheck = (e) => {
        setAgreeWithTerms(e.target.checked);
    }

    const moveToServicePage = () => {
        buyModalClose.current.click();
        // buySupplyModalClose.current.click();
        navigate('/terms-of-service');
    }

    const handleApproveAction = async (buy_price) => {
        try {
            setLoadingState(true);
            const res = await getApprove(account, library, buy_price);
            if(res == true) {
                setLoadingState(false);
                setShowBtnState(true);
                localStorage.setItem('approvedToken' + account, true);
            }
            setLoadingState(false);
        }
        catch(err) {

            console.error("handleApproveAction: ", err);

            setLoadingState(false);
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
        }
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
                setClickConfirm(false) ;
                setLoadingState(false);
                deleteMe() ;
                
                /*
                getItemDetailData();
                getHistoryData();
                getPriceHistoryData();
                getBidHistoryData();
                getMyBalanceData('buy') ; */

                // dispatch(actions.fetchNftHistory({"id": nftId, page: 1}));
                dispatch(actions.fetchNftDetailInfo(accessToken, header, nftId));
                dispatch(actions.fetchCartInfo(accessToken));
                
                buyModalClose.current.click();
              })
              .catch((err) => {
                buyModalClose.current.click();
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
          });
          setEthOption(false);
    }

    const handleBidAction = async () => {
        try {
            setClickBid(false);
            let bidPostData;

            if(!is721) {
                // i will update later
            }

            if(itemData.sale_type == '2') {
                bidPostData = {
                    id: itemData.id,
                    price: isBidPrice
                }
            } else {
                
                if(checkBeforeOffer(offerData ? offerData : [], account, parseFloat(isBidPrice)) == true) {
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
                    expiration_date: Math.floor(expirationDate.valueOf() / 1000) ,
                }
            }

            setLoadingState(true);

            await Axios.post('/api/bid/place-bid', bidPostData, { headers: header });
            setLoadingState(false);
            bidModalClose.current.click();

            dispatch(actions.fetchBidHistory({id: nftId}));
            dispatch(actions.fetchNftHistory({"id": nftId, page: 1}));

            setClickBid(true) ;
            Swal.fire({
                title: 'It worked!',
                text: `Your bid has been placed successfully`,
                icon: 'success',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
            })

            setExpirationDate(null);
            setBidPrice('');
            setBidPriceVXL('');
        }
        catch(err) {
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
        }
    }

    const handleSwitch = () => {
        setSellPeriodState(!isSellPeriodState);
    }
    
    const handleSetNewPrice = async () => {

        try {
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

            const res = await signMessage(itemInfo, library);

            handlePost(res);
        }
        catch(err) {
            setLoadingState(false);

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
        }
    }

    const onDateChange = (dates, dateStrings) => {
        if(dates[1]) {
            setToDate( Math.floor(dates[1].valueOf() / 1000));
        }
        else {
            setToDate(null);
        }
    }

    const disabledDate = (current) => {
        // Disable dates before 2023/06/25
        return current && current < moment();
    };

    const disabledTime = (current, type) => {
        if (current && type === 'time') {
            const selectedDate = current.startOf('day');
            const disabledDateTime = moment().startOf('day');
            return selectedDate.isSame(disabledDateTime) && current < disabledDateTime;
        }
        return false;
    };

    const handlePost = async (param) => {
        try {
            let postData;

            if (isToDate) {
                postData = {
                    id: itemData.id,
                    price: isChangePrice,
                    sale_end_date: isToDate,
                    signature: param
                }
            } else {
                postData = {
                    id: itemData.id,
                    price: isChangePrice,
                    signature: param
                }
            }

            await Axios.post("/api/assets/change-price", postData, { headers: header });
            setLoadingState(false);
            closeBtnClick.current.click();
            Swal.fire({
                title: 'It worked!',
                text: `Change price succeeded.`,
                icon: 'success',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
            });
            
            /*
            getItemDetailData();
            getHistoryData();
            getBidHistoryData();
            */
            //dispatch(actions.fetchNftHistory({"id": nftId, page: 1}));
            
            dispatch(actions.fetchNftDetailInfo(accessToken, header, nftId));
        }
        catch(err) {
            setLoadingState(false);
            closeBtnClick.current.click();
            Swal.fire({
                title: 'Oops...',
                text: err.response.data.msg,
                icon: 'error',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
            });
        }
    }

    const buyNow = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }
    }

    const makeOffer = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }
    }

    const addCart = async () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        try {
            const postData = {
                id: nftId
            };
    
            if(isAddBtnVisible) {
                await Axios.post('/api/cart/add-cart', postData, { headers: header });
            }
            else {
                await Axios.post('/api/cart/remove-cart', postData, { headers: header });
            }
            dispatch(actions.fetchCartInfo(accessToken));
        }
        catch(err) {
            console.error("addCart Err: ", err);
        }
    }

    const editNFT = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        navigate(`/create`, { state: { prop: itemData } });
    }

    const sellNFT = () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        navigate(`/assets/sell/${nftId}`, { state: { itemDetailData: itemData } });
    }

    const handleCancelListing = async () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }
        try {
            const postData = {
                id: nftId
            }

            const res = await Axios.post("/api/assets/cancel-list", postData, { headers: header });

            Swal.fire({
                title: 'It worked!',
                text: `${res.data.msg}`,
                icon: 'success',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
            });
            
            //dispatch(actions.fetchNftHistory({"id": nftId, page: 1}))
            
            dispatch(actions.fetchNftDetailInfo(accessToken, header, nftId));
            /*
            getItemDetailData();
            getHistoryData();
            getBidHistoryData(); */
        }
        catch(err) {
            Swal.fire({
                title: 'Oops...',
                text: err.response.data.msg,
                icon: 'error',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
            });
        }
    }

    return (
        <>
        <DetailSection className="tool-bar">
            {
                itemData.on_sale && itemData.sale_type === 1?
                
                <TimeSpan>
                    Sale ends {formatSaleEndDate(itemData.sale_end_date)}
                </TimeSpan>

                : itemData.on_sale && itemData.sale_type === 2 ?
                <TimeSpan>
                    Auction ends {formatSaleEndDate(itemData.auction_end_date)}
                </TimeSpan>
                :
                null
            }

            {
                itemData.on_sale ?
                <>
                <div className='spacing'></div>
                <SubText>
                    Price
                </SubText>
                <div className='spacing'></div>
                <div className='price'>
                    <MainPrice>
                        {usdPriceItemDetailPage(itemData.price)} USD
                    </MainPrice>

                    <SubText style={{marginLeft: '27px'}}>{formatUSDPrice(parseInt(itemData.price / itemData.usdPrice))} VXL</SubText>
                </div>
                </>
                :
                <div className='not-for-sale'>
                    <img src={currencyLogo(itemData ? itemData.chain_id : null)} alt="currency-logo" width={25}  />
                    <MainPrice>
                        Not for sale
                    </MainPrice>
                </div>
            }

            <div className='spacing'></div>

            {
                is721 && 
                <div className='button-container'>

                    {
                        isOwner && !itemData.on_sale ?
                        <>
                        <button onClick={() => sellNFT()} className='button-style button-width pink-button'>
                            Sell
                        </button> 
                        {
                            itemData.status === 'pending' ?
                            <MakeOfferBtn className='button-style button-width offer-button' onClick={() => editNFT()}>
                                <div className="flex-align-center-row-center">
                                    <FaEditIcon />
                                    <div style={{marginLeft: '15px'}}>Edit</div>
                                </div>
                            </MakeOfferBtn> :
                            <div className='button-width'></div>
                        }
                        </>
                        : isOwner && itemData.on_sale && itemData.sale_type === 1 ?
                        <>
                        <button 
                        className='button-style button-width pink-button' 
                        data-bs-toggle="modal"
                        data-bs-target="#cancelListing"
                        >
                            Cancel listing
                        </button>
                        <MakeOfferBtn 
                        className='button-style button-width offer-button' 
                        data-bs-target="#lowerPriceLower"
                        data-bs-toggle="modal"
                        >
                                <div className="flex-align-center-row-center">
                                    <ImPriceTagsIcon />
                                    <div style={{marginLeft: '15px'}}>Lower price</div>
                                </div>
                        </MakeOfferBtn>
                        </>
                        : isOwner && itemData.on_sale && itemData.sale_type === 2 ?
                        <>
                            <button 
                            className='button-style button-width pink-button' 
                            data-bs-toggle="modal"
                            data-bs-target="#cancelListing"
                            >
                                Cancel listing
                            </button>
                            <div className='button-width'></div>
                        </>
                        :
                        <>
                            {
                                account && accessToken ?

                                <button  
                                    className='button-style button-width pink-button' 
                                    disabled={itemData.on_sale && itemData.sale_type === 1 ? false : true}
                                    data-bs-toggle="modal"
                                    data-bs-target="#buyModal"

                                >
                                    Buy Now
                                </button>
                                :
                                <button 
                                    onClick={() => buyNow()} 
                                    className='button-style button-width pink-button' 
                                    disabled={itemData.on_sale && itemData.sale_type === 1 ? false : true}
                                >
                                    Buy Now
                                </button>
                            }
                        
                            {
                                account && accessToken ?
                                <MakeOfferBtn 
                                    className={`button-style button-width offer-button ${itemData.on_sale && itemData.sale_type === 1 ? 'button-make-offer-width' : ''}`}
                                    data-bs-toggle="modal" 
                                    data-bs-target="#placeBid"
                                >
                                    <div className="flex-align-center-row-center">
                                        {
                                        colormodesettle.ColorMode ?
                                        <OfferButtonLightIcon />
                                        :
                                        <OfferButtonDarkIcon />
                                        }
                                        <div style={{marginLeft: '15px'}}>Make Offer</div>
                                    </div>
                                </MakeOfferBtn>
                                :
                                <MakeOfferBtn 
                                    className={`button-style button-width offer-button ${itemData.on_sale && itemData.sale_type === 1 ? 'button-make-offer-width' : ''}`}  
                                    onClick={() => makeOffer()} 
                                >
                                    <div className="flex-align-center-row-center">
                                        {
                                        colormodesettle.ColorMode ?
                                        <OfferButtonLightIcon />
                                        :
                                        <OfferButtonDarkIcon />
                                        }
                                        <div style={{marginLeft: '15px'}}>Make Offer</div>
                                    </div>
                                </MakeOfferBtn>
                            }
                        
                        
                        {
                            itemData.on_sale && itemData.sale_type === 1 ?
                            <MakeOfferBtn className='button-style add-cart-button' onClick={() => addCart()}>
                                {
                                    isAddBtnVisible ?
                                    (
                                        colormodesettle.ColorMode ?
                                        <CartLightIcon />
                                        :
                                        <CartDarkIcon />
                                    )
                                    :
                                    <RemoveIcon />
                                }
                            </MakeOfferBtn>
                            :
                            null   
                        }
                        </>
                    }
                </div>
            }
            
        </DetailSection>

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
                          <PTag style={{ fontWeight: 'bold' }}>Use previous listing expiration date</PTag>
                          {itemData.sale_type == 1 && <PTag>{isSaleEndDate ? isSaleEndDate : "undefined"}</PTag>}
                          {itemData.sale_type == 2 && <PTag>{isAuctionEndDate ? isAuctionEndDate : "undefined"}</PTag>}
                        </div>
                        <div>
                          <Switch 
                            checked={isSellPeriodState}
                            onChange={handleSwitch} 
                            uncheckedIcon={false}
                            checkedIcon={false}
                            handleDiameter={26}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={26}
                            width={50}
                            onColor="#f70dff"
                            offColor={colormodesettle.ColorMode ? "#ECEBEB" : "#4B4C4D"}
                          />
                        </div>
                      </FlexDiv>
                      {
                        isSellPeriodState &&
                          <div style={{ padding: '10px 0px' }} className='date-picker-div'>
                            {   
                                itemData.sale_type == 1 && 
                                <RangePicker 
                                    onChange={onDateChange} 
                                    size="large"
                                    showTime={{ format: 'HH:mm' }} 
                                    defaultValue={[today, endDate]}
                                    format={dateFormat}
                                    disabledDate={disabledDate}
                                    disabledTime={disabledTime} 
                                    disabled={[true, false]}
                                     />}
                            
                            
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
                        <ModalBtn 
                            onClick={handleSetNewPrice}
                            disabled={isActiveBtn && !isSellPeriodState ? false : isActiveBtn && isSellPeriodState && isToDate ? false : true} 
                        >
                            Set new price
                        </ModalBtn>
                    </ModalBottomDiv>
                  </div>
              </div>
          </div>
        </div>

        <div className="modal fade" id="placeBid" tabIndex="-1" aria-labelledby="placeBidLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                    <div className="modal-header">
                        <h4 className="modal-title mt-3 mb-3" id="listingLabel">
                            { itemData.sale_type === 2 ? 'Place a bid' : 'Make offer'}
                        </h4>
                        <input type="button" id="modalClose" ref={bidModalClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                    </div>

                    <div className="modal-body">
                        <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                            <div style={{ padding: '10px 0px 5px 0px'}}>
                            {
                                itemData.sale_type === 2 ?
                                 <></>
                                :
                                <>
                                    <PTag className="NorTxt" style={{margin:'10px', fontWeight:'bold'}}>{itemData.sale_type === 2 ? 'Bid Expiration' : 'Offer Expiration'} <span style={{color:"red"}}>*</span></PTag>
                                    <DatePicker
                                        format="YYYY-MM-DD HH:mm" 
                                        showTime={{ format: 'HH:mm' }} 
                                        onChange={onChangeExpiration}
                                        onOk={onOKExpiration}
                                        disabledDate={disabledDate}
                                        disabledTime={disabledTime} 
                                    /> 
                                </>
                            }
                            </div>

                            <div style={{ padding: '5px 0px 25px 0px'}}>
                                <PTag 
                                    className="NorTxt" 
                                    style={{marginTop:'10px', marginLeft:'10px', marginBottom: '0px', fontWeight:'bold'}}
                                >
                                        {itemData.sale_type === 2 ? "Please enter your bid price" : "Please enter your offer price"}
                                </PTag>
                                <FlexDiv>
                                    <div style={{ width: '45%', margin: '0px 0px 0px 5px' }}>
                                        <FaDollarSign className='dollarSign'/> USD
                                        <StyledInput 
                                            placeholder="Amount" 
                                            onChange={(e) => changeBidPriceUSD(e.target.value)} 
                                            value={isBidPrice} 
                                        />
                                    </div>
                                    <div style={{ width: '55%', margin: '0px 0px 0px 5px' }}>
                                        <StyledTokenImg src={currencyLogo(itemData? itemData.chain_id : null)} />{currencyName(itemData? itemData.chain_id : null)}
                                        <StyledInput 
                                            placeholder="Amount" 
                                            onChange={(e) => changeBidPriceVXL(e.target.value)} 
                                            value={isBidPriceVXL} 
                                        />
                                    </div>
                                </FlexDiv>

                                {
                                    !is721 &&
                                    <FlexDiv>
                                        <div style={{ width: '100%', margin: '0px 0px 0px 5px' }}>
                                            {itemData ? itemData.supply_number - 0/*ownedSupplyNum*/ : 0} Available
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
                                <ModalBtn 
                                    onClick={handleBidAction} 
                                    disabled={isBidActiveBtn && expirationDate && isClickBid ? false : true}
                                >
                                        { itemData.sale_type === 2 ? 'Place a bid' : 'Make offer'}
                                </ModalBtn>
                                : 
                                <ModalBtn 
                                    onClick={()=>handleApproveAction(isBidPrice)} 
                                    disabled={isBidActiveBtn && expirationDate ? false : true}
                                >Approve</ModalBtn>
                            }
                        </ModalBottomDiv>
                    </div>
                </div>
            </div>
        </div>

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
                                <StyledStatistic className="vxlPrice" value={itemData.price && `${parseFloat(itemData.price / (ethOption? itemData.ethUsdPrice:itemData.usdPrice)).toFixed(ethOption? 3:0).toString()} ` } precision={0} prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={!ethOption? currencyLogo(itemData? itemData.chain_id : null): ethIcon} />} />
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
                              <StyledStatistic className="vxlPrice vxlTotalPrice vxlPriceColorFul" value={itemData.price && `${parseFloat(itemData.price / (ethOption? itemData.ethUsdPrice:itemData.usdPrice)).toFixed(ethOption? 3:0)}*` } precision={0} prefix={<img style={{ width: 16, height: 16, marginBottom: 5 }} src={!ethOption? currencyLogo(itemData? itemData.chain_id : null): ethIcon} />} />
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
        </>
    )
}

export default memo(ToolBar);