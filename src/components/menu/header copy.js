import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import Breakpoint, {
  BreakpointProvider,
  setDefaultBreakpoints,
} from "react-socks";

import styled from "styled-components";
import useOnclickOutside from "react-cool-onclickoutside";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch ,useSelector} from 'react-redux';
import { Link, useNavigate } from "@reach/router";
import { Dropdown, Menu, Statistic, Button, Spin, Checkbox, Tooltip } from "antd";
import { FaUser, FaEdit, FaTh, FaPuzzlePiece, FaQrcode, FaChartBar, FaShoppingCart, FaAngleDown, FaSearch, FaChevronLeft } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { BiAddToQueue, BiImageAdd } from "react-icons/bi";
import Swal from 'sweetalert2' ;
import { LoadingOutlined } from '@ant-design/icons';
import { useWeb3React } from "@web3-react/core";
import "antd/dist/antd.css" ;

import io from 'socket.io-client'; 
import { WS_API_URL } from "../../core/api";
import { getRoyalties, claimRoyalties, buyCart, isApproved, getApprove } from "../../core/nft/interact";
import { Axios } from "../../core/axios" ;

import useMetaMask from "../wallet-connect/metamask" ;
import { saveAccessToken } from "../../store/actions" ;
import * as actions from "../../store/actions/thunks";
import { getBalance } from '../../core/nft/interact' ;
import * as selectors from '../../store/selectors';

import NavDrawer from "./../NavDrawer";
import ThemeToggleBtn from "../ThemeToggleBtn" ;
import LocalButton from "./../common/Button";

import { formatUsdPrice, formatEthPrice, formatUSD } from "./../../utils";

import defaultAvatar from "../../assets/image/default_avatar.jpg";
import ethIcon from "../../assets/icons/ethIcon.png";
import defaultUser from "../../assets/image/default_user.png";
import vxlCurrency from "../../assets/image/vxl_currency.png";

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const ActionButton = styled(Button)`
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

const NaveMenuIcon = (props) => (
  <i
    {...props}
    getprops={({ isCurrent }) => {
      return {
        className: isCurrent ? "active" : "non-active",
      };
    }}
  />
);

const alarmStyle = {
  display: 'flex',
  justifyContent : 'center',
  position: 'absolute',
  zIndex: '100',
  background: 'rgb(249 73 255)',
  lineHeight: '1em',
  padding: '7px',
  width: '22px',
  borderRadius: '30px',
  top: '-3px',
  right: '-8px',
  color: '#ffffff',
  fontWeight: 'bold',
  fontSize: '10px'

}

const ProfileMenu = styled(Menu)`
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
`

const ProfileMenuStyle = {
  display: 'flex',
  // gap: '12px',
  alignItems: 'center',
  // color: 'rgba(0, 0, 0, 0.85)',
  fontWeight: '700',
  fontSize: '14px'
}

const NotificationButton = styled.button`
  position: absolute;
  right: 22% ;
  bottom: 2% ;
  width: 55% ;
  height: 40px ;
  color: white ;
  background: #f70dff ;
  padding: 0px 25px ;
  border-color: #f70dff ;
  border-radius: 10px ; 
  font-weight: bold ;
  opacity: 0.5 ;
  z-index: 1 ;
  display:flex ;
  align-items: center ;
  justify-content: center ;
  transition: width 1s, opacity 1s , transform 1s ;
  &:hover {
    opacity: 1 ;
    width: 57% ;

  }
`;

const ProfileMenuIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
`

const RowDiv = styled.div`
  display: flex;
`;
const RowAvatar = styled.div`
    position: relative;
`;
const RowInfo = styled.div`
  padding-left: 10px!important;
`;
const PTag = styled.p`
  margin: 0px 0px 0px 0px;
  font-size: 14px;
`;
const NoDataDiv = styled.div`
  margin: 20px 0px;
  color: grey;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  border-top: none !important;
`;

