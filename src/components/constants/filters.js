import Swal from 'sweetalert2' ;

import ethereumSvg from "./../../assets/svg/network/ethereum.svg";
import polygonSvg from "./../../assets/svg/network/polygon.svg"
import arbitrumSvg from "./../../assets/svg/network/arbitrum.svg"
import bscSvg from "./../../assets/svg/network/bsc.svg"
import fantomSvg from "./../../assets/svg/network/fantom.svg"
import avalancheSvg from "./../../assets/svg/network/avalanche.svg"

import salesLightSvg from "./../../assets/svg/filters/sales_light.svg";
import salesDarkSvg from "./../../assets/svg/filters/sales_dark.svg";
import listingsLightSvg from "./../../assets/svg/filters/listings_light.svg";
import listingsDarkSvg from "./../../assets/svg/filters/listings_dark.svg";
import purchaseLightSvg from "./../../assets/svg/filters/purchase_light.svg";
import purchaseDarkSvg from "./../../assets/svg/filters/purchase_dark.svg";
import transferLightSvg from "./../../assets/svg/filters/transfer_light.svg";
import transferDarkSvg from "./../../assets/svg/filters/transfer_dark.svg";
import burnsLightSvg from "./../../assets/svg/filters/burns_light.svg";
import burnsDarkSvg from "./../../assets/svg/filters/burns_dark.svg";
import likesLightSvg from "./../../assets/svg/filters/likes_light.svg";
import likesDarkSvg from "./../../assets/svg/filters/likes_dark.svg";

//
import tbSalesLightSvg from "./../../assets/svg/filters/tb_sales_light.svg";
import tbSalesDarkSvg from "./../../assets/svg/filters/tb_sales_dark.svg";
import tbListingsLightSvg from "./../../assets/svg/filters/tb_listings_light.svg";
import tbListingsDarkSvg from "./../../assets/svg/filters/tb_listings_dark.svg";
import tbPurchaseLightSvg from "./../../assets/svg/filters/tb_purchase_light.svg";
import tbPurchaseDarkSvg from "./../../assets/svg/filters/tb_purchase_dark.svg";
import tbTransferLightSvg from "./../../assets/svg/filters/tb_transfer_light.svg";
import tbTransferDarkSvg from "./../../assets/svg/filters/tb_transfer_dark.svg";
import tbBurnsLightSvg from "./../../assets/svg/filters/tb_burns_light.svg";
import tbBurnsDarkSvg from "./../../assets/svg/filters/tb_burns_dark.svg";
import tbLikesLightSvg from "./../../assets/svg/filters/tb_likes_light.svg";
import tbLikesDarkSvg from "./../../assets/svg/filters/tb_likes_dark.svg";

export const categories = [
    {
        value: 'art',
        label: 'Art',
    },
    {
        value: 'music',
        label: 'Music'
    },
    {
        value: 'domain_names',
        label: 'Domain Names'
    },
    {
        value: 'virtual_world',
        label: 'Virtual World'
    },
    {
        value: 'trading_cards',
        label: 'Trading Cards'
    },
    {
        value: 'collectibles',
        label: 'Collectibles'
    },
    {
        value: 'sports',
        label: 'Sports'
    },
    {
        value: 'utility',
        label: 'Utility'
    }
];

export const status = [
    {
        value: 'on_auction',
        label: 'On Auction'
    },
    {
        value: 'has_offers',
        label: 'Has Offers'
    },
];

export const itemsType = [
    {
        value: 'single_items',
        label: 'Single Items'
    },
    {
        value: 'bundles',
        label: 'Bundles'
    }
];

export const collections = [
    {
        value: 'abstraction',
        label: 'Abstraction'
    },
    {
        value: 'patternlicious',
        label: 'Patternlicious'
    },
    {
        value: 'skecthify',
        label: 'Skecthify'
    },
    {
        value: 'cartoonism',
        label: 'Cartoonism'
    },
    {
        value: 'virtuland',
        label: 'Virtuland'
    },
    {
        value: 'papercut',
        label: 'Papercut'
    }
];

export const filterImageFile = (imageInput) => {
    if (imageInput.file) {
        const file = imageInput.file;
        var pattern = /image-*/;

        if (!file.type.match(pattern)) {
            Swal.fire({
                title: 'File type error',
                text: "Please check the type of the image you are trying to upload.",
                icon: 'warning',
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
              });
            return false;
        }
        return true;
    } else {
        Swal.fire({
            title: 'File type error',
            text: "Please check the type of the image you are trying to upload.",
            icon: 'warning',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
          });
        return false;
    }
};

export const filterCollectionImageFile = (imageInput) => {
    if (imageInput) {
        const file = imageInput;
        var pattern = /image-*/;

        if (!file.type.match(pattern)) {
            Swal.fire({
                title: 'File type error',
                text: "Please check the type of the image you are trying to upload.",
                icon: 'warning',
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
              });
            return false;
        }
        return true;
    } else {
        Swal.fire({
            title: 'File type error',
            text: "Please check the type of the image you are trying to upload.",
            icon: 'warning',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
          });
        return false;
    }
};

