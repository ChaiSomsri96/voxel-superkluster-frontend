import styled from 'styled-components';
import { Upload, Button } from "antd";

export const Container = styled.div`
  background-color: ${props => props.theme.primBgColor};
  padding-top: 136px;
  padding-bottom: 100px;
`;

export const FormEditProfileSection = styled.div`
    margin: 0px auto;
    max-width: 1170px;
    background: ${props => props.theme.bannerSlideIconColor};
    box-shadow: 0px 0px 50px #0000001A;
    border-radius: 6px;
    padding: 50px 116px;
    
    @media (max-width: 992px) {
      padding-left: 35px;
      padding-right: 35px;
    }

    @media (max-width: 768px) {
      padding-left: 20px;
      padding-right: 20px;
    }  
`;

export const Caption = styled.div`
  color: ${props => props.theme.primaryColor};
  font-size: 48px;
  line-height: 48px;
  font-weight: 800;
  margin-bottom: 40px;

  text-align: center;
`;

export const AvatarUpload = styled(Upload)`
  & .ant-upload.ant-upload-select-picture-card {
    width: 150px;
    height: 150px;
    border-radius: 50%;

    margin-right: 0px;
    margin-bottom: 0px;

    box-shadow: 0px 6px 20px #00000029;
    border: ${props => props.theme.collectionAvatarBorder};
  }
`;

export const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-position: center top;
    object-fit: cover;
`;

export const BannerUpload = styled(Upload)`
    & .ant-upload.ant-upload-select-picture-card {
        border-radius: 16px;
        width: 100%;
        height: 250px;

        margin-right: 0px;
        margin-bottom: 0px;

        border: none;
    }
`;

export const BannerImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 16px;
    object-position: center top;
    object-fit: cover;
`

export const SubCaption = styled.div`
  color: ${props => props.theme.primaryColor};
  font-size: 16px;
  line-height: 16px;
  font-weight: 800;
`;

export const VerifyContent = styled.div`
  border: 1px solid #f70dff;
  border-radius: 6px;
  padding: 20px;

  margin-top: 20px;
`

export const KycAcceptButton = styled.button`
  width: 60px;
  height: 30px;
  color: white;
  
  background: #f60cfe;
  border: none;
  outline: 0;
  
  border-radius: 6px;
  font-size: 14px;
  
  box-shadow: 2px 2px 20px 0px rgba(131, 100, 226, 0);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 2px 2px 20px 0px rgba(131, 100, 226, 0.5);
    transition: all 0.3s ease;
  }
`;

export const KycNopeButton = styled.button`
  width: 60px;  
  height: 30px;

  background: ${props => props.theme.primaryColor};
  color: ${props => props.theme.editProfileBtnColor};
  border: none;
  outline: 0;

  border-radius: 6px;
  font-size: 14px;

  box-shadow: 2px 2px 20px 0px rgba(131, 100, 226, 0);
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 2px 2px 20px 0px rgba(131, 100, 226, 0.5);
    transition: all 0.3s ease;
  }
`;