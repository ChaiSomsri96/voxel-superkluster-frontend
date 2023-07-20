import styled from "styled-components";
import TrendingItemsCarousel from '../components/home/TrendingItemsCarousel';

const Container = styled.div`
  padding-top: 100px;
  background-color: ${props => props.theme.primBgColor};
`
const TrendingItemsSection = styled.section`
  background-color: ${props => props.theme.primBgColor};
  
`
const TitleText = styled.span`
  font-size: 35px;
  font-weight: 800;
  line-height: 70px;
  font-style: normal;
  text-align: center;
  color: ${props => props.theme.primaryColor};
`
const HomePage= ({colormodesettle}) => {
  return (
    <Container>
      <div className='main-container'>
          <div className='col-lg-12'>
            <TrendingItemsCarousel colormodesettle = {colormodesettle} />
          </div> 
      </div>
    </Container>
  );
};
export default HomePage;