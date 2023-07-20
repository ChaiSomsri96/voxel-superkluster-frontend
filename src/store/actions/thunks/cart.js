import { Axios, Canceler } from "../../../core/axios";
import * as actions from "../../actions";

export const fetchCartInfo = (accessToken) => async (dispatch) => {
    dispatch(actions.getCartInfo.request(Canceler.cancel));

    try {
        const { data } = await Axios.post(`/api/cart/my-cart`, {}, { headers: {'Authorization': `Bearer ${accessToken}`} });
        dispatch(actions.getCartInfo.success(data));

    } catch (err) {
        dispatch(actions.getCartInfo.failure(err));
    }
}