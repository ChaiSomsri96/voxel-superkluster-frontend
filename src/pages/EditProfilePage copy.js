import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components";
import { Input, Button, Upload, Form,  Select, Alert} from "antd";
import Switch from "react-switch";
import * as selectors from './../store/selectors';
import { Axios } from "./../core/axios";
import { useNavigate } from "@reach/router";
import { saveAccessToken } from "./../store/actions";
import { useWeb3React } from "@web3-react/core";
import { signWallet } from "./../core/nft/interact";
import UploadFileForKyc from "./../components/UploadFileForKyc";
import { filterImageFile } from "./../components/constants/filters";
import bannerImg from "./../assets/image/profile_default_banner.jpg";

import Swal from 'sweetalert2' ;
import 'sweetalert2/src/sweetalert2.scss' ;

import { Formik } from "formik";

import avatarImg from "./../assets/image/profile.png";

const TabContent = styled.div`
  margin: 42px 0px;
`;

const IconContent = styled.i`
    font-size:20px ;
    display:flex ;
    align-items:center ;
    margin-right:10px ;
`;

const ActionButton = styled(Button)`
  width: 200px;
  height: 42px;
  color: white;
  background: #F70DFF;
  border: 1px solid #F70DFF;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;

  &:hover {
    background: #F70DFF;
    border: 1px solid #EEEEEE;
    color: white;
  }
`

const ActionButtonDiv = styled.div`
  cursor: pointer;
  width: 200px;
  height: 42px;
  color: white;
  background: #F70DFF;
  border: 1px solid #F70DFF;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;

  &:hover {
    background: #F70DFF;
    border: 1px solid #EEEEEE;
    color: white;
  }
`

const SendButton = styled(Button)`
  width: 120px;
  height: 42px;
  color: white;
  background: #F70DFF;
  border: 1px solid #F70DFF;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;

  &:hover {
    background: #EEEEEE;
    border: 1px solid #EEEEEE;
  }
`

const KycAcceptButton = styled(Button)`
  width: 60px;
  height: 30px;
  color: white;
  background: #F70DFF;
  border: 1px solid #F70DFF;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 600;
  &:hover {
    background: #EEEEEE;
    border: 1px solid #CCC;
  }
`
const KycNopeButton = styled(Button)`
opacity: 1;
width: 60px;
height: 30px;
border-radius: 5px;
`

const AvatarUpload = styled(Upload)`
  & .ant-upload.ant-upload-select-picture-card {
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`

const BannerUpload = styled(Upload)`
  & .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    height: 100%;
    border-radius: 40px;
  }
`

const BannerImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 40px;
`

const labelFontStyle = {
  fontSize: 18,
  fontWeight: 500,
  paddingBottom: 5
}
const labelFontStyle_alram = {
  fontSize: 18,
  fontWeight: 500,
  paddingBottom: 5
}

const ProfileForm = styled(Form)`

  & .ant-form-item-label {
    font-size: 16px;
    font-weight: 500;
    padding-bottom: 12px;
  }

  & .ant-form-item {
    margin-bottom: 32px;
  }

`

const NotificationsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`

const NotificationItem = styled.div`
  padding: 20px;
  padding-bottom: 10px;
  border: solid 1px rgba(0, 0, 0, .1);
`

const NofitcationLine = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledSelect = styled(Select)`
  width: 100%;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 18px !important;
  font-weight: 500;
`;

