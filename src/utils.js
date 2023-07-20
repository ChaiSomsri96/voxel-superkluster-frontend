import moment from "moment";
import BigNumber from 'bignumber.js';
import { zonedTimeToUtc, format } from  'date-fns-tz' ;

const SECOND_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SECOND_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const MONTH_IN_MS = 30 * DAY_IN_MS;
const YEAR_IN_MS = 12 * MONTH_IN_MS;

export function debounce(func, wait, immediate) {
  let timeout;

  return function debouncedFunction(...args) {
    const context = this;
    
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);

    if (immediate && !timeout) {
      func.apply(context, args);
    }
  };
}

export function isMobile() {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(max-width: 767px)').matches;
  }
  return false;
}

export function isMdScreen() {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(max-width: 1199px)").matches;
  }
  return false;
}

function currentYPosition() {
  if (!window) {
    return;
  }
  // Firefox, Chrome, Opera, Safari
  if (window.pageYOffset) return window.pageYOffset;
  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop)
    return document.documentElement.scrollTop;
  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) return document.body.scrollTop;
  return 0;
}

function elmYPosition(elm) {
  var y = elm.offsetTop;
  var node = elm;
  while (node.offsetParent && node.offsetParent !== document.body) {
    node = node.offsetParent;
    y += node.offsetTop;
  }
  return y;
}

export function scrollTo(scrollableElement, elmID) {
  var elm = document.getElementById(elmID);
  if (!elmID || !elm) {
    return;
  }
  var startY = currentYPosition();
  var stopY = elmYPosition(elm);
  var distance = stopY > startY ? stopY - startY : startY - stopY;
  if (distance < 100) {
    scrollTo(0, stopY);
    return;
  }
  var speed = Math.round(distance / 50);
  if (speed >= 20) speed = 20;
  var step = Math.round(distance / 25);
  var leapY = stopY > startY ? startY + step : startY - step;
  var timer = 0;
  if (stopY > startY) {
    for (var i = startY; i < stopY; i += step) {
      setTimeout(
        (function (leapY) {
          return () => {
            scrollableElement.scrollTo(0, leapY);
          };
        })(leapY),
        timer * speed
      );
      leapY += step;
      if (leapY > stopY) leapY = stopY;
      timer++;
    }
    return;
  }
  for (let i = startY; i > stopY; i -= step) {
    setTimeout(
      (function (leapY) {
        return () => {
          scrollableElement.scrollTo(0, leapY);
        };
      })(leapY),
      timer * speed
    );
    leapY -= step;
    if (leapY < stopY) leapY = stopY;
    timer++;
  }
  return false;
}

export function getTimeDifference(date) {
  if (!date) {
    throw new Error("Invalid date value");
  }

  const difference = moment().diff(moment(date), "milliseconds");

  switch (true) {
    case difference < MINUTE_IN_MS:
      return `${Math.floor(difference / SECOND_IN_MS)} seconds ago`;
    case difference < HOUR_IN_MS:
      return `${Math.floor(difference / MINUTE_IN_MS)} minutes ago`;
    case difference < DAY_IN_MS:
      return `${Math.floor(difference / HOUR_IN_MS)} hours ago`;
    case difference < MONTH_IN_MS:
      return `${Math.floor(difference / DAY_IN_MS)} days ago`;
    case difference < YEAR_IN_MS:
      return `${Math.floor(difference / MONTH_IN_MS)} months ago`;
    default:
      return `${(difference / YEAR_IN_MS).toFixed(1)} years ago`;
  }  
}

export function generateRandomId() {
  let tempId = Math.random().toString();
  let uid = tempId.substr(2, tempId.length - 1);
  return uid;
}

export function getQueryParam(prop) {
  var params = {};
  var search = decodeURIComponent(
    window.location.href.slice(window.location.href.indexOf("?") + 1)
  );
  var definitions = search.split("&");
  definitions.forEach(function (val, key) {
    var parts = val.split("=", 2);
    params[parts[0]] = parts[1];
  });
  return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
  return Object.entries(classes)
    .filter(entry => entry[1])
    .map(entry => entry[0])
    .join(" ");
}

