import {Html5Qrcode} from "html5-qrcode";

document.addEventListener("DOMContentLoaded", () => {
    const server = "200.137.220.38:5000/";

    //variaveis de controle
    let currentMode = 0; //inicia no modo texto
    let backIndex = null; //leitura do qr code
    let lockIndex = false; //mudanca de target
    let target_visible = 0; //target visivel

    //entidades declaradas no html
    var fpsCounter = document.getElementById('fpsCounter');
    var objectName = document.getElementById('objectName');
    var modelEntity = document.querySelector("#model-3d");
    var textEntity = document.querySelector("#text-label");
    var imageEntity = document.querySelector("#image");
    const buttonLeft = document.querySelector('.left-arrow');
    const buttonRight = document.querySelector('.right-arrow');
    const buttonReload = document.querySelector('.refresh');
    const buttonQuality = document.querySelector('.check');
    const buttonInterface = document.querySelector('.togglebutton');

    //camera do a-frame/three
    var camera = document.querySelector('a-entity[camera]').components.camera.camera;

    //ajustes de proporcao de tela
    function resize(){
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        var aspectratio = screenWidth / screenHeight;
        camera.aspect = aspectratio;
        camera.updateProjectionMatrix();
    }

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(document.querySelector('a-scene'), {box: 'content-box'}); //melhor que event listener para resize durante uso

    //funcoes de load usando o a-frame (antes usava gltf loader e o three)
    async function fetchData(endpoint) {
        const response = await fetch(server + endpoint);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}`);
        }
        return response.json();
    }

    async function load3DModel(index) {
        try {
            const response = await fetch(server + `equipamentos/${index}/arquivos/modelo3d`);
            const modelData = await response.arrayBuffer();
            const blob = new Blob([modelData]);
            const url = URL.createObjectURL(blob);

            modelEntity.setAttribute("gltf-model", url);
            modelEntity.setAttribute("scale", "1.5 1.5 1.5");
            modelEntity.setAttribute("position", "0 -0.4 0");
            modelEntity.setAttribute("visible", true);

            textEntity.setAttribute("visible", false);
            imageEntity.setAttribute("visible", false);
        } catch (error) {
            console.error("Error loading 3D model:", error);
        }
    }

    async function loadText(index) {
        try {
            const data = await fetchData(`equipamentos/${index}`);
            textEntity.setAttribute("text", {
                value: data.Descricao,
                align: "center",
                color: "#129912",
                width: 2
            });
            textEntity.setAttribute("position", "0 0 0");
            textEntity.setAttribute("visible", true);

            modelEntity.setAttribute("visible", false);
            imageEntity.setAttribute("visible", false);
        } catch (error) {
            console.error("Error loading text:", error);
        }
    }

    async function loadImage(index) {
        try {
            const response = await fetch(server + `equipamentos/${index}/arquivos/imagem`);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            imageEntity.setAttribute("material", {
                src: url,
                transparent: true,
                opacity: 1
            });
            imageEntity.setAttribute("geometry", {
                primitive: "plane",
                height: 1,
                width: 1
            });
            imageEntity.setAttribute("position", "0 0 0");
            imageEntity.setAttribute("visible", true);

            modelEntity.setAttribute("visible", false);
            textEntity.setAttribute("visible", false);
        } catch (error) {
            console.error("Error loading image:", error);
        }
    }

    //funcao que pega a textura (como um print da tela - uso para passar no qr code reader)
    async function captureFrame() {
        return new Promise((resolve) => {
            const video = document.querySelector("video");
            const canvas = document.createElement("canvas");
            video.pause();
            const style = window.getComputedStyle(video),
            width = parseFloat(style.getPropertyValue('width')),
            height = parseFloat(style.getPropertyValue('height')),
            top = parseFloat(style.getPropertyValue('top')),
            left = parseFloat(style.getPropertyValue('left'));
            const imgLeft = left * video.videoWidth / width
            const imgTop = top * video.videoHeight / height
            const drawLeft = imgLeft > 0 ? 0 : imgLeft
            const drawTop = imgTop > 0 ? 0 : imgTop
            const drawWidth = video.videoWidth
            const drawHeight = video.videoHeight
            canvas.width = video.videoWidth + imgLeft * 2
            canvas.height = video.videoHeight + imgTop * 2
            canvas.getContext('2d').drawImage(video, drawLeft, drawTop, drawWidth, drawHeight);
            video.play();
            resolve(canvas);
        });
    }

    //funcao de scan do qr code
    async function scanQRCode() {
        try {
            const img_screen = await captureFrame();
            const blob = await new Promise(resolve => img_screen.toBlob(resolve));
            const file = new File([blob], "qr-code-image.png");
            const html5QrCode = new Html5Qrcode('qr-code-reader');
            const qrCodeMessage = await html5QrCode.scanFile(file, false);
            return qrCodeMessage;
        } catch (error) {
            console.error(`Error scanning QR code: ${error}`);
            throw error;
        }
    }

    //logica pos hiro detected
    function Targeted(){
        if(!lockIndex){
            scanQRCode().then((qrCodeMessage) => {
                backIndex = qrCodeMessage;
                currentMode = 0;
                opennavigationInterface();
                lockIndex = true;
                addnamefrombackend(backIndex);
                handleMarkerFound(backIndex);
            })
            .catch((error) => {
                console.error('Error scanning QR code:', error);
                //loop ate o qr code pegar
                if(target_visible){ //se nao tiver mais hiro detectado, o loop nao ocorre
                    setTimeout(() => {
                        Targeted();
                    }, 200);
                } 
            });
        }
    };

    document.querySelector('a-marker').addEventListener('markerFound', (e) => { //achou o hiro
        console.log("Hiro detected");
        Targeted();
    });

    document.querySelector('a-marker').addEventListener('markerLost', (e) => { //perdeu o hiro
        handleMarkerLost(); //vamos sair do loop de scan de qr code
    });

    async function handleMarkerFound(index) { //pos leitura de qr code
        target_visible = 1;
        if (currentMode === 0) { //modo inicial definido como texto
            await loadText(index);
        } else if (currentMode === 1) {
            await loadImage(index);
        } else if (currentMode === 2) {
            await load3DModel(index);
        }
    }

    async function handleMarkerLost(){
        target_visible = 0; //sair do loop de scan de qr code
    };

    function opennavigationInterface(){
        buttonLeft.style.display = 'block';
        buttonRight.style.display = 'block';
        buttonReload.style.display = 'block';
        buttonQuality.style.display = 'block';
    };

    function closenavigationInterface(){
        buttonLeft.style.display = 'none';
        buttonRight.style.display = 'none';
        buttonReload.style.display = 'none';
        buttonQuality.style.display = 'none';
    };

    function togglenavigationInterface(){
        const controlsContainer = document.querySelector('.controls-container');
        controlsContainer.style.display = controlsContainer.style.display === 'none' ? 'flex' : 'none';
    };

    //logica de botoes
    function righthandler(){
        if (currentMode<2){
            currentMode = currentMode + 1;
        }
        else{
            currentMode = 0;
        }
        if (backIndex !== null) {
            handleMarkerFound(backIndex);
        }
    };

    function lefthandler(){
        if (currentMode>0){
            currentMode = currentMode - 1;
        }
        else{
            currentMode = 2;
        }
        if (backIndex !== null) {
            handleMarkerFound(backIndex);
        }
    };

    //event listeners dos botoes
    buttonRight.addEventListener('click', () => {
        righthandler();
    });
    
    buttonLeft.addEventListener('click', () => {
        lefthandler();
    });

    buttonReload.addEventListener('click', () => {
        closenavigationInterface();
        removenamefrombackend();
        lockIndex = false;
    });

    buttonQuality.addEventListener('click', () => {
        
    });

    buttonInterface.addEventListener('click', () => {
        togglenavigationInterface();
    });

    //contador de fps   -> medir desempenho
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

    //nome do equipamento
    function targetName(name) {
        objectName.innerHTML = name;
    }

    async function addnamefrombackend(index) {
        try {
            const response = await fetch(server + `equipamentos/${index}`);
            if (!response.ok) {
                throw new Error('Failed to fetch text from backend');
            }
            const text = await response.json();
            targetName(text.Nome);
        } catch (error) {
            console.error('Error adding text from backend:', error);
        }
    }

    function removenamefrombackend(){
        targetName("");
    };

    //import * as THREE from 'three';     caso use three js para posicionamento

    //Se for usar o Three para posicionamento
    /*
    function getobjectLimits(distance){
        let vFOV = THREE.MathUtils.degToRad( camera.getEffectiveFOV() );
        let height = Math.tan( vFOV / 2 ) * distance;
        let width = height * camera.aspect;
        return { width: width, height: height };
    };

    var interationelementsZ = -12;
    var interactionelementsDistance = camera.position.z - interationelementsZ;
    var interactionelementsLimits = getobjectLimits(interactionelementsDistance);
    */

    /*  tratar cliques em objetos no three/a-frame
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
                if (o === object1){
                    functionobject1();
                }
                if (o === object2){
                    functionobject2();
                }
                if (o === object3){
                    functionobject3();
                }
            }
        }
    });
    */
});