export const filterKycFile = (imageInput) => {
    const enableExtensions = ["pdf", "doc", "docx", "jpg", "png", "jpeg", "gif", "bmp", "tif",];
    if (imageInput.file) {
        const fileExtension = imageInput.file.name.split('.').pop();

        if (!enableExtensions.includes(fileExtension)) {
            Swal.fire({
                title: 'File type error',
                text: "Please check the type of the KYC document you are trying to upload.",
                icon: 'warning',
                confirmButtonText: 'Close',
                timer: 5000,
                customClass: 'swal-height'
              });
            return false;
        }
        return true;
    } else {
        Swal.fire({
            title: 'File type error',
            text: "Please check the type of the KYC document you are trying to upload.",
            icon: 'warning',
            confirmButtonText: 'Close',
            timer: 5000,
            customClass: 'swal-height'
          });
        return false;
    }
};

export const orderList = [
    {   
        value: 8, label: "Recently created"
    },
    {
        value: 1, label: "Recently listed"
    },
    {   
        value: 2, label: "Recently sold"
    },
    {
        value: 3, label: "Lowest price"
    },
    {
        value: 4, label: "Highest price"
    },
    {
        value: 5, label: "Most viewed"
    },
    {
        value: 6, label: "Most popular"
    },
    {
        value: 7, label: "Ending soon"
    }
];

export const currencyList = [
    {value: 1, label: 'VXL'},
    {value: 2, label: 'USD'},
    {value: 3, label: 'ETH'}
];

export const chainList = [
    { id: 5, label: 'Ethereum', svg: ethereumSvg, alt: "Ethereum-Svg", key: '1' },
    { id: 137, label: 'Polygon', svg: polygonSvg, alt: "Polygon-Svg", key: '2' },
    { id: 42161, label: 'Arbitrum', svg: arbitrumSvg, alt: "Arbitrum-Svg", key: '3' },
    { id: 56, label: 'Binance Smart Chain', svg: bscSvg, alt: "BSC-Svg", key: '4' },
    { id: 250, label: 'Fantom', svg: fantomSvg, alt: "Fantom-Svg", key: '5' },
    { id: 43114, label: 'Avalanche', svg: avalancheSvg, alt: "Avalanche-Svg", key: '6' }
];

export const statusList = [
    { id: "buy_now",  label: "Buy Now" },
    { id: "on_auction",  label: "On Auction" },
    { id: "has_offers",  label: "Has Offers" }
];

export const activityAction = {
    "Listings": {
        "id": 1,
        "label": "Listings",
        "filterKey": "list",
        "darkSvg": listingsDarkSvg,
        "lightSvg": listingsLightSvg,
        "darkTbSvg": tbListingsDarkSvg,
        "lightTbSvg": tbListingsLightSvg,
        "alt": "Action-Listings-Svg"
    },
    "Sales": {
        "id": 2,
        "label": "Sales",
        "filterKey": "sale",
        "darkSvg": salesDarkSvg,
        "lightSvg": salesLightSvg,
        "darkTbSvg": tbSalesDarkSvg,
        "lightTbSvg": tbSalesLightSvg,
        "alt": "Action-Sales-Svg"
    },
    "Transfer": {
        "id": 3,
        "label": "Transfer",
        "filterKey": "transfer",
        "darkSvg": transferDarkSvg,
        "lightSvg": transferLightSvg,
        "darkTbSvg": tbTransferDarkSvg,
        "lightTbSvg": tbTransferLightSvg,
        "alt": "Action-Transfer-Svg"
    },
    "Bids": {
        "id": 4,
        "label": "Bids",
        "filterKey": "bid",
        "darkSvg": purchaseDarkSvg,
        "lightSvg": purchaseLightSvg,
        "darkTbSvg": tbPurchaseDarkSvg,
        "lightTbSvg": tbPurchaseLightSvg,
        "alt": "Action-Purchase-Svg"
    },
    "Burns": {
        "id": 5,
        "label": "Burns",
        "filterKey": "burn",
        "darkSvg": burnsDarkSvg,
        "lightSvg": burnsLightSvg,
        "darkTbSvg": tbBurnsDarkSvg,
        "lightTbSvg": tbBurnsLightSvg,
        "alt": "Action-Burns-Svg"
    },
    "Mints": {
        "id": 6,
        "label": "Mints",
        "filterKey": "mint",
        "darkSvg": likesDarkSvg,
        "lightSvg": likesLightSvg,
        "darkTbSvg": tbLikesDarkSvg,
        "lightTbSvg": tbLikesLightSvg,
        "alt": "Action-Likes-Svg"
    }
}