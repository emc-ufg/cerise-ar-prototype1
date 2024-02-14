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

let infoShow = [0, 0, 0];
/*--------------------------------------------------------------------------------------------------------------------*/ 
document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    document.body.addEventListener("click", (e) => {
      //iD = (iD+1)%3;

      let firstItem = infoShow.shift();
      infoShow.push(firstItem);
      console.log(infoShow);

      updateValuesHTML();
      clearScene();
      configScene();
    });  
    configScene();
  }
  start();
});

function updateValuesHTML() {
  document.getElementById("theID").innerHTML = iD.toString();
}

let anchor = null;
let model3D1 = null;
let model3D2 = null;
let plane = null;

async function configScene(){

  const mindarThree = new window.MINDAR.IMAGE.MindARThree({
    container: document.body,
    imageTargetSrc: '../../assets/targets/escher.mind',
  });

  let {renderer, scene, camera} = mindarThree;

  let light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
  scene.add(light);

  //3D model
  model3D1 = await loadGLTF(models3dURL[iD]);
  model3D1.scene.scale.set(modelScale[iD], modelScale[iD], modelScale[iD]);
  model3D1.scene.position.set(0, -1.5, 7*infoShow[0]);

  //3d Model (replace with text)
  //model3D2 = await loadGLTF(models3dURL[2]);
 // model3D2.scene.scale.set(modelScale[2], modelScale[2], modelScale[2]);
  //model3D2.scene.position.set(0, 0.0, 7*infoShow[1]);

/* ---------------------------------------------------------------------------------------------*/
const cv = document.createElement( 'canvas' );
cv.width = 1*600 //  3 * 512
cv.height = 320;
const ctx = cv.getContext( '2d' );
ctx.fillStyle = '#fefefe'; 
ctx.fillRect( 0, 0, cv.width, cv.height );
ctx.fillStyle = '#0055ff';
ctx.textAlign = 'left';
ctx.textBaseline = 'middle';
ctx.font = 'bold 4vh Arial';
			// https://unicode.org/emoji/charts/full-emoji-list.html#1f642 (mark and copy - column Browser)
ctx.fillText( ' Data de fabricação: 01/01/99', 0, 0.15 * cv.height );
ctx.fillText( ' Responsável técnico: João da Silva', 0, 0.3 * cv.height );
ctx.fillText( ' Última manutenção: 01/01/24', 0, 0.45 * cv.height );
ctx.fillText( ' Descrição: braço robótico 3DOF', 0, 0.6 * cv.height );
ctx.fillText( ' MTBF: 10.000 h', 0, 0.75 * cv.height );


const txtGeometry = new THREE.BoxGeometry( 2.4, 0.8, 0.01 ); // w 3 : h 1
const cvTexture = new THREE.Texture( cv );
cvTexture.needsUpdate = true; // otherwise all black only
const spineMat = new THREE.MeshPhongMaterial( { color: 0xa5800e } );
const cvMaterial = new THREE.MeshBasicMaterial( { map: cvTexture, transparent:true, opacity:0.8  } );
const cvMaterials = [ spineMat, spineMat, spineMat, spineMat, cvMaterial, cvMaterial ]; 
const cvTxtMesh = new THREE.Mesh( txtGeometry, cvMaterials );
cvTxtMesh.position.set( -1, 0, 7*infoShow[1]);





  // image (replace with CSS code)
  let geometry = new THREE.PlaneGeometry(1, 0.6);
  let texture = new THREE.TextureLoader().load(healthURL[iD]); 
  let material = new THREE.MeshBasicMaterial( { map:texture } )
  plane = new THREE.Mesh(geometry, material); 
  plane.position.set(1,0,7*infoShow[2]);
  plane.scale.set(0.6,0.6,0.6);  


  anchor = mindarThree.addAnchor(0);
  anchor.group.add(model3D1.scene);
  //anchor.group.add(model3D2.scene);
  anchor.group.add(plane);
  anchor.group.add(cvTxtMesh);

  await mindarThree.start();

  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
  });
}

function clearScene(){
  anchor.group.remove(model3D1.scene);
  //anchor.group.remove(model3D2.scene);
  anchor.group.remove(plane);
  anchor.group.remove(cvTxtMesh);  
}

/*
TODO: alternate visibility of information, instead of updating scene
      use buttons to alternate scene
      use text
      replace image with CSS code
*/