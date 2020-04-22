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
        this.map = 0;
        this.displacementOptions = new function(){
            this.displacementScale = 0.5;
            this.displacementBias = 0;
            this.normalScale = 1.0;
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


    var StandardMaterialContext = gui.addFolder('Standard Material Settings');
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
    StandardMaterialContext.add(controls.StandardMaterial,'map',{
        none                    :0,
        concrete                :1
    }).onChange(function(value){
        if(value == 1){
            displacementOptionsFolderContext.show();
            displacementOptionsFolderContext.open();
        }else{
            displacementOptionsFolderContext.hide();
            displacementOptionsFolderContext.close();
        }
    }).listen();

    var displacementOptionsFolderContext = StandardMaterialContext.addFolder('Displacement Settings');
    displacementOptionsFolderContext.add(controls.StandardMaterial.displacementOptions, 'displacementScale', 0, 1).listen();
    displacementOptionsFolderContext.add(controls.StandardMaterial.displacementOptions, 'displacementBias', -5, 5).listen();
    displacementOptionsFolderContext.add(controls.StandardMaterial.displacementOptions, 'normalScale', 0, 1).listen();
    displacementOptionsFolderContext.hide();
    displacementOptionsFolderContext.close();


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
    var loader = new THREE.TextureLoader();
    var concrete_texture = loader.load("textures/concrete_base.jpg");
    var concrete_displacement = loader.load("textures/concrete_height.png");
    var concrete_normal = loader.load("textures/concrete_normal.jpg");
    var concrete_roughness = loader.load("textures/concrete_roughness.jpg");


    var geometry = new THREE.SphereGeometry(1,32,32);
    
    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = -2.5;
    scene.add( sphere );

    var geometry1 = new THREE.BoxGeometry(1, 1, 1);
    var box = new THREE.Mesh(geometry1, material);
    box.position.x = 2.5;
    scene.add(box);

    var geometry2 = new THREE.PlaneGeometry(10000, 10000, 100, 100);
    var plane = new THREE.Mesh(geometry2, material);
    plane.rotation.x = -90 * Math.PI / 180;
    plane.position.y = -100;
    scene.add(plane);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1,1,2.6);
    scene.add( directionalLight );
    
    function animate(){
        requestAnimationFrame(animate);
        camera.position.z = controls.cameraZ;
        setMaterialsOnControls(material);
        if(controls.StandardMaterial.map == 0) {
            material.map = null;
            material.normalMap = null;
            material.displacementMap = null;
            material.roughnessMap = null;
        } else if(controls.StandardMaterial.map == 1) {
            material.map = concrete_texture;
            material.normalMap = concrete_normal;
            material.displacementMap = concrete_displacement;
            material.roughnessMap = concrete_roughness;
        }
        material.needsUpdate = true;
        rotateMesh(sphere);
        rotateMesh(box);
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
    material.displacementScale = controls.StandardMaterial.displacementOptions.displacementScale;
    material.displacementBias = controls.StandardMaterial.displacementOptions.displacementBias;
    material.normalScale = new THREE.Vector2(controls.StandardMaterial.displacementOptions.normalScale, controls.StandardMaterial.displacementOptions.normalScale);
}

function rotateMesh(mesh){
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
}

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}