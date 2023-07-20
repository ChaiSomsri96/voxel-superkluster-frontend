import React, { memo, useState, useEffect, useRef } from 'react';
import { SubTitle, FeeLabel, ModalTopBar, ModalTopBarLeft,
    ImgInfo, PTag, ModalTopBarRight, StyledTopBarImg, StyledTokenImg, StyledStatistic,
    StyledCollapse, CollapsePanelHeader } from "./styled-components";
import Switch from "react-switch";
import { DatePicker } from 'antd';
import moment from 'moment';
import { Select, Collapse, Spin } from 'antd';
import { duration } from "./../constants/index";
import { ethers } from 'ethers';
import { maxListingUSDPrice } from "./../constants/index";
import { currencyName, currencyLogo } from "./../../store/utils";
import { formatUSDPrice } from "./../../utils";
import { FiChevronDown, FiCheckCircle } from "react-icons/fi";
import { getListAction, signMessage } from "./../../core/nft/interact";
import { useWeb3React } from "@web3-react/core";
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { Axios } from "./../../core/axios";
import { useNavigate } from "@reach/router";
import { LoadingOutlined } from '@ant-design/icons';

const FixedPrice = ({colormodesettle, itemDetailData, state, onStateChange}) => {

    const is_721 = itemDetailData.is_voxel ? itemDetailData.is_721 : itemDetailData.collection.is_721;

    const navigate = useNavigate();

    const { Panel } = Collapse;
    const { Option } = Select;
    const { library } = useWeb3React();

    const ref = useRef(null);
    
    const account = localStorage.getItem('account');
    const accessToken = localStorage.getItem('accessToken');

    const header = { 'Authorization': `Bearer ${accessToken}` };
    
    const [durationId, setDurationId] = useState(state.durationId);
    const [isReserve, setReserve] = useState(state.isReserve);
    const [reserveAddr, setReserveAddr] = useState(state.reserveAddr);
    const [isValidReserveAddr, setValidReserveAddr] = useState(state.isValidReserveAddr);
    const [amountUSD, setAmountUSD] = useState(state.amountUSD);
    const [amountVXL, setAmountVXL] = useState(state.amountVXL);
    const [isFromDate, setFromDate] = useState(state.isFromDate);
    const [isToDate, setToDate] = useState(state.isToDate);

    const [isClickList, setClickList] = useState(true);
    const [isVerifyBState, setVerifyBState] = useState(false);
    const [isVerifyIconColorB, setVerifyIconColorB] = useState("grey");
    const [isVerifyCState, setVerifyCState] = useState(false);
    const [isVerifyIconColorC, setVerifyIconColorC] = useState("grey");

    const [disableFlag, setDisableFlag] = useState(true);

    useEffect(() => {
        onStateChange({ durationId, isReserve, reserveAddr, isValidReserveAddr, 
            amountUSD, amountVXL, isFromDate, isToDate});
    }, [durationId, isReserve, reserveAddr, isValidReserveAddr, amountUSD, amountVXL, isFromDate, isToDate])

    const verifyIconStyle = {
        margin: '-3px 5px 0px', 
        fontSize: 22
    }
    const verifyIconColorC = {
        color: isVerifyIconColorC,
    }
    const verifyIconColorB = {
        color: isVerifyIconColorB,
    }

    const StepB = <CollapsePanelHeader>
            <FiCheckCircle style={{ ...verifyIconStyle, ...verifyIconColorB }} />
            Approve this item for sale
        </CollapsePanelHeader>
    ;
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

    const handleReserve = () => {
        setReserve(!isReserve);
    }

    const handleReserveAddr = (newAddr) => {
        if(account.toLowerCase() == newAddr.toLowerCase()) {
            return;
        }
        setReserveAddr(newAddr);
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

    const listAction = async (chainType) => {
        try {
            setClickList(false);
            let signMsgData;
            signMsgData = {
                type: "fixed",
                price: parseFloat(amountUSD).toFixed(2),
                toDate: Math.floor(isToDate.valueOf() / 1000),
                tokenId: itemDetailData.token_id,
                collection: itemDetailData.collection.name,
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

            if(chainType === 'onChain') {
                await getListAction(params, signMsgData, rowData, itemDetailData, library);
            }
            else if(itemDetailData.modified) {
                await Axios.post("/api/supply-assets/mint", {id: itemDetailData.id}, {headers: header});
            }
            
            setVerifyIconColorB("#1fb30d");
            setVerifyBState(false);
            setVerifyCState(true);
            await getSignMessage(signMsgData);

            localStorage.setItem(itemDetailData.collection.name , true);
        }
        catch(err) {

            console.error("listAction: ", err);

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

    const getSignMessage = async (data) => {
        try {
            let res = await signMessage(data, library);
            setVerifyCState(false);
            setVerifyIconColorC("#1fb30d");

            handlePost(res);

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

    const handlePost = async (param) => {

        if(is_721) {
            const postData = {
                id: itemDetailData.id,
                price: parseFloat(amountUSD).toFixed(2),
                sale_end_date: Math.floor(isToDate.valueOf() / 1000),
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
                });
                moveToItemDetailPage(itemDetailData.id);
            } else {
                ref.current.click();

                Swal.fire({
                    title: 'Oops...',
                    text: 'Something went wrong!',
                    icon: 'error',
                    confirmButtonText: 'Close',
                    timer: 5000,
                    customClass: 'swal-height'
                });
            }
        }
        else {
            const postData = {
                id: localStorage.getItem('ownerId'),
                price: parseFloat(amountUSD).toFixed(2),
                sale_end_date: Math.floor(isToDate.valueOf() / 1000),
                signature: param,
                quantity: 1, //listingQuantity,
                reserveAddress: (isReserve && isValidReserveAddr) ? reserveAddr : null
            };

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
                    moveToItemDetailPage(itemDetailData.id);
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
                });
            }
        }
    }

    useEffect(() => {
        setValidReserveAddr(ethers.utils.isAddress(reserveAddr));
    }, [reserveAddr])

    useEffect(() => {
        if(amountVXL.length === 0) {
            setDisableFlag(true);
        }
        else if(parseFloat(amountUSD) > maxListingUSDPrice) {
            setDisableFlag(true);
        }
        else if(isReserve && (reserveAddr.length == 0 || !isValidReserveAddr)) {
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
    }, [amountVXL, isReserve, reserveAddr, isValidReserveAddr, isClickList, isToDate])

    return (
        <>
            <div className='fixed-price'>

                <div className='form-item'>
                    <SubTitle className="sub-title-margin">Price</SubTitle>
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
                            The listing price for sale should not exceed ${formatUSDPrice(maxListingUSDPrice)}
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
                        </div> :
                        null
                    }
                    
                </div>

                <div style={{display: 'flex', alignItems: 'center', 
                justifyContent: 'space-between'}} className="sub-title-margin form-item">
                    <SubTitle>Reserve an item to a specific buyer</SubTitle>

                    <Switch 
                                    onChange={handleReserve} 
                                    checked={isReserve}
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
                
                {
                    isReserve ?
                    <div>
                        <input
                                type="text"
                                className="form-control list-input-control"
                                placeholder="0x..."
                                value={reserveAddr}
                                onChange = {(e) => handleReserveAddr(e.target.value)}
                        />
                    </div>
                    : null
                }
                
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}} className='form-item'>
                    <SubTitle>Summary</SubTitle>
                    <div className='flex-center-between'>
                        <FeeLabel>Listing price</FeeLabel>
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
                            <input type="button" id="modalClose" ref={ref} className={colormodesettle.ColorMode? "btn-close" : "btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
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
    );
}

export default memo(FixedPrice);