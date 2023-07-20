const Banner = ({ isAuthorInfo }) => (
  <section className='jumbotron breadcumb no-bg backgroundBannerStyleOther' style={isAuthorInfo.banner ? { backgroundImage: `url(${isAuthorInfo.banner})` } : {}}>
    <div className='mainbreadcumb'>
      <div className='custom-container'>
        <div className='row m-10-hor'>
          <div className='col-12'></div>
        </div>
      </div>
    </div>
  </section>
);

export default Banner;