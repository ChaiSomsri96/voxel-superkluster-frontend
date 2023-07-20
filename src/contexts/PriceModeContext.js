import {createContext, useContext, useState} from "react";

const PriceModeContext = createContext({
    priceMode: String,
    ethPrice: String,
    switchPriceMode: () => {}
});

const PriceModeContextProvider = (props) => {

    const [priceMode, setPriceMode] = useState('usd');
    const [ethPrice, setEthPrice] = useState('1300');
    const switchPriceMode = async () => {
        if(priceMode == 'usd') setPriceMode('eth');
        else setPriceMode('usd');
    }
    
    return <PriceModeContext.Provider
                value = {{
                priceMode: priceMode,
                ethPrice: ethPrice,
                switchPriceMode: switchPriceMode
            }}>
            {props.children}
    </PriceModeContext.Provider>
}

function usePriceMode() {
    const context = useContext(PriceModeContext)
    if (context === undefined) {
        throw new Error('Error in price mode context');
    }
    return context
}

export {PriceModeContext, PriceModeContextProvider, usePriceMode}