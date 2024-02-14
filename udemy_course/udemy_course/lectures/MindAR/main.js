import {loadGLTF} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;


/*The following data is here for testing purposes only They will come from database, in the future*/ 
let iD = 1;
const equipHealth = [];
equipHealth.push(0,1,2);

const healthURL = [];
healthURL.push('./health0.png','./health1.png','./health2.png');

const models3dURL = [];
models3dURL.push('../../assets/models/glasses1/scene.gltf','../../assets/models/robotIndustrial/scene.gltf','../../assets/models/hat1/scene.gltf')


const modelScale = [];
modelScale.push(0.02,1,0.05);

const equipInfo = [];
equipInfo.push('That is glass 1','That is glass 2','That is hat 1');


//updateValuesHTML();


document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {

    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    let model3D1 = await loadGLTF(models3dURL[iD]);
    model3D1.scene.scale.set(modelScale[iD], modelScale[iD], modelScale[iD]);
    model3D1.scene.position.set(0, 0.4, 0);

    let model3D2 = await loadGLTF(models3dURL[2]);
    model3D2.scene.scale.set(modelScale[2], modelScale[2], modelScale[2]);
    model3D2.scene.position.set(-1.5, 0.0, 0);

    let geometry = new THREE.PlaneGeometry(1, 0.6);
    let material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture(healthURL[iD])});
    let plane = new THREE.Mesh(geometry, material); 
    plane.position.set(1.5,0,0);
    
    /*document.body.addEventListener("click", (e) => {
      iD = (iD+1)%3;
      updateValuesHTML();
      updateScene();
    });*/    

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(model3D1.scene);
    anchor.group.add(model3D2.scene);
    anchor.group.add(plane)

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});

function updateValuesHTML() {
  document.getElementById("theID").innerHTML = iD.toString();
  document.getElementById("info").innerHTML = equipInfo[iD];
  document.getElementById("healthImage").src = healthURL[iD]; 
}