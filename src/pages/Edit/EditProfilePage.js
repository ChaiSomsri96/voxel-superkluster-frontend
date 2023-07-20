import React, { useState, useEffect, useCallback } from "react";
import { Container, FormEditProfileSection, Caption, AvatarUpload, 
  AvatarImg, BannerUpload, BannerImg, SubCaption, VerifyContent, KycAcceptButton, KycNopeButton} from "./styled-components";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "@reach/router";
import * as Yup from 'yup';
import Swal from 'sweetalert2' ;
import 'sweetalert2/src/sweetalert2.scss' ;
import * as selectors from './../../store/selectors';
import { signWallet } from "./../../core/nft/interact";
import { saveAccessToken } from "./../../store/actions";
import { Axios } from "./../../core/axios";
import avatarImg from "./../../assets/image/profile.png";
import bannerImg from "./../../assets/image/profile_default_banner.jpg";
import { filterImageFile } from "./../../components/constants/filters";
import "./../../assets/stylesheets/edit_profile.scss";
import { Input, Select, Alert } from 'antd';
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import { useFormik, Form, FormikProvider, Field } from 'formik';
import Switch from "react-switch";
import UploadFileForKyc from "./../../components/UploadFileForKyc";
import { ReactComponent as EmailDarkIcon } from "./../../assets/svg/email_dark.svg";
import { ReactComponent as EmailLightIcon } from "./../../assets/svg/email_white.svg";
import { ReactComponent as WarningDarkIcon } from "./../../assets/svg/warning_dark.svg";
import { ReactComponent as WarningLightIcon } from "./../../assets/svg/warning_white.svg";

