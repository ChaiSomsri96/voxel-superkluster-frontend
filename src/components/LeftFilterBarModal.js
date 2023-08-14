import React, { useState, useEffect, memo } from 'react';
import { Modal } from "antd";
import { FiChevronUp } from "react-icons/fi";
import "./../assets/stylesheets/left_filter_bar_modal.scss";
import styled from 'styled-components';
import { currencyList, chainList, statusList } from "./../components/constants/filters";
import SkCheckbox from "./SkCheckbox";
import { Select } from 'antd';
import LocalButton from './common/Button';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../store/selectors';
import * as actions from "../store/actions/thunks";
const PriceDiv = styled.div`
    width: 80px;

    background: ${props => props.theme.bannerSlideIconColor};
`;

const FirstFilterPart = styled.div`
    padding-bottom: 20px;
    border-bottom: 1px solid ${props => props.theme.filterBorder};
`;

const Span =  styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${props => props.theme.checkBoxTextColor};

    user-select: none;
`;

const FilterCaption = styled.div`
    font-size: 18px;
    font-weight: 800;
    color: ${props => props.theme.primaryColor};
    line-height: 18px;

    user-select: none;
`;

const FilterPart = styled.div`
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid ${props => props.theme.filterBorder};
`;

const FiChevronUpIcon = styled(FiChevronUp)`
    font-size: 20px;
    color: ${props => props.theme.primaryColor};
`;

const Label = styled.div`
    font-size: 15px;
    font-weight: 500;
    color: ${props => props.theme.saleCaptionColor};
