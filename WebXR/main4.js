import * as THREE from 'three';
import { ARButton } from 'https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.126.0/examples/jsm/loaders/GLTFLoader.js';


let camera, scene, renderer; 
let loader;
    //-------------------------------------------------------------------------------------------------------
    //
    // create a model variable and the variable to control its behaviour
    //
    //-------------------------------------------------------------------------------------------------------
let model;
let angle = 0.0;


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
    //-------------------------------------------------------------------------------------------------------
    //
    // transform the model using the variable
    //
    //-------------------------------------------------------------------------------------------------------
    if (model !== undefined) {
        angle = angle + 0.001; 
        model.rotation.y = angle; 
    }
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

    const modelUrl = '../assets/models/robotIndustrial/scene.gltf';
    loader = new GLTFLoader();  
    
    loader.load(
        modelUrl,
        function (gltf) {
    //-------------------------------------------------------------------------------------------------------
    //
    // To manipulate the model externally, we set model = gltf.scene
    //
    //-------------------------------------------------------------------------------------------------------            
            model = gltf.scene;
            model.position.y = -0.1;
            model.position.z = -0.2;
            model.scale.x = 0.2;
            model.scale.y = 0.2;
            model.scale.z = 0.2;
            scene.add(model);
            console.log("Model added to scene");  
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        function (error) {
            console.error(error);
        }
    );
	document.body.appendChild(ARButton.createButton(renderer));
    window.addEventListener('resize', onWindowResize, false);
}