const VerifyContent = styled.div`
  border: 1px solid #f70dff;
  border-radius: 10px;
  padding: 20px;
  margin: 0px 0px 30px;
`

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const EditProfilePage = ({funcs, colormodesettle}) => {

  const { library } = useWeb3React();
  const dispatch = useDispatch();
  const { Option } = Select;
  const navigate = useNavigate()
  const account = localStorage.getItem('account');
  const accessTokenState = useSelector(selectors.accessToken);
  const accessToken = accessTokenState.data ? accessTokenState.data : null;

  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(true);

  const [profileForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  const [avatar, setAvatar] = useState();
  const [avatarFile, setAvatarFile] = useState();


  const [banner, setBanner] = useState();
  const [bannerFile, setBannerFile] = useState();
  const [bannerFileWidth, setBannerFileWidth] = useState(null);
  const [bannerFileHeight, setBannerFileHeight] = useState(null);

  const [verfiyProfileOptionValue, setVerfiyProfileOptionValue] = useState(0);
  const [kycStatus, setKYCStatus] = useState(0);
  const [u_name , setUName] = useState() ;
   
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

  const handleAccessToken = useCallback((value) => {
    dispatch(saveAccessToken(value));
  }, [dispatch]);

  const handleESChange = () => {
    setESChecked(!esChecked)
  }

  const handleTelegramChange = (e) => {
    setTelegram(e.target.value);
  }

  const handleProjectChange = (e) => {
    setProject(e.target.value);
  }


  const handleEmailChange = () => {
    setEmailChecked(!EmailChecked)
  }

  const handleBioChaneg = (e) => {
    setBio(e.target.value);
  }

  const handleEmailAddrChange = (e) => {
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

  const validate =  async (values) => {
    let errors = {};
    let user_name = values.password ;
    setUName(values.password );
    let cnt = user_name.length ;
  
    for(let i = 0 ; i < cnt ; i ++ ) {
      if(user_name[i] == ' ') {
          errors.password = "* Not allowed to have space in the User name." ;
          break ;
      }
    }
  
    await Axios.post(
      `/api/users/duplicate-check`,
      {
        type  : 'username', 
        value : user_name,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      }
    ).then(resp => {
      if(resp.data.duplicate && localStorage.getItem('UserName') != values.password) {
        errors.password = "* User name is Duplicated" 
      }
    }).catch(err => {
    });

    if (!values.password) {
      errors.password = "* Username is required";
    } 
    return errors;
  };

  const submitForm = (values) => {
  };

  const CheckingCorrectUsername =  (user_name)=>{
    let cnt = user_name.length ;
    for(let i = 0 ; i < cnt ; i ++ ) {
      if(user_name[i] == ' ') {
        return false ;
      }
    }
    
    Axios.post(
        `/api/users/duplicate-check`,
        {
          type  : 'username', 
          value : user_name,
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
        }
      ).then(resp => {
        if(resp.data.duplicate) {
          return false ;
        }
      }).catch(err => {
      });
      
      return true ;
  } ;

  const initialValues = {
    password: localStorage.getItem('UserName')
  };
  
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
        const header = { 'Authorization': `Bearer ${accessToken}` }
        const { data } = await Axios.get(
          `/api/users/profile`,
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
          setVerificationStatu(data['verify_request']) ;
          setVerificationType(data['verify_type']);
          setVerificationResult(data['verified']) ;
          setESChecked(data['is_sensitive']) ;
          setEmailChecked(data['email_notification']) ;
          profileForm.setFieldsValue({
            username: data['username'] ?? "",
            bio: data['bio'] ?? "",
            email: data['email'] ?? "",
            banner: data['banner'] ?? "",
            avatar: data['avatar'] ?? "",
            link_twitter: data['link_twitter'] ?? "https://twitter.com/",
            link_instagram: data['link_instagram'] ?? "https://instagram.com/",
            link_external: data['link_external'] ?? "https://",
            telegramUsername: data['telegram_id'] ?? "",
            myProject: data['project_name'] ?? ""
          });
          if (data['notification']) {
            notificationForm.setFieldsValue(data['notification']);
          }

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

  }, [
    account,
    accessToken
  ])

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

  const handleUpdateProfile = (info) => {
    if(!CheckingCorrectUsername(u_name)) {

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
    
    if( verfiyProfileOptionValue === 1) {
      
      const postData = {
        telegram_id: info.telegramUsername,
        project_name: info.myProject,
        verify_type:verfiyProfileOptionValue
      }

      Axios.post(`/api/users/verify-request` , postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          
        }
      }).then(resp => {
        setVerificationStatu("1") ;
        Swal.fire({
          title: 'It worked!',
          text: 'Admin will verify your profile details. please wait.',
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      }).catch(err => {
      });
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

    if(info.bio.length > 160) {
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

    if(info.email.length > 100) {
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

    if(info.link_external.length > 100) {
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

    if(info.link_twitter.length > 100) {
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

    if(info.link_instagram.length > 100) {
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
    formData.append('bio' , info.bio);
    formData.append('email' , info.email);
    formData.append('link_external' , setPrefix_url(info.link_external));
    formData.append('link_twitter' , setTwitterPrefix_url(info.link_twitter));
    formData.append('link_instagram' , setInstagramPrefix_url(info.link_instagram));
    formData.append('telegramUsername' , info.telegramUsername);
    
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    formData.append('is_sensitive',esChecked);
    formData.append('email_notification' , EmailChecked) ;
    Axios.post(`/api/users/profile` , formData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      }).then(resp => {
        setOrgData(resp.data);
        funcs.setProfileModeFunc(avatarFile) ;
        Swal.fire({
          title: 'It worked!',
          text: 'Profile Updated Successfully!',
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        localStorage.setItem('UserName',u_name) ;
      }).catch(err => {
        Object.values(err).map(function(item) {
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
      });
  }

  const handleUpdateProfile_1 = async() => {

    if(!CheckingCorrectUsername(u_name)) {

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
    
    if( verfiyProfileOptionValue === 1) {
      
      const postData = {
        telegram_id: telegram,
        project_name: project,
        verify_type:verfiyProfileOptionValue
      }

      Axios.post(`/api/users/verify-request` , postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          
        }
      }).then(resp => {
        setVerificationStatu("1") ;
        Swal.fire({
          title: 'It worked!',
          text: 'Admin will verify your profile details. please wait.',
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      }).catch(err => {
      });

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
    formData.append('telegramUsername' , telegram);
    
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    if (bannerFile) {
      formData.append('banner', bannerFile);
    }

    formData.append('is_sensitive',esChecked);
    formData.append('email_notification' , EmailChecked);

    Axios.post(`/api/users/profile` , formData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      }).then(resp => {
        const data = resp.data;
        data['bio'] = data['bio'] ?? "";
        data['email'] = data['email'] ?? "";
        data['link_external'] = data['link_external'] ?? "https://";
        data['link_twitter'] = data['link_twitter'] ?? "https://twitter.com/";
        data['link_instagram'] = data['link_instagram'] ?? "https://instagram.com/";
        setOrgData(data);
        setChanged(false);
        funcs.setProfileModeFunc(avatarFile) ;

        Swal.fire({
          title: 'It worked!',
          text: 'Profile Updated Successfully!',
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
        localStorage.setItem('UserName',u_name) ;
      }).catch(err => {
        Object.values(err).map(function(item) {
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
      });
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

  const handleUpdateNotification = (info) => {
    Axios.post(`/api/users/notification`, info,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(resp => {
        Swal.fire({
          title: 'It worked!',
          text: "Update notification successed.",
          icon: 'success',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      }).catch(err => {
        Swal.fire({
          title: 'Oops...',
          text: "Update notification failed.",
          icon: 'error',
          confirmButtonText: 'Close',
          timer:5000,
          customClass: 'swal-height'
        })
      });
  }

  const handleOptionChange = (id) => {
    setVerfiyProfileOptionValue(id)
  }

  const verifyProfileOptions = [
      { id: 1, label: 'Listed on Voxel X NFT, GameFi, Metaverse Partnerships' },
      { id: 2, label: 'New Creator' },
  ];

  return (
    <>
      <div>
        <section className='jumbotron breadcumb no-bg backgroundBannerStyleOther'>
          <div className='mainbreadcumb'>
            <div className='custom-container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center' style={{textShadow:'2px 2px 2px rgba(0,0,0,.5)', fontFamily:'Inter'}}>Edit Profile</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='custom-container' style = {{paddingTop:'0px', paddingBottom:'0px'}}>
          {
            loading ?
              <div>

              </div> :

              <div className="row">

                <div className="col-lg-8 offset-lg-2">
                  <TabContent>

                    <div className={tab !== 'profile' ? 'hide' : ''}>

                      <div className="row">
                        <div className="col-lg-4 col-md-12 col-sm-12">

                          <div className="mb-4" style={{textAlign:'center'}}>
                            <label style={labelFontStyle}>Profile image</label>
                            <div style = {{display:'flex', justifyContent:'center'}}>
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

                          <div className="mb-4"  style={{textAlign:'center'}}>
                            <label style={labelFontStyle}>Profile banner <span style={{fontSize:'13px'}}>{bannerFileWidth && bannerFileHeight && (`(${bannerFileWidth}*${bannerFileHeight} px)`)}</span> </label>
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
                            <label style={labelFontStyle_alram}>Recommended size <br/>1400px * 550px ~ 2000px * 550px </label>
                          </div>
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12">
                        <Formik
                          initialValues={initialValues}
                          validate={validate}
                          onSubmit={submitForm}
                        >
                          {(formik) => {
                            const {
                              values,
                              handleChange,
                              handleSubmit,
                              errors,
                              touched,
                              handleBlur,
                              isValid,
                              dirty
                            } = formik;
                            return (
                              <div className="custom-container">
                                <ProfileForm
                                  layout="vertical"
                                  onFinish={handleUpdateProfile}
                                  form={profileForm}>

                                  <Form.Item
                                    label="Username"
                                    name="username"
                                  >
                                    <Input 
                                      name="password"
                                      id = "username_edit"
                                      value={values.password}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                    />
                                    {errors.password && touched.password && (
                                      <span className="error">{errors.password}</span>
                                    )}
                                  </Form.Item>

                                  <Form.Item
                                    label="Bio"
                                    name="bio">
                                    <Input.TextArea rows={3} onChange={handleBioChaneg}/>
                                  </Form.Item>

                                  <Form.Item
                                    label="Email Address(Not Public)"
                                    name="email"
                                  >
                                    <Input type="email" onChange={handleEmailAddrChange}/>
                                  </Form.Item>

                                  <Form.Item
                                    label="Your site link"
                                    name="link_external">
                                    <Input type="text" onChange={handleSiteChange}/>
                                  </Form.Item>
                                  <Form.Item
                                    label="Twitter username"
                                    name="link_twitter">
                                    <Input type="url" onChange={handleTwitterChange}/>
                                  </Form.Item>

                                  <Form.Item
                                    label="Instagram username"
                                    name="link_instagram">
                                    <Input type="url" onChange={handleInstagramChange}/>
                                  </Form.Item>
                                  
                                  <div className="row align-items-center">
                                    <div className="col-10" style={{ display: 'flex' }}>
                                      <IconContent style ={ colormodesettle.ColorMode==true ? {color:'black'}:{color:'white'}  } className="fa fa-exclamation-triangle fa-exclamation-triangle-white" ></IconContent>
                                      <div>
                                        <b className="NorTxt" style={{fontSize:'18px' ,fontWeight:'500 '}}>View Explicit & Sensitive Content</b>
                                        
                                      </div>
                                    </div>
                                    <div className="col-2" style={{ textAlign: 'right' }}>
                                      <Switch onChange={handleESChange} checked={esChecked} onColor="#f70dff" />
                                    </div>
                                  </div>
                                      <br/>
                                  <div className="row align-items-center">
                                    <div className="col-10" style={{ display: 'flex' }}>
                                      <IconContent style ={ colormodesettle.ColorMode==true ? {color:'black'}:{color:'white'}  } className="fa fa-envelope fa-envelope-white" ></IconContent>
                                      <div>
                                        <b className="NorTxt" style={{fontSize:'18px' ,fontWeight:'500 '}}>Email Notification </b>
                                        
                                      </div>
                                    </div>
                                    <div className="col-2" style={{ textAlign: 'right' }}>
                                      <Switch onChange={handleEmailChange} checked={EmailChecked} onColor="#f70dff" />
                                    </div>
                                  </div>
                                      <br/>
                                  <div id="collection">
                                      <Label htmlFor="collection" id="settingVerify">Verify your profile</Label>
                                      <StyledSelect
                                          id="collection"
                                          placeholder="Select option..."
                                          maxTagCount="responsive"
                                          onChange={handleOptionChange}
                                          defaultValue = {verificationStatu == '1' || verificationResult == true ?
                                              verificationType == '1' ?
                                              "Listed on Voxel X NFT, GameFi, Metaverse Partnerships"
                                              :
                                              "New Creator"
                                            :
                                            "Select option..."
                                          }
                                      >
                                          {
                                              verifyProfileOptions?.map((item) => (
                                                  <Option key={item.id}  value={item.id}  >{item.label}</Option>
                                              ))
                                          }
                                      </StyledSelect>
                                      {
                                        verfiyProfileOptionValue === 1 ?
                                        <VerifyContent>
                                          <Form.Item
                                            label="Your Project"
                                            name="myProject">
                                            <Input onChange={handleProjectChange}/>
                                          </Form.Item>

                                          <Form.Item
                                            label="Telegram username"
                                            name="telegramUsername">
                                            <Input onChange={handleTelegramChange}/>
                                          </Form.Item>
                                          <SendButton htmlType="submit" disabled = {verificationStatu == "1"} >{verificationStatu == "1"?"Pending":"Send"}</SendButton>

                                        </VerifyContent>
                                        : verfiyProfileOptionValue === 2 ? 
                                        <VerifyContent>
                                          <h4 style={{ textAlign: 'center' }}>Do you have a KYC certificate</h4>
                                          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', margin: 20 }}>
                                            <KycAcceptButton onClick={() => setKYCStatus(1)}>Yes</KycAcceptButton> 
                                            <KycNopeButton onClick={() => setKYCStatus(2)}>No</KycNopeButton> 
                                          </div>
                                          {
                                            kycStatus === 1 ?
                                            <UploadFileForKyc verification_pending = {verificationStatu} />
                                            : kycStatus === 2 ?
                                            <Alert
                                                banner
                                                message="Please obtain a KYC certificate from a reputable provider and submit your request"
                                              />
                                            : null
                                          }
                                        </VerifyContent>
                                        : null
                                      }
                                  </div>
                                  {isChanged && <ActionButtonDiv onClick={handleUpdateProfile_1} style={{display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:isChanged? '#F70DFF':'white'}}>Update</ActionButtonDiv>}
                                  {!isChanged && <ActionButton disabled={true}>Update</ActionButton>}

                                </ProfileForm>
                              </div>
                            );
                          }}
                        </Formik>
                          

                        </div>

                      </div>

                    </div>

                    <div className={tab !== 'notification' ? 'hide' : ''}>

                      <Form
                        onFinish={handleUpdateNotification}
                        form={notificationForm}>

                        <NotificationsList>

                          <NotificationItem className="settingTxtColor">
                            <NofitcationLine>
                              <label style={labelFontStyle}>Item Sold</label>
                              <Form.Item
                                name="item_sold"
                                valuePropName="checked">
                                <Switch size="small" onColor="#f70dff" />
                              </Form.Item>
                            </NofitcationLine>
                            When someone purchased your item.
                          </NotificationItem>

                          <NotificationItem className="settingTxtColor">
                            <NofitcationLine>
                              <label style={labelFontStyle}>Auction Expiration</label>
                              <Form.Item
                                name="auction_expiration"
                                valuePropName="checked">
                                <Switch size="small" onColor="#f70dff" />
                              </Form.Item>
                            </NofitcationLine>
                            When an auction you created ends.
                          </NotificationItem>

                          <NotificationItem className="settingTxtColor">
                            <NofitcationLine>
                              <label style={labelFontStyle}>Bid Activity</label>
                              <Form.Item
                                name="bid_activity"
                                valuePropName="checked">
                                <Switch size="small" onColor="#f70dff" />
                              </Form.Item>
                            </NofitcationLine>
                            When someone purhased your item.
                          </NotificationItem>

                          <NotificationItem className="settingTxtColor">
                            <NofitcationLine>
                              <label style={labelFontStyle}>Outbid</label>
                              <Form.Item
                                name="outbid"
                                valuePropName="checked">
                                <Switch size="small" onColor="#f70dff" />
                              </Form.Item>
                            </NofitcationLine>
                            When an offer you placed is exceeded by another user.
                          </NotificationItem>

                          <NotificationItem className="settingTxtColor">
                            <NofitcationLine>
                              <label style={labelFontStyle}>Price Change</label>
                              <Form.Item
                                name="price_changed"
                                valuePropName="checked">
                                <Switch size="small" onColor="#f70dff" />
                              </Form.Item>
                            </NofitcationLine>
                            When an item you made an offer on changes in price.
                          </NotificationItem>

                          <NotificationItem className="settingTxtColor">
                            <NofitcationLine>
                              <label style={labelFontStyle}>Successful Purchase</label>
                              <Form.Item
                                name="purchase"
                                valuePropName="checked">
                                <Switch size="small" onColor="#f70dff" />
                              </Form.Item>
                            </NofitcationLine>
                            When you successfully buy an item.
                          </NotificationItem>

                        </NotificationsList>

                        <div className="mt-4">
                          <ActionButton htmlType="submit">Update</ActionButton>
                        </div>

                      </Form>

                    </div>

                  </TabContent>

                </div>

              </div>
          }

        </section >
      </div >
    </>
  );
}
export default EditProfilePage;