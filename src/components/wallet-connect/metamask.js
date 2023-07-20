import React, { useState, useEffect, useMemo, useCallback, useContext, createContext } from "react";
import { useDispatch } from 'react-redux';
import { connectors } from "./connectors";
import Swal from 'sweetalert2';


import { useWeb3React } from "@web3-react/core";
import { handleSwitchChain } from "../../core/nft/interact";
import { signWallet } from "../../core/nft/interact";
import { saveAccessToken, saveAuthorAccount } from '../../store/actions';

export const MetaMaskContext = createContext(null);

export const MetaMaskProvider = ({ children }) => {
  const { activate, account, active, deactivate, library, chainId } = useWeb3React();
  const dispatch = useDispatch();

  const [isActive, setIsActive] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask

  const [isLoading, setIsLoading] = useState(true);

  // Check when App is Connected or Disconnected to MetaMask
  const handleIsActive = useCallback(() => {
    // console.log("App is connected with MetaMask ", active);
    setIsActive(active);
  }, [active]);
  
  useEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  useEffect(() => {
    const getAccessToken = async (acc, lib) => {
      const accessToken = await signWallet(acc, lib) ;
      if(!accessToken) {
        localStorage.setItem("provider", undefined);
        return;
      }
      localStorage.setItem('accessToken', accessToken)
      handleAccessToken(accessToken)
    }
    const token = localStorage.getItem('accessToken');
    if (account && library && !token) {
      if(chainId != 5) {
        handleSwitchChain(library).then((res) => {
          // if(res == false) return;
          // setShouldDisable(true);
          // localStorage.setItem('account', account);
          // getAccessToken(account, library).then(() => {
          //   setShouldDisable(false);
          // })
        })
    } else {
      setShouldDisable(true);
      localStorage.setItem('account', account);
      handleAuthorAccount(account);

      getAccessToken(account, library).then(() => {
        setShouldDisable(false);
      })
    }
      
    }

    // const timer = setTimeout(() => {
    //   console.log('ac', active)
    //   if (!active) {
    //     localStorage.removeItem('accessToken');
    //     localStorage.removeItem('account');
    //   }
    // }, 2000);
    // return () => clearTimeout(timer);
  }, [account, library, active])

  const handleAccessToken = useCallback((value) => {
      dispatch(saveAccessToken(value));
  }, [dispatch]);

  const handleAuthorAccount = useCallback((value) => {
      dispatch(saveAuthorAccount(value));
  }, [dispatch]);

  // Connect to MetaMask wallet
  const connect = async () => {
    setShouldDisable(true);
    try {
      let provider = window.ethereum;
      let isMetamask = false;
      if(!window.ethereum.providers) isMetamask = (window.ethereum.isMetaMask && !window.ethereum.isBitKeep);
      if(window.ethereum.providers) {
        provider = window.ethereum.providers.find(provider => provider.isMetaMask && !provider.isBitKeep);
        if(provider) isMetamask = true;
      }
      if(!isMetamask) {
        Swal.fire({
          title: 'Oops...',
          text: 'Metamask is not installed. Please consider installing it',
          icon: 'error',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        }).then(({value}) => {
          // window.location.href = 'https://metamask.io/download.html';
          window.open(`https://metamask.io/download/`, '_blank', );
        })
        setShouldDisable(false);
        return;
      }
      localStorage.setItem("provider", 'injected');
      const res = await provider.request({
        method: "eth_requestAccounts",
        params: [],
      });
  
      let data = {};
      data.provider = provider;
  
      const accessToken = await signWallet(res[0], data) ;
      if(!accessToken) {
        localStorage.setItem("provider", undefined);
        return;
      }
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('account', res[0]);
      
      handleAccessToken(accessToken)
      handleAuthorAccount(res[0])

      setShouldDisable(false);
      return;
    } catch (e) {
      setShouldDisable(false);
    }
  };

  const walletConnect_connect = async () => {
    setShouldDisable(true);
    try {
      await activate(connectors.walletConnect).then(async() => {
        localStorage.setItem("provider", 'walletConnect');
        setShouldDisable(false);
      })
    } catch (e) {
      console.log('wallet connection error: ', e);
    }
  };

  const binance_connect = async () => {
    setShouldDisable(true);
    try {
      activate(connectors.binanceWallet).then((res, error) => {
      // console.log("conneted");
        if(!window.ethereum) {
          Swal.fire({
            title: 'Oops...',
            text: 'Binance Wallet is not installed. Please consider installing it',
            icon: 'error',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
          }).then(({value}) => {
            // window.location.href = 'https://metamask.io/download.html';
            window.open(`https://www.bnbchain.org/en/binance-wallet`, '_blank', );
          })
          return;
        }
        localStorage.setItem("provider", 'binanceWallet');
        setShouldDisable(false);
      })
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  };

  const Coinbase_connect = async () => {
    setShouldDisable(true);
    try {
      await activate(connectors.coinbaseWallet).then(() => {
        localStorage.setItem("provider", 'coinbaseWallet');
        setShouldDisable(false);
      })
    } catch (e) {
      console.log("Coinbase connection error: ", e);
    }
  };

  const bitkeep_connect = async () => {
    const isBitKeepInstalled = window.isBitKeep && window.bitkeep.ethereum;
    if(!isBitKeepInstalled) {
      Swal.fire({
        title: 'Oops...',
        text: 'Bitkeep is not installed. Please consider installing it',
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      }).then(({value}) => {
        // window.location.href = 'https://metamask.io/download.html';
        window.open(`https://bitkeep.com/en/download?type=2`, '_blank', );
      })
    } else {
      try {
        await activate(connectors.bitkeep).then(() => {
          // console.log("conneted");
            localStorage.setItem("provider", 'bitkeep');
            setShouldDisable(false);
          });
        } catch (error) {
          // console.log("Error on connecting: ", error);
        }
    }
  }

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if(provider == 'injected') return;
    const accessToken = localStorage.getItem("accessToken");
    if (provider && accessToken) activate(connectors[provider]);
  }, []);

  // Disconnect from Metamask wallet
  const disconnect = async () => {
    // console.log("Disconnecting wallet from App...");
    try {
      localStorage.setItem("provider", undefined);
      await deactivate();
    } catch (error) {
      // console.log("Error on disconnnect: ", error);
    }
  };

  const values = useMemo(
    () => ({
      isActive,
      account,
      connect,
      Coinbase_connect,
      binance_connect,
      bitkeep_connect,
      walletConnect_connect,
      isLoading,
      disconnect,
      library,
      shouldDisable,
    }),
    [isActive, isLoading, shouldDisable, account]
  );

  return (
    <MetaMaskContext.Provider value={values}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export default function useMetaMask() {
  const context = useContext(MetaMaskContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
}
