import { createSelector, createStructuredSelector } from "reselect";


//Store Selectors
export const nftBreakdownState = (state) => state.NFT.nftBreakdown;
export const nftShowcaseState = (state) => state.NFT.nftShowcase;
export const nftDetailState = (state) => state.NFT.nftDetail;
export const nftDetailInfoState = (state) => state.NFT.nftDetailInfo;

export const cartInfoState = (state) => state.CART.cartInfo;

export const nftHistoryState = (state) => state.NFT.nftHistory;
export const nftBidHistoryState = (state) => state.NFT.nftBidHistory;
export const hotCollectionsState = (state) => state.hotCollection.hotCollections;
export const authorInfoState = (state) => state.authors.authorInfo;
export const authorOnSaledNftState = (state) => state.authors.authorOnSaledNfts;
export const authorCreatedNftState = (state) => state.authors.authorCreatedNfts;
export const authorLikedNftState = (state) => state.authors.authorLikedNfts;
export const authorHiddenNftState = (state) => state.authors.authorHiddenNfts;
export const authorCollectedNftState = (state) => state.authors.authorCollectedNfts ;
export const authorBidNftState = (state) => state.authors.authorBidNfts;
export const authorSellNftState = (state) => state.authors.authorSellNfts;
export const authorsState = (state) => state.authors.authorList;
export const authorRankingsState = (state) => state.authors.authorRanking;
export const nftCollectionState = (state) => state.NFT.nftCollection;
export const nftMintingState = (state) => state.NFT.nftMinting;
export const categoryState = (state) => state.NFT.nftCategory;
export const collectionState = (state) => state.NFT.nftFilterCollections;
export const accessToken = (state) => state.authors.accessToken;
export const authorAccount = (state) => state.authors.authorAccount;
//blogs
export const blogsState = (state) => state.blogs.blogPosts;
export const recentPostsState = (state) => state.blogs.recentPosts;
export const tagsState = (state) => state.blogs.tags;
export const commentsState = (state) => state.blogs.comments;
// export const commentsState = (state) => state.blogs.comments;

//balance on header
export const myBalance = (state) => state.blogs.myBalance;


export const auctionedNfts = createSelector(nftBreakdownState, ( nfts ) => {
    if(!nfts.data) {
        return [];
    }
    const acutioned = nfts.data.filter(nft => !!nft.deadline) ;
    return acutioned ;
});

export const nftFilter = createStructuredSelector({
    categories: (state) => state.filters.selectedCategories,
    status: (state) => state.filters.selectedStatus,
    itemsType: (state) => state.filters.selectedItemsType,
    collections: (state) => state.filters.selectedCollections,
    nftTitle: (state) => state.filters.filterNftTitle
});

export const nftItems = createSelector(nftFilter, nftBreakdownState, ( filters, nfts ) => {
    let { data } = nfts;
    const { categories, status, itemsType, collections, nftTitle } = filters;
    
    if(!data) {
        return [];
    }

    if(categories.size) {
        data = data.filter( nft => categories.has(nft.category));
    }
    if(status.size) {
        data = data.filter( nft => status.has(nft.status));
    }
    if(itemsType.size) {
        data = data.filter( nft => itemsType.has(nft.item_type));
    }
    if(collections.size) {
        data = data.filter( nft => collections.has(nft.collections));
    }
    if(nftTitle.trim().length) {
        let pattern = new RegExp(`${nftTitle.trim()}`, 'gi');
        console.log(pattern)
        data = data.filter( nft => nft.title.match(pattern));
    }

    return data;
});