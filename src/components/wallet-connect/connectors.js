import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { BscConnector } from '@binance-chain/bsc-connector' ;
import { BitKeepConnector } from "./bitkeepConnector";

const injected = new InjectedConnector({
    supportedChainIds: [1, 2, 3, 4, 5]
});
  
const walletconnect = new WalletConnectConnector({
    rpcUrl: `https://polygon-mumbai-infura.wallet.coinbase.com/?targetName=infura-goerli`,
    // rpc:  {
    //     1: `https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7`,
    //     5: `https://rpc.goerli.mudit.blog/`
    // },
    bridge: "https://bridge.walletconnect.org",
    infuraId: '9aa3d95b3bc440fa88ea12eaa4456161',
    qrcode: true,
    pollingInterval:8000
});
  
const walletlink = new WalletLinkConnector({
    url: `https://polygon-mumbai-infura.wallet.coinbase.com/?targetName=infura-goerli`,
    appName: "web3-react-demo"
});

const BinanceWallet = new BscConnector({
    supportedChainIds: [1, 2, 3, 4, 5, 56] ,
}) ;
const Bitkeep = new BitKeepConnector({
    supportedChainIds: [1, 3, 4, 5, 42],
});

export const connectors = {
    injected: injected,
    walletConnect: walletconnect,
    coinbaseWallet: walletlink,
    binanceWallet: BinanceWallet,
    bitkeep: Bitkeep
};