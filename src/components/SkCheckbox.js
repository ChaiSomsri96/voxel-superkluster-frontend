import React from "react";
import "./../assets/stylesheets/checkbox.scss";
import { Checkbox } from 'antd';

function SkCheckbox({ checked, onChange, className, children, fill, reverse, modal }) {
    return (
      <div className={`${fill ? 'checkbox-not-inline' : 'not-fill-space'}`}>
        <label className={`${modal ? 'checkbox-not-inline' : 'checkbox-inline'} ${fill ? 'fill-space' : ''} ${reverse ? 'fill-reverse' : ''}`}>
          <Checkbox
            className={className}
            onChange={onChange}
            checked={checked}
          />
          {children}
        </label>
      </div>
    );
  }
  
  export default SkCheckbox;