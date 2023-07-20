import React, { memo } from 'react';
import { SubText, FaRegClockIcon } from "./styled-components";

const NoData = () => {
    return (
        <>
        <div style={{height:'150px'}} className='flex-align-center-row-center'>
            <div className='flex-column-center'>
                <FaRegClockIcon size={30} />
                <SubText style={{marginTop: '15px'}}>
                    No Data
                </SubText>
            </div>
        </div>
        </>
    )
}

export default memo(NoData);