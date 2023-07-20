import React, { useState, useEffect, memo, useRef } from 'react';
import styled from "styled-components";
import { Modal } from "antd";
import "./../../assets/stylesheets/cart_modal.scss";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import LocalButton from '../common/Button';
import SkCheckbox from "./../SkCheckbox";
import { useSelector, useDispatch} from 'react-redux';
import * as selectors from "./../../store/selectors";
import * as actions from "./../../store/actions/thunks";
import { Axios } from "./../../core/axios";
import { usdPriceItemDetailPage, formatUSDPrice, formatETHPrice } from "./../../utils";
import Swal from 'sweetalert2' ;
import { isApproved, getApprove, buyCart } from "./../../core/nft/interact"
import { useWeb3React } from "@web3-react/core";
import NoData from "./../item-detail/NoData";

const ItemName = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 17px;
    line-height: 17px;
    font-weight: 600;
`;

const CollectionName = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 13px;
    line-height: 13px;
    font-weight: 400;
`;

const MainPrice = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 15px;
    line-height: 15px;
    font-weight: 600;
`;

const NoticeMsg = styled.div`
    color: ${props => props.theme.filterButtonColor};
    font-size: 13px;
    line-height: 18px;
    font-weight: 400;
`;

const RemoveBtn = styled.button`
    height: 34px;
    width: 100px;
    border: none;
    outline: 0;
    border-radius: 6px;
    color: ${props => props.theme.editProfileBtnColor};
    background: ${props => props.theme.primaryColor};
    font-size: 15px;
    line-height: 15px;
    font-weight: 600;

    &:hover {
        background: ${props => props.theme.clearAllHover};    
    }
`;

const TotalPrice = styled.div`
    font-size: 18px;
    line-height: 18px;
    font-weight: 800;
    color: ${props => props.theme.primaryColor};
`;

const PriceContainer = styled.div`
    border-bottom: 1px solid ${props => props.theme.modalHeaderBorderColor};
    border-top: 1px solid ${props => props.theme.modalHeaderBorderColor};
`;

const TopHeader = styled.div`
    font-size: 16px;
    line-height: 16px;
    font-weight: 500;
    color: ${props => props.theme.primaryColor};
`;

const ClearAll = styled.div`
    font-size: 16px;
    line-height: 16px;
    font-weight: 500;
    color: ${props => props.theme.primaryColor};
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.clearAllHover};
    }
