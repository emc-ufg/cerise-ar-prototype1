import * as THREE from 'three';
import {MindARThree} from "mindar-image-three";
import {GLTFLoader} from "GLTF";

document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        const mindarThree = new MindARThree({
            container: document.body,
            imageTargetSrc: "all.mind", //multiples.mind -> test 50+ anchors
        });

        const {renderer, scene, camera} = mindarThree;

        var current_anchor = null; //current index for targeted anchor (will be aways 0 after remove other anchors)

        var mode = null; //mode of view that changes with the buttons

        var anchorIndex = null; //the original index of the targeted anchor

        var lockIndex = false;

        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        //updating space sense with screen parameters
        var aspectratio = screenWidth/screenHeight;
        renderer.setSize(screenWidth, screenHeight, false);
        camera.aspect = aspectratio;
        camera.updateProjectionMatrix();
        
        function getobjectLimits(distance){ //we have a 3d space and the object visualization in screen depends on its placement
            let screeninUse = null;
            if (aspectratio>=1){
                screeninUse = 0.7; //empiric value, test and change as wish
            }
            else{
                screeninUse = 0.8; //empiric value
            }
            let vFOV = THREE.MathUtils.degToRad( camera.getEffectiveFOV() );
            let height = Math.tan( vFOV / 2 ) * distance; //already half of the actual height
            let width = height * camera.aspect;
            return { width: screeninUse*width, height: screeninUse*height };
        };

        //text

        var textmsg = [];

        textmsg.push('anchor0', 'anchor1');

        var txtloaded = null;

        function addtxt(index) {
            const cv = document.createElement('canvas');
            const canvasWidth = window.innerWidth * 0.2;
            const canvasHeight = window.innerHeight * 0.1;
            cv.width = canvasWidth;
            cv.height = canvasHeight;
            const ctx = cv.getContext('2d');
            ctx.fillStyle = '#fefefe';
            ctx.fillRect(0, 0, cv.width, cv.height);
            ctx.fillStyle = '#129912';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const txtstring = textmsg[anchorIndex];
            const maxFontSize = 0.5*Math.min(canvasWidth, canvasHeight);
            let fontSize = maxFontSize;
            while (fontSize > 1) { //adjust fontsize till the text is all in canvas element
                ctx.font = `bold ${fontSize}px Arial`;
                const textWidth = ctx.measureText(txtstring).width;
                if (textWidth < canvasWidth) {
                    break;
                }
                fontSize--;
            }
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillText(txtstring, 0, 0.5 * cv.height);
            const txtGeometry = new THREE.BoxGeometry(2.4, 0.8, 0.1);
            const cvTexture = new THREE.Texture(cv);
            cvTexture.needsUpdate = true;
            const spineMat = new THREE.MeshPhongMaterial({ color: 0xa5800e });
            const cvMaterial = new THREE.MeshBasicMaterial({ map: cvTexture, transparent: true, opacity: 0.8 });
            const cvMaterials = [spineMat, spineMat, spineMat, spineMat, cvMaterial, cvMaterial];
            txtloaded = new THREE.Mesh(txtGeometry, cvMaterials);
            txtloaded.rotation.y = 0;
            let anchornow = mindarThree.anchors[index];
            anchornow.group.add(txtloaded);
        }
        

        //3d models

        var modelspath = [];

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

        var imagepaths = [];

        imagepaths.push('applications/assets/targets/musicband-bear.png', 'applications/assets/targets/musicband-raccoon.png');

        var imageloaded = null;

        function addimage(index){
            const imagetextureLoader = new THREE.TextureLoader();
            imagetextureLoader.load(imagepaths[anchorIndex], (imagetexture) => {
                const imagematerial = new THREE.MeshBasicMaterial({ map: imagetexture, transparent: true, opacity: 1 });
                const imageRatio = imagetexture.image.width / imagetexture.image.height;
                let imagegeometry;
                if(aspectratio<1){
                    imagegeometry = new THREE.PlaneGeometry(imageRatio*screenHeight/400,screenHeight/400);
                }
                else{
                    imagegeometry = new THREE.PlaneGeometry(imageRatio*screenWidth/800,screenWidth/800);
                }
                imageloaded = new THREE.Mesh(imagegeometry, imagematerial);
                let anchornow = mindarThree.anchors[index];
                anchornow.group.add(imageloaded);
            });
        };

        //adding interaction elements

        var interationelementsZ = -12; //-10 already above the camera image
        var interactionelementsDistance = camera.position.z - interationelementsZ;
        var interactionelementsLimits = getobjectLimits(interactionelementsDistance);

        if(aspectratio>=1){
            var buttonwidth = 0.2*interactionelementsLimits.width;
            var buttonheight = 0.2*interactionelementsLimits.height;
        }
        else{
            var buttonwidth = 0.15*interactionelementsLimits.width;
            var buttonheight = 0.15*interactionelementsLimits.height;
        }

        let close;
        const closetextureLoader = new THREE.TextureLoader();
        closetextureLoader.load("close2.png", (closetexture) => {
            let imageratio = closetexture.image.width / closetexture.image.height;
            const closegeometry = new THREE.PlaneGeometry(buttonheight * imageratio, buttonheight);
            const closematerial = new THREE.MeshBasicMaterial({ map: closetexture, transparent: true, opacity: 1 });
            const closeplane = new THREE.Mesh(closegeometry, closematerial);
            close = new THREE.Group();
            close.add(closeplane);
            if (aspectratio>=1){
                close.position.set(0, (buttonheight - interactionelementsLimits.height), interationelementsZ);
            }
            else{
                close.position.set(0, -interactionelementsLimits.height+buttonheight/2, interationelementsZ);
            }
            close.rotation.set(0, 0, 0);
            close.userData.clickable = true; //necessary for click event
        });

        const buttongeometry = new THREE.PlaneGeometry(buttonheight, buttonheight);

        let buttonright;
        const rightbuttontextureLoader = new THREE.TextureLoader();
        rightbuttontextureLoader.load("arrow.png", (rightbuttontexture) => {
            const rightbuttonmaterial = new THREE.MeshBasicMaterial({ map: rightbuttontexture, transparent: true, opacity: 1 });
            const rightbuttonplane = new THREE.Mesh(buttongeometry, rightbuttonmaterial);
            buttonright = new THREE.Group();
            buttonright.add(rightbuttonplane);
            if (aspectratio>=1){
                buttonright.position.set((interactionelementsLimits.width - buttonwidth), (buttonheight - interactionelementsLimits.height), interationelementsZ);
            }
            else{
                buttonright.position.set((interactionelementsLimits.width - buttonwidth), (-interactionelementsLimits.height+buttonheight/2), interationelementsZ);
            }
            buttonright.rotation.set(0, 0, 0);
            buttonright.userData.clickable = true;
        });

        let buttonleft;
        const leftbuttontextureLoader = new THREE.TextureLoader();
        leftbuttontextureLoader.load("arrowleft.png", (leftbuttontexture) => {
            const leftbuttonmaterial = new THREE.MeshBasicMaterial({ map: leftbuttontexture, transparent: true, opacity: 1 });
            const leftbuttonplane = new THREE.Mesh(buttongeometry, leftbuttonmaterial);
            buttonleft = new THREE.Group();
            buttonleft.add(leftbuttonplane);
            if (aspectratio>=1){
                buttonleft.position.set((-interactionelementsLimits.width + buttonwidth), (buttonheight - interactionelementsLimits.height), interationelementsZ);
            }
            else{
                buttonleft.position.set((-interactionelementsLimits.width + buttonwidth), (-interactionelementsLimits.height+buttonheight/2), interationelementsZ);
            }
            buttonleft.rotation.set(0, 0, 0);
            buttonleft.userData.clickable = true;
        });   

        //interface management

        function opennavigationInterface(){
            scene.add(buttonright);
            scene.add(buttonleft);
            scene.add(close);
        };

        function closenavigationInterface(){
            scene.remove(buttonright);
            scene.remove(buttonleft);
            scene.remove(close);
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
            if(!lockIndex){
                anchorIndex = mindarThree.anchors.indexOf(anchor);
                addtxt(anchorIndex);
                remove_other_anchors(anchorIndex);
                mode = 0;
                opennavigationInterface();
                current_anchor = 0;
                lockIndex = true;
            }
        };
        
        async function handleTargetLost() {
        };

        async function closeHandler() {
            if (current_anchor !== null && mindarThree.anchors[current_anchor]) {
                await removeAllObjectsFromGroup(mindarThree.anchors[current_anchor].group);
            }
            closenavigationInterface();
            current_anchor = null;
            await addallAnchors();
        };

        function righthandler(){
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

        function lefthandler(){
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
            let canvasBounds = renderer.domElement.getBoundingClientRect();
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
                    if (o === buttonleft){
                        lefthandler();
                    }
                    if (o === buttonright){
                        righthandler();
                    }
                    if (o === close){
                        closeHandler();
                        lockIndex = false;
                    }
                }
            }
        });

        window.addEventListener('resize', () => {
            const newScreenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            const newScreenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            renderer.setSize(newScreenWidth, newScreenHeight, false);
            camera.aspect = newScreenWidth / newScreenHeight;
            camera.updateProjectionMatrix();
        });

        var fpsCounter = document.createElement('div');
        fpsCounter.style.position = 'absolute';
        fpsCounter.style.top = '10px';
        fpsCounter.style.left = '10px';
        fpsCounter.style.color = '#ffffff';
        document.body.appendChild(fpsCounter);

        var frameCount = 0;
        var lastTime = performance.now();

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
