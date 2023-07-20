import { 
    createAction as action, 
    createAsyncAction as asyncAction 
} from 'typesafe-actions';

export const getCategories = asyncAction(
    'nft/GET_NFT_CATEGORY',
    'nft/GET_NFT_CATEGORY_SUCCESS',
    'nft/GET_NFT_CATEGORY_FAIL'
)();

export const getFilterCollections = asyncAction(
    'nft/GET_NFT_FILTER_COLLECTION',
    'nft/GET_NFT_FILTER_COLLECTION_SUCCESS',
    'nft/GET_NFT_FILTER_COLLECTION_FAIL'
)();

export const getNftBreakdown = asyncAction(
    'nft/GET_NFT_BREAKDOWN',
    'nft/GET_NFT_BREAKDOWN_SUCCESS',
    'nft/GET_NFT_BREAKDOWN_FAIL'
)();

export const getNftShowcase = asyncAction(
    'nft/GET_NFT_SHOWCASE',
    'nft/GET_NFT_SHOWCASE_SUCCESS',
    'nft/GET_NFT_SHOWCASE_FAIL'
)();

export const getNftDetail = asyncAction(
    'nft/GET_NFT_DETAIL',
    'nft/GET_NFT_DETAIL_SUCCESS',
    'nft/GET_NFT_DETAIL_FAIL'
)();

export const getNftDetailInfo = asyncAction(
    'nft/GET_NFT_DETAIL_INFO',
    'nft/GET_NFT_DETAIL_INFO_SUCCESS',
    'nft/GET_NFT_DETAIL_INFO_FAIL'
)();

export const getNftHistory = asyncAction(
    'nft/GET_NFT_HISTORY',
    'nft/GET_NFT_HISTORY_SUCCESS',
    'nft/GET_NFT_HISTORY_FAIL'
)();

export const getNftBidHistory = asyncAction(
    'nft/GET_NFT_BID_HISTORY',
    'nft/GET_NFT_BID_HISTORY_SUCCESS',
    'nft/GET_NFT_BID_HISTORY_FAIL'
)();

export const getHotCollections = asyncAction(
    'nft/GET_HOT_COLLECTIONS',
    'nft/GET_HOT_COLLECTIONS_SUCCESS',
    'nft/GET_HOT_COLLECTIONS_FAIL'
)();

export const getAuthorList = asyncAction(
    'nft/GET_AUTHOR_LIST',
    'nft/GET_AUTHOR_LIST_SUCCESS',
    'nft/GET_AUTHOR_LIST_FAIL'
)();

export const getAuthorInfo = asyncAction(
    'nft/GET_AUTHOR_INFO',
    'nft/GET_AUTHOR_INFO_SUCCESS',
    'nft/GET_AUTHOR_INFO_FAIL'
)();

export const getAuthorOnSaledNfts = asyncAction(
    'nft/GET_AUTHOR_ONSALED_NFTS',
    'nft/GET_AUTHOR_ONSALED_NFTS_SUCCESS',
    'nft/GET_AUTHOR_ONSALED_NFTS_FAIL'
)();

export const getAuthorCreatedNfts = asyncAction(
    'nft/GET_AUTHOR_CREATED_NFTS',
    'nft/GET_AUTHOR_CREATED_NFTS_SUCCESS',
    'nft/GET_AUTHOR_CREATED_NFTS_FAIL'
)();

export const getAuthorHiddenNfts = asyncAction(
    'nft/GET_AUTHOR_HIDDEN_NFTS',
    'nft/GET_AUTHOR_HIDDEN_NFTS_SUCCESS',
    'nft/GET_AUTHOR_HIDDEN_NFTS_FAIL'
)();

export const getAuthorLikedNfts = asyncAction(
    'nft/GET_AUTHOR_LIKED_NFTS',
    'nft/GET_AUTHOR_LIKED_NFTS_SUCCESS',
    'nft/GET_AUTHOR_LIKED_NFTS_FAIL'
)();

