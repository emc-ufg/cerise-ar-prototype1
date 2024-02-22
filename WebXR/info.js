import * as THREE from 'three';

import { ARButton } from "https://unpkg.com/three@0.126.0/examples/jsm/webxr/ARButton.js";
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.126.0/examples/jsm/loaders/GLTFLoader.js';
import { CSS3DRenderer, CSS3DObject } from 'https://cdn.skypack.dev/three@0.126.0/examples/jsm/renderers/CSS3DRenderer.js';

let container;
let camera, scene, renderer;
let reticle;
let controller;
let loader;
let model;
let infograph;
let infotext;

init();
animate();

function init() {
    container = document.createElement("div");
    document.body.appendChild(container);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70,window.innerWidth / window.innerHeight,0.01,20);
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
            model = gltf.scene;
            model.visible = false;
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

    const geometry = new THREE.PlaneGeometry(0.08, 0.214).rotateX(-Math.PI / 4);
    const texture = new THREE.TextureLoader().load('../assets/images/hot.jpg'); 
    const material = new THREE.MeshBasicMaterial( { map:texture} );


    infograph = new THREE.Mesh(geometry, material);    
    infograph.visible = false;
    scene.add(infograph);

    controller = renderer.xr.getController(0);
    controller.addEventListener('select', onSelect);
    scene.add(controller);
    addReticleToScene();
    const button = ARButton.createButton(renderer, {
        requiredFeatures: ["hit-test"] // notice a new required feature
    });
    document.body.appendChild(button);
    renderer.domElement.style.display = "none";
    window.addEventListener("resize", onWindowResize, false);
}

function addReticleToScene() {
    const geometry = new THREE.RingBufferGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2);
    const material = new THREE.MeshBasicMaterial();
    reticle = new THREE.Mesh(geometry, material);
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
}

function onSelect() {        
    if (reticle.visible) {
    model.position.setFromMatrixPosition(reticle.matrix);
    model.quaternion.setFromRotationMatrix(reticle.matrix);
    model.visible = true;
    model.scale.x = 0.9;
    model.scale.y = 0.9;
    model.scale.z = 0.9;
    infograph.position.setFromMatrixPosition(reticle.matrix);
    infograph.quaternion.setFromRotationMatrix(reticle.matrix);
    infograph.position.y+=1;
    infograph.position.x-=0.2;
    infograph.visible = true;   
    // infotext.position.setFromMatrixPosition(reticle.matrix);
    // infotext.quaternion.setFromRotationMatrix(reticle.matrix);
    // infotext.position.y+=1;
    // infotext.position.x+=0.2;
    // infotext.visible = true;            
  }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}


let hitTestSource = null;
let localSpace = null;
let hitTestSourceInitialized = false;

async function initializeHitTestSource() {
    const session = renderer.xr.getSession(); // XRSession
    const viewerSpace = await session.requestReferenceSpace("viewer");
    hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
    // We're going to use the reference space of "local" for drawing things.
    // which gives us stability in terms of the environment.
    // read more here: https://developer.mozilla.org/en-US/docs/Web/API/XRReferenceSpace
    localSpace = await session.requestReferenceSpace("local");
    // set this to true so we don't request another hit source for the rest of the session
    hitTestSourceInitialized = true;
    // In case we close the AR session by hitting the button "End AR"
    session.addEventListener("end", () => {
        hitTestSourceInitialized = false;
        hitTestSource = null;
    });
    
}

function render(timestamp, frame) {
    if (frame) {
        if (!hitTestSourceInitialized) {
            initializeHitTestSource();
        }
        // 2. get hit test results
        if (hitTestSourceInitialized) {
            // we get the hit test results for a particular frame
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            // XRHitTestResults The hit test may find multiple surfaces. The first one in the array is the one closest to the camera.
            if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                // Get a pose from the hit test result. The pose represents the pose of a point on a surface.
                const pose = hit.getPose(localSpace);
                reticle.visible = true;
                // Transform/move the reticle image to the hit test position
                reticle.matrix.fromArray(pose.transform.matrix);
            } 
            else {
                reticle.visible = false;
            }
        }
        renderer.render(scene, camera);
    }
}