import React, { memo, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "@reach/router";
import { Table, Select } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';

import { Axios } from "./../core/axios";
import * as actions from "./../store/actions/thunks";
import * as selectors from './../store/selectors';
import defaultAvatar from "./../assets/image/default_avatar.jpg";
import defaultUser from "./../assets/image/default_user.png";
import vxlCurrency from "./../assets/image/vxl_currency.png";

const GlobalStyles = createGlobalStyle`
`;

const FilterBar = styled.div`
    display: flex;
    justify-content: center;
    width: 50%;
    margin: 0px auto;

    @media (max-width: 768px) {
        width: 100%
    }
    
    @media (max-width: 480px) {
        display: block;
    }
`;
const Div = styled.div`
    width: calc(50% - 20px);
    margin: 0px 10px 0px;

    @media (max-width: 480px) {
        width: calc(100% - 20px);
    }
`;
const StyledSelect = styled(Select)`
    width: 100%;
`;

const ColumeGroup = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer
`
const DescriptionDiv = styled.div`
    
    font-weight: 400;
    margin-top: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const RankingPage = ({colormodesettle}) => {

  const { Option } = Select;

  const accessToken = localStorage.getItem('accessToken') ;
  const header = { 'Authorization': `Bearer ${accessToken}` } ;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const category = useSelector(selectors.categoryState).data;
  const [collectionData, setCollectionData] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [startDate, setStartDate] = useState(0);
  const [innerWidth, setInnerWidth] = useState(null);
  const [UsdPrice , setUsdPrice] = useState() ;
  const [headerFlg ,setSubHeaderFlg] = useState(true) ;

  useEffect(() => {
    dispatch(actions.fetchNftCategory());
    setInnerWidth(window.innerWidth);
  }, [dispatch]);

  const getRankFunc= async()=>{
    let res;
    if(!accessToken) res = await Axios.post('/api/collections/get-ranking', { "start_date": startDate, "category": categoryId});
    else res = await Axios.post('/api/collections/get-user-ranking', { "start_date": startDate, "category": categoryId}, { headers: header });
    setCollectionData(res.data.data) ;
    setUsdPrice(res.data.usdPrice) ;
  }

  useEffect( () => {
    getRankFunc() ;
  }, [categoryId, startDate])

  const handleCategoryChange = (value) => {
    setCategoryId(value)
  }

  const handleCategorySearch = (val) => {
  }

  const handleDateChange = (value) => {
    const currentDate = new Date();
    if (value === 1 ) {
      var before7Daysdate = new Date(currentDate.setDate(currentDate.getDate() - 1));
      setStartDate(Math.floor(before7Daysdate.getTime()/1000))
    } else if (value === 2) {
      var beforeOneDaysdate = new Date(currentDate.setDate(currentDate.getDate() - 7));
      setStartDate(Math.floor(beforeOneDaysdate.getTime()/1000))
    } else if (value === 3) {
      var before30Daysdate = new Date(currentDate.setDate(currentDate.getDate() - 30));
      setStartDate(Math.floor(before30Daysdate.getTime()/1000))
    } else {
      setStartDate(value)
    }
  }

  const handleDateSearch = (val) => {
  }

  const handleTableSort = (pagination, filters, sorter, extra) => {
  }

  const options = [
    { id: 0, value: 'All time', label: 'All time' },
    { id: 1, value: 'Last 24 hours', label: 'Last 24 hours' },
    { id: 2, value: 'Last 7 days', label: 'Last 7 days' },
    { id: 3, value: 'Last 30 days', label: 'Last 30 days' },
  ];

  const handleRouteToCollection =(id)=>{
    navigate(`/collection-detail/${id}`)
    localStorage.setItem('itemId', id);
  }
  const handleRouteToUser = (userAddr) => {
    navigate(`/author/${userAddr}`);
  }
  const usd_price_set=(num)=>{
    if(!num) num = 0;
    let str = '' ;
    if(num > 1000) str = parseInt(num / 1000) + 'K' ;
    if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
    if(num < 1000) str = num.toFixed(0) ;
    return str ;
  }
  const usdPrice_num_usd=(num)=> {
    let str = '' ;
    if(num > 1000) str = parseFloat(parseInt(num / 100)/10) + 'K' ;
    if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
    if(num < 1000) str = num.toFixed(2) ;
    return str ;
  }
  const CollectionAvatar = ({content}) => {
    return (
      <ColumeGroup onClick={() => handleRouteToCollection(content.collectionLink)}>
        <div className="author_list_pp" style={{ width: 40, height: 40, position:'relative' }}>
          <span>
              <img effect="opacity" src={content && content.collectionAvatar ? content.collectionAvatar : defaultAvatar } alt="avatar" />
              <i className="fa fa-check"></i>
          </span>
        </div>
        <DescriptionDiv style={{ marginLeft: 15,marginTop:10, fontSize:'16px' , fontWeight:'500' }}>{content.collectionName}</DescriptionDiv>
      </ColumeGroup>
    )
  }

  const UserAvatar = ({creatorAddr, content}) => {
    return (
      <ColumeGroup onClick={() => handleRouteToUser(content.creator? content.creator.public_address : (creatorAddr? creatorAddr : "0x0"))}>
        <div className="author_list_pp" style={{ width: 40, height: 40, position:'relative' }}>
          <span>
              <img effect="opacity" src={content.creator && content.creator.avatar ? content.creator.avatar : defaultUser } alt="avatar" />
              {
                (content.creator && content.creator.verified) ?
                <i className="fa fa-check"></i>
                :<></>
              }
          </span>
        </div>
        <DescriptionDiv style={{ marginLeft: 15,marginTop:10 ,fontSize:'16px' , fontWeight:'500' }}>{content.creator? content.creator.username : (creatorAddr? creatorAddr.slice(0,5) + '...' + creatorAddr.slice(-5) : '0x0')}</DescriptionDiv>
      </ColumeGroup>
    )
  }
  
  const columns = [
    {
      title: 'Collection',
      dataIndex: ['collectionAvatar', 'collectionName'],
      render: (avatar, content) => <CollectionAvatar avatar ={avatar} content = {content}/>
    },
    {
      title: 'Creator',
      dataIndex: ['creator_of', 'creator'],
      render: (creator_addr, content) => <UserAvatar creatorAddr ={creator_addr} content = {content}/>
    },
    {
      title: 'Volume',
      dataIndex: ['volume', 'usdVolume'],
      render: (volume, content) => <DescriptionDiv><span><img style={{ width: 16, height: 16, marginBottom: 5 ,marginLeft: 0 }} src={vxlCurrency} />&nbsp;{usd_price_set(content.volume)}</span><br/>&nbsp;<span>$&nbsp;{usdPrice_num_usd(content.usdVolume)}</span></DescriptionDiv>,
sorter: {
        compare: (a, b) => a.volume - b.volume,
        multiple: 1,
      },
      onHeaderCell: (column) => {
        return {
          onClick: () => {
            setSubHeaderFlg(!headerFlg) ;
          }
        };
      }
    },
    {
      title: 'Floor Price',
      dataIndex: 'floor_price',
      render: content => <DescriptionDiv><span><img style={{ width: 16, height: 16, marginBottom: 5 ,marginLeft: 0 }} src={vxlCurrency} />&nbsp;{usd_price_set(content/UsdPrice)}</span><br/>&nbsp;<span>$&nbsp;{usdPrice_num_usd(content)}</span></DescriptionDiv>
    },
    {
      title: 'Owners',
      dataIndex: 'owners',
      render: content =><DescriptionDiv><span>{content >= 1000 ? content/1000 + 'K' : content}</span></DescriptionDiv>
    },
    {
      title: 'Assets',
      dataIndex: 'assets',
      render: content => <DescriptionDiv><span>{content >= 1000 ? content/1000 + 'K' : content}</span></DescriptionDiv>
    },
  ];
  
  useEffect(()=>{
    localStorage.setItem('searchValue','') ;

  },[])
  return (
    <>
      <div>
        <GlobalStyles />
        <section className='jumbotron breadcumb no-bg text-light backgroundBannerStyleRank' style={{backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'center center'}}>
          <div className='mainbreadcumb'>
            <div className='custom-container'>
              <div className='row m-10-hor'>
                <div className='col-12 text-center'>
                  <h1 className='text-center' style={{fontFamily:'Inter', textShadow:'2px 2px 2px rgba(0,0,0,.5)'}}>
                    {headerFlg ? "Highest to Lowest" : "Lowest to Highest"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: '50px 20px' }} className="custom-container">
          <div className='row'>
            <div className='col-lg-12'>
              <FilterBar>
                  <Div>
                      <StyledSelect
                          showSearch
                          placeholder="Select a category"
                          optionFilterProp="children"
                          defaultValue=""
                          onChange={handleCategoryChange}
                          onSearch={handleCategorySearch}
                          filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                      >
                          <Option value="">All</Option>
                          {
                              category?.map((item, index) => (
                                  <Option key={index} value={item.id}>{item.label}</Option>
                              ))
                          }
                      </StyledSelect>
                  </Div>
                  <Div>
                      <StyledSelect
                          showSearch
                          defaultValue={0}
                          optionFilterProp="children"
                          placeholder="Select Collections..."
                          onChange={handleDateChange}
                          onSearch={handleDateSearch}
                          filterOption={(input, option) =>
                              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                      >
                          {
                              options?.map((item, index) => (
                                  <Option key={index} value={item.id}>{item.value}</Option>
                              ))
                          }
                      </StyledSelect>
                  </Div>
              </FilterBar>
              <Table columns={columns} style={{ overflowY: 'auto' }} dataSource={collectionData} onChange={handleTableSort} />
            </div>
          </div>
        </section>
      </div>
    </>
)};

export default memo(RankingPage);