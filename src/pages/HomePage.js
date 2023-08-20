import {React , useEffect } from 'react';
import styled from "styled-components";
import 'react-multi-carousel/lib/styles.css';
import "owl.carousel/dist/assets/owl.carousel.css";

import FeatureBox from '../components/home/FeatureBox';
import AuthorListRedux from '../components/home/AuthorListRedux';
import SliderMainParticle from '../components/home/SliderMainParticle';
import TrendingItemsCarousel from '../components/home/TrendingItemsCarousel';
import LocalButton from '../components/common/Button';
import NewItems from '../components/home/NewItems';
import HotCollections from '../components/home/HotCollections';

const BannerSection = styled.section`
  background-color: ${props => props.theme.primBgColor};
` ;

const IntroSection = styled.section`
  background-color: ${props => props.theme.primBgColor};
`

const TopSellerSection = styled.section`
  background-color: ${props => props.theme.secBgColor};
`

const NewItemsSection = styled.section`
  background-color: ${props => props.theme.primBgColor};
`

const HotCollectionsSection = styled.section`
  background-color: ${props => props.theme.secBgColor};
`

const TrendingItemsSection = styled.section`
  background-color: ${props => props.theme.primBgColor};
`

const SildPad = styled.div`
  background-color: ${props => props.theme.bannerBgColor};
  border-radius: 16px;
`

const TitleText = styled.span`
  font-size: 35px;
  font-weight: 800;
  line-height: 70px;
  font-style: normal;
  text-align: center;
  color: ${props => props.theme.primaryColor};
`

const Container = styled.div`
  background-color: ${props => props.theme.primBgColor};
  padding-top: 120px;
`

const HomePage= ({colormodesettle}) => {

  useEffect(()=>{
    localStorage.setItem('searchValue','') ;
  },[])
  
  return (
    <>
      <Container>
          <BannerSection className='home-banner-container'>
            <SildPad className='v-center'>
                <SliderMainParticle/>
            </SildPad>
          </BannerSection>
        
          <TrendingItemsSection>
            <div className='home-page-container'>
              <div className='text-center'>
                 <TitleText>Trending Items</TitleText>
              </div>
              <div className='col-lg-12'>
                <TrendingItemsCarousel colormodesettle = {colormodesettle} />
              </div>
            </div>
          </TrendingItemsSection>

          <HotCollectionsSection>
            <div className="home-page-container">
              <div className='text-center'>
                <TitleText>Hot Collections</TitleText>
              </div>
              <div className='col-lg-12'>
                <HotCollections />
              </div>
            </div>
          </HotCollectionsSection>        

          <NewItemsSection>
            <div className="home-page-container">
              <div className='text-center'>
                <TitleText>New Items</TitleText>
              </div>
              <div className='col-lg-12'>
                <NewItems />
              </div>
            </div>
          </NewItemsSection>

          <TopSellerSection>
            <div className="main-container">
              <div className='text-center'>
                <TitleText>Top Sellers</TitleText>
              </div>
              <div className='col-lg-12'>
                <AuthorListRedux/>
              </div>
              <div className='col-lg-12' style={{marginTop: '30px', textAlign: 'center'}}>    
                  <LocalButton to="/ranking">
                    View All
                  </LocalButton>
              </div>
            </div>
          </TopSellerSection>

          <IntroSection>
            <div className='main-container'>
              <div className='text-center'>
                <TitleText>Time to NFT with SuperKluster</TitleText>
              </div>
              <FeatureBox />
            </div>
          </IntroSection>
      </Container>
    </>
  );

};
export default HomePage;