const EditProfilePage = ({funcs, colormodesettle}) => {

  const { library } = useWeb3React();
  const dispatch = useDispatch();
  const { Option } = Select;
  const navigate = useNavigate();
  const account = localStorage.getItem('account');
  const accessTokenState = useSelector(selectors.accessToken);
  const accessToken = accessTokenState.data ? accessTokenState.data : null;
  
  const verifyProfileOptions = [
    { id: 1, label: 'Listed on Voxel X NFT, GameFi, Metaverse Partnerships' },
    { id: 2, label: 'New Creator' },
  ];

  const CreateSchema = Yup.object().shape({
    username: Yup.string().required('Username is required')
  });

  const formik = useFormik({
      initialValues: {
        username: ''
      },
      validationSchema: CreateSchema,
      onSubmit: (evt) => {
        console.log(evt)
      }
  });

  const { errors, handleSubmit } = formik;

  const [avatar, setAvatar] = useState();
  const [avatarFile, setAvatarFile] = useState();

  const [banner, setBanner] = useState();
  const [bannerFile, setBannerFile] = useState();
  const [bannerFileWidth, setBannerFileWidth] = useState(null);
  const [bannerFileHeight, setBannerFileHeight] = useState(null);

  const [loading, setLoading] = useState(true);
  const [verfiyProfileOptionValue, setVerfiyProfileOptionValue] = useState(0);
  const [kycStatus, setKYCStatus] = useState(0);

  const [u_name , setUName] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [availableMsg, setAvailableMsg] = useState(false);

  const [verificationStatu , setVerificationStatu] = useState() ;
  const [verificationType , setVerificationType] = useState() ;
  const [verificationResult , setVerificationResult] = useState() ;
  const [isChanged, setChanged] = useState(false);

  const [org_data, setOrgData] = useState();
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [site, setSite]= useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [project, setProject] = useState('');

  const [esChecked, setESChecked] = useState(false);
  const [EmailChecked, setEmailChecked] = useState(false);


  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  // event change
  const handleOptionChange = (id) => {
    setVerfiyProfileOptionValue(id)
  }

  const handleAccessToken = useCallback((value) => {
    dispatch(saveAccessToken(value));
  }, [dispatch]);

  const handleESChange = () => {
    setESChecked(!esChecked)
  }

  const handleEmailChange = () => {
    setEmailChecked(!EmailChecked)
  }

  const handleBioChange = (e) => {
    setBio(e.target.value);
  }

  const handleUserEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handleSiteChange = (e) => {
    setSite(e.target.value);
  }

  const handleTwitterChange = (e) => {
    setTwitter(e.target.value);
  }

  const handleInstagramChange = (e) => {
    setInstagram(e.target.value);
  }

  const handleProjectChange = (e) => {
    setProject(e.target.value);
  }

  const handleTelegramChange = (e) => {
    setTelegram(e.target.value);
  }

  const handleChangeAvatar = (info) => {
    if (filterImageFile(info)) {
      if (info.file) {
        setAvatarFile(info.file) ;
  
        getBase64(info.file, imageUrl => {
          setAvatar(imageUrl) ;
        });
      }
    }
  }

  const handleChangeBanner = (info) => {
    if (filterImageFile(info)) {
      if (info.file) {
        setBannerFile(info.file) ;
        const image = new Image();
        image.src = URL.createObjectURL(info.file);
        image.onload = () => {
          setBannerFileWidth(image.width) ;
          setBannerFileHeight(image.height) ;
          if(image.width < 1400 || image.width > 2000 || image.height < 280 || image.height > 320) {
            Swal.fire({
              title: 'Heads up',
              text: "Please check the dimensions of the image you are trying to upload.",
              icon: 'info',
              confirmButtonText: 'Close',
              timer:5000,
              customClass: 'swal-height'
            })
          }
        }
        getBase64(info.file, imageUrl => {
          setBanner(imageUrl) ;
        });
      }
    }
  }

  const handleUserNameBlur = async () => {     
    if(u_name.length === 0) {
      return;
    }

    if(u_name == org_data['username']) {
      setUsernameAvailable(true);
      setAvailableMsg(false);
      return;
    }

    if(!await checkValidUsername(u_name)) {
      setUsernameAvailable(false);
      setAvailableMsg(false);
    }
    else {
      setUsernameAvailable(true);
      setAvailableMsg(true);
    }
  }

  const handleUsername = (e) => {
    setUName(e.target.value);

    if(!e.target.value || e.target.value.length == 0) {
      setAvailableMsg(false); 
      setUsernameAvailable(true);
    }
  }

   
  // useEffect

  useEffect(()=>{
    localStorage.setItem('searchValue','') ;
  },[])
  
  useEffect(() => {
    if(!org_data) return;
    if(org_data['username'] != u_name || org_data['avatar'] != avatar || org_data['banner'] != banner ||
       org_data['bio'] != bio || org_data['email'] != email || org_data['link_external'] != site ||
       org_data['link_twitter'] != twitter || org_data['link_instagram'] != instagram || 
       org_data['is_sensitive'] != esChecked || org_data['email_notification'] != EmailChecked) {
      setChanged(true);
      return;
    }
    setChanged(false);
  }, [u_name, org_data, avatar, banner, bio, email, site, twitter, instagram, esChecked, EmailChecked])

  useEffect(() => {
    async function getProfile() {
      setLoading(true);

      if (!account || !accessToken) {
        return;
      }

      try {
        const header = { 'Authorization': `Bearer ${accessToken}` };
        const { data } = await Axios.get(`/api/users/profile`,
          {
            headers: header
          }
        );
        
        if (data) {
          data['bio'] = data['bio'] ?? "";
          data['email'] = data['email'] ?? "";
          data['link_external'] = data['link_external'] ?? "https://";
          data['link_twitter'] = data['link_twitter'] ?? "https://twitter.com/";
          data['link_instagram'] = data['link_instagram'] ?? "https://instagram.com/";
          setOrgData(data);
          setUName(data['username']) ;
          setBio(data['bio']);
          setEmail(data['email']);
          setSite(data['link_external']);
          setTwitter(data['link_twitter']);
          setInstagram(data['link_instagram']);
          localStorage.setItem('UserName',data['username']?? "");
          setVerificationStatu(data['verify_request']);
          setVerificationType(data['verify_type']);
          setVerificationResult(data['verified']);
          setESChecked(data['is_sensitive']);
          setEmailChecked(data['email_notification']);
          setAvatar(data['avatar']);
          setBanner(data['banner']);
          setLoading(false);
        }
      }
      catch {
        const accessToken = await signWallet(account, library);
        if (!accessToken) {
          navigate('/');
        }
        else {
          handleAccessToken(accessToken);
        }
      }
    }
    getProfile();
  }, [account, accessToken])

  const setPrefix_url = (o_url) =>{
    if(o_url.includes("http") == false ) return "https://" + o_url ;
    return o_url ;
  }

  const setTwitterPrefix_url = (o_url) =>{
    if(o_url.includes("http") == false ) return "https://twitter.com/" + o_url ;
    return o_url ;
  }

  const setInstagramPrefix_url = (o_url) =>{
    if(o_url.includes("http") == false ) return "https://instagram.com/" + o_url ;
    return o_url ;
  }

  const checkValidUsername = async (user_name) => {
    try {
      let cnt = user_name.length ;
      for(let i = 0 ; i < cnt ; i ++ ) {
        if(user_name[i] == ' ') {
          return false ;
        }
      }

      const { data } = await Axios.post(`/api/users/duplicate-check`,
      {
        type  : 'username',
        value : user_name
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if(data.duplicate) {
        return false;
      }

      return true;
    }
    catch(error) {
      console.error("checkValidUsername: ", error);
    }
  }

  const handleUpdateProfile = async () => {
    try {
      if(u_name.length === 0) {
        Swal.fire({
          title: 'Oops...',
          text: 'Username cannot be empty.',
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return ;
      }

      if(!await checkValidUsername(u_name)) {
        Swal.fire({
          title: 'Oops...',
          text: 'Name is incorrect.',
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return ;
      }

      if(u_name.length > 50) {
        Swal.fire({
          title: 'Warning!',
          text: "Max size of username should not exceed 50 characters.",
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return;
      }

      if(bio.length > 160) {
        Swal.fire({
          title: 'Warning!',
          text: "Max size of bio should not exceed 160 characters.",
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return;
      }

      if(email.length > 100) {
        Swal.fire({
          title: 'Warning!',
          text: "Max size of email should not exceed 100 characters.",
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return;
      }

      if(site.length > 100) {
        Swal.fire({
          title: 'Warning!',
          text: "Max size of website link should not exceed 100 characters.",
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return;
      }

      if(twitter.length > 100) {
        Swal.fire({
          title: 'Warning!',
          text: "Max size of twitter link should not exceed 100 characters.",
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return;
      }

      if(instagram.length > 100) {
        Swal.fire({
          title: 'Warning!',
          text: "Max size of twitter link should not exceed 100 characters.",
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        return;
      }

      const formData = new FormData();
      formData.append('username' , u_name);
      formData.append('bio' , bio);
      formData.append('email' , email);
      formData.append('link_external' , setPrefix_url(site));
      formData.append('link_twitter' , setTwitterPrefix_url(twitter));
      formData.append('link_instagram' , setInstagramPrefix_url(instagram));

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      if (bannerFile) {
        formData.append('banner', bannerFile);
      }

      formData.append('is_sensitive',esChecked);
      formData.append('email_notification' , EmailChecked);

      const { data } = await Axios.post(`/api/users/profile`, formData, 
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      data['bio'] = data['bio'] ?? "";
      data['email'] = data['email'] ?? "";
      data['link_external'] = data['link_external'] ?? "https://";
      data['link_twitter'] = data['link_twitter'] ?? "https://twitter.com/";
      data['link_instagram'] = data['link_instagram'] ?? "https://instagram.com/";
      setOrgData(data);
      setChanged(false);

      setUsernameAvailable(true);
      setAvailableMsg(false);
      
      funcs.setProfileModeFunc(avatarFile) ;
      
      Swal.fire({
        title: 'It worked!',
        text: 'Profile Updated Successfully!',
        icon: 'success',
        confirmButtonText: 'Close',
        timer:5000,
        customClass: 'swal-height'
      });

      localStorage.setItem('UserName', u_name) ;
    }
    catch(error) {
      Object.values(error).map(function(item) {
        if (item.data && item.data.msg) {
          Swal.fire({
            title: 'Oops...',
            text: `${ item.data.msg }`,
            icon: 'error',
            confirmButtonText: 'Close',
            timer:5000,
            customClass: 'swal-height'
          })
        }
      })
    }
  }

  return (
    <>
      <Container>
        <FormEditProfileSection className="edit-profile-page">
          <Caption>Edit Profile</Caption>

          <FormikProvider value={formik}>
            <Form id="form-edit-profile" autoComplete="off" noValidate onSubmit={handleSubmit}>
              <div className="banner-line">
                <BannerUpload
                                  listType="picture-card"
                                  maxCount={1}
                                  showUploadList={false}
                                  onChange={handleChangeBanner}
                                  beforeUpload={() => false}
                                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" 
                                >
                                  <BannerImg src={banner ? banner : bannerImg} />
                </BannerUpload>

                <div className="avatar-line">
                  <AvatarUpload
                                    listType="picture-card"
                                    maxCount={1}
                                    showUploadList={false}
                                    onChange={handleChangeAvatar}
                                    beforeUpload={() => false}
                                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                                  >
                                    <AvatarImg src={avatar ? avatar : avatarImg} />
                  </AvatarUpload>
                </div>
              </div>

              <div className="edit-form-item">
                <SubCaption className="spacing">Username*</SubCaption>
                <Field
                          type="text"
                          name="username"
                          className="form-control"
                          onChange={(e) => {handleUsername(e)}}
                          onBlur={() => handleUserNameBlur()}
                          value={u_name ?? ""}
                />

                {
                 u_name.length == 0 ?
                 <div style={{ color: 'red' }} className="require-error">Username is required</div>
                 : !usernameAvailable ? <div style={{ color: 'red' }} className="require-error">Username is invalid</div>
                 : availableMsg && usernameAvailable && org_data['username'] != u_name ? <div style={{ color: 'green' }} className="require-error">Available</div>
                 : null
                }
              </div>

              <div className="edit-form-item">
                <SubCaption className="spacing">Short Bio</SubCaption>
                <textarea data-autoresize name="bio" className="form-control" value={bio ?? ""} style={{ height: 100 }} onChange={handleBioChange}></textarea>
              </div>

              <div className="edit-form-item">
                <SubCaption className="spacing">Email</SubCaption>
                <input
                                  type="text"
                                  name="email"
                                  className="form-control"
                                  defaultValue = {email}
                                  onChange={handleUserEmailChange}
                />
              </div>

              <div className="edit-form-item">
                <SubCaption className="spacing">Website URL</SubCaption>
                <input
                                  type="text"
                                  name="site"
                                  className="form-control"
                                  defaultValue = {site}
                                  placeholder="https://"
                                  onChange={handleSiteChange}
                />
              </div>

              <div className="edit-form-item">
                <SubCaption className="spacing">Twitter</SubCaption>
                <Input size="large" type="url" value={twitter ?? ""} placeholder="Enter your Twitter username" prefix={<FaTwitter />} onChange={handleTwitterChange} />
              </div>

              <div className="edit-form-item">
                <SubCaption className="spacing">Instagram</SubCaption>
                <Input size="large" type="url" value={instagram ?? ""} placeholder="Enter your Instagram username" prefix={<FaInstagram />} onChange={handleInstagramChange} />
              </div>

              <div className="trigger-section flex-center-between">
                <div className="flex-align-center">
                  {
                    colormodesettle.ColorMode ? <WarningLightIcon /> : <WarningDarkIcon />
                  }
                  
                  <SubCaption style={{marginLeft: '15px'}}>View Explicit & Sensitive Content</SubCaption>
                </div>
                
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
                                offColor={colormodesettle.ColorMode ? "#ECEBEB" : "#4B4C4D"}
                />
              </div>

              <div className="edit-form-item flex-center-between">
                <div className="flex-align-center">
                  {
                    colormodesettle.ColorMode ? <EmailLightIcon /> : <EmailDarkIcon />
                  }
                  
                  <SubCaption style={{marginLeft: '15px'}}>Email Notification</SubCaption>
                </div>
                
                <Switch 
                                onChange={handleEmailChange} 
                                checked={EmailChecked}
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

              <div className="edit-form-item">
                <SubCaption className="spacing">Verify your profile</SubCaption>
                <div className="dropdownSelect one">
                  <Select 
                    placeholder="Select option..."
                    maxTagCount="responsive"
                    onChange={handleOptionChange}
                    defaultValue = {verificationStatu == '1' || verificationResult == true ?
                                              verificationType == '1' ?
                                              "Listed on Voxel X NFT, GameFi, Metaverse Partnerships"
                                              :
                                              "New Creator"
                                            :
                                            null
                                          }
                    style={{ width: "100%" }}>

                    {
                      verifyProfileOptions?.map((item) => (
                          <Option key={item.id}  value={item.id}  >{item.label}</Option>
                      ))
                    }

                  </Select>
                </div>
              </div>
              {
                verfiyProfileOptionValue === 1 ?
                <VerifyContent>
                  <div>
                    <SubCaption className="spacing">Your Project</SubCaption>
                    <input
                                      type="text"
                                      name="myProject"
                                      className="form-control"
                                      defaultValue = {project}
                                      onChange={handleProjectChange}
                    />
                  </div>

                  <div className="edit-form-item">
                    <SubCaption className="spacing">Telegram username</SubCaption>
                    <input
                                      type="text"
                                      name="telegramUsername"
                                      className="form-control"
                                      defaultValue = {telegram}
                                      onChange={handleTelegramChange}
                    />
                  </div>

                  <div className="edit-form-item">
                    <button type="submit" className="editProfileBtn edit-btn-style">Send</button>
                  </div>
                </VerifyContent>
                : verfiyProfileOptionValue === 2 ?
                <VerifyContent className="kyc-content">
                    <SubCaption style={{textAlign: 'center'}}>Do you have a KYC certificate</SubCaption>
                    <div className="flex-align-center" style={{ justifyContent: 'space-around', margin: 20 }}>
                      <KycAcceptButton onClick={() => setKYCStatus(1)}>Yes</KycAcceptButton> 
                      <KycNopeButton onClick={() => setKYCStatus(2)}>No</KycNopeButton>
                    </div>

                    {
                      kycStatus === 1 ?
                        <UploadFileForKyc verification_pending = {verificationStatu} />
                      : kycStatus === 2 ?
                      <div style={{display: 'flex', justifyContent: 'center'}}>
                        <Alert
                          banner
                          message="Please obtain a KYC certificate from a reputable provider and submit your request"
                        />
                      </div>
                      : null
                    }
                </VerifyContent>
                : null
              }
                  
              <div className="edit-form-item">
                  <button 
                  type="submit"
                  onClick={() => handleUpdateProfile()}
                  className="edit-profile-button editProfileBtn edit-btn-style" 
                  disabled={!(isChanged && u_name.length > 0 && usernameAvailable && availableMsg)}>Update</button> 
              </div>
            </Form>
          </FormikProvider>
        </FormEditProfileSection>
      </Container>
    </>
  ); 
}
export default EditProfilePage;