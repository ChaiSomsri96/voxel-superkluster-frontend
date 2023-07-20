import React, { memo, useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "@reach/router";
import styled, { createGlobalStyle } from 'styled-components';
import { Tabs, Button, Pagination, Spin, Input, Select } from 'antd';
import { FaTh, FaBacon, FaTelegramPlane, FaTwitter, FaInstagram, FaDiscord, FaGlobe, FaPen, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

import Activity from "./../components/Activity";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { BsGridFill, BsGrid3X3GapFill } from 'react-icons/bs';
import { Axios } from "./../core/axios";

import NftCard from './../components/NftCard';
import NftCardSmall from './../components/NftCardSmall';
import EmptyCard from './../components/EmptyCard';
import EmptyCardSmall from './../components/EmptyCardSmall';

import Swal from 'sweetalert2' ;
import 'sweetalert2/src/sweetalert2.scss' ;
import { LoadingOutlined } from '@ant-design/icons';
import { useFormik, Form, FormikProvider, Field } from 'formik';
import * as Yup from 'yup';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import ImageUpload from 'image-upload-react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import imageCompression from 'browser-image-compression';
import { create } from 'ipfs-http-client';
import { INFURA_PROJECT_ID, INFURA_API_KEY } from "./../core/api";
import { setReveal } from "./../core/nft/interact";
import { useWeb3React } from "@web3-react/core";
import { currencyLogo } from "./../store/utils";
import debounce from 'lodash.debounce';
import collectionDefaultBanner from "./../assets/image/collection_default_banner.jpg";
import defaultAvatar from "./../assets/image/default_avatar.jpg";

const GlobalStyles = createGlobalStyle`
  header#myHeader {
     
  }
`;

const CreatorName = styled.span`
    color: #f70dff;
`;

const InfoDiv = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    display: block;
  }
`;

const InfoFirstDiv = styled.div`
  display: flex;
  justify-content: center;
  box-shadow:2px 8px 15px 3px rgb(0 0 0 / 3%) ;
`;

const InfoSecondDiv = styled.div`
  display: flex;
  justify-content: center;
  box-shadow:2px 8px 15px 3px rgb(0 0 0 / 3%) ;
`;

const InfoFirst = styled.div`
  border: 1px solid #f3f3f3;
  width: 144px;
  height: 88px;
  padding: 10px 0px;
  
  display: flex;
  flex-direction: column;
  justify-content: center;

  

  &:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
`;

const InfoSecond = styled.div`
  border: 1px solid #f3f3f3;
  width: 144px;
  height: 88px;
  padding: 10px 0px;
  
  display: flex;
  flex-direction: column;
  justify-content: center;

 

  &:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const H3 = styled.h3`
  margin-bottom: 10px;
`;

const DescriptionDiv = styled.div`
  width: 50%;
  text-align: center;
  margin: 20px auto 40px auto;
  max-height: 25vh;
  overflow-y: auto;

  @media(max-width: 768px) {
    width: 90%;
  }
`;

const NoDataDiv = styled.div`
  margin: 20px 0px;
  color: grey;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const SocialLinkDiv = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const SocialIconBtn = styled(Button)`
  font-size: 20px;
  margin: 0px 20px;
  cursor: pointer;
  color: #f70dff;
  border: none;
  padding: 0px 10px;

  &:hover,
  &:focus {
    color: #f70dff;
    border: none;
  }

  @media (max-width: 480px) {
    margin: 0px 5px !important;
  }
`;

const VerifiedButton = styled(Button)`
  color: white;
  border: 1px solid #f70dff;
  background: #f70dff;
  border-radius: 5px;
  font-weight: bold;
  margin: 0 5px;

  &:hover,
  &:focus {
    outline: none;
    box-shadow: none;
    border: 1px solid #f70dff;
  }
`;

const DisabledButton = styled(Button)`
  color: black;
  border: 1px dashed black !important;
  background: white;
  border-radius: 5px;
  font-weight: bold;
  margin: 0 5px;
  
  &:hover,
  &:focus {
    color: black;
    // add other hover and focus styles here
  }
`;

const StyledButton = styled(Button)`
  color: #f70dff;
  border: 1px dashed #f70dff !important;
  background: white;
  border-radius: 5px;
  font-weight: bold;
  margin: 0 5px;

  &:first-child {
    @media (max-width: 504px) {
      display: block;
      margin-bottom: 10px;
    }
  }

  &:hover, &:focus {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }
`;

const ApplyButton = styled(Button)`
    width: auto;
    height: 35px;
    color: white;
    background: #f70dff;
    padding: 0px 4%;
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

const ContentDiv = styled.div`
  padding: 0px 10px;
  
  @media(max-width: 576px) {
    justify-content: center;
  }
`;

const ModalBottomDiv = styled.div`
  padding: 20px 0px 10px;
  text-align: center;
  border-top: 1px solid;
`;

const ValueDiv = styled.div`
  padding:8px 10px;
  display:flex;
  justify-content: space-between;
`;

const ModalCancelBtn = styled.button`
  height: 40px;
  color: #f70dff;
  background: white;
  padding: 0px 25px;
  border-color: #f70dff;
  border-radius: 10px;
  font-weight: bold;
  margin: 0px 10px;

  &:hover,
  &:focus {
    color: #f70dff;
    background: white;
    border-color: #f70dff;
  }
`; 

const ModalBtn = styled(Button)`
  height: 40px;
  color: white;
  background: #f70dff;
  padding: 0px 25px;
  border-color: #f70dff;
  border-radius: 10px;
  font-weight: bold;
  margin: 0px 10px;

  &:hover,
  &:focus {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }
`; 

const imageUploaderStyle = {
  background: 'black',
  opacity:'0.2',
  cursor: 'pointer',
  marginTop: 10,
  border: '5px dashed #00000026',
  borderRadius: 15,
  boxShadow: 'none'
}

const iconStyle = {
  fontSize: 18,
  padding: '5px 10px 5px 0px'
}

const CreateSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  unlockContent: Yup.string().required('Unlock content is required'),
});

const btnStyle = {
  padding: '5px 10px',
  backgroundColor: 'white',
  borderColor: '#f70dff',
  borderRadius: 7,
  color: '#f70dff'
}

const removeLabelStyle = {
  border: '1px solid #dfdfdf',
  borderRight: 'none',
  padding: 20,
  margin: 0,
  cursor: 'pointer'
}

const StyledInput = styled(Input)`
    &.ant-input {
        padding: 6px!important;
    }
`;

const options_compress = {
  maxSizeMB: 1,
  useWebWorker: true
}

const searchBar_Desktop = {
  padding: '0px 10px',
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',
  marginBottom:'20px'
};

const searchBar_mobile = {
  padding: '0px 10px',
  display:'flex',
  flexDirection:'row',
  justifyContent:'space-between',
  marginBottom:'10px'
};

const TabButton = styled(Button)`
  color: black;
  background: #f6f6f6;
  border-color: #f6f6f6;
  border-radius: 5px;
  font-weight: bold;
  margin-right: 12px;
  margin-bottom: 9px;
  
  &.active,
  &:hover,
  &:focus {
    color: white;
    background: #f70dff;
    border-color: #f70dff;
  }
  
  @media (max-width: 480px) {
    padding: 6.4px 5px;
  }
`;

const inputStyles = {
  background: 'transparent',
  outline: 'none',
  borderWidth: '0px',
  flexGrow: '1',
  flexShrink: '1'
};

const searchNFT_input = {
  ...inputStyles
};

const price_input = {
  ...inputStyles,
  width: '100%',
  textAlign: 'center'
};

const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

const CollectionDetailPage = function ({ collectionId , colormodesettle}) {

  const { Option } = Select;

  const mobileSize = 800;
  const account = localStorage.getItem('account');

  const formik = useFormik({
    initialValues: {
      name: '',
      unlockContent:''
    },
    validationSchema: CreateSchema,
    onSubmit: (evt) => {
      console.log(evt)
    }
  });

  const { TabPane } = Tabs;

  const { library } = useWeb3React();
  const preRevealModalClose = useRef(null);
  const revealModalClose = useRef(null);

  const [preRevealLoading, setPreRevealLoading] = useState(false);

  const [isDetailData, setDetailData] = useState([]);
  const [isCollectionCreator, setCollectionCreator] = useState(null);
  const [tempArr, setTempArr] = useState([]);
  const [isShowUserBtn, setShowUserBtn]=useState(false);
  const [isVerified , setVerified] = useState(false) ;
  const [isAddItemBtnState, setAddItemBtnState]=useState(false);
  const [isTotalNum, setTotalNum]=useState(1);
  const [isPageNum, setPageNum]=useState(1);
  const [isPageSize, setPageSize]=useState(25);
  const [isLoading, setLoading]=useState(false);
  const [isusdPrice , setUsdPrice] = useState() ;
  const [ethPrice , setEthPrice] = useState(1) ;
  const [isName, setName] = useState('');
  const [isItemDescription, setItemDescription] = useState('') ;
  const { errors, handleSubmit } = formik;
  const [isPropertyInputData, setPropertyInputData] = useState([{id: 0, type: '', name: ''}]);
  const [imageSrc, setImageSrc] = useState('');
  const [uploadPercent, setUploadPercent] = useState(0);
  const [isPropertyCount, setPropertyCount] = useState(1);
  const [isFormPreview , setForm_preview] = useState(null) ;
  const [isOtherTypeSrc, setOtherTypeSrc] = useState('');
  const [isPreImgForm, setPreImgForm] = useState({});
  const [isForm, setForm] = useState(null);
  const [isRawAnimation, setRawAnimation] = useState('');
  const [isRawImage, setRawImage] = useState('');
  const [imageSrc_preview, setImageSrc_preview] = useState();
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [isSelectCollectionId, selectCollectionId] = useState('');
  const [traits, setTraits] = useState([]);
  const [traitId, setTraitId] = useState([]);
  const [filterTraits, setFilterTraits] = useState([]);
  const [filterCount, setFilterCount] = useState(0);

  const [currency, setCurrency] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleTraitClick = (id) => {
    setTraitId(traitId.map((item, index) => {
      return index == id ?
        item.checked == false?
          {checked: true} : {checked:false}
        :
        item
    }));
  }

  const[searchTrait, setSearchTrait] = useState('');

  const handleSearchTraitChange = async (e) => {
    setSearchTrait(e.target.value);
  }

  /*
  useEffect(() => {
    let tmp = [];
    for (let i = 0; i < traits.length; i ++) {
      if(traits[i].trait_type.toLowerCase().includes(searchTrait.toLowerCase())) {
        tmp.push(traits[i]);
        tmp[tmp.length - 1].id = i;
        continue;
      }
      if(traits[i].display_type != 'text') continue;
      let selected = traits[i];
      let tmpValues = [];
      for(let j = 0; j < selected.asset_traits.length; j ++) {
        if(selected.asset_traits[j].value.toLowerCase().includes(searchTrait.toLowerCase())) {
          let p = selected.asset_traits[j];
          p.id = j;
          tmpValues.push(p);
        }
      }
      if(tmpValues.length > 0) {
        tmp.push({
          id: i,
          display_type: selected.display_type,
          trait_id: selected.trait_id,
          trait_type: selected.trait_type,
          asset_traits: tmpValues
        });
      }
    }
    setFilterTraits(tmp);
  }, [searchTrait, traits]) */

  useEffect(() => {
    const filteredTraits = traits.reduce((acc, trait, index) => {
      if (trait.trait_type.toLowerCase().includes(searchTrait.toLowerCase())) {
        acc.push({ ...trait, id: index });
        return acc;
      }
  
      if (trait.display_type !== 'text') {
        return acc;
      }
  
      const filteredAssetTraits = trait.asset_traits.filter(assetTrait => {
        return assetTrait.value.toLowerCase().includes(searchTrait.toLowerCase());
      }).map((assetTrait, index) => ({ ...assetTrait, id: index }));
  
      if (filteredAssetTraits.length > 0) {
        acc.push({
          id: index,
          display_type: trait.display_type,
          trait_id: trait.trait_id,
          trait_type: trait.trait_type,
          asset_traits: filteredAssetTraits
        });
      }
  
      return acc;
    }, []);
    
    setFilterTraits(filteredTraits);
  }, [searchTrait, traits]);

  const [status, setStatus] = useState(0);

  const addRowEvent = async () => {
    let properties = isPropertyInputData.concat({
      id: isPropertyInputData.length, type: '', name: ''
    });
    setPropertyCount(isPropertyCount + 1)
    setPropertyInputData(properties);
  }

  const propertyInputEvent = (e, idx) => {
    let properties = [...isPropertyInputData];

    const { name, value } = e.target ;
    properties.map((property,inx) =>{
      inx == idx && (property[name] = value)
    });

    setPropertyInputData(properties);
  }
  const [currentFilter, setCurrentFilter] = useState([]);

  /*
  const getTraits = async () => {
    await Axios.get("/api/collections/traits/" + collectionId)
    .then(async({data}) => {
      setTraits(data);
      let res = [];
      let traitClicked = [];
      for (let i = 0; i < data.length; i ++) {
        traitClicked.push({checked: false});
        let tmp  = data[i];
        tmp.id = i;
        if(tmp.display_type == 'text') {
          for(let j = 0; j < tmp.asset_traits.length; j ++) {
            tmp.asset_traits[j].checked = false;
          }
        }
        if(tmp.display_type != 'text') {
          tmp.value_from = tmp.range_min;
          tmp.value_to = tmp.range_max;
        }
        res.push(tmp);
      }
      setCurrentFilter(res);
      setTraitId(traitClicked);
    }).catch(async(err) => {
    })
  } */
  const getTraits = async () => {
    try {
      const { data } = await Axios.get(`/api/collections/traits/${collectionId}`);  
    
      const res = data.map((t, i) => {
        const checked = { checked: false };
        const tmp = { ...t, id: i };
        if (tmp.display_type === "text") {
          const assetTraits = tmp.asset_traits.map((a) => ({ ...a, ...checked }));
          return { ...tmp, asset_traits: assetTraits };
        }
        return { ...tmp, value_from: tmp.range_min, value_to: tmp.range_max };
      });
      
      setCurrentFilter(res);
      setTraitId(Array(res.length).fill({ checked: false }));
      setTraits(data);
    }
    catch (error) {}  
  };

  useEffect(() => {
    getTraits();
  }, [])

  /*
  const handleValueCheck = (itemId, valueId) => {
    const arr = currentFilter.map((item, index) => {
      if(index == itemId) {
        if(item.asset_traits[valueId].checked) {
          item.asset_traits[valueId].checked = false;
          setFilterCount(filterCount => filterCount - 1);
        }
        else {
          item.asset_traits[valueId].checked = true;
          setFilterCount(filterCount => filterCount + 1);
        }
      }
      return item;
    });
    setCurrentFilter(arr);
  }*/
  const handleValueCheck = (itemId, valueId) => {
    setCurrentFilter(currentFilter.map((item, index) => {
      if (index === itemId) {
        const isChecked = item.asset_traits[valueId].checked;
        item.asset_traits[valueId].checked = !isChecked;
        setFilterCount(filterCount => filterCount + (isChecked ? -1 : 1));
      }
      return item;
    }));
  };

  /*
  const handleRangeChange = async (id) => {
    let from = document.getElementById('from_' + id.toString()).value;
    let to = document.getElementById('to_' + id.toString()).value;
    const newFilter = currentFilter.map((item, index) => {
      if(index == id) {
        if(item.value_from == from && item.value_to == to) {
          return item;
        }
        if(item.value_from == item.range_min && item.value_to == item.range_max) {
          setFilterCount(filterCount => filterCount + 1);
          item.value_from = from;
          item.value_to = to;
          return item;
        }
        if(from == item.range_min && to == item.range_max) {
          setFilterCount(filterCount => filterCount - 1);
          item.value_from = from;
          item.value_to = to;
          return item;
        }
        
        item.value_from = from;
        item.value_to = to;
        return item;
      }
      return item;
    });
    setCurrentFilter(newFilter);
  } */
  const handleRangeChange = async (id) => {
    const {value_from, value_to, range_min, range_max} = currentFilter[id];
    const from = document.getElementById(`from_${id}`).value;
    const to = document.getElementById(`to_${id}`).value;
    
    const newFilter = currentFilter.map((item, index) => {
      if(index !== id) {
        return item;  
      }
      
      const isCurrentValue = value_from === from && value_to === to;
      const isRangeMaxValue = value_from === range_min && value_to === range_max;
      const isWholeRange = from === range_min && to === range_max;
      
      if(isCurrentValue || (isRangeMaxValue && !isWholeRange)) {
        return item;
      }
      
      setFilterCount(filterCount => filterCount + (isWholeRange ? -1 : 1));
      
      return {...item, value_from: from, value_to: to};
    });
    
    setCurrentFilter(newFilter);
  }

  const [search_name, setSearchName] = useState('');

  useEffect(() => {
    if(filterCount == 0) getCollectionItems(null, search_name, status, minPrice, maxPrice);
    else {
      let traits = [];
      for(let i = 0; i < currentFilter.length; i ++) {
        let item = currentFilter[i];
        if(item.display_type == 'text') {
          let values = [];
          for(let j = 0; j < item.asset_traits.length; j ++) {
            if(item.asset_traits[j].checked) values.push(item.asset_traits[j].value);
          }
          if(values.length > 0) {
            traits.push({
              trait_id: item.trait_id,
              display_type: item.display_type, 
              values: values
            })
          }
        } else {
          if(item.value_from == item.range_min && item.value_to == item.range_max) continue;
          traits.push({
            trait_id: item.trait_id,
            display_type: item.display_type, 
            min: item.value_from,
            max: item.value_to
          });
        }
      }
      getCollectionItems(traits, search_name, status, minPrice, maxPrice);
    }
  }, [currentFilter, filterCount, search_name, status, minPrice, maxPrice])

  const removeEvent = rowId => {
    if(isPropertyCount > 1) {
      setPropertyCount(isPropertyCount - 1)
    } else {
      setPropertyCount(1)
    }
    if(isPropertyCount > 1) {
      const array = isPropertyInputData.filter((row) => row.id !== rowId);
      setPropertyInputData(array)
    } else {
      setPropertyInputData([{
        id: 0, type: '', name: ''
      }])
    }
  }

  const itemRenderer = (properties ,inx)=>{
    return (
      properties.name != "" &&
      <div className="properties-div" key={inx}>
        <div className="properties-detail">
          <div style={{color:'#f500ff'}}>{properties.name}</div>
          <div className="properites-fontSy">{properties.type} </div>
        </div>                              
      </div>
    )
  }

  const [limit_size , setLimitSize] = useState(104857600);
  const [isNftType, setNftType] = useState('image/jpeg');

  const incrasePercent = (percent) => {
    if (percent < 50) {
      setUploadPercent(percent);
      setTimeout(() => {
        incrasePercent(percent + 1)
      }, 100);
    }
  }

  const startProgressBar = () => {
    setUploadPercent(0);
    incrasePercent(0);
  }

  const updateProgressBar = (e) =>
  {
    setUploadPercent(Math.floor((50 + (e.loaded / e.total) * 50)));
  }
  
  const hideProgressBar = () =>
  {
    setLoading(false)
  }

  const projectId = INFURA_PROJECT_ID;
  const projectSecret = INFURA_API_KEY;
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
      authorization: auth
    }
  });

  const uploadToIpfs = async (file) => {
    try {
      const added = await ipfs.add(file) ;
      const cid = added.path ;
      if (cid) {
        const data = `https://ipfs.io/ipfs/${cid}` ;
        if (file.type === 'video/mp4' || file.type === 'audio/mpeg' || file.type === '')  {
          setRawAnimation(data) ;
        }
        else  {
          setRawImage(data) ;
        }
      }
    } catch (error) {
    } 
  }

  const [filterPadStatus, setFilterPadStatus] = useState(false);
  const onfilterPadStatusChange = async () => {
    if (!filterPadStatus) setFilterPadStatus(true);
    else setFilterPadStatus(false);
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    setImageSrc_preview(URL.createObjectURL(file))
    setLoading(true);
    startProgressBar();
    
    if(file.size >= limit_size) {
      Swal.fire({
        title: 'Warning!',
        text: "Max size of file - 100MB",
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      })
      setLoading(false)
      return ;
    }
    if(file.type == ""){
      setLoading(false);
      Swal.fire({
        title: 'Warning!',
        text: "3D file upload failed.  please click 3D toggle to upload 3D file.",
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      })
      return ;
    }

    if (isNftType === 'video/mp4' || isNftType === 'audio/mpeg') {
      setOtherTypeSrc(URL.createObjectURL(file)) ;
      setPreImgForm(file) ;
      const compressedFile = await imageCompression(file, options_compress);
      setForm_preview(compressedFile) ;
    } else {
      if(isNftType == "" ) {
        setOtherTypeSrc(URL.createObjectURL(file)) ;
        setPreImgForm(file) ;
        const compressedFile = await imageCompression(file, options_compress);
        setForm_preview(compressedFile) ;
      }
      else {
        setNftType(file.type) ;
        setImageSrc(URL.createObjectURL(file)) ;
        setForm(file) ;
        if(file.type !='video/mp4' && file.type != 'audio/mpeg') {
          const compressedFile = await imageCompression(file, options_compress);
          setForm_preview(compressedFile) ;
        }
      }
    }

    const request = new XMLHttpRequest();
    const url = URL.createObjectURL(file);
    request.onprogress = updateProgressBar;
    request.onload = uploadToIpfs(file);
    request.onloadend = hideProgressBar;
    request.open("GET", url);
    request.overrideMimeType('text/plain; charset=x-user-defined'); 
    request.send(null);
  }

  const sendData = async () => {

    setLoadingSpin(true);
    setPreRevealLoading(true);

    if(isItemDescription.length > 20000) {
      Swal.fire({
        title: 'Warning!',
        text: `Description length should not be exceed more than 20k letters.`,
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      });
      setPreRevealLoading(false);
      return;
    }

    if(isName.length > 50) {
      Swal.fire({
        title: 'Warning!',
        text: `NFT name should not be exceed more than 50 characters.`,
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      });
      setPreRevealLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('raw_image', isRawImage);
    formData.append('title', isName);
    formData.append('description', isItemDescription);
    formData.append('collection', isSelectCollectionId);
    formData.append('asset', isForm);
    if(isFormPreview) formData.append('asset_preview' , isFormPreview);

    if(isNftType == "video/mp4" || isNftType == "audio/mpeg" || isNftType == "") {
      formData.append('raw_animation', isRawAnimation);
      formData.append('preview', isPreImgForm);
    }

    let property_type = [];
    let property_value = [];

    isPropertyInputData.map((properti,inx)=>{
        if(properti.name !=""){
          property_type.push(properti.type);
          property_value.push(properti.name);
        }
    })

    const pre_reveal_data = {
      raw_image: isRawImage, 
      title: isName,
      description: isItemDescription,
      properties_trait_type: property_type,
      properties_value: property_value
    }

    await Axios.post("/api/supply-assets/upload-pre-reveal-data", pre_reveal_data, { headers: header })
    .then(async(data) => {
      const sendData = {
        revealUrl: data.data.preRevealUrl,
        collectionId: isSelectCollectionId
      };
      let signedData;
      try {
        let data = await Axios.post("/api/supply-assets/get-reveal-signature", sendData, {headers: header});
        signedData = data.data.data;
      } catch (e) {
        console.log('error while sign message: ', e);
        Swal.fire({
          title: 'Oops...',
          text: 'error while signing transaction',
          icon: 'error',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        });
        setPreRevealLoading(false);
        preRevealModalClose.current.click();
        return;
      }
      
      await setReveal(library, isDetailData.contract_address, data.data.preRevealUrl, signedData, isDetailData.creator.public_address)
        .then((res) => {
          Swal.fire({
            title: 'It worked!',
            text: 'Congratulations, Pre-Reveal Asset is set successfully!',
            icon: 'success',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
          })
        }).catch((err) => {
          if(err.code != 4001) {
            Swal.fire({
              title: 'Oops...',
              text: 'Error while executing transaction',
              icon: 'error',
              confirmButtonText: 'Close',
              timer: 5000,
              customClass: 'swal-height'
            })
          }
        });
        setPreRevealLoading(false);
        preRevealModalClose.current.click();
        return;
    })
    .catch ((e) => {
      console.log('error while uploading metadata: ', e);
      Swal.fire({
        title: 'Oops...',
        text: 'Error while uploading pre-reveal metadata',
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      })
      setPreRevealLoading(false);
      preRevealModalClose.current.click();
      return;
    })

    setPreRevealLoading(false);
    preRevealModalClose.current.click();
    getCollectionDetail();
  }
  
  const handleRLDDChange =(reorderedItems)=>{
    setPropertyInputData(reorderedItems)
  }

  const accessToken = localStorage.getItem('accessToken');
  const header = { 'Authorization': `Bearer ${accessToken}` };

  useEffect(() => {
    if (window.innerWidth < 505) {
      setAddItemBtnState(true)
    }
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000);
    return () => clearTimeout(timer);
  }, [])

  useEffect(() => {
    if (collectionId) {
      getCollectionDetail()
      getCollectionItems()
    }
  }, [collectionId, isPageNum, isPageSize])

  const getCollectionDetail = async () => {
    selectCollectionId(collectionId);
    const account = localStorage.getItem('account');
    let result;
    const header = { 'Authorization': `Bearer ${accessToken}` }
    if(!accessToken) result = await Axios.get(`/api/collections/${collectionId}`);
    else result = await Axios.get(`/api/collections/users/${collectionId}`, {headers:header});
    const details = result.data;
    setDetailData(details);
    setUsdPrice(result.data.usdPrice) ;
    setEthPrice(result.data.ethUsdPrice);
    setCollectionCreator(details.creator);
    if ((account && account) === (details && details.creator && details.creator.public_address)) {
      setShowUserBtn(true) ;
    }
    if(details && details.verified)setVerified(details.verified) ;
  }

  const getCollectionItems = async (traits = null, _searchName = '', _saleType = 0, _minPrice = '', _maxPrice = '') => {
    try {
      setLoading(true);
      let result;
      const requestData = {
        page: isPageNum,
        per_page: isPageSize,
        collection: collectionId,
        traits: traits,
        search_key: _searchName != ''? _searchName: null,
        sale_type: _saleType,
        min_price: _minPrice != ''? _minPrice : null,
        max_price: _maxPrice != ''? _maxPrice: null,
        currency_type: currency
      };
      const header = { 'Authorization': `Bearer ${accessToken}` };
      if(!accessToken) result = await Axios.post(`/api/assets/explorer_assets`, requestData);
      else result = await Axios.post(`/api/assets/explorer_user_assets`, requestData, {headers:header});
      const nfts = result.data.data;
      const meta = result.data.meta;
      setTotalNum(meta.total)
      if (nfts) {
        setTempArr(nfts)
      }
      const timer = setTimeout(() => {
        setLoading(false)
      }, 2500);
      return () => clearTimeout(timer);
    } catch (err) {
      Swal.fire({
        title: 'Oops...',
        text: err.response.data.msg,
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      })
    }
  }

  const volumn_num=(num)=> {
    let str = '' ;
    if(num > 1000) str = parseInt(num / 1000) + 'K' ;
    if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
    if(num < 1000) str = num.toFixed(0) ;
    return str;
  }
  const volumn_num_usd=(num)=> {
    let str = '' ;
    if(num > 1000) str = parseFloat(parseInt(num / 100)/10) + 'K' ;
    if(num > 1000000) str = parseFloat(parseInt(num / 10000)/100) + 'M' ;
    if(num < 1000) str = num.toFixed(2) ;
    return str;
  }

  const handlePageEvent = (pageNumber) => {
    setPageNum(pageNumber);
  }

  const direct_link=(o_url)=>{
    if(o_url.includes("http") == false ) return "https://" + o_url ;
    return o_url ;
  }

  const onShowSizeChange = (current, pageSize) => {
    setPageNum(current);
    setPageSize(pageSize);
  }

  const getTabContent = (e) => {
    console.log(e)
  }
  const verifyCollection = async ()=>{
    if(isDetailData.verify_request == '1') {
      Swal.fire({
        title: 'Heads up',
        text: 'Verification pending...',
        icon: 'info',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      })
      return;
    }
   
    const postData = {
      id: collectionId
    }
    await Axios.post("/api/collections/request-verify", postData, { headers: header })
      .then((res) => {
        Swal.fire({
          title: 'Heads up',
          text: 'Admin will verify your collection against your profile details please wait.',
          icon: 'info',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        })
        getCollectionDetail() ;
      })
      .catch((err) => {
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

  const getPreRevealData = async () => {
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0px';
  }

  const [isStatus, setIsStatus] = useState(false);
  const handleStatusClick = () => {
    if(isStatus) setIsStatus(false);
    else setIsStatus(true);
  }

  const [isPrice, setIsPrice] = useState(false);
  const handlePriceClick = () => {
    if(isPrice) setIsPrice(false);
    else setIsPrice(true);
  }

  const [isProperties, setIsProperties] = useState(false);
  const handlePropertiesClick = () => {
    if(isProperties) setIsProperties(false);
    else setIsProperties(true);
  }

  const handleReveal = async () => {
    if(revealUrl == '') {
      Swal.fire({
        title: 'Warning!',
        text: `Please enter reveal url.`,
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      });
      return;
    }
    setPreRevealLoading(true);
    try {
      let signedData;
      try {
        let postData = {
          revealUrl: revealUrl,
          collectionId: isSelectCollectionId
        };
        let data = await Axios.post("/api/supply-assets/get-reveal-signature", postData, {headers: header});
        signedData = data.data.data;
      } catch (e) {
        console.log('error while getting reveal signature: ', e);
        Swal.fire({
          title: 'Oops...',
          text: 'Error while getting reveal signature',
          icon: 'error',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        })
        setPreRevealLoading(false);
        revealModalClose.current.click();
        return 
      }
      await setReveal(library, isDetailData.contract_address, revealUrl, signedData, isDetailData.creator.public_address)
      .then((res) => {
        setPreRevealLoading(false);
        revealModalClose.current.click();
        getCollectionDetail();
        Swal.fire({
          title: 'It worked!',
          text: 'Congratulations, Revealed successfully!',
          icon: 'success',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        });
      }).catch((err) => {
        if(err.code != 4001) {
          Swal.fire({
            title: 'Oops...',
            text: 'Error while executing reveal function',
            icon: 'error',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
          })
        }
        setPreRevealLoading(false);
        revealModalClose.current.click();
        return;
      });
     } catch (e) {
      console.log('error while revealing: ', e);
      Swal.fire({
        title: 'Oops...',
        text: 'Something went wrong!',
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      })
      setPreRevealLoading(false);
      revealModalClose.current.click();
      return;
    }
  }

  const [revealUrl, setRevealUrl] = useState('');

  const orderList =[
    {id:1,label:"Recently created"} ,
    {id:2,label:"Recently listed"} ,
    {id:3,label:"Recently sold"} ,
    {id:4,label:"Lowest price"} ,
    {id:5,label:"Highest price"} ,
    {id:6,label:"Most viewed"} ,
    {id:7,label:"Most popular"} ,
    {id:8,label:"Ending soon"} 
  ];
  const [viewMethod, setViewMethod] = useState(localStorage.getItem('viewMethod')? localStorage.getItem('viewMethod'):'detail');

  const handleDetailClick = async () => {
    setViewMethod('detail');
    localStorage.setItem('viewMethod', 'detail');
  }

  const handleTileClick = async () => {
    setViewMethod('tile');
    localStorage.setItem('viewMethod', 'tile');
  }

  const currencyList = [
    {id:1, label:'VXL'},
    {id:2, label:'ETH'}
  ];

  const clearProperty = async () => {
    const newFilter = currentFilter.map((item, index) => {
      if(item.display_type == 'text') {
        for(let j = 0; j < item.asset_traits.length; j ++) {
          item.asset_traits[j].checked = false;
        }
      } else {
        item.value_from = item.range_min;
        item.value_to = item.range_max;
      }
      return item;
    });
    setCurrentFilter(newFilter);
    setFilterCount(0);
  }

  const setNftStatus = async(value) => {
    if(status == value) return;
    if(status == 0) setFilterCount(filterCount => filterCount + 1);
    if(value == 0) setFilterCount(filterCount => filterCount - 1);
    setStatus(value);
  }

  const clearPriceRange = async () => {
    setMinPrice('');
    setMaxPrice('');
  }

  const clearStatus = async () => {
    setStatus(0);
  }

  const clearAll = async () => {
    await clearFilterPad();
    await clearPriceRange();
    await clearStatus();
  }

  const clearFilterPad = async () => {
    await clearProperty();
  }

  const handleSearchNameChange = async (e) => {
    const searchName = e.target.value;
    setSearchName(searchName);
  }

  const searchNameChangeHandler = useCallback(
    debounce(handleSearchNameChange, 1000)
  , [])

  const handleCurrencyChange = async (value) => {
    setCurrency(value);
  }

  const handlePriceRangeChange = async () => {
    const _minPrice = document.getElementById('range_min').value;
    const _maxPrice = document.getElementById('range_max').value;
    if(_minPrice == '' || _maxPrice == '') return;
    setMinPrice(_minPrice);
    setMaxPrice(_maxPrice);
    setFilterCount(filterCount => filterCount + 1);
  }

  const getSelectedValue = (asset_traits) => {
    if(!asset_traits) return '';
    let tmp = false;
    let res = '';
    for(let i = 0; i < asset_traits.length; i ++) {
      if(asset_traits[i].checked == true) {
        res += (tmp ? ', ': '') + asset_traits[i].value;
        tmp = true;
      }
    }
    return res;
  }

  return (
    <>
      <div>
        <GlobalStyles />
        
        <section 
          className='jumbotron breadcumb no-bg' 
          style={{ backgroundImage: `url(${ isDetailData.banner ? isDetailData.banner : collectionDefaultBanner })`, 
          backgroundSize:'cover', 
          backgroundRepeat:'no-repeat', 
          backgroundPosition:'center center'}} 
        >
          <div className='mainbreadcumb'>
            <div className='custom-container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center' style={{ opacity: 0 }}>Collection Details</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='custom-container d_coll no-top no-bottom'>
          <div className='row'>
            <div className="col-md-12">
              <div className="d_profile" style={{ marginBottom: 0 }}>
                <div className="profile_avatar">
                  <div className="d_profile_img">
                    <img src={isDetailData && isDetailData.avatar ? isDetailData.avatar : defaultAvatar} alt="avatar" />
                    {isDetailData && isDetailData.verified == true ? <i className="fa fa-check"></i>:<></>}
                  </div>
                </div>
                {
                  isShowUserBtn == true ?
                    
                      (<>
                        <div style={{ position: 'absolute', right: 10, top: 20 }}>
                          <StyledButton><Link to={'/create-collection'} state={{ prop: isDetailData }}><FaPen /></Link></StyledButton>
                          {
                            (isDetailData.is_reveal == 1 && isDetailData.creator.public_address == account) &&
                            <VerifiedButton data-bs-toggle="modal" data-bs-target="#preReveal" style={{cursor: 'pointer'}} onClick={getPreRevealData}>Set Pre-Reveal Asset</VerifiedButton>
                          }
                          {
                            (isDetailData.is_reveal == 2 && isDetailData.creator.public_address == account) &&
                            <VerifiedButton data-bs-toggle="modal" data-bs-target="#reveal" style={{cursor: 'pointer'}} onClick={getPreRevealData}>Reveal</VerifiedButton>
                          }
                          
                          <VerifiedButton >
                            <Link to="/create" state={{ propForAdd: isDetailData.id }}>
                              {
                                isAddItemBtnState ? 
                                <>
                                  <FaPlus />
                                </> : "Add Item"
                              }
                            </Link>
                          </VerifiedButton>
                        </div>
                      </>)
                    :
                    <></>
                }
                {
                  isShowUserBtn == true && isVerified == false ?
                  <>
                      <div style={{ position: 'absolute', left: 10, top: 20 }}>
                      {
                        isDetailData.verify_request == '1' ?
                        <DisabledButton  onClick={verifyCollection}>
                          {
                            isAddItemBtnState ? 
                              "Pending"
                              : "Verification Pending..."
                          }  
                        </DisabledButton>
                        :
                        <StyledButton onClick={verifyCollection}>
                          {
                            isAddItemBtnState ? 
                              "Verify"
                              : "Verify your collection"
                          }  
                        </StyledButton>
                      }
                        
                      </div>
                  </>
                  :
                  <>
                  </>
                }
              </div>
            </div>
            <div className="profile_name" style={{ width: '95%', lineHeight: 1}}>
              <h4>
                <span style={{wordBreak: 'keep-all'}}>{isDetailData && isDetailData.name ? isDetailData.name : "Unnamed"}</span>
              </h4>
              <p className="CD-bitTxt" style={{wordBreak:'keep-all'}}>Created by <CreatorName><Link to={isCollectionCreator && isCollectionCreator.public_address ? `/author/${isCollectionCreator.public_address}` : "#"} style={{ color: '#f70dff', fontWeight: 'unset' }}>{isCollectionCreator && isCollectionCreator.username ? isCollectionCreator.username : (isCollectionCreator && isCollectionCreator.public_address)? isCollectionCreator.public_address.slice(0, 7) + "...":'Unnamed'}</Link></CreatorName></p>
            </div>
            <SocialLinkDiv>
              { isDetailData.twitter && isDetailData.twitter != "null" && <SocialIconBtn className="socialIconColor"><a href={direct_link(isDetailData.twitter)} target="_blank"><FaTwitter /></a></SocialIconBtn> }
              { isDetailData.instagram && isDetailData.instagram != "null" && <SocialIconBtn className="socialIconColor"><a href={direct_link(isDetailData.instagram)} target="_blank"><FaInstagram /></a></SocialIconBtn> }
              { isDetailData.discord && isDetailData.discord != "null" && <SocialIconBtn className="socialIconColor"><a href={direct_link(isDetailData.discord)} target="_blank"><FaDiscord /></a></SocialIconBtn>}
              { isDetailData.telegram && isDetailData.telegram != "null" && <SocialIconBtn className="socialIconColor"><a href={direct_link(isDetailData.telegram)} target="_blank"><FaTelegramPlane /></a></SocialIconBtn> }
              { isDetailData.website && isDetailData.website != "null" && <SocialIconBtn className="socialIconColor"><a href={direct_link(isDetailData.website)} target="_blank"><FaGlobe /></a></SocialIconBtn>}
            </SocialLinkDiv>
            <DescriptionDiv className="Non-scroll-tab">
              <span style={{wordBreak: 'keep-all', whiteSpace:'pre-wrap'}}>{isDetailData && isDetailData.description ? isDetailData.description : null}</span>
            </DescriptionDiv>
            <InfoDiv className="text-center">
              <InfoFirstDiv>
                <InfoFirst className="alrt1">
                  <H3>{isDetailData && isDetailData.total_assets ? isDetailData.total_assets : 0}</H3>
                  <span>Items</span>
                </InfoFirst>
                <InfoFirst className="alrt1">
                  <H3>{isDetailData && isDetailData.total_owners ? isDetailData.total_owners : 0}</H3>
                  <span>Owners</span>
                </InfoFirst>
              </InfoFirstDiv>
              <InfoSecondDiv>
                <InfoSecond className="alrt1">
                  <H3 style={{fontSize:'16px'}}>
                    <img src={currencyLogo(isDetailData? isDetailData.chain_id: null)} style={{ width: 20, height: 20, margin: '0px 5px 5px 0px' }} />
                    {isDetailData && isDetailData.floor_price ? volumn_num(isDetailData.floor_price  / isusdPrice) : 0}
                    <span style={colormodesettle.ColorMode?{color:'#848484',fontSize:'13px'}:{color:'#898888',fontSize:'15px'}}>
                      {isDetailData && isDetailData.floor_price ? ` ($${volumn_num_usd(parseFloat(isDetailData.floor_price))})` : ` (0)`}
                    </span>
                  </H3>
                  
                  <span>Floor price</span>
                </InfoSecond>
                <InfoSecond className="alrt1">
                  <H3 style={{fontSize:'16px'}}>
                    <img src={currencyLogo(isDetailData? isDetailData.chain_id : null)} style={{ width: 20, height: 20, margin: '0px 5px 5px 0px' }} />
                    {isDetailData && isDetailData.volume_traded ? volumn_num(isDetailData.volume_traded ) : `0`}
                    <span style={colormodesettle.ColorMode?{color:'#848484',fontSize:'13px'}:{color:'#898888',fontSize:'15px'}}>
                      {isDetailData && isDetailData.usd_volume_traded ? ` ($${volumn_num_usd(isDetailData.usd_volume_traded)})` : `(0)`}
                    </span>
                  </H3>
                  
                  <span>Volume traded</span>
                </InfoSecond>
              </InfoSecondDiv>
            </InfoDiv>
          </div>
        </section>

        <section className='custom-container no-top collectionTab'>
          <Tabs defaultActiveKey="1" centered onChange={getTabContent}>
            <TabPane tab={ <span> <FaTh /> Items </span> } key="1" >
              {
                window.innerWidth <= mobileSize &&
                <div style={searchBar_mobile} >
                  <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'} style={{marginRight:'0px'}}>
                    <FaSearch style={{marginRight:'4px'}}/>
                    <input 
                      placeholder="Search by NFTs" 
                      style={searchNFT_input}
                      defaultValue={search_name}
                      onChange={searchNameChangeHandler}
                    />
                  </div>
                </div>
              }
              <div style={searchBar_Desktop} >
                {
                  window.innerWidth > mobileSize ?

                  <button className={!colormodesettle.ColorMode? 'filter-button-dark':'filter-button-light'} style={{marginRight:'10px'}} onClick={onfilterPadStatusChange}>
                    <FaFilter style={{marginRight:'4px'}}/>Filters
                    {
                      filterCount? <span className={!colormodesettle.ColorMode? 'filter-count-dark':'filter-count-light'}>&nbsp; 1 &nbsp;</span> : <></>
                    }
                  </button>
                  :
                  <button className={!colormodesettle.ColorMode? 'filter-button-dark':'filter-button-light'} style={{marginRight:'10px', flexGrow:'1', flexShrink:'1'}} data-bs-toggle="modal" data-bs-target="#filterModal">
                    <FaFilter style={{marginRight:'4px'}}/>Filters
                    {
                      filterCount ? <span className={!colormodesettle.ColorMode? 'filter-count-dark':'filter-count-light'}>&nbsp; 1 &nbsp;</span> : <></>
                    }
                  </button>
                }
                {
                  (filterCount > 0 && window.innerWidth > mobileSize) && 
                  <button className={!colormodesettle.ColorMode? 'filter-button-dark':'filter-button-light'} style={{marginRight:'10px'}} onClick={clearAll}>
                    Clear All
                  </button>
                }
                {
                  window.innerWidth > mobileSize && 
                  <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'}>
                    <FaSearch style={{marginRight:'4px'}}/>
                    <input 
                      placeholder="Search by NFTs" 
                      style={searchNFT_input}
                      defaultValue={search_name}
                      onChange={searchNameChangeHandler}
                    />
                  </div>
                }
                
                <Select defaultValue={1} style={{border:'none'}}>
                  {
                    orderList?.map((item, index) => (
                        <Option key={index} value={item.id}>{item.label}</Option>
                    ))
                  }
                </Select>
                {
                  window.innerWidth > mobileSize && 
                  <div className={!colormodesettle.ColorMode? 'card-view-dark':'card-view-light'} style={{marginLeft:'10px', borderRadius:'8px', display:'flex', padding:'4px 10px', alignItems:'center', flexShrink:'0', flexGrow:'0', marginRight:'0px', width: '100px', justifyContent:'space-between'}}>
                    <div style={{cursor:'pointer', padding:'5px 7px', borderRadius:'5px', backgroundColor:viewMethod == 'detail'? 'rgba(247,13,255, 1)' :''}} onClick={handleDetailClick}><BsGridFill style={{width:'21px', height:'21px', color:'white'}} /></div>
                    <div style={{cursor:'pointer', padding:'5px 7px', borderRadius:'5px', backgroundColor:viewMethod == 'tile'? 'rgba(247,13,255, 1)' :''}}><BsGrid3X3GapFill style={{width:'21px', height:'21px', color:'white'}} onClick={handleTileClick} /></div>
                  </div>
                }
              </div>
              <ContentDiv className="row">
                <div style={{display:'flex'}}>
                  <div>
                    {
                      (filterPadStatus && window.innerWidth > mobileSize) && 
                        <div className={colormodesettle.ColorMode? 'filter-pad-light':'filter-pad-dark'} style={{overflow:'scroll'}}>
                          <div className={colormodesettle.ColorMode? 'filter-item-light':'filter-item-dark'}>
                            <div className="filter-item-title" onClick={handleStatusClick}>
                              <span style={{fontWeight:'bold', fontSize:16}}>Status</span>
                              {
                                isStatus? <FaAngleUp />:<FaAngleDown />
                              }
                            </div>
                            {
                              isStatus && 
                              <div style={{display:'flex', flexWrap:'wrap', marginTop:'10px'}}>
                                <div><TabButton className={status == 0? 'active':''} style={{margin:'3px 3px'}} onClick={(e) =>{setNftStatus(0)}}>All</TabButton></div>
                                <div><TabButton className={status == 1? 'active':''} style={{margin:'3px 3px'}} onClick={(e) =>{setNftStatus(1)}}>Buy Now</TabButton></div>
                                <div><TabButton className={status == 2? 'active':''} style={{margin:'3px 3px'}} onClick={(e) =>{setNftStatus(2)}}>Auction</TabButton></div>
                                <div><TabButton className={status == 3? 'active':''} style={{margin:'3px 3px'}} onClick={(e) =>{setNftStatus(3)}}>Has Offers</TabButton></div>
                              </div>
                            }
                          </div>
                          <div className={colormodesettle.ColorMode? 'filter-item-light':'filter-item-dark'}>
                            <div className="filter-item-title" onClick={handlePriceClick}>
                              <span style={{fontWeight:'bold', fontSize:16}}>Price</span>
                              {
                                isPrice? <FaAngleUp />:<FaAngleDown />
                              }
                            </div>
                            {
                              isPrice && 
                              <>
                                <div style={{display:'flex', flexWrap:'wrap', marginTop:'10px', alignItems:'center'}}>
                                  <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'} style={{width:'60px', padding:'6px 5px'}}>
                                    <input type='number' placeholder="Min" style={price_input} defaultValue={minPrice} id='range_min' name='range_min' />
                                  </div>
                                  <span style={{marginRight:'10px'}}>to</span>
                                  <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'} style={{width:'60px', padding:'6px 5px'}}>
                                    <input type='number' placeholder="Max" style={price_input} defaultValue={maxPrice} id='range_max' name='range_max' />
                                  </div>
                                  <Select defaultValue={currency} style={{border:'none'}} onChange={handleCurrencyChange}>
                                    {
                                      currencyList?.map((item, index) => (
                                          <Option key={index} value={item.id}>{item.label}</Option>
                                      ))
                                    }
                                  </Select>
                                </div>
                                <div style={{display:'flex', marginTop:'5px'}}>
                                  <ApplyButton style={{flex:'1 1 auto'}} onClick={handlePriceRangeChange}>Apply</ApplyButton>
                                </div>
                              </>
                            }
                          </div>
                          <div className={colormodesettle.ColorMode? 'filter-item-light':'filter-item-dark'} style={{borderBottom:'none'}}>
                            <div className="filter-item-title" onClick={handlePropertiesClick}>
                              <span style={{fontWeight:'bold', fontSize:16}}>Properties</span>
                              {
                                isProperties? <FaAngleUp />:<FaAngleDown />
                              }
                            </div>
                            <div style={{display:isProperties? 'block':'none'}}>
                              <div style={{marginTop:'10px', marginLeft:'10px', alignItems:'center'}}>
                                <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'}>
                                  <FaSearch style={{marginRight:'4px'}}/>
                                  <input placeholder="Search by traits" style={searchNFT_input} onChange={handleSearchTraitChange} value={searchTrait}/>
                                </div>
                              </div>
                              <div className="trait-list">
                                {
                                  filterTraits.map((trait, index) => (
                                    <div className={!colormodesettle.ColorMode? 'trait-form-dark':'trait-form-light'} key={index}>
                                      <div>
                                        <div className="trait-item" key={index} onClick={() => handleTraitClick(trait.id)} style={{cursor:'pointer'}}>
                                          <span className="trait-type">{trait.trait_type}</span>
                                          {
                                            traitId[trait.id].checked ? 
                                            <div>
                                              <span style={{color:'grey'}}>{trait.asset_traits? trait.asset_traits.length + ' ':''}</span>
                                              <FaAngleUp />
                                            </div>
                                              :
                                            <div>
                                              <span style={{color:'grey'}}>{trait.asset_traits? trait.asset_traits.length + ' ':''}</span>
                                              <FaAngleDown />
                                            </div>
                                          }
                                        </div>
                                        <div className="trait-selected">{getSelectedValue(currentFilter[trait.id].asset_traits)}</div>
                                      </div>
                                      {
                                        traitId[trait.id].checked && 
                                        (
                                          trait.display_type == 'text' ? 
                                            <div style={{maxHeight:'200px', overflow:'scroll'}}>
                                              {
                                                trait.asset_traits.map((item, index_1) => (
                                                  <ValueDiv key={index_1}>
                                                    <div style={{display:'flex'}}>
                                                      <input 
                                                        type='checkbox'
                                                        checked={currentFilter && (currentFilter[trait.id].asset_traits[item.id != undefined ? item.id : index_1].checked ?? false)} 
                                                        onChange={(e) => handleValueCheck(trait.id, item.id != undefined? item.id : index_1)} />
                                                      <span style={{paddingLeft:'5px', color:'grey'}}>{item.value ?? 'range bar'}</span>
                                                    </div>
                                                    <span style={{color:'grey'}}>{item.cnt ?? ''}</span>
                                                  </ValueDiv>
                                                ))
                                              }
                                            </div>
                                            :
                                            <div>
                                              <div style={{display:'flex', marginTop:'15px', alignItems:'center'}}>
                                                <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'} style={{flex:'1 1 auto'}}>
                                                  <input type="number" placeholder="" style={price_input} defaultValue={currentFilter && currentFilter[trait.id].value_from} min={trait.range_min} max={trait.range_max} name={'from_' + trait.id.toString()} id={'from_' + trait.id.toString()} />
                                                </div>
                                                <span style={{marginRight:'10px'}}>to</span>
                                                <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'} style={{flex:'1 1 auto', marginRight:'0px'}} >
                                                  <input type="number" placeholder="" style={price_input} defaultValue={currentFilter && currentFilter[trait.id].value_to} min={trait.range_min} max={trait.range_max} name={'to_' + trait.id.toString()} id={'to_' + trait.id.toString()} />
                                                </div>
                                              </div>
                                              <div style={{display:'flex', marginTop:'5px'}}>
                                                <ApplyButton style={{flex:'1 1 auto'}} onClick={() => handleRangeChange(trait.id)}>Apply</ApplyButton>
                                              </div>
                                            </div>
                                        )
                                      }
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                    }
                  </div>
                  <ContentDiv className="row" style={{display:'flex', height:'0%', flexGrow:'1', flexShrink:'1', justifyContent:'space-between'}}>
                    
                    {
                      tempArr && tempArr.length > 0 ?
                        <>
                          {
                            viewMethod == 'detail' ?
                            <>
                              {tempArr.map((nft, index) => (
                                <NftCard
                                  nft={nft}
                                  key={index}
                                  ethPrice={ethPrice}
                                  loadingState={isLoading}
                                />
                              ))}
                              <EmptyCard/>
                              <EmptyCard/>
                              <EmptyCard/>
                              <EmptyCard/>
                              <EmptyCard/>
                            </>
                            :
                            <>
                              {tempArr.map((nft, index) => (
                                <NftCardSmall
                                  nft={nft}
                                  key={index}
                                  ethPrice={ethPrice}
                                  loadingState={isLoading}
                                />
                              ))}
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                              <EmptyCardSmall/>
                            </>
                          }
                        </>: <NoDataDiv>{isLoading ? 'Loading NFTs…' : 'No Data'}</NoDataDiv>
                    }
                    <div className="spacer-single"></div>
                    <div className="text-center">
                      <Pagination showQuickJumper defaultCurrent={1} total={isTotalNum} defaultPageSize={25} pageSizeOptions={[15, 25, 50, 100]} onChange={handlePageEvent} onShowSizeChange={onShowSizeChange} />
                    </div>

                  </ContentDiv>
                </div>
              </ContentDiv>
            </TabPane>
            <TabPane tab={ <span> <FaBacon /> Activity </span> } key="2" >
              <ContentDiv className="row">

                <Activity collectionId={collectionId}/>
              </ContentDiv>
            </TabPane>
          </Tabs>
        </section>
      </div>
      <div className="modal fade" id="preReveal" tabIndex="-1" aria-labelledby="preRevealLabel" aria-hidden="true">
        <div className="modal-dialog" style = {{maxWidth:'55vw'}}>
            <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                <div className="modal-header">
                    <h4 className="modal-title mt-3 mb-3" id="listingLabel">Pre-Reveal Asset</h4>
                    <input type="button" id="modalClose" ref={preRevealModalClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                </div>
                <div className="modal-body Non-scroll-tab" style={{maxHeight:'65vh', overflow:'auto'}}>
                  <Spin spinning={preRevealLoading} indicator={antIcon} delay={500}>
                    <div style={{ padding: '5px 0px 25px 0px'}}>
                      <FormikProvider value={formik}>
                        <Form id="form-create-item" autoComplete="off" className="form-border" noValidate onSubmit={handleSubmit}>
                          <div>
                          { !preRevealLoading ?
                            <div className="row" style = {{display:'flex', justifyContent:'center'}}>
                              <span><b style={{fontWeight:'600'}}>Recommended: </b>Please ensure to upload preview image with 7:9 ratio for perfect display.</span>
                              <ImageUpload
                                handleImageSelect={handleImageSelect}
                                imageSrc={imageSrc}
                                setImageSrc={setImageSrc}
                                defaultDeleteIconSize={20}
                                className="imageUploader"
                                defaultDeleteIconColor="grey"
                                style={{
                                  width: 180,
                                  height: 180,
                                  ...imageUploaderStyle
                                }}
                              />
                            </div>
                            :
                            <div className="row" style={{width: 250, paddingLeft: 20}}>
                              <ProgressBar style={{padding: 0}} animated now={uploadPercent} label={`${uploadPercent}%`}/>
                            </div>
                          }
                          </div>
                          <div className="spacer-single"></div>
                          <div className="spacer-single"></div>
                          <div className="col-10" style={{ display: 'flex' }}>
                            <i className="fa fa-tag" style={iconStyle}></i>
                            <div>
                              <h5> Pre-reveal NFT Name{" "}<i style={{ color: 'red' }}>*</i></h5>
                            </div>
                          </div>
                          <Field
                            type="text"
                            name="name"
                            id="item_title"
                            className="form-control"
                            placeholder="Item name"
                            onChange={e=> setName(e.target.value)}
                            value={isName ?? ""}
                          />
                          {!isName && errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                          
                          <div className="spacer-10"></div>
                          <div className="col-10" style={{ display: 'flex' }}>
                            <i className="fa fa-pencil fa-fw" style={iconStyle}></i>
                            <div>
                              <h5>Describe your item</h5>
                            </div>
                          </div>
                          <span> Give <b>SuperKluster</b> users a description they will see before the NFT is revealed. </span>
                          <textarea data-autoresize name="item_desc" onChange={e => setItemDescription(e.target.value)} value={isItemDescription ?? ""} id="item_desc" className="form-control mt-2" placeholder="Provide a description of your item" style={{ height: 150}}></textarea>
                          <div className="row align-items-center">
                            <div className="col-10" style={{ display: 'flex' }}>
                              <i className="fa fa-barcode" style={iconStyle}></i>
                              <div>
                                <h5>Properties</h5>
                                <span>Set the traits of pre-reveal NFT.</span>
                              </div>
                            </div>
                            {
                              isPropertyCount < 50 && 
                              <div className="col-2" style={{ textAlign: 'right' }}>
                                <button type="button" className="createModelBtn" style={btnStyle} onClick={addRowEvent}><i className="fa fa-plus"></i></button>
                              </div>
                            }
                            <div className="spacer-10"></div>
                            <div className="row align-items-center text-center">
                              <div className="col-6"><h4>Type</h4></div>
                              <div className="col-6"><h4>Name</h4></div>
                            </div>
                            {
                              isPropertyInputData.map((property , index) => (
                                <div className="input-group align-items-center mb-1" key={index}>
                                  <span className={colormodesettle.ColorMode?"input-group-text btn-close" : "input-group-text btn-close btn-close-white"} style={removeLabelStyle} onClick={() => removeEvent(property.id)}></span>
                                  <input type="text" name="type" onChange={(e) => propertyInputEvent(e, index)} value={property.type} aria-label="type" placeholder="Character" className="form-control m-0 p-3" />
                                  <input type="text" name="name" onChange={(e) => propertyInputEvent(e, index)} value={property.name} aria-label="name" placeholder="Male" className="form-control m-0 p-3" />
                                </div>
                              ))
                            }

                            <div style={{display:'flex' , flexWrap:'wrap'}}>
                              <RLDD
                                  cssClasses="example"
                                  items={isPropertyInputData}
                                  itemRenderer={itemRenderer}
                                  onChange={handleRLDDChange}
                                />
                            </div>
                          </div>
                        </Form>
                      </FormikProvider>
                    </div>
                  </Spin>
                </div>
                <ModalBottomDiv>
                  <ModalCancelBtn style={{marginBottom:'5px'}} data-bs-dismiss="modal">Cancel</ModalCancelBtn>
                  <ModalBtn onClick={sendData} disabled = {(isRawImage == '' || isName == '')? true: false}>Save</ModalBtn>
                </ModalBottomDiv>
            </div>
        </div>
      </div>
      <div className="modal fade" id="reveal" tabIndex="-1" aria-labelledby="revealLabel" aria-hidden="true">
        <div className="modal-dialog" style = {{maxWidth:'55vw'}}>
            <div className="modal-content" style={{ borderColor: '#dee2e6', borderRadius: 15 }}>
                <div className="modal-header">
                    <h4 className="modal-title mt-3 mb-3" id="listingLabel">Reveal Asset</h4>
                    <input type="button" id="modalClose" ref={revealModalClose} className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
                </div>
                <div className="modal-body Non-scroll-tab" style={{maxHeight:'65vh', overflow:'auto'}}>
                  <Spin spinning={preRevealLoading} indicator={antIcon} delay={500}>
                    <div style={{ padding: '5px 0px 25px 0px'}}>
                    Please set reveal url
                    <StyledInput placeholder="set reveal url" onChange={(e) => setRevealUrl(e.target.value)} value={revealUrl} />
                    </div>
                  </Spin>
                </div>
                <ModalBottomDiv>
                  <ModalCancelBtn style={{marginBottom:'5px'}} data-bs-dismiss="modal">Cancel</ModalCancelBtn>
                  <ModalBtn onClick={handleReveal} disabled={revealUrl == '' ? true : false}>Reveal</ModalBtn>
                </ModalBottomDiv>
            </div>
        </div>
      </div>
      <div className="modal fade right" id="filterModal" tabIndex="-1" aria-labelledby="filterModalLabel" aria-hidden="true" style={{right:'0px !important', backdropFilter:'blur(5px)'}}>
        <div className="modal-dialog" style={{margin:'10px 10px auto auto', maxWidth:'300px'}}>
          <div className="modal-content ant-tabs" style={{borderRadius:'15px !important', padding:'15px', maxHeight:'90vh', overflow:'scroll'}}>
              <div className="modal-header" style={{borderTop:'none', borderLeft:'none', borderRight:'none', margin:'0 1rem', padding:'0px'}}>
                  <h5 className="modal-title mt-3 mb-3" id="listingLabel">Filters</h5>
                  <input type="button" id="modalClose" className={colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close"/>
              </div>
              <div className="modal-body" style={{overflowY: 'auto'}}>
                <div className={colormodesettle.ColorMode? 'filter-item-light':'filter-item-dark'}>
                  <div className="filter-item-title" onClick={handleStatusClick}>
                    <div style={{fontWeight:'bold', fontSize:16}}>Status</div>
                    {
                      isStatus? <FaAngleUp />:<FaAngleDown />
                    }
                  </div>
                  {
                    isStatus && 
                    <div style={{display:'flex', flexWrap:'wrap', marginTop:'10px'}}>
                      <div><TabButton className={status == 0? 'active':''} style={{margin:'3px 3px'}} onClick={(e) =>{setNftStatus(0)}}>All</TabButton></div>
                      <div><TabButton className={status == 1? 'active':''} style={{margin:'3px 3px'}} onClick={(e) =>{setNftStatus(1)}}>Buy Now</TabButton></div>
                      <div><TabButton className={status == 2? 'active':''} style={{margin:'3px 3px'}} onClick={(e) =>{setNftStatus(2)}}>Auction</TabButton></div>
                      <div><TabButton className={status == 3? 'active':''} style={{margin:'3px 3px'}} onClick={(e) =>{setNftStatus(3)}}>Has Offers</TabButton></div>
                    </div>
                  }
                </div>
                <div className={colormodesettle.ColorMode? 'filter-item-light':'filter-item-dark'}>
                  <div className="filter-item-title" onClick={handlePriceClick}>
                    <span style={{fontWeight:'bold', fontSize:16}}>Price</span>
                    {
                      isPrice? <FaAngleUp />:<FaAngleDown />
                    }
                  </div>
                  {
                    isPrice && 
                    <>
                      <div style={{display:'flex', flexWrap:'wrap', marginTop:'10px', alignItems:'center'}}>
                        <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'} style={{width:'60px', padding:'6px 5px'}}>
                          <input type='number' placeholder="Min" style={price_input} defaultValue={minPrice} id='range_min' name='range_min' />
                        </div>
                        <span style={{marginRight:'10px'}}>to</span>
                        <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'} style={{width:'60px', padding:'6px 5px'}}>
                          <input type='number' placeholder="Max" style={price_input} defaultValue={maxPrice} id='range_max' name='range_max' />
                        </div>
                        <Select defaultValue={currency} style={{border:'none'}} onChange={handleCurrencyChange} >
                          {
                            currencyList?.map((item, index) => (
                                <Option key={index} value={item.id}>{item.label}</Option>
                            ))
                          }
                        </Select>
                      </div>
                      <div style={{display:'flex', marginTop:'5px'}}>
                        <ApplyButton style={{flex:'1 1 auto'}} onClick={handlePriceRangeChange}>Apply</ApplyButton>
                      </div>
                    </>
                  }
                </div>
                <div className={colormodesettle.ColorMode? 'filter-item-light':'filter-item-dark'} style={{borderBottom:'none'}}>
                  <div className="filter-item-title" onClick={handlePropertiesClick}>
                    <span style={{fontWeight:'bold', fontSize:16}}>Properties</span>
                    {
                      isProperties? <FaAngleUp />:<FaAngleDown />
                    }
                  </div>
                  <div style={{display:isProperties? 'block':'none'}}>
                    <div style={{marginTop:'10px', marginLeft:'10px', alignItems:'center'}}>
                      <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'}>
                        <FaSearch style={{marginRight:'4px'}}/>
                        <input placeholder="Search by traits" style={searchNFT_input} onChange={handleSearchTraitChange} value={searchTrait}/>
                      </div>
                    </div>
                    <div className="trait-list">
                      {
                        filterTraits.map((trait, index) => (
                          <div className={!colormodesettle.ColorMode? 'trait-form-dark':'trait-form-light'} key={index}>
                            <div>
                              <div className="trait-item" key={index} onClick={() => handleTraitClick(trait.id)} style={{cursor:'pointer'}}>
                                <span className="trait-type">{trait.trait_type}</span>
                                {
                                  traitId[trait.id].checked ? 
                                  <div>
                                    <span style={{color:'grey'}}>{trait.asset_traits? trait.asset_traits.length + ' ':''}</span>
                                    <FaAngleUp />
                                  </div>
                                    :
                                  <div>
                                    <span style={{color:'grey'}}>{trait.asset_traits? trait.asset_traits.length + ' ':''}</span>
                                    <FaAngleDown />
                                  </div>
                                }
                              </div>
                              <div className="trait-selected">{getSelectedValue(currentFilter[trait.id].asset_traits)}</div>
                            </div>
                            {
                              traitId[trait.id].checked && 
                              (
                                trait.display_type == 'text' ? 
                                  <div style={{maxHeight:'200px', overflow:'scroll'}}>
                                    {
                                      trait.asset_traits.map((item, index_1) => (
                                        <ValueDiv key={index_1}>
                                          <div style={{display:'flex'}}>
                                            <input 
                                              type='checkbox'
                                              checked={currentFilter && (currentFilter[trait.id].asset_traits[item.id != undefined ? item.id : index_1].checked ?? false)} 
                                              onChange={(e) => handleValueCheck(trait.id, item.id != undefined? item.id : index_1)} />
                                            <span style={{paddingLeft:'5px', color:'grey'}}>{item.value ?? 'range bar'}</span>
                                          </div>
                                          <span style={{color:'grey'}}>{item.cnt ?? ''}</span>
                                        </ValueDiv>
                                      ))
                                    }
                                  </div>
                                  :
                                  <div>
                                    <div style={{display:'flex', marginTop:'15px', alignItems:'center'}}>
                                      <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'} style={{flex:'1 1 auto'}}>
                                        <input type="number" placeholder="" style={price_input} defaultValue={currentFilter && currentFilter[trait.id].value_from} min={trait.range_min} max={trait.range_max} name={'from_' + trait.id.toString()} id={'from_' + trait.id.toString()} />
                                      </div>
                                      <span style={{marginRight:'10px'}}>to</span>
                                      <div className={!colormodesettle.ColorMode? 'collection-search-nft-dark':'collection-search-nft-light'} style={{flex:'1 1 auto', marginRight:'0px'}} >
                                        <input type="number" placeholder="" style={price_input} defaultValue={currentFilter && currentFilter[trait.id].value_to} min={trait.range_min} max={trait.range_max} name={'to_' + trait.id.toString()} id={'to_' + trait.id.toString()} />
                                      </div>
                                    </div>
                                    <div style={{display:'flex', marginTop:'5px'}}>
                                      <ApplyButton style={{flex:'1 1 auto'}} onClick={() => handleRangeChange(trait.id)}>Apply</ApplyButton>
                                    </div>
                                  </div>
                              )
                            }
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
                {
                  filterCount > 0 && 
                  <div style={{display:'flex', marginTop:'5px'}}>
                    <ApplyButton style={{flex:'1 1 auto'}} onClick={clearAll}>Clear All</ApplyButton>
                  </div>
                }
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default memo(CollectionDetailPage);