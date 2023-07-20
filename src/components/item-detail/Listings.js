import React, { memo, useState, useEffect } from 'react';
import { Axios } from "./../../core/axios";
import { TableDiv, OfferUserLink } from "./styled-components";
import { shortenWalletAddress, calculateExpiredTime } from "./../../utils";
import { Table } from 'antd';
import NoData from './NoData';

const Listings = ({nftId, usdPrice}) => {
    const customLocale = {
        emptyText: (
            <NoData />
          )
    };

    const columns = [
        {
            key: 'unit_price',
            title: 'Price',
            dataIndex: 'unit_price',
            render: unit_price => <TableDiv>{ parseInt(unit_price / usdPrice) } VXL</TableDiv>
        },
        {
            key: 'usd_price',
            title: 'USD Price',
            dataIndex: 'unit_price',
            render: unit_price => <TableDiv> ${unit_price}</TableDiv>
        },
        {
            key: 'expiration',
            title: 'Expiration',
            dataIndex: 'expiration',
            render: expiration => <TableDiv> { calculateExpiredTime(expiration) } </TableDiv>
        },
        {
            key: 'from',
            title: 'From',
            dataIndex: 'from',
            render: content => <OfferUserLink to={`/author/${content.public_address}`}>  {content.username ? content.username : shortenWalletAddress(content.public_address)}  </OfferUserLink>
        }
    ];

    const [listData, setListData] = useState(null);

    useEffect(()=>{
        getItemListingList();
      },[]);

    const getItemListingList = async() => {
        try {
            const { data } = await Axios.post(`/api/supply-sale/get-listing-list`, { "id": nftId });
            setListData(data.data);
        }
        catch(err) {
            console.error("getItemListingList Err: ", err);
        }
    }

    return (
        <div style={{ borderRadius: '6px', overflow: 'hidden' }}>
            <Table
                className='item-detail-table'
                columns={columns}
                locale={customLocale}
                style={{ overflowX: 'auto' }}
                dataSource={listData}
                pagination={false}
                scroll={{
                    y: 240,
                }}
            />
        </div>
    )
}

export default memo(Listings);