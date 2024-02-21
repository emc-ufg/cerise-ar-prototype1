import * as THREE from 'three';

let camera, scene, renderer; //these are the essentials
let cube;
let torus;
init();
animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


// this function is only called one time
function animate() {
	// here we set the render function to be called in a loop
	renderer.setAnimationLoop(render);
}

// render function called on a loop every time the screen is refreshed
// which typically means 60 times a second (60 frames per second)
function render() {
	renderer.render(scene, camera);
}

function init() {
    const container = document.createElement('div');//creates a div in the page
    document.body.appendChild(container);//append the div in the body of the page
    //First, lets create a scene
    scene = new THREE.Scene();
    console.log(scene);

    //Then, we create the camera, with specifications
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    //Now, we create the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);//use the same PixelRatio of the device
    renderer.setSize(window.innerWidth, window.innerHeight);//use the whole window
    container.appendChild(renderer.domElement);//add the canvas to the div    

    //if we're in the dark, we won't see a thing.
    var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);


    //And now, something to see
    const geometryCube = new THREE.BoxGeometry(); //it must have a shape, but be careful with the size
                                                         //of the object. If it is too big, the faces 
                                                         //may be too far 
                                                         //to be seen.
    const materialCube = new THREE.MeshBasicMaterial( {color: 0x0011ff} ); //and lets give it some color
    cube = new THREE.Mesh(geometryCube, materialCube);//now we create an object with the given gemoetry and material
    //the object exist, but where is it?
    cube.position.set(-1, 0, -3); //we put it to the left and three meters back (z)
    
    //finally we place it on the scene
    scene.add(cube);

    //now a second object
    const geometryTorus = new THREE.TorusGeometry( 0.5, 0.2, 16, 100 ); 
    const materialTorus = new THREE.MeshBasicMaterial( {color: 0x00ff11} ); //and lets give it some color
    torus = new THREE.Mesh(geometryTorus, materialTorus);//now we create an object with the given gemoetry and material
    torus.position.set(1, 0, -3); //we put it to the left and three meters back (z)
    torus.rotation.set(0,0.5,0);

    scene.add(torus);


    window.addEventListener('resize', onWindowResize, false);
}
