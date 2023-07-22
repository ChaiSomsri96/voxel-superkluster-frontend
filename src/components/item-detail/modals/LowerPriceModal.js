import React, { useState, useEffect, memo } from 'react';
import { Modal, DatePicker, Spin } from "antd";
import "./../../../assets/stylesheets/ItemDetail/lower_price_modal.scss";
import { ModalBtn, ModalCancelBtn, ModalLabel, NoticeMsg } from "./../styled-components";
import { formatSaleEndDate } from "./../../../utils";
import { signMessage } from "./../../../core/nft/interact";
import { useWeb3React } from "@web3-react/core";
import Swal from 'sweetalert2' ;
import { Axios } from './../../../core/axios';
import * as actions from "./../../../store/actions/thunks";
import { useDispatch } from "react-redux";
import Switch from "react-switch";
import moment from "moment";
import { LoadingOutlined } from '@ant-design/icons';

const LowerPriceModal = ({cartPopupOpen, handleCancel, itemData, colormodesettle}) => {
    const dispatch = useDispatch();
    const account = localStorage.getItem('account');
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` } ;
    const { library } = useWeb3React();

    const today = moment();
    const endDate = moment(itemData.sale_end_date * 1000);
    const dateFormat = 'YYYY-MM-DD HH:mm';
    const antIcon = <LoadingOutlined style={{ fontSize: 20, borderTop:'0px !important' }} spin />;

    const { RangePicker } = DatePicker;

    const [isChangePrice, setChangePrice] = useState('');
    const [isChangePriceUsd, setChangePriceUSD] = useState('');
    const [isActiveBtn, setActiveBtn] = useState(false);
    const [isSellPeriodState, setSellPeriodState] = useState(false);
    const [isToDate, setToDate] = useState(null);
    const [isSaleEndDate, setSaleEndDate] = useState('');
    const [isAuctionEndDate, setAuctionEndDate] = useState('');
    const [loadingState, setLoadingState] = useState(false);

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

    const handleSwitch = () => {
        setSellPeriodState(!isSellPeriodState);
    }

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
            handleCancel();
            Swal.fire({
                title: 'It worked!',
                text: `Change price succeeded.`,
                icon: 'success',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
            });

            setChangePrice('');
            setChangePriceUSD('');
            setActiveBtn(false);
            setSellPeriodState(false);
            setToDate(null);
            setSaleEndDate('');
            setAuctionEndDate('');

            dispatch(actions.fetchNftDetailInfo(accessToken, header, itemData.id));
        }
        catch(err) {
            setLoadingState(false);
            handleCancel();
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
            handleCancel();

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

    return (
        <>
        <Modal
            className='lower-price tool-bar-modal'
            open={cartPopupOpen}
            onCancel={handleCancel}
            footer={null}
            centered={true}
            title="Lower the listing price"
        >
            <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                <div style={{paddingBottom: '15px'}}>
                    <ModalLabel>
                        Please enter your price
                    </ModalLabel>
                    <div className='price-input-section'>
                        <input
                            type="text"
                            className="form-control list-input-control"
                            placeholder="$USD"
                            onChange={handlePriceInput}
                            value={isChangePrice}
                        />

                        <input
                            type="text"
                            className="form-control list-input-control"
                            placeholder="VXL"
                            onChange={handlePriceInputUSD}
                            value={isChangePriceUsd}
                        />
                    </div>

                    <div style={{marginTop: '15px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <ModalLabel>
                                Use previous listing expiration date
                            </ModalLabel>
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
                        </div>
                        {itemData.sale_type == 1 && <NoticeMsg>{isSaleEndDate ? isSaleEndDate : "undefined"}</NoticeMsg>}
                        {itemData.sale_type == 2 && <NoticeMsg>{isAuctionEndDate ? isAuctionEndDate : "undefined"}</NoticeMsg>}
                    </div>

                    {
                        isSellPeriodState &&
                        <div className='date-picker-div' style={{marginTop: '15px'}}>
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
                                />
                            }

                            {
                                itemData.sale_type == 2 &&
                                <RangePicker
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

                    <NoticeMsg style={{marginTop: '15px'}}>
                        You must pay an additional gas fee if you want to cancel this listing at a later point.
                    </NoticeMsg>
                </div>
            </Spin>
            <div style={{textAlign: 'center', marginTop: '30px'}}>
                <ModalCancelBtn onClick={() => handleCancel()}>Never mind</ModalCancelBtn>
                <ModalBtn 
                    onClick={handleSetNewPrice}
                    disabled={isActiveBtn && !isSellPeriodState ? false : isActiveBtn && isSellPeriodState && isToDate ? false : true} 
                >
                    Set new price
                </ModalBtn>
            </div>
        </Modal>
        </>
    )
}

export default memo(LowerPriceModal);