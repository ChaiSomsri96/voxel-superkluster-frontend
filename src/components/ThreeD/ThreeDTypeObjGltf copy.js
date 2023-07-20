import {OBJModel,GLTFModel} from 'react-3d-viewer'
import React, { Suspense , useEffect, Fragment ,useState} from "react";
import ReactThreeFbxViewer from 'react-three-fbx-for-pyt';
import { Canvas ,useThree} from 'react-three-fiber';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls" ;
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
       () => {
          const controls = new OrbitControls(camera, gl.domElement);
          controls.minDistance = 100;
          controls.maxDistance = 250;
          return () => {
            controls.dispose();
          };
       },
       [camera, gl]
    );
    return null;
 };


const ThreeDTypeObjGltf1 = ( animation ) => {
    let cameraPosition = {
        x:150,
        y:300,
        z:350
    }
    const [type , setType] = useState('') ;
    const [modelType, setModelType] = useState('');
    const [modelUrl, setModelUrl] = useState(null);
    const [mtlUrl, setMtlUrl] = useState('');
    const [positionX, setPositionX] = useState(0);
    const [positionY, setPositionY] = useState(0);
    const [positionZ, setPositionZ] = useState(0);

    useEffect(()=>{
        let str = animation.animation.animation ;
        let s = '' ;
        let temp = [] ;
        for(let i = str.length - 1 ; i >= 0 ; i -- ) {
            if(str[i]=='.') break ;
            temp.push(str[i]) ;
        }
        for(let i = temp.length -1    ; i >= 0 ; i -- ){
            s += temp[i] ;
        }
        // console.log(s , animation.animation.animation , 'animationtype') ;
        setType(s) ;
    },[])     ;
    
    useEffect(()=>{
        setPositionX(0 * 70);
        setPositionY(-0.638 * 70);
        setPositionZ(0.025 * 70);
    },[]);



    return (
        <div>
            {
            type == "obj" || type == "gltf" || type == 'glb'
            ?
            (
                <>
                    { type == "obj" ?
                        (
                            
                            <OBJModel 
                                // position={{x:0,y:-1,z:0}}
                                // rotation={{x:0,y:RotatY,z:0}}
                                // width="400" height="400"  
                                scale={{x:.2,y:.2,z:.2}}
                                
                                src={animation.animation.animation} texPath=""
                            />
                            // <babylon model={animation.animation.animation}  ></babylon>
                        )
                        :
                        (
                            <>
                            <model-viewer
                                src={animation.animation.animation}
                                alt=""
                                auto-rotate
                                camera-controls>
                            </model-viewer>
                            </>
                        )
                    }
                </>
                    
                        // <babylon model={animation.animation.animation}  ></babylon>
                    

             )
            :
            (
                <>
                
                {
                     <ReactThreeFbxViewer cameraPosition={cameraPosition} url={animation.animation.animation} />
                }
                </>
            )
            }
        </div >
    )
}

export default ThreeDTypeObjGltf1 ;