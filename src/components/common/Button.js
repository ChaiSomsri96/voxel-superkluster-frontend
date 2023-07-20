import React, { useState, useEffect } from "react";
import { navigate, useLocation } from "@reach/router";
import "./../../assets/stylesheets/LocalButton/index.scss";

const Button = (props) => {
    const text = props.children;
    return (
        <button 
            className={`local-button-btn ${props.className ? props.className : '' }`} 
            onClick={props.onClick}
            disabled={props.disabled}
        >
            <span>{text}</span>
        </button>
    );
};

const LocalButton = (props) => {
    const { pathname } = useLocation();

    const handleClick = () => {
        if (props.to && props.to !== pathname) {
            navigate(props.to);
        } else if (props.onClick) {
            props.onClick();
        }
    };

    return <Button {...props} onClick={handleClick} />;
};

export default LocalButton;