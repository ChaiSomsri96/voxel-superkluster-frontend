import React, { useState, useEffect } from "react";
import * as Yup from 'yup';
import { useNavigate, useLocation } from "@reach/router";
import Switch from "react-switch";
import { useFormik, Form, FormikProvider, Field } from 'formik';
import MoonLoader from "react-spinners/MoonLoader";
import ProgressBar from 'react-bootstrap/ProgressBar';
import ImageUpload from 'image-upload-react';
import imageCompression from 'browser-image-compression';
import { useDispatch, useSelector } from "react-redux";
import { create } from 'ipfs-http-client';
import { Select, Upload, Button, Tooltip, Alert, Spin } from 'antd';
import { LoadingOutlined ,UploadOutlined ,InboxOutlined } from '@ant-design/icons';
import { FiInfo } from 'react-icons/fi';
import { ethers } from 'ethers';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import RLDD from 'react-list-drag-and-drop/lib/RLDD';
import * as selectors from '../../store/selectors';
import { Container, FormSection, Caption, SubCaption, Text, AddTraitBtn, TraitType, TraitDesc, TraitSection, Span, iconBtnStyle, imageUploaderStyleLight, imageUploaderStyleDark,
  ItemRenderer, ItemRendererLevel, ItemRendererStat } from "./styled-components";
import { INFURA_PROJECT_ID, INFURA_API_KEY } from "../../core/api";
import { limitSize, nftCompressOptions, ThreeDFileOpts } from "../../components/constants/index";
import { Axios } from "../../core/axios";
import { blockchainData, traitCharLimit } from "./../../components/constants/index";
import "./../../assets/stylesheets/Create/index.scss";
import { createNftMinting } from "./../../store/actions/thunks";
import { checkType } from "./../../utils";
import NFTCard from "./../../components/home/NFTCard";
import SkCheckbox from "./../../components/SkCheckbox";
import LocalButton from "./../../components/common/Button";
import defaultNFT from "./../../assets/image/default_nft.jpg";

