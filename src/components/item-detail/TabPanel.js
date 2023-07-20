import React, { memo, useState, useEffect } from 'react';
import { TabPanelDiv } from "./styled-components";

import Details from "./Details";
import AssetProperties from "./AssetProperties";

const TabPanel = ({itemData}) => {

    const [tabId, setTabId] = useState('overview');

    const clickTabItem = (_tabId) => {
        setTabId(_tabId);
    }

    return (
        <div>
            <TabPanelDiv className="tab-panel-div">
                <button className={tabId === 'overview' ? 'active' : ''} onClick={() => clickTabItem('overview')}>Overview</button>
                {
                    itemData.traits && Array.isArray(itemData.traits) && itemData.traits.length > 0 ?
                    <button className={tabId === 'properties' ? 'active' : ''} onClick={() => clickTabItem('properties')}>Properties</button> :
                    null
                }
            </TabPanelDiv>

            <div className="spacing"></div>

            {
                tabId === 'overview' ?
                <Details data={itemData} />
                :
                (
                    itemData.traits && Array.isArray(itemData.traits) && itemData.traits.length > 0 ?
                    <AssetProperties traits={itemData.traits} />
                    :
                    null
                )
            }
            
        </div>
    )
}

export default memo(TabPanel);