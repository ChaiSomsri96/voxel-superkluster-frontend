import React, { useEffect } from "react";
import { useNavigate } from "@reach/router";
import styled from "styled-components";
import useMetaMask from "./../components/wallet-connect/metamask";
import "./../assets/stylesheets/Wallet/index.scss";
import { walletList } from "./../components/constants"
import WalletCard from "./../components/wallet/WalletCard";

const Container = styled.div`
  background-color: ${props => props.theme.primBgColor};
  padding-top: 100px;
`

const WalletPage = () => {

  const { connect, shouldDisable, Coinbase_connect, binance_connect, bitkeep_connect, walletConnect_connect } = useMetaMask();

  const navigate = useNavigate();
  const moveToEditPage = () => {
    navigate(-1);
  }

  useEffect(()=>{
    localStorage.setItem('searchValue','');
  },[]);

  useEffect(() => {
    const timerID = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken');
      if(accessToken && accessToken != 'null') moveToEditPage();
    }, 1000);
    return () => clearInterval(timerID);
  }, []);

  const walletAppClick = (type) => {
    if(type == 0) {
      connect().then();
    }
    else if(type == 1) {
      walletConnect_connect().then();
    }
    else if(type == 2) {
      Coinbase_connect();
    }
    else if(type == 3) {
      binance_connect().then();
    }
    else if(type == 4) {
      bitkeep_connect().then(moveToEditPage);
    }
  }

  return (
    <>
      <Container className="main-container">
        <section className="wallet-banner label-center">
          <div className='banner-label'>
            Wallet
          </div>
        </section>
        <div className="wallet-choice">
          {
            walletList && walletList.length > 0 ?
              walletList.map((item, index) => (
                <WalletCard key={index} item={item} onClick={() => walletAppClick(index)} />
              ))
            : 
            null
          }
        </div>
      </Container>
    </>
  );
}

export default WalletPage;