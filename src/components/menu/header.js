import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "@reach/router";
import Breakpoint, {
  BreakpointProvider,
  setDefaultBreakpoints,
} from "react-socks";
import { FaUser, FaEdit, FaTh, FaPuzzlePiece, FaQrcode, FaChartBar, FaBell, FaShoppingCart, FaAngleDown, FaSearch, FaChevronLeft } from "react-icons/fa";
import useOnclickOutside from "react-cool-onclickoutside";
import { BiAddToQueue, BiImageAdd } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { Dropdown, Menu, Statistic, Button, Spin, Checkbox, Tooltip, Modal } from "antd";
import { useDispatch ,useSelector} from 'react-redux';
import * as selectors from '../../store/selectors';
import "./../../assets/stylesheets/Header/index.scss";
import ThemeToggleBtn from "../ThemeToggleBtn";
import CartModal from "./CartModal";
import LocalButton from "../common/Button";
import { MenuIconDiv, ProfileMenu, ProfileMenuStyle, ActionButton, ProfileMenuIcon } from "./styled-components";
import defaultUser from "../../assets/image/default_user.png";
import vxlCurrency from "../../assets/image/vxl_currency.png";
import ethIcon from "../../assets/icons/ethIcon.png";
import useMetaMask from "../wallet-connect/metamask";
import { saveAccessToken, saveAuthorAccount } from "../../store/actions" ;
import { useWeb3React } from "@web3-react/core";  
import { getBalance, claimRoyalties } from "../../core/nft/interact";
import * as actions from "../../store/actions/thunks";
import { Axios } from "../../core/axios";
import Swal from 'sweetalert2' ;
import NavDrawer from "./../NavDrawer";
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      return {
        className: isCurrent ? "active" : "non-active",
      };
    }}
  />
);

const NavMenuIcon = ({ isCurrent, ...props }) => (
  <i
    {...props}
    className={isCurrent ? "active" : "non-active"}
  />
);

const SearchInputTriggerButton = styled.div`
  color: ${props => props.theme.primaryColor};
  cursor: pointer;
`;

const SearchInputCloseButton = styled.div`
  color: ${props => props.theme.primaryColor};
  cursor: pointer;
  padding-left: 10px;
  padding-right: 10px;
`;

const QuickSearchInput = styled.input`
    color: ${props => props.theme.secondaryColor};
`

const HeaderBar = styled.header`
  background: ${props => props.theme.headerMenuColor};

  .quick-search {
    background: ${props => props.theme.headerSearchBkColor};
  }

  .quick-search-mobile-div {
    background: ${props => props.theme.headerSearchBkColor};
    border-radius: 6px;
    flex: 1;
    display: flex;
    align-items: center;
  }
`

