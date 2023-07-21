import styled from "styled-components";
import { FiChevronUp, FiX } from "react-icons/fi";
import { FaRegClock, FaEdit } from "react-icons/fa" ;
import { Link } from "@reach/router";
import { ImPriceTags } from "react-icons/im";
import { Button, Input, Statistic } from "antd";

export const Container = styled.div`
  background-color: ${props => props.theme.primBgColor};
  padding-top: 140px;
  padding-bottom: 100px;

  @media (max-width:1023px) {
    padding-bottom: 70px;
  }  
`;

export const NFTName = styled.div`
  font-size: 32px;
  line-height: 32px;
  font-weight: 800;
  color: ${props => props.theme.primaryColor};
`;

export const Text = styled.div`
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
  color: ${props => props.theme.primaryColor};
`;

export const SubText = styled.div`
  font-size: 15px;
  line-height: 15px;
  font-weight: 500;
  color: ${props => props.theme.saleCaptionColor};
`;

export const FaRegClockIcon = styled(FaRegClock)`
  color: ${props => props.theme.saleCaptionColor};
`;

export const AttrText = styled.div`
  font-size: 15px;
  line-height: 15px;
  font-weight: 500;
  color: ${props => props.theme.attrTextColor};
`;

export const AttrDiv = styled.div`
  border-top: 1px solid ${props => props.theme.attrBorderColor};
  gap: 30px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  align-items: center;

  margin-top: 20px;
`;

export const TimeSpan = styled.div`
  color: ${props => props.theme.saleDateColor};
  font-size: 15px;
  line-height: 19px;
  font-weight: 500;
`;

export const MainPrice = styled.div`
  color: ${props => props.theme.primaryColor};
  font-size: 26px;
  line-height: 26px;
  font-weight: 500;
`;

export const DetailSection = styled.div`
  border: 1px solid ${props => props.theme.attrBorderColor};

  border-radius: 6px;
`;

export const MoreColTitle = styled.div`
  font-size: 35px;
  line-height: 40px;
  font-weight: 800;
  color: ${props => props.theme.primaryColor};
`;

export const SectionTitle = styled.div`
  font-size: 20px;
  line-height: 20px;
  font-weight: 800;
  color: ${props => props.theme.primaryColor};
  position: relative;
`;

export const DetailsText = styled.div`
  font-size: 15px;
  line-height: 15px;
  font-weight: 400;
  color: ${props => props.theme.primaryColor};
`;

export const DescriptionText = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${props => props.theme.filterButtonColor};

  white-space: pre-wrap;
  line-height: 1.5715;

  margin-top: 15px;
`;

export const DetailSectionContent = styled.div`
  border-top: 1px solid ${props => props.theme.attrBorderColor};
`;

export const FiChevronUpIcon = styled(FiChevronUp)`
    font-size: 20px;
    color: ${props => props.theme.primaryColor};
`;

export const MakeOfferBtn = styled.button`
  color: ${props => props.theme.buttonColor};
  border: 1px solid ${props => props.theme.buttonColor};

  background: ${props => props.theme.primBgColor};
`;

export const RemoveIcon = styled(FiX)`
  color: ${props => props.theme.buttonColor};
  font-size: 24px;
`;

export const FaEditIcon = styled(FaEdit)`
  color: ${props => props.theme.buttonColor};
  font-size: 20px;
`;

export const ImPriceTagsIcon = styled(ImPriceTags)`
  color: ${props => props.theme.buttonColor};
  font-size: 20px;
`;

export const HistoryLabel = styled.div`
  color: ${props => props.theme.secondValueColor};
  font-size: 15px;
  line-height: 15px;
  font-weight: 500;

  margin-top: 10px;
`;

export const HistoryLog = styled.div`
  color: ${props => props.theme.secondValueColor};
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
`;

export const HistoryUserLink = styled(Link)`
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;
    color: ${props => props.theme.primaryColor};
`;

export const TableDiv = styled.div`
  color: ${props => props.theme.filterButtonColor};
  font-size: 17px;
  line-height: 17px;
  font-weight: 400;
  
  @media (max-width:1140px) {
    font-size: 15px;
    line-height: 15px;
  }
`;

export const OfferUserLink = styled(Link)`
  color: ${props => props.theme.filterButtonColor};
  font-size: 17px;
  line-height: 17px;
  font-weight: 400;

  @media (max-width:1140px) {
    font-size: 15px;
    line-height: 15px;
  }
`;

export const TabPanelDiv = styled.div`
  background: ${props => props.theme.searchSectionBkColor};
  border-radius: 6px;

  padding: 5px;
`;

export const ModalBottomDiv = styled.div`
  padding: 20px 0px 10px;
  text-align: center;
`;

export const ModalBtn = styled(Button)`
  height: 40px;
  color: white;
  background: #f70dff;
  padding: 0px 25px;
  border-color: #f70dff;
  border-radius: 10px;
  font-weight: bold;
  margin: 0px 10px;

  &:hover {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }

  &:focus {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }
`;

export const ModalCancelBtn = styled(Button)`
  height: 40px;
  color: #f70dff;
  background: white;
  padding: 0px 25px;
  border-color: #f70dff;
  border-radius: 10px;
  font-weight: bold;
  margin: 0px 10px 5px 10px;

  &:hover {
    color: #f70dff;
    background: white;
    border-color: #f70dff;
  }

  &:focus {
    color: #f70dff;
    background: white;
    border-color: #f70dff;
  }
`; 

export const PTag = styled.p`
  margin: 0px 0px 10px 0px;
  font-size: 14px;
`;

export const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
`;

export const StyledInput = styled(Input)`
  &.ant-input {
      padding: 6px!important;
      background: ${props => props.theme.modalPriceInputBkColor};
      color: ${props => props.theme.modalPriceInputTextColor};
  }
`;

export const StyledTokenImg = styled.img`
    width: 16px;
    height: 16px;
    margin: -5px 5px 0px;
`;

export const TopBarLabel = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px;
  padding-left: 15px;
`;

export const Label = styled.span`
  font-weight: bold;
  font-size: 14px;
`;

export const ModalTopBarLeft = styled.div`
    width: 70%;
    display: flex;
    justify-content: left;
    align-items: center;
    line-height: 1.2;
`;

export const StyledTopBarImg = styled.img`
    width: 40px;
    height: 45px;
    margin: 0px 10px;
`;

export const ImgInfo = styled.div`

`;

export const ModalTopBarRight = styled.div`
    width: 50%;
    justify-content: right;
    align-items: center;
    line-height: 1.2;
`;

export const StyledStatistic = styled(Statistic)`
  .ant-statistic-content {
    font-size: 14px!important;
    overflow: hidden!important;
    white-space: nowrap!important;

    .ant-statistic-content-prefix, .ant-statistic-content-value {
      font-size: 14px!important;
    }
  }
`;

export const ModalTotalBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 5px 10px 15px;
  align-items: center;
`;