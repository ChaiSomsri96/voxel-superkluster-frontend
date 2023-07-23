import React, { useState, useEffect, memo } from 'react';
import { Modal, Spin, DatePicker } from "antd";
import "./../../../assets/stylesheets/ItemDetail/make_offer_modal.scss";
import { ModalBtn, ModalCancelBtn, ModalLabel } from "./../styled-components";
import moment from "moment";
import { LoadingOutlined } from '@ant-design/icons';
import { isApproved, getApprove } from "./../../../core/nft/interact";
import { useWeb3React } from "@web3-react/core";
import Swal from 'sweetalert2' ;
import { Axios } from './../../../core/axios';
import { checkBeforeOffer } from "./../../../utils";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "./../../../store/actions/thunks";
import * as selectors from "./../../../store/selectors";

const MakeOfferModal = ({cartPopupOpen, handleCancel, itemData}) => {

    const dispatch = useDispatch();
    let offerData = useSelector(selectors.nftBidHistoryState).data;

    const { library } = useWeb3React();
    
    const account = localStorage.getItem('account');
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` } ;

    const is721 = itemData.is_voxel ? itemData.is_721 : itemData.collection.is_721;

    const [loadingState, setLoadingState] = useState(false);
    const [expirationDate, setExpirationDate] = useState();
    const [isBidPrice, setBidPrice] = useState('');
    const [isBidPriceVXL, setBidPriceVXL] = useState('');
    const [isBidActiveBtn, setBidActiveBtn] = useState(false);
    const [isShowBtnState, setShowBtnState] = useState(true);
    const [isClickBid , setClickBid] = useState(true) ;

    const antIcon = <LoadingOutlined style={{ fontSize: 20, borderTop:'0px !important' }} spin />;

    const onChangeExpiration = (value, dateString) => {
        setExpirationDate(value);
    }

    const onOKExpiration = (date) => {
        setExpirationDate(date);
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
    }, [account, library]);

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

            handleCancel();

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
            handleCancel();

            dispatch(actions.fetchBidHistory({id: itemData.id}));
            dispatch(actions.fetchNftHistory({"id": itemData.id, page: 1}));

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
            setBidActiveBtn(false);
        }
        catch(err) {
            setLoadingState(false);
            setClickBid(true) ;
            handleCancel();
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

    return (
        <>
        <Modal
            className='make-offer tool-bar-modal'
            open={cartPopupOpen}
            onCancel={handleCancel}
            footer={null}
            centered={true}
            title={itemData.sale_type === 2 ? 'Place a bid' : 'Make offer'}
        >

            <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                <div style={{paddingBottom: '15px'}}>
                    <ModalLabel>{itemData.sale_type === 2 ? 'Bid Expiration' : 'Offer Expiration'} <span style={{color:"red"}}>*</span></ModalLabel>
                    <DatePicker
                        format="YYYY-MM-DD HH:mm" 
                        showTime={{ format: 'HH:mm' }} 
                        onChange={onChangeExpiration}
                        onOk={onOKExpiration}
                        disabledDate={disabledDate}
                        disabledTime={disabledTime}
                        value={expirationDate}
                    /> 
                
                    <ModalLabel style={{marginTop: '15px'}}>
                        {
                            itemData.sale_type === 2 ? "Please enter your bid price" : "Please enter your offer price"
                        }
                    </ModalLabel>
                    <div className='price-input-section'>
                            <input
                                type="text"
                                className="form-control list-input-control"
                                placeholder="$USD"
                                onChange={(e) => changeBidPriceUSD(e.target.value)}
                                value={isBidPrice}
                            />

                            <input
                                type="text"
                                className="form-control list-input-control"
                                placeholder="VXL"
                                onChange={(e) => changeBidPriceVXL(e.target.value)}
                                value={isBidPriceVXL}
                            />
                    </div>
                </div>  
            </Spin>

            <div style={{textAlign: 'center', marginTop: '30px'}}>
                <ModalCancelBtn onClick={() => handleCancel()}>Never mind</ModalCancelBtn>
                {
                    isShowBtnState === true ?

                    <ModalBtn
                        onClick={handleBidAction}
                        disabled={isBidActiveBtn && expirationDate && isClickBid ? false : true}
                    >
                        { itemData.sale_type === 2 ? 'Place a bid' : 'Make offer' }
                    </ModalBtn>
                    :
                    <ModalBtn 
                                    onClick={()=>handleApproveAction(isBidPrice)} 
                                    disabled={isBidActiveBtn && expirationDate ? false : true}
                    >
                        Approve
                    </ModalBtn>
                }
                
            </div>
        </Modal>
        </>
    )
}

export default memo(MakeOfferModal);