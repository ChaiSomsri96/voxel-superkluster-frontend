import React, { memo, useState, useEffect } from 'react';
import { Axios } from "./../../core/axios";
import { Table } from 'antd';
import ActionCheckbox from "./../ActionCheckbox";
import "./../../assets/stylesheets/activity.scss";
import profileImg from "./../../assets/image/profile.png";
import { shortenWalletAddress, formatTimestamp } from "./../../utils";
import { activityAction } from "./../../components/constants/filters";
import { Link } from "@reach/router";
import { ActivityColumnSpan, FilterOption } from "./styled-components";
import { BsBoxArrowUpRight } from 'react-icons/bs';
import StickyBox from "react-sticky-box";
import LocalButton from './../common/Button';
import ActionCheckboxModal from "./../ActionCheckboxModal";

const ActivityTab = ({ colormodesettle, collectionId, authorId }) => {
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` };

    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [activityData, setActivityData] = useState(null);
    const [filterData, setFilterData] = useState([]);

    const [isActionFilterPopupOpen, SetActionFilterPopupOpen] = useState(false);
    const [browserWidth, setBrowserWidth] = useState(window.innerWidth);

    const ItemColumn = ({content}) => {
        return (
            <Link to={`/ItemDetail/${content.id}`} className="link-wrapper">
                <div className='column-data'>
                    <div className='image-data'>
                        <img src={content && content.image ? content.image : profileImg} alt="avatar" />
                    </div>
                    <ActivityColumnSpan>{content.name}</ActivityColumnSpan>
                </div>
            </Link>
        );
    }

    const UserColumn = ({content}) => {
        return (
            <>
            {
                content && content.address ?
                <Link to={`/author/${content.address}`} className="link-wrapper">
                    <div className='column-data'>
                        <div className='image-data'>
                            <img src={content && content.avatar ? content.avatar : profileImg} alt="from-avatar" />
                        </div>
                        <ActivityColumnSpan>
                            {content && content.username ? content.username : shortenWalletAddress(content.address)}
                        </ActivityColumnSpan>
                    </div>
                </Link>
                :
                null
            }
            </>
        );
    }

    const TimeColumn = ({time, record}) => {
        return (
            <ActivityColumnSpan className="time-span">
            {
                record.tx_hash ?
                    <a href={`https://etherscan.io/tx/${record.tx_hash}`} target='R' className="link-wrapper">
                        <div>{time.date}</div>
                        <div className='flex-align-center'>
                            <span style={{marginRight: '6px'}}>
                                {time.time}
                            </span>
                            <BsBoxArrowUpRight />
                        </div>
                    </a>
                :
                <>
                    <div>{time.date}</div>
                    <div>{time.time}</div>
                </>
            }
                
            </ActivityColumnSpan>
        )
    }

    const ActionSpan = ({activity}) => {
        return (
            <>
            {
                activityAction[activity] ?
                <img src={colormodesettle.ColorMode ? activityAction[activity]['darkTbSvg'] : activityAction[activity]['lightTbSvg']} alt={activityAction[activity]['alt']} />
                :
                <img src={colormodesettle.ColorMode ? activityAction["Burns"]['darkTbSvg'] : activityAction["Burns"]['lightTbSvg']} alt={activityAction["Burns"]['alt']} />
            }
            </>
        )
    }

    const columns = [
        {
            key: 'action',
            title: 'ACTION',
            dataIndex: 'activity',
            render: activity => <ActionSpan activity={activity} />
        },
        {
            key: 'item',
            title: 'ITEM',
            dataIndex: "asset",
            render: content => <ItemColumn content={content} />
        },
        {
            key: 'quantity',
            title: '',
            dataIndex: 'quantity',
            render: quantity => <ActivityColumnSpan>X{quantity}</ActivityColumnSpan>
        },
        {
            key: 'from',
            title: 'FROM',
            dataIndex: 'from',
            render: content => <UserColumn content={content} />
        },
        {
            key: 'to',
            title: 'TO',
            dataIndex: 'to',
            render: content => <UserColumn content={content} />
        },
        {
            key: 'price',
            title: 'PRICE',
            dataIndex: 'price',
            render: price => <>{price ? <ActivityColumnSpan>{price} USD</ActivityColumnSpan> : null }</>
        },
        {
            key: 'create_date',
            title: 'TIME',
            dataIndex: 'create_date',
            render: (content, record) => <TimeColumn time={formatTimestamp(content)} record={record} />
        }
    ];

    const handlePageChange = async (pageNum) => {
        // ActivityDataFunc(pageNum);
        setCurrentPage(pageNum);
    }

    const handleActionChange = (filterAction) => {
        console.log("handleActionChange: ", filterAction)
        const selectedKeys = Object.keys(filterAction).filter((key) => filterAction[key] === true);
        setFilterData(selectedKeys);
        //ActivityDataFunc(currentPage);
    }

    const handleCancel = () => {
        SetActionFilterPopupOpen(false);
    };

    const ActivityDataFunc = async ()=>{

        let data = {
            per_page: 20,
            page: currentPage
        };

        if(collectionId) {
            data = {
                ...data,
                collection: collectionId
            }
        }

        if(authorId) {
            data = {
                ...data,
                author: authorId
            }
        }

        if(filterData.length > 0) {
            data = {
                ...data,
                search: {
                    filterTypes: filterData
                }
            }
        }
        
        let res;

        if(!accessToken) res = await Axios.post(`api/activity/get-history`, data);
        else res = await Axios.post(`api/activity/get-user-history`, data, {headers:header});

        setActivityData(res.data.data);
        setTotal(res.data.meta.total);
        localStorage.setItem('usdPrice', res.data.usdPrice);
    }

    useEffect(() => {
        const handleResize = () => {
            setBrowserWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (browserWidth > 1540) {
            SetActionFilterPopupOpen(false);
        }
    }, [browserWidth]);

    useEffect( () => {
        ActivityDataFunc() ;
        
    }, [collectionId, filterData, currentPage]);

    return (
        <>
            <div className='activity-tab'>
                <div className='activity-table'>
                    <Table
                        columns={columns}
                        style={{ overflowX: 'auto' }}
                        dataSource={activityData}

                        pagination = {{
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
                <StickyBox offsetTop={120} className='sticky-box'>
                    <div className='action-checkbox-container'>
                        <ActionCheckbox colormodesettle={colormodesettle} onActionChange={handleActionChange} />
                    </div>
                </StickyBox>

                <FilterOption className='filter-option'>
                    <LocalButton className="filter-btn" onClick={() => SetActionFilterPopupOpen(true)}>Filters</LocalButton>
                </FilterOption>

                <ActionCheckboxModal
                    cartPopupOpen={isActionFilterPopupOpen}
                    handleCancel={handleCancel}
                    colormodesettle={colormodesettle}
                    onActionChange={handleActionChange}
                />
            </div>
        </>
    )
}

export default memo(ActivityTab);