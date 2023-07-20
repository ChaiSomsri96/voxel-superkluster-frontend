import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "@reach/router";
import { Container, FormCollectionSection, Caption, SubCaption, Text, imageUploaderStyleDark, imageUploaderStyleLight, ErrorLabel} from "./styled-components";
import { useFormik, Form, FormikProvider } from 'formik';
import { Input, Select, Spin, Affix, notification } from 'antd';
import { FaPager, FaDiscord, FaInstagram, FaTelegramPlane, FaTwitter, FaCheck } from 'react-icons/fa';
import { ethers } from 'ethers';
import * as Yup from 'yup';
import ImageUpload from 'image-upload-react';
import { filterCollectionImageFile } from "./../../components/constants/filters";
import { blockchainData } from "./../../components/constants/index";
import debounce from 'lodash.debounce';
import Switch from "react-switch";
import LocalButton from "../../components/common/Button";
import * as actions from "./../../store/actions/thunks";
import * as selectors from './../../store/selectors';
import { Axios } from "./../../core/axios";
import { isAlpha, isLowerLetter } from "./../../utils";
import "./../../assets/stylesheets/Create/index.scss";
import MoonLoader from "react-spinners/MoonLoader";

const CreateCollectionPage = ({colormodesettle}) => {

    const { Option } = Select;
    let location = useLocation();
    const { prop } = location.state;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` };

    const { data } = useSelector(selectors.accessToken);
    const category = useSelector(selectors.categoryState).data;

    let itemId;
    const setItemId = (_id) => {
        itemId = _id;
    }

    const CreateSchema = Yup.object().shape({
        name: Yup.string().required('Name is required')
    });

    const formik = useFormik({
        initialValues: {
            name: ''
        },
        validationSchema: CreateSchema,
        onSubmit: (evt) => {
        }
    });

    const { errors, handleSubmit } = formik;

    const [loadingSpin, setLoadingSpin] = useState(false);
    const [loadState, setLoadState] = useState(false);
    const [avatarSrc, setAvatarSrc] = useState(prop && prop ? prop.avatar : '') ;
    const [isAvatarForm, setAvatarForm] = useState() ;
    const [featuredSrc, setFeaturedSrc] = useState(prop && prop ? prop.featured : '') ;
    const [isFeaturedForm, setFeaturedForm] = useState() ;
    const [bannerSrc, setBannerSrc] = useState(prop && prop ? prop.banner : '') ;
    const [isBannerForm, setBannerForm] = useState() ;
    const [isName, setName] = useState(prop && prop.name ? prop.name : '');
    const [doubleName, setDoubleName] = useState(false);
    const [isValidName, setIsValidName] = useState(false);
    const [isItemDescription, setItemDescription] = useState(prop && prop.description ? prop.description : '');
    const [url, setUrl] = useState(prop && prop.link? prop.link: '');
    const [doubleUrl, setDoubleUrl] = useState(false);
    const [validUrl, setValidUrl] = useState(true);
    const [isItemCategory, setItemCategory] = useState(1);
    const [isBlockchain, setBlockchain] = useState(prop && prop.chain_id ? prop.chain_id : 5);
    const [isWebsiteLink, setWebsiteLink] = useState(prop && prop.website ? prop.website : '');
    const [isDiscordLink, setDiscordLink] = useState(prop && prop.discord ? prop.discord : '');
    const [isInstagramLink, setInstagramLink] = useState(prop && prop.instagram ? prop.instagram : '');
    const [isTelegramLink, setTelegramLink] = useState(prop && prop.telegram ? prop.telegram : '');
    const [isTwitterLink, setTwitterLink] = useState(prop && prop.twitter ? prop.twitter : 'https://twitter.com/');
    const [isCreateDisable , setCreateDisable] = useState(true) ;
    const [isType, setType] = useState('create');
    const [isRoyalty, setIsRoyalty] = useState(prop && prop.royalty_address ? true: false);
    const [royaltyAddress, setRoyaltyAddress] = useState(prop && prop.royalty_address ? prop.royalty_address:'');
    const [royaltyFee, setRoyaltyFee] = useState(prop && prop.royalty_fee? prop.royalty_fee : 10);
    const [validRoyalty, setValidRoyalty] = useState(true);

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
    }, [isName]);

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
    }, [url]);

    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
    
    },[]);

    useEffect(() => {
        if (prop) {
            setType("update")
        } else {
            setType("create")
        }
    }, [prop]);

    useEffect(() => {
        dispatch(actions.fetchNftCategory())
    }, [dispatch]);

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

    const setValidateRoyaltyFee = (e) => {
        const MAX_VALUE = 25;
        const MIN_VALUE = 0;
        const fee = Math.max(MIN_VALUE, Math.min(MAX_VALUE, Number(e.target.value.replaceAll(/[^\d.-]/g, ''))));
        setRoyaltyFee(fee);
    }

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

    const sendData = () => {
        if (
            !(
                validateUrl(isWebsiteLink) &&
                validateUrl(isDiscordLink) &&
                validateUrl(isInstagramLink) &&
                validateUrl(isTelegramLink) &&
                validateUrl(isTwitterLink)
            )
        ) {
            return;
        }

        setLoadState(true);
        setCreateDisable(false);
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

        if(url !== '') {
            formData.append('link', url);
        }
        
        if (isRoyalty) {
            formData.append('royalty_address', royaltyAddress);
            formData.append('royalty_fee', royaltyFee);
        }

        if (prop?.id) {
            formData.append('collection_id', prop.id);
        }

        if (data) {
            const createItems = {
              newData: formData,
              accessToken: data,
              setItemId: setItemId,
            };
            
            setLoadingSpin(true);

            const clearState = () => {
              setName('');
              setItemDescription('');
              setWebsiteLink('');
              setDiscordLink('');
              setInstagramLink('');
              setTelegramLink('');
              setTwitterLink('');
              setItemCategory(1);
              setAvatarSrc('');
              setAvatarForm('');
              setFeaturedSrc('');
              setFeaturedForm('');
              setBannerSrc('');
              setBannerForm('');
              setUrl('');
              setLoadingSpin(false);

              if (itemId && itemId.length > 0) {
                navigate(`/collection-detail/${itemId}`);
              }
            };
        
            dispatch(actions.createNftCollection(createItems))
            .then(clearState)
            .catch(e => {
                setLoadingSpin(false);
            });
        }

        setLoadState(false);
        setCreateDisable(true);
    }

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
    , []);

    const debounceUrlChangeHandler = useCallback(
        debounce(checkDoubleUrl, 1000)
    , []);

    return (
        <>
        <Container>
            <FormCollectionSection>
                {
                    loadingSpin &&
                        <div style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(255,255,255,0.5)', zIndex: '100'}}>
                            <MoonLoader cssOverride={{position: 'absolute', top: 'calc(50% - 50px)', left: 'calc(50% - 50px)', borderColor: 'rgb(220, 219, 219)'}} loading={loadingSpin} size={100} />  
                        </div>
                }

                <Caption>Create Collection</Caption>
                <FormikProvider value={formik}>
                    <Form id="form-create-collection" autoComplete="off" className="form-border" onSubmit={handleSubmit}>
                        <div>
                            <SubCaption>Avatar</SubCaption>  
                            <Text>This image will also be used for navigation. 350 x 350 recommended.</Text>
                            <div className="avatar-upload-container">
                                <ImageUpload
                                    handleImageSelect={(e) => handleImageSelect(e, 'avatar')}
                                    imageSrc={avatarSrc}
                                    setImageSrc={setAvatarSrc}
                                    defaultDeleteIconSize={15}
                                    defaultDeleteIconColor="white"
                                    className="imageUploader"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        ...(colormodesettle.ColorMode ? imageUploaderStyleLight : imageUploaderStyleDark)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="create-form-item">
                            <SubCaption>Featured image</SubCaption>  
                            <Text style={{marginBottom: '12px'}}>This image will be used for featuring your collection on the homepage,</Text>
                            <Text>category pages, or other promotional areas of SuperKluster. 600 x 400 recommended.</Text>
                            
                            <div className="featured-upload-container">
                                <ImageUpload
                                    handleImageSelect={(e) => handleImageSelect(e, 'featured')}
                                    imageSrc={featuredSrc}
                                    setImageSrc={setFeaturedSrc}
                                    defaultDeleteIconSize={15}
                                    defaultDeleteIconColor="white"
                                    className="imageUploader "
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        ...(colormodesettle.ColorMode ? imageUploaderStyleLight : imageUploaderStyleDark)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="create-form-item">
                            <SubCaption>Banner image</SubCaption>
                            <Text style={{marginBottom: '12px'}}>This image will appear at the top of your collection page. Avoid including too much text in this</Text>
                            <Text>banner image, as the dimensions change on different devices. 1400 x 400 recommended.</Text>

                            <div className="banner-upload-container">         
                                <ImageUpload
                                    handleImageSelect={(e) => handleImageSelect(e, 'banner')}
                                    imageSrc={bannerSrc}
                                    setImageSrc={setBannerSrc}
                                    defaultDeleteIconSize={15}
                                    defaultDeleteIconColor="white"
                                    className="imageUploader "
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        ...(colormodesettle.ColorMode ? imageUploaderStyleLight : imageUploaderStyleDark)
                                    }}
                                />
                            </div>
                        </div>
                        <div className="create-form-item">
                            <SubCaption>Name*</SubCaption>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Example: Treasure of supercluster"
                                onChange={debounceNameChangeHandler}
                                defaultValue = {isName}
                            />
                            {
                                !isValidName && 
                                <ErrorLabel><b style={{color:'red'}}>X</b> Name must contain one letter or digit.</ErrorLabel>
                            }
                            {
                                (isValidName && doubleName) && <ErrorLabel style={{ color: 'red' }}>Not available!</ErrorLabel>
                            }
                            {
                                (!doubleName && isValidName && isName != "") && <ErrorLabel style={{ color: 'green' }}>Available!</ErrorLabel>
                            }
                        </div>
                        <div className="create-form-item">
                            <SubCaption>Description</SubCaption>
                            <textarea data-autoresize name="item_desc" className="form-control" onChange={handleItemDes} value={isItemDescription ?? ""} style={{ height: 150 }} placeholder="Provide a detailed description of your category"></textarea>
                        </div>

                        <div className="create-form-item">
                            <SubCaption>URL</SubCaption>
                            <Text>Customize your URL on Superkluster. Must only contain lowercase letters, numbers, and hypens.</Text>
                            <div className='input-box'>
                                <span className="prefix">https://superkluster.io/collection-detail/</span>
                                <input type="text" className="url-input" defaultValue={url} onChange={debounceUrlChangeHandler}/>
                            </div>

                            {
                                !validUrl && <ErrorLabel><b style={{color:'red'}}>X</b> Entered value must only contain lowercase letters, numbers, and hypens.</ErrorLabel>
                            }
                            {
                                doubleUrl && <ErrorLabel><b style={{color:'red'}}>X</b> This url name is already taken.</ErrorLabel>
                            }
                            {
                                validUrl && url.length > 0 && !doubleUrl && <ErrorLabel><FaCheck color="green"/> This url is valid.</ErrorLabel>
                            }
                        </div>

                        <div className="create-form-item">
                            <SubCaption>Category</SubCaption>
                            <Text>Adding a category will help make your item discoverable on SuperKluster.</Text>

                            <div className='dropdownSelect one'>
                                <Select 
                                    defaultValue={prop && prop.category != null ? prop.category.id : 1} 
                                    style={{ width: "100%" }} 
                                    onChange={handleChange} 
                                    placeholder="Select..."
                                >
                                    {
                                        category?.map((item) => (
                                            <Option key={item.id} value={item.id}>{item.label}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                        </div>
                                    
                        <div className="create-form-item">
                            <SubCaption>Blockchain</SubCaption>
                            <Text>Select the blockchain where you'd like new items from this collection to be added by default.</Text>
                        
                            <div className='dropdownSelect one'>
                                <Select 
                                    defaultValue={prop && prop.chain_id != null? prop.chain_id : 5} 
                                    style={{ width: "100%" }} 
                                    onChange={handleBlockchainChange} 
                                    placeholder="Select..." 
                                    disabled={(prop && prop.total_assets && prop.total_assets > 0) ? true: false}
                                >
                                    {
                                        blockchainData?.map((item) => (
                                            <Option key={item.chainId} value={item.chainId}>
                                                <img style={{ width: 32, height: 32, marginRight: 10 }} src={item.logo} alt='blockchain_logo' />
                                                {item.name}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </div>
                        </div>            
                                    
                        <div className="create-form-item flex-flex-start">
                            <div>
                                <SubCaption>Royalty</SubCaption>
                                <Text style={{marginBottom: '0px'}}>Set royalty for all items in collection</Text>
                            </div>
                            
                            <Switch 
                                onChange={handleRoyaltyChange} 
                                checked={isRoyalty}
                                uncheckedIcon={false}
                                checkedIcon={false} 
                                handleDiameter={26}
                                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                height={26}
                                width={50}
                                onColor="#f70dff"
                                offColor={colormodesettle.ColorMode ? "#ECEBEB" : "#4B4C4D"}
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
                            />
                        </div>
                            :
                            null
                        }            
                        <div className="create-form-item">
                            <SubCaption>Links</SubCaption>

                            <Input size="large" type="url" onChange={e => setWebsiteLink(e.target.value)} value={isWebsiteLink ?? ""} placeholder="Yoursite" prefix={<FaPager />} />
                            <Input size="large" type="url" onChange={e => setDiscordLink(e.target.value)} value={isDiscordLink ?? ""} placeholder="Discord" prefix={<FaDiscord />} />
                            <Input size="large" type="url" onChange={e => setInstagramLink(e.target.value)} value={isInstagramLink ?? ""} placeholder="Instagram" prefix={<FaInstagram />} />
                            <Input size="large" type="url" onChange={e => setTelegramLink(e.target.value)} value={isTelegramLink ?? ""} placeholder="Telegram" prefix={<FaTelegramPlane />} />
                            <Input size="large" type="url" onChange={e => setTwitterLink(e.target.value)} value={isTwitterLink ?? ""} placeholder="https://twitter.com/" prefix={<FaTwitter />} />
                        </div>
                        <div style={{marginTop: '10px'}}>
                            {
                                prop ?
                                    <button type="submit" onClick={sendData} className="createCollectionBtn create-btn-style" disabled={(data && isName && isCreateDisable && !doubleName && !loadState && validRoyalty && validUrl && !doubleUrl && isValidName) ? false : true}>Update</button>
                                    :
                                    <button type="submit" onClick={sendData} className="createCollectionBtn create-btn-style" disabled={(data && isName && isCreateDisable && !doubleName && !loadState && validRoyalty && validUrl && !doubleUrl && isValidName) ? false : true}>Create</button>
                            }   
                        </div>
                    </Form>
                </FormikProvider>
            </FormCollectionSection>
        </Container>
        </>
    );
}
export default CreateCollectionPage;