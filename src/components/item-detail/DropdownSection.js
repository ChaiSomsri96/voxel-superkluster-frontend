import React, { memo, useState, useEffect } from 'react';
import { DetailSection, DetailSectionContent, FiChevronUpIcon } from "./styled-components";

const DropdownSection = ({header, expand, children}) => {
    const [isView, setIsView] = useState(expand ? true : false);

    const handleViewClick = () => {
        setIsView(!isView)
    }

    return (
        <DetailSection className="dropdown-section">
            <div className="flex-align-center detail-section-header" onClick={() => handleViewClick()}>   
                {
                    header
                }
                <div style={{flexGrow: 1, textAlign: 'right'}}>
                    <FiChevronUpIcon
                    className={!isView ? 'rotate-up' : 'rotate-down'} />
                </div>
            </div>
            {
                isView ?
                <DetailSectionContent>
                    {children}
                </DetailSectionContent>
                : null
            }
        </DetailSection>
    );
}

export default memo(DropdownSection);