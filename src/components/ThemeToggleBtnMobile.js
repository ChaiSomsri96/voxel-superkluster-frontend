import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux' ;


const ThemeToggleBtnMobile = (funcs ,colormodesettle) => {
  const [isEnabled, setIsEnabled] = useState(()=>{
    const saved = localStorage.getItem("settleThemeMode") ;
    const initialValue = JSON.parse(saved) ;
    return initialValue  ;
    // return saved ;
  }) ;
  useEffect(()=>{
    // console.log('togglebutton mode' ,isEnabled) ;
  },[]) ;
  const dispatch = useDispatch();
  const toggleState = () => {
    setIsEnabled(!isEnabled);
    // console.log(fucns,'colormode') ;
    // console.log(isEnabled , 'colormode') ;
    // 
    const ts = colormodesettle.ColorMode ;
    // console.log('this is fals' ,funcs.colormodesettle ,'dsfs', funcs.colormodesettle.ColorMode) ;
    funcs.funcs.setColorModeFunc(!funcs.colormodesettle.ColorMode) ;
    funcs.colormodesettle.ColorMode = ! funcs.colormodesettle.ColorMode ;

    localStorage.setItem("settleThemeMode" , JSON.stringify(!funcs.colormodesettle.ColorMode)) ;
    // localStorage.setItem("settleThemeMode" , true) ;
  };
  const isChanging=()=>{
    // console.log('');
    // setIsEnabled(!isEnabled);
  }

  return (
   <>
    <input type="checkbox" id="toggle_checkbox" />

    <label className="newToggle" for="toggle_checkbox">
      <div id="star">
        <div class="star" id="star-1">★</div>
        <div class="star" id="star-2">★</div>
      </div>
      <div id="moon"></div>
    </label>
   </>
  );
}

export default ThemeToggleBtnMobile ;