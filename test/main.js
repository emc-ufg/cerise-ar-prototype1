import * as THREE from 'three';
import {MindARThree} from "mindar-image-three";
import {GLTFLoader} from "GLTF";

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        const mindarThree = new MindARThree({
            container: document.body,
            imageTargetSrc: "multiples.mind", //+50 targets
        });

        const {renderer, scene, camera} = mindarThree;

        let current_anchor = null;

        let mode = null;

        let anchorIndex = null;

        //text

        let textmsg = [];

        textmsg.push('anchor0', 'anchor1');

        let txtloaded = null;

        function addtxt(index){
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
            let txtstring = textmsg[anchorIndex];
            ctx.fillText(txtstring, 0, 0.5 * cv.height );
            const txtGeometry = new THREE.BoxGeometry( 2.4, 0.8, 0.1 );
            const cvTexture = new THREE.Texture( cv );
            cvTexture.needsUpdate = true;
            const spineMat = new THREE.MeshPhongMaterial( { color: 0xa5800e } );
            const cvMaterial = new THREE.MeshBasicMaterial( { map: cvTexture, transparent: true, opacity:0.8  } );
            const cvMaterials = [ spineMat, spineMat, spineMat, spineMat, cvMaterial, cvMaterial ]; 
            txtloaded = new THREE.Mesh( txtGeometry, cvMaterials );
            txtloaded.rotation.y = 0;
            let anchornow = mindarThree.anchors[index];
            anchornow.group.add(txtloaded);
        };

        //3d models

        let modelspath = [];

        modelspath.push('applications/assets/models/musicband-bear/scene.gltf', 'applications/assets/models/musicband-raccoon/scene.gltf');

        function add3dmodel(index){
            const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
            scene.add(light);
            const loader = new GLTFLoader();
            let anchornow = mindarThree.anchors[index];
            loader.load(modelspath[anchorIndex], gltf =>{
                gltf.scene.scale.set(0.1, 0.1, 0.1);
                gltf.scene.position.set(0, -0.4, 0);
                anchornow.group.add(gltf.scene);
            });
        };

        //images

        let imagepaths = [];

        imagepaths.push('applications/assets/targets/musicband-bear.png', 'applications/assets/targets/musicband-raccoon.png');

        let imageloaded = null;

        function addimage(index){
            const imagegeometry = new THREE.PlaneGeometry(2,2);
            const imagetextureLoader = new THREE.TextureLoader();
            const imagetexture = imagetextureLoader.load(imagepaths[anchorIndex]);
            const imagematerial = new THREE.MeshBasicMaterial({ map: imagetexture, transparent: true, opacity: 1 });
            imageloaded = new THREE.Mesh(imagegeometry, imagematerial);
            let anchornow = mindarThree.anchors[index];
            anchornow.group.add(imageloaded);
        };

        //adding interaction elements

        const fechargeometry = new THREE.PlaneGeometry(2,2);
        const fechartextureLoader = new THREE.TextureLoader();
        const fechartexture = fechartextureLoader.load("fechar.png");
        const fecharmaterial = new THREE.MeshBasicMaterial({ map: fechartexture, transparent: true, opacity: 1 });
        const fecharplane = new THREE.Mesh(fechargeometry, fecharmaterial);

        const fechar = new THREE.Group();
        fechar.add(fecharplane);
        fechar.position.set(0, -3, -12);
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
        botãodireito.position.set(5, -3, -12);
        botãodireito.rotation.set(0, 0, 3*Math.PI/2);
        botãodireito.userData.clickable = true;
        botãodireito.name = "botãodireito"

        const botãoesquerdo = new THREE.Group();
        botãoesquerdo.add(botãoplane2);
        botãoesquerdo.position.set(-5, -3, -12);
        botãoesquerdo.rotation.set(0, 0, Math.PI/2);
        botãoesquerdo.userData.clickable = true;
        botãoesquerdo.name = "botãoesquerdo"

        //interface management

        function abririnterfacenavegacao(){
            scene.add(botãodireito);
            scene.add(botãoesquerdo);
            scene.add(fechar);
        };

        function fecharinterfacenavegacao(){
            scene.remove(botãodireito);
            scene.remove(botãoesquerdo);
            scene.remove(fechar);
        };

        //anchor management

        function removeallAnchors(){
            if (mindarThree.anchors.length > 0) {
                mindarThree.anchors.splice(0, mindarThree.anchors.length);
            }
        };

        function addallAnchors() {
            return new Promise((resolve) => {

                removeallAnchors();
        
                const anchor0 = mindarThree.addAnchor(0);
                const anchor1 = mindarThree.addAnchor(1);

                mindarThree.anchors.forEach((anchor) => {
                    anchor.onTargetFound = () => {
                        handleTargetFound(anchor);
                    };
                    anchor.onTargetLost = () => {
                        handleTargetLost();
                    };
                });
        
                resolve();
            });
        };

        function remove_other_anchors(index){
            setTimeout(() => {
                let fixedanchor = mindarThree.anchors[index];
                removeallAnchors();
                mindarThree.anchors.push(fixedanchor);
            }, 0);
        };

        function removeAllObjectsFromGroup(group) {
            return new Promise((resolve) => {
                while (group.children.length > 0) {
                    const child = group.children[0];
                    group.remove(child);
                }
                resolve();
            });
        };

        function handleTargetFound(anchor) {
            anchorIndex = mindarThree.anchors.indexOf(anchor);
            addtxt(anchorIndex);
            mode = 0;
            abririnterfacenavegacao();
            remove_other_anchors(anchorIndex);
            current_anchor = 0;
        };
        
        function handleTargetLost() {

        }

        async function fecharHandler() {
            if (current_anchor !== null && mindarThree.anchors[current_anchor]) {
                await removeAllObjectsFromGroup(mindarThree.anchors[current_anchor].group);
            }
            fecharinterfacenavegacao();
            current_anchor = null;
            await addallAnchors();
        };

        function direitahandler(){
            if (current_anchor !== null && mindarThree.anchors[current_anchor]) {
                let index = current_anchor;
                if (mode === 0){
                    removeAllObjectsFromGroup(mindarThree.anchors[index].group);
                    addimage(index);
                }
                else if (mode === 1){
                    removeAllObjectsFromGroup(mindarThree.anchors[index].group);
                    add3dmodel(index);
                }
                else if (mode === 2){
                    removeAllObjectsFromGroup(mindarThree.anchors[index].group);
                    addtxt(index);
                }
                if (mode<2){
                    mode = mode + 1;
                }
                else{
                    mode = 0;
                }
            }
        };

        function esquerdahandler(){
            if (current_anchor !== null && mindarThree.anchors[current_anchor]) {
                let index = current_anchor;
                if (mode === 0){
                    removeAllObjectsFromGroup(mindarThree.anchors[index].group);
                    add3dmodel(index);
                }
                else if (mode === 1){
                    removeAllObjectsFromGroup(mindarThree.anchors[index].group);
                    addtxt(index);
                }
                else if (mode === 2){
                    removeAllObjectsFromGroup(mindarThree.anchors[index].group);
                    addimage(index);
                }
                if (mode>0){
                    mode = mode - 1;
                }
                else{
                    mode = 2;
                }
            }
        };

        addallAnchors();

        //user interaction

        document.body.addEventListener("click", (e)=>{
            e.preventDefault();
            console.log("click");
            var canvasBounds = renderer.domElement.getBoundingClientRect();
            const mouseX = ( ( e.clientX - canvasBounds.left ) / ( canvasBounds.right - canvasBounds.left ) ) * 2 - 1; 
            const mouseY = - ( ( e.clientY - canvasBounds.top ) / ( canvasBounds.bottom - canvasBounds.top) ) * 2 + 1;
            const mouse = new THREE.Vector3(mouseX, mouseY, -12);
            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0){
                let o = intersects[0].object;
                while (o.parent && !o.userData.clickable){
                    o = o.parent;
                }
                if (o.userData.clickable){
                    if (o === botãoesquerdo){
                        esquerdahandler();
                    }
                    if (o === botãodireito){
                        direitahandler();
                    }
                    if (o === fechar){
                        fecharHandler();
                    }
                }
            }
        });

        // FPS Counter

        let fpsCounter = document.createElement('div');
        fpsCounter.style.position = 'absolute';
        fpsCounter.style.top = '10px';
        fpsCounter.style.left = '10px';
        fpsCounter.style.color = '#ffffff';
        document.body.appendChild(fpsCounter);

        let frameCount = 0;
        let lastTime = performance.now();

        function updateFPSCounter() {
            const currentTime = performance.now();
            const deltaTime = currentTime - lastTime;
            frameCount++;

            if (deltaTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / deltaTime);
                fpsCounter.innerHTML = `FPS: ${fps}`;
                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(updateFPSCounter);
        }

        updateFPSCounter();

        //start
        
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    }
    start();
});