export const getAuthorCollectedNfts = asyncAction(
    'nft/GET_AUTHOR_COLLECTED_NFTS',
    'nft/GET_AUTHOR_COLLECTED_NFTS_SUCCESS',
    'nft/GET_AUTHOR_COLLECTED_NFTS_FAIL'
)();

export const getAuthorBidNfts = asyncAction(
    'nft/GET_AUTHOR_BId_NFTS',
    'nft/GET_AUTHOR_BId_NFTS_SUCCESS',
    'nft/GET_AUTHOR_BId_NFTS_FAIL'
)();
export const getAuthorSellNfts = asyncAction(
    'nft/GET_AUTHOR_Sell_NFTS',
    'nft/GET_AUTHOR_Sell_NFTS_SUCCESS',
    'nft/GET_AUTHOR_Sell_NFTS_FAIL'
)();

export const GET_AUTHOR_RANKING = asyncAction(
    'nft/GET_AUTHOR_RANKING',
    'nft/GET_AUTHOR_RANKING_SUCCESS',
    'nft/GET_AUTHOR_RANKING_FAIL'
)();

export const getBlogPosts = asyncAction(
    'nft/GET_BLOG_POSTS',
    'nft/GET_BLOG_POSTS_SUCCESS',
    'nft/GET_BLOG_POSTS_FAIL'
)();

export const getRecentPosts = asyncAction(
    'nft/GET_RECENT_POSTS',
    'nft/GET_RECENT_POSTS_SUCCESS',
    'nft/GET_RECENT_POSTS_FAIL'
)();

export const getBalance = asyncAction(
    'nft/GET_BALANCE',
    'nft/GET_BALANCE_SUCCESS',
    'nft/GET_BALANCE_FAIL'
)();

export const getTags = asyncAction(
    'nft/GET_TAGS',
    'nft/GET_TAGS_SUCCESS',
    'nft/GET_TAGS_FAIL'
)();

export const getComments = asyncAction(
    'nft/GET_COMMENTS',
    'nft/GET_COMMENTS_SUCCESS',
    'nft/GET_COMMENTS_FAIL'
)();

export const getCollection = asyncAction(
    'nft/GET_Collection',
    'nft/GET_Collection_SUCCESS',
    'nft/GET_Collection_FAIL'
)();

export const postMintingNft = asyncAction(
    'nft/POST_MINTING',
    'nft/POST_MINTING_SUCCESS',
    'nft/POST_MINTING_FAIL'
)();

export const getAuthorRanking = asyncAction(
    'nft/GET_AUTHOR_RANKING',
    'nft/GET_AUTHOR_RANKING_SUCCESS',
    'nft/GET_AUTHOR_RANKING_FAIL'
)();

export const setDarkMode = asyncAction(
    'nft/SET_DARKMODE',
    'nft/SET_DARKMODE_SUCCESS',
    'nft/SET_DARKMODE_FAIL'
)();

export const getCartInfo = asyncAction(
    'nft/GET_CART_INFO',
    'nft/GET_CART_INFO_SUCCESS',
    'nft/GET_CART_INFO_FAIL'
)();

export const clearNfts = action('nft/CLEAR_ALL_NFTS')();
export const clearFilter = action('nft/CLEAR_FILTER')();
export const filterCategories = action('nft/FILTER_CATEGORIES')();
export const filterStatus = action('nft/FILTER_STATUS')();
export const filterItemsType = action('nft/FILTER_ITEMS_TYPE')();
export const filterCollections = action('nft/FILTER_COLLECTIONS')();
export const filterNftTitle = action('nft/FILTER_NFT_TITLE')();
export const saveAccessToken = action('auth/SAVE_ACCESS_TOKEN')();
export const saveAuthorAccount = action('auth/SAVE_AUTHOR_ACCOUNT')();