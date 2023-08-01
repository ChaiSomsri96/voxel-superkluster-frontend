import React, { useEffect, useState } from "react";
import { Link } from "@reach/router";
import styled from "styled-components";
import ThemeToggleBtn from "./ThemeToggleBtn";
import { Drawer, Button, Menu, Space } from "antd";
import { MenuOutlined, HomeOutlined, CompassOutlined, DiffOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import "./../assets/stylesheets/Header/nav_drawer.scss";
import { navigate } from "@reach/router";
import { FaShoppingCart, FaBell } from "react-icons/fa";
import { useSelector} from 'react-redux';
import * as selectors from '../store/selectors';

const HamburgerButton = styled.div`
  color: ${props => props.theme.primaryColor};
  cursor: pointer;
`;

const MenuIconDiv = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.notificationBgc};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
`;

function NavDrawer({funcs, colormodesettle, onOpenCartModal}) {

  const { SubMenu } = Menu;
  const account = localStorage.getItem('account');
  let cartInfo = useSelector(selectors.cartInfoState).data;

  const [visible, setVisible] = useState(false) ;

  useEffect(()=>{
  },[]) ;

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const signIn = () => {
    setVisible(false);
    navigate('/wallet');
  }

  const showCartPopup = () => {
    setVisible(false);
    onOpenCartModal();
  }

  return (
    <>
      <HamburgerButton
      className="top-menu-icon"  
      onClick={showDrawer}
      >
        <MenuOutlined style={{fontSize: '22px'}} />
      </HamburgerButton>

      <Drawer
        placement="right"
        width={250}
        onClose={onClose}
        open={visible}
        bodyStyle={{ padding: "0", fontWeight: "bold", opacity: 2 }}
        extra = {
          <Space>
            {
              colormodesettle.ColorMode ?
              <img src='/image/logo/logo.PNG' alt='superkluster' style={{height:'33px',width:'100%'}}/>
              :<img src='/image/logo/logo2.png' alt='superkluster' style={{height:'33px', width:'100%'}}/>
            }
          </Space>
        }
      >
        <Menu
        style={{ width: 250 }}
        mode="inline"
        >
          <Menu.Item key="home">
            <Link to="/home" onClick={onClose}  >
              Home
            </Link>
          </Menu.Item>

          <SubMenu key="explore" title="Explore">
            <Menu.Item key="all_nfts">
              <Link to="/explore" onClick={onClose} >All NFTs</Link>
            </Menu.Item>
            <Menu.Item key="collections">
              <Link to="/explore-collections" onClick={onClose} >Collections</Link>
            </Menu.Item>
          </SubMenu>
        
          {
            account &&
            <SubMenu key="create" title="Create">
              <Menu.Item key="create_nft">
                <Link to="/create" onClick={onClose} >New NFT</Link>
              </Menu.Item>
              <Menu.Item key="create_collection">
                <Link to="/create-collections" onClick={onClose} >New Collection</Link>
              </Menu.Item>
            </SubMenu>   
          }        
        </Menu>
        
        {
          !account &&  
          <div className="signin-button-container">
            <button className="drawer-signin signin-button-btn" onClick={() => signIn()}>
              Sign in
            </button>
          </div>
        }

        { account &&
          <div className="nav-drawer-icons">
              <MenuIconDiv className="fa-bell-icon">
                  <FaBell size={16} />
              </MenuIconDiv>

              <MenuIconDiv className="header-shopping-cart" onClick={showCartPopup}>
                  {
                    cartInfo && cartInfo.data && cartInfo.data.length > 0 ?
                    <div className="badge">
                      <span className="cart-num">{cartInfo.data.length}</span>
                    </div>
                    :
                    null
                  }
                  <FaShoppingCart size={16} />
              </MenuIconDiv>
          </div>
        }
      </Drawer>
    </>
  );
}

export default NavDrawer;
