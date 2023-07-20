import React, { memo, useState, useEffect } from 'react';
import { Select } from 'antd';
import { orderList } from "./../components/constants/filters";
import { BsGridFill, BsGrid3X3GapFill } from 'react-icons/bs';
import { TbRefresh } from 'react-icons/tb';
import styled from 'styled-components';
import { ReactComponent as DarkFilterIcon } from "./../assets/svg/dark_filter.svg";
import { ReactComponent as LightFilterIcon } from "./../assets/svg/light_filter.svg";
import "./../assets/stylesheets/Explore/top_filter_bar.scss";
import { FiSearch, FiChevronLeft } from "react-icons/fi";

const IconButton = styled.button`
    width: 51px;
    height: 51px;
    background: ${props => props.theme.iconBtnBkColor};
    border: 1px solid ${props => props.theme.iconBtnBorderColor};
    display: flex;
    align-items: center;
    justify-content: center;

    color: ${props => props.theme.iconBtnTextColor};

    transition: all 0.15s ease-in-out 0s;

    &.active-click {
        background: ${props => props.theme.iconHoverBkColor};
        color: ${props => props.theme.iconHoverColor};
    }

    &:hover {
        color: ${props => props.theme.iconHoverColor};
    }
`;

const RefreshButton = styled.button`
    width: 51px;
    height: 51px;
    background: ${props => props.theme.iconBtnBkColor};
    border: 1px solid ${props => props.theme.iconBtnBorderColor};
    display: flex;
    align-items: center;
    justify-content: center;

    color: ${props => props.theme.refreshBtnTextColor};

    &:hover {
        background: ${props => props.theme.featureBtnHoverColor};
    }
`;

const TbRefreshIcon = styled(TbRefresh)`
    width: 21px;
    height: 21px; 
`;

const FiSearchIcon = styled(FiSearch)`
    width: 17px;
    height: 17px;
    margin-left: 20px;
    color: #757575;
`;

const FiChevronLeftIcon = styled(FiChevronLeft)`
    color: ${props => props.theme.filterButtonColor};
`;

const FilterButton = styled.button`
    height: 51px;
    width: 112px;
    border-radius: 6px;
    background: ${props => props.theme.iconBtnBkColor};
    border: 1px solid ${props => props.theme.iconBtnBorderColor};
    color: ${props => props.theme.filterButtonColor};

    font-size: 15px;
    font-weight: 400;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding-left: 20px;
    padding-right: 20px;

    transition: all 0.15s ease-in-out 0s;

    &:hover {
        background: ${props => props.theme.featureBtnHoverColor};
    }
`;

const SearchSection = styled.div`
    background: ${props => props.theme.searchSectionBkColor};    
    flex-grow: 1;
    height: 51px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    color : ${({ theme }) => theme.text} ;
`;

const SearchInput = styled.input`
    ::placeholder {
        color: ${({ theme }) => theme.searchInputPlaceholder} ;
    }
    outline: none;
    border-width: 0px;
    background: transparent;
    flex-grow: 1;

    font-size: 16px
    font-weight: 400;
`;

const TopFilterBar = ({ colormodesettle, clickFilterButton, onFilter }) => {
    const [viewMethod, setViewMethod] = useState(localStorage.getItem('viewMethod')? localStorage.getItem('viewMethod'):'detail');
    const [filter, setFilter] = useState(false);
    
    const [searchValue, setSearchValue] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchValueParam = queryParams.get('search_value');
        return searchValueParam ? searchValueParam : '';
    });
    const [inputValue, setInputValue] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchValueParam = queryParams.get('search_value');
        return searchValueParam ? searchValueParam : '';
    });
    const [orderValue, setOrderValue] = useState(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchValueParam = queryParams.get('order_type');

        return searchValueParam ? parseInt(searchValueParam) : null;
    });

    const handleDetailClick = async () => {
        setViewMethod('detail');
        localStorage.setItem('viewMethod', 'detail');
    }

    const handleTileClick = async () => {
        setViewMethod('tile');
        localStorage.setItem('viewMethod', 'tile');
    }

    const onClickFilterButton = () => {
        setFilter(!filter);
        clickFilterButton();
    }

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            // event trigger with searchValue
            setSearchValue(inputValue);

            onFilter({order_type: orderValue, search_value: inputValue});
        }
    };

    const handleOrderChange = (value) => {
        setOrderValue(value);

        onFilter({order_type: value, search_value: searchValue});
    }

    return (
        <>
        <div className='top-filter-bar'>
            {
                <div>
                    <FilterButton onClick={() => onClickFilterButton()}>
                        {
                            filter ?
                            (
                                colormodesettle.ColorMode ? 
                                <LightFilterIcon />
                                :
                                <DarkFilterIcon />
                            )
                            :
                            <FiChevronLeftIcon />
                        }
                        <span style={{marginLeft: '10px'}}>
                            Filters
                        </span>
                    </FilterButton>
                </div>
            }

            {
                <SearchSection>
                    <SearchInput
                        placeholder="Search by NFTs"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        value={inputValue}
                    />

                    <FiSearchIcon />
                </SearchSection>
            }

            {
                <div className='dropdownSelect one' style={{ width: "200px" }}>
                    <Select 
                        options={orderList} 
                        style={{ width: "100%" }}
                        onChange={handleOrderChange}
                        value={orderValue}
                    ></Select>
                </div>
            }

            {
                <div className='nft-view'>
                    <IconButton className={viewMethod === 'detail' ? `detail-view active-click` : `detail-view`} onClick={handleDetailClick}>   
                        <BsGridFill className='grid-icon' />
                    </IconButton>
                    <IconButton className={viewMethod === 'tile' ? `tile-view active-click` : `tile-view`} onClick={handleTileClick}>
                        <BsGrid3X3GapFill className='grid-icon' />
                    </IconButton>
                </div>
            }


            {
                <div>
                    <RefreshButton className="icon-btn-radius">
                        <TbRefreshIcon />
                    </RefreshButton>
                </div>
            }
        </div>
        </>
    );

}

export default memo(TopFilterBar);