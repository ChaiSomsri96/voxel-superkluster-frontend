import React, { memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Select } from 'antd';

import * as actions from "./../../store/actions/thunks";
import * as selectors from './../../store/selectors';

import { DateButton, SearchSection,  SearchInput, FiSearchIcon } from "./styled-components";

const TopFilterBar = ({ colormodesettle, onDatePeriodChange, onCategoryChange, onSearchValueChange }) => {
    const { Option } = Select;

    const dispatch = useDispatch();
    const category = useSelector(selectors.categoryState).data;

    const [datePeriod, setDatePeriod] = useState(1);
    const [categoryId, setCategoryId] = useState(0);
    const [searchValue, setSearchValue] = useState('');

    const handleChange = (event) => {
        setSearchValue(event.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            // event trigger with searchValue
            // setSearchValue(inputValue);
            onSearchValueChange(searchValue);
        }
    };

    const handleCategoryChange = (value) => {
        // const selectedCategory = category.find(item => item.id === value);
        setCategoryId(value);
        onCategoryChange(value)
    }

    const changeDatePeriod = (value) => {
        setDatePeriod(value);
        onDatePeriodChange(value);
    }

    useEffect(() => {
        dispatch(actions.fetchNftCategory())
    }, [dispatch]);

    return (
        <div className='top-filter-bar'>
            <div className='filter-option1'>
                <div className='dropdownSelect one'>
                    <Select
                    value={categoryId}
                    style={{ width: "100%" }}
                    placeholder="Select..."
                    onChange={handleCategoryChange}
                    >
                        <Option key={0} value={0}>All Categories</Option>
                        {
                            category?.map((item) => (
                                <Option key={item.id} value={item.id}>{item.label}</Option>
                            ))
                        }
                    </Select>
                </div>
                <div className="date-range-period">
                    <div>
                        <DateButton className={`btn-first-radius ${(!colormodesettle.ColorMode && datePeriod === 1) ? 'active-btn-dark' : (colormodesettle.ColorMode && datePeriod === 1) ? 'active-btn-light' : ''}`} onClick={() => changeDatePeriod(1)}>1h</DateButton>
                        <DateButton className={`btn-border ${(!colormodesettle.ColorMode && datePeriod === 2) ? 'active-btn-dark' : (colormodesettle.ColorMode && datePeriod === 2) ? 'active-btn-light' : ''}`} onClick={() => changeDatePeriod(2)}>6h</DateButton>
                        <DateButton className={`btn-last-p btn-border ${(!colormodesettle.ColorMode && datePeriod === 3) ? 'active-btn-dark' : (colormodesettle.ColorMode && datePeriod === 3) ? 'active-btn-light' : ''}`} onClick={() => changeDatePeriod(3)}>24h</DateButton>
                    </div>
                    <div className='days-range'>
                        <DateButton className={`btn-first-p btn-border ${(!colormodesettle.ColorMode && datePeriod === 4) ? 'active-btn-dark' : (colormodesettle.ColorMode && datePeriod === 4) ? 'active-btn-light' : ''}`} onClick={() => changeDatePeriod(4)}>7d</DateButton>
                        <DateButton className={`btn-border ${(!colormodesettle.ColorMode && datePeriod === 5) ? 'active-btn-dark' : (colormodesettle.ColorMode && datePeriod === 5) ? 'active-btn-light' : ''}`} onClick={() => changeDatePeriod(5)}>30d</DateButton>
                        <DateButton className={`btn-border btn-last-radius ${(!colormodesettle.ColorMode && datePeriod === 6) ? 'active-btn-dark' : (colormodesettle.ColorMode && datePeriod === 6) ? 'active-btn-light' : ''}`} onClick={() => changeDatePeriod(6)}>All</DateButton>
                    </div>
                </div>
            </div>
            {
                <SearchSection> 
                    <SearchInput
                        placeholder="Search by collections"
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        value={searchValue}
                    />

                    <FiSearchIcon />
                </SearchSection>
            }
        </div>
    )
}

export default memo(TopFilterBar);