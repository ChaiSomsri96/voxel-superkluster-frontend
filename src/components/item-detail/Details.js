import React, { memo, useState, useEffect } from 'react';
import { SectionTitle, DetailSection, DetailsText, DescriptionText } from "./styled-components";

import ContractAddressIcon from "./../../assets/svg/item_detail/contract_address.svg";
import TokenIdIcon from "./../../assets/svg/item_detail/token_id.svg";
import TokenStandardIcon from "./../../assets/svg/item_detail/token_standard.svg";
import BlockchainIcon from "./../../assets/svg/item_detail/blockchain.svg";

import { shortenWalletAddress, convertHexToDecimal } from "./../../utils";
import { ItemDetailData } from "./../constants/index";

const Details = ({data}) => {
    const chain_id = data.is_voxel ? data.chain_id : data.collection.chain_id;
    const blockchain = ItemDetailData.blockchain.find(
        (blockchain) => blockchain.chain_id === chain_id
    );

    const contract_address = data.is_voxel?data.contract_address:data.collection.contract_address;

    return (
        <>
            <SectionTitle>Description</SectionTitle>
            <DescriptionText>
                {data.description}
            </DescriptionText>
            <SectionTitle style={{marginTop: '20px'}}>Details</SectionTitle>
            <DetailSection className="details-section">
                <div className='flex-align-center'>
                    <img src={ContractAddressIcon} alt="contract-address-icon" />
                    <DetailsText className="icon-margin">Contract Address</DetailsText>
                    <DetailsText className="detail-label">
                        <a href={`${blockchain.link}${contract_address}`} target='R'>
                        {
                            shortenWalletAddress(contract_address, 3, 5)
                        }
                        </a>
                    </DetailsText>
                </div>

                <div className='flex-align-center'>
                    <img src={TokenIdIcon} alt="token-id-icon" />
                    <DetailsText className="icon-margin">Token ID</DetailsText>
                    <DetailsText className="detail-label">
                        {
                            data.status === "pending" ?
                            convertHexToDecimal(data.token_id, 10)
                            :
                            <a href={`${blockchain.nftLink}${contract_address}/${convertHexToDecimal(data.token_id)}`} target='R'>
                                { convertHexToDecimal(data.token_id, 10) }
                            </a>
                        }
                    </DetailsText>
                </div>

                <div className='flex-align-center'>
                    <img src={TokenStandardIcon} alt="token-standard-icon" />
                    <DetailsText className="icon-margin">Token Standard</DetailsText>
                    <DetailsText className="detail-label">
                        {
                            data.is_voxel && data.is_721 ?
                                ItemDetailData['token_standard'][0] :
                            data.is_voxel && !data.is_721 ?
                                ItemDetailData['token_standard'][1] :
                            !data.is_voxel && data.collection.is_721 ?
                                ItemDetailData['token_standard'][0] :
                                ItemDetailData['token_standard'][1]
                        }
                    </DetailsText>
                </div>

                <div className='flex-align-center'>
                    <img src={BlockchainIcon} alt="blockchain-icon" />
                    <DetailsText className="icon-margin">Blockchain</DetailsText>
                    <DetailsText className="detail-label">
                        {blockchain ? blockchain.label : 'Unknown Blockchain'}
                    </DetailsText>
                </div>
            </DetailSection>
        </>
    );
}

export default memo(Details);