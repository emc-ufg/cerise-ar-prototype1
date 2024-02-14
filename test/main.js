import * as THREE from 'three';
import {MindARThree} from "mindar-image-three";

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        const mindarThree = new MindARThree({
            container: document.body,
            imageTargetSrc: "musicband.mind",
        });

        const {renderer, scene, camera} = mindarThree;

        //testing code found in https://hofk.de/main/discourse.threejs/BeginnerExample/BeginnerExample.html
        const cv = document.createElement( 'canvas' );
        cv.width = window.innerWidth*0.2;
        cv.height = window.innerHeight*0.1;
        const ctx = cv.getContext( '2d' );
        ctx.fillStyle = '#fefefe'; 
        ctx.fillRect( 0, 0, cv.width, cv.height );
        ctx.fillStyle = '#129912';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 6vh Arial';
        ctx.fillText('      Hello', 0, 0.5 * cv.height );
        const txtGeometry = new THREE.BoxGeometry( 2.4, 0.8, 0.1 );
        const cvTexture = new THREE.Texture( cv );
        cvTexture.needsUpdate = true;
        const spineMat = new THREE.MeshPhongMaterial( { color: 0xa5800e } );
        const cvMaterial = new THREE.MeshBasicMaterial( { map: cvTexture, transparent: true, opacity:0.8  } );
        const cvMaterials = [ spineMat, spineMat, spineMat, spineMat, cvMaterial, cvMaterial ]; 
        const cvTxtMesh = new THREE.Mesh( txtGeometry, cvMaterials );
        cvTxtMesh.rotation.y = 0;
        //cvTxtMesh.position.set( 0, 0, -12 );   -> if fixing it in screen

        //adding interaction elements

        const fechargeometry = new THREE.PlaneGeometry(2,2);
        const fechartextureLoader = new THREE.TextureLoader();
        const fechartexture = fechartextureLoader.load("fechar.png");
        const fecharmaterial = new THREE.MeshBasicMaterial({ map: fechartexture, transparent: true, opacity: 1 });
        const fecharplane = new THREE.Mesh(fechargeometry, fecharmaterial);

        const fechar = new THREE.Group();
        fechar.add(fecharplane);
        fechar.position.set(0, -4, -12);
        fechar.rotation.set(0, 0, 0);
        fechar.userData.clickable = true;
        fechar.name = "fechar"

        const botãogeometry = new THREE.BufferGeometry();
        const vertices = new Float32Array( [
            -1.0, -1.0,  0.0, // v0
             1.0, -1.0,  0.0, // v1
             0.0,  1.0,  0.0 // v2
        ] );
        botãogeometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
        const botãomaterial = new THREE.MeshBasicMaterial({ color: "#0000FF", transparent: true, opacity: 1 });
        const botãoplane1 = new THREE.Mesh(botãogeometry, botãomaterial);
        const botãoplane2 = new THREE.Mesh(botãogeometry, botãomaterial);

        const botãodireito = new THREE.Group();
        botãodireito.add(botãoplane1);
        botãodireito.position.set(5, -4, -12);
        botãodireito.rotation.set(0, 0, 3*Math.PI/2);
        botãodireito.userData.clickable = true;
        botãodireito.name = "botãodireito"

        const botãoesquerdo = new THREE.Group();
        botãoesquerdo.add(botãoplane2);
        botãoesquerdo.position.set(-5, -4, -12);
        botãoesquerdo.rotation.set(0, 0, Math.PI/2);
        botãoesquerdo.userData.clickable = true;
        botãoesquerdo.name = "botãoesquerdo"

        function abririnterfacenavegacao(){
            //mindarThree.stop();
            scene.add(botãodireito);
            scene.add(botãoesquerdo);
            scene.add(fechar);
        };

        function fecharinterfacenavegacao(){
            scene.remove(botãodireito);
            scene.remove(botãoesquerdo);
            scene.remove(fechar);
            //mindarThree.start();
        };

        //user interaction

        /*
        document.body.addEventListener("click", (e)=>{
            e.preventDefault();
            console.log("click");
            var canvasBounds = renderer.domElement.getBoundingClientRect(); 
            const mouseX = ( ( e.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1; 
            const mouseY = - ( ( e.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;
            const mouse = new THREE.Vector2(mouseX, mouseY);
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);
            console.log(intersects);
            if (intersects.lenght > 0){
                let o = intersects[0].object;
                while (o.parent && !o.userData.clickable){
                    o = o.parent;
                }
                if (o.userData.clickable){
                    if (o === botãoesquerdo){

                    }
                    if (o === botãodireito){
                        
                    }
                    if (o === fechar){
                        fecharinterfacenavegacao();
                    }
                }
            }
        });
        */

        const anchor1 = mindarThree.addAnchor(0);
        anchor1.group.add(cvTxtMesh);
        //to fix in in screen, add/remove in scene while found/lost

        anchor1.onTargetFound = () => {
            abririnterfacenavegacao();
            console.log("Target found");
        };

        anchor1.onTargetLost = () => {
            fecharinterfacenavegacao();
            console.log("Target found");
        };
        
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    }
    start();
});