const Header = function ({ location , funcs  ,colormodesettle }) {
  const dispatch = useDispatch();

  const { isActive, disconnect } = useMetaMask();
  const { library, chainId } = useWeb3React();
  const account = localStorage.getItem('account');

  const navigate = useNavigate();

  const [royalties, setRoyalties] = useState(0);
  const [royaltiesETH, setRoyaltiesETH] = useState(0);
  const [claimProcess, setClaimProcess] = useState(false);

  const [logoSrc, setlogoSrc] = useState("");
  const [isSearchLabel, setSearchLabel] = useState('');
  const [user, setUser] = useState();
  const [avatarSrc, setAvatarSrc] = useState('');
  //menu setting
  const [openExploreMenu, setOpenExploreMenu] = useState(false);
  const [openCreateMenu, setOpenCreateMenu] = useState(false);

  //theme setting
  const [colormodesettle1 , setColorModeSettle1] = useState() ;
  const [funcs1 , setFunctions1]=useState() ;

  const [isSigninDisplay, setSigninDisplay] = useState("block");
  const [isMenuIconDisplay, setMenuIconDisplay] = useState("none");
  
  const [clickedSearch, setClickedSearch] = useState(false);

  // open cart popup
  const [cartPopupOpen, setCartPopupOpen] = useState(false);

  const avatarStyle = {
    width: window.innerWidth < 365 ?  40 : 50,
    height: window.innerWidth < 365 ?  40 : 50,
    
    background: 'grey',
    border: '1px double grey',
    borderRadius: '50%',
    cursor: 'pointer',
    position: 'inherit',

    marginLeft: '20px'
  }

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

  const [width, height] = useWindowSize();

  const accessTokenState = useSelector(selectors.accessToken) ;
  const accessToken = accessTokenState.data ? accessTokenState.data : null;

  const isBalanceDispatch= useSelector(selectors.myBalance).data;


  let cartInfo = useSelector(selectors.cartInfoState).data;

  const AvatarIcon = props => {
    return <div {...props}>
      <span>
        <img src={avatarSrc?avatarSrc:defaultUser} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
      </span>
    </div>;
  }

  const claimRoyalty = async () => {
    setClaimProcess(true);

    await claimRoyalties(account, library)
      .then((res) => {
        Swal.fire({
          title: 'It worked!',
          text: 'You claimed royalty successfully.',
          icon: 'success',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        })      
      }).catch((err) => {
        if(err.code != 4001) {
          Swal.fire({
            title: 'Oops...',
            text: 'Royalty claiming is failed!',
            icon: 'error',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
          })
        }
      });

    setClaimProcess(false);
  }

  const ProfileMenuOverlay = (user) => {
    return (
      <ProfileMenu className="Non-scroll-tab">
        
        <Menu.Item key={1}>
          <h5 className="pinkarr">Username</h5>
          <Link to={`/author/${account}`} style={ProfileMenuStyle}><div className="menu-text"><span>{(user && user.username) ?? "Unnamed"}</span></div> </Link>
        </Menu.Item>

        <Menu.Item key={2}>
          <h5 className="pinkarr">Balance</h5>
          <div className="menu-text" style={{ display: 'flex' }}>
            <img src={vxlCurrency} alt="balance" style={{ width: 18, height:18, margin: '0px 3px 3px 0px'}}/>
            <Statistic className="balance-statistic" value={isBalanceDispatch} precision={2} />&nbsp; <a href="https://etherscan.io/token/0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31" target="_blank"><span style={{color:'#f60cfe'}}> (VXL)</span></a>
          </div>
        </Menu.Item>

        <Menu.Item key={3}>
          <a href={`https://etherscan.io/address/${account}`} target="_blank">
            <h5 className="pinkarr">My Wallet</h5>
            <div className="menu-text" style={{ fontWeight: 'normal' }}>{user? user.public_address:'0x00'}</div>
          </a>
        </Menu.Item>

        {(royalties > 0  || royaltiesETH > 0) && 
          <Menu.Item key={9}>
            <h5 className="pinkarr">Royalties</h5>
            {
              royalties > 0 ? 
              <div className="menu-text" style={{ display: 'flex' }}>
              
              <img src={vxlCurrency} alt="balance" style={{ width: 18, height: 19, margin: '0px 3px 3px 0px'}}/>
                <Statistic className="balance-statistic" value={royalties} precision={2}/>&nbsp;<a href="https://etherscan.io/token/0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31" target="_blank"><span style={{color:'rgb(246, 12, 254)'}}>(VXL)</span></a>
            </div>
            : <></>
            }
            {
              royaltiesETH > 0.000009 ? 
              <div className="menu-text" style={{ display: 'flex' }}>
                <img src={ethIcon} alt="balance" style={{ width: 18, height: 19, margin: '0px 3px 3px 0px'}}/>
                  <Statistic className="balance-statistic" value={parseInt(parseFloat(royaltiesETH) * 100000) / 100000}/>
                  
              </div>
            : <></>
            }
            {
              claimProcess ? <Spin size="default" tip="Processing..." /> : <ActionButton className="btn-main lead style-btn mr15 ItemBtnHover" onClick={claimRoyalty}>Claim</ActionButton>
            }
          </Menu.Item>
        }

        <Menu.Divider />

        <Menu.Item key={8}>
          <h5 className="pinkarr">Buy $VXL</h5>
          <a href="https://shibaswap.com/#/swap?outputCurrency=0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31" target="_blank" style={ProfileMenuStyle}>
            <img src={vxlCurrency} alt="balance" style={{ width: 18, margin: '0px 3px 3px 0px'}}/>
            <span style={{wordBreak: 'keep-all'}}>Buy $VXL on Shibaswap</span>
          </a>
        </Menu.Item>
        <Menu.Item key={11}>
          <a href="https://app.uniswap.org/#/swap?outputCurrency=0x16CC8367055aE7e9157DBcB9d86Fd6CE82522b31&inputCurrency=ETH" target="_blank" style={ProfileMenuStyle}>
            <img src={vxlCurrency} alt="balance" style={{ width: 18, margin: '0px 3px 3px 0px'}}/>
            <span style={{wordBreak: 'keep-all'}}>Buy $VXL on Uniswap</span>
          </a>
        </Menu.Item>
        
        <br/>

        <Menu.Item key={4}>
          <Link to="/collection" style={ProfileMenuStyle}>
            <ProfileMenuIcon className="headerIconSy">
              <FaTh />
            </ProfileMenuIcon>
            <span style={{marginLeft:'12px'}}>My Collections</span>
          </Link>
        </Menu.Item>

        <Menu.Item key={5}>
          <Link to={`/author/${account}`} style={ProfileMenuStyle}>
            <ProfileMenuIcon className="headerIconSy">
              <FaUser />
            </ProfileMenuIcon>
            <span style={{marginLeft:'12px'}}>My profile</span>
          </Link>
        </Menu.Item>

        <Menu.Item key={6}>
          <Link to="/settings" style={ProfileMenuStyle}>
            <ProfileMenuIcon className="headerIconSy">
              <FaEdit />
            </ProfileMenuIcon>
            <span style={{marginLeft:'12px'}}>Edit profile</span>
          </Link>
        </Menu.Item>

        <Menu.Item key={7}>
          <div onClick={signOut} style={ProfileMenuStyle}>
            <ProfileMenuIcon className="headerIconSy">
              <FiLogOut />
            </ProfileMenuIcon>
            <span style={{marginLeft:'12px'}}>Sign out</span>
          </div>
        </Menu.Item>
      </ProfileMenu>
    )
  }

  // Find your next NFT
  const handleSearchInput = async (e) => {
    let value = e.target.value;
    setSearchLabel(value);
  }

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      localStorage.setItem('searchValue',isSearchLabel) ;
      localStorage.setItem('isSearchKey' , '1') ;
      navigate('/explore', { state: {value: `${isSearchLabel}`} });
    }
  }

  const signOut = async () => {
    await disconnect();
    setUser(undefined);
    
    await dispatch(saveAccessToken(undefined));
    await dispatch(saveAuthorAccount(undefined)); 

    localStorage.removeItem('accessToken');
    localStorage.removeItem('account');
    localStorage.removeItem('balance');
    localStorage.removeItem('itemId');
    localStorage.removeItem('searchValue');
    // 
    localStorage.removeItem('itemId');
    localStorage.removeItem('currentPrice');
    localStorage.removeItem('itemData');
    localStorage.removeItem('footerflg');
    localStorage.removeItem('UserName');
    localStorage.removeItem('itemurl');
    localStorage.removeItem('isSearchKey');

    navigate('/');
  }

  const searchBtnTrigger = () => {
    setClickedSearch(true);
  }

  const closeSearchInput = () => {
    setClickedSearch(false);
  }

  const showCartPopup = () => {
    setCartPopupOpen(true);
  }
  const handleCancel = () => {
    setCartPopupOpen(false);
  };
  const handleOpenCartModal = () => {
    setCartPopupOpen(true);
  }
  // Menu Setting Functions
  // Explore
  const handleExploreBtn = () => {
    setOpenExploreMenu(!openExploreMenu);
  };
  const closeExploreMenu = () => {
    setOpenExploreMenu(false);
  };
  const exploreMenuRef = useOnclickOutside(() => {
    closeExploreMenu();
  });

  // Create
  const handleCreateBtn = () => {
    setOpenCreateMenu(!openCreateMenu);
  };
  const closeCreateMenu = () => {
    setOpenCreateMenu(false);
  };
  const createMenuRef = useOnclickOutside(() => {
    closeCreateMenu();
  });

  useEffect(() => {
    const getUserInfo = async (account) => {
      const balance = await getBalance(account, library);

      localStorage.setItem("balance", balance);
      dispatch(actions.getMyBalance(balance));

      const { data } = await Axios({
        url: `/api/users/connect?public_address=${account}`,
      });

      setUser(data);
      const userAvatar = data["avatar"];
      if (userAvatar) {
        setAvatarSrc(userAvatar)
      } else {
        const imgSrc = defaultUser;
        setAvatarSrc(imgSrc);
      }
    }

    const account = localStorage.getItem('account');

    if (account) {
      getUserInfo(account)
    }

  }, [isActive, colormodesettle.ProfileMode, library, account])

  //Logo Setting
  useEffect(()=>{
    if(colormodesettle.ColorMode) setlogoSrc("/image/logo/light_sk_logo.png") ;
    else setlogoSrc("/image/logo/dark_sk_logo.png")
    if(width < 600) setlogoSrc("/image/logo/mobile_logo.png");

    if(width >= 760) setClickedSearch(false);
  },[colormodesettle.ColorMode, width]) ;

  useEffect(() => {
    if (location.pathname !== "/explore") {
      setSearchLabel('');
    }

    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;

    const scrollCallBack = window.addEventListener("scroll", () => {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");
      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      }
      if (window.pageYOffset > sticky) {
        //  closeMenu();
      }
    });

    if (window.innerWidth < 768) {
      setSigninDisplay("none")
      setMenuIconDisplay("block")
    } 
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, [location]);

  useEffect(()=>{
    localStorage.setItem('searchValue','') ;
    setFunctions1(funcs) ;
    setColorModeSettle1(colormodesettle) ;
  },[]) ;

  return (
    <>
      <HeaderBar id="myHeader" className="navbar white">
        
        <div className="main-container header-container">

          {
            clickedSearch ? 
            null
            :
            <div>
              <NavLink to="/"> 
                <img
                  className="superkluster-logo"
                  src={logoSrc}
                  alt="superkluster-logo"
                />
              </NavLink>
            </div>
          }
          
          
          {
            clickedSearch ?
            <div className="quick-search-mobile-div">
              <QuickSearchInput
                className="quick-search-mobile"
                type="text"
                onChange={handleSearchInput}
                onKeyPress={handleKeyPress}
                value={isSearchLabel}
                name="quick_search"
                placeholder="Find your next NFT"
              />
              <SearchInputCloseButton onClick={() => closeSearchInput()}>
                <CloseOutlined style={{fontSize: '22px'}} />
              </SearchInputCloseButton>
            </div>
            :
            null
          }

          <div className="search">
              <QuickSearchInput
                id="quick_search"
                className="xs-hide quick-search"
                name="quick_search"
                placeholder="Find your next NFT"
                type="text"
                onChange={handleSearchInput}
                onKeyPress={handleKeyPress}
                value={isSearchLabel}
              />
          </div>

          <div className="margin-auto"></div>

          {/* Main menu */}
          <BreakpointProvider>
              <Breakpoint xl>
                <div className="menu">
                  <div className="navbar-item">
                    <div className="menuRef" ref={exploreMenuRef}>
                      <div
                        className="dropdown-custom btn"
                        onMouseEnter={handleExploreBtn}
                        onMouseLeave={closeExploreMenu}
                      >
                        Explore <FaAngleDown/>
                        <span className="lines"></span>
                        {openExploreMenu && (
                          <div className="item-dropdown">
                            <div className="dropdown" onClick={closeExploreMenu}>
                              <NavLink to="/explore" className="nav-link-style">
                                <NavMenuIcon>
                                  <FaPuzzlePiece className="nav-menu-icon-style" />
                                </NavMenuIcon>
                                 All NFTs
                              </NavLink>
                              <NavLink to="/explore-collections" className="nav-link-style">
                                <NavMenuIcon>
                                  <FaQrcode className="nav-menu-icon-style" />
                                </NavMenuIcon>
                                  Collections
                              </NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {
                    accessToken ?
                      <div className="navbar-item">
                        <div className="menuRef" ref={createMenuRef}>
                          <div
                            className="dropdown-custom btn"
                            onMouseEnter={handleCreateBtn}
                            onMouseLeave={closeCreateMenu}
                          >
                            Create <FaAngleDown/>
                            <span className="lines"></span>
                            {openCreateMenu && (
                              <div className="item-dropdown">
                                <div className="dropdown" onClick={closeCreateMenu}>
                                  <NavLink to="/create" className="nav-link-style"><NavMenuIcon><BiImageAdd className="nav-menu-icon-style" /></NavMenuIcon>New NFT</NavLink>
                                  <NavLink to="/create-collection" className="nav-link-style"><NavMenuIcon><BiAddToQueue className="nav-menu-icon-style" /></NavMenuIcon>New Collection</NavLink>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    : null
                  }
                  
                </div>
              </Breakpoint>
            </BreakpointProvider>
            
            {
              clickedSearch ?
              null
              :
              <SearchInputTriggerButton
                className="search-trigger-btn"
                onClick={() => searchBtnTrigger()}
              >
                <SearchOutlined style={{fontSize: '22px'}} />
              </SearchInputTriggerButton>   
            }
            

            {
              accessToken ?
              <>
                <MenuIconDiv className="header-notification-icon">
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
                {
                  clickedSearch ?
                    null
                  :
                    <Dropdown overlay={() => ProfileMenuOverlay(user)} overlayStyle={{ marginTop: '15px' }} placement={"bottomRight"} trigger={["click"]}>
                      <AvatarIcon style={avatarStyle} />
                    </Dropdown>
                }
                
              </>
              :
              <LocalButton className="connect-wallet" to="/wallet">
                Sign in
              </LocalButton>
            }

            {
              clickedSearch ?
              null
              :
              <ThemeToggleBtn  funcs={funcs1} colormodesettle={colormodesettle1}/>
            }

            <NavDrawer  funcs={funcs} colormodesettle={colormodesettle} onOpenCartModal={handleOpenCartModal} /> 
        </div>
      </HeaderBar>
      <CartModal 
        cartPopupOpen={cartPopupOpen} 
        handleCancel={handleCancel} 
        colormodesettle={colormodesettle}
      />
    </>
  );
};
export default Header;