import React, { memo, useState, useEffect } from 'react';
import { Axios } from "./../../core/axios";
import { Link } from "@reach/router";
import { Text, HistoryLabel, HistoryLog, HistoryUserLink } from "./styled-components";
import InfiniteScroll from 'react-infinite-scroll-component';
import NoData from './NoData';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import defaultUser from "./../../assets/image/default_user.png";
import { formatDate, shortenWalletAddress, usdPriceItemDetailPage, formatUSDPrice, formatETHPrice } from "./../../utils";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import {useSelector, useDispatch } from "react-redux";
import * as selectors from "./../../store/selectors";
import * as actions from "./../../store/actions/thunks";

const SkeletonHistoryRow = () => {
    return (
        <div className='flex-align-center'>
            <div style={{width: '45px', marginRight: '18px'}}>
                <SkeletonTheme color="#eee" highlightColor="#ccc" height="45px" borderRadius="50%">
                        <Skeleton count={1} />
                </SkeletonTheme>
            </div>
            
            <div style={{width: '300px'}}>
                <SkeletonTheme color="#eee" highlightColor="#ccc">
                        <Skeleton count={2} />
                </SkeletonTheme>
            </div>

            <div style={{flexGrow: 1, textAlign: 'right'}}>
                <SkeletonTheme color="#eee" highlightColor="#ccc" width="100px">
                        <Skeleton count={2} />
                </SkeletonTheme>
            </div>
        </div>
    )
}

