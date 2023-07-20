import React, { memo, useState, useEffect } from 'react';

const Cart = () => {
    const handleBatchBuy = async() => {
        setLoadingState(true);
        
        const postData = {ethOption: ethOption};
        await Axios.post('/api/cart/check-out', postData, { headers: {'Authorization': `Bearer ${accessToken}`}})
          .then(async(res) => {
              await buyCart(ethOption, library, res.data.sellers, res.data.cartPrice, res.data.payload, res.data.deadline, res.data.signature, account)
              .then((result) => {
                closeBatchBuyModalClick.current.click();
                Swal.fire({
                  title: 'It worked!',
                  text: 'Congratulations, you now own the NFTs! You can view them on your profile page.',
                  icon: 'success',
                  confirmButtonText: 'Close',
                  timer: 5000,
                  customClass: 'swal-height'
                });
                localStorage.setItem('cartInfo', JSON.stringify([]));
                window.location.reload();
                setLoadingState(false);
                setEthOption(false);
                return;
              }).catch((err) => {
                closeBatchBuyModalClick.current.click();
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
                setEthOption(false);
                return;
              });
          })
          .catch ((e) => {
            closeBatchBuyModalClick.current.click();
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
            setEthOption(false);
            return;
          })
      }

      const handleApproveAction = async () => {
        setLoadingState(true);
        await getApprove(account, library)
                    .then((res) => {
                      // console.log(res) ;
                      // return;
                      if(res == true) {
                        setLoadingState(false);
                        setShowBtnState(true);
                        localStorage.setItem('approvedToken'+account, true);
                      }
                    })
                    .catch((err) => {
                      // Object.values(err).map(function(item) {
                      //   if (item.data && item.data.msg) {
                      //     notification['error']({
                      //       message: `${ item.data.msg }`,
                      //     });
                      //   }
                      // })
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
      
    return (<>
    <div className="modal fade" id="cartModal" tabIndex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15, width: '98%' }}>
              <div style={{paddingLeft:'0.5rem', paddingBottom:'1rem', display:'flex', justifyContent:'space-between'}}>
                  <h4 className="mt-3" id="listingLabel"><FaShoppingCart style={{marginRight:'0.5rem'}}/> My cart</h4>
                  <input type="button" id="modalClose" ref={closeBatchBuyModalClick} className={colormodesettle.ColorMode?"btn-close mt-3":"btn-close btn-close-white mt-3"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
              </div>
              <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                <div className="modal-body text-white Non-scroll-tab" style={{overflowY: 'auto', maxHeight:'450px', borderTop:''}}>
                  <div className="d-flex justify-content-between" style={{paddingLeft:'0.5rem', borderBottom:'solid 1px #dee2e6', marginBottom:'0.5rem'}}>
                    <h4 style={{fontSize:'17px'}}>{cartInfo.length} NFT{cartInfo.length != 1 ? 's':''}</h4>
                    <h4 style={{fontSize:'14px', color:'grey', cursor:'pointer'}} onClick={removeAllItem}>clear all</h4>
                  </div>
                  {
                    cartInfo && cartInfo.length > 0 ?
                      cartInfo.map((data, index) => (
                          <div className="border-top-0" key={index} style = {{marginBottom:'0.3rem'}}>
                            <RowDiv className="item_author justify-content-between" style={{alignItems:'center'}}>
                              <div className="d-flex" style={{cursor:'pointer', alignItems:'center', width:'70%', overflow:'hidden'}} onClick={(e) => goDetailPage(e, data.asset.id)}>
                                <RowAvatar className="author_list_pp">
                                  <span>
                                    <LazyLoadImage effect="opacity" className="lazy" src={data.asset.image ? data.asset.image : defaultAvatar} alt="" />
                                  </span>
                                </RowAvatar>
                                <RowInfo className="author_list_info" style={{  paddingTop: 0, lineHeight: 1.2, display:'flex', alignItems:'center', width:'80%'}}>
                                  <div style={{width:'100%'}}>
                                    <h5 style={{margin:'0', fontSize:'15px', marginBottom:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{data.asset.name}</h5>
                                    <p style={{fontSize:'13px', color:'#727272', marginBottom:'0px', marginTop:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                                      {
                                        `${data.collection.name}`
                                      }
                                    </p>
                                    {(data.asset && data.asset.royalty_fee && data.asset.royalty_fee > 0) ? <p style={{fontSize:'13px', color:'#727272', marginBottom:'0px', marginTop:'4px'}}>royalty: {data.asset.royalty_fee} %</p> : <></>}
                                    {(data.asset && data.asset.royalty_fee && data.asset.royalty_fee > 0) ? <></> : (data.collection && data.collection.royalty_fee && data.collection.royalty_fee > 0) ? <p style={{fontSize:'13px', color:'#727272', marginBottom:'0px', marginTop:'4px'}}>royalty: {data.collection.royalty_fee} %</p> : <></>}
                                  </div>
                                </RowInfo>
                              </div>
                              <div style={{display:'flex', justifyContent:'space-between', width:'30%', alignItems:'center'}}>
                                <DescriptionDiv><h5 style={{fontSize:'13.5px', marginBottom:'0px'}}><img style={{ width: 16, height: 16, marginBottom: 5 ,marginLeft: 0 }} src={ethOption? ethIcon:vxlCurrency} />
                                  {
                                    !ethOption?
                                    ` ${formatUsdPrice(data.asset.price / usdPrice)}`
                                    :
                                    ` ${formatEthPrice(data.asset.price / ethPrice)}`
                                  }
                                </h5><h5 style={{fontSize:'13.5px'}}>&nbsp;$&nbsp;{formatUSD(data.asset.price)}</h5></DescriptionDiv>
                                <div style={{display:'flex', alignItems:'center', marginBottom:'4px'}}>
                                  <button className={colormodesettle.ColorMode?"btn-close removeItem":"btn-close btn-close-white removeItem"} style={{width:'0.3rem !important', height:'0.3rem !important'}} onClick={() => removeFromCart(data.asset.id)}/>
                                </div>
                              </div>
                            </RowDiv>
                          </div>))
                        :<NoDataDiv>No NFTs</NoDataDiv>
                  }
                </div>
                <div style={{marginLeft:'1rem', marginRight:'1rem', borderBottom:'solid 1px #dee2e6'}}></div>
                <div className="toatlValueStyle" style={{borderRadius:'5px', margin:'0.5rem 1rem 0 1rem', padding:'0.5rem 0.5rem 0 0.5rem', display:'flex', justifyContent:'space-between'}}>
                  <h4>Total</h4>
                  <h4><img style={{ width: 23, height: 23, marginBottom: 5 ,marginLeft: 0 }} src={ethOption? ethIcon:vxlCurrency} />
                  {
                    !ethOption?
                    ` ${(totalCartPrice && usdPrice) ? formatUsdPrice(totalCartPrice / usdPrice):0} ($ ${formatUsdPrice(totalCartPrice)})`
                    :
                    ` ${(totalCartPrice && ethPrice) ? formatEthPrice(totalCartPrice / ethPrice):0} ($ ${formatUsdPrice(totalCartPrice)})`
                  }
                  </h4>
                </div>
                <div style={{margin:'0.5rem 1rem 0 1rem', padding:'0.5rem 0.5rem 0 0.5rem'}}>
                  <Checkbox onChange={handleTermsCheck} checked = {isAgreeWithTerms}>By checking this box, I agree to SuperKluster's <span style={{ fontWeight: 'bold', color: 'rgb(247 13 255)' }} onClick={moveToServicePage}>Terms of Service</span></Checkbox>
                  <Checkbox style={{marginLeft:'0px'}} checked={ethOption} onClick={handleEthOption}>Check this box to pay with your<b> Ethereum balance**</b></Checkbox>
                </div>
                <div style={{margin:'0 1rem', paddingBottom:'0.5rem', paddingTop:'0.5rem'}}>
                  {
                    isShowBtnState ?
                    <ModalBtn onClick={handleBatchBuy} style={{width:'100%'}} disabled = {(!cartInfo || cartInfo.length == 0 || !isAgreeWithTerms)? true:false}>Check out</ModalBtn>
                    : <ModalBtn onClick={handleApproveAction} style={{width:'100%'}} disabled = {(!cartInfo || cartInfo.length == 0 || !isAgreeWithTerms)? true:false}>Approve</ModalBtn>
                  }
                  <div style={{textAlign:'left'}}>
                    <PTag className='NorTxt' style={{marginLeft:'5px', marginTop:'10px' ,  fontSize:'12px'}}>*This transaction will include the SuperKluster 1.5% transaction fee</PTag>
                    <PTag className='NorTxt' style={{marginLeft:'5px' ,  fontSize:'12px'}}>**You will be paying for gas fee to swap $ETH to $VXL into your wallet.</PTag>
                  </div>
                </div>
              </Spin>
            </div>
          </div>
        </div>
    </>);
}

export default memo(Cart);