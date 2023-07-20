import React from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { Link } from '@reach/router';
import styled from "styled-components";

import { ReactComponent as FeatureCloudIcon } from "./../../assets/svg/feature_cloud.svg";
import { ReactComponent as FeatureEditIcon } from "./../../assets/svg/feature_edit.svg";
import { ReactComponent as FeatureWalletIcon } from "./../../assets/svg/feature_wallet.svg";

import "./../../assets/stylesheets/Home/featureBox.scss";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const BoxPad = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.IntroBoxColor};
  border: ${props => props.theme.boxBorder};
  border-radius: 16px;

  padding: 40px 50px;

  position: relative;
  overflow: hidden;

  top: 0;
  transition: top 0.2s ease-in-out;
  
  &:hover {
    top: -5px;
    background: ${props => props.theme.featureBoxHoverBKColor};
    svg, i {
      transform: rotateY(360deg);
      -webkit-transition: all .6s;
    }
  }
`
const Title = styled.div`
  font-size: 24px;
  font-weight: 800;
  line-height: 32px;
  color: ${props => props.theme.primaryColor};
`
const Text = styled.span`
  font-size: 15px;
  line-height: 25px;
  font-weight: 400;
  color: ${props => props.theme.primaryColor};
`

const BoxBgIcon = styled.i`
  position: absolute;
  font-size: 520px !important;
  color: ${props => props.theme.boxBgIconColor} !important;
  left: 40%;
  top: 12%;
  opacity: 0.1;
`

const FeatureBox= function()  {
  return (
    <div className='feature-box'>
      <div className='feature-box-pad'>
        <Link to="/wallet">
          <BoxPad>
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>  
              <FeatureWalletIcon />
            </Reveal>
            <div className='content-row'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                <Title>Set up your wallet</Title>
              </Reveal>
            </div>
            <div className='content-row'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce style={{wordBreak:'keep-all'}}>
                <Text>Before you can create, buy and sell NFTs you will need to set up a crypto wallet. The top right sign in button will provide you with a list of compatible wallets that you can connect too.</Text>
              </Reveal>
            </div>
            <BoxBgIcon className="icon-wallet"></BoxBgIcon>
          </BoxPad>
        </Link>
      </div>

      <div>
        <Link to="/create">  
          <BoxPad> 
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>  
              <FeatureCloudIcon />
            </Reveal>
            <div className='content-row'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                <Title>Add your NFTs</Title>
              </Reveal>
            </div>
            <div className='content-row'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce style={{wordBreak:'keep-all'}}>
                <Text>Upload your file, complete description details, customize your NFT, choose your preferred Blockchain and click create to share your NFT with the world!</Text>
              </Reveal>
            </div>
            <BoxBgIcon className="icon_cloud-upload_alt"></BoxBgIcon>
          </BoxPad>
        </Link>
      </div>

      <div>
        <Link to="/collection">
          <BoxPad>
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce>  
              <FeatureEditIcon />
            </Reveal>
            <div className='content-row'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={100} duration={600} triggerOnce>
                <Title>Sell your NFTs</Title>
              </Reveal>
            </div>
            <div className='content-row'>
              <Reveal className='onStep' keyframes={fadeInUp} delay={200} duration={600} triggerOnce style={{wordBreak:'keep-all'}}>
                <Text>Select your NFT, choose the type of auction and share your NFT with potential buyers from all around the world!</Text>
              </Reveal>
            </div>
            <BoxBgIcon className="icon_tags_alt"></BoxBgIcon>
          </BoxPad>
        </Link>
      </div>
  </div>
  )
}
export default FeatureBox;