const DescriptionDiv = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalBtn = styled(Button)`
  height: 40px;
  color: white;
  background: #f70dff;
  padding: 0px 25px;
  border-color: #f70dff;
  border-radius: 10px;
  font-weight: bold;

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
let socket = null ;

const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

const Header = function ({ location , funcs  ,colormodesettle }) {
  const dispatch = useDispatch();

  const { isActive, disconnect } = useMetaMask();
  const { library, chainId } = useWeb3React();
  const account = localStorage.getItem('account');

  const [funcs1 , setFunctions1]=useState() ;
  const [colormodesettle1 , setColorModeSettle1] = useState() ;

  const [openMenu1, setOpenMenu1] = useState(false);
  const [openMenu2, setOpenMenu2] = useState(false);
  const [openMenu3, setOpenMenu3] = useState(false);
  const [openExploreMenu, setOpenExploreMenu] = useState(false);
  const [openCreateMenu, setOpenCreateMenu] = useState(false);
  const [logoSrc, setlogoSrc] = useState("");
  const [linkColor, setLinkColor] = useState("white");
  const [avatarSrc, setAvatarSrc] = useState('');
  const [isBalance, setBalance] = useState();
  const [user, setUser] = useState();
  const [isSigninDisplay, setSigninDisplay] = useState("block");
  const [isMenuIconDisplay, setMenuIconDisplay] = useState("none");
  const [isSearchLabel, setSearchLabel] = useState('');
  const [isSearchColor, setSearchColor] = useState('white');
  const [isNotificationData, setNotificationData] = useState([]) ;
  const [isNotificationDisplay, setNotificationDisplay] = useState(()=>{
    return JSON.parse(localStorage.getItem('NotificationNewCnt')) || 0 ;
  }) ;

  const [ethOption, setEthOption] = useState(false);

  const handleEthOption = async () => {
    if(ethOption) setEthOption(false);
    else setEthOption(true);
  }

  const notificationStyle = {
    width: window.innerWidth < 365 ?  40 : 50,
    height: window.innerWidth < 365 ? 40 : 50,
    paddingTop: window.innerWidth < 365 ? '8px' : '12px',
    textAlign:'center',
    borderRadius: '50%',
    cursor: 'pointer',
    position: 'relative',
    marginRight: (window.innerWidth < 400) ? '5px' : '20px'
  }

  const avatarStyle = {
    width: window.innerWidth < 365 ?  40 : 50,
    height: window.innerWidth < 365 ?  40 : 50,
    background: 'grey',
    border: '1px double grey',
    borderRadius: '50%',
    cursor: 'pointer',
    position: 'inherit',
    // marginRight: window.innerWidth < 400 ? '5px' : '20px'
  }

  const [onSearch, setOnSearch] = useState(false);

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
  

  const [_acount, setAccount] = useState(account);
  const accessTokenState = useSelector(selectors.accessToken) ;
  
  const accessToken = accessTokenState.data ? accessTokenState.data : null;
  
  const isBalanceDispatch= useSelector(selectors.myBalance).data;

  const Port = WS_API_URL;

  const navigate = useNavigate()

  const [royalties, setRoyalties] = useState(0);
  const [royaltiesETH, setRoyaltiesETH] = useState(0);
  const [claimProcess, setClaimProcess] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [isAgreeWithTerms, setAgreeWithTerms] = useState(false);

  useEffect(() => {
    if((!user || !user.public_address) && !account) return;
    const timerID = setInterval(() => {
      let address = (user && user.public_address) ? user.public_address : account;
      getRoyalties(address, library)
      .then((res) => {
        setRoyalties(res.royalty_vxl);
        setRoyaltiesETH(res.royalty_eth);
      })
      .catch((e) => {
        console.log(e);
      })
      
    }, 3000);
    return () => clearInterval(timerID);
  }, [user, account, library])

  const [cartInfo, setCartInfo] = useState([]);
  const [usdPrice, setUsdPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(1);
  const [totalCartPrice, setTotalCartPrice] = useState(0);

  const handleTermsCheck = (e) => {
    setAgreeWithTerms(e.target.checked);
  }

  useEffect(() => {
    if(!cartInfo || cartInfo.length == 0) {
      setTotalCartPrice(0);
      return;
    }
    let totalPrice = 0;
    for(let i = 0; i < cartInfo.length; i ++) {
      totalPrice += cartInfo[i].asset.price;
    }
    setTotalCartPrice(totalPrice);
  }, [cartInfo]);

  const getCartInfo = async () => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0px';
    if(!user || !user.public_address) return;
    if(!accessToken) return;
    const postData = {};
    Axios.post(`/api/cart/my-cart`, postData, { headers: {'Authorization': `Bearer ${accessToken}`} })
    .then((res) => {
      localStorage.setItem('cartInfo', JSON.stringify(res.data.data));
      setUsdPrice(res.data.usdPrice);
      setEthPrice(res.data.ethUsdPrice);
      setCartInfo(res.data.data);
      setCartLoading(false);
    })
    .then((e) => {
      setCartLoading(false);
    })
  }

  const [cartItemNum, setCartItemNum] = useState(0);

  useEffect(() => {
    let timerId = setInterval(() => {
      let cartData = JSON.parse(localStorage.getItem('cartInfo'));
      if(!cartData) setCartItemNum(0);
      else setCartItemNum(cartData.length);
    }, 1000);
    return () => {
      clearInterval(timerId) ;
    }
  }, [])

  // get cart info
  useEffect(() => {
    getCartInfo();
  }, [user, accessToken])

  useEffect(()=>{
    localStorage.setItem('searchValue','') ;
    setFunctions1(funcs) ;
    setColorModeSettle1(colormodesettle) ;
  },[]) ;

  useEffect(()=>{
    if(library && account) getApproveInfo(account, library) ;
    socket = io(`${Port}?data=${account}`);

    // when connected, look for when the server emits the updated count
    socket.on('callSocket', function(clients) {
      call_notification() ;
    })
  },[account, library]) ;

  useEffect(() => {
    const getUserInfo = async (account) => {
      const balance = await getBalance(account, library);
      localStorage.setItem("balance", balance);
      dispatch(actions.getMyBalance(balance));
      
      const userBalance = localStorage.getItem('balance');
      setBalance(userBalance);

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
    
    const account = localStorage.getItem('account') ;
    if (account) {
      getUserInfo(account)
    }
  }, [isActive ,colormodesettle.ProfileMode, library, account])

  const moveToServicePage = () => {
    closeBatchBuyModalClick.current.click();
    navigate('/terms-of-service');
  }

  const handleBtnClick1 = () => {
    setOpenMenu1(!openMenu1);
  };
  const handleBtnClick2 = () => {
    setOpenMenu2(!openMenu2);
  };
  const handleBtnClick3 = () => {
    setOpenMenu3(!openMenu3);
  };
  const handleExploreBtn = () => {
    setOpenExploreMenu(!openExploreMenu);
  };
  const handleCreateBtn = () => {
    setOpenCreateMenu(!openCreateMenu);
  };
  const closeMenu1 = () => {
    setOpenMenu1(false);
  };
  const closeMenu2 = () => {
    setOpenMenu2(false);
  };
  const closeMenu3 = () => {
    setOpenMenu3(false);
  };
  const closeExploreMenu = () => {
    setOpenExploreMenu(false);
  };
  const closeCreateMenu = () => {
    setOpenCreateMenu(false);
  };

  const ref1 = useOnclickOutside(() => {
    closeMenu1();
  });
  const ref2 = useOnclickOutside(() => {
    closeMenu2();
  });
  const ref3 = useOnclickOutside(() => {
    closeMenu3();
  });
  const exploreMenuRef = useOnclickOutside(() => {
    closeExploreMenu();
  });
  const createMenuRef = useOnclickOutside(() => {
    closeCreateMenu();
  });

  useEffect(()=>{
    if(colormodesettle.ColorMode) setlogoSrc("/image/logo/light_sk_logo.png") ;
    else setlogoSrc("/image/logo/dark_sk_logo.png")
    if(width < 600) setlogoSrc("/image/logo/mobile_logo.png");
  },[colormodesettle.ColorMode, width]) ;

  useEffect(() => {
    if (location.pathname !== "/explore") {
      setSearchLabel('');
    }

    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;

    if (
      location.pathname === '/' || location.pathname === '/home' || location.pathname.slice(0, 11) === '/ItemDetail' || 
      location.pathname.slice(0, 13) == '/assets/sell/' ||
      location.pathname.slice(0, 19) == '/collection-detail/' ||
      location.pathname.slice(0, 8) == '/author/' ||
      location.pathname === '/terms-of-service' || 
      location.pathname === '/privacy-policy' ||
      location.pathname === '/collection' || location.pathname === '/import-collections') {
      setLinkColor('black')
      setSearchColor('black')
    } else {
      setLinkColor('white')
      setSearchColor('white')
    }
    const scrollCallBack = window.addEventListener("scroll", () => {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");
        setLinkColor('black')
        setSearchColor('black')
      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");

        if (location.pathname === '/' || location.pathname === '/home' || location.pathname.slice(0, 11) === '/ItemDetail' || location.pathname === '/collection' || location.pathname === '/import-collections' || location.pathname === '/' || location.pathname.slice(0, 13) == '/assets/sell/' || location.pathname.slice(0, 19) == '/collection-detail/' || location.pathname.slice(0, 8) == '/author/' || location.pathname === '/terms-of-service' || location.pathname === '/privacy-policy'){
          setLinkColor( 'black' )
          setSearchColor('black')
        } else {
          setLinkColor( 'white')
          setSearchColor('white')
        }
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

  const removeAllNotification=()=>{
    const postData ={} ;
    Axios.post(
      `/api/assets/remove-all-notification`,
        postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      }
    ).then(resp => {
      setNotificationData([]) ;
      setNotificationDisplay(0) ;
      localStorage.setItem('NotificationNewCnt',0) ;
      
    }).catch((err) => {
      Swal.fire({
        title: 'Oops...',
        text: err.response.data.msg,
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      })    
    });
  }

  const signOut = async () => {
    await disconnect();
    setUser(undefined);
    await dispatch(saveAccessToken(undefined));
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

  const AvatarIcon = props => {
    return <div {...props}>
      <span>
        <img src={avatarSrc?avatarSrc:defaultUser} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
      </span>
    </div>;
  }

  const NotificationIcon = props => {
    return <div  {...props} >
      <span className="">
        <i className="fa fa-bell" style={{ width: '100%', height: '100%', borderRadius: '50%' }}></i>
        <span className={isNotificationData.length > 0 ? "" :"hiddenitem-notification"} style={alarmStyle}>{isNotificationData.length}</span>
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

  const navMenuIconStyle = {
    margin: '0px 5px 3px 0px', 
    fontSize: 16
  }

  const navLinkStyle = {
    alignItems: 'center',
    fontWeight: 'bold',
    padding: '15px'
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
    );
  }

  const call_notification =  ()=>{
    const postData = {}

    Axios.post(
      `/api/assets/notifications`,
        postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      }
    ).then(resp => {
      let sort_notification = (resp.data.data).sort((a,b)=> b.date - a.date);
      setNotificationData(sort_notification) ;
    }).catch(err => {
    });
  }

  useEffect( ()=>{
    if(!account || !accessToken) return;
      call_notification() ;
  },[account, library, accessToken])

  const deleteNotification = async (notification_id) =>{
      await Axios.post(
        `/api/assets/remove-notification`,
        {
          id: notification_id
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
        }
      ).then(resp => {
        call_notification() ;
      }).catch(err => {
        Swal.fire({
          title: 'Oops...',
          text: err.response.data.msg,
          icon: 'error',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        })        
      });
  }
  const redirect_itemdetail = (id, n_id , n_type) =>{
    deleteNotification(id);
  }

  const NotificatinClick =()=>{
    setNotificationDisplay(isNotificationData.length) ;
    localStorage.setItem('NotificationNewCnt',isNotificationData.length) ;
  }

  const NotificationMenuOverlay = () => {  
    return (
      <>
        <div className="notificationDel" style={isNotificationData && isNotificationData.length == '0' ? {position:'relative',paddingBottom:'0px'}:{position:'relative'}}>
          <ProfileMenu className="notification-scroll" style={{width:'350px' , maxHeight:'400px' , overflowY:'scroll'}}>
            {isNotificationData && isNotificationData.length == '0' && 
              <a className="notificationMsg">You have no notifications</a>
            }
            
          {isNotificationData && isNotificationData.map((notification , inx)=>(
                <Menu.Item key={notification.id} >
                  <div style={{display:'flex', justifyContent:'space-between'}} onClick = {()=>redirect_itemdetail(notification.id, notification.link , notification.type)}>
                    <Link to={
                              notification.type=="reject_verify" ?  
                                `/collection-detail/${notification.link}`
                                :
                                (notification.type=="reject_verify_user" ?
                                  `/settings`
                                  :
                                  `/ItemDetail/${notification.link}`)
                              
                              } 
                        style={ProfileMenuStyle}
                        onClick={()=>deleteNotification(notification.id)}
                      >
                      <ProfileMenuIcon className="headerIconSy">
                      <LazyLoadImage effect="opacity" className="lazy card-img-top" src={notification.avatar ? notification.avatar: defaultUser} style={{ width: 35, height: 35, borderRadius: '50%' , marginRight:'10px' }} alt="Bologna" />
                      </ProfileMenuIcon>
                      <span className="notificationMsg" style={{wordWrap:'break-word', marginLeft:'10px'}}>{(notification.msg && notification.msg.length > 15) ? notification.msg/*.slice(0,15) + '...'*/ : notification.msg}<p style={{fontWeight:'100'}}>
                        {
                          (parseInt(((Date.now()/1000 - notification.date))/3600/24)) > 0 
                            ? 
                              <>
                                {parseInt(((Date.now()/1000 - notification.date))/3600/24)} days,&nbsp;
                              </>  
                            : ""
                        }   
                        {
                          (parseInt(((Date.now()/1000 - notification.date))/3600)%24) > 0 
                            ? 
                              <>
                                {parseInt(((Date.now()/1000 - notification.date))/3600)%24} 
                              </>  
                            : "0"
                        } hours and&nbsp;
                        {
                          parseInt((((Date.now()/1000 - notification.date))%3600)/60) > 0 
                            ? 
                              <>
                                {(parseInt((((Date.now()/1000 - notification.date))%3600)/60))}  
                              </> 
                            : "0"
                        } mins ago</p> </span>
                    </Link>
                      <b  onClick={()=>deleteNotification(notification.id)} style={{display:'flex' , alignItems:'center'}}>
                        <i  className="fa fa-remove notification-delete-icon" ></i>
                      </b>

                  </div>
                </Menu.Item>
            ))}
            </ProfileMenu>
            <div> {isNotificationData && isNotificationData.length == '0' ?
              "":
              <NotificationButton onClick={removeAllNotification}>Clear notifications</NotificationButton>
              }
              </div>
          </div>
      </>
    );
  }

  //notification end
  const signinDisplay = {
    display: isSigninDisplay
  }

  const menuIconDisplay = {
    display: isMenuIconDisplay
  }

  const searchBoxStyle = {
    // color: isSearchColor
  }

  const handleBatchBuy = async() => {
    setLoadingState(true);
    
    const postData = {ethOption: ethOption};
    await Axios.post('/api/cart/check-out', postData, { headers: {'Authorization': `Bearer ${accessToken}`}})
      .then(async(res) => {
          await buyCart(ethOption, library, res.data.sellers, res.data.cartPrice, res.data.payload, res.data.deadline, res.data.signature, account)
          .then((result) => {
            closeBatchBuyModalClick.current.click();
            Swal.fire({
              title: 'It worked!',
              text: 'Congratulations, you now own the NFTs! You can view them on your profile page.',
              icon: 'success',
              confirmButtonText: 'Close',
              timer: 5000,
              customClass: 'swal-height'
            });
            localStorage.setItem('cartInfo', JSON.stringify([]));
            window.location.reload();
            setLoadingState(false);
            setEthOption(false);
            return;
          }).catch((err) => {
            closeBatchBuyModalClick.current.click();
            if(err.code != 4001) {
              Swal.fire({
                title: 'Oops...',
                text: 'Transaction Failed',
                icon: 'error',
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
              })
            }
            setLoadingState(false);
            setEthOption(false);
            return;
          });
      })
      .catch ((e) => {
        closeBatchBuyModalClick.current.click();
        console.log('error: ', e);
        Swal.fire({
          title: 'Error',
          text: 'Something went wrong!',
          icon: 'error',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        })
        setLoadingState(false);
        setEthOption(false);
        return;
      })
  }

  const goDetailPage = async (e, assetId) => {
    e.preventDefault();
    window.open(`/ItemDetail/${assetId}`, '_blank', 'noopener,noreferrer');
  }

  const closeBatchBuyModalClick = useRef(null);

  const removeFromCart = async (assetId) => {
    const postData = {
      id: assetId
    };
    await Axios.post('/api/cart/remove-cart', postData, { headers: {'Authorization': `Bearer ${accessToken}`}})
    .then(() => {
      getCartInfo();
    })
    .catch((e) => {
      Swal.fire({
        title: 'Oops...',
        text: 'Error while removing item from cart.',
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      })
    })
  }

  const [isShowBtnState, setShowBtnState] = useState(true);
  const [loadingState, setLoadingState] = useState(false);

  const getApproveInfo = async (account)=>{
    await isApproved(account, library)
        .then((res) => {
          if(res == true) {
            setShowBtnState(true);
          }else {
            setShowBtnState(false);
          }
        })
        .catch((err) => {
            setShowBtnState(localStorage.getItem('approvedToken'+account) == 'true');
            // approvedToken_account = localStorage.getItem('approvedToken'+account)
        });
  }

  const handleApproveAction = async () => {
    setLoadingState(true);
    await getApprove(account, library)
                .then((res) => {
                  // console.log(res) ;
                  // return;
                  if(res == true) {
                    setLoadingState(false);
                    setShowBtnState(true);
                    localStorage.setItem('approvedToken'+account, true);
                  }
                })
                .catch((err) => {
                  // Object.values(err).map(function(item) {
                  //   if (item.data && item.data.msg) {
                  //     notification['error']({
                  //       message: `${ item.data.msg }`,
                  //     });
                  //   }
                  // })
                  if(err.code != 4001) {
                    Swal.fire({
                      title: 'Oops...',
                      text: 'Transaction Failed',
                      icon: 'error',
                      confirmButtonText: 'Close',
                      timer: 5000,
                      customClass: 'swal-height'
                    })
                  }
                  setLoadingState(false);
                });
  }

  const removeAllItem = async () => {
    if (!cartInfo || cartInfo.length == 0) return;
    const postData = {};
    await Axios.post('/api/cart/remove-cart', postData, { headers: {'Authorization': `Bearer ${accessToken}`}})
    .then(() => {
      getCartInfo();
    })
    .catch((e) => {
      Swal.fire({
        title: 'Oops...',
        text: 'Error while clearing cart.',
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      })
    })
  }

  return (
    <>
      <header className='navbar white' id="myHeader">
        <div className="custom-container">
          <div className="row w-100-nav">

            {/* Logo */}
            <div className="logo px-0">
              <div className="navbar-title navbar-item">
                <NavLink to="/">
                  <img
                    src={logoSrc}
                    className="img-fluid d-block logo-2"
                    alt=""
                    style={window.innerWidth < 365 ? {height:'40px'}:{height:'49px'}}
                  />
                </NavLink>
              </div>
            </div>


            {/* Search NFT inputbox */}
            { !onSearch && 
              <div className="search_mobile" style={window.innerWidth < 365 ? {width:'auto', top:'-13px'}:{width:'auto'}} onClick={() => setOnSearch(true)}>
                <Tooltip placement="bottom"  title="search NFT">
                  <FaSearch style={{width:'20px', height:'20px'}} />
                </Tooltip>  
              </div>
            }
            {
              <div style={{display:onSearch? 'initial' : 'none', position:'relative', top:'-21px'}}>
                <div style={{cursor:'pointer', display:'inline', paddingRight:'4px'}} onClick={() => setOnSearch(false)}>
                  <FaChevronLeft style ={{width:'20px', height:'20px'}}/>
                </div>
                <input type="text" onChange = {handleSearchInput} value = {isSearchLabel} placeholder="Find your next NFT" onKeyPress={handleKeyPress} style={{border:'none', borderRadius:'6px', fontSize:'15px', background:'rgba(131, 100, 226, 0.1)', height:'34px', outline:'none', padding:'4px 11px', maxWidth:'50%'}}/>
              </div>
            }
            
            <div className="search">
              <input
                id="quick_search"
                className="xs-hide"
                name="quick_search"
                placeholder="Find your next NFT"
                type="text"
                style={searchBoxStyle}
                onChange={handleSearchInput}
                onKeyPress={handleKeyPress}
                value={isSearchLabel}
              />
            </div>

            {/* Main menu */}
            <BreakpointProvider>
              <Breakpoint xl>
                <div className="menu">
                  <div className="navbar-item">
                    <div ref={exploreMenuRef}>
                      <div
                        className="dropdown-custom btn"
                        onMouseEnter={handleExploreBtn}
                        onMouseLeave={closeExploreMenu}
                        style={{paddingRight:'10px'}}
                      >
                        Explore <FaAngleDown/>
                        <span className="lines"></span>
                        {openExploreMenu && (
                          <div className="item-dropdown">
                            <div className="dropdown" onClick={closeExploreMenu}>
                              <NavLink to="/explore" style={{  ...navLinkStyle }}><NaveMenuIcon><FaPuzzlePiece style={navMenuIconStyle} /></NaveMenuIcon>All NFTs</NavLink>
                              <NavLink to="/explore-collections" style={navLinkStyle}><NaveMenuIcon><FaQrcode style={navMenuIconStyle} /></NaveMenuIcon>Collections</NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="navbar-item">
                    <div ref={ref2}>
                      <div
                        className="dropdown-custom btn"
                        onMouseEnter={handleBtnClick2}
                        onMouseLeave={closeMenu2}
                        style={{paddingRight:'10px'}}
                      >
                        Stats <FaAngleDown/>
                        <span className="lines"></span>
                        {openMenu2 && (
                          <div className="item-dropdown">
                            <div className="dropdown" onClick={closeMenu2}> 
                              <NavLink to="/ranking" style={navLinkStyle}><NaveMenuIcon><FaChartBar style={navMenuIconStyle} /></NaveMenuIcon>Rankings</NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {
                    accessToken ?
                      <div className="navbar-item">
                        <div ref={createMenuRef}>
                          <div
                            className="dropdown-custom btn"
                            onMouseEnter={handleCreateBtn}
                            onMouseLeave={closeCreateMenu}
                            style={{paddingRight:'10px'}}
                          >
                            Create <FaAngleDown/>
                            <span className="lines"></span>
                            {openCreateMenu && (
                              <div className="item-dropdown">
                                <div className="dropdown" onClick={closeCreateMenu}>
                                  <NavLink to="/create" style={{ ...navLinkStyle }}><NaveMenuIcon><BiImageAdd style={navMenuIconStyle} /></NaveMenuIcon>New NFT</NavLink>
                                  <NavLink to="/create-collection" style={navLinkStyle}><NaveMenuIcon><BiAddToQueue style={navMenuIconStyle} /></NaveMenuIcon>New Collection</NavLink>
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


            {/* Notification icon/dropdown */}      
            {
              accessToken ?
                !onSearch && <div className="mainside" style={{ top: 10, right: 30 }}>
                  <div className="connect-wal" >
                    
                    <Dropdown onClick={()=>NotificatinClick()} overlay={() => NotificationMenuOverlay()} overlayStyle={{ paddingTop: '12px' }} placement={"bottomRight"} trigger={["click"]}>
                        <NotificationIcon className='notificationIconstyle' style={notificationStyle} />  
                    </Dropdown>

                    <div className='cartstyle' data-bs-toggle="modal" data-bs-target="#cartModal" onClick={getCartInfo} style={window.innerWidth < 365 ? {marginRight:'5px', width:40, height:40}:window.innerWidth < 400 ? {marginRight:'5px'} : {}}>
                      {
                        cartItemNum > 0 ?
                        <div style={{position:'absolute', top:'0px', right:'0px', borderRadius:'50%', backgroundColor:'#f70dff', width:'20px', height:'20px', justifyContent:'center', display:'flex'}}><b style= {{color:'white', fontSize:'13px'}}>{cartItemNum}</b></div>
                        :<></>
                      }
                      <FaShoppingCart style ={{width:'40%', height: '30%'}} />
                    </div>

                    <Dropdown overlay={() => ProfileMenuOverlay(user)} overlayStyle={{ marginTop: '15px' }} placement={"bottomRight"} trigger={["click"]}>
                      <AvatarIcon style={avatarStyle} />
                    </Dropdown>

                    <NavDrawer funcs={funcs} colormodesettle={colormodesettle} />

                  </div>
                </div>
              : !onSearch && <div className="mainside" style={{ top: 18, right: 30 }}>
                  <div className="connect-wal" >
                    <div style={signinDisplay}>
                      {
                        <LocalButton to="/wallet">
                          Sign in
                        </LocalButton>
                      }
                    </div>
                    <div style={menuIconDisplay}>
                      <NavLink to="/wallet" style={{ width: '100%', padding: '10px 12px', borderRadius:'50%' }}>
                        <span><i className="fa fa-credit-card"></i></span>
                      </NavLink>
                    </div>
                    <NavDrawer  funcs={funcs} colormodesettle={colormodesettle} />
                  </div>
                </div>
            }

            {/* Theme Toggle Button */}
            <ThemeToggleBtn  funcs={funcs1} colormodesettle={colormodesettle1}/>
            
          </div>
        </div>
      </header>
      <div className="modal fade" id="cartModal" tabIndex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15, width: '98%' }}>
              <div style={{paddingLeft:'0.5rem', paddingBottom:'1rem', display:'flex', justifyContent:'space-between'}}>
                  <h4 className="mt-3" id="listingLabel"><FaShoppingCart style={{marginRight:'0.5rem'}}/> My cart</h4>
                  <input type="button" id="modalClose" ref={closeBatchBuyModalClick} className={colormodesettle.ColorMode?"btn-close mt-3":"btn-close btn-close-white mt-3"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
              </div>
              <Spin spinning={loadingState} indicator={antIcon} delay={500}>
                <div className="modal-body text-white Non-scroll-tab" style={{overflowY: 'auto', maxHeight:'450px', borderTop:''}}>
                  <div className="d-flex justify-content-between" style={{paddingLeft:'0.5rem', borderBottom:'solid 1px #dee2e6', marginBottom:'0.5rem'}}>
                    <h4 style={{fontSize:'17px'}}>{cartInfo.length} NFT{cartInfo.length != 1 ? 's':''}</h4>
                    <h4 style={{fontSize:'14px', color:'grey', cursor:'pointer'}} onClick={removeAllItem}>clear all</h4>
                  </div>
                  {
                    cartInfo && cartInfo.length > 0 ?
                      cartInfo.map((data, index) => (
                          <div className="border-top-0" key={index} style = {{marginBottom:'0.3rem'}}>
                            <RowDiv className="item_author justify-content-between" style={{alignItems:'center'}}>
                              <div className="d-flex" style={{cursor:'pointer', alignItems:'center', width:'70%', overflow:'hidden'}} onClick={(e) => goDetailPage(e, data.asset.id)}>
                                <RowAvatar className="author_list_pp">
                                  <span>
                                    <LazyLoadImage effect="opacity" className="lazy" src={data.asset.image ? data.asset.image : defaultAvatar} alt="" />
                                  </span>
                                </RowAvatar>
                                <RowInfo className="author_list_info" style={{  paddingTop: 0, lineHeight: 1.2, display:'flex', alignItems:'center', width:'80%'}}>
                                  <div style={{width:'100%'}}>
                                    <h5 style={{margin:'0', fontSize:'15px', marginBottom:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{data.asset.name}</h5>
                                    <p style={{fontSize:'13px', color:'#727272', marginBottom:'0px', marginTop:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>
                                      {
                                        `${data.collection.name}`
                                      }
                                    </p>
                                    {(data.asset && data.asset.royalty_fee && data.asset.royalty_fee > 0) ? <p style={{fontSize:'13px', color:'#727272', marginBottom:'0px', marginTop:'4px'}}>royalty: {data.asset.royalty_fee} %</p> : <></>}
                                    {(data.asset && data.asset.royalty_fee && data.asset.royalty_fee > 0) ? <></> : (data.collection && data.collection.royalty_fee && data.collection.royalty_fee > 0) ? <p style={{fontSize:'13px', color:'#727272', marginBottom:'0px', marginTop:'4px'}}>royalty: {data.collection.royalty_fee} %</p> : <></>}
                                  </div>
                                </RowInfo>
                              </div>
                              <div style={{display:'flex', justifyContent:'space-between', width:'30%', alignItems:'center'}}>
                                <DescriptionDiv><h5 style={{fontSize:'13.5px', marginBottom:'0px'}}><img style={{ width: 16, height: 16, marginBottom: 5 ,marginLeft: 0 }} src={ethOption? ethIcon:vxlCurrency} />
                                  {
                                    !ethOption?
                                    ` ${formatUsdPrice(data.asset.price / usdPrice)}`
                                    :
                                    ` ${formatEthPrice(data.asset.price / ethPrice)}`
                                  }
                                </h5><h5 style={{fontSize:'13.5px'}}>&nbsp;$&nbsp;{formatUSD(data.asset.price)}</h5></DescriptionDiv>
                                <div style={{display:'flex', alignItems:'center', marginBottom:'4px'}}>
                                  <button className={colormodesettle.ColorMode?"btn-close removeItem":"btn-close btn-close-white removeItem"} style={{width:'0.3rem !important', height:'0.3rem !important'}} onClick={() => removeFromCart(data.asset.id)}/>
                                </div>
                              </div>
                            </RowDiv>
                          </div>))
                        :<NoDataDiv>No NFTs</NoDataDiv>
                  }
                </div>
                <div style={{marginLeft:'1rem', marginRight:'1rem', borderBottom:'solid 1px #dee2e6'}}></div>
                <div className="toatlValueStyle" style={{borderRadius:'5px', margin:'0.5rem 1rem 0 1rem', padding:'0.5rem 0.5rem 0 0.5rem', display:'flex', justifyContent:'space-between'}}>
                  <h4>Total</h4>
                  <h4><img style={{ width: 23, height: 23, marginBottom: 5 ,marginLeft: 0 }} src={ethOption? ethIcon:vxlCurrency} />
                  {
                    !ethOption?
                    ` ${(totalCartPrice && usdPrice) ? formatUsdPrice(totalCartPrice / usdPrice):0} ($ ${formatUsdPrice(totalCartPrice)})`
                    :
                    ` ${(totalCartPrice && ethPrice) ? formatEthPrice(totalCartPrice / ethPrice):0} ($ ${formatUsdPrice(totalCartPrice)})`
                  }
                  </h4>
                </div>
                <div style={{margin:'0.5rem 1rem 0 1rem', padding:'0.5rem 0.5rem 0 0.5rem'}}>
                  <Checkbox onChange={handleTermsCheck} checked = {isAgreeWithTerms}>By checking this box, I agree to SuperKluster's <span style={{ fontWeight: 'bold', color: 'rgb(247 13 255)' }} onClick={moveToServicePage}>Terms of Service</span></Checkbox>
                  <Checkbox style={{marginLeft:'0px'}} checked={ethOption} onClick={handleEthOption}>Check this box to pay with your<b> Ethereum balance**</b></Checkbox>
                </div>
                <div style={{margin:'0 1rem', paddingBottom:'0.5rem', paddingTop:'0.5rem'}}>
                  {
                    isShowBtnState ?
                    <ModalBtn onClick={handleBatchBuy} style={{width:'100%'}} disabled = {(!cartInfo || cartInfo.length == 0 || !isAgreeWithTerms)? true:false}>Check out</ModalBtn>
                    : <ModalBtn onClick={handleApproveAction} style={{width:'100%'}} disabled = {(!cartInfo || cartInfo.length == 0 || !isAgreeWithTerms)? true:false}>Approve</ModalBtn>
                  }
                  <div style={{textAlign:'left'}}>
                    <PTag className='NorTxt' style={{marginLeft:'5px', marginTop:'10px' ,  fontSize:'12px'}}>*This transaction will include the SuperKluster 1.5% transaction fee</PTag>
                    <PTag className='NorTxt' style={{marginLeft:'5px' ,  fontSize:'12px'}}>**You will be paying for gas fee to swap $ETH to $VXL into your wallet.</PTag>
                  </div>
                </div>
              </Spin>
            </div>
          </div>
        </div>
    </>
  );
};
export default Header;
