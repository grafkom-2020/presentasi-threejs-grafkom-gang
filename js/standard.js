var renderer, camera;

var controls = new function() {
    this.cameraZ = 5;
    this.Material = new function(){
        this.transparent = false;
        this.transparentOptions = new function(){
            this.opacity = 0.9999;
        };
        this.alphaTest = 0.00001;
        this.depthTest = true;
        this.depthWrite = true;
        this.side = THREE.FrontSide;
        this.flatShading = false;
        this.visible = true;
    }
    this.StandardMaterial = new function(){
        this.color = 0xffffff;
        this.emissive = 0x50505;
        this.emissiveIntensity = 0.9999;
        this.metalness  = 0.00001;
        this.roughness = 0.9999;
        this.wireframe = false;
        this.wireframeOptions = new function(){
            this.wireframeLinecap = "round";
            this.wireframeLinejoin = "round";
            this.wireframeLinewidth = 0.9999;
        }
    }
}

function addGui(){
    var gui = new dat.GUI();
    gui.add(controls, 'cameraZ', 0, 10.0).listen();
    gui.add(controls.Material,'visible').listen();
    var materialFolderContext = gui.addFolder('Material Settings');
    materialFolderContext.add(controls.Material, 'transparent').onChange(function(value){
        if(value){
            transparentOptionsFolderContext.show();
            transparentOptionsFolderContext.open();
        }else{
            transparentOptionsFolderContext.hide();
            transparentOptionsFolderContext.close();
        }
    }).listen();
    var transparentOptionsFolderContext = materialFolderContext.addFolder('Opacity');
    transparentOptionsFolderContext.add(controls.Material.transparentOptions,'opacity',0.0,1.0).listen();
    transparentOptionsFolderContext.close();
    transparentOptionsFolderContext.hide();
    materialFolderContext.add(controls.Material,'flatShading').listen();

    materialFolderContext.add(controls.Material, 'alphaTest',0.0,1.0).listen();
    materialFolderContext.add(controls.Material,'depthWrite').listen();
    materialFolderContext.add(controls.Material,'depthTest').listen();
    materialFolderContext.add(controls.Material,'side',{
        Front                   :THREE.FrontSide,
        Back                    :THREE.BackSide,
        Double                  :THREE.DoubleSide
    }).listen();


    var StandardMaterialContext = gui.addFolder('Physical Material Settings');
    StandardMaterialContext.addColor(controls.StandardMaterial,'color').listen();
    StandardMaterialContext.addColor(controls.StandardMaterial,'emissive').listen();
    StandardMaterialContext.add(controls.StandardMaterial,'metalness',0.0,1.0).listen();
    StandardMaterialContext.add(controls.StandardMaterial,'roughness',0.0,1.0).listen();
    StandardMaterialContext.add(controls.StandardMaterial,'wireframe').onChange(function(value){
        if(value){
            wireframeOptionsFolderContext.show();
            wireframeOptionsFolderContext.open();
        }else{
            wireframeOptionsFolderContext.hide();
            wireframeOptionsFolderContext.close();
        }
    }).listen();
    var wireframeOptionsFolderContext = StandardMaterialContext.addFolder('Wireframe Settings');
    wireframeOptionsFolderContext.add(controls.StandardMaterial.wireframeOptions,'wireframeLinecap',{
        butt                     :"butt",
        round                    :"round",
        square                   :"square"
    }).listen();
    wireframeOptionsFolderContext.add(controls.StandardMaterial.wireframeOptions,'wireframeLinejoin',{
        bevel                    :"bevel",
        round                    :"round",
        miter                    :"miter"
    }).listen();
    wireframeOptionsFolderContext.add(controls.StandardMaterial.wireframeOptions,'wireframeLinewidth',0.0,1.0).listen()
    wireframeOptionsFolderContext.hide();
    wireframeOptionsFolderContext.close();



    return gui;
}


function main(){
    var gui = addGui();
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    var scene = new THREE.Scene();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(1,32,32);
    var material = new THREE.MeshStandardMaterial();
    material.needsUpdate = true;
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1,1,2.6);
    scene.add( directionalLight );
    
    function animate(){
        requestAnimationFrame(animate);
        camera.position.z = controls.cameraZ;
        setMaterialsOnControls(sphere.material);
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        renderer.render(scene,camera);
    }
    animate();
}

function setMaterialsOnControls(material){
    material.visible = controls.Material.visible;
    material.transparent = controls.Material.transparent;
    material.opacity = controls.Material.transparentOptions.opacity;
    material.alphaTest = controls.Material.alphaTest;
    material.depthWrite = controls.Material.depthWrite;
    material.depthTest = controls.Material.depthTest;
    material.side = controls.Material.side;
    material.flatShading = controls.Material.flatShading;

    material.color.setHex(controls.StandardMaterial.color);
    material.emissive.setHex(controls.StandardMaterial.emissive);
    material.emissiveIntensity = controls.StandardMaterial.emissiveIntensity;
    material.metalness = controls.StandardMaterial.metalness;
    material.roughness = controls.StandardMaterial.roughness;
    material.wireframe = controls.StandardMaterial.wireframe;
    material.wireframeLinecap = controls.StandardMaterial.wireframeOptions.wireframeLinecap;
    material.wireframeLinejoin = controls.StandardMaterial.wireframeOptions.wireframeLinejoin;
    material.wireframeLinewidth = controls.StandardMaterial.wireframeOptions.wireframeLinewidth;
}

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}