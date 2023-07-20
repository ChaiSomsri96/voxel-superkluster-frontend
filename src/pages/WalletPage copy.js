import React, { useEffect } from "react";
import Wallet from "./../components/wallet";
import { createGlobalStyle } from "styled-components";
import walletBanner from "./../assets/image/background/wallet.jpg";

const GlobalStyles = createGlobalStyle`
`;

const WalletPage = ({colormodesettle}) => {

  const walletBannerPath = `url(${walletBanner})`;

  useEffect(()=>{
    localStorage.setItem('searchValue','') ;

  },[])
  return (
    <>
      <div>
        <GlobalStyles />
        <section
          className="jumbotron breadcumb no-bg"
          style={{ backgroundImage: walletBannerPath }}
        >
          <div className="mainbreadcumb">
            <div className="custom-container">
              <div className="row m-10-hor">
                <div className="col-12">
                  <h1 className="text-center">Wallet</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="custom-container">
          <Wallet />
        </section>
      </div>
    </>
  )

}

export default WalletPage;