export function shortenAddress(address, chars = 4) {
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`
}


export const formatUsdPrice = (num) => {
  let formattedPrice = '';
  switch (true) {
    case num >= 1000000:
      formattedPrice = parseFloat(num / 1000000).toFixed(2) + 'M';
      break;
    case num >= 1000:
      formattedPrice = parseFloat(num / 1000).toFixed(2) + 'K';
      break;
    default:
      formattedPrice = num.toFixed(0);
      break;
  }
  return formattedPrice;
};

export const formatEthPrice = (price) => {
  let formattedPrice = '';
  switch(true) {
    case price >= 1000000:
      formattedPrice = (price/1000000).toFixed(2) + 'M';
      break;
    case price >= 1000:
      formattedPrice = (price/1000).toFixed(2) + 'K';
      break;
    default:
      formattedPrice = price.toFixed(3);
      break;
  }

  return formattedPrice;
}

export const formatUSD = (amount) => {
  const num = parseFloat(amount);
  const str =
  num >= 1000000
    ? `${(num / 1000000).toFixed(2)}M`
    : num >= 1000
    ? `${(num / 1000).toFixed(2)}K`
    : num.toFixed(2);
  return str;
};

export const isAlpha = (ch) => { // using
  return /^[A-Z]$/i.test(ch) && ch == ch.toLowerCase();  
}

export const isLowerLetter = (ch) => { // using
  return /^[A-Z]$/i.test(ch) && ch == ch.toLowerCase();  
}

export const checkType = (e) => { // using
  let fileType = "";
  for (let i = e.length - 1; i > 0 ; i--) {
    if (e[i] === '.') break;
    fileType += e[i];
  }
  fileType = fileType.split("").reverse().join("");
  return fileType;
}

export const formatMarketplaceNumber = (number) => {
  const suffixes = ["", "K", "M", "B", "T"];
  const precision = 1;

  if (number < 1000) {
    return number.toString();
  }

  const suffixIndex = Math.floor(Math.log10(number) / 3);
  const formattedNumber = (number / Math.pow(1000, suffixIndex)).toFixed(precision);

  return `${formattedNumber}${suffixes[suffixIndex]}`;
}

export const formatCreatedDate = (dateString) => {
  const date = new Date(dateString);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const year = date.getFullYear();
  const month = monthNames[date.getMonth()];

  return `${month} ${year}`;
}

export const directLink=(o_url)=>{
  if(o_url.includes("http") == false ) return "https://" + o_url ;
  return o_url ;
}

export const truncateWalletAddress = (address) => {
  const length = address.length;
  const firstPart = address.slice(0, 10);
  const lastPart = address.slice(length - 4);
  return `${firstPart}...${lastPart}`;
}

export const shortenWalletAddress = (walletAddress, start = 3, end = 4) => {
  const prefix = walletAddress.substring(0, start + 2);
  const suffix = walletAddress.substring(walletAddress.length - end);

  return `${prefix}...${suffix}`;
}

export const shortenOwnerAddress = (address, charsToShow = 4, breakChar = '...') => {
  const front = "0x";
  const startStr = address.substring(2, 2 + charsToShow + 1);
  const endStr = address.substring(address.length - charsToShow);

  return front + startStr + breakChar + endStr;
}

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp * 1000);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = dateFormatter.format(date);
  const formattedTime = timeFormatter.format(date);

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  };

  return date.toLocaleString('en-US', options);
}

export const calculateExpiredTime = (timestamp) => {
  const now = new Date().getTime();
  const difference = timestamp * 1000 - now;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years >= 1) {
    return `about ${years} year${years > 1 ? 's' : ''}`;
  } else if (months >= 1) {
    return `about ${months} month${months > 1 ? 's' : ''}`;
  } else if (days >= 1) {
    return `about ${days} day${days > 1 ? 's' : ''}`;
  } else if (hours >= 1) {
    return `about ${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (minutes >= 1) {
    return `about ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else {
    return `about ${seconds} second${seconds !== 1 ? 's' : ''}`;
  }
}

export const convertHexToDecimal = (hexString, maxLength = 0) => {
  const decimalString = new BigNumber(hexString.slice(2), 16).toFixed();

  if (decimalString.length > maxLength && maxLength > 0) {
    return decimalString.slice(0, maxLength) + '...';
  }

  return decimalString;
}

export const formatUSDPrice = (price) => { // using
  const formattedNum = price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return formattedNum;
}

/*
input: 12400
output: 12,400
*/
export const usdPriceItemDetailPage = (number) => { 
  if (isNaN(number)) {
    return 'Invalid number';
  }

  const roundedNumber = Number(number).toFixed(2);

  const parts = roundedNumber.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedNumber = `${formattedIntegerPart}.${decimalPart}`;

  return formattedNumber;
}

/*
input: timestamp
output: July 29, 2023 at 2:03 AM GMT+7
*/
export function formatSaleEndDate(timestamp) {
  // Convert the timestamp to milliseconds
  var milliseconds = timestamp * 1000;

  // Create a new Date object with the converted milliseconds
  var date = new Date(milliseconds);

  // Adjust the date and time based on the GMT offset
  date.setUTCHours(date.getUTCHours());

  // Format the date and time as desired
  var options = { month: 'long', day: 'numeric', year: 'numeric', hour12: true, hour: 'numeric', minute: 'numeric', timeZoneName: 'short' };
  var formattedDateTime = date.toLocaleString('en-US', options);

  // Return the formatted date and time
  return formattedDateTime;
}

/*
input: 4321.2343
output: 4321.234 ETH
*/
export function formatETHPrice(price) {
  return price.toFixed(3);
}

/*
input:
output:
*/
export function checkBeforeOffer(offerData, account, amount) {
  return offerData.some((offer) => {
    return offer.bidder.address.toLowerCase() === account.toLowerCase() &&
           offer.price === amount;
  });
}