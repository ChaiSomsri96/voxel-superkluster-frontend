import React, { useState , useEffect} from 'react' ;
import TopFilterBar from "./../components/ranking/TopFilterBar";
import { Container, RankingColumnSpan } from "./../components/ranking/styled-components";
import "./../assets/stylesheets/ranking.scss";
import { Axios } from "./../core/axios";
import { Table } from 'antd';
import { shortenWalletAddress, formatUSDPrice, formatMarketplaceNumber } from "./../utils";
import profileImg from "./../assets/image/profile.png";
import defaultAvatar from "./../assets/image/default_avatar.jpg";
import { Link } from "@reach/router";
import moment from 'moment';
import { ReactComponent as VerifyIcon } from "./../assets/svg/verify.svg"

import MoonLoader from "react-spinners/MoonLoader";


const ExploreCollectionPage = ({colormodesettle}) => {
    const accessToken = localStorage.getItem('accessToken') ;
    const header = { 'Authorization': `Bearer ${accessToken}` } ;

    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [startDate, setStartDate] = useState(0);
    const [categoryId, setCategoryId] = useState(0);
    const [searchValue, setSearchValue] = useState('');

    const [rankData, setRankData] = useState([]);

    const [loading, setLoading] = useState(false);


    const CollectionColumn = ({content}) => {
        return (
            <Link to={`/collection-detail/${content.collectionLink}`} className="link-wrapper">
                <div className='column-data'>
                    <div className='image-data'>
                        <img src={content && content.collectionAvatar ? content.collectionAvatar : defaultAvatar} alt="collection-avatar" />

                        {
                            content.collectionVerified ? <VerifyIcon className="verify-icon" /> : null
                        }
                    </div>
                    <RankingColumnSpan>{content.collectionName}</RankingColumnSpan>
                </div>
            </Link>
        );
    }

    const CreatorColumn = ({content}) => {
        return (
            <>
            {
                content && content.public_address ?
                <Link to={`/author/${content.public_address}`} className="link-wrapper">
                    <div className='column-data'>
                        <div className='image-data'>
                            <img src={content && content.avatar ? content.avatar : profileImg} alt="creator-avatar" />

                            {
                                content.verified ? <VerifyIcon className="verify-icon" /> : null
                            }
                        </div>
                        <RankingColumnSpan>
                            {content && content.username ? content.username : shortenWalletAddress(content.public_address)}
                        </RankingColumnSpan>
                    </div>
                </Link>
                :
                null
            }
            </>
        );
    }

    const columns = [
        {
            key: 'sequenceNumber',
            title: '#',
            render: (_, __, index) => <RankingColumnSpan>{index + 1}</RankingColumnSpan>
        },
        {
            key: 'collectionId',
            title: 'COLLECTION',
            dataIndex: "collectionId",
            render: (_, record) => <CollectionColumn content={record} />
        },
        {
            key: 'creator',
            title: 'CREATOR',
            dataIndex: "creator",
            render: content => <CreatorColumn content={content} />
        },
        {
            key: 'volume',
            title: 'VOLUME',
            dataIndex: "usdVolume",
            render: usdVolume => (<RankingColumnSpan>{formatUSDPrice(usdVolume)} USD</RankingColumnSpan>)
        },
        {
            key: 'floor_price',
            title: 'FLOOR PRICE',
            dataIndex: "floor_price",
            render: (_, record) => (<RankingColumnSpan>{formatUSDPrice(record.floor_price)} USD</RankingColumnSpan>)
        },
        {
            key: 'owners',
            title: 'OWNERS',
            dataIndex: "owners",
            render: owners => (<RankingColumnSpan>{formatMarketplaceNumber(owners)}</RankingColumnSpan>)
        },
        {
            key: 'assets',
            title: 'ASSETS',
            dataIndex: "assets",
            render: assets => (<RankingColumnSpan>{formatMarketplaceNumber(assets)}</RankingColumnSpan>)
        }
    ]

    const handlePageChange = async (pageNum) => {
        setCurrentPage(pageNum);
    }

    const handleDatePeriodChange = (value) => {
        setStartDate(value);
    };

    const handleCategoryChange = (value) => {
        setCategoryId(value);
    };

    const handleSearchValueChange = (value) => {
        setSearchValue(value);
    };

    const getRankFunc = async() => {
        try {
            let start_date = 0;
        
            if(startDate == 1) {
                start_date = Math.floor(moment().subtract(1, 'hour').valueOf() / 1000);
            }
            else if(startDate == 2) {
                start_date = Math.floor(moment().subtract(6, 'hours').valueOf() / 1000);
            }
            else if(startDate == 3) {
                start_date = Math.floor(moment().subtract(24, 'hours').valueOf() / 1000);
            }
            else if(startDate == 4) {
                start_date = Math.floor(moment().subtract(7, 'days').valueOf() / 1000);
            }
            else if(startDate == 5) {
                start_date = Math.floor(moment().subtract(30, 'days').valueOf() / 1000);
            }
            else {
                start_date = 0;
            }

            let data = {
                per_page: 20,
                page: currentPage
            };

            data = {
                ...data,
                "start_date": start_date,
                "category": categoryId,
                "search_value": searchValue
            }

            setLoading(true);

            let res;
            if(!accessToken) res = await Axios.post('/api/collections/get-ranking', data);
            else res = await Axios.post('/api/collections/get-user-ranking', data, { headers: header });

            setLoading(false);

            setRankData(res.data.data);
            setTotal(res.data.meta.total);
        }
        catch(error) {
            setLoading(false);
            console.error("getRankFunc Err: ", error);
        }
    }

    useEffect( () => {
        getRankFunc() ;
    }, [startDate, categoryId, searchValue, currentPage]);

    return (
        <Container>
            <div className="explore-collection-container explore-collection-page">
                <TopFilterBar 
                    colormodesettle={colormodesettle}
                    onDatePeriodChange={handleDatePeriodChange}
                    onCategoryChange={handleCategoryChange}
                    onSearchValueChange={handleSearchValueChange}
                />

                <div style={{marginTop: '30px'}} className='ranking-table'>
                    {
                     loading &&
                     <div style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(255,255,255,0.5)', zIndex: '100'}}>
                        <MoonLoader cssOverride={{position: 'absolute', top: 'calc(50% - 25px)', left: 'calc(50% - 25px)', borderColor: 'rgb(220, 219, 219)'}} loading={loading} size={50} />  
                     </div>
                    }

                    <Table
                    columns={columns}
                    style={{ overflowX: 'auto' }}
                    dataSource={rankData}
                    pagination={{
                        total: total,
                        defaultPageSize: 20,
                        defaultCurrent: 1,
                        pageSizeOptions: [20],
                        onChange: handlePageChange,
                        showSizeChanger: false,
                        current: currentPage
                    }}
                    />
                </div>
            </div>
        </Container>
    );
}

export default ExploreCollectionPage;