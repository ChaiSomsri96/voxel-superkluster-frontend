import React, { useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "@reach/router";
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, Field } from 'formik';
import styled, { createGlobalStyle } from 'styled-components';
import { Input, Select, Spin, Affix, notification } from 'antd';
import { FaPager, FaDiscord, FaInstagram, FaTelegramPlane, FaTwitter, FaCheck } from 'react-icons/fa';
import debounce from 'lodash.debounce';
import { Axios } from "../core/axios";

import * as actions from "../store/actions/thunks";
import * as selectors from '../store/selectors';

import ImageUpload from 'image-upload-react';
import { filterCollectionImageFile } from "../components/constants/filters";
import Switch from "react-switch";
import 'sweetalert2/src/sweetalert2.scss';
import { ethers } from 'ethers';

import goerliNetworkLogo from "./../assets/image/blockchain/goerli.png";
import ethNetworkLogo from "./../assets/image/blockchain/ethereum.png";

const GlobalStyles = createGlobalStyle`
`;

const FeaturedImgUploaderDiv = styled.div`
    width: 50%;

    @media (max-width: 992px) {
        width: 60%;
    }

    @media (max-width: 768px) {
        width: 100%;
    }

    @media (max-width: 480px) {
        width: 100%;
    }
`;

const iconStyle = {
    fontSize: 18,
    padding: '5px 10px 5px 0px'
  }

