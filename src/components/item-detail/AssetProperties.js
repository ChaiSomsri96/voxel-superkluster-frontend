import React, { memo } from 'react';

import { TraitType, TraitValue, TraitVariable, TraitRarity } from "./../../pages/Create/styled-components";
import { Progress } from 'antd';

const AssetProperties = ({traits}) => {
    const textTraits = traits.filter((trait) => trait.display_type === 'text');
    const numberTraits = traits.filter((trait) => trait.display_type === 'number');    
    const progressTraits = traits.filter((trait) => trait.display_type === 'progress');

    return (
        <div className='asset-properties'>
            {
                textTraits.length > 0 ?
                    <>
                        <div className="flex-align-center">
                            <div className="space-section">
                                <i className="fa fa-barcode"></i>
                            </div>    
                            <TraitType>NFT Properties</TraitType>
                        </div>

                        <div className='nft-properties'>
                            {
                                textTraits.map((trait) => (
                                    <div key={trait.id} className='properties-div'>
                                        <div className="properties-detail">
                                            <TraitVariable>{trait.trait_type}</TraitVariable>
                                            <TraitValue>{trait.value}</TraitValue>
                                            <TraitRarity>{trait.rarity}% has this trait</TraitRarity>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                : null
            }
            
            {
                progressTraits.length > 0 ?
                <>
                    <div className="flex-align-center">
                        <div className="space-section">
                            <i className="fa fa-level-up"></i>
                        </div>    
                        <TraitType>NFT Levels</TraitType>
                    </div>

                    <div className='nft-progress'>
                        {
                            progressTraits.map((trait) => (
                                <div key={trait.id} className='progress-div'>
                                    <div className='flex-center-between' style={{marginBottom: '0px'}}>
                                        <TraitVariable>{trait.trait_type}</TraitVariable>
                                        <TraitValue>{trait.value} of {trait.max_value}</TraitValue>
                                    </div>
                                    <Progress percent={trait.value / trait.max_value * 100} strokeWidth	={12} showInfo={false} strokeColor="#f70dff" />
                                </div>
                            ))
                        }
                    </div>
                </>
                : null
            }
            
            {
                numberTraits.length > 0 ?
                <>
                    <div className="flex-align-center">
                        <div className="space-section">
                            <i className="fa fa-bar-chart"></i>
                        </div>    
                        <TraitType>NFT Statistics</TraitType>
                    </div>

                    <div className='nft-properties'>
                        {
                            numberTraits.map((trait) => (
                                <div key={trait.id} className='properties-div'>
                                    <div className="properties-detail">
                                        <TraitVariable>{trait.trait_type}</TraitVariable>
                                        <TraitValue>{trait.value} out of {trait.max_value}</TraitValue>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </>
                : null
            }
        </div>
    )
}

export default memo(AssetProperties);