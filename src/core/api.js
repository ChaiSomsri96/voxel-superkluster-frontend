const api = {
  baseUrl: "/mock_data", //mock data base folder
  nfts: "/nfts.json",
  nftShowcases: "/nft_showcases.json",
  authors: "/authors.json",
  authorsSales: "/author_ranks.json",
  hotCollections: "/hot-collections.json",
  contactUs: "/contact-forms",
  blogs: "/blog-posts",
  recent: "/blog-posts/recent.json",
  comments: "/blog-posts/comments.json",
  tags: "/blog-posts/tags.json",
};

export const API_URL = process.env.REACT_APP_API_URL ?? "";
export const WS_API_URL = process.env.REACT_APP_WS_API_URL ?? "";
export const IPFS_URL = process.env.REACT_APP_IPFS_URL ?? "";
export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID ?? "";
export const INFURA_API_KEY = process.env.REACT_APP_INFURA_API_KEY ?? "";
export const openseaApi = {
  base: "https://testnets.opensea.io",
  api: "https://testnets-api.opensea.io",
};

export default api;