const CreateCollectionPage = ({colormodesettle}) => {
    
    const { Option } = Select;
    let location = useLocation();
    const { prop } = location.state;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken') ;
    const header = { 'Authorization': `Bearer ${accessToken}` } ;

    const { data } = useSelector(selectors.accessToken);
    const category = useSelector(selectors.categoryState).data;
    
    let itemId;
    const setItemId = (_id) => {
        itemId = _id;
    }

    const [loadState, setLoadState] = useState(false);
    const [isType, setType] = useState('create');
    const [isName, setName] = useState(prop && prop.name ? prop.name : '');
    const [isValidName, setIsValidName] = useState(false);
    const [isItemDescription, setItemDescription] = useState(prop && prop.description ? prop.description : '');
    const [isItemCategory, setItemCategory] = useState(1);
    const [isBlockchain, setBlockchain] = useState(prop && prop.chain_id? prop.chain_id:1);
    const [isWebsiteLink, setWebsiteLink] = useState(prop && prop.website ? prop.website : '');
    const [isDiscordLink, setDiscordLink] = useState(prop && prop.discord ? prop.discord : '');
    const [isInstagramLink, setInstagramLink] = useState(prop && prop.instagram ? prop.instagram : '');
    const [isTelegramLink, setTelegramLink] = useState(prop && prop.telegram ? prop.telegram : '');
    const [isTwitterLink, setTwitterLink] = useState(prop && prop.twitter ? prop.twitter : 'https://twitter.com/');

    const [isRoyalty, setIsRoyalty] = useState(prop && prop.royalty_address ? true: false);
    const [royaltyAddress, setRoyaltyAddress] = useState(prop && prop.royalty_address ? prop.royalty_address:'');
    const [validRoyalty, setValidRoyalty] = useState(true);
    const [royaltyFee, setRoyaltyFee] = useState(prop && prop.royalty_fee? prop.royalty_fee : 10);

    const [avatarSrc, setAvatarSrc] = useState(prop && prop ? prop.avatar : '') ;
    const [isAvatarForm, setAvatarForm] = useState() ;
    const [featuredSrc, setFeaturedSrc] = useState(prop && prop ? prop.featured : '') ;
    const [isFeaturedForm, setFeaturedForm] = useState() ;
    const [bannerSrc, setBannerSrc] = useState(prop && prop ? prop.banner : '') ;
    const [isBannerForm, setBannerForm] = useState() ;
    const [isCreateDisable , setCreateDisable] = useState(true) ;
    const [doubleName, setDoubleName] = useState(false);
    const [validUrl, setValidUrl] = useState(true);
    const [url, setUrl] = useState(prop && prop.link? prop.link: '');
    const [doubleUrl, setDoubleUrl] = useState(false);

    useEffect(() => {
        if(isName.length == 0) {
            setIsValidName(true);
            return;
        }
        for(let i = 0; i < isName.length; i ++) {
            if(isAlpha(isName[i]) || !isNaN(isName[i])) {
                setIsValidName(true);
                return;
            }
        }
        setIsValidName(false);
    }, [isName])

    const isAlpha = (ch) => {
        return /^[A-Z]$/i.test(ch) && ch == ch.toLowerCase();
    }
    const isLowerLetter = (ch) => {
        return /^[A-Z]$/i.test(ch) && ch == ch.toLowerCase();
    }
    useEffect(() => {
        if(url.length == 0) setValidUrl(true);
        else {
            for (let i = 0; i < url.length; i ++) {
                if(url[i] != '-' && isNaN(url[i]) && !isLowerLetter(url[i])) {
                    setValidUrl(false);
                    return;
                }
            }
            setValidUrl(true);
        }
    }, [url])
    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
    
      },[])
    useEffect(() => {
        if (prop) {
            setType("update")
        } else {
            setType("create")
        }
    }, [prop])
    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
    
      },[])
    const validateUrl = (url) => {
        if (url == "") {
            return true;
        }
        try {
            new URL(url);
          } catch (e) {
            console.error(e);
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
        },
    ];

    const sendData = () => {
        if (!(validateUrl(isWebsiteLink)&&validateUrl(isDiscordLink)&&validateUrl(isInstagramLink)&&validateUrl(isTelegramLink)&&validateUrl(isTwitterLink))) {
            return;
        }
        setLoadState(true);
        setCreateDisable(false) ;
        const formData = new FormData();
        formData.append('type', isType);
        formData.append('avatar', isAvatarForm);
        formData.append('featured', isFeaturedForm);
        formData.append('banner', isBannerForm);
        formData.append('name', isName);
        formData.append('description', isItemDescription);
        formData.append('category', isItemCategory);
        formData.append('website', isWebsiteLink);
        formData.append('discord', isDiscordLink);
        formData.append('instagram', isInstagramLink);
        formData.append('telegram', isTelegramLink);
        formData.append('twitter', isTwitterLink);
        formData.append('chain_id', isBlockchain);
        if(url != '') formData.append('link', url);
        if(isRoyalty) {
            formData.append('royalty_address', royaltyAddress);
            formData.append('royalty_fee', royaltyFee);
        }
        if (prop && prop.id) {
            formData.append('collection_id', prop.id);
        }
        
        if(data) {
            const createItems = {
                newData: formData,
                accessToken: data,
                setItemId: setItemId,
            }
            const clearState = () => {
                setName('')
                setItemDescription('')
                setWebsiteLink('')
                setDiscordLink('')
                setInstagramLink('')
                setTelegramLink('')
                setTwitterLink('')
                setItemCategory(1)
                setAvatarSrc('')
                setAvatarForm('')
                setFeaturedSrc('')
                setFeaturedForm('')
                setBannerSrc('')
                setBannerForm('')
                setUrl('');
                {
                    itemId && itemId.length > 0 && navigate(`/collection-detail/${itemId}`)
                }
            }

            dispatch(actions.createNftCollection(createItems)).then(clearState);
        }
        setLoadState(false) ;
        setCreateDisable(true) ;
    }

    useEffect(() => {
        dispatch(actions.fetchNftCategory())
    }, [dispatch]);

    const handleImageSelect = async (e, img) => {
        const file = e.target.files[0];
        if (filterCollectionImageFile(file)) {
            if (img === 'avatar') {
                setAvatarSrc(URL.createObjectURL(file));
                setAvatarForm(file)
            } else if (img === 'featured') {
                setFeaturedSrc(URL.createObjectURL(file));
                setFeaturedForm(file)
            } else {
                setBannerSrc(URL.createObjectURL(file));
                setBannerForm(file)
            }
        }
    }

    const handleRoyaltyChange = () => {
        setIsRoyalty(!isRoyalty);
    }

    const handleChange = (value) => {
        setItemCategory(value)
    }

    const handleBlockchainChange = (value) => {
        setBlockchain(value);
    }

    const handleCancelAction = () => {
        navigate(`/collection-detail/${prop.link}`)
    }

    const handleItemDes = (e) => {
        const value = e.target.value;
        const maxLength = 1000;
        if (value.length > maxLength) {
            notification['warning']({
                message: 'max length',
            });
            return
        } else {
            setItemDescription(value);
        }
    }

    const CreateSchema = Yup.object().shape({
        name: Yup.string().required('Name is required')
    });

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

    const checkDoubleName = async (e) => {
        const name = e.target.value;
        setName(name);
        const postData = {
            'name': name,
            id: prop && prop.id ? prop.id : null
        };
        Axios.post(`/api/collections/duplicate-check`, postData, { headers: header} )
        .then((res) => {
            setDoubleName(false);
        })
        .catch((e) => {
            let msg = e && e.response && e.response.data ? e.response.data.msg : '';
            if(msg == 'This collection name already exists on SuperKluster. Please select another one.') {
                setDoubleName(true);
            }
            
        })
    }

    const checkDoubleUrl = async (e) => {
        const url = e.target.value;
        setUrl(url);
        const postData = {
            'link': url,
            id: prop && prop.id ? prop.id : null
        };
        Axios.post(`/api/collections/check-valid-link`, postData, { headers: header} )
        .then((res) => {
            if(res.data.msg == 'success.') setDoubleUrl(false);
            else setDoubleUrl(true);
        })
        .catch((e) => {
            
        })
    }

    const debounceNameChangeHandler = useCallback(
        debounce(checkDoubleName, 1000)
    , [])

    const debounceUrlChangeHandler = useCallback(
        debounce(checkDoubleUrl, 1000)
    , [])

    const formik = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: CreateSchema,
        onSubmit: (evt) => {
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

    const createBtnStyle = {
        padding: '8px 40px', 
        color: 'white', 
        backgroundColor: '#f70dff', 
        border: '1px solid #e5e8eb', 
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
    
    const { errors, handleSubmit } = formik;

    return (
        <>
            <div>
                <GlobalStyles />

                {
                    loadState &&
                    <Affix offsetTop={85} onChange={(affixed) => console.log(affixed)} style={{ position: 'absolute', zIndex: 99, right: '10%' }}>
                        <Spin size="large" tip="Loading..." />
                    </Affix>
                }

                <section className='jumbotron breadcumb no-bg backgroundBannerStyleCreateCollection' style={{backgroundSize:'cover', backgroundRepeat:'no-repeat', backgroundPosition:'right top'}}>
                    <div className='mainbreadcumb'>
                        <div className='custom-container'>
                            <div className='row m-10-hor'>
                                <div className='col-12'>
                                    <h1 className='text-center' style={{textShadow:'2px 2px 2px rgba(0,0,0,.5)', fontFamily:'Inter'}}>Create Collection</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='custom-container' style ={{paddingTop:'4vh'}}>

                    <div className="row">
                        <div className="col-lg-10 offset-lg-1 mb-5">
                            <FormikProvider value={formik}>
                                <Form id="form-create-item" autoComplete="off" className="form-border" onSubmit={handleSubmit}>
                                    <div className="field-set ">
                                        <h5>Avatar</h5>
                                        <span>This image will also be used for navigation. 350 x 350 recommended.</span>
                                        <div className="trashIcon">
                                            <ImageUpload
                                                handleImageSelect={(e) => handleImageSelect(e, 'avatar')}
                                                imageSrc={avatarSrc}
                                                setImageSrc={setAvatarSrc}
                                                defaultDeleteIconSize={15}
                                                defaultDeleteIconColor="white"
                                                className="imageUploader"
                                                style={{
                                                    width: 180,
                                                    height: 180,
                                                    ...imageUploaderStyle
                                                }}
                                            />
                                        </div>

                                        <div className="spacer-single"></div>

                                        <h5>Featured image</h5>
                                        <span>This image will be used for featuring your collection on the homepage, category pages, or other promotional areas of SuperKluster. 600 x 400 recommended.</span>
                                        <FeaturedImgUploaderDiv className="trashIcon">   
                                            <ImageUpload
                                                handleImageSelect={(e) => handleImageSelect(e, 'featured')}
                                                imageSrc={featuredSrc}
                                                setImageSrc={setFeaturedSrc}
                                                defaultDeleteIconSize={15}
                                                defaultDeleteIconColor="white"
                                                className="imageUploader "
                                                style={{
                                                    width: '100%',
                                                    height: 200,
                                                    ...imageUploaderStyle
                                                }}
                                            />
                                        </FeaturedImgUploaderDiv>
                                        
                                        <div className="spacer-single"></div>

                                        <h5>Banner image</h5>
                                        <span>This image will appear at the top of your collection page. Avoid including too much text in this banner image, as the dimensions change on different devices. 1400 x 400 recommended.</span>
                                        <div className="trashIcon">   
                                            <ImageUpload
                                                handleImageSelect={(e) => handleImageSelect(e, 'banner')}
                                                imageSrc={bannerSrc}
                                                setImageSrc={setBannerSrc}
                                                defaultDeleteIconSize={15}
                                                defaultDeleteIconColor="white"
                                                className="imageUploader"
                                                style={{
                                                    width: "100%",
                                                    height: 300,
                                                    ...imageUploaderStyle
                                                }}
                                            />
                                        </div>

                                        <div className="spacer-single"></div>

                                        <h5>Name<strong style={{ color: 'red' }}>*</strong></h5>
                                        <input
                                            type="text"
                                            name="name"
                                            id="item_title"
                                            className="form-control"
                                            placeholder="Collection name"
                                            onChange={debounceNameChangeHandler}
                                            defaultValue = {isName}
                                            style= {{marginBottom:'3px'}}
                                        />
                                        {
                                            !isValidName && 
                                            <span><b style={{color:'red'}}>X</b> Name must contain one letter or digit.</span>
                                        }
                                        {
                                            (isValidName && doubleName) && <div style={{ color: 'red' }}>Not available!</div>
                                        }
                                        {
                                            (!doubleName && isValidName && isName != "") && <div style={{ color: 'green' }}>Available!</div>
                                        }

                                        <div className="spacer-10"></div>

                                        <h5>Description</h5>
                                        <span ><a style={{color:'#f70dff' , cursor: 'pointer' }} href="https://www.markdownguide.org/cheat-sheet/">Markdown</a> syntax is supported. {isItemDescription != null ? isItemDescription.length : <></> } of 1000 characters used.</span>
                                        <textarea data-autoresize name="item_desc" id="item_desc" className="form-control mt-2" onChange={handleItemDes} value={isItemDescription ?? ""} style={{ height: 150 }} placeholder="Provide a detailed description of your category"></textarea>

                                        <div className="spacer-10"></div>

                                        <h5>URL</h5>
                                        <span >Customize your URL on Superkluster. Must only contain lowercase letters, numbers, and hypens.</span>
                                        <div className='input-box'>
                                            <span class="prefix">https://superkluster.io/collection-detail/</span>
                                            <input type="text" className="url-input" defaultValue={url} onChange={debounceUrlChangeHandler}/>
                                        </div>
                                        {
                                            !validUrl && <span><b style={{color:'red'}}>X</b> Entered value must only contain lowercase letters, numbers, and hypens.</span>
                                        }
                                        {
                                            doubleUrl && <span><b style={{color:'red'}}>X</b> This url name is already taken.</span>
                                        }
                                        {
                                            validUrl && url.length > 0 && !doubleUrl && <span><FaCheck color="green"/> This url is valid.</span>
                                        }

                                        <div className="spacer-10"></div>

                                        <h5>Category</h5>
                                        <span>Adding a category will help make your item discoverable on SuperKluster.</span>
                                        <div className='dropdownSelect one'>
                                            <Select defaultValue={prop && prop.category != null ? prop.category.id : 1} style={{ width: "100%" }} onChange={handleChange} placeholder="Select...">
                                                {
                                                    category?.map((item) => (
                                                        <Option key={item.id} value={item.id}>{item.label}</Option>
                                                    ))
                                                }
                                            </Select>
                                        </div>

                                        <div className="spacer-10"></div>

                                        <h5>Blockchain</h5>
                                        <span>Select the blockchain where you'd like new items from this collection to be added by default.</span>
                                        <div className='dropdownSelect one'>
                                            <Select defaultValue={prop && prop.chain_id != null? prop.chain_id : 5} style={{ width: "100%" }} onChange={handleBlockchainChange} placeholder="Select..." disabled={(prop && prop.total_assets && prop.total_assets > 0) ? true: false}>
                                                {
                                                    blockchainData?.map((item) => (
                                                        <Option key={item.chainId} value={item.chainId}>
                                                            <img style={{ width: 25, height: 25, marginRight: 5 }} src={item.logo} alt='blockchain_logo' />
                                                            {item.name}
                                                        </Option>
                                                    ))
                                                }
                                            </Select>
                                        </div>

                                        <div className="spacer-10"></div>
                                        <div className="spacer-10"></div>
                                        <div className="spacer-10"></div>
                                        <h5>Royalty</h5>
                                        <div className="row align-items-center">
                                            <div className="col-10" style={{ display: 'flex' }}>
                                                <i className="fa fa-user-secret" style={iconStyle}></i>
                                                <div>
                                                    <h5>Set royalty for all items in collection</h5>
                                                </div>
                                            </div>
                                            <div className="col-2" style={{ textAlign: 'right' }}>
                                                <Switch onChange={handleRoyaltyChange} checked={isRoyalty} onColor="#f70dff" />
                                            </div>
                                        </div>
                                        { isRoyalty ?
                                            <div className="mb-3">
                                                <span>
                                                    Royalty Fee (%)
                                                </span>
                                                <input type="number" min="0" max="25" name="royalty_fee" id="royalty_fee" onChange={(e) => setValidateRoyaltyFee(e)} value={royaltyFee} className="form-control mt-2" placeholder="for example: 10"/>
                                                <span>
                                                    Royalty Address
                                                </span>
                                                <input 
                                                    type="text" 
                                                    name="item_supply" 
                                                    id="item_supply" 
                                                    onChange={(e) => setRoyaltyAddress(e.target.value)} 
                                                    value={royaltyAddress} 
                                                    className="form-control mt-2" 
                                                    placeholder="0x.." 
                                                />
                                            </div> : 
                                            null
                                        }

                                        <div className="spacer-10"></div>

                                        <h5>Links</h5>
                                        <Input size="large" type="url" onChange={e => setWebsiteLink(e.target.value)} value={isWebsiteLink ?? ""} placeholder="Yoursite" prefix={<FaPager />} />
                                        <Input size="large" type="url" onChange={e => setDiscordLink(e.target.value)} value={isDiscordLink ?? ""} placeholder="Discord" prefix={<FaDiscord />} />
                                        <Input size="large" type="url" onChange={e => setInstagramLink(e.target.value)} value={isInstagramLink ?? ""} placeholder="Instagram" prefix={<FaInstagram />} />
                                        <Input size="large" type="url" onChange={e => setTelegramLink(e.target.value)} value={isTelegramLink ?? ""} placeholder="Telegram" prefix={<FaTelegramPlane />} />
                                        <Input size="large" type="url" onChange={e => setTwitterLink(e.target.value)} value={isTwitterLink ?? ""} placeholder="Twitter" prefix={<FaTwitter />} />

                                        {prop ?
                                            <div>
                                                <button type="submit" onClick={sendData} className="createCollectionBtn" style={createBtnStyle} disabled={(data && isName && isCreateDisable && !doubleName && !loadState && validRoyalty && validUrl && !doubleUrl && isValidName) ? false : true}>Update</button> 
                                                <button type="button" onClick={handleCancelAction} style={cancelBtnStyle}>Cancel</button> 
                                            </div>
                                            : <button type="submit" onClick={sendData} className="createCollectionBtn" style={createBtnStyle} disabled={(data && isName && isCreateDisable && !doubleName && !loadState && validRoyalty && validUrl && !doubleUrl && isValidName) ? false : true}>Create</button>
                                        }
                                    </div>
                                </Form>
                            </FormikProvider>
                        </div>
                    </div>

                </section>
            </div>
        </>
    );
}
export default CreateCollectionPage;