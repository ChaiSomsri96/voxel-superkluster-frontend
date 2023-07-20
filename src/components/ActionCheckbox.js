import React, { memo, useState, useEffect, useRef } from 'react';
import { ActionSection, ActionCaption, ActionSpan } from "./collection-detail/styled-components";

import { activityAction } from "./../components/constants/filters";

import SkCheckbox from "./SkCheckbox";

const ActionCheckbox = ({colormodesettle, onActionChange}) => {
    const [filterAction, setFilterAction] = useState({});
   
    const changeFilterAction = (filterKey) => {
        const updatedFilterAction = {
            ...filterAction,
            [filterKey]: !filterAction[filterKey],
        };
        setFilterAction(updatedFilterAction);
        onActionChange(updatedFilterAction);
    };

    return (
        <>
            <ActionSection id="action-check-box">
                <div className='action-checkbox-list'>
                    <ActionCaption>Action</ActionCaption>
                    {Object.keys(activityAction).map((key) => {
                        const action = activityAction[key];
                        return (
                            <SkCheckbox
                                key={action.id}
                                checked={filterAction[action.filterKey] === true}
                                onChange={() => changeFilterAction(action.filterKey)}
                                className={colormodesettle.ColorMode ? "sk-checkbox-light" : "sk-checkbox-dark"}
                                fill={true}
                                reverse={true}
                            >
                                <div style={{display: 'flex', alignItems: 'center'}}>
                                    <img src={colormodesettle.ColorMode ? action.darkSvg : action.lightSvg} alt={action.alt} />
                                    <ActionSpan>{action.label}</ActionSpan>
                                </div>
                            </SkCheckbox>
                        );
                    })}
                </div>
            </ActionSection>
        </>
    );
}

export default memo(ActionCheckbox);