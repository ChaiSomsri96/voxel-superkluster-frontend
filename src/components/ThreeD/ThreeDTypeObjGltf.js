import * as THREE from 'three';
import React, { useRef , Suspense, useState, useEffect } from 'react';
import { Canvas , useThree } from '@react-three/fiber';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader';
import ThreeModel from './ThreeModel';
import ThreeModel_fbx from './ThreeModel_fbx' ;
import { OrbitControls} from '@react-three/drei';
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

const ThreeDTypeObjGltf = (animation) => {

  THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());
// 
 
  const [modelType, setModelType] = useState('obj');
  const [modelUrl, setModelUrl] = useState(null);
  const [mtlUrl, setMtlUrl] = useState('');
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [positionZ, setPositionZ] = useState(0);
  const [type , setType] = useState('') ;
  const [fullSize , setFullSize] = useState();
  const targetRef = useRef();
  
  useEffect(()=>{
    if(targetRef.current) {
      let f_x = targetRef.current.offsetWidth ;
      let f_y = targetRef.current.offsetHeight ;
      setFullSize(f_x>f_y?f_y:f_x) ;
  
    }
  })

 
  useEffect(()=>{
    setPositionX(0 * 70);
    setPositionY(-0.638 * 70);
    setPositionZ(0.025 * 70);
    setModelType('obj') ;
   

    
  },[]);

  return (
    <div className='threeDmodel' ref={targetRef}>
        {/* {console.log(animation.animation.raw_animation_type,'animation.animation.raw_animation_type')} */}
        {
            animation.animation.raw_animation_type == 'obj' || animation.animation.raw_animation_type == 'fbx' 
            
            ?
                <Suspense fallback={null} >
                    {/* <Canvas  camera={{ position: [0, 100, -130], fov: 100 }}> */}
                    <Canvas  camera={{ position: [0,0,1], fov: 100 }}>
                        <ambientLight intensity={1} />
                        {/* <CameraController/> */}
                        <pointLight position={[100, 30, 100]} intensity={0.2} />
                        <Suspense fallback={null}>
                          
                            <ThreeModel
                            modelType={animation.animation.raw_animation_type ? animation.animation.raw_animation_type : ""}
                            modelUrl={animation.animation.animation ? animation.animation.animation : "" }
                            mtlUrl={animation.animation.isMTLForm ? animation.animation.isMTLForm : ""} 
                            desiredScale_threed = {fullSize}
                            positionX={positionX} positionY={positionY} positionZ={positionZ} />
                            
                        </Suspense>
                          <OrbitControls minDistance={150} maxDistance={550} />
                        
                    </Canvas>
                </Suspense>
            :
                <model-viewer
                    src={animation.animation.animation}
                    alt=""
                    style={{width:'100%' , height:'100vh'}}
                    auto-rotate
                    camera-controls>
                </model-viewer>

        }   
     
    </div>
  )
}

export default ThreeDTypeObjGltf ;