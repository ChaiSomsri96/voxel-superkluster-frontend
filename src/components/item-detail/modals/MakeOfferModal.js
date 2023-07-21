import React, { useState, useEffect, memo } from 'react';
import { Modal } from "antd";
import "./../../../assets/stylesheets/ItemDetail/make_offer_modal.scss";

const MakeOfferModal = ({cartPopupOpen, handleCancel}) => {
    return (
        <>
        <Modal
            className='make-offer tool-bar-modal'
            open={cartPopupOpen}
            onCancel={handleCancel}
            footer={null}
            centered={true}
            title="Make offer"
        >
        </Modal>
        </>
    )
}

export default memo(MakeOfferModal);