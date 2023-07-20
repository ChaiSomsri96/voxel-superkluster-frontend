// import * as OV from 'online-3d-viewer';
import * as Init3DViewerFromFileList from 'online-3d-viewer';
import React, {  useState, useEffect,useRef } from 'react';

const ThreeDOnline=({animation,colormodesettle})=>{

    const ref = useRef(null);

    useEffect(() => {
        // console.log(animation.animation ,colormodesettle , 'animation.animation') ;
        let tmp =[] ;
        if (animation != null) {
            tmp.push(animation && animation.animation) ;
            if(animation.isMTLForm != null ) tmp.push(animation.isMTLForm) ;
            if(animation.textures.length>0) {
                animation.textures.map((texture , inx)=>(
                    tmp.push(texture.isTextureForm) 
                ))
            }
        }
        // console.log(colormodesettle , 'ttttmmmmpppp')
        if (animation != null) {
            let posi = Init3DViewerFromFileList(ref.current, tmp, {
                environmentSettings : {
                    environmentMap : [
                        './image/3d_env_images/posx.jpg',
                        './image/3d_env_images/negx.jpg',
                        './image/3d_env_images/posy.jpg',
                        './image/3d_env_images/negy.jpg',
                        './image/3d_env_images/posz.jpg',
                        './image/3d_env_images/negz.jpg'
                    ],
                    backgroundIsEnvMap : false
                }
            }) ;
            !colormodesettle.ColorMode && posi.viewer.renderer.setClearColor("#212428", 0) ;
        } 
    }, [animation]);

    return  (
        <>
            {
                animation != null && (
                    <div 
                        className="online_3d_viewer"
                        ref={ref}
                        style={{width:'100%' , height:'70vh'}}
                    >
                    </div>
                )
            }
        </>
        
    ) 
}

export default ThreeDOnline ;