const CreatePage = (colormodesettle) => {
  useEffect(()=>{
    localStorage.setItem('searchValue','') ;
  },[]);

  let location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { prop } = location.state;
  const { propForAdd } = location.state;
  const { data } = useSelector(selectors.accessToken);
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

  const { Option } = Select;

  const [loading, setLoading] = useState(false);
  const [isType, setType] = useState('create');
  const [loadingSpin, setLoadingSpin] = useState(false);
  const [isActiveCreateButton, setActiveCreateButton] = useState(true);
  const [isRawImage, setRawImage] = useState(prop && prop.raw_image ? prop.raw_image : '');
  const [isRawAnimation, setRawAnimation] = useState(prop && prop.raw_animation ? prop.raw_animation : '');
  const [isRawAnimationMTL, setRawAnimationMTL] = useState('') ;
  const [isRawAnimationTexture, setRawAnimationTexture] = useState([]) ;
  const [isTextureForm, setTextureForm] = useState([]) ;
  const [isTextureFormAddingURL, setTextureFormAddingURL] = useState([]) ;
  const [isMTLForm, setMTLForm] = useState(null);
  const [imageSrc, setImageSrc] = useState(prop && prop.image ? prop.image : '');
  const [isFormPreview , setForm_preview] = useState(null) ;
  const [isForm, setForm] = useState(null);
  const [isPreImgForm, setPreImgForm] = useState({});
  const [isOtherTypeSrc, setOtherTypeSrc] = useState('');
  const [isNftType, setNftType] = useState('image/jpeg');
  const [isName, setName] = useState(prop && prop.name ? prop.name : '');
  const [isItemDescription, setItemDescription] = useState(prop && prop.description ? prop.description : '') ;
  const [isSelectCollection, selectCollection] = useState([]);
  const [isSelectCollectionId, selectCollectionId] = useState(propForAdd ? propForAdd : '');
  const [isUnlockableContent, setUnlockableContent] = useState('');
  const [isSupplyItemNums, setSupplyItemNums] = useState(prop ? prop.supply_number : 1);
  const [isRoyalty, setRoyaltyChecked] = useState(prop && prop.royalty_address ? true : false);
  const [royaltyFee, setRoyaltyFee] = useState(prop && prop.royalty_address ? prop.royalty_fee : 10);
  const [royaltyAddress, setRoyaltyAddress] = useState(prop && prop.royalty_address ? prop.royalty_address : '');
  const [validRoyalty, setValidRoyalty] = useState(true);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [isThreeDOpt , setThreeTypeOpt] = useState('obj');

  const [isthreedfile, setThreefile] = useState(false);
  const [isTextureOption ,setTextureOption] = useState(false);
  const [isMtlOption ,setMtlOption] = useState(false);
  const [imageSrc_preview, setImageSrc_preview] = useState(prop && prop.image ? prop.image : '');
  const [isLimitCollapse, setLimitCollapse] = useState(false);

  const [blockchain, setBlockchain] = useState(prop && prop.collection? prop.collection.chain_id : 1);
  const [collectionChain, setCollectionChain] = useState(prop && prop.collection? prop.collection.chain_id : 0);
  const [selectedCollection, setSelectedCollection] = useState(prop && prop.collection ? prop.collection : null);
  const [esChecked, setESChecked] = useState(prop? prop.is_sensitive : false);
  const [unlockChecked, setUnlockChecked] = useState(false);
  const [isNetworkOpt, setNetworkOpt] = useState(prop? prop.collection.chain_id : 'Select...');
  const [isDirectoryFlg , setDirectoryFlg] = useState(false) ;
  const [fileListMain, setFileListMain] = useState([]) ;
  const [isMTLAsolutePath ,setMTLAsolutePath] = useState('') ;
  const [fileListMTL, setFileListMTL] = useState([]) ;
  const [fileListTexture, setFileListTexture] = useState([]) ;
  const [beforeUploadingMsg , setBeforeUploadingMsg] = useState('') ;
  const [isPropertyCount, setPropertyCount] = useState(1);
  const [isLevelCount, setLevelCount] = useState(1);
  const [isStatCount, setStatCount] = useState(1);
  const [isMintCollapse, setMintCollapse] = useState(false);

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
    } else {
      return [{id: 0, type: '', name: ''}];
    }
  });

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

  const { errors, handleSubmit } = formik;

  const startProgressBar = () => {
    setUploadPercent(0);
    increasePercent(0);
  }

  const increasePercent = (percent) => {
    if (percent < 50) {
      setUploadPercent(percent);
      setTimeout(() => {
        increasePercent(percent + 1)
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

  const inputNumValidation = (e, param) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === 0 || e.target.value === '' || re.test(e.target.value)) {
      if(param == "item_supply") {
        if(parseInt(e.target.value) > 100000) return;
        setSupplyItemNums(e.target.value)
      }
    }
  }
  
  const mainwarning = <div><span>Begin by uploading a preview image for your NFT. Please wait until all files are uploaded, before pressing the 'create' button. <br/><br/>please make sure all files have been downloaded<br/>Before minting your 3D model, please ensure you verify and check your 3D model is displaying accurately at <a style={{color:'#f70dff'}} href="http://3dviewer.net/" target="_blank">http:/3dviewer.net</a> or <a style={{color:'#f70dff'}} href="https://threejs.org/editor/" target="_blank">https:/threejs.org/editor</a> </span></div> ;
  const contentMTL = <div>Select the texture for your NFT. <br/>Make sure the texture file isn't defined in a subfolder, otherwise it won't load accurately.</div>
  
  useEffect(()=>{
    setBeforeUploadingMsg(mainwarning);
  },[isThreeDOpt]) ;

  useEffect(()=>{
  },[imageSrc_preview]);

  const setValidateRoyaltyFee = (e) => {
    const MAX_VALUE = 25;
    const MIN_VALUE = 0;
    const fee = Math.max(MIN_VALUE, Math.min(MAX_VALUE, Number(e.target.value.replaceAll(/[^\d.-]/g, ''))));
    setRoyaltyFee(fee);
  }
  
  const validationNftSupplyItem = (supply_num) => {
    if (supply_num === '') {
      return false;
    }
    return true;
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
      
        if(checkType(file.name).toLowerCase() == 'obj' || checkType(file.name).toLowerCase() == 'fbx' || checkType(file.name).toLowerCase() == 'glb' || checkType(file.name).toLowerCase() == 'gltf'){
          setFileListMain([fileListMain, file]) ;
          setForm(file) ;
          add_ipfs_main_raw_animation(file) ;
          if(checkType(file.name).toLowerCase() != isThreeDOpt){
            Swal.fire({
              title: 'Warning!',
              text: `please check uploading file type should be ${checkType(file.name).toLowerCase()} file.`,
              icon: 'error',
              confirmButtonText: 'Close',
              timer: 5000,
customClass: 'swal-height'
            })
          }
        }else if(checkType(file.name).toLowerCase() == 'mtl' || checkType(file.name).toLowerCase() == 'bin') {
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
      const isAccept = checkType(file.name).toLowerCase() == isThreeDOpt ;
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
        if(checkType(file.name).toLowerCase() == isThreeDOpt ) ;
        if(checkType(file.name).toLowerCase() != 'fbx') {
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

  const props2 = {
    
    onRemove: file => {
      const index = fileListMTL.indexOf(file);
      const newFileList = fileListMTL.slice();
      newFileList.splice(index, 1);
      setFileListMTL(newFileList);
    },
    beforeUpload: file => {
      const isAccept = (checkType(file.name).toLowerCase() == 'mtl' || checkType(file.name).toLowerCase() == 'bin') ;
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
    const compressedFile = await imageCompression(file, nftCompressOptions);
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

    setImageSrc_preview(URL.createObjectURL(file));
    setLoading(true);
    startProgressBar();
    setActiveCreateButton(true);

    if(file.size >= limitSize) {
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

    if(file.type == "") {
        setLoading(false);
        Swal.fire({
            title: 'Warning!',
            text: "3D file upload failed.  please click 3D toggle to upload 3D file.",
            icon: 'error',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
        });

        return;
    }

    if (isNftType === 'video/mp4' || isNftType === 'audio/mpeg') {
        setOtherTypeSrc(URL.createObjectURL(file)) ;
        setPreImgForm(file);
        const compressedFile = await imageCompression(file, nftCompressOptions);
        setForm_preview(compressedFile);
    } else {
        if(isNftType == "" ) {
            setOtherTypeSrc(URL.createObjectURL(file)) ;
            setPreImgForm(file);
            const compressedFile = await imageCompression(file, nftCompressOptions);
            setForm_preview(compressedFile) ;
        }
        else {
            setNftType(file.type) ;
            setImageSrc(URL.createObjectURL(file)) ;
            setForm(file);

            if(file.type !='video/mp4' && file.type != 'audio/mpeg') {
                const compressedFile = await imageCompression(file, nftCompressOptions);
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
        const added = await ipfs.add(file);
        const cid = added.path;
        const data = `https://ipfs.io/ipfs/${cid}`;
        if (file.type === 'video/mp4' || file.type === 'audio/mpeg' || !file.type) {
            setRawAnimation(data);
        } else {
            setRawImage(data);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoadingSpin(false);
    }
  }

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
      }]);
      setStatInputData([{
        id: 0, name: '', stat_f_num: 3, stat_s_num: 5
      }]);
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

  const handleChangeOtherType = () => { 
    setNftType('image/jpeg');
    setImageSrc('');
    setOtherTypeSrc('');
    setRawImage('');
    setPreImgForm({})
  }

  const handleChange = (value) => {
    selectCollectionId(value);
    for(let i = 0; i < isSelectCollection.length; i ++) {
      if(isSelectCollection[i].id == value) {
        setBlockchain(isSelectCollection[i].chain_id);
        setCollectionChain(isSelectCollection[i].chain_id);
        setSelectedCollection(isSelectCollection[i]);

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
      setPropertyInputData(isPropertyInputData.filter((row) => row.id !== rowId));
      setPropertyCount(isPropertyCount - 1);
    } else {
      setPropertyInputData([{ id: 0, type: '', name: '' }]);
      setPropertyCount(1);
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

  const handleRLDDChange =(reorderedItems)=>{
    setPropertyInputData(reorderedItems)
  }

  const handleRLDDChange_level =(reorderedItems)=>{
    setLevelInputData(reorderedItems)
  }

  const handleRLDDChange_stat =(reorderedItems)=>{
    setStatInputData(reorderedItems)
  }

  const handleRoyalty = () => {
    if(isRoyalty == true) {
      setRoyaltyFee(10);
      setRoyaltyAddress(acc);
    }
    setRoyaltyChecked(!isRoyalty);
  }

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
  }, [isRoyalty, royaltyFee, royaltyAddress]);

  useEffect(() => {
    getCollections();
  }, []);
  // api endpoint interaction
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
          setSelectedCollection(collections[i]);
        }
        selectCollection(val => [...val, { 
          id: collections[i].id, 
          name: collections[i].name, 
          chain_id: collections[i].chain_id, 
          royalty_address: collections[i].royalty_address, 
          royalty_fee: collections[i].royalty_fee,
          verified: collections[i].is_verified,
          link: collections[i].link}])
      } 
    }
  }

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin/>
  
  return (
    <>
      <Container>
        <FormSection>

          {
            loadingSpin &&
              <div style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(255,255,255,0.5)', zIndex: '100'}}>
                <MoonLoader cssOverride={{position: 'absolute', top: 'calc(50% - 50px)', left: 'calc(50% - 50px)', borderColor: 'rgb(220, 219, 219)'}} loading={loadingSpin} size={100} />  
              </div>
          }
          <Caption>Create New NFT</Caption>
          <div className="create-new-nft"> 
            <FormikProvider value={formik}>
              <Form id="form-create-item" autoComplete="off" noValidate onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-7 col-md-12">

                    <div>
                      <SubCaption>Upload your file</SubCaption>
                      <Text>Supported File Types: PNG, JPG, GIF, WEBP, MP4, FBX, GLB, OBJ, GLTF. Max size: 100 MB.</Text>

                      <div className="align-items-center" style={{ display: 'flex', marginBottom: '30px' }}>
                        <Text style={{marginBottom: '0px', marginRight: '34px'}}>Click here to upload 3D file.</Text>
                        <Switch 
                                  onChange={handleThreeDfileChange}
                                  checked={isthreedfile}  
                                  uncheckedIcon={false}
                                  checkedIcon={false}
                                  handleDiameter={26}
                                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                  height={26}
                                  width={50}
                                  onColor="#f70dff"
                                  offColor={colormodesettle.colormodesettle.ColorMode ? "#ECEBEB" : "#4B4C4D"} />
                      </div>

                      {
                          isthreedfile ? 
                          <div>
                            <SubCaption>Preview Image</SubCaption>
                            <ImageUpload
                                    handleImageSelect={handleImageSelect_threeD}
                                    imageSrc={isOtherTypeSrc}
                                    setImageSrc={setOtherTypeSrc}
                                    defaultDeleteIconSize={20}
                                    className="imageUploader"
                                    defaultDeleteIconColor="grey"
                                    style={{
                                      width: 350,
                                      height: 250,
                                      ...(colormodesettle.colormodesettle.ColorMode ? imageUploaderStyleLight : imageUploaderStyleDark)
                                    }}
                            />
                            <div className="paragraph"></div>

                            <SkCheckbox
                               checked={isDirectoryFlg}
                               onChange={onDirectoryClick}
                               className={colormodesettle.colormodesettle.ColorMode ? "sk-checkbox-light" : "sk-checkbox-dark"}
                            >
                                <Span style={{marginLeft: '16px'}}>Upload Directory</Span>
                            </SkCheckbox>                             
                            
                            <div className="paragraph"></div>
                            <div className='dropdownSelect one'>
                              <Select style={{ width: "50%" }} onChange={(e) => initFile(e)} options={ThreeDFileOpts} defaultValue="OBJ file" placeholder="Select your 3D file type"></Select>
                            </div>

                            {
                              isDirectoryFlg ?
                              <>
                                <div className="paragraph"></div>
                                <div style={{display:'flex'}}>
                                  <Upload  className="uploadingFile" {...props}  accept='obj' directory >
                                      <Button style={{borderRadius:'6px'}} className="nft_attr" icon={<UploadOutlined />}>
                                        Select directory
                                      </Button>
                                  </Upload>
                                  <div  style={{marginLeft:'10px',width:'300px'}}>
                                    <Tooltip placement="top" title="You are about to upload a .zip file. Please make sure that it contains only one 3D file, and one one MTL or Bin file or the render will fail. We recommend a manual upload to prevent possible mistakes.">
                                        <FiInfo style={iconBtnStyle} />
                                    </Tooltip> 
                                  </div>
                                </div>
                              </>
                              :
                              <>
                              <div className="paragraph"></div>
                              <div style={{display:'flex'}}>
                                <Upload  className="uploadingFile" {...props1}  accept='obj' maxCount={1}>
                                      <Button style={{borderRadius:'6px'}} className="nft_attr" icon={<InboxOutlined />}>
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
                                </Upload>
                          {
                                  isThreeDOpt=='obj'
                                  ?
                                    <div  style={{marginLeft:'10px',width:'300px'}}>
                                      <Tooltip placement="top" title="upload OBJ file (will be black and white)">
                                          <FiInfo style={iconBtnStyle} />
                                      </Tooltip> 
                                    </div>
                                  : 
                                  (
                                    isThreeDOpt =='fbx' 
                                      ?
                                    <div  style={{marginLeft:'10px',width:'300px'}}>
                                      <Tooltip placement="top" title="upload FBX file">
                                        <FiInfo style={iconBtnStyle} />
                                      </Tooltip>                                       
                                    </div>
                                      :
                                        (
                                          isThreeDOpt =='glb'  
                                          ?
                                    <div  style={{marginLeft:'10px',width:'300px'}}>
                                      <Tooltip placement="top" title="upload GLB file">
                                        <FiInfo style={iconBtnStyle} />
                                      </Tooltip> 
                                    </div>
                                          :
                                    <div  style={{marginLeft:'10px',width:'300px'}}>
                                      <Tooltip placement="top" title="upload GLTF file">
                                        <FiInfo style={iconBtnStyle} />
                                      </Tooltip> 
                                    </div>  
                                        )
                                    
                                  )
                          }
                          
                          {isMtlOption && (
                            <Upload className="uploadingFile" {...props2} maxCount={1}>
                              <Button style={{ borderRadius: '6px' }} className="nft_attr" icon={<InboxOutlined />}>
                                Add MTL/BIN file (optional)
                              </Button>
                            </Upload>
                          )}

                          {isMtlOption && isThreeDOpt === 'obj' && (
                              <div style={{ marginLeft: '10px', width: '300px' }}>
                                <Tooltip placement="top" title={contentMTL}>
                                  <FiInfo style={iconBtnStyle} />
                                </Tooltip>
                              </div>
                          )}

                          {isMtlOption && isThreeDOpt === 'fbx' && (
                              <div style={{ marginLeft: '10px', width: '300px' }}>
                                <Tooltip placement="top" title="this opens up only when FBX file is added first">
                                  <FiInfo style={iconBtnStyle} />
                                </Tooltip>
                              </div>
                          )}

                          {isMtlOption && isThreeDOpt === 'glb' && (
                              <div style={{ marginLeft: '10px', width: '300px' }}>
                                <Tooltip placement="top" title="this opens up only when GLB file is added first">
                                  <FiInfo style={iconBtnStyle} />
                                </Tooltip>
                              </div>
                          )}

                          {isMtlOption && isThreeDOpt === 'gltf' && (
                              <div style={{ marginLeft: '10px', width: '300px' }}>
                                <Tooltip placement="top" title="this opens up only when GLTF file is added first">
                                  <FiInfo style={iconBtnStyle} />
                                </Tooltip>
                              </div>
                          )}

                          {isTextureOption ?
                          <>
                              <Upload  className="uploadingFile" {...props3}  >
                                    <Button style={{borderRadius:'6px'}} className="nft_attr" icon={<InboxOutlined />}>
                                      Add Texture file (optional)
                                    </Button> 
                              </Upload> 
                              <div  style={{marginLeft:'10px',width:'300px'}}>
                                <Tooltip placement="top" title="this opens up only when MTL/BIN file  is added second">
                                  <FiInfo style={iconBtnStyle} />
                                </Tooltip> 
                              </div>
                          </>
                            :
                              null
                              
                          }
                        </div>
                        </>
                        }

                              <div className="warning_div">
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
                              <div className="paragraph"></div>
                              <div>
                                  <LocalButton onClick={handleChangeOtherType}>Change</LocalButton>
                              </div>
                              <div className="paragraph"></div>
                              <SubCaption>Preview Image</SubCaption>
                              <div>
                                  <ImageUpload
                                    handleImageSelect={handleImageSelect}
                                    imageSrc={isOtherTypeSrc}
                                    setImageSrc={setOtherTypeSrc}
                                    className="imageUploader"
                                    defaultDeleteIconSize={20}
                                    defaultDeleteIconColor="grey"
                                    style={{
                                      width: 350,
                                      height: 250,
                                      ...(colormodesettle.colormodesettle.ColorMode ? imageUploaderStyleLight : imageUploaderStyleDark)
                                    }}
                                  />
                              </div>
                            </>
                            :
                            <div>
                                <Spin indicator={antIcon} />
                                <h4>Please Wait ...</h4>
                            </div>
                          }
                          
                          </> 
                          :
                          <div>

                            {
                              !loading ?
                              <ImageUpload
                                    handleImageSelect={handleImageSelect}
                                    imageSrc={imageSrc}
                                    setImageSrc={setImageSrc}
                                    defaultDeleteIconSize={20}
                                    className="imageUploader"
                                    defaultDeleteIconColor="grey"
                                    style={{
                                      width: 350,
                                      height: 250,
                                      ...(colormodesettle.colormodesettle.ColorMode ? imageUploaderStyleLight : imageUploaderStyleDark)
                                    }}
                              />
                              :
                              <div style={{width: 250, paddingLeft: 20}}>
                                  <ProgressBar style={{padding: 0}} animated now={uploadPercent} label={`${uploadPercent}%`}/>
                              </div>    
                            }

                          </div>
                      }
                    
                    </div>


                    <div className="create-form-item">
                        <SubCaption>Name your NFT{" "}*</SubCaption>
                        <Field
                          type="text"
                          name="name"
                          id="item_title"
                          className="form-control"
                          placeholder="Item Name"
                          onChange={(e) => {if(e.target.value.length <=50) setName(e.target.value)}}
                          value={isName ?? ""}
                        />
                        {!isName && errors.name && <div style={{ color: 'red' }} className="require-error">{errors.name}</div>}
                    </div>

                    <div className="create-form-item">
                        <SubCaption>Description</SubCaption>
                        <Text>Give SuperKluster users an accurate description of your NFT.</Text>
                        <textarea 
                            data-autoresize name="item_desc" 
                            onChange={e => setItemDescription(e.target.value)} 
                            value={isItemDescription ?? ""} 
                            id="item_desc" 
                            className="form-control" 
                            placeholder="Provide a detailed description of your item" 
                            style={{ height: 150}}></textarea>
                    </div>

                    <div className="create-form-item">
                        <SubCaption>NFT Collection</SubCaption>
                        <Text>Select the collection where you NFT will appear.</Text>
                        <div className='dropdownSelect one'>
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
                    </div>  

                    <TraitSection className="trait-section">
                      <div className="trait-row">
                        <div className="col-lg-8">
                          <div className="flex-center-box">
                            <div className="space-section">
                              <i className="fa fa-barcode"></i>
                            </div>
                            <TraitType>NFT Properties</TraitType>  
                          </div>
                          
                          <div className="flex-center-box" style={{marginTop: '10px'}}>
                            <div className="space-section">
                            </div>
                            <TraitDesc>Set the traits of your NFT. These will show up as rectangles on the item detail page.</TraitDesc>
                          </div>
                        </div>
                        <div className="col-lg-4" style={{textAlign: 'right'}}>
                          <AddTraitBtn type="button" data-bs-toggle="modal" data-bs-target="#properties">+</AddTraitBtn>
                        </div>
                      </div>

                      <div style={window.innerWidth > 1024 ? {display:'flex', flexWrap:'wrap'} :{display:'flex', overflowX:'auto'}}>
                          <RLDD
                            cssClasses="example"
                            items={isPropertyInputData}
                            itemRenderer={ItemRenderer}
                            onChange={handleRLDDChange}
                          />
                      </div>
                    </TraitSection>

                    <TraitSection className="trait-section">
                      <div className="trait-row">
                        <div className="col-lg-8">
                          <div className="flex-center-box">
                            <div className="space-section">
                              <i className="fa fa-level-up"></i>
                            </div>
                            <TraitType>NFT Levels</TraitType>  
                          </div>
                          
                          <div className="flex-center-box" style={{marginTop: '10px'}}>
                            <div className="space-section">
                            </div>
                            <TraitDesc>Display which level your NFT is by adding numerical traits that are shown a  progress bar on the item detail page.</TraitDesc>
                          </div>
                        </div>
                        <div className="col-lg-4" style={{textAlign: 'right'}}>
                          <AddTraitBtn type="button" data-bs-toggle="modal" data-bs-target="#levels">+</AddTraitBtn>
                        </div>
                      </div>

                      <div>
                        <RLDD
                            items={isLevelInputData}
                            itemRenderer={ItemRendererLevel}
                            onChange={handleRLDDChange_level}
                          />
                      </div>
                    </TraitSection>

                    <TraitSection className="trait-section">
                      <div className="trait-row">
                        <div className="col-lg-8">
                          <div className="flex-center-box">
                            <div className="space-section">
                              <i className="fa fa-bar-chart"></i>
                            </div>
                            <TraitType>NFT Statistics</TraitType>  
                          </div>
                          
                          <div className="flex-center-box" style={{marginTop: '10px'}}>
                            <div className="space-section">
                            </div>
                            <TraitDesc>Add statistics to your NFT that display as numerical traits on the item detail page.</TraitDesc>
                          </div>
                        </div>
                        <div className="col-lg-4" style={{textAlign: 'right'}}>
                          <AddTraitBtn type="button" data-bs-toggle="modal" data-bs-target="#stats">+</AddTraitBtn>
                        </div>
                      </div>

                      <div>
                        <RLDD
                            items={isStatInputData}
                            itemRenderer={ItemRendererStat}
                            onChange={handleRLDDChange_stat}
                        />
                      </div>
                    </TraitSection>


                    <TraitSection className="trait-section">
                      <div className="trait-row">
                        <div className="col-lg-8">
                          <div className="flex-center-box">
                            <div className="space-section">
                              <i className="fa fa-unlock"></i>
                            </div>
                            <TraitType>Unlockable Content</TraitType>  
                          </div>
                          
                          <div className="flex-center-box" style={{marginTop: '10px'}}>
                            <div className="space-section">
                            </div>
                            <TraitDesc>Include unlockable content that is only accessible to the owner of the NFT item.</TraitDesc>
                          </div>
                        </div>
                        <div className="col-lg-4" style={{textAlign: 'right'}}>
                            <Switch 
                                          onChange={handleUnlockChange} 
                                          checked={unlockChecked}
                                          uncheckedIcon={false}
                                          checkedIcon={false} 
                                          handleDiameter={26}
                                          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                          height={26}
                                          width={50}
                                          onColor="#f70dff"
                                          offColor={colormodesettle.colormodesettle.ColorMode ? "#ECEBEB" : "#4B4C4D"}
                            />
                        </div>
                      </div>
                      
                      {
                        unlockChecked ?
                        <>
                          <div className="paragraph"></div>
                          <div>
                            <Field
                              name="unlockContent"
                              id="unlockContent"
                              as="textarea"
                              style={{minHeight:'100px'}}
                              className="form-control"
                              value={isUnlockableContent ?? ""}
                              onChange={e => setUnlockableContent(e.target.value)}
                              placeholder="Provide content such as, but not limited to, certificates/proofs, physical collectibles, higher resolution media, exclusive content, discount codes, access to private communities etc"
                            />

                            {!isUnlockableContent && errors.unlockContent && <div style={{ color: 'red' }} className="require-error">{errors.unlockContent}</div>}                         
                              <div>
                              </div>
                          </div>
                        </>
                        :
                        null
                      }
                    </TraitSection>

                    <TraitSection className="trait-section">
                      <div className="trait-row">
                        <div className="col-lg-8">
                          <div className="flex-center-box">
                            <div className="space-section">
                              <i className="fa fa-unlock"></i>
                            </div>
                            <TraitType>Set this item to Explicit & Sensitive Content</TraitType>  
                          </div>
                        </div>
                        <div className="col-lg-4" style={{textAlign: 'right'}}>
                            <Switch 
                                          onChange={handleESChange} 
                                          checked={esChecked}
                                          uncheckedIcon={false}
                                          checkedIcon={false} 
                                          handleDiameter={26}
                                          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                          height={26}
                                          width={50}
                                          onColor="#f70dff"
                                          offColor={colormodesettle.colormodesettle.ColorMode ? "#ECEBEB" : "#4B4C4D"}
                            />
                        </div>
                      </div>
                    </TraitSection>

                    <div className="create-form-item">
                        <SubCaption>Supply</SubCaption>
                        <Text>The number of items that can be minted. No gas cost to you!</Text>
                        
                        <input type="number" name="item_supply" id="item_supply" min={1} onChange={(e) => inputNumValidation(e, "item_supply")} value={isSupplyItemNums ?? ""} className="form-control"/>
                    </div>

                    <div className="create-form-item">
                        <SubCaption>Blockchain</SubCaption>
                        <Text>Select the blockchain where you'd like new items from this collection to be added by default.</Text>
                        
                        <div className='dropdownSelect one'>
                          <Select 
                            style={{ width: "100%" }} 
                            disabled={collectionChain > 0 ? true : false} 
                            value = {blockchain} 
                            onChange={handleBlockchainChange}
                          >
                            {
                              blockchainData?.map((item) => (
                                  <Option key={item.chainId} value={item.chainId}>
                                      <img style={{ width: 32, height: 32, marginRight: 10 }} src={item.logo} alt={`blockchain_logo${item.chainId}`} />
                                      {item.name}
                                  </Option>
                              ))
                            }
                          </Select>
                        </div>
                    </div>

                    <div className="create-form-item flex-center-space-between">
                      <div className="royalty-packed">
                        <i className="fa fa-user-secret"></i>
                        <SubCaption style={{marginBottom: '0px'}}>Set royalty</SubCaption>
                      </div>

                      <Switch 
                                    onChange={handleRoyalty} 
                                    checked={isRoyalty}
                                    uncheckedIcon={false}
                                    checkedIcon={false} 
                                    handleDiameter={26}
                                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                    height={26}
                                    width={50}
                                    onColor="#f70dff"
                                    offColor={colormodesettle.colormodesettle.ColorMode ? "#ECEBEB" : "#4B4C4D"}
                      />
                    </div>

                    {
                      isRoyalty ?
                      <div className="create-form-item">
                        <SubCaption>Royalty Fee (%)</SubCaption>
                        <input
                                    type="number"
                                    min="0" 
                                    max="25"
                                    name="royalty_fee"
                                    id="royalty_fee"
                                    className="form-control"
                                    onChange={(e) => setValidateRoyaltyFee(e)}
                                    value={royaltyFee}
                                    placeholder="for example: 10"
                        />

                        <SubCaption style={{marginTop: '10px'}}>Royalty Address</SubCaption>
                        <input
                                    type="text" 
                                    name="item_supply" 
                                    id="item_supply"
                                    onChange={(e) => setRoyaltyAddress(e.target.value)}
                                    value={royaltyAddress}
                                    className="form-control"
                                    placeholder="0x.."
                                    defaultValue={acc}
                        />
                      </div>
                      :
                      null
                    }
                  </div>

                  <div className="col-lg-5 col-md-12">
                    <div className="preview-item">
                      <SubCaption>Preview item</SubCaption>
                      <NFTCard 
                        nft={{
                          collection: selectedCollection, 
                          name: isName,
                          image_preview: (
                            isNftType.includes("image") ?
                            (imageSrc_preview ? imageSrc_preview : defaultNFT)
                            :
                            (isOtherTypeSrc ? isOtherTypeSrc : defaultNFT)
                          )
                        }} 
                        margin={0}
                      />
                    </div>
                  </div>
                </div>
                <div style={{marginTop: '30px'}}>
                  {
                  prop ?
                  <button type="submit" onClick={sendData} className="createCollectionBtn create-btn-style">Update</button>
                  :
                  <button type="submit" onClick={sendData} className="createCollectionBtn create-btn-style"  disabled={(data && isRawImage && isName && isActiveCreateButton && validRoyalty) ? false : true}>Create</button>
                  }
                </div>
              </Form>
            </FormikProvider>
          </div>
        </FormSection>

        <div className="modal fade" id="properties" tabIndex="-1" aria-labelledby="propertiesLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title mt-3 mb-3 modal-header-inline" id="propertiesLabel">Add Properties</div>
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
                      <span className={colormodesettle.colormodesettle.ColorMode?"input-group-text btn-close remove-label-style" : "input-group-text btn-close btn-close-white remove-label-style"} onClick={() => removeEvent(property.id)}></span>
                      <input type="text" name="type" onChange={(e) => propertyInputEvent(e, idx)} value={property.type} aria-label="type" placeholder="Character" className="form-control m-0 p-3" />
                      <input type="text" name="name" onChange={(e) => propertyInputEvent(e, idx)} value={property.name} aria-label="name" placeholder="Male" className="form-control m-0 p-3" />
                    </div>
                  ))
                }
                {
                  isPropertyCount < 50 && 
                  <input type="button" className="btn-style" value="Add more" onClick={addRowEvent} />
                }
                
              </div>
              <div className="modal-footer">
                <button type="button" data-bs-dismiss="modal" className="primary-btn-style">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="levels" tabIndex="-1" aria-labelledby="levelsLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title mt-3 mb-3 modal-header-inline" id="levelsLabel">Add Levels</div>
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
                      <span className={colormodesettle.colormodesettle.ColorMode?"input-group-text btn-close remove-label-style" : "input-group-text btn-close btn-close-white remove-label-style"} onClick={() => removeLevelRowEvent(level.id)} />
                      <input type="text" name="name" onChange={(e) => levelInputEvent(e, inx)} value={level.name} aria-label="name" placeholder="Speed" className="form-control m-0 p-3" />
                      <input type="number" name="f_num" onChange={(e) => levelInputEvent(e, inx)} value={level.f_num} aria-label="f_num" className="form-control m-0 p-3" />
                      <label className="p-3 ofBgc input-label-style">Of</label>
                      <input type="number" name="s_num" onChange={(e) => levelInputEvent(e, inx)} value={level.s_num} aria-label="s_num" className="form-control m-0 p-3" />
                    </div>
                  ))
                }
                {
                  isLevelCount < 50 &&
                  <input type="button" className="btn-style" value="Add more" onClick={addLevelRowEvent} />
                }
                
              </div>
              <div className="modal-footer">
                <button type="button" data-bs-dismiss="modal"  className="primary-btn-style">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="stats" tabIndex="-1" aria-labelledby="statsLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-title mt-3 mb-3 modal-header-inline" id="statsLabel">Add Stats</div>
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
                      <span className={colormodesettle.colormodesettle.ColorMode?"input-group-text btn-close remove-label-style" : "input-group-text btn-close btn-close-white remove-label-style"} onClick={() => removeStatRowEvent(stat.id)}/>
                      <input type="text" name="name" onChange={(e) => statInputEvent(e, idx)} value={stat.name} aria-label="name" placeholder="Speed" className="form-control m-0 p-3" />
                      <input type="number" name="stat_f_num" onChange={(e) => statInputEvent(e, idx)} value={stat.stat_f_num} aria-label="stat_f_num" className="form-control m-0 p-3" />
                      <label className="p-3 ofBgc input-label-style">Of</label>
                      <input type="number" name="stat_s_num" onChange={(e) => statInputEvent(e, idx)} value={stat.stat_s_num} aria-label="stat_s_num" className="form-control m-0 p-3" />
                    </div>
                  ))
                }
                {
                  isStatCount < 50 &&
                  <input type="button" className="btn-style" value="Add more" onClick={addStatRowEvent} />
                }
                
              </div>
              <div className="modal-footer">
                <button type="button"  data-bs-dismiss="modal" className="primary-btn-style">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </Container>      
    </>
  );
}
export default CreatePage;