import * as THREE from 'three';
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';


let camera, scene, renderer; 
let controller;
let object;


init();
animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
	renderer.setAnimationLoop(render);
}

function render() {
	renderer.render(scene, camera);
}

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; 
    container.appendChild(renderer.domElement);
    var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    //-------------------------------------------------------------------------------------------------------
    //
    // define the controller
    //
    //-------------------------------------------------------------------------------------------------------    
    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);//which function to use on select event
    scene.add(controller);


	document.body.appendChild(ARButton.createButton(renderer));
    window.addEventListener('resize', onWindowResize, false);
}
//-------------------------------------------------------------------------------------------------------
//
// function called on 'select' event.
//
//-------------------------------------------------------------------------------------------------------  
function onSelect(){
    const geometry = new THREE.ConeGeometry( 0.1, 0.2, 32 ).rotateX(Math.PI / 2);;
    const material = new THREE.MeshPhongMaterial({
        color      :  0xffffff * Math.random(),
        shininess  :  6,
        flatShading:  true,
        transparent: 1,
        opacity    : 0.8
    });
    object = new THREE.Mesh(geometry, material);
      
    object.position.set( 0, 0, - 0.3 ).applyMatrix4(controller.matrixWorld);
    object.quaternion.setFromRotationMatrix(controller.matrixWorld);
    console.log(controller.matrixWorld);
    scene.add(object);
}