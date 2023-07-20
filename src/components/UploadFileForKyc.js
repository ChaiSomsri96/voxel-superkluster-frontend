import { useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { Upload, Button, message, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Axios } from "./../core/axios";
import * as selectors from './../store/selectors';
import { filterKycFile } from './../components/constants/filters';

import Swal from 'sweetalert2' ;
import 'sweetalert2/src/sweetalert2.scss' ;


const UploadFileForKyc = (verification_pending) => {
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const accessTokenState = useSelector(selectors.accessToken);
    const accessToken = accessTokenState.data ? accessTokenState.data : null;

    var validKycType = false;

    const handleKycFile = (info) => {
      if (filterKycFile(info)) {
        validKycType = true;
      } else {
        validKycType = false;
      }
    }

    const handleUpload = () => {
      if (validKycType) {
          const formData = new FormData();
          fileList.forEach(file => {
            formData.append('kyc', file);
          });
          formData.append('verify_type' , '2') ;
          setUploading(true)
        
          Axios.post(`/api/users/verify-request` , formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              
            }
          }).then(resp => {
            setFileList([])
            message.success('Upload Successfully.');
            Swal.fire({
              title: 'It worked!',
              text: 'Profile Verification Successfully!',
              icon: 'success',
              confirmButtonText: 'Close',
              timer: 5000,
              customClass: 'swal-height'
            })
          }).catch(err => {
              message.error('upload failed.');
            
          })
          .finally(() => {
            setUploading(false)
          });
        } else {
          Swal.fire({
              title: 'File type error',
              text: "Please check the type of the KYC document you are trying to upload.",
              icon: 'warning',
              confirmButtonText: 'Close',
              timer: 5000,
              customClass: 'swal-height'
            });
          return;
        }
      };

      const props = {
        onRemove: file => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: file => {
          setFileList([fileList, file])
        }
      };

      return (
          <>
            <h6 style={{ textAlign: 'center', color: 'rgb(135 135 135 / 85%)'}}>Please attach your KYC certificate</h6>
            <div style={{ display: 'flex', flexWrap:'wrap' , justifyContent: 'center', alignItems: 'center'}}>
                <Upload {...props} onChange={handleKycFile}  className="uploadingFile selectFileUploading"  maxCount={1}  accept=".pdf, .doc, .docx, .jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*">
                    <Button className='select-file' icon={<UploadOutlined />}>Select File</Button>
                </Upload>
                <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0 || verification_pending.verification_pending == '1'}
                    loading={uploading}
                >
                {
                  verification_pending.verification_pending == '1' ? 'Pending'
                  :
                  uploading ? 'Uploading' : 'Start Upload'
                }
                
                </Button>
            </div>
            <Alert
                style={{ marginTop: 20 }}
                banner
                type="info"
                message="By uploading this document, you have provided permission for SuperKluster Admin to verify your KYC documentation. Approx wait time is 24-72 hours case by case basis. If approved, you will receive an automatic pink tick verified mark, if not approved, you will receive email on the outcome of your request"
            /> 
          </>
        
      )
}

export default memo(UploadFileForKyc)