`;

const LeftFilterBarModal = ({cartPopupOpen, handleCancel, colormodesettle, onFilter, detail}) => {
    const dispatch = useDispatch();

    const category = useSelector(selectors.categoryState).data;

    const [isStatus, setIsStatus] = useState(true);
    const [isCategory, setIsCategory] = useState(true);
    const [isPrice, setIsPrice] = useState(true);
    const [isChain, setIsChain] = useState(true);
    const [isCollection, setIsCollection] = useState(true);
    const [isProperties, setIsProperties] = useState(true);

    const [currency, setCurrency] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchValueParam = queryParams.get('filterdata[price_range][currency_type]');
        return searchValueParam ? parseInt(searchValueParam) : null;
    });
    const [minPrice, setMinPrice] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchValueParam = queryParams.get('filterdata[price_range][min_price]');
        return searchValueParam ? searchValueParam : '';
    });
    const [maxPrice, setMaxPrice] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchValueParam = queryParams.get('filterdata[price_range][max_price]');
        return searchValueParam ? searchValueParam : '';
    });
    const [priceApplyDisable, setPriceApplyDisable] = useState(true)

    // filter data
    const [statusData, setStatusData] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const filterStatusParams = []; 

        queryParams.forEach((value, key) => {
            if (key.startsWith('filterdata[status]')) {
              filterStatusParams.push(value);
            }
        });

        if(filterStatusParams.length > 0) { 
            return filterStatusParams; 
        }

        return [];
    });

    const [filterStatus, setFilterStatus] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const filterStatusParams = []; 

        queryParams.forEach((value, key) => {
            if (key.startsWith('filterdata[status]')) {
              filterStatusParams.push(value);
            }
        });

        if (filterStatusParams.length > 0) {
            const initialFilterStatus = filterStatusParams.reduce((acc, status) => {
                acc[status] = true;
                return acc;
            }, {});

            return initialFilterStatus;
        }

        return {};
    });

    const [categoryData, setCategoryData] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const filterCategoryParams = []; 

        queryParams.forEach((value, key) => {
            if (key.startsWith('filterdata[category]')) {
                filterCategoryParams.push(parseInt(value));
            }
        });

        if(filterCategoryParams.length > 0) { 
            return filterCategoryParams; 
        }

        return [];
    });

    const [filterCategory, setFilterCategory] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const filterCategoryParams = []; 

        queryParams.forEach((value, key) => {
            if (key.startsWith('filterdata[category]')) {
                filterCategoryParams.push(value);
            }
        });

        if (filterCategoryParams.length > 0) {
            const initialFilterCategory = filterCategoryParams.reduce((acc, status) => {
                acc[status] = true;
                return acc;
            }, {});

            return initialFilterCategory;
        }

        return {};
    });

    const [chainData, setChainData] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const filterChainParams = []; 

        queryParams.forEach((value, key) => {
            if (key.startsWith('filterdata[chain]')) {
                filterChainParams.push(value);
            }
        });

        if(filterChainParams.length > 0) { 
            return filterChainParams; 
        }

        return [];
    });

    const [filterChain, setFilterChain] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const filterChainParams = []; 

        queryParams.forEach((value, key) => {
            if (key.startsWith('filterdata[chain]')) {
                filterChainParams.push(value);
            }
        });

        if (filterChainParams.length > 0) {
            const initialFilterChain = filterChainParams.reduce((acc, status) => {
                acc[status] = true;
                return acc;
            }, {});

            return initialFilterChain;
        }

        return {};
    });

    useEffect(() => {
        if(!detail) {
            dispatch(actions.fetchNftCategory())
             }
    }, [dispatch, detail]);

    useEffect(() => {
        if(!currency) {
            setPriceApplyDisable(true);
        }
        else if(!isNaN(parseFloat(minPrice)) && !isNaN(parseFloat(maxPrice)) && parseFloat(minPrice) > parseFloat(maxPrice)) {
            setPriceApplyDisable(true);
        }
        else {
            setPriceApplyDisable(false);
        }
    }, [currency, minPrice, maxPrice]);

    const handleStatusClick = () => {
        setIsStatus(!isStatus)
    }

    const handlePriceClick = () => {
        setIsPrice(!isPrice);
    }

    const handleCategoryClick = () => {
        setIsCategory(!isCategory);
    }

    const handleChainClick = () => {
        setIsChain(!isChain);
    }

    const handleCollectionClick = () => {
        setIsCollection(!isCollection);
    }

    const handlePropertiesClick = () => {
        setIsProperties(!isProperties);
    } 

    const changeFilterStatus = (statusId) => {
        let _statusData = statusData;
        if(filterStatus[statusId]) { // false -> remove
            _statusData = _statusData.filter((id) => id !== statusId);
            setStatusData(_statusData);
        }
        else { // true -> add
            _statusData = [..._statusData, statusId]
            setStatusData(_statusData);
        }

        onFilter({sale_type: _statusData});

        setFilterStatus({
            ...filterStatus,
            [statusId]: !filterStatus[statusId]
        });
    }

    const changeFilterCategory = (categoryId) => {
        let _categoryData = categoryData;
        if(filterCategory[categoryId]) { // false -> remove
            _categoryData = _categoryData.filter((id) => id !== categoryId);
            setCategoryData(_categoryData);
        }
        else { // true -> add
            _categoryData = [...categoryData, categoryId]
            setCategoryData(_categoryData);
        }

        onFilter({category: _categoryData});

        setFilterCategory({
          ...filterCategory,
          [categoryId]: !filterCategory[categoryId]
        });
    };

    const changeFilterChain = (chainId) => {

        let _chainData = chainData;
        if(filterChain[chainId]) { // false -> remove
            _chainData = _chainData.filter((id) => id !== chainId);
            setChainData(_chainData);
        }
        else { // true -> add
            _chainData = [..._chainData, chainId]
            setChainData(_chainData);
        }

        onFilter({chain: _chainData});

        setFilterChain({
            ...filterChain,
            [chainId]: !filterChain[chainId]
        });
    };

    const setMinPriceVal = (val) => {
        if(!(/^[\d.]+$/.test(val) || val.length === 0))
            return;

        setMinPrice(val);
    }
    
    const setMaxPriceVal = (val) => {
        if(!(/^[\d.]+$/.test(val) || val.length === 0))
            return;

        setMaxPrice(val);
    }

    const priceApply = () => {
        onFilter({price_range: {
            currency_type: currency,
            min_price: minPrice,
            max_price: maxPrice
        }});
    }

    const handleCurrencyChange = (value) => {
        setCurrency(value);
    }

    return (
        <>
        <Modal
            className='left-filter-bar-modal tool-bar-modal'
            open={cartPopupOpen}
            onCancel={handleCancel}
            footer={null}
            centered={true}
            title="Filters"
        >
            <div className='overflow-content'>
                <FirstFilterPart>
                    <div className='collapse-line' onClick={() => handleStatusClick()}>
                        <FilterCaption>
                            Status
                        </FilterCaption>
                        <FiChevronUpIcon
                        className={!isStatus ? 'rotate-up' : 'rotate-down'} />
                    </div>

                    {
                        isStatus &&
                        <div className='checkbox-section'>
                            {
                                statusList?.map((item) => (
                                    <SkCheckbox
                                        key={item.id}
                                        checked={filterStatus[item.id] === true}
                                        onChange={() => changeFilterStatus(item.id)}
                                        className={colormodesettle.ColorMode ? "sk-checkbox-light" : "sk-checkbox-dark"}
                                    >
                                        <Span style={{marginLeft: '20px'}}>{item.label}</Span>
                                    </SkCheckbox>
                                ))
                            }
                        </div> 
                    }
                </FirstFilterPart>

                <FilterPart>
                    <div className='collapse-line' onClick={() => handlePriceClick()}>
                        <FilterCaption>
                            Price
                        </FilterCaption>
                        <FiChevronUpIcon
                        className={!isPrice ? 'rotate-up' : 'rotate-down'} />
                    </div>

                    {
                        isPrice &&
                        <div style={{paddingTop: '20px'}}>
                            <div style={{display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', marginBottom: '20px'}}>
                                <div className='dropdownSelect one' style={{ width: "85px" }}>
                                    <Select 
                                        options={currencyList} 
                                        style={{ width: "100%" }} 
                                        value={currency}
                                        onChange={handleCurrencyChange}
                                    ></Select>
                                </div>
                                <PriceDiv>
                                    <input 
                                        type='text' 
                                        placeholder="Min" 
                                        value={minPrice} 
                                        id='range_min' 
                                        name='range_min' 
                                        className='form-control'
                                        onChange={(e) => setMinPriceVal(e.target.value)} 
                                    />
                                </PriceDiv>
                                <Label>to</Label>
                                <PriceDiv>
                                    <input 
                                        type='text' 
                                        placeholder="Max" 
                                        value={maxPrice} 
                                        id='range_max' 
                                        name='range_max' 
                                        className='form-control'
                                        onChange={(e) => setMaxPriceVal(e.target.value)}
                                    />
                                </PriceDiv>
                            </div>

                            <LocalButton 
                                disabled={priceApplyDisable} 
                                className="apply-button"
                                onClick={() => priceApply()}
                            >
                                Apply
                            </LocalButton>    
                        </div>
                        
                    }
                </FilterPart>
                {
                    !detail && 
                    <FilterPart>
                        <div className='collapse-line' onClick={() => handleCategoryClick()}>
                            <FilterCaption>
                                Category
                            </FilterCaption>
                            <FiChevronUpIcon
                            className={!isCategory ? 'rotate-up' : 'rotate-down'} />
                        </div>

                        {
                            isCategory &&
                            <div className='checkbox-section'>
                                
                            {
                                category?.map((item) => (
                                    <SkCheckbox
                                        key={item.id}
                                        checked={filterCategory[item.id] === true}
                                        onChange={() => changeFilterCategory(item.id)}
                                        className={colormodesettle.ColorMode ? "sk-checkbox-light" : "sk-checkbox-dark"}
                                    >
                                        <Span style={{marginLeft: '20px'}}>{item.label}</Span>
                                    </SkCheckbox>
                                ))
                            }
                            
                            </div>
                        }
                    </FilterPart>
                }

                {
                    !detail &&
                    <FilterPart>
                        <div className='collapse-line' onClick={() => handleChainClick()}>
                            <FilterCaption>
                                Chain
                            </FilterCaption>
                            <FiChevronUpIcon
                            className={!isChain ? 'rotate-up' : 'rotate-down'} />
                        </div>
                        {
                            isChain &&
                            <div className='checkbox-section'>
                                {
                                    chainList?.map((item) => (
                                        <SkCheckbox
                                            key={item.id}
                                            checked={filterChain[item.key] === true}
                                            onChange={() => changeFilterChain(item.key)}
                                            className={colormodesettle.ColorMode ? "sk-checkbox-light" : "sk-checkbox-dark"}
                                        >
                                            <div style={{display: 'flex', alignItems: 'center', marginLeft: '20px'}}>
                                                <img src={item.svg} alt={item.alt} />
                                                <Span style={{marginLeft: '9px'}}>{item.label}</Span>
                                            </div>
                                            
                                        </SkCheckbox>
                                    ))
                                }
                            </div>
                        }
                    </FilterPart>
                }

                {
                    !detail &&
                    <FilterPart>
                        <div className='collapse-line' onClick={() => handleCollectionClick()}>
                            <FilterCaption>
                                Collections
                            </FilterCaption>
                            <FiChevronUpIcon
                            className={!isCollection ? 'rotate-up' : 'rotate-down'} />
                        </div>

                        {
                            isCollection &&
                            <></>
                        }
                    </FilterPart>
                }

                {
                        detail &&
                        <FilterPart>
                            <div className='collapse-line' onClick={() => handlePropertiesClick()}>
                                <FilterCaption>
                                    Properties
                                </FilterCaption>
                                <FiChevronUpIcon
                                className={!isProperties ? 'rotate-up' : 'rotate-down'} />
                            </div>

                            {
                                isProperties &&
                                <></>
                            }
                        </FilterPart>
                }
            </div>
        </Modal>
        </>
    )
}

export default memo(LeftFilterBarModal);