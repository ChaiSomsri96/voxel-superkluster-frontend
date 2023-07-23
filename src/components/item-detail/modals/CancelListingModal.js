import React, { useState, useEffect, memo } from 'react';
import { Modal } from "antd";
import { ModalBtn, ModalCancelBtn, ModalLabel, NoticeMsg } from "./../styled-components";
import { useNavigate } from "@reach/router";
import { Axios } from './../../../core/axios';
import * as actions from "./../../../store/actions/thunks";
import Swal from 'sweetalert2';
import { useDispatch } from "react-redux";

const CancelListingModal = ({cartPopupOpen, handleCancel, nftId}) => {
    const dispatch = useDispatch();

    const account = localStorage.getItem('account');
    const accessToken = localStorage.getItem('accessToken');
    const header = { 'Authorization': `Bearer ${accessToken}` };
    
    const navigate = useNavigate();

    const handleCancelListing = async () => {
        if(!(account && accessToken)) {
            navigate(`/wallet`);
            return;
        }

        try {
            const postData = {
                id: nftId
            };

            const res = await Axios.post("/api/assets/cancel-list", postData, { headers: header });

            Swal.fire({
                title: 'It worked!',
                text: `${res.data.msg}`,
                icon: 'success',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
            });

            dispatch(actions.fetchNftDetailInfo(accessToken, header, nftId));
        }
        catch(err) {
            Swal.fire({
                title: 'Oops...',
                text: err.response.data.msg,
                icon: 'error',
                confirmButtonText: 'Close',
                timer:5000,
                customClass: 'swal-height'
            });
        }
    }
    
    return (
        <>
        <Modal
            className='cancel-listing tool-bar-modal'
            open={cartPopupOpen}
            onCancel={handleCancel}
            footer={null}
            centered={true}
            title="Cancel listing"
        >
            <ModalLabel>
                Are you sure you want to cancel your listing?
            </ModalLabel>
            <NoticeMsg>
                Canceling your listing will unpublish this sale from SuperKluster and requires a transaction to make sure it will never be fulfillable.
            </NoticeMsg>
            <div style={{textAlign: 'center', marginTop: '45px'}}>
                <ModalCancelBtn onClick={() => handleCancel()}>Never mind</ModalCancelBtn>
                <ModalBtn onClick={() => handleCancelListing()}>Cancel listing</ModalBtn>
            </div>
        </Modal>
        </>
    );
}

export default memo(CancelListingModal);