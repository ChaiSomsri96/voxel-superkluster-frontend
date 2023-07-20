import React, { memo, useState, useEffect } from 'react';
import { Axios } from "./../../core/axios";
import { Line } from '@ant-design/plots';

import NoData from './NoData';

const PriceHistory = ({nftId, colormodesettle}) => {

    const [priceHistoryData, setPriceHistoryData] = useState([]);
    const [configData, setConfigData] = useState(null);

    useEffect(() => {
        getPriceHistoryData();
    }, []);

    useEffect(() => {
        if(!priceHistoryData) setConfigData(null);
        const data = priceHistoryData.map((item) => {
            return {sale_date: item.sale_date, avg_sale_price: parseInt(item.avg_sale_price), sale_num: parseInt(item.sale_num)}
        })
        if(priceHistoryData && priceHistoryData.length == 0) setConfigData(null);

        if(priceHistoryData && priceHistoryData.length > 0) {
            const tmp = {
                data,
                xField: 'sale_date',
                yField: 'avg_sale_price',
                columnWidthRatio: 0.8,
                xAxis: {
                  label: {
                    autoHide: true,
                    autoRotate: false,
                  },
                },
                point: {
                  size: 5,
                  shape: 'diamond',
                  style: {
                    fill: 'white',
                    stroke: '#f60cfe',
                    lineWidth: 2,
                  },
                },
                meta: {
                  avg_sale_price: {
                    alias: 'Price(USD)',
                  },
                },
                tooltip: {
                  customContent: (title, data) => {
                    if(!data) return `<div></div>`;
                    if(data.length == 0) return `<div></div>`;
                    else {
                      return `<div style="padding-top:5px; padding-bottom:5px">
                              <div style="margin-top:2px;">${title}</div>
                              <div style="margin-top:2px;">Sale num : ${data[0].data.sale_num}</div>
                              <div style="margin-top:2px;">Price : ${data[0].data.avg_sale_price} USD</div>
                            </div>`;
                    }
                  }
                },
                maxColumnWidth: 35,
                color: '#f60cfe',
                smooth: true
            };

            setConfigData(tmp);
        }
    }, [priceHistoryData]);

    const getPriceHistoryData = async () => {
        const param = {
          id: nftId
        }
        const {data} = await Axios.post('/api/activity/get-price-history', param);
        setPriceHistoryData(data);
    }

    return (
        <>
        {
            !configData ?
            <NoData />
            :
            <div style={{ height:'240px', paddingTop: '30px', paddingBottom: '30px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ height:'180px', width: 'calc(100% - 64px)' }}>
                    <Line {...configData} />
                </div>
            </div>
        }
        </>
    )
}

export default memo(PriceHistory);