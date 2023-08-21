import React, { useState, useEffect, memo } from 'react';
import { Modal } from "antd";
import { ActionSpan } from "./collection-detail/styled-components";
import "./../assets/stylesheets/action-checkbox-modal.scss";
import { activityAction } from "./../components/constants/filters";
import SkCheckbox from "./SkCheckbox";

const ActionCheckboxModal = ({cartPopupOpen, handleCancel, colormodesettle, onActionChange}) => {
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
        <Modal
            className="tool-bar-modal action-checkbox-modal"
            open={cartPopupOpen}
            onCancel={handleCancel}
            footer={null}
            centered={true}
            title="Action"
        >
            <div className='action-checkbox-list'>
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
        </Modal>
        </>
    )
}

export default memo(ActionCheckboxModal);