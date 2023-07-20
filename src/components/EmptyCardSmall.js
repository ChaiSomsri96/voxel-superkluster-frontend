import React, { memo, Fragment } from "react";
import styled from "styled-components";

import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-loading-skeleton/dist/skeleton.css'

const NFTCard = styled.div`
  padding: 0!important;
  margin-right: 5px;
  margin-left: 5px;
  border-radius: 15px;
  overflow: hidden;
  transition: all ease 400ms;

  @media (min-width: 1200px) {
    width: calc(20% - 20px);

    .nft__item .nft__item_wrap {
      // height: 180px;
    }
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    width: calc(25% - 20px);

    .nft__item .nft__item_wrap {
      // height: 160px;
    }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    width: calc(33.3333% - 20px);

    .nft__item .nft__item_wrap {
      // height: 170px;
    }
  }

  @media (min-width: 360px) and (max-width: 767px) {
    width: calc(50% - 15px);
    margin-right: 0!important;
    .nft__item .nft__item_wrap {
      // height: 190px;
    }
  }

  @media (min-width: 375px) and (max-width: 479px) {
    width: calc(50% - 15px);
    margin-right: 0!important;

    .nft__item .nft__item_wrap {
      // height: 150px;
    }
  }

  @media (max-width: 374px) {
    width: calc(100% - 20px);
    margin-right: auto!important;

    .nft__item .nft__item_wrap {
      // height: 200px;
    }
  }
`;

const EmptyCardSmall = () => {

  return (
    <Fragment>
        <NFTCard style={{maxWidth:'220px', flex:'1 1 auto', width:'140px'}}/>       
    </Fragment>
  );
};

export default memo(EmptyCardSmall);
