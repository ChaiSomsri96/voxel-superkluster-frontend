import React, { memo, useState ,useEffect} from "react";
import { useNavigate } from "@reach/router";
import { useSelector } from 'react-redux';
import { Button, Input, Spin, Affix, Select } from 'antd';
import styled, { createGlobalStyle } from 'styled-components';

import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

import * as selectors from './../store/selectors';
import { Axios } from "./../core/axios";

import goerliNetworkLogo from "./../assets/image/blockchain/goerli.png";
import ethNetworkLogo from "./../assets/image/blockchain/ethereum.png";  

const GlobalStyles = createGlobalStyle`
`;

const Div = styled.div`
    align-items: center;
    margin: 5px 0px;
`;

const CreateBtn = styled(Button)`
    width: 180px;
    height: 45px;
    color: white;
    background: #f70dff;
    font-size: 16px;
    font-weight: bold;
    border: 1px solid #f70dff;
    border-radius: 8px;
    margin-top: 15px;

    &:hover {
        color: white;
        background: #f70dff;
        border: 1px solid #f70dff;
    }

    &:focus {
        color: white;
        background: #f70dff;
        border: 1px solid #f70dff;
    }
`;

const ImportCollectionPage = function ({colormodesettle}) {
    const navigate = useNavigate();

    const { data } = useSelector(selectors.accessToken);
    const header = { 'Authorization': `Bearer ${data}` }

    const [isTokenAddress, setTokenAddress] = useState(null);
    const [loadState, setLoadState] = useState(false);

    const sendData = async () => {
        if (data) {
            setLoadState(true);
            try {
                const contract_datas = {
                    chain_id: blockchain,
                    contract_address: isTokenAddress
                }

                await Axios.post(`/api/collections/import`, contract_datas, { headers: header })
                    .then((result) => {
                        if (result.data.collection) {
                            navigate(`/collection-detail/${result.data.collection.id}`)
                        }
                    })
                    .catch ((e) => {
                        Swal.fire({
                            title: 'Oops...',
                            text: e.response.data.msg,
                            icon: 'error',
                            confirmButtonText: 'Close',
                            timer: 5000,
                            customClass: 'swal-height'
                        })
                    })
                
                
            } catch (err) {
                console.log(err);
                errorModal()
            }
            setLoadState(false)
        }
    }

    const warningModal = () => {
        Swal.fire({
            title: 'Oops...',
            text: 'Enter your ERC721 or ERC1155 contract address',
            icon: 'error',
            confirmButtonText: 'Close',
        })
    }

    const { Option } = Select;

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

    const [blockchain, setBlockchain] = useState(1);

    const handleBlockchainChange = async (value) => {
        setBlockchain(value);
    }

    const errorModal = () => {
        Swal.fire({
            title: 'Oops...',
            text: 'Something went wrong!',
            icon: 'error',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
          })
    }
    useEffect(()=>{
        localStorage.setItem('searchValue','') ;
    
      },[])
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

                <section className='custom-container'>
                    <Div className="row" style={{ margin: '50px 20px 0px 20px'}}>
                        <h2>Enter your contract address</h2>
                        <Div>
                            <span>What is the address of your ERC721 or ERC1155 contract on the testnet Network?</span>
                        </Div>
                        <Div style={{display:'flex', flexDirection:'row-reverse', justifyContent:'left', flexWrap:window.innerWidth < 600? 'wrap' : 'nowrap'}}>
                            <Select style={{marginTop:'0px !important', marginBottom:'0px !important', maxWidth:'100%', marginLeft:'30px !important'}} value = {blockchain} onChange={handleBlockchainChange}>
                                {
                                    blockchainData?.map((item) => (
                                        <Option key={item.chainId} value={item.chainId}>
                                            <img style={{ width: 25, height: 25, marginRight: 5 }} src={item.logo} alt='blockchain_logo' />
                                            {item.name}
                                        </Option>
                                    ))
                                }
                            </Select>
                            <Input size="large" onChange={e => setTokenAddress(e.target.value)} value={isTokenAddress ?? ""} placeholder="Enter your ERC721 or ERC1155 contract address" style={{marginRight:window.innerWidth < 600? '0px' : '15px', maxWidth:'100%', marginTop:window.innerWidth < 600 ? '10px' : '0px'}} />
                        </Div>
                        <Div>
                            <CreateBtn onClick={isTokenAddress && data ? sendData : warningModal}>Submit</CreateBtn>
                        </Div>
                    </Div>
                </section>
            </div>
        </>
    );
}
export default memo(ImportCollectionPage);