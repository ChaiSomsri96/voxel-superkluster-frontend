import styled from "styled-components";
import { Menu, Button } from "antd";

export const MenuIconDiv = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.notificationBgc};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;

    @media (max-width: 899px) {
        display: none;
    }
`;

export const ProfileMenu = styled(Menu)`
    border-radius: 3px;
    padding: 15px 20px;
    box-shadow: 8px 8px 40px 0px rgb(0 0 0 / 10%);
    width: 245px;
    max-height: 80vh;
    overflow:auto;
    
    & li.ant-dropdown-menu-item {
        padding: 8px 0px;
    }

    & h5 {
        margin-bottom: 4px;
        font-size: 16px;
        font-weight: 600;
    }
    
    & div.menu-text {    
        text-overflow: ellipsis;
        width: 200px;
        overflow: hidden;
    }
`;

export const ProfileMenuStyle = {
    display: 'flex',
    // gap: '12px',
    alignItems: 'center',
    // color: 'rgba(0, 0, 0, 0.85)',
    fontWeight: '700',
    fontSize: '14px'
}

export const ActionButton = styled(Button)`
    width: auto !important;
    height: 30px;
    color: white;
    background: #f70dff;
    padding: 0px 25px;
    border-color: #f70dff;
    border-radius: 10px;
    font-weight: bold;
    margin: 5px 0px;

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

export const ProfileMenuIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
`;