import React, { useState, useEffect } from "react";
import { ReactComponent as DarkIcon } from "../assets/svg/moon-new.svg";
import { ReactComponent as LightIcon } from "../assets/svg/sun-new.svg";
import "./../assets/stylesheets/ThemeToggleBtn/index.scss";

const ThemeToggleBtn = (funcs ,colormodesettle) => {
  const [isEnabled, setIsEnabled] = useState(()=>{
    const saved = localStorage.getItem("settleThemeMode") ;
    const initialValue = JSON.parse(saved) ;
    return initialValue;
  });

  useEffect(()=>{
  },[]);
  
  const changeMode = () => {
    setIsEnabled(!isEnabled);
    
    funcs.funcs.setColorModeFunc(!funcs.colormodesettle.ColorMode) ;
    funcs.colormodesettle.ColorMode = ! funcs.colormodesettle.ColorMode ;

    localStorage.setItem("settleThemeMode" , JSON.stringify(!funcs.colormodesettle.ColorMode)) ;
  }
  return (
   <button className = {`theme-toggle-btn ${isEnabled ? "toggle-dark" : "toggle-light"}`}
    onClick={changeMode}
   >
      { isEnabled ? <DarkIcon /> : <LightIcon /> }
   </button>
  );
}

export default ThemeToggleBtn ;