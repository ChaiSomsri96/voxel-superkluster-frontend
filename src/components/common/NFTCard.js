/* eslint-disable jsx-a11y/anchor-has-content */
import styled from 'styled-components';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import defaultNFT from "./../../assets/image/default_nft.jpg";

const NFTItem = styled.div`
    margin: 20px 10px;
    max-width: 100%;
    height: auto;
    border: 1px solid ${props => props.theme.cardBorderColor};
    border-radius: 10px;
    transition: transform .4s;

    &:hover {
        transform: scale(1.05);
    }
`

const ImageDiv = styled.div`
    margin: 10px;
    border-radius: 6px;
    overflow: hidden;
`

const ItemInfo = styled.div`
    margin: 20px 20px;
`

const CollectinoName = styled.div`
    font-family: "inter";
    font-size: 14px;
    font-weight: 400;
    font-style: normal;
    color: ${props => props.theme.secondaryColor};
`

const NFTName = styled.div`
    font-family: "inter";
    font-size: 17px;
    font-weight: bold;
    font-style: normal;
    text-align: left;
    color: ${props => props.theme.primaryColor};
`

const SeparateLine = styled.div`
    border-top: 1px solid ${props => props.theme.cardBorderColor};
    width: 100%;
    margin: 10px 0px;
`

const PriceInfo = styled.div`
    display: flex;
    justify-content: space-between;
`

const Title = styled.div`
    font-family: "inter";
    font-size: 15px;
    font-weight: 500;
    font-style: normal;
    text-align: left;
    color: ${props => props.theme.secondaryColor};

`
const Value = styled.div`
    font-family: "inter";
    font-size: 16px;
    font-weight: 400;
    font-style: normal;
    text-align: left;
    color: ${props => props.theme.primaryColor};
`

const SkeletonCard =() => {
    return (
        <>
        </>
    )
}

const NFTCard = ({ nft }) => {
    
    return (
        <div>
            <a href={`/ItemDetail/${nft.assetId}`} style={{height: 'fit-content'}}>
                <NFTItem>
                    <ImageDiv>
                        <LazyLoadImage 
                            effect="opacity"
                            src={nft.image_preview ? (nft.image.slice(-3).toLowerCase() == "gif" ? nft.image:nft.image_preview) : (nft.image ? nft.image : (nft.raw_image? nft.raw_image : (nft.blob_raw_image)? nft.blob_raw_image:defaultNFT))}
                            className="nft-card-img"
                            width='100%'
                        />
                    </ImageDiv>
                    <ItemInfo>
                        <CollectinoName>{nft.collection.name}</CollectinoName>
                        <NFTName>{nft.name}</NFTName>
                        <SeparateLine></SeparateLine>
                        <PriceInfo>
                            <div>
                                <Title>Price</Title>
                                <Value>69.3 ETH</Value>
                            </div>
                            <div>
                                <Title style={{textAlign: 'right'}}>Highest Bid</Title>
                                <Value style={{textAlign: 'right'}}>106.52 ETH</Value>
                            </div>
                        </PriceInfo>
                    </ItemInfo>
                </NFTItem>
            </a>
        </div>
    );   
}

export default NFTCard;