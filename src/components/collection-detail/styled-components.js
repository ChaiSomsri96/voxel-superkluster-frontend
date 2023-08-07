import styled from "styled-components";

import { FaTelegramPlane, FaTwitter, FaInstagram, 
    FaDiscord, FaGlobe, FaRegStar, FaShareAlt } from 'react-icons/fa';

import {BsChevronDown, BsChevronUp} from "react-icons/bs";

export const Container = styled.div`
  background-color: ${props => props.theme.primBgColor};
  padding-top: 100px;
  padding-bottom: 100px;
`;

export const CollectionName = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 30px;
    line-height: 30px;
    font-weight: 800;
`;

export const CollectionCon = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 16px;
    font-weight: 800;
    line-height: 16px;
`;

export const CollectionPre = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 16px;
    font-weight: 400;
    line-height: 16px;
`;

export const CollectionDesc = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;
    word-break: keep-all; 
    white-space:pre-wrap;

    width: 900px;
`;

export const ShowMoreText = styled.div`
    font-size: 16px;
    line-height: 22px;
    color: ${props => props.theme.primaryColor};
    margin-right: 12px;
    font-weight: 400;
`;

export const CollectionFactor = styled.div`
    color: ${props => props.theme.primaryColor};
    font-size: 22px;
    font-weight: 800;
    line-height: 22px;
`; 

export const SocialIconBtn = styled.div`
    font-size: 24px;
    color: ${props => props.theme.primaryColor};
`;

export const BsChevronDownIcon = styled(BsChevronDown)`
    color: ${props => props.theme.primaryColor};
`;
export const BsChevronUpIcon = styled(BsChevronUp)`
    color: ${props => props.theme.primaryColor};
`;

export const FaTwitterIcon = styled(FaTwitter)`
    font-size: 24px;
    color: ${props => props.theme.primaryColor};
`;

export const FaInstagramIcon = styled(FaInstagram)`
    font-size: 24px;
    color: ${props => props.theme.primaryColor};
`;

export const FaDiscordIcon = styled(FaDiscord)`
    font-size: 24px;
    color: ${props => props.theme.primaryColor};
`;

export const FaTelegramPlaneIcon = styled(FaTelegramPlane)`
    font-size: 24px;
    color: ${props => props.theme.primaryColor};
`;

export const FaGlobeIcon = styled(FaGlobe)`
    font-size: 24px;
    color: ${props => props.theme.primaryColor};
`;

export const FaRegStarIcon = styled(FaRegStar)`
    font-size: 24px;
    color: ${props => props.theme.primaryColor};
`;

export const FaShareAltIcon = styled(FaShareAlt)`
    font-size: 24px;
    color: ${props => props.theme.primaryColor};
`;

export const Splitter = styled.div`
    width: 1px;
    background: ${props => props.theme.splitterBkColor};
`;

export const ColAvatar = styled.div`
    width: 170px;
    height: 170px;
    border-radius: 50%;
    box-shadow: 0px 6px 20px #00000029;
    border: ${props => props.theme.collectionAvatarBorder};

    position: absolute;
    left: 20px;
    bottom: -30px;
`;

export const ActionSection = styled.div`
    border: 1px solid ${props => props.theme.filterBorder};

    padding: 20px 24px 27px 24px;

    border-radius: 10px;
`;

export const ActionCaption = styled.div`
    color: ${props => props.theme.primaryColor};

    font-weight: 800;
    font-size: 18px;
    line-height: 18px;
`;

export const ActionSpan = styled.div`
    color: ${props => props.theme.actionCheckBoxColor};

    font-size: 16px;
    line-height: 16px;
    font-weight: 500;

    margin-left: 15px;
`;

export const ActivityColumnSpan = styled.div`
color: ${props => props.theme.primaryColor};
`;