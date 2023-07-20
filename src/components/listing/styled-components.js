import styled from "styled-components";
import { FaDollarSign } from "react-icons/fa";
import { BiTime } from "react-icons/bi";
import { Statistic, Collapse } from "antd";

export const Container = styled.div`
    background: ${props => props.theme.primBgColor};
`;

export const Title = styled.div`
    font-size: 48px;
    line-height: 48px;
    font-weight: 800;
    color: ${props => props.theme.primaryColor};

    margin-left: 30px;
`;

export const SubTitle = styled.div`
    font-size: 16px;
    line-height: 16px;
    font-weight: 800;

    color: ${props => props.theme.primaryColor};
`;

export const TabButton = styled.button`
    height: 70px;
    flex: 1;
    outline: 0;
    border: 1px solid ${props => props.theme.dropdownBorderColor};
    background: ${props => props.theme.primBgColor};
    color: ${props => props.theme.primaryColor};
`;

export const BtnSpan = styled.span`
    font-size: 20px;
    line-height: 20px;
    font-weight: 500;
`;

export const FaDollarSignIcon = styled(FaDollarSign)`
    font-size: 20px;
    margin-right: 15px;
`;

export const BiTimeIcon = styled(BiTime)`
    font-size: 24px;
    margin-right: 15px;
`;

export const FeeLabel = styled.div`
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;

    color: ${props => props.theme.primaryColor};
`;

export const ModalTopBar = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px 5px;
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

export const PTag = styled.p`
    margin: 0px;
    font-size: 14px;
`;

export const ModalTopBarRight = styled.div`
    width: 30%;
    display: flex;
    justify-content: right;
    align-items: center;
    line-height: 1.2;
`;

export const StyledTokenImg = styled.img`
    width: 16px;
    height: 16px;
    margin: -5px 5px 0px;
`;

export const StyledStatistic = styled(Statistic)`
  .ant-statistic-content {
    font-size: 14px!important;
    overflow: hidden!important;
    white-space: nowrap!important;

    .ant-statistic-content-prefix, .ant-statistic-content-value {
      font-size: 14px!important;
      font-weight: bold!important;
      color: #727272!important;
    }
  }
`;

export const StyledCollapse = styled(Collapse)`
    background: white;
    border-radius: 15px;
    overflow: hidden;
`;

export const CollapsePanelHeader = styled.span`
    font-size: 18px;
    font-weight: bold;
`;