import React, { useState, useEffect, memo } from 'react';
import { Modal, Spin } from "antd";
import "./../../../assets/stylesheets/ItemDetail/checkout_modal.scss";
import { ModalBtn } from "./../styled-components";
import { isApproved, getApprove, getBuyAction } from "./../../../core/nft/interact";
import { useWeb3React } from "@web3-react/core";
import Swal from 'sweetalert2' ;
import SkCheckbox from "./../../SkCheckbox";
import { NoticeMsg } from "./../styled-components";
import { Axios } from './../../../core/axios';
import styled from "styled-components";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { usdPriceItemDetailPage, formatUSDPrice, formatETHPrice } from "./../../../utils";
import { LoadingOutlined } from '@ant-design/icons';

const PriceContainer = styled.div`
    border-bottom: 1px solid ${props => props.theme.modalHeaderBorderColor};
    border-top: 1px solid ${props => props.theme.modalHeaderBorderColor};
`;

const TotalPrice = styled.div`
    font-size: 16px;
    line-height: 16px;
    font-weight: 800;
    color: ${props => props.theme.primaryColor};
`;

const ItemName = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 15px;
    line-height: 15px;
    font-weight: 600;
`;

const CollectionName = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 12px;
    line-height: 12px;
    font-weight: 400;
`;

const TopHeader = styled.div`
    font-size: 16px;
    line-height: 16px;
    font-weight: 500;
    color: ${props => props.theme.filterButtonColor};
`;

const MainPrice = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 15px;
    line-height: 15px;
    font-weight: 600;
`;

const CheckoutModal = ({cartPopupOpen, handleCancel, itemData, colormodesettle}) => {

    const account = localStorage.getItem('account');
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` };
    const { library } = useWeb3React();

    const antIcon = <LoadingOutlined style={{ fontSize: 20, borderTop:'0px !important' }} spin />;

    const [isAgreeWithTerms, setAgreeWithTerms] = useState(false);
    const [ethOption, setEthOption] = useState(false);

    const [loadingState, setLoadingState] = useState(false);
    const [isShowBtnState, setShowBtnState] = useState(true);
    const [isClickConfirm , setClickConfirm] = useState(false);

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
            });
        }
        setTimeout(() => sendAddItemTxHash(txHash, ++times), 1000);
    }

    const handleBuyAction = async () => {
        setClickConfirm(true);
        setLoadingState(true);

        const send_Data = {
            id : itemData.id,
            usdPrice: itemData.usdPrice,
            ethOption: ethOption
        };

        await Axios.post("/api/sale/buy-item/", send_Data, { headers: header })
        .then( async (res) => {
            if(res.data.can_buy == false) {
                handleCancel();
                setLoadingState(false);
                setClickConfirm(false);
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

                localStorage.setItem('currentPrice',parseFloat(itemData.price / itemData.usdPrice).toFixed(2));
                handleCancel();
                setClickConfirm(false);
                setLoadingState(false);
                deleteMe();

            })
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
            handleCancel();
        });
    }

    return (
        <>
        <Modal
            className='checkout-modal tool-bar-modal'
            open={cartPopupOpen}
            onCancel={handleCancel}
            footer={null}
            centered={true}
            title="Complete checkout"
        >
            <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                <div className='top-header'>
                        <TopHeader>Item</TopHeader>
                        <TopHeader>Subtotal</TopHeader>
                </div>

                <div className='item-scroll'>
                    
                    <div 
                    style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '10px',
                        justifyContent: 'space-between'
                    }}>
                        <div className="item-con">
                            <div className='cart-item-img'>
                                <LazyLoadImage src={(itemData && itemData.image)? itemData.image : itemData.raw_image} alt={`check-out-img`} />
                            </div>

                            <div className="item-name-set">
                                <ItemName>{itemData.name ? itemData.name : "Unnamed"}</ItemName>
                                <CollectionName>{itemData.collection && itemData.collection.name ? itemData.collection.name : "Unnamed"}</CollectionName>
                            </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px'}}>
                            <MainPrice>{usdPriceItemDetailPage(itemData.price)} USD</MainPrice>

                            {
                                ethOption ?
                                <CollectionName>{formatETHPrice(parseFloat(itemData.price / itemData.ethUsdPrice))} ETH</CollectionName>
                                :
                                <CollectionName>{formatUSDPrice(parseInt(itemData.price / itemData.usdPrice))} VXL</CollectionName>
                            }
                        </div>
                    </div>

                </div>

                <PriceContainer className="price-container">
                    <TotalPrice>
                            Total Price
                    </TotalPrice>
                    <div className='total-price'>
                        <TotalPrice>
                            {usdPriceItemDetailPage(itemData.price)} USD
                        </TotalPrice>
                        {
                            ethOption ?
                            <CollectionName>{formatETHPrice(parseFloat(itemData.price / itemData.ethUsdPrice))} ETH</CollectionName>
                            :
                            <CollectionName>
                                {formatUSDPrice(parseInt(itemData.price / itemData.usdPrice))} VXL
                            </CollectionName>
                        }
                    </div>
                </PriceContainer>
                <div style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '10px',
                    padding: '20px 0px'}}>
                    <SkCheckbox
                        modal={true}
                        className={colormodesettle.ColorMode ? "sk-checkbox-light" : "sk-checkbox-dark"}
                        checked={isAgreeWithTerms === true}
                        onChange={() => setAgreeWithTerms(!isAgreeWithTerms)}
                    >
                        <NoticeMsg style={{marginLeft: '14px', marginTop: '5px'}}>By checking this box, I agree to SuperKluster's Terms of Service</NoticeMsg>
                    </SkCheckbox>

                    <SkCheckbox
                        modal={true}
                        className={colormodesettle.ColorMode ? "sk-checkbox-light" : "sk-checkbox-dark"}
                        checked={ethOption === true}
                        onChange={() => setEthOption(!ethOption)}
                    >
                        <NoticeMsg style={{marginLeft: '14px', marginTop: '5px'}}>Check this box to pay with your Ethereum balance**</NoticeMsg>
                    </SkCheckbox>
                </div>
            </Spin>

            <div>
                {
                    isShowBtnState == true ?
                    <ModalBtn onClick={handleBuyAction} disabled={(isAgreeWithTerms && !isClickConfirm) ? false : true}>Confirm checkout</ModalBtn>
                    :
                    <ModalBtn onClick={()=>handleApproveAction(itemData.price)}>Approve</ModalBtn>
                }
            </div>
                
            <NoticeMsg style={{marginTop: '15px'}}>
            *This transaction will include the SuperKluster 1.5%
            </NoticeMsg>
            <NoticeMsg>
            **You will be paying for gas free to swap $ETH to $VXL into your wallet
            </NoticeMsg>

        </Modal>
        </>
    )
}

export default memo(CheckoutModal);