`;

const CartModal = ({cartPopupOpen, handleCancel, colormodesettle}) => {
    
    const accessTokenState = useSelector(selectors.accessToken) ;
    const accessToken = accessTokenState.data ? accessTokenState.data : null;
    const account = localStorage.getItem('account');

    const { library, chainId } = useWeb3React();

    let cartInfo = useSelector(selectors.cartInfoState).data;
    const dispatch = useDispatch();

    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [termsOfService, setTermsOfService] = useState(false);
    const [ethPay, setEthPay] = useState(false);
    const [isShowBtnState, setShowBtnState] = useState(true);
    const [loadingState, setLoadingState] = useState(false);

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
            // approvedToken_account = localStorage.getItem('approvedToken'+account)
        });
    }

    const handleApproveAction = async () => {
        setLoadingState(true);
        await getApprove(account, library)
        .then((res) => {
            if(res == true) {
                setLoadingState(false);
                setShowBtnState(true);
                localStorage.setItem('approvedToken'+account, true);
            }
        })
        .catch((err) => {
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
            setLoadingState(false);
        });
    }

    const handleBatchBuy = async() => {
        setLoadingState(true);
        
        const postData = {ethOption: ethPay};

        await Axios.post('/api/cart/check-out', postData, { headers: {'Authorization': `Bearer ${accessToken}`}})
          .then(async(res) => {
              await buyCart(ethPay, library, res.data.sellers, res.data.cartPrice, res.data.payload, res.data.deadline, res.data.signature, account)
              .then((result) => {
                
                Swal.fire({
                  title: 'It worked!',
                  text: 'Congratulations, you now own the NFTs! You can view them on your profile page.',
                  icon: 'success',
                  confirmButtonText: 'Close',
                  timer: 5000,
                  customClass: 'swal-height'
                });
                
                //window.location.reload();
                dispatch(actions.fetchCartInfo(accessToken));
                setLoadingState(false);
                setEthPay(false);
                return;
              }).catch((err) => {

                console.error("check-out Err: ", err);

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
                setLoadingState(false);
                setEthPay(false);
                return;
              });
          })
          .catch ((e) => {
            
            console.log('error: ', e);
            Swal.fire({
              title: 'Error',
              text: 'Something went wrong!',
              icon: 'error',
              confirmButtonText: 'Close',
              timer: 5000,
              customClass: 'swal-height'
            })
            setLoadingState(false);
            setEthPay(false);
            return;
          })
    }

    useEffect(()=>{
        if(library && account) getApproveInfo(account, library) ;
      },[account, library]);

    const getCartInfo = () => {
        if(accessToken) {
            dispatch(actions.fetchCartInfo(accessToken));
        }   
    }

    const removeAllItem = async () => {
        if (!cartInfo || !cartInfo.data || cartInfo.data.length == 0) return;
        const postData = {};

        try {
            await Axios.post('/api/cart/remove-cart', postData, { headers: {'Authorization': `Bearer ${accessToken}`}});
            getCartInfo();
        }
        catch(e) {
            Swal.fire({
                title: 'Oops...',
                text: 'Error while clearing cart.',
                icon: 'error',
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
            });
        }
    }

    const removeFromCart = async (assetId) => {
        const postData = {
            id: assetId
        };

        try {
            await Axios.post('/api/cart/remove-cart', postData, { headers: {'Authorization': `Bearer ${accessToken}`}});
            getCartInfo();
        }
        catch(e) {
            Swal.fire({
                title: 'Oops...',
                text: 'Error while removing item from cart.',
                icon: 'error',
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
            })
        }
    }

    useEffect(() => {
        getCartInfo();
      }, [dispatch, accessToken])


    useEffect(() => {
        if(!cartInfo || !cartInfo.data || cartInfo.data.length == 0) {
            setTotalCartPrice(0);
            return;
        }

        let totalPrice = 0;

        for(let i = 0; i < cartInfo.data.length; i ++) {
            totalPrice += cartInfo.data[i].asset.price;
        }

        setTotalCartPrice(totalPrice);
    }, [cartInfo]);
    
    const ItemRow = ({data}) => {

        const [hovered, setHovered] = useState(false);
        return (
            <div 
                style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: hovered && colormodesettle.ColorMode ? '#F8F4F4' : hovered && !colormodesettle.ColorMode ? '#33373B' :'transparent'
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className='cart-item-img'>
                    <LazyLoadImage src={data.asset.image} alt={`cart-item-img-${data.asset.id}`} />
                </div>

                <div style={{display: 'flex', flexDirection: 'column', paddingLeft: '15px', gap: '8px'}}>
                    <ItemName>{data.asset.name}</ItemName>
                    <CollectionName>{data.collection.name}</CollectionName>
                </div>
                
                    <div style={{display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'flex-end', gap: '8px'}}>
                        {
                            !hovered ?
                            <>
                                <MainPrice>{usdPriceItemDetailPage(data.asset.price)} USD</MainPrice> 
                                {
                                    ethPay ?
                                    <CollectionName>{formatETHPrice(parseFloat(data.asset.price / (cartInfo ? cartInfo.ethUsdPrice : 1)))} ETH</CollectionName> :
                                    <CollectionName>{formatUSDPrice(parseInt(data.asset.price / (cartInfo ? cartInfo.usdPrice : 1)))} VXL</CollectionName>
                                }
                            </>
                            :
                            <RemoveBtn onClick={() => removeFromCart(data.asset.id)}>
                                Remove
                            </RemoveBtn>
                        }
                        
                    </div>
            </div>
        )
    }

    return (
        <>
        <Modal
            className='cart-checkout'
            open={cartPopupOpen}
            onCancel={handleCancel}
            footer={null}
            centered={true}
            title="My Cart"
            width="400"

            style={{
                position: 'fixed',
                top: 20,
                right: 20
            }}
        >
                <div className='top-header'>
                    <TopHeader>{cartInfo && cartInfo.data ? cartInfo.data.length : 0} items</TopHeader>
                    <ClearAll onClick={() => removeAllItem}>Clear All</ClearAll>
                </div>

                {
                    cartInfo && cartInfo.data && cartInfo.data.length > 0 ?
                    <div className='item-scroll'>
                        {
                            cartInfo.data.map((data) => (
                                <ItemRow key={data.asset.id} data={data} />
                            ))
                        }
                    </div>
                    :
                    <NoData />   
                }

                <PriceContainer className="price-container">
                    <TotalPrice>
                        Total Price
                    </TotalPrice>

                    <div className='total-price'>
                        <TotalPrice>
                            {usdPriceItemDetailPage(totalCartPrice)} USD
                        </TotalPrice>
                        {
                            ethPay ?
                            <CollectionName>
                                {formatETHPrice(parseFloat(totalCartPrice / (cartInfo ? cartInfo.ethUsdPrice : 1)))} VXL
                            </CollectionName> 
                            :
                            <CollectionName>
                                {formatUSDPrice(parseInt(totalCartPrice / (cartInfo ? cartInfo.usdPrice : 1)))} VXL
                            </CollectionName>
                        }
                        
                    </div>
                </PriceContainer>

                <div style={{padding: '0px 20px'}}>
                    <div style={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '10px', 
                        padding: '20px 0px'
                    }}>
                            <SkCheckbox
                                modal={true}
                                className={colormodesettle.ColorMode ? "sk-checkbox-light" : "sk-checkbox-dark"}
                                checked={termsOfService === true}
                                onChange={() => setTermsOfService(!termsOfService)}
                            >
                                <NoticeMsg style={{marginLeft: '14px', marginTop: '5px'}}>By checking this box, I agree to SuperKluster's Terms of Service</NoticeMsg>
                            </SkCheckbox>

                            <SkCheckbox
                                modal={true}
                                className={colormodesettle.ColorMode ? "sk-checkbox-light" : "sk-checkbox-dark"}
                                checked={ethPay === true}
                                onChange={() => setEthPay(!ethPay)}
                            >
                                <NoticeMsg style={{marginLeft: '14px', marginTop: '5px'}}>Check this box to pay with your Ethereum balance**</NoticeMsg>
                            </SkCheckbox>
                    </div>

                    {
                        isShowBtnState ?
                            <LocalButton
                                onClick={handleBatchBuy} 
                                className="check-out-btn" disabled={!termsOfService}>Check out</LocalButton>
                        :
                            <LocalButton
                                onClick={handleApproveAction}
                                className="check-out-btn" disabled={!termsOfService}>Approve</LocalButton>
                    }

                    <NoticeMsg style={{marginTop: '15px'}}>
                        *This transaction will include the SuperKluster 1.5%
                    </NoticeMsg>

                    <NoticeMsg>
                        **You will be paying for gas free to swap $ETH to $VXL into your wallet
                    </NoticeMsg>
                </div>
        </Modal>
        </>
    )
}

export default memo(CartModal);