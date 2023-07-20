import React, { memo, useState, useEffect, useRef } from 'react';
import { SubTitle, FeeLabel, ModalTopBar, ModalTopBarLeft,
    ImgInfo, PTag, ModalTopBarRight, StyledTopBarImg, StyledTokenImg, StyledStatistic,
    StyledCollapse, CollapsePanelHeader } from "./styled-components";
import { maxListingUSDPrice } from "./../constants/index";
import { formatUSDPrice } from "./../../utils";
import { Select, Collapse, Spin } from "antd";
import { duration } from "./../constants/index";
import { DatePicker } from 'antd';
import moment from 'moment';
import { getListAction, signMessage } from "./../../core/nft/interact";
import { useWeb3React } from "@web3-react/core";
import Swal from 'sweetalert2';
import { Axios } from "./../../core/axios";
import { useNavigate } from "@reach/router";
import { currencyName, currencyLogo } from "./../../store/utils";
import { FiChevronDown, FiCheckCircle } from "react-icons/fi";
import { LoadingOutlined } from '@ant-design/icons';

const TimedAuction = ({colormodesettle, itemDetailData, state, onStateChange}) => {
    const navigate = useNavigate();
    
    const { Panel } = Collapse;

    const account = localStorage.getItem('account');
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` }
    const { library } = useWeb3React();
    const { Option } = Select;

    const ref = useRef(null);

    const [isMethod, setMethod] = useState(state.isMethod);
    const [amountUSD, setAmountUSD] = useState(state.amountUSD);
    const [amountVXL, setAmountVXL] = useState(state.amountVXL);
    const [durationId, setDurationId] = useState(state.durationId);
    const [isFromDate, setFromDate] = useState(state.isFromDate);
    const [isToDate, setToDate] = useState(state.isToDate);

    const [disableFlag, setDisableFlag] = useState(true);
    const [isClickList, setClickList] = useState(true);

    const [isVerifyBState, setVerifyBState] = useState(false);
    const [isVerifyIconColorB, setVerifyIconColorB] = useState("grey");
    const [isVerifyCState, setVerifyCState] = useState(false);
    const [isVerifyIconColorC, setVerifyIconColorC] = useState("grey");

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

    const StepB = <CollapsePanelHeader>
                        <FiCheckCircle style={{ ...verifyIconStyle, ...verifyIconColorB }} />
                        Approve this item for sale
                 </CollapsePanelHeader>

    const StepC = <CollapsePanelHeader>
                    <FiCheckCircle style={{ ...verifyIconStyle, ...verifyIconColorC }} />
                    Confirm <span style={{ color: '#f70dff' }}>{amountUSD ? (amountUSD/itemDetailData.usdPrice).toFixed(0) : "0" }  {" " + currencyName(itemDetailData? itemDetailData.chain_id : null)}</span> listing
                </CollapsePanelHeader>
    ;

    const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

    const StepBText = `To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.`;
    const StepCText = <span>Accept the <span style={{ color: '#f70dff' }}>signature request</span> in your wallet and wait for your listing to process.</span>;

    const moveToItemDetailPage = (param) => {
        navigate(`/ItemDetail/${param}`)
    }
    
    const callback = (key) => {
        // console.log(key);
    }

    const handleDurationChange = (value) => {
        if(value === 2) { // 1 hour
            setToDate(moment().add(1, 'hour'));
        }
        else if(value === 3) { // 6 hours
            setToDate(moment().add(6, 'hours'));
        }
        else if(value === 4) {  // 1 day
            setToDate(moment().add(1, 'day'));
        }
        else if(value === 5) {  // 3 dyas
            setToDate(moment().add(3, 'days'));
        }
        else if(value === 6) {  // 7 days
            setToDate(moment().add(7, 'days'));
        }
        else if(value === 7) {  // 1 month
            setToDate(moment().add(1, 'month'));
        }
        else if(value === 8) {  // 3 months
            setToDate(moment().add(3, 'months'));
        }
        else if(value === 9) {  // 6 months
            setToDate(moment().add(6, 'months'));
        }

        setDurationId(value);
    }

    const setFixedPriceUSD = (val) => {
        if(!(/^[\d.]+$/.test(val) || val.length === 0))
            return;

        setAmountUSD(val);

        if(val.length == 0)
        {
            setAmountVXL("");
            return;
        }

        setAmountVXL((parseFloat(val) / itemDetailData.usdPrice).toFixed(0));
    }

    const setFixedPriceVXL = (val) => {
        if(!(/^[\d.]+$/.test(val) || val.length === 0))
            return;

        setAmountVXL(val);

        if(val.length == 0) 
        {
            setAmountUSD("");
            return;
        }

        setAmountUSD((val  * itemDetailData.usdPrice).toFixed(2)) ;
    }

    const disabledDate = (current) => {
        // Disable dates before 2023/06/25
        return current && current < isFromDate;
    };

    const disabledTime = (current, type) => {
        if (current && type === 'time') {
            const selectedDate = current.startOf('day');
            const disabledDateTime = isFromDate.startOf('day');
            return selectedDate.isSame(disabledDateTime) && current < disabledDateTime;
        }
        return false;
    };

    const handleSelectChange = (value) => {
        setMethod(value);
    }

    const onStartDateChange = (date, dateString) => {
        setFromDate(date);
    };

    const onStartDateOk = (date) => {
        setFromDate(date);
    };

    const onEndDateChange = (date, dateString) => {
        setToDate(date);
    };

    const onEndDateOk = (date) => {
        setToDate(date);
    };

    const listAction = async (chainType) => {
        try {
            setClickList(false);
            let signMsgData;
            signMsgData = {
                type: "auction",
                price: parseFloat(amountUSD).toFixed(2),

                auction_start_date: Math.floor(isFromDate.valueOf() / 1000),
                auction_end_date: Math.floor(isToDate.valueOf() / 1000),

                tokenId: itemDetailData.token_id,
                method: isMethod,
                quantity: 1
            };
    
            const rowData = {
                id: itemDetailData.id
            };
    
            const params = [
                header,
                account,
                chainType
            ];

            setVerifyBState(true);

            await getListAction(params, signMsgData, rowData, itemDetailData, library);
            
            setVerifyIconColorB("#1fb30d");
            setVerifyBState(false);
            setVerifyCState(true);
            await getSignMessage(signMsgData);
        }
        catch(err) {
            ref.current.click();

            setClickList(true);
            if(err.code != 4001) {
                Swal.fire({
                    title: 'Oops...',
                    text: 'Transaction Failed',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    timer: 5000,
                    customClass: 'swal-height'
                });    
            }
        }
    }

    const auctionPostData = async (signMsg) => {
        try {
            const auction_sDate = Math.floor(isFromDate.valueOf() / 1000);
            const auction_eDate = Math.floor(isToDate.valueOf() / 1000);

            const postData = {
                id: itemDetailData.id,
                start_price: parseFloat(amountUSD).toFixed(2),
                auction_start_date: auction_sDate,
                auction_end_date: auction_eDate,
                method: isMethod,
                signature: signMsg
            }

            await Axios.post(`/api/assets/auction`, postData, { headers: header });
            ref.current.click();
            Swal.fire({
                title: 'It worked!',
                text: 'Your item has been successfully listed for auction.',
                icon: 'success',
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
            });

            moveToItemDetailPage(itemDetailData.id);
        }
        catch(err) {
            ref.current.click();

            Swal.fire({
                title: 'Oops...',
                text: 'Something went wrong!',
                icon: err.response.data.msg,
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
            });
        }
    }

    const getSignMessage = async (data) => {
        try {
            let res = await signMessage(data, library);
            setVerifyCState(false);
            setVerifyIconColorC("#1fb30d");

            auctionPostData(res);

            setClickList(true);
        }
        catch(err) {
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
                });
            }
        }
    }

    useEffect(() => {
        if(amountVXL.length === 0) {
            setDisableFlag(true);
        }
        else if(parseFloat(amountUSD) > maxListingUSDPrice) {
            setDisableFlag(true);
        }
        else if(!isClickList) {
            setDisableFlag(true);
        }
        else if(isToDate == undefined || !isToDate) {
            setDisableFlag(true);
        }
        else {
            setDisableFlag(false);
        }
    }, [amountVXL, isClickList, isToDate])

    useEffect(() => {
        onStateChange({ isMethod, amountUSD, amountVXL, durationId, isFromDate, isToDate });
    }, [isMethod, amountUSD, amountVXL, durationId, isFromDate, isToDate])
    
    return (
        <>
            <div className='timed-auction'>
                <div className='form-item'>
                    <SubTitle className="sub-title-margin">Method</SubTitle>
                    
                    <div className='dropdownSelect one'>
                        <Select defaultValue={1} style={{ width: "100%" }} placeholder="Select..." onChange={handleSelectChange}>
                            <Option value={1}>Sell to highest bidder</Option>
                        </Select>
                    </div>
                </div>
                <div className='form-item'>
                    <SubTitle className="sub-title-margin">Starting price</SubTitle>

                    <div style={{display: 'flex', gap: '20px'}}>
                        <input
                            type="text"
                            className="form-control list-input-control"
                            placeholder="$USD"
                            style={{flex: 1}}
                            onChange={(e) => setFixedPriceUSD(e.target.value)}
                            value={amountUSD}
                        />

                        <input
                            type="text"
                            className="form-control list-input-control"
                            placeholder="VXL"
                            style={{flex: 1}}

                            onChange={(e) => setFixedPriceVXL(e.target.value)}
                            value={amountVXL}
                        />
                    </div>

                    {
                        parseFloat(amountUSD) > maxListingUSDPrice ? 
                        <div style={{ color: 'red' }} className="require-error">
                            The staring bid price should not exceed ${formatUSDPrice(maxListingUSDPrice)}
                        </div>
                        :
                        null
                    }
                </div>

                <div className='form-item'>
                    <SubTitle className="sub-title-margin">Duration</SubTitle>

                    <div className='dropdownSelect one sub-title-margin'>
                        <Select value={durationId} style={{ width: "100%" }} placeholder="Select..." onChange={handleDurationChange}>
                            {
                                duration && duration.length > 0 ?
                                    duration.map((opt) => (
                                        <Option key={opt.id} value={opt.id}>{opt.label}</Option>
                                    ))
                                : null
                            }
                        </Select>
                    </div>

                    {
                        durationId === 1 ?
                        <div style={{display: 'flex', gap: '20px'}}>
                            <DatePicker 
                                style={{flex: 1}} 
                                showTime 
                                onChange={onStartDateChange} 
                                onOk={onStartDateOk} 
                                value={isFromDate} 
                                format="YYYY-MM-DD HH:mm" 
                                placeholder='Starting' />

                            <DatePicker 
                                style={{flex: 1}} 
                                showTime
                                disabledDate={disabledDate}
                                disabledTime={disabledTime} 
                                onChange={onEndDateChange} 
                                onOk={onEndDateOk} 
                                value={isToDate} 
                                format="YYYY-MM-DD HH:mm" 
                                placeholder='Ending' />
                        </div> : null
                    }

                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}} className='form-item'>
                    <SubTitle>Summary</SubTitle>
                    <div className='flex-center-between'>
                        <FeeLabel>Starting bid price</FeeLabel>
                        <FeeLabel>{amountVXL.length === 0 ? '---' : amountVXL} VXL</FeeLabel>
                    </div>
                    <div className='flex-center-between'>
                        <FeeLabel>Creator earnings</FeeLabel>
                        <FeeLabel>0%</FeeLabel>
                    </div>
                    <div className='flex-center-between'>
                        <FeeLabel>Service Fee</FeeLabel>
                        <FeeLabel>1.5%</FeeLabel>
                    </div>
                </div>

                <button type="submit"
                    className='listing-btn-style form-item'
                    disabled={disableFlag}
                    onClick={ itemDetailData.status === "active" ? () => listAction('onChain') : () => listAction("offChain")}
                    data-bs-toggle="modal"
                    data-bs-target="#listing"
                >
                    Complete Listing
                </button>
            </div>

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
                                    <StyledTopBarImg src={itemDetailData && (itemDetailData.image_preview ? itemDetailData.image_preview :  itemDetailData.image)} alt="image" />
                                    <ImgInfo style={{maxWidth:'83%'}}>
                                        <PTag style={{overflow:'hidden', textOverflow:'ellipsis'}}>{itemDetailData.collection && itemDetailData.collection.name ? itemDetailData.collection.name : "Unnamed"}</PTag>
                                        <PTag className='previewCardTSy' style={{  fontWeight: 'bold', overflow:'hidden', textOverflow:'ellipsis'}}>{itemDetailData.name ? itemDetailData.name : "Unnamed"}</PTag>
                                        <PTag>quantity: 1</PTag>
                                    </ImgInfo>
                                </ModalTopBarLeft>
                                <ModalTopBarRight>
                                    <div style={{ textAlign: 'right' }}>
                                        <PTag>Price</PTag>
                                        <PTag  style={{  fontWeight: 'bold' }}><StyledTokenImg src={currencyLogo(itemDetailData? itemDetailData.chain_id : null)} />{amountVXL ? amountVXL : "0"}</PTag>
                                        <StyledStatistic value={amountUSD} precision={2} prefix={<span style={{ width: 16, height: 16, marginBottom: 5 }}>$</span>} src={currencyLogo(itemDetailData? itemDetailData.chain_id : null)} />    
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
    );
}

export default memo(TimedAuction);