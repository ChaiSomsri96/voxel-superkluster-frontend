import React, { useEffect, useCallback } from "react";
import useMetaMask from "./wallet-connect/metamask";
import { useNavigate } from "@reach/router";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from 'react-redux';
import { saveAccessToken } from './../store/actions';

import metamaskImg from "./../assets/image/wallet/1.png";
import walletConnectImg from "./../assets/image/wallet/4.png";
import coinbaseImg from "./../assets/image/wallet/5.png";
import binanceImg from "./../assets/image/wallet/6.png";
import bitKeepImg from "./../assets/image/wallet/2.png";

// import Coinbase_connect from
const Wallet = () => {
  const dispatch = useDispatch();
  const { connect, shouldDisable, Coinbase_connect, binance_connect, bitkeep_connect, walletConnect_connect } = useMetaMask();
  const {account, active, library } = useWeb3React();


  // useEffect(() => {
  //   const token = localStorage.getItem('accessToken');
  //   console.log('ok');
  //   console.log('account: ', account);
  //   console.log('library: ', library);
  //   console.log('token: ', token);
  //   const getAccessToken = async (acc, lib) => {
  //     const accessToken = await signWallet(acc, lib) ;
  //     localStorage.setItem('accessToken', accessToken)
  //     handleAccessToken(accessToken)
  //   }
  //   if (account && library && (!token || token != 'null')) {
  //     localStorage.setItem('account', account);
  //     getAccessToken(account, library);
  //   }

  //   // const timer = setTimeout(() => {
  //   //   console.log('ac', active)
  //   //   if (!active) {
  //   //     localStorage.removeItem('accessToken');
  //   //     localStorage.removeItem('account');
  //   //   }
  //   // }, 2000);
  //   // return () => clearTimeout(timer);
  // }, [account, library, active])
  // const { Coinbase_connect, shouldDisable } = useMetaMask();
  const navigate = useNavigate();
  const moveToEditPage = () => {
    navigate(-1);
  }

  useEffect(() => {
    const timerID = setInterval(() => {
      const accessToken = localStorage.getItem('accessToken');
      if(accessToken && accessToken != 'null') moveToEditPage();
    }, 1000);
    return () => clearInterval(timerID);
  }, [])

  return (
    <div className="row">
      <div className="col-lg-3 mb30" onClick={() => connect().then()} disabled={shouldDisable} style={{ cursor: 'pointer' }}>
        <span className="box-url">
          <span className="box-url-label">Most Popular</span>
          <img src={metamaskImg} alt="" className="mb20" />
          <h4>Metamask</h4>
          <p>
            Start exploring blockchain applications in seconds. Trusted by over
            1 million users worldwide.
          </p>
        </span>
      </div>

      <div className="col-lg-3 mb30" onClick={() =>walletConnect_connect().then()} disabled={shouldDisable} style={{ cursor: 'pointer' }}>
        <span className="box-url">
          <img src={walletConnectImg} alt="" className="mb20" />
          <h4>WalletConnect</h4>
          <p>
            Open source protocol for connecting decentralised applications to
            mobile wallets.
          </p>
        </span>
      </div>

      <div className="col-lg-3 mb30" onClick={() =>Coinbase_connect()} disabled={shouldDisable} style={{ cursor: 'pointer' }}>
        <span className="box-url">
          <img src={coinbaseImg} alt="" className="mb20" />
          <h4>Coinbase Wallet</h4>
          <p>
            The easiest and most secure crypto wallet. ... No Coinbase account
            required.
          </p>
        </span>
      </div>

      <div className="col-lg-3 mb30" onClick={() =>binance_connect().then()} disabled={shouldDisable} style={{ cursor: 'pointer' }}>
        <span className="box-url">
          <img src={binanceImg} alt="" className="mb20" width={70} height = {70} />
          <h4>Binance</h4>
          <p>
            Make it easy to create blockchain applications with secure wallets
            solutions.
          </p>
        </span>
      </div>

      <div className="col-lg-3 mb30" onClick={() =>bitkeep_connect().then(moveToEditPage)} disabled={shouldDisable} style={{ cursor: 'pointer' }}>
        <span className="box-url">
          <img src={bitKeepImg} alt="" className="mb20" width={70} height = {70} />
          <h4>Bitkeep</h4>
          <p>
            Make it easy to create blockchain applications with secure wallets
            solutions.
          </p>
        </span>
      </div>
    </div>
  );
};
export default Wallet;
