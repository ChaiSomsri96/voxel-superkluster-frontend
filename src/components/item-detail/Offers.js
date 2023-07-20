import React, { memo, useState, useEffect } from 'react';
import { Table } from 'antd';
import { TableDiv, OfferUserLink } from "./styled-components";
import { shortenWalletAddress, calculateExpiredTime } from "./../../utils";
import NoData from './NoData';

import * as selectors from "./../../store/selectors";
import * as actions from "./../../store/actions/thunks";
import {useSelector, useDispatch } from "react-redux";

const Offers = ({nftId, usdPrice}) => {
    const dispatch = useDispatch();

    const customLocale = {
        emptyText: (
            <NoData />
          )
    };
    //add quantity column if item is erc1155
    const columns = [
        {
            key: 'price',
            title: 'Price',
            dataIndex: 'price',
            render: price => <TableDiv>{ parseInt(price / usdPrice) } VXL</TableDiv>
        },
        {
            key: 'usd_price',
            title: 'USD Price',
            dataIndex: 'price',
            render: price => <TableDiv> ${price}</TableDiv>
        },
        {
            key: 'floor_differences',
            title: 'Floor Differences',
            dataIndex: 'id',
            render: floor => <TableDiv> 100% </TableDiv>
        },
        {
            key: 'expiration',
            title: 'Expiration',
            dataIndex: 'time',
            render: time => <TableDiv> { calculateExpiredTime(time) } </TableDiv>
        },
        {
            key: 'from',
            title: 'From',
            dataIndex: 'bidder',
            render: content => <OfferUserLink to={`/author/${content.address}`}>  {content.name ? content.name : shortenWalletAddress(content.address)}  </OfferUserLink>
        }
    ];

    let offerData = useSelector(selectors.nftBidHistoryState).data;

    useEffect(()=>{
        getItemOfferList();
    },[dispatch]);

    const getItemOfferList = async() => {
        dispatch(actions.fetchBidHistory({id: nftId}));
    }

    return (
        <div style={{ borderRadius: '6px', overflow: 'hidden' }}>
            <Table
                className='item-detail-table'
                columns={columns}
                locale={customLocale}
                style={{ overflowX: 'auto' }}
                dataSource={offerData}
                pagination={false}
                scroll={{
                    y: 240,
                }}
            />
        </div>
    )
}

export default memo(Offers);