const History = ({nftId}) => {
    const dispatch = useDispatch();
    let historyStoreData = useSelector(selectors.nftHistoryState).data;

    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [usdPrice, setUsdPrice] = useState(0);

    const loadMoreData = async () => {
          try {
            if (loading) {
                return;
            }

            setLoading(true);

            const { data } = await Axios.post(`/api/assets/history`, { "id": nftId, page: page + 1 });
            setTotalCount(data.meta.total);
            setUsdPrice(data.usdPrice);
            setPage(page + 1);
            setHistoryData([...historyData, ...data.data]);
            setLoading(false);
          }
          catch(err) {
            console.error("loadMoreData Err: ", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        dispatch(actions.fetchNftHistory({"id": nftId, page: 1}));
    }, [dispatch]);

    useEffect(() => {
        if(historyStoreData) {
            setPage(1);
            if(historyStoreData.data)
                setHistoryData(historyStoreData.data);

            setTotalCount(historyStoreData.meta.total);
            setUsdPrice(historyStoreData.usdPrice);
        }
        
    }, [historyStoreData]);

    return (
        <>
        {
            !historyData || !historyData.length ?
            <NoData />
            :
            <div id="scrollableDiv"
            style={{
              height: 380,
              overflow: 'auto',
              padding: '0 25px'  
            }} className='history-section'>
                <InfiniteScroll
                    dataLength={historyData.length}
                    next={loadMoreData}
                    hasMore={historyData.length < totalCount}
                    loader={
                        <SkeletonHistoryRow />
                    }
                    scrollableTarget="scrollableDiv"
                >   
                    <div style={{display: 'flex', flexDirection: 'column', gap: '30px', paddingTop: '15px', paddingBottom: '15px', minWidth: '470px'}}>
                        {
                            historyData.map((item, index) => (
                                <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                                    <div className='history-avatar'>

                                        {
                                            item.activity == 'mint' ?
                                            <Link to={`/author/${item.to.address}`}>
                                                <LazyLoadImage
                                                src={item.to && item.to.user_avatar ? item.to.user_avatar : defaultUser}
                                                alt={`history-avatar-${index}`} />
                                            </Link>
                                            :
                                            <Link to={`/author/${item.from.address}`}>
                                                <LazyLoadImage
                                                src={item.from && item.from.user_avatar ? item.from.user_avatar : defaultUser}
                                                alt={`history-avatar-${index}`} />
                                            </Link>
                                        }
                                    </div>

                                    <div>
                                        <HistoryLog>
                                        {
                                            item.activity == 'sale' ? (
                                            <>
                                            { `${item.quantity} items sold to ` }
                                            <HistoryUserLink to={`/author/${item.to.address}`}>
                                                {item.to.user_name ? item.to.user_name : shortenWalletAddress(item.to.address) }
                                            </HistoryUserLink>
                                            </>
                                            )
                                            : item.activity == 'list' ? (
                                                <>
                                                { `${item.quantity} items listed by ` }
                                                <HistoryUserLink to={`/author/${item.from.address}`}>
                                                    {item.from.user_name ? item.from.user_name : shortenWalletAddress(item.from.address)}
                                                </HistoryUserLink>
                                                </>
                                            )
                                            : item.activity == 'auction' ? (
                                                <>
                                                 { `${item.quantity} items auctioned by ` }
                                                 <HistoryUserLink to={`/author/${item.from.address}`}>
                                                    {item.from.user_name ? item.from.user_name : shortenWalletAddress(item.from.address)}
                                                 </HistoryUserLink>
                                                </>
                                            )
                                            : item.activity == 'offer' ? (
                                                <>
                                                { `${item.quantity} items offer made by ` }
                                                <HistoryUserLink to={`/author/${item.from.address}`}>
                                                    {item.from.user_name ? item.from.user_name : shortenWalletAddress(item.from.address)}
                                                </HistoryUserLink>
                                                </>
                                            )
                                            : item.activity == 'mint' ? (
                                                <>
                                                { `${item.quantity} items minted by ` }
                                                <HistoryUserLink to={`/author/${item.to.address}`}>
                                                    {item.to.user_name ? item.to.user_name : shortenWalletAddress(item.to.address) }
                                                </HistoryUserLink>
                                                </>
                                            )
                                            : item.activity == 'cancel' ? (
                                                <>
                                                { `${item.quantity} items cancelled list by ` }
                                                <HistoryUserLink to={`/author/${item.from.address}`}>
                                                    {item.from.user_name ? item.from.user_name : shortenWalletAddress(item.from.address)}
                                                </HistoryUserLink>
                                                </>
                                            )
                                            : item.activity == 'cancel_auction' ? (
                                                <>
                                                { `${item.quantity} items cancelled auction by ` }
                                                <HistoryUserLink to={`/author/${item.from.address}`}>
                                                    {item.from.user_name ? item.from.user_name : shortenWalletAddress(item.from.address)}
                                                </HistoryUserLink>
                                                </>
                                            )
                                            :
                                            "1 items temp to XadzOmFIQc"
                                        }
                                        </HistoryLog>
                                        <HistoryLabel>{formatDate(item.time)}</HistoryLabel>
                                    </div>

                                    <div style={{flexGrow: 1, textAlign: 'right'}}>
                                        {
                                            item.activity == 'sale' ?
                                            <>
                                                <Text>{usdPriceItemDetailPage(item.price)} USD</Text>
                                                <HistoryLabel>
                                                    {item.currency == 'eth' ? formatETHPrice(item.other_price) : formatUSDPrice(item.other_price)} {item.currency == 'eth' ? 'ETH' : 'VXL'}
                                                </HistoryLabel>
                                            </>
                                            :
                                            item.activity == 'list' || item.activity == 'offer' || item.activity == 'cancel' || item.activity == 'auction' || item.activity == 'cancel_auction' ?
                                            <>
                                                <Text>{usdPriceItemDetailPage(item.price)} USD</Text>
                                                <HistoryLabel>{formatUSDPrice(parseInt(item.price / usdPrice))} VXL</HistoryLabel>
                                            </>
                                            : item.activity == 'mint' ? 
                                            null
                                            :
                                            <>
                                                <Text>26.75 ETH</Text>
                                                <HistoryLabel>$16,760</HistoryLabel>
                                            </>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </InfiniteScroll>
            </div>
        }
        </>
    )
}

export default memo(History);