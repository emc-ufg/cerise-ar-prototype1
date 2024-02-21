import * as THREE from 'three';
    //-------------------------------------------------------------------------------------------------------
    //In this document, comments are only about using AR with the scene created in previous files
    //
    // The ARButton is a shortcut to WebXR. Importing it is key #1 
    //
    //-------------------------------------------------------------------------------------------------------
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';

let camera, scene, renderer; 
let torus;
let cube;

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
    //-------------------------------------------------------------------------------------------------------
    //
    // The following line is key #2, enabling XR
    //
    //-------------------------------------------------------------------------------------------------------
    renderer.xr.enabled = true; 
    container.appendChild(renderer.domElement);
    var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);
    const geometryCube = new THREE.BoxGeometry(0.2,0.2,0.2); 
    const materialCube = new THREE.MeshBasicMaterial( {color: 0x0011ff} ); 
    cube = new THREE.Mesh(geometryCube, materialCube);
    cube.position.set(-0.2, 0, -0.5); 
    scene.add(cube);
    const geometryTorus = new THREE.TorusGeometry( 0.1, 0.05, 16, 100 ); 
    const materialTorus = new THREE.MeshBasicMaterial( {color: 0x00ff11} ); 
    torus = new THREE.Mesh(geometryTorus, materialTorus);
    torus.position.set(0.2, 0, -0.5);
    torus.rotation.set(0,0.5,0);
    scene.add(torus);
    //-------------------------------------------------------------------------------------------------------
    //
	// Add the AR button to the body of the DOM is key #3
    //
    //-------------------------------------------------------------------------------------------------------
	document.body.appendChild(ARButton.createButton(renderer));
    window.addEventListener('resize', onWindowResize, false);
}
