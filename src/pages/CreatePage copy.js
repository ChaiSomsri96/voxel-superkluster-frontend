import React, { useState, useEffect } from "react";
import * as Yup from 'yup';
import { useNavigate, useLocation } from "@reach/router";
import { useFormik, Form, FormikProvider, Field } from 'formik';
import styled, { createGlobalStyle } from 'styled-components';
import Switch from "react-switch";
import ImageUpload from 'image-upload-react';
import { create } from 'ipfs-http-client';
import { useDispatch, useSelector } from "react-redux";
import { Spin, Select, Tooltip, Button,Progress, Alert, Checkbox, Upload} from 'antd';
import { LoadingOutlined ,UploadOutlined ,InboxOutlined } from '@ant-design/icons';
import { FiInfo } from 'react-icons/fi';
import imageCompression from 'browser-image-compression';
import MoonLoader from "react-spinners/MoonLoader";
import ProgressBar from 'react-bootstrap/ProgressBar';

import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

import RLDD from 'react-list-drag-and-drop/lib/RLDD';

import { createNftMinting } from "./../store/actions/thunks";
import * as selectors from './../store/selectors';
import 'image-upload-react/dist/index.css';
import { INFURA_PROJECT_ID, INFURA_API_KEY } from "./../core/api";
import { Axios } from "./../core/axios";
import { ethers } from 'ethers';

import defaultNFT from "./../assets/image/default_nft.jpg";
import defaultUser from "./../assets/image/default_user.png";
import isTokenIcon from "./../assets/image/vxl_currency.png";

import goerliNetworkLogo from "./../assets/image/blockchain/goerli.png";
import ethNetworkLogo from "./../assets/image/blockchain/ethereum.png";

const GlobalStyles = createGlobalStyle`
`;


const ActionButton = styled(Button)`
    width: auto;
    height: 40px;
    color: white;
    background: #f70dff;
    padding: 0px 4%;
    border-color: #f70dff;
    border-radius: 10px;
    font-weight: bold;
    margin: 5px 10px;

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

const StyledTokenImg = styled.img`
    width: 16px!important;
    height: 16px!important;
    margin: 5px 5px 0px;
`;
const CreatePage = (colormodesettle) => {

  useEffect(()=>{
    localStorage.setItem('searchValue','') ;
  },[])

  const { Option } = Select;

  let location = useLocation();
  const { prop } = location.state;
  const { propForAdd } = location.state;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data } = useSelector(selectors.accessToken);
  const projectId = INFURA_PROJECT_ID;
  const projectSecret = INFURA_API_KEY;
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

  const traitCharLimit = 15;
  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
      authorization: auth
    }
  });

  const [loading, setLoading] = useState(false);
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [isActiveCreateButton, setActiveCreateButton] = useState(true);
  const [isType, setType] = useState('create');
  const [isRawImage, setRawImage] = useState(prop && prop.raw_image ? prop.raw_image : '');
  const [isRawAnimation, setRawAnimation] = useState(prop && prop.raw_animation ? prop.raw_animation : '')
  const [isRawAnimationMTL, setRawAnimationMTL] = useState('') ;
  const [isRawAnimationTexture, setRawAnimationTexture] = useState([]) ;
  const [isTextureForm, setTextureForm] = useState([]) ;
  const [isTextureFormAddingURL, setTextureFormAddingURL] = useState([]) ;
  const [imageSrc, setImageSrc] = useState(prop && prop.image ? prop.image : '');
  const [imageSrc_preview, setImageSrc_preview] = useState(prop && prop.image ? prop.image : '');
  const [isOtherTypeSrc, setOtherTypeSrc] = useState('');
  const [isNftType, setNftType] = useState('image/jpeg');
  const [isForm, setForm] = useState(null);
  const [isFormPreview , setForm_preview] = useState(null) ;
  const [isMTLForm, setMTLForm] = useState(null);
  const [isPreImgForm, setPreImgForm] = useState({});
  const [isName, setName] = useState(prop && prop.name ? prop.name : '');
  const [isItemDescription, setItemDescription] = useState(prop && prop.description ? prop.description : '') ;
  const [isSelectCollection, selectCollection] = useState([]);
  const [isSelectCollectionId, selectCollectionId] = useState(propForAdd ? propForAdd : '');
  const [isUnlockableContent, setUnlockableContent] = useState('');
  const [esChecked, setESChecked] = useState(prop? prop.is_sensitive : false);
  const [isSupplyItemNums, setSupplyItemNums] = useState(prop ? prop.supply_number : 1);
  const [isNetworkOpt, setNetworkOpt] = useState(prop? prop.collection.chain_id : 'Select...');
  const [isThreeDOpt , setThreeTypeOpt] = useState('obj');
  const [isPropertyCount, setPropertyCount] = useState(1);
  const [isRoyalty, setRoyaltyChecked] = useState(prop && prop.royalty_address ? true : false);
  const [royaltyFee, setRoyaltyFee] = useState(prop && prop.royalty_address ? prop.royalty_fee : 10);
  const [royaltyAddress, setRoyaltyAddress] = useState(prop && prop.royalty_address ? prop.royalty_address : '');
  const [validRoyalty, setValidRoyalty] = useState(true);
  const [uploadPercent, setUploadPercent] = useState(0);

  const options_compress = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 300,
    useWebWorker: true
  }
  const [isPropertyInputData, setPropertyInputData] = useState(()=>{
    if(prop && prop.traits && prop.traits.length > 0) {
        let tmp = [] ;
        let cnt = 0;
        prop.traits.map ((trait , idx)=>{
          trait.display_type == 'text' && (
            tmp.push({id:cnt ++ , type: trait.trait_type, name: trait.value}) 
          )
        })
        console.log(tmp);
        return tmp ; 
    }else {
    return [{id: 0, type: '', name: ''}];
    }
  }
  );

  useEffect(() => {
    if(isPropertyInputData.length < 1) setPropertyCount(1);
    else setPropertyCount(isPropertyInputData.length);
  }, [isPropertyInputData]);

  const [isLevelCount, setLevelCount] = useState(1);
  const [isLevelInputData, setLevelInputData] = useState(()=>{
    if(prop && prop.traits && prop.traits.length > 0) {
        let tmp = [] ;
        let cnt = 0;
        prop.traits.map ((trait , idx)=>{
          trait.display_type == "progress" && (
            tmp.push({id:cnt ++ , name: trait.trait_type, f_num: trait.value , s_num: trait.max_value}) 
          )
        })
        return tmp ; 
    }else {
    return [{id: 0, name: '', f_num: 3, s_num: 5}];
    }
  });

  useEffect(() => {
    if(isLevelInputData.length < 1) setLevelCount(1);
    else setLevelCount(isLevelInputData.length);
  }, [isLevelInputData]);

  const [isStatCount, setStatCount] = useState(1);
  
  const [isStatInputData, setStatInputData] = useState(()=>{
    if(prop && prop.traits && prop.traits.length > 0) {
        let tmp = [] ;
        let cnt = 0;
        prop.traits.map ((trait , idx)=>{
          trait.display_type == "number" && (
            tmp.push({id:cnt ++ , name: trait.trait_type, stat_f_num: trait.value , stat_s_num: trait.max_value}) 
          )
        })
        return tmp ; 
    }else {
    return [{id: 0, name: '', stat_f_num: 3, stat_s_num: 5}];
    }
  });

  useEffect(() => {
    if(isStatInputData.length < 1) setStatCount(1);
    else setStatCount(isStatInputData.length);
  }, [isStatInputData]);

  const [unlockChecked, setUnlockChecked] = useState(false);
  const [isthreedfile, setThreefile] = useState(false);
  const [isMintCollapse, setMintCollapse] = useState(false);
  const [isLimitCollapse, setLimitCollapse] = useState(false);

  const [isAvatarSrc, setAvatarSrc] = useState(null);
  const [limit_size , setLimitSize] = useState(104857600) ;
  const [fileListMain, setFileListMain] = useState([]) ;
  const [fileListMTL, setFileListMTL] = useState([]) ;
  const [fileListTexture, setFileListTexture] = useState([]) ;
  const [isMtlOption ,setMtlOption] = useState(false);
  const [isTextureOption ,setTextureOption] = useState(false);
  const [beforeUploadingMsg , setBeforeUploadingMsg] = useState('') ;
  const [isDirectoryFlg , setDirectoryFlg] = useState(false) ;
  const [isMTLAsolutePath ,setMTLAsolutePath] = useState('') ;

  let itemId;
  const setItemId = (_id) => {
      itemId = _id;
  }

  const acc = localStorage.getItem('account');
  useEffect(() => {
    if (prop) {
        setType("update")
    } else {
        setType("create")
    }
  }, [prop])

  useEffect(() => {
    setRoyaltyAddress(acc);
  }, [])

  const mainwarning = <div className="text-center" ><span>Begin by uploading a preview image for your NFT. Please wait until all files are uploaded, before pressing the 'create' button. <br/><br/>please make sure all files have been downloaded<br/>Before minting your 3D model, please ensure you verify and check your 3D model is displaying accurately at <a style={{color:'#f70dff'}} href="http://3dviewer.net/" target="_blank">http:/3dviewer.net</a> or <a style={{color:'#f70dff'}} href="https://threejs.org/editor/" target="_blank">https:/threejs.org/editor</a> </span></div> ;
  const contentMTL = <div>Select the texture for your NFT. <br/>Make sure the texture file isn't defined in a subfolder, otherwise it won't load accurately.</div>
  useEffect(()=>{
    setBeforeUploadingMsg(mainwarning);
  },[isThreeDOpt]);

  useEffect(()=>{
  },[imageSrc_preview]);

  const validationNftSupplyItem = (supply_num) => {
    if (supply_num === '') {
      return false;
    }
    return true;
  }

  const blockchainData = [
    {
        chainId: 5,
        name: 'Goerli-Testnet',
        logo: goerliNetworkLogo
    },
    {
        chainId: 1,
        name: 'Ethereum',
        logo: ethNetworkLogo
    }
  ];

  const isSameProperties = () => {
    if(!prop) return false;
    if(!prop.traits) return false;
    let prop_num_org = 0, prop_num = 0;
    for(let i = 0; i < prop.traits.length; i ++) {
      if(prop.traits[i].display_type == 'text') prop_num_org ++;
    }
    for(let i = 0; i < isPropertyInputData.length; i ++) {
      if(isPropertyInputData[i].name != '') prop_num ++;
    }
    if(prop_num_org != prop_num) return false;
    let cnt = 0;
    for(let i = 0; i < isPropertyInputData.length; i ++) {
      if(isPropertyInputData[i].name == '') continue;
      for(let j = 0; j < prop.traits.length; j ++) {
        if(prop.traits[j].display_type != 'text') continue;
        if(isPropertyInputData[i].type == prop.traits[j].trait_type && 
          isPropertyInputData[i].name == prop.traits[j].value) {
          cnt ++;
          break;
        }
      }
    }
    if(cnt == prop_num) return true;
    return false;
  }

  const isSameLevel = () => {
    if(!prop) return false;
    if(!prop.traits) return false;
    let prop_num_org = 0, prop_num = 0;
    for(let i = 0; i < prop.traits.length; i ++) {
      if(prop.traits[i].display_type == 'progress') prop_num_org ++;
    }
    for(let i = 0; i < isLevelInputData.length; i ++) {
      if(isLevelInputData[i].name != '') prop_num ++;
    }
    if(prop_num_org != prop_num) return false;
    let cnt = 0;
    for(let i = 0; i < isLevelInputData.length; i ++) {
      if(isLevelInputData[i].name == '') continue;
      for(let j = 0; j < prop.traits.length; j ++) {
        if(prop.traits[j].display_type != 'progress') continue;
        if(isLevelInputData[i].name == prop.traits[j].trait_type &&
           isLevelInputData[i].f_num == prop.traits[j].value && 
           isLevelInputData[i].s_num == prop.traits[j].max_value) {
          cnt ++;
          break;
        }
      }
    }
    if(cnt == prop_num) return true;
    return false;
  }

  const isSameStat = () => {
    if(!prop) return false;
    if(!prop.traits) return false;
    let prop_num_org = 0, prop_num = 0;
    for(let i = 0; i < prop.traits.length; i ++) {
      if(prop.traits[i].display_type == 'number') prop_num_org ++;
    }
    for(let i = 0; i < isStatInputData.length; i ++) {
      if(isStatInputData[i].name != '') prop_num ++;
    }
    if(prop_num_org != prop_num) return false;
    let cnt = 0;
    for(let i = 0; i < isStatInputData.length; i ++) {
      if(isStatInputData[i].name == '') continue;
      for(let j = 0; j < prop.traits.length; j ++) {
        if(prop.traits[j].display_type != 'number') continue;
        if(isStatInputData[i].name == prop.traits[j].trait_type &&
          isStatInputData[i].stat_f_num == prop.traits[j].value && 
          isStatInputData[i].stat_s_num == prop.traits[j].max_value) {
          cnt ++;
          break;
        }
      }
    }
    if(cnt == prop_num) return true;
    return false;
  }

  const sendData = () => {
    setLoadingSpin(true);
    if (!validationNftSupplyItem(isSupplyItemNums)) {
      Swal.fire({
        title: 'Warning!',
        text: `Please enter your NFT supply. The value has to be greater than 0.`,
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      });
      setLoadingSpin(false);
      return;
    }

    if(isItemDescription.length > 20000) {
      Swal.fire({
        title: 'Warning!',
        text: `Description length should not be exceed more than 20k letters.`,
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      });
      setLoadingSpin(false);
      return;
    }

    if(isSupplyItemNums > 100000) {
      Swal.fire({
        title: 'Warning!',
        text: `NFT supply should not be exceed more than 100k`,
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      });
      setLoadingSpin(false);
      return;
    }

    if(isName.length > 50) {
      Swal.fire({
        title: 'Warning!',
        text: `NFT name should not be exceed more than 50 characters`,
        icon: 'error',
        confirmButtonText: 'Close',
        timer: 5000,
        customClass: 'swal-height'
      });
      setLoadingSpin(false);
      return;
    }

    const formData = new FormData();
    formData.append('type', isType);
    formData.append('raw_image', isRawImage);
    formData.append('title', isName);
    formData.append('description', isItemDescription);
    formData.append('collection', isSelectCollectionId);
    formData.append('asset_type', isNftType);
    formData.append('asset', isForm);
    formData.append('supply_number', isSupplyItemNums);
    formData.append('chain_id', blockchain);

    if(isFormPreview) formData.append('asset_preview' , isFormPreview) ;

    if(isthreedfile) {
      formData.append('raw_animation', isRawAnimation) ;
      // formData.append('raw_animation_type', isRawAnimation_type) ;
      formData.append('raw_animation_mtl', isRawAnimationMTL) ;
      formData.append('preview', isPreImgForm);
      isRawAnimationTexture.forEach(file => {
        formData.append('raw_animation_texture[]', file);
      });
      formData.append('isMTLForm' , isMTLForm);
      isTextureForm.forEach(file => {
        formData.append('isTextureForm', file);
      });
      isTextureFormAddingURL.forEach(file => {
        formData.append('isTextureFormAddingUrl[]', file);
      })
      formData.append('raw_animation_type' , isThreeDOpt) ;
    }

    if (prop) {
      formData.append('item_id', prop.id && prop.id);
    }
    if(isNftType == "video/mp4" || isNftType == "audio/mpeg" || isNftType == "") {
      formData.append('raw_animation', isRawAnimation);
      formData.append('preview', isPreImgForm);
    }
    formData.append('is_sensitive',esChecked);
    formData.append('has_unlockable_content',unlockChecked);
    if(unlockChecked) {
     formData.append('unlockable_content',isUnlockableContent);

    }

    formData.append('has_royalty', isRoyalty);
    if(isRoyalty) {
      formData.append('royalty_fee', royaltyFee);
      formData.append('royalty_address', royaltyAddress);
    }

    if(!isSameProperties()) {
      let count = 0;
      isPropertyInputData.map((properti,inx)=>{
        if(properti.name !=""){
          count ++;
          formData.append('properties_trait_type[]',properti.type) ;
          formData.append('properties_value[]',properti.name) ;
        }
      })
      if(count == 0) formData.append('removed_properties', true);
    }
 
    if(!isSameLevel()) {
      let count = 0;
      isLevelInputData.map((level,inx)=>{
        if(level.name !=""){
          count ++;
          formData.append('levels_trait_type[]',level.name) ;
          formData.append('levels_value[]',level.f_num) ;
          formData.append('levels_max_value[]',level.s_num) ;
        }
      })
      if(count == 0) formData.append('removed_levels', true);
    }

    if(!isSameStat()) {
      let count = 0;
      isStatInputData.map((stat,inx)=>{
        if(stat.name !="") {
          count ++;
          formData.append('stats_trait_type[]',stat.name) ;
          formData.append('stats_value[]',stat.stat_f_num) ;
          formData.append('stats_max_value[]',stat.stat_s_num) ;
        }
      });
      if(count == 0) formData.append('removed_statistics', true);
    }

    const createItems = {
      newData: formData,

      accessToken: data,
      setItemId: setItemId,
    }

    setActiveCreateButton(false);

    const clearState = () => {
      setType('create');
      setNftType('image/jpeg');
      setImageSrc('');
      setOtherTypeSrc('');
      setPreImgForm({});
      setForm(null);
      setForm_preview(null) ;
      setRawImage('');
      setRawAnimation('');
      setName('');
      setItemDescription('');
      setUnlockableContent('');
      setNetworkOpt(1);
      setSupplyItemNums(1);
      setESChecked(false);
      setRoyaltyChecked(false);
      setRoyaltyAddress('');
      setRoyaltyFee(10);
      setUnlockChecked(false);
      setPropertyCount(1);
      setLoadingSpin(false);
      setPropertyInputData([{
        id: 0, type: '', name: ''
      }]);
      setLevelInputData([{
        id: 0, name: '', f_num: 3, s_num: 5
      }])
      setStatInputData([{
        id: 0, name: '', stat_f_num: 3, stat_s_num: 5
      }])
      setLevelCount(1)
      setStatCount(1)
      setMintCollapse(false)
      setLimitCollapse(false)
      {
        itemId && itemId > 0 && navigate(`/ItemDetail/${itemId}`)
      }
    }
    dispatch(createNftMinting(createItems)).then(clearState).catch(err => {
      setActiveCreateButton(true);
      setLoadingSpin(false);
    })
  }

  useEffect(() => {
    getCollections();
    getAuthorInfoData();
  }, [])

  const getCollections = async () => {
    const header = { 'Authorization': `Bearer ${data}` }
    const result = await Axios.get("/api/users/collections", { headers: header });
    const datas = result.data.data;
    const collections = datas.filter((data) => data.is_voxel == true);
    if (collections && collections.length > 0) {
      for(let i = 0; i < collections.length; i ++ ) {
        if(propForAdd && propForAdd == collections[i].id) {
          setCollectionChain(collections[i].chain_id);
          setBlockchain(collections[i].chain_id);
        }
        selectCollection(val => [...val, { id: collections[i].id, name: collections[i].name, chain_id: collections[i].chain_id, royalty_address: collections[i].royalty_address, royalty_fee: collections[i].royalty_fee}])
      } 
    }
  }

  const getAuthorInfoData = async () => {
    const author_info = await Axios.get(`/api/users/?public_address=${acc}`);
    setAvatarSrc(author_info.data.avatar);
  }

  const check_type=(e)=>{
    let file_type = "" ;
    for (let i = e.length -1 ; i > 0 ; i --) {
      if(e[i]=='.')break;
      file_type +=e[i] ;
    }
    file_type = file_type.split("").reverse().join("");
    return file_type ;
  }

  const add_ipfs_main_raw_animation = async (file)=>{
    try {
      const added = await ipfs.add(file)
      const cid = added.path;
      if (cid) {
        const data = `https://ipfs.io/ipfs/${cid}`;
          setRawAnimation(data) ;
      }
    } catch (error) {
    } 
  }

useEffect(()=>{
  let mtlPathArray = isMTLAsolutePath.split('/') ;
  let texturePathArray ;
  let addingUrl = '' ;
  isTextureForm.forEach( file =>{
    texturePathArray = file.webkitRelativePath.split('/') ;
    addingUrl = '' ;
    let i = 0;
    while (1) {
      if(i >= mtlPathArray.length || i >= texturePathArray.length ) break ;
      if(mtlPathArray[i] != texturePathArray[i]) break ;
      i ++ ;
    }
    if(i< texturePathArray.length - 1) addingUrl = texturePathArray[i] ;
    for(let j = i + 1 ; j < texturePathArray.length - 1 ; j ++ ){
      addingUrl += '/' + texturePathArray[j] ;
    }
    setTextureFormAddingURL((isTextureFormAddingURL)=>{return [...isTextureFormAddingURL , addingUrl]}) ;
  }) ;

},[isTextureForm]) ;

  const props = {
    
    beforeUpload : file => {
      let mtlAsolutePath = "";
      let textureAsolutePath = "" ;
      
        if(check_type(file.name).toLowerCase() == 'obj' || check_type(file.name).toLowerCase() == 'fbx' || check_type(file.name).toLowerCase() == 'glb' || check_type(file.name).toLowerCase() == 'gltf'){
          setFileListMain([fileListMain, file]) ;
          setForm(file) ;
          add_ipfs_main_raw_animation(file) ;
          if(check_type(file.name).toLowerCase() != isThreeDOpt){
            Swal.fire({
              title: 'Warning!',
              text: `please check uploading file type should be ${check_type(file.name).toLowerCase()} file.`,
              icon: 'error',
              confirmButtonText: 'Close',
              timer: 5000,
customClass: 'swal-height'
            })
          }
        }else if(check_type(file.name).toLowerCase() == 'mtl' || check_type(file.name).toLowerCase() == 'bin') {
          setMTLForm(file);
          add_ipfs_MTL_raw_animation(file) ;
          mtlAsolutePath = file.webkitRelativePath ;
          setMTLAsolutePath(file.webkitRelativePath) ;
        }else {
          setTextureForm((isTextureForm)=>{return [...isTextureForm , file]}) ;
          add_ipfs_Texture_raw_animation(file) ;
          textureAsolutePath = file.webkitRelativePath ;
        }

    },
  };

  const props1 = {
    
    

    onRemove: file => {
      const index = fileListMain.indexOf(file);
      const newFileList = fileListMain.slice();
      newFileList.splice(index, 1);
      setFileListMain(newFileList);
    },
    beforeUpload: (file,filename) => {
      const isAccept = check_type(file.name).toLowerCase() == isThreeDOpt ;
      if(!isAccept) {
        Swal.fire({
          title: 'Warning!',
          text: `please check uploading file type should be ${isThreeDOpt} file.`,
          icon: 'error',
          confirmButtonText: 'Close',
          timer: 5000,
customClass: 'swal-height'
        })
      }else{
        if(check_type(file.name).toLowerCase() == isThreeDOpt ) ;
        if(check_type(file.name).toLowerCase() != 'fbx') {
          setMtlOption(true) ;
        }else {
          setTextureOption(true) ;
        }
        
        setFileListMain([fileListMain, file]) ;
        
        setForm(file) ;
        add_ipfs_main_raw_animation(file) ;
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  
    onDrop(e) {
    },
  };

  const setValidateRoyaltyFee = (e) => {
    if(e.target.value.length > 5) {
      return;
    }
    let fee = Number(e.target.value.toString().replace('+', '').replace('-', ''));
    console.log(fee);
    if (fee == '+' || fee == '-') {
      return;
    }
    if (fee > 25) {
      fee = 25;
    } else if (fee < 0) {
      fee = 0;
    }
    setRoyaltyFee(fee);
  }

  const add_ipfs_MTL_raw_animation = async(file)=>{
    try {
      const added = await ipfs.add(file)
      const cid = added.path;
      if (cid) {
        const data = `https://ipfs.io/ipfs/${cid}`;
          setRawAnimationMTL(data) ;
      }
      } catch (error) {
      } 
  }

  const props2 = {
    
    onRemove: file => {
      const index = fileListMTL.indexOf(file);
      const newFileList = fileListMTL.slice();
      newFileList.splice(index, 1);
      setFileListMTL(newFileList);
    },
    beforeUpload: file => {
      const isAccept = (check_type(file.name).toLowerCase() == 'mtl' || check_type(file.name).toLowerCase() == 'bin') ;
      if(!isAccept) {
        Swal.fire({
          title: 'Warning!',
          text: `please check uploading file type should be MTL/BIN file.`,
          icon: 'error',
          confirmButtonText: 'Close',
          timer: 5000,
          customClass: 'swal-height'
        })
      } else {
        setFileListMTL([fileListMTL, file]);
        setTextureOption(true) ;
        setMTLForm(file);
        add_ipfs_MTL_raw_animation(file) ;
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onDrop(e) {
    },
  };

  const add_ipfs_Texture_raw_animation = async(element)=>{
    try {
      const added = await ipfs.add(element)
      const cid = added.path;
      if (cid) {
        const data = `https://ipfs.io/ipfs/${cid}`;
        setRawAnimationTexture((isRawAnimationTexture)=>[...isRawAnimationTexture , data]) ;
      }
    } catch (error) {
    } 
  }

  const props3 = {  
    onRemove: file => {
      const index = fileListTexture.indexOf(file);
      const newFileList = fileListTexture.slice();
      newFileList.splice(index, 1);
      setFileListTexture(newFileList);
    },
    beforeUpload: file => {
      setFileListTexture([fileListTexture, file]);
      setTextureForm((isTextureForm)=>{return [...isTextureForm , file]}) ;
      add_ipfs_Texture_raw_animation(file) ;
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onDrop(e) {
    },
  };

  const initFile = (e) =>{
    setThreeTypeOpt(e) ;
    setTextureOption(false) ;
    setMtlOption(false) ;
  }
  const onDirectoryClick = (e)=>{
      setDirectoryFlg(!isDirectoryFlg) ;
  }
  const handleImageSelect_threeD = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    setLoadingSpin(true);
    setActiveCreateButton(true);
    setOtherTypeSrc(URL.createObjectURL(file)) ;
    setPreImgForm(file);
    setNftType('3D') ;
    const compressedFile = await imageCompression(file, options_compress);
    setForm_preview(compressedFile) ;

    try {
      const added = await ipfs.add(file)
      const cid = added.path;
      if (cid) {
        const data = `https://ipfs.io/ipfs/${cid}`;
          setRawImage(data) ;
      }
    } catch (error) {
    } 
    setLoading(false);
    setLoadingSpin(false);
  }
 
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];

    setImageSrc_preview(URL.createObjectURL(file))
    setLoading(true);
    startProgressBar();
    setActiveCreateButton(true);
    
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

  const uploadToIpfs = async (file) => {
    setLoadingSpin(true);
    try {
      // const autoToken = { 'Authorization': `Bearer ${data}` }
      const added = await ipfs.add(file) ;
      // const res = await Axios.post("https://ipfs.infura.io:5001/api/v0/add?pin=true&wrap-with-directory=true", {file:file }, {headers: autoToken}) ;
      // console.log(res , 'axios post JST token') ;
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
    setLoadingSpin(false);
  }

  const startProgressBar = () => {
    setUploadPercent(0);
    incrasePercent(0);
  }

  const incrasePercent = (percent) => {
    if (percent < 50) {
      setUploadPercent(percent);
      setTimeout(() => {
        incrasePercent(percent + 1)
      }, 100);
    }
  }

  const updateProgressBar = (e) =>
  {
    setUploadPercent(Math.floor((50 + (e.loaded / e.total) * 50)));
  }
  
  const hideProgressBar = () =>
  {
    setLoading(false)
  }

  const [collectionChain, setCollectionChain] = useState(prop && prop.collection? prop.collection.chain_id : 0);

  const handleChangeOtherType = () => { 
    setNftType('image/jpeg');
    setImageSrc('');
    setOtherTypeSrc('');
    setRawImage('');
    setPreImgForm({})
  }

  const inputNumValidation = (e, param) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === 0 || e.target.value === '' || re.test(e.target.value)) {
      if(param == "item_supply") {
        if(parseInt(e.target.value) > 100000) return;
        setSupplyItemNums(e.target.value)
      }
    }
  }

  const handleChange = (value) => {
    selectCollectionId(value);
    for(let i = 0; i < isSelectCollection.length; i ++) {
      if(isSelectCollection[i].id == value) {
        setBlockchain(isSelectCollection[i].chain_id);
        setCollectionChain(isSelectCollection[i].chain_id);
        if(isSelectCollection[i].royalty_address) {
          setRoyaltyChecked(true);
          setRoyaltyAddress(isSelectCollection[i].royalty_address);
          setRoyaltyFee(isSelectCollection[i].royalty_fee);
        } else {
          setRoyaltyChecked(false);
          setRoyaltyAddress('');
          setRoyaltyFee(10);
        }
      }
    }
  }

  const removeEvent = rowId => {
    if(isPropertyCount > 1) {
      const array = isPropertyInputData.filter((row) => row.id !== rowId);
      setPropertyInputData(array)
    } else {
      setPropertyInputData([{
        id: 0, type: '', name: ''
      }])
    }
    if(isPropertyCount > 1) {
      setPropertyCount(isPropertyCount - 1)
    } else {
      setPropertyCount(1)
    }
    if(isPropertyCount > 1) {
      setPropertyCount(isPropertyCount - 1)
    } else {
      setPropertyCount(1)
    }
  }

  const removeLevelRowEvent = rowId => {
    if(isLevelCount > 1) {
      setLevelCount(isLevelCount - 1)
    } else {
      setLevelCount(1)
    }
    if(isLevelCount > 1) {
      const array = isLevelInputData.filter((row) => row.id !== rowId);
      setLevelInputData(array)
    } else {
      setLevelInputData([{
        id: 0, name: '', f_num: 3, s_num: 5
      }])
    }
  }

  const removeStatRowEvent = rowId => {
    if(isStatCount > 1) {
      setStatCount(isStatCount - 1)
    } else {
      setStatCount(1)
    }
    if(isStatCount > 1) {
      const array = isStatInputData.filter((row) => row.id !== rowId);
      setStatInputData(array)
    } else {
      setStatInputData([{
        id: 0, name: '', f_num: 3, s_num: 5
      }])
    }
  }

  const propertyInputEvent = (e, idx) => {
    let properties = [...isPropertyInputData];

    const { name, value } = e.target ;
    if(value.length > traitCharLimit) return;
    properties.map((property,inx) =>{
      inx == idx && (property[name] = value)
    });

    setPropertyInputData(properties);
  }
  const itemRenderer = (properties ,inx)=>{
    return (
      properties.name != "" &&
      <div className="properties-div" key={inx} style={{width:'178px'}}>
        <div className="properties-detail">
          <div className="NorTxt"> <h5 style={{fontSize:'16px',marginBottom:'-3px'}}>{properties.type}</h5></div>
          <div className="NorTxt"><b>{properties.name} </b></div>
        </div>                              
      </div>
    )
  }
  const handleRLDDChange =(reorderedItems)=>{
    setPropertyInputData(reorderedItems)
  }

  const itemRenderer_level = (level ,inx)=>{
    return (
      level.name != "" &&
      <div className="progress-div" key={inx}>
        <div className="progress-properties">
          <div>{level.name}</div>
          <div>{level.f_num} of {level.s_num}</div>
        </div>
        <Progress percent={level.f_num/level.s_num*100} strokeWidth	={12} showInfo={false} strokeColor="#f70dff" />
      </div>
    )
  }
  const handleRLDDChange_level =(reorderedItems)=>{
    setLevelInputData(reorderedItems)
  }

  const itemRenderer_stat = (stat ,inx)=>{
    return (
      stat.name != "" &&
      <div className="progress-div" key={inx}>
        <div className="progress-properties">
            <div>{stat.name}</div>
            <div>{stat.stat_f_num} of {stat.stat_s_num}</div>
          </div>
      </div>
    )
  }
  const handleRLDDChange_stat =(reorderedItems)=>{
    setStatInputData(reorderedItems)
  }
  const levelInputEvent = (e, inx) => {

    let levels = [...isLevelInputData];

    const { name, value } = e.target;
    if(value.length > traitCharLimit) return;
    levels.map((level , idx)=>{
      idx == inx && (level[name] = value)
    }) ;

    setLevelInputData(levels);
  }

  const statInputEvent = (e, idx) => {

    let stats = [...isStatInputData];

    const { name, value } = e.target;
    if(value.length > traitCharLimit) return;
    stats.map((stat , inx)=>{
      inx == idx && (stat[name] = value)
    }) ;

    setStatInputData(stats);
  }

  const addRowEvent = async () => {
    let properties = isPropertyInputData.concat({
      id: isPropertyInputData.length, type: '', name: ''
    });
    setPropertyCount(isPropertyCount + 1)
    setPropertyInputData(properties);
  }

  const addLevelRowEvent = async () => {
    let levels = isLevelInputData.concat({
      id: isLevelInputData.length, name: '', f_num: 3, s_num: 5
    });
    setLevelCount(isLevelCount + 1)
    setLevelInputData(levels);
  }

  const addStatRowEvent = async () => {
    let stats = isStatInputData.concat({
      id: isStatInputData.length, name: '', stat_f_num: 3, stat_s_num: 5
    });
    setStatCount(isStatCount + 1)
    setStatInputData(stats);
  }

  const handleUnlockChange = () => {
    setUnlockChecked(!unlockChecked)
  }

  const handleThreeDfileChange = () => {
    setThreefile(!isthreedfile)
    if(!isthreedfile){
      setTextureOption(false);
      setMtlOption(false);
    }
  }
  
  const handleESChange = () => {
    setESChecked(!esChecked)
  }

  const handleRoyalty = () => {
    if(isRoyalty == true) {
      setRoyaltyFee(10);
      setRoyaltyAddress(acc);
    }
    setRoyaltyChecked(!isRoyalty);
  }
  
  const [blockchain, setBlockchain] = useState(prop && prop.collection? prop.collection.chain_id : 1);

  const handleBlockchainChange = async (value) => {
    setBlockchain(value);
  }

  useEffect(() => {
    
    if(!isRoyalty) {
      setValidRoyalty(true);
    } else {
      if(!ethers.utils.isAddress(royaltyAddress) || isNaN(royaltyFee) || royaltyFee == "") {
        setValidRoyalty(false);
      } else {
        setValidRoyalty(true);
      }
    }
  }, [isRoyalty, royaltyFee, royaltyAddress])

  const handleCancelAction = () => {
    navigate(`/ItemDetail/${prop && prop.id}`)
  }

  const CreateSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    unlockContent: Yup.string().required('Unlock content is required'),
  });

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

  const imageUploaderStyle = {
    background: 'black',
    opacity:'0.2',
    cursor: 'pointer',
    marginTop: 10,
    border: '5px dashed #00000026',
    borderRadius: 15,
    boxShadow: 'none'
  }

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

  const iconStyle = {
    fontSize: 18,
    padding: '5px 10px 5px 0px'
  }
  const iconStyle_p_l = {
    fontSize: 21,
    padding: '5px 10px 5px 5px'
  }
  
  const inputLabelStyle = {
    fontSize: 16,
  }

  const modalHeaderInline = {
    fontWeight: 500,
    fontSize: 30,
  }

  const collapseContent = {
    padding: 15,
    border: '1px solid #ccc',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const collapseTitle = {
    marginLeft: 20,
    fontSize: 30,
    fontWeight: 500,
    fontFamily: 'Poppins, sans-serif'
  }

  const collapseIcon = {
    fontSize: 25,
    fontWeight: 500
  }

  const collapseView = {
    fontSize: 20,
    fontWeight: 500,
    padding: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  }

  const primaryBtnStyle = {
    padding: '8px 40px', 
    color: 'white', 
    backgroundColor: '#f70dff', 
    border: '1px solid #f70dff', 
    borderRadius: '8px'
  }

  const cancelBtnStyle = {
    padding: '8px 40px', 
    color: '#f70dff', 
    backgroundColor: 'white', 
    border: '1px solid #f70dff', 
    borderRadius: '8px',
    margin: '0px 10px',
  }

  const disableBtnStyle = {
    padding: '5px 40px', 
    color: 'grey', 
    backgroundColor: '#e9ecef', 
    border: '1px solid #e5e8eb', 
    borderRadius: '5px'
  }

  const iconBtnStyle = {
    cursor: "pointer", 
    fontSize: 18, 
    margin: '0px 3px 3px'
  }

  const ThreeDFileOpts = [
    { value: "obj", label: "OBJ file"},
    { value: "fbx", label: "FBX file"},
    { value: "glb", label: "GLB file"},
    { value: "gltf", label: "GLTF file"},
  ];

  const { errors, handleSubmit } = formik;
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin/>
  return (
    <>
      <div>
        <GlobalStyles />

        <section className='jumbotron breadcumb no-bg backgroundBannerStyleCreate' style={{backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'right top'}}>
          <div className='mainbreadcumb'>
            <div className='custom-container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center' style={{textShadow:'2px 2px 2px rgba(0,0,0,.5)', fontFamily:'Inter'}}>Create</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='custom-container'>
          {loadingSpin &&
            <div style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(255,255,255,0.5)', zIndex: '100'}}>
              <MoonLoader cssOverride={{position: 'absolute', top: '50%', left: '50%', borderColor: 'rgb(220, 219, 219)'}} loading={loadingSpin} size={100} />
            </div>
          }
        
          <div className="row">
            <div className="col-lg-7 offset-lg-1 mb-5">
              <FormikProvider value={formik}>
                <Form id="form-create-item" autoComplete="off" className="form-border" noValidate onSubmit={handleSubmit}>
                  <div className="">
                  
                    <h5>Upload your file{" "}<i style={{ color: 'red' }}>*</i></h5>
                  
                    <span><b style={{fontWeight:'600'}}>Supported File Types </b>: PNG, JPG, GIF, WEBP ,  MP4 , FBX , GLB , OBJ , GLTF. Max size: 100 MB.</span>
                      <div className="align-items-center" style={{ display: 'flex', marginTop: '10px', marginBottom: '20px' }}>
                        <div className="" style={{marginRight:'20px'}} >
                          <div>
                            <span>Click here to upload 3D file.</span>
                          </div>
                        </div>
                        <div className="" style={{ textAlign: 'right',marginTop:'5px' }}>
                          <Switch 
                              onChange={handleThreeDfileChange}
                              checked={isthreedfile}  
                              uncheckedIcon={false}
                              checkedIcon={false}
                              handleDiameter={25}
                              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                              activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                              height={20}
                              width={48}
                              onColor="#f70dff" />
                        </div>
                      </div>
                      
                    {
                      isthreedfile ? 
                      <div>
                          <h5>Preview Image</h5>
                          <span><b style={{fontWeight:'600'}}>Recommended: </b>Please ensure to upload preview image with 7:9 ratio for perfect display.</span>
                          <div className="row trashIcon">
                            <ImageUpload
                              handleImageSelect={handleImageSelect_threeD}
                              imageSrc={isOtherTypeSrc}
                              setImageSrc={setOtherTypeSrc}
                              defaultDeleteIconSize={20}
                              className="imageUploader"
                              defaultDeleteIconColor="white"
                              style={{
                                width: 250,
                                height: 250,
                                ...imageUploaderStyle
                              }}
                            />
                          </div>
                              
                          <br/>

                          <div>
                            <Checkbox onChange={onDirectoryClick} color="#f70dff" checked = {isDirectoryFlg}>upload directory</Checkbox>
                          </div>
                          <div>
                            <Select style={{ width: "50%" }} onChange={(e) => initFile(e)} options={ThreeDFileOpts} defaultValue="OBJ file" placeholder="Select your 3D file type"></Select>
                          </div>
                          {
                            isDirectoryFlg ?
                              <div style={{display:'flex',justifyContent:'' }}>
                                <Upload  className="uploadingFile" {...props}  accept='obj' directory >
                                    <Button style={{borderRadius:'5px'}} className="nft_attr" icon={<UploadOutlined />}>Select directory</Button>
                                </Upload>
                                <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                  <Tooltip placement="top" title="You are about to upload a .zip file. Please make sure that it contains only one 3D file, and one one MTL or Bin file or the render will fail. We recommend a manual upload to prevent possible mistakes.">
                                      <FiInfo style={iconBtnStyle} />
                                  </Tooltip> 
                                </div>
                              </div>
                              :
                              <div>
                                <br/>
                              <Upload  className="uploadingFile" {...props1}  accept='obj' maxCount={1}>
                                <div style={{display:'flex',justifyContent:'space-around' }}>
                                  <div>
                                    <Button style={{borderRadius:'5px'}} className="nft_attr" icon={<InboxOutlined />}>
                                    {
                                      isThreeDOpt =='obj'
                                      ?
                                        "Upload Obj file(original)"
                                      :
                                        (
                                          isThreeDOpt == 'fbx' ?
                                            "Upload FBX file(original)"
                                            : 
                                              (
                                                isThreeDOpt =='glb' ?
                                                  "Upload GLB file(original)"
                                                :
                                                  "Upload GLTF file(original)"
                                              )
                                        )
                                    }
                                    </Button> 
                                  </div>
                              {
                                isThreeDOpt=='obj'
                                ?
                                  <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title="upload OBJ file (will be black and white)">
                                        <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </div>
                                : 
                                (
                                  isThreeDOpt =='fbx' 
                                    ?
                                  <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title="upload FBX file">
                                      <FiInfo style={iconBtnStyle} />
                                    </Tooltip>                                       
                                  </div>
                                    :
                                      (
                                        isThreeDOpt =='glb'  
                                        ?
                                  <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title="upload GLB file">
                                      <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </div>
                                        :
                                  <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title="upload GLTF file">
                                      <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </div>  
                                      )
                                  
                                )
                              }
                                </div>
                              </Upload>

                          {isMtlOption ?
                              <Upload  className="uploadingFile" {...props2}  maxCount={1}>
                                <div style={{display:'flex',justifyContent:'space-around' }}>
                                  <div>
                                    <Button style={{borderRadius:'5px'}} className="nft_attr" icon={<InboxOutlined />}>Add MTL/BIN file (optional)</Button> 
                                  </div>
                                  {isThreeDOpt == 'obj'
                                    ?
                                  <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title={contentMTL}>
                                      <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </div>
                                    :
                                    (
                                      isThreeDOpt == 'fbx'
                                      ?
                                  <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title="this opens up only when FBX file is added first">
                                      <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </div>
                                      :
                                      (
                                        isThreeDOpt == 'glb'
                                        ?
                                  <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title="this opens up only when GLB file is added first">
                                      <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </div>
                                        :
                                  <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title="this opens up only when GLTF file is added first">
                                      <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </div>
                                      )
                                    )
                                  }
                                </div>
                              </Upload>
                            :
                              ""    
                          }
                          {isTextureOption ?
                              <Upload  className="uploadingFile" {...props3}  >
                                <div style={{display:'flex',justifyContent:'space-around' }}>
                                  <div>
                                    <Button style={{borderRadius:'5px'}} className="nft_attr" icon={<InboxOutlined />}>Add Texture file (optional)</Button> 
                                  </div>
                                  <div  style={{textAlign:'',marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title="this opens up only when MTL/BIN file  is added second">
                                      <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </div>
                                </div>
                              </Upload>
                            :
                              ""    
                          }
                            </div>
                          }
                          
                          <div className="warning_div" style={{marginBottom:'10px'}}>
                            <Alert
                                message="Warning"
                                description={beforeUploadingMsg}
                                type="warning"
                                showIcon
                              />
                          </div>
                        </div>
                      :
                      isNftType == "video/mp4" || isNftType == "audio/mpeg" || isNftType == "" ?
                        <>
                          {
                            !loading ?
                              <> 
                                {
                                  isNftType == "video/mp4" ?
                                    <video style={{ width: '100%' }} controls autoPlay loop muted>
                                      <source src={imageSrc} type="video/mp4" />
                                    </video>
                                  : (
                                      isNftType == 'audio/mpeg' ?
                                      <audio controls autoPlay loop muted>
                                        <source src={imageSrc} type="audio/mpeg" />
                                      </audio>
                                      :
                                      <p></p>
                                    )
                                }
                                <div>
                                  <ActionButton className="btn-main lead mr15 ItemBtnHover" onClick={handleChangeOtherType}>Change</ActionButton>
                                </div>
                                
                                <div className="spacer-single"></div>
                                
                                <h5>Preview Image</h5>
                                <div>
                                  <ImageUpload
                                    handleImageSelect={handleImageSelect}
                                    imageSrc={isOtherTypeSrc}
                                    setImageSrc={setOtherTypeSrc}
                                    className="imageUploader"
                                    defaultDeleteIconSize={20}
                                    defaultDeleteIconColor="white"
                                    style={{
                                      width: 250,
                                      height: 250,
                                      ...imageUploaderStyle
                                    }}
                                  />
                                </div>
                              </>
                            : <div>
                                <Spin indicator={antIcon} />
                                <h4>Please Wait ...</h4>
                              </div>
                          }
                        </>
                      : <div>
                        { !loading ?
                          <div className="row">
                            <span><b style={{fontWeight:'600'}}>Recommended: </b>Please ensure to upload preview image with 7:9 ratio for perfect display.</span>
                            <ImageUpload
                              handleImageSelect={handleImageSelect}
                              imageSrc={imageSrc}
                              setImageSrc={setImageSrc}
                              defaultDeleteIconSize={20}
                              className="imageUploader"
                              defaultDeleteIconColor="grey"
                              style={{
                                width: 250,
                                height: 250,
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
                    }
                    <div className="spacer-single"></div>
                    <div className="spacer-single"></div>
                    <div className="col-10" style={{ display: 'flex' }}>
                        <i className="fa fa-tag" style={iconStyle}></i>
                      <div>
                        <h5> Name your NFT{" "}<i style={{ color: 'red' }}>*</i></h5>
                      </div>
                    </div>
                    <Field
                      type="text"
                      name="name"
                      id="item_title"
                      className="form-control"
                      placeholder="Item name"
                      onChange={(e) => {if(e.target.value.length <=50) setName(e.target.value)}}
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
                    <span> Give <b>SuperKluster</b>  users an accurate description of your NFT. </span>
                    <textarea data-autoresize name="item_desc" onChange={e => setItemDescription(e.target.value)} value={isItemDescription ?? ""} id="item_desc" className="form-control mt-2" placeholder="Provide a description of your item" style={{ height: 150}}></textarea>

                    <div className="spacer-10"></div>

                    <div className="col-10" style={{ display: 'flex' }}>
                      <i className="fa fa-archive" style={iconStyle}></i>

                      <div><h5>NFT Collection</h5></div>
                    </div>
                    
                    <span>
                      Select the collection where your NFT will appear.
                    </span>
                    
                    <div className='dropdownSelect'>
                      {
                        propForAdd &&
                          <Select defaultValue={propForAdd} style={{ width: "100%" }} onChange={handleChange} placeholder="Select...">
                            {
                              isSelectCollection && isSelectCollection.length > 0 ?
                                isSelectCollection.map((opt) => (
                                  <Option key={opt.id} value={opt.id}>{opt.name}</Option>
                                )) : null
                            }
                          </Select>
                      }
                      {
                        !propForAdd &&
                          <Select defaultValue={prop && prop ? prop.collection.id : ''} style={{ width: "100%" }} onChange={handleChange} placeholder="Select...">
                            {
                              isSelectCollection && isSelectCollection.length > 0 ?
                                isSelectCollection.map((opt) => (
                                  <Option key={opt.id} value={opt.id}>{opt.name}</Option>
                                )) : null
                            }
                          </Select>
                      }
                    </div>
                    <div className="spacer-10"></div>
                    <div className="row align-items-center">
                      <div className="col-10" style={{ display: 'flex' }}>
                        <i className="fa fa-barcode" style={iconStyle}></i>
                        <div>
                          <h5>NFT Properties</h5>
                          <span>Set the traits of your NFT. These will show up as rectangles on the item detail page.</span>
                        </div>
                      </div>
                      <div className="col-2" style={{ textAlign: 'right' }}>
                        <button type="button" className="createModelBtn" data-bs-toggle="modal" data-bs-target="#properties" style={btnStyle}><i className="fa fa-plus"></i></button>
                      </div>
                      <div style={window.innerWidth > 1024 ? {display:'flex', flexWrap:'wrap'} :{display:'flex', overflowX:'auto'}}>
                        <RLDD
                            cssClasses="example"
                            items={isPropertyInputData}
                            itemRenderer={itemRenderer}
                            onChange={handleRLDDChange}
                          />
                      </div>
                    </div>

                    <div className="mt-3 mb-3 borderSy"></div>

                    <div className="row align-items-center">
                      <div className="col-10" style={{ display: 'flex' }}>
                        <i className="fa fa-level-up" style={iconStyle_p_l}></i>
                        <div>
                          <h5>NFT Levels</h5>
                          <span>Display which level your NFT is by adding numerical traits that are shown as a progress bar on the item detail page.</span>
                        </div>
                      </div>
                      <div className="col-2" style={{ textAlign: 'right' }}>
                        <button type="button" className="createModelBtn" data-bs-toggle="modal" data-bs-target="#levels" style={btnStyle}><i className="fa fa-plus"></i></button>
                      </div>
                      
                      <div>
                        <RLDD
                            items={isLevelInputData}
                            itemRenderer={itemRenderer_level}
                            onChange={handleRLDDChange_level}
                          />
                      </div>
                      
                    </div>

                    <div className="mt-3 mb-3 borderSy"></div>

                    <div className="row align-items-center">
                      <div className="col-10" style={{ display: 'flex' }}>
                        <i className="fa fa-bar-chart" style={iconStyle}></i>
                        <div>
                          <h5>NFT Statistics</h5>
                          <span>Add statistics to your NFT that display as numerical traits on the item detail page.</span>
                        </div>
                      </div>
                      <div className="col-2" style={{ textAlign: 'right' }}>
                        <button type="button" className="createModelBtn" data-bs-toggle="modal" data-bs-target="#stats" style={btnStyle}><i className="fa fa-plus"></i></button>
                      </div>
                    </div>
                    <div>
                          <RLDD
                            items={isStatInputData}
                            itemRenderer={itemRenderer_stat}
                            onChange={handleRLDDChange_stat}
                          />
                    </div>
                    <div className="mt-3 mb-3 borderSy"></div>

                    <div className="row align-items-center">
                      <div className="col-10" style={{ display: 'flex' }}>
                        <i className="fa fa-unlock" style={iconStyle}></i>
                        <div>
                          <h5>Unlockable Content</h5>
                          <span>Include unlockable content that is only accessible to the owner of the NFT item.</span>
                        </div>
                      </div>
                      <div className="col-2" style={{ textAlign: 'right' }}>
                        <Switch 
                          onChange={handleUnlockChange} 
                          checked={unlockChecked} onColor="#f70dff" />
                      </div>
                    </div>

                    {
                      unlockChecked ?
                        <div className="mb-3">
                            <Field 
                              name="unlockContent"
                              id="unlockContent"
                              as="textarea"
                              style={{minHeight:'100px'}}
                              className="form-control mt-2" 
                              value={isUnlockableContent ?? ""} 
                              onChange={e => setUnlockableContent(e.target.value)}  
                              placeholder="Provide content such as, but not limited to, certificates/proofs, physical collectibles, higher resolution media, exclusive content, discount codes, access to private communities etc" />
                    
                            {!isUnlockableContent && errors.unlockContent && <div style={{ color: 'red' }}>{errors.unlockContent}</div>}                         
                          <div>
                          </div>
                        </div>
                        : null
                    }

                    <div className="mt-3 mb-3 borderSy"></div>

                    <div className="row align-items-center">
                      <div className="col-10" style={{ display: 'flex' }}>
                        <i className="fa fa-user-secret" style={iconStyle}></i>
                        <div>
                          <h5>Set this item to Explicit & Sensitive Content</h5>
                        </div>
                      </div>
                      <div className="col-2" style={{ textAlign: 'right' }}>
                        <Switch onChange={handleESChange} checked={esChecked} onColor="#f70dff" />
                      </div>
                    </div>

                    <div className="mt-3 mb-3 borderSy"></div>
                    <br/>
                    <div className="col-10" style={{ display: 'flex' }}>
                      <i className="fa fa-clone" style={iconStyle}></i>
                      <div>
                        <h5>Set your NFT supply</h5>
                      </div>
                    </div>
                    <span>Choose the amount of your NFT that can be minted. If you set this value to 1, only one person will be able to mint your NFT. </span>
                    <input type="number" name="item_supply" id="item_supply" min={1} onChange={(e) => inputNumValidation(e, "item_supply")} value={isSupplyItemNums ?? ""} className="form-control mt-2"/>
                    <div className="spacer-10"></div>
                    <div className="col-10" style={{ display: 'flex' }}>
                        <i className="fa fa-cogs" style={iconStyle}></i>
                        <div>
                          <h5>Select your Blockchain</h5>
                        </div>
                    </div>
                    <Select style={{ width: "100%" }} disabled={collectionChain > 0 ? true : false} value = {blockchain} onChange={handleBlockchainChange}>
                      {
                        blockchainData?.map((item) => (
                            <Option key={item.chainId} value={item.chainId}>
                                <img style={{ width: 25, height: 25, marginRight: 5 }} src={item.logo} alt='blockchain_logo' />
                                {item.name}
                            </Option>
                        ))
                      }
                    </Select>

                    {(prop && prop.id) ? 
                      <div>
                        <div className="spacer-10"></div>
                        <div className="row align-items-center">
                          <div className="col-10" style={{ display: 'flex' }}>
                            <i className="fa fa-user-secret" style={iconStyle}></i>
                            <div>
                              <h5>Set royalty</h5>
                            </div>
                          </div>
                          <div className="col-2" style={{ textAlign: 'right' }}>
                            <Switch onChange={handleRoyalty} checked={isRoyalty} onColor="#f70dff" />
                          </div>
                        </div>
                        { isRoyalty ?
                          <div className="mb-3">
                            <span>Royalty Fee (%)</span>
                            <input type="number" min="0" max="25" name="royalty_fee" id="royalty_fee" onChange={(e) => setValidateRoyaltyFee(e)} value={royaltyFee} className="form-control mt-2" placeholder="for example: 10"/>
                            <span>Royalty Address</span>
                            <input type="text" name="item_supply" id="item_supply" onChange={(e) => setRoyaltyAddress(e.target.value)} value={royaltyAddress} className="form-control mt-2" placeholder="0x.." defaultValue={acc} />
                          </div> : 
                          null
                        }
                      </div> 
                      : 
                      <div>
                        <div className="spacer-10"></div>
                        <div className="row align-items-center">
                          <div className="col-10" style={{ display: 'flex' }}>
                            <i className="fa fa-user-secret" style={iconStyle}></i>
                            <div>
                              <h5>Set royalty</h5>
                            </div>
                          </div>
                          <div className="col-2" style={{ textAlign: 'right' }}>
                            <Switch onChange={handleRoyalty} checked={isRoyalty} onColor="#f70dff" />
                          </div>
                        </div>
                        { isRoyalty ?
                          <div className="mb-3">
                            <span>Royalty Fee (%)</span>
                            <input type="number" min="0" max="25" name="royalty_fee" id="royalty_fee" onChange={(e) => setValidateRoyaltyFee(e)} value={royaltyFee} className="form-control mt-2" placeholder="for example: 10"/>
                            <span>Royalty Address</span>
                            <input type="text" name="item_supply" id="item_supply" onChange={(e) => setRoyaltyAddress(e.target.value)} value={royaltyAddress} className="form-control mt-2" placeholder="0x.." defaultValue={acc} />
                          </div> : 
                          null
                        }
                      </div>
                    }

                    <div className="spacer-10"></div>
                  </div>
                </Form>
              </FormikProvider>
            </div>

            <div className="col-lg-3 col-sm-6 col-xs-12">
              <h5>Preview item</h5>
              <div className="nft__item m-0 card-box-shadow-style">  
                <div className="nft__item_like" style={{position:'absolute' , top:'20px' , right:'25px'}}>
                    <i className="fa fa-heart"></i><span>0</span>
                  </div>
                <div className="author_list_pp">
                  <span>
                    <img className="lazy" src={isAvatarSrc ? isAvatarSrc : defaultUser} alt="" />
                    <i className="fa fa-check"></i>
                  </span>
                </div>
                <div className="nft__item_wrap">
                  <span>
                    { isNftType.includes("image") && <img src={imageSrc_preview ? imageSrc_preview : defaultNFT} id="get_file_2" className="lazy nft__item_preview" alt="" /> }
                    { isNftType == "video/mp4" && <img src={isOtherTypeSrc ? isOtherTypeSrc : defaultNFT} id="get_file_2" className="lazy nft__item_preview" alt="" /> }
                    { isNftType == "audio/mpeg" && <img src={isOtherTypeSrc ? isOtherTypeSrc : defaultNFT} id="get_file_2" className="lazy nft__item_preview" alt="" /> }
                    { isNftType == "3D" && <img src={isOtherTypeSrc ? isOtherTypeSrc : defaultNFT} id="get_file_2" className="lazy nft__item_preview" alt="" /> }
                  </span>
                </div>
                <div className="nft__item_like" style = {{textAlign:'right', bottom:'0px'}}>
                    <i className="fa fa-clone"></i><span>{isSupplyItemNums}</span>
                </div>
                <div className="nft__item_info">
                  <div style={{marginTop:'10px', overflow:'hidden', textOverflow:'ellipsis'}}>
                    <span >
                      <h4>{isName ? isName : "Unnamed" }</h4>
                    </span>
                    <div className="nft__item_price" style={{display:'flex' , justifyContent:'flex-end'}}>
                      <StyledTokenImg src={isTokenIcon} /> 0
                    </div>
                    <div className="nft__item_price mb-2" style={{display:'flex' , justifyContent:'flex-end'}}>
                      0.00 USD
                    </div>
                  </div>                  
                </div>
              </div>
            </div>
          </div>
          <div className="spacer-10 mb-3 borderSy"></div>
            {prop ?
                <div className="offset-lg-1" style = {window.innerWidth < 576 ? {display:'flex', justifyContent:'center'}:{}}>
                    <button type="button" onClick={sendData} style={primaryBtnStyle}>Update</button> 
                    <button type="button" onClick={handleCancelAction} style={cancelBtnStyle}>Cancel</button> 
                </div>
                : <div className="offset-lg-1" style = {window.innerWidth < 576 ? {display:'flex', justifyContent:'center'}:{}}><button type="button" onClick={sendData} style={(data && isRawImage && isName && isActiveCreateButton && validRoyalty) ? primaryBtnStyle : disableBtnStyle} disabled={(data && isRawImage && isName && isActiveCreateButton && validRoyalty) ? false : true}>Create</button></div>
            }
        </section>

        <div className="modal fade" id="properties" tabIndex="-1" aria-labelledby="propertiesLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={modalHeaderInline} className="modal-title mt-3 mb-3" id="propertiesLabel">Add Properties</h3>
                <input type="button" className={colormodesettle.colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body m-3">
                <h5>Add the properties of your NFT that will show up as rectangles on the item detail page.</h5>
                <div className="row align-items-center text-center mt-3">
                  <div className="col-6"><h4>Type</h4></div>
                  <div className="col-6"><h4>Name</h4></div>
                </div>
                {
                  isPropertyInputData.map((property , idx) => (
                    <div className="input-group align-items-center mt-3 mb-3" key={idx}>
                      <span className={colormodesettle.colormodesettle.ColorMode?"input-group-text btn-close" : "input-group-text btn-close btn-close-white"} style={removeLabelStyle} onClick={() => removeEvent(property.id)}></span>
                      <input type="text" name="type" onChange={(e) => propertyInputEvent(e, idx)} value={property.type} aria-label="type" placeholder="Character" className="form-control m-0 p-3" />
                      <input type="text" name="name" onChange={(e) => propertyInputEvent(e, idx)} value={property.name} aria-label="name" placeholder="Male" className="form-control m-0 p-3" />
                    </div>
                  ))
                }
                {
                  isPropertyCount < 50 && 
                  <input type="button" className="" value="Add more" style={btnStyle} onClick={addRowEvent} />
                }
                
              </div>
              <div className="modal-footer">
                <button type="button" data-bs-dismiss="modal" style={primaryBtnStyle}>Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="levels" tabIndex="-1" aria-labelledby="levelsLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={modalHeaderInline} className="modal-title mt-3 mb-3" id="levelsLabel">Add Levels</h3>
                <input type="button" className={colormodesettle.colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body m-3" style ={{overflowY:'auto'}}>
                <h5>Display which level your NFT is by adding numerical traits that are shown as a progress bar on the item detail page.</h5>
                <div className="row align-items-center text-center mt-3" style ={{minWidth:'500px'}}>
                  <div className="col-6"><h4>Name</h4></div>
                  <div className="col-6"><h4>Value</h4></div>
                </div>
                {
                  isLevelInputData.map((level,inx) => (
                    <div className="input-group align-items-center mt-3 mb-3" key={inx} style ={{minWidth:'500px'}}>
                      <span className={colormodesettle.colormodesettle.ColorMode?"input-group-text btn-close" : "input-group-text btn-close btn-close-white"} style={removeLabelStyle} onClick={() => removeLevelRowEvent(level.id)} />
                      <input type="text" name="name" onChange={(e) => levelInputEvent(e, inx)} value={level.name} aria-label="name" placeholder="Speed" className="form-control m-0 p-3" />
                      <input type="number" name="f_num" onChange={(e) => levelInputEvent(e, inx)} value={level.f_num} aria-label="f_num" className="form-control m-0 p-3" />
                      <label className="p-3 ofBgc" style={inputLabelStyle}>Of</label>
                      <input type="number" name="s_num" onChange={(e) => levelInputEvent(e, inx)} value={level.s_num} aria-label="s_num" className="form-control m-0 p-3" />
                    </div>
                  ))
                }
                {
                  isLevelCount < 50 &&
                  <input type="button" className="" value="Add more" style={btnStyle} onClick={addLevelRowEvent} />
                }
                
              </div>
              <div className="modal-footer">
                <button type="button" data-bs-dismiss="modal"  style={primaryBtnStyle}>Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="stats" tabIndex="-1" aria-labelledby="statsLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={modalHeaderInline} className="modal-title mt-3 mb-3" id="statsLabel">Add Stats</h3>
                <input type="button" className={colormodesettle.colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body m-3" style = {{overflowY:'auto'}}>
                <h5>Add statistics to your NFT that display as numerical traits on the item detail page.</h5>
                <div className="row align-items-center text-center mt-3" style = {{minWidth:'500px'}}>
                  <div className="col-6"><h4>Name</h4></div>
                  <div className="col-6"><h4>Value</h4></div>
                </div>
                {
                  isStatInputData.map((stat,idx) => (
                    <div className="input-group align-items-center mt-3 mb-3" key={idx} style = {{minWidth:'500px'}}>
                      <span className={colormodesettle.colormodesettle.ColorMode?"input-group-text btn-close" : "input-group-text btn-close btn-close-white"} style={removeLabelStyle} onClick={() => removeStatRowEvent(stat.id)}/>
                      <input type="text" name="name" onChange={(e) => statInputEvent(e, idx)} value={stat.name} aria-label="name" placeholder="Speed" className="form-control m-0 p-3" />
                      <input type="number" name="stat_f_num" onChange={(e) => statInputEvent(e, idx)} value={stat.stat_f_num} aria-label="stat_f_num" className="form-control m-0 p-3" />
                      <label className="p-3 ofBgc" style={inputLabelStyle}>Of</label>
                      <input type="number" name="stat_s_num" onChange={(e) => statInputEvent(e, idx)} value={stat.stat_s_num} aria-label="stat_s_num" className="form-control m-0 p-3" />
                    </div>
                  ))
                }
                {
                  isStatCount < 50 &&
                  <input type="button" className="" value="Add more" style={btnStyle} onClick={addStatRowEvent} />
                }
                
              </div>
              <div className="modal-footer">
                <button type="button"  data-bs-dismiss="modal" style={primaryBtnStyle}>Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="supply" tabIndex="-1" aria-labelledby="supplyLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h3 style={modalHeaderInline} className="modal-title mt-3 mb-3" id="supplyLabel">How does token supply work?</h3>
                <input type="button" className={colormodesettle.colormodesettle.ColorMode?"btn-close":"btn-close btn-close-white"} data-bs-dismiss="modal" aria-label="Close" style={{ marginRight: 20 }} />
              </div>
              <div className="modal-body m-3">
                <div  style={collapseContent} onClick={() => setMintCollapse(!isMintCollapse)}>
                  <div>
                    <i className="fa fa-chain-broken" style={collapseIcon}></i>
                    <span style={collapseTitle}>What is minting?</span>
                  </div>
                  <span><i className={isMintCollapse ? "fa fa-arrow-up" : "fa fa-arrow-down"}></i></span>
                </div>
                {
                  isMintCollapse ?
                    <div
                      className="helpermodel"
                      style={collapseView}
                    >
                      <p>Minting is an action that brings an item into existence on the blockchain, and costs gas to do so. Minting using <b>SuperKluster</b>’s tools is <em>lazy</em>, meaning it only occurs when necessary:<ol><li>When you transfer an item to another account</li><li>When someone buys an item from you</li></ol></p>
                      <p>This means that you can create as much as you want here <em>for free</em>.</p>
                    </div>
                    : null
                }
                <div  style={{ ...collapseContent, marginTop: 20 }} onClick={() => setLimitCollapse(!isLimitCollapse)}>
                  <div>
                    <i className="fa fa-lock" style={collapseIcon}></i>
                    <span style={collapseTitle}>How are limits enforced?</span>
                  </div>
                  <span><i className={isLimitCollapse ? "fa fa-arrow-up" : "fa fa-arrow-down"}></i></span>
                </div>
                {
                  isLimitCollapse ?
                    <div
                    className="helpermodel" 
                    style={collapseView}
                    >
                      <p>The maximum supply ("hard cap") of your NFT will be encoded in its ID. This allows the smart contract to check whether any more are allowed to be minted.
                        <a className="styles__StyledLink-sc-l6elh8-0 ekTmzq" href="/faq#max-supply" rel="nofollow noopener" target="_blank">Learn more here</a>.
                      </p>
                    </div>
                    : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CreatePage;