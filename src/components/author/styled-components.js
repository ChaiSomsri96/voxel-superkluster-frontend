import styled from "styled-components";

export const Container = styled.div`
  background-color: ${props => props.theme.primBgColor};
  padding-top: 100px;
  padding-bottom: 100px;
`;


export const AuthorAvatar = styled.div`
    width: 170px;
    height: 170px;
    border-radius: 50%;
    box-shadow: 0px 6px 20px #00000029;
    border: ${props => props.theme.collectionAvatarBorder};
    position: absolute;
    left: 20px;
    bottom: -30px;
`;

export const AuthorName = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 30px;
    line-height: 30px;
    font-weight: 800;

    margin-right: 12px;
`;

export const FollowSection = styled.div`
    border-radius: 6px;
    background: ${props => props.theme.bannerSlideIconColor};
    width: 260px;
    height: 100px;
    border: 1px solid ${props => props.theme.iconBtnBorderColor};
    padding: 24px 20px;
`;

export const WalletSection = styled.div`
    background: ${props => props.theme.bannerSlideIconColor};
    border: 1px solid ${props => props.theme.iconBtnBorderColor};
    display: flex;
    align-items: center;
    padding: 5px 24px 5px 10px;
    border-radius: 23px;
    margin-top: 20px;
`;

export const WalletAddress = styled.div`
    flex-grow: 1;
    font-size: 15px;
    font-weight: 400;
    color: ${props => props.theme.primaryColor};

    margin-left: 5px;
`;

export const FollowCaption = styled.div`
    font-size: 15px;
    line-height: 15px;
    font-weight: 400;
    color: #808080;
`;

export const FollowNumber = styled.div`
    font-size: 15px;
    line-height: 15px;
    font-weight: 400;
    color: ${props => props.theme.primaryColor};
`;