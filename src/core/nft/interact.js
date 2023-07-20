import { pinJSONToIPFS } from "./pinata.js";
import { Axios } from "../axios";
import Web3 from 'web3';
import Swal from 'sweetalert2';
import { ethers, BigNumber } from 'ethers';
import 'sweetalert2/src/sweetalert2.scss'
require("dotenv").config();
const contractABI = require("./abis/Voxel.json");
const VoxelTokenABI = require("./abis/Voxel.json");
const VoxelxCollectionABI = require("./abis/VoxelxCollection.json");
const Extenal721CollectionABI = require("./abis/Extenal721contract.json") ;
const Extenal1155CollectionABI = require("./abis/External1155contract.json") ;
const SKMarketPlaceABI = require("./abis/SKMarketPlace.json");
const tokenAddress = '0x69a0C61Df0ea2d481696D337A09A3e2421a06051';
const contractAddress = '0x04ee3A27D77AB9920e87dDc0A87e90144F6a278C';
const alchemyRPCProvider = 'https://eth-goerli.g.alchemy.com/v2/VmUYTX6cCOriZUksvlrrHpaxQPivUyBE';

export async function connectWallet() {
  if (!window.ethereum) {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }

  try {
    const addressArray = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    return {
      status: "Metamask successfully connected.",
      address: addressArray[0],
    };
  } catch (err) {
    return {
      address: "",
      status: `Something went wrong: ${err.message}`,
    };
  }
}

export async function getCurrentWalletConnected() {
  if (!window.ethereum) {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }

  try {
    const addressArray = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (addressArray.length > 0) {
      return {
        status: "Fill in the text-field above.",
        address: addressArray[0],
      };
    } else {
      return {
        address: "",
        status: "🦊 Connect to Metamask using the top right button.",
      };
    }
  } catch (err) {
    return {
      address: "",
      status: `Something went wrong: ${err.message}`,
    };
  }
}

export const mintNFT = async (url, name, description) => {
  if (!url.trim() || !name.trim() || !description.trim()) {
    return {
      success: false,
      status: 'Please make sure all fields are completed before minting.',
    };
  }

  const metadata = {
    name,
    image: url,
    description,
  };

  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
    return {
      success: false,
      status: 'Something went wrong while uploading your tokenURI.',
    };
  }

  const tokenURI = pinataResponse.pinataUrl;
  const contract = new Web3.eth.Contract(contractABI, contractAddress); 
  try {
    const from = window.ethereum.selectedAddress;
    const encodedABI = contract.methods.mintNFT(from, tokenURI).encodeABI();

    const transactionParameters = {
      to: contractAddress,
      from,
      data: encodedABI,
    };
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });
    return {
      success: true,
      status:
        'Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/' +
        txHash,
    };
  }
  catch (error) {
    return {
      success: false,
      status: 'Something went wrong: ' + error.message,
    };
  }
}

export const addWalletListener = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.on({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Metamask successfuly connected.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: `Something went wrong: ${err.message}`,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const signWallet = async (account, library) => {
  try {
    if(!library) library = getMetamaskLibrary();
    const web3 = new Web3(library.provider)
    
    const response = await Axios({
      url: `/api/users/connect?public_address=${account}`,
    });

    if (response.data.nonce != null || response.data.nonce != undefined) {
      const nonce = response.data.nonce;
      const message = `Welcome to SuperKluster by Voxel X Network!
This request will not trigger a blockchain transaction or cost any gas fees.
Your authentication status will reset after 24 hours.
Wallet address:${account}
Nonce:${nonce}`;
      
      const signature = await web3.eth.personal.sign(message, account);

      if (signature) {
        const { data } = await Axios.post('/api/auth', {
          public_address: account,
          signature,
        });

        if (data) {
          const accessToken = data.accessToken;
          return accessToken;
        }
      }  
    }
  }
  catch (error) {
    console.error(error);
  }

  return null;
}

/**
 * Switches to Goerli testnet if connected to Ethereum network.
 * If not connected to any network, it prompts to install MetaMask.
 * @param {string} wallet Wallet name, defaults to 'metamask'.
 */
export const handleGoerliChainSwitch = async (wallet = 'metamask') => {
  // Check if connected to an Ethereum network
  if (window.ethereum) {
    try {
      // Switches network chain to Goerli
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }], // chainId must be in hexadecimal numbers
      });
    } catch (error) {
      // If Goerli network is not listed, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x5',
                rpcUrl: `https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.error(error);
    }
  } else {
    // If not connected, prompt user to install MetaMask
    if(wallet !== 'metamask') return;

    Swal.fire({
      title: 'Oops...',
      text: 'MetaMask is not installed. Please consider installing it',
      icon: 'error',
      confirmButtonText: 'Close',
      timer: 5000,
      customClass: 'swal-height'
    }).then(({value}) => {
      window.open(`https://metamask.io/download.html`, '_blank', );
    })
  }
}

export const handleSwitchChain = async (library) => {
  if (!library) {
    return false;
  }
  try {
    await library.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getBalance = async (account, library) => {

  try {
    if (!library) {
      library = getMetamaskLibrary();
    }

    const web3 = new Web3(new Web3.providers.HttpProvider(alchemyRPCProvider));
    const contract = new web3.eth.Contract(VoxelTokenABI, tokenAddress);

    const balance = await contract.methods.balanceOf(account).call();
    const decimals = await contract.methods.decimals().call();
    
    const result = balance / Math.pow(10, decimals);
    return result.toString();
  }
  catch(error) {
    console.error("error======>", error);
    return "0";
  }
};

export const getBalanceLive = async (account) => {
  if (!window.ethereum) {
    throw new Error("No Ethereum provider found.");
  }

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(VoxelTokenABI, tokenAddress);
  const balance = await contract.methods.balanceOf(account).call();
  const decimals = await contract.methods.decimals().call();
  const result = balance / Math.pow(10, decimals);

  return result.toString();
};

export const getNetwork = async () => {
  if (window.ethereum) {
    const chainId = window.ethereum.networkVersion;
    return chainId;
  }
}

export const getListAction = async (param, data, rowData, datas, library) => {
  if(!library) library = getMetamaskLibrary();
  
  const [ , owner, chainType ] = param;
  
  const web3 = new Web3(library.provider);

  const operator = contractAddress;

  let res = { status: true, txHash: '' };

  const collectionContract = datas.is_voxel ? datas.contract_address : datas.collection.contract_address;

  const contract = new web3.eth.Contract(VoxelxCollectionABI, collectionContract);

  if (chainType === "onChain") {
    let isOperator = await contract.methods.isApprovedForAll(owner, operator).call();  
    
    if (!isOperator) {
      const tx = await contract.methods.setApprovalForAll(operator, true).send({ from: owner });
      
      // Changing the value of the res variable according to the result of the transaction.
      res = {
        status: tx.status,
        txHash: tx.transactionHash
      };  
    }
  }

  return res;
}

export const getApprove = async (account, library, buyPrice = 0) => {
  if(!library) library = getMetamaskLibrary();
  const web3 = new Web3(library.provider);

  const operator = contractAddress;
  const VXLTokenContract = new web3.eth.Contract(VoxelTokenABI, tokenAddress);
  const allowance = await VXLTokenContract.methods.allowance(account, operator).call();

  const price = Web3.utils.toWei(buyPrice.toString(), 'ether');
  const maxApprovalAmount = web3.utils.toBN('115792089237316195423570985008687907853269984665640564039457584007913129639935');

  if (web3.utils.toBN(allowance).gte(web3.utils.toBN(price))) {
    return true;
  }

 // const approvalTx = await VXLTokenContract.methods.approve(operator, Web3.utils.toBN(-1)).send({ from: account, gas: '800000' });

 const approvalTx = await VXLTokenContract.methods
    .approve(operator, maxApprovalAmount)
    .send({ from: account, gas: '800000' });

  return approvalTx && approvalTx.status === true;
}

export const isApproved = async (acc, library) => {
  const web3 = new Web3(new Web3.providers.HttpProvider('https://polygon-mumbai-infura.wallet.coinbase.com/?targetName=infura-goerli'));
  const operator = contractAddress;
  const VXLTokenContract =  new web3.eth.Contract(VoxelTokenABI, tokenAddress);
  const allowance = await VXLTokenContract.methods.allowance(acc, operator).call();

  return allowance > 0;
}

export const getBuyAction = async (ethOption, library, account, datas, creator, price, quantity, royaltyAmount, deadline, signature, shouldMint, tokenURI, mintQty, collectionAddr = null, seller = null) => {
  if(!library) library = getMetamaskLibrary();
  const web3 = new Web3(library.provider);
  
  const operator = contractAddress;

  const marketContract = new web3.eth.Contract(SKMarketPlaceABI, operator);  

  let _price = BigNumber.from(price.hex).mul(quantity);
  let collectionContract = datas.is_voxel ? datas.contract_address : datas.collection.contract_address;

  if(collectionAddr) {
    collectionContract = collectionAddr;
  }
  if(!datas.royalty_address || datas.royalty_address === '') {
    datas.royalty_address = ethers.constants.AddressZero;
  }

  if(seller) {
    datas.owner_of = seller;
  }

  let buyNft;
  if(!ethOption) {
    buyNft = await marketContract.methods.buyItem(
      collectionContract, 
      datas.owner_of, 
      creator, 
      datas.token_id, 
      quantity, 
      price, 
      royaltyAmount, 
      mintQty, 
      tokenURI, 
      shouldMint, 
      deadline, 
      signature
    ).send({ from: account,  gas: '800000' });
  } else {
    buyNft = await marketContract.methods.buyItemWithETH(
      collectionContract, 
      datas.owner_of, 
      creator, 
      datas.token_id, 
      quantity, 
      price, 
      royaltyAmount, 
      mintQty, 
      tokenURI, 
      shouldMint, 
      deadline, 
      signature
    ).send({ from: account,  gas: '800000', value: _price.toString() });
  }

  return buyNft && buyNft.status ? buyNft.transactionHash : '0x0';
}

export const getBuyAction_buyer_auction = async (ethOption, library, account, datas, creator, price, royaltyAmount, deadline, signature, shouldMint, tokenURI, mintQty) => {
  if(!library) library = getMetamaskLibrary();

  const quantity = 1;
  const web3 = new Web3(library.provider);

  const marketContract = new web3.eth.Contract(SKMarketPlaceABI, contractAddress);
  
  const _price = ethers.utils.parseUnits(price, 'ether').mul(quantity);

  const collectionContract = datas.is_voxel ? datas.contract_address : datas.collection.contract_address;
  
  //const royalty_address = datas.royalty_address || ethers.constants.AddressZero;

  const buyNft = ethOption
    ? await marketContract.methods.buyItemWithETH(collectionContract, datas.owner_of, creator, datas.token_id, quantity, price, royaltyAmount, mintQty, tokenURI, shouldMint, deadline, signature)
        .send({ from: account, gas: 800000, value: _price })
    : await marketContract.methods.buyItem(collectionContract, datas.owner_of, creator, datas.token_id, quantity, price, royaltyAmount, mintQty, tokenURI, shouldMint, deadline, signature)
        .send({ from: account, gas: 800000 });

  return buyNft.status ? buyNft.transactionHash : '0x0';  
}

export async function getAcceptAction(library, account, datas , token_id , datas_voxel, signedData) {
  if(!library) library = getMetamaskLibrary();

  const web3 = new Web3(library.provider);
  const operator = contractAddress;

  const marketContract = new web3.eth.Contract(SKMarketPlaceABI, operator);
  let collectionContract = signedData._collection;

  if(!datas_voxel.royalty_address) {
    datas_voxel.royalty_address = ethers.constants.AddressZero;
  }

  const buyNft = await marketContract.methods.acceptItem(
    collectionContract,
    datas.bidder.address,
    signedData.creator,
    token_id,
    signedData._quantity,
    signedData._price,
    signedData._royaltyAmount,
    signedData.mintQty,
    signedData.tokenURI,
    signedData.shouldMint,
    signedData._deadline,
    signedData.signature
  ).send({ from: account,  gas: '800000' });  

  return (buyNft && buyNft.status == true) ? buyNft.transactionHash : "0x0";
}

export const signMessage = async (param, library) => {
  if(!library) library = getMetamaskLibrary();
  const account = localStorage.getItem('account');
  
  let message;
  let toDateMsg = '';
  let auctionMsg = '';
  let sDate, eDate;
  
  if (param.type === "fixed") {
    if(param.toDate) {
      toDateMsg = `End Date:${param.toDate}`;  
    }

    message = `Wallet address:${account} TokenId:${param.tokenId} Price:${param.price} ${toDateMsg}`;
  }
  
  if (param.type === "auction") {
    // sDate = Math.round(new Date(param.auction_start_date).getTime() / 1000);
    // eDate = Math.round(new Date(param.auction_end_date).getTime() / 1000);
    
    auctionMsg = `StartPrice:${param.price} Auction Start Date:${param.auction_start_date} Auction End Date:${param.auction_end_date} Method:${param.method}`;
    
    message = `Wallet address:${account} TokenId:${param.tokenId} ${auctionMsg}`;
  }
  
  const signature = await library.provider.request({
    method: "personal_sign",
    params: [message, account]
  });

  if (signature) {
    return signature
  }
}

export const transferItem = async (
  library,
  from,
  to,
  tokenId,
  supply,
  collectionAddr,
  chainId,
  is721
) => {

  if(!library) library = getMetamaskLibrary();

  const web3 = new Web3(library.provider);

  if (!collectionAddr) return "0x0";

  const collectionContract = new web3.eth.Contract(
    is721 ? Extenal721CollectionABI : Extenal1155CollectionABI,
    collectionAddr
  );

  let transferNft;
  if(is721) {
    transferNft = await collectionContract.methods.transferFrom(from, to, tokenId).send({ from: from,  gas: '800000' });
  }
  else {
    transferNft = await collectionContract.methods.safeTransferFrom(from, to, tokenId, supply, '0x0').send({from: from, gas: '800000'});
  }

  return transferNft.status ? transferNft.transactionHash : "0x0";
};

export const getMetamaskLibrary = () => {
  let provider;
  if(window.ethereum.providers) {
    provider = window.ethereum.providers.find(provider => provider.isMetaMask && !provider.isBitKeep);
  } else {
    provider = window.ethereum;
  }
  const data = {
    provider : provider
  };
  return data;
}

export const getRoyalties = async (account, library) => {
  if(!library) library = getMetamaskLibrary();

  const web3 = new Web3(new Web3.providers.HttpProvider('https://polygon-mumbai-infura.wallet.coinbase.com/?targetName=infura-goerli'));

  const operator = contractAddress;
  const marketContract = new web3.eth.Contract(SKMarketPlaceABI, operator);
  
  const royalties = await marketContract.methods.getClaimRoyalty().call({ from: account });

  const royaltiesVXL = ethers.utils.formatEther(BigNumber.from(royalties[0]));
  const royaltiesETH = ethers.utils.formatEther(BigNumber.from(royalties[1]));
  
  return { royalty_vxl: royaltiesVXL, royalty_eth: royaltiesETH };
}

export const claimRoyalties = async (account, library) => {
  if(!library) library = getMetamaskLibrary();

  const web3 = new Web3(library.provider);
  
  const marketContract = new web3.eth.Contract(SKMarketPlaceABI, contractAddress);
  await marketContract.methods.claimRoyalty(account).send({ from: account, gas: '800000' });
}

export const batchTransfer = async (library, itemList, collections,
  pinkAddr, 
  greenAddr, 
  blueAddr, 
  orangeAddr, 
  aquaAddr, 
  dredAddr, 
  oliveAddr, 
  dgrayAddr,
  dgreenAddr,
  mpurpleAddr, 
  account) => {
  try {
    if(!library) library = getMetamaskLibrary();
    const web3 = new Web3(library.provider);
    const operator = contractAddress;

    const marketContract = new web3.eth.Contract(SKMarketPlaceABI, operator);

    const receivers = {
      pink: { receiver: pinkAddr, collections: [] },
      blue: { receiver: blueAddr, collections: [] },
      green: { receiver: greenAddr, collections: [] },
      orange: { receiver: orangeAddr, collections: [] },
      aqua: { receiver: aquaAddr, collections: [] },
      dred: { receiver: dredAddr, collections: [] },
      olive: { receiver: oliveAddr, collections: [] },
      dgray: { receiver: dgrayAddr, collections: [] },
      dgreen: { receiver: dgreenAddr, collections: [] },
      mpurple: { receiver: mpurpleAddr, collections: [] }
    };

    for (let i = 0; i < itemList.length; i ++) {
      const collectionInfo = {
        collection: itemList[i][2],
        batch: itemList[i][3],
        tokenIds: [itemList[i][1]],
        quantities: [1]
      };
      
      if (itemList[i][5] in receivers) {
        receivers[itemList[i][5]].collections.push(collectionInfo);
      }
    }

    const callData = Object.values(receivers).filter(receiver => receiver.collections.length > 0);
    
    const batchTransfer = await marketContract.methods.bundleTransfer(callData).send({ from: account,  gas: '800000' });
    return batchTransfer.transactionHash;
  } catch (e) {
    if (e.code == 4001) return '4001';
    return '0x0';
  }
}

export const isApprovedForBatchTransfer = async (library, collections, account) => {
  if(!library) library = getMetamaskLibrary();
  const web3 = new Web3(library.provider);
  const operator = contractAddress;
  
  for (let i = 0 ; i < collections.length; i ++) {
    const contract = new web3.eth.Contract(VoxelxCollectionABI, collections[i]);
    const isOperator = await contract.methods.isApprovedForAll(account, operator).call();
    if(isOperator) continue;
    return false;
  }
  return true;
}

export const approveForBatchTransfer = async (library, collections, account) => {
  if (!library) library = getMetamaskLibrary();
  const web3 = new Web3(library.provider);
  
  for (let i = 0; i < collections.length; i++) {
    const contract = new web3.eth.Contract(VoxelxCollectionABI, collections[i]);
    const isOperator = await contract.methods.isApprovedForAll(account, contractAddress).call();
    if (isOperator) continue;
    await contract.methods.setApprovalForAll(contractAddress, true).send({ from: account });
  }
}

export const setReveal = async (library, collectionAddr, revealUrl, signedData, account) => {
  if (!library) library = getMetamaskLibrary();
  const web3 = new Web3(library.provider);
  const marketContract = new web3.eth.Contract(SKMarketPlaceABI, contractAddress);
  const setRevealTx = await marketContract.methods.setReveal(collectionAddr, revealUrl, signedData.deadline, signedData.signature).send({ from: account, gas: '800000' });
  return setRevealTx.transactionHash;
}

export const buyCart = async (ethOption, library, sellers, cartPrice, payload, deadline, signature, account) => {
  if (!library) {
    library = getMetamaskLibrary();
  }

  const web3 = new Web3(library.provider);
  const marketContract = new web3.eth.Contract(SKMarketPlaceABI, contractAddress);

  const formattedSellers = sellers.map(seller => {
    return {
      ...seller,
      price: BigNumber.from(seller.price.hex).toString()
    }
  });
  
  const formattedCartPrice = BigNumber.from(cartPrice.hex);
  const buyCartFunction = ethOption ? marketContract.methods.buyCartWithETH : marketContract.methods.buyCart; 

  const buyCart = await buyCartFunction(formattedSellers, formattedCartPrice.toString(), payload, deadline, signature)
    .send({
      from: account,
      gas: '800000',
      value: ethOption ? formattedCartPrice.toString() : null
    });

  return buyCart.transactionHash;
}