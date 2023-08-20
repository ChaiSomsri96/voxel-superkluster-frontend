import React, { useState, useEffect } from 'react';
import Reveal from 'react-awesome-reveal';
import { keyframes } from "@emotion/react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styled, { createGlobalStyle } from 'styled-components';
import { Carousel } from 'antd';
import LocalButton from "./../common/Button";

import { Axios } from "./../../core/axios";
import "./../../assets/stylesheets/Home/sliderMainParticle.scss";

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
const inline = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
  .d-inline{
    display: inline-block;
   }
`;

const GlobalStyles = createGlobalStyle`
    . {
      padding: 26px;
    }
    /*
   .hero-image {
      max-height: 550px!important;
      transform: translate3d(0, 0, 0) perspective(300px) rotateY(-10deg) scale(.95)!important;
      animation: backgrounda 2s ease-in-out infinite alternate!important;
      -webkit-box-shadow: 2px 2px 30px 0px rgba(20, 20, 20, 0.1)!important;
      -moz-box-shadow: 2px 2px 30px 0px rgba(20, 20, 20, 0.1)!important;
      box-shadow: 2px 2px 30px 0px rgba(20, 20, 20, 0.1)!important;
      transition: all .6s;
      -webkit-transition: all .6s;
      animation: animate 1s linear infinite;
      perspective: 800px;
      margin: 1px;
   }
   .hero-image:hover {
      transform: translate3d(0, 0, 0) perspective(300px) rotateY(0deg) scale(1.05) !important;
   }*/

  .bannerstyle .superKluster_Slide .slick-arrow {
      margin-top: 0px;
      top: calc(50% - 25px);

      z-index: 1;
      width: 50px;
      height: 50px;
      line-height: 100%;
      border-radius: 3px;
      filter: drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.16));
      position: absolute;
      
      font-weight: 700;
      text-align: center;

      transition: all .6s;
      -webkit-transition: all .6s;

      color: #ffffff00;

      &:before {
        font-size: 1rem;
        font-family: 'FontAwesome'!important;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }

      &:hover {
        background: #f60cfe;
      }
  }
`;

const BigHeader = styled.div`
  color: ${props => props.theme.primaryColor};
  font-size: 55px;
  font-weight: 800;
  letter-spacing: 0px;
  line-height: 70px;

  @media(max-width: 1700px) {
    font-size: 45px;
    line-height: 60px;
  }

  @media(max-width: 1700px) {
    font-size: 45px;
    line-height: 60px;
  }

  @media(max-width: 1580px) {
    font-size: 38px;
    line-height: 50px;
  }

  @media(max-width: 1380px) {
    font-size: 30px;
    line-height: 40px;
  }

  @media(max-width: 1110px) {
    font-size: 25px;
    line-height: 32px;
  }
`;

const BannerDescription = styled.div`
  color: ${props => props.theme.bannerDescription};
  font-size: 18px;
  line-height: 23px;
  font-weight: 500;
  letter-spacing: 0px;

  padding-top: 18px;
  padding-bottom: 30px;

  @media(max-width: 1700px) {
    font-size: 15px;
    line-height: 20px;
  }
`; 

const Slidermainparticle= () => {
  const [isSliderEffect, setSliderEffect] = useState(false);
  const [arrowState, setArrowState] = useState(false);
  const [bannerData , setBannerData] = useState() ;
  const accessToken = localStorage.getItem('accessToken');
  const header = { 'Authorization': `Bearer ${accessToken}` };

  
  const get_banner = async() =>{
    const postData = {};
    await Axios.post("/api/assets/get-banners", postData, { headers: header })
      .then((res) => {
        setBannerData(res.data.data);
      })
      .catch((err) => { 
      });
  }

  useEffect(() => {
    get_banner() ;
    
    if (window.innerWidth > 768) {
      setSliderEffect(true)
    }
    else if (window.innerWidth < 600) {
      setArrowState(true)
    }
    else {
      setArrowState(false);
      setSliderEffect(false)
    }
  }, [])

  const confirmUrlLink=(url)=>{
    return url.includes('http')  ;
  }

  return (
    <>
      <div className="bannerstyle" style={{width:'100%'}}>
        <GlobalStyles />
        <Carousel className="superKluster_Slide" autoplay arrows={arrowState ? false : true} dotPosition="bottom" dots={false} autoplaySpeed={5000} focusOnSelect={true}>
          {
            bannerData && bannerData.length > 0 ?
              bannerData.map((banner, index) => (
                <div key={index}>
                  <div className="banner-content">
                    <div className='slidermainLeft1' style ={{marginBottom:'12px'}}>
                      <div className="mainStyleSlider">
                        <div className="spacer-single"></div>
                        <h6><span className="text-uppercase color" style={{letterSpacing: '-1px', fontWeight: '900'}}>{banner.small_header}</span></h6>
                        <Reveal className='onStep' keyframes={fadeInUp} delay={!isSliderEffect ? 0 : 300} duration={!isSliderEffect ? 0 : 900} triggerOnce>
                          {
                          <BigHeader>
                            {banner.big_header}
                          </BigHeader>
                          }

                        </Reveal>
                        <Reveal className='onStep' keyframes={fadeInUp} delay={!isSliderEffect ? 0 : 600} duration={!isSliderEffect ? 0 : 900} triggerOnce>
                          {
                            <BannerDescription>
                              {banner.description}
                            </BannerDescription>
                          }
                          
                        </Reveal>
                        <div className="spacer-10"></div>
                        <Reveal className='onStep d-inline' keyframes={inline} delay={!isSliderEffect ? 0 : 800} duration={!isSliderEffect ? 0 : 900} triggerOnce>
                          {
                              (banner && banner.redirect_link !='' && confirmUrlLink(banner.redirect_link)) ?

                              <LocalButton  onClick={()=> window.open(banner.redirect_link, "_blank")}>
                                  {banner.button_text}
                              </LocalButton> :
                              <LocalButton  to={banner.redirect_link} onClick={()=> window.open("#", "_self")}>
                                  {banner.button_text}
                              </LocalButton>
                          }
                        </Reveal>
                      </div>
                    </div>

                    <div className='slidermainRight1'>
                      <div className='banner-img'>
                        <a href={banner.website_link} target="_blank">
                            <LazyLoadImage 
                              src={banner.banner} 
                              className={` ${banner.class_name} ` ?   `${banner.class_name}` : ""}  
                              data-wow-delay="1.25s" alt="" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              :
              <></>
          }
        </Carousel>
      </div>
    </>
  );
}

export default Slidermainparticle;