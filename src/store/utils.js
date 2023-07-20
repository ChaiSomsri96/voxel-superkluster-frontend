import goerliIcon from "../assets/image/blockchain/goerli.png";
import ethIcon from "../assets/image/blockchain/ethereum.png";
import polygonIcon from "../assets/image/blockchain/polygon.png";
import arbitrumIcon from "../assets/image/blockchain/arbitrum.png";
import bscIcon from "../assets/image/blockchain/binance.png";
import fantomIcon from "../assets/image/blockchain/fantom.png";
import avalancheIcon from "../assets/image/blockchain/avalanche.png";
import voxelIcon from "../assets/image/blockchain/VXL.png";

export const initEntityState = (initialValue, loading = true) => ({
  loading,
  data: initialValue,
  loadFailed: false,
  canceler: null
});

export const entityLoadingStarted = (state, canceler) => ({
  ...state,
  canceler,
  loading: true,
  loadFailed: false
});

export const entityLoadingSucceeded = (state, data) => ({
  ...state,
  data,
  loading: false,
  loadFailed: false,
  canceler: null
});

export const entityLoadingFailed = (state) => ({
  ...state,
  loading: false,
  loadFailed: true,
  canceler: null
});

export const handleSelection = (selectedIds, selectId, singleSelect = false) => {

  const selected = new Set(selectedIds || []);
  
  if(singleSelect) return new Set([selectId]);

  if (selected.has(selectId)) {
    selected.delete(selectId);
  } else {
    selected.add(selectId);
  }

  return selected;
};

export const shuffleArray = (array) => {
  let shuffeled = array;

  for (let i = shuffeled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffeled[i], shuffeled[j]] = [shuffeled[j], shuffeled[i]];
  }

  return shuffeled;
}

const blockchainData = {
  5: { name: 'Goerli-Testnet', logo: voxelIcon, currency: 'VXL'},
  1: { name: 'Ethereum', logo: voxelIcon, currency: 'VXL'},
  137: { name: 'Polygon', logo: polygonIcon, currency: 'MATIC'},
  42161: { name: 'Arbitrum', logo: arbitrumIcon, currency: 'ETH'},
  56: { name: 'Binance Smart Chain', logo: bscIcon, currency: 'BNB'},
  250: {name: 'Fantom', logo: fantomIcon, currency: 'FTM'},
  43114: { name: 'Avalanche', logo: avalancheIcon, currency: 'AVAX'}
};

export const currencyName = (chainId) => {
  if(!chainId) return blockchainData[5].currency;
  return blockchainData[chainId].currency;
}

export const currencyLogo = (chainId) => {
  if(!chainId) return blockchainData[5].logo;
  return blockchainData[chainId].logo;
}