import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

export const Container = styled.div`
  background-color: ${props => props.theme.primBgColor};
  padding-top: 150px;
  padding-bottom: 100px;
`;

export const DateButton = styled.button`
  width: 60px;
  height: 51px;
  outline: 0;
  background: ${props => props.theme.primBgColor};

  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.theme.dateBtnBorderColor};

  color: #959595;
  font-weight: 500;

  transition: all 0.3s ease;

  &:hover {
    box-shadow: 2px 2px 20px 0px rgb(151 145 145 / 20%);
    transition: all 0.3s ease;
  }
`;

export const SearchSection = styled.div`
    background: ${props => props.theme.searchSectionBkColor};    
    height: 51px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    padding-right: 20px;
    color : ${({ theme }) => theme.text} ;

    @media (min-width:1100px) {
      flex-grow: 1;
    }

    @media (max-width:1099px) {
      width: 575px;
    }

    @media (max-width:644px) {
      width: 360px;
    }

    @media (max-width:450px) {
      width: 100%;
    }
`;

export const SearchInput = styled.input`
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

export const FiSearchIcon = styled(FiSearch)`
    width: 17px;
    height: 17px;
    margin-left: 20px;
    color: #757575;
`;

export const RankingColumnSpan = styled.div`
  color: ${props => props.theme.primaryColor};

  font-size: 17px;
  font-weight: 400;
`;