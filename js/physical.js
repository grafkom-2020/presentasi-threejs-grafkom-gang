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
        this.visible = true;
    }
    this.PhysicalMaterial = new function(){
        this.color = 0xffffff;
        this.clearcoat = 0.00001;
        this.clearcoatRoughness = 0.00001;
        this.reflectivity = 0.5;
        this.metalness  = 0.00001;
        this.roughness = 0.4;
        this.transparency = 0.00001;
        this.wireframe = false;
        this.wireframeOptions = new function(){
            this.wireframeLinecap = "round";
            this.wireframeLinejoin = "round";
            this.wireframeLinewidth = 0.9999;
        }
        this.map = 1;
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

    materialFolderContext.add(controls.Material, 'alphaTest',0.0,1.0).listen();
    materialFolderContext.add(controls.Material,'depthWrite').listen();
    materialFolderContext.add(controls.Material,'depthTest').listen();
    materialFolderContext.add(controls.Material,'side',{
        Front                   :THREE.FrontSide,
        Back                    :THREE.BackSide,
        Double                  :THREE.DoubleSide
    }).listen();


    var physicalMaterialContext = gui.addFolder('Physical Material Settings');
    physicalMaterialContext.addColor(controls.PhysicalMaterial,'color').listen();
    physicalMaterialContext.add(controls.PhysicalMaterial,'clearcoat',0.0,1.0).listen();
    physicalMaterialContext.add(controls.PhysicalMaterial,'clearcoatRoughness',0.0,1.0).listen();
    physicalMaterialContext.add(controls.PhysicalMaterial,'reflectivity',0.0,1.0).listen();
    physicalMaterialContext.add(controls.PhysicalMaterial, 'roughness', 0.0, 1.0).listen();
    physicalMaterialContext.add(controls.PhysicalMaterial, 'metalness', 0.0, 1.0).listen();
    physicalMaterialContext.add(controls.PhysicalMaterial,'transparency',0.0,1.0).listen();
    physicalMaterialContext.add(controls.PhysicalMaterial,'wireframe').onChange(function(value){
        if(value){
            wireframeOptionsFolderContext.show();
            wireframeOptionsFolderContext.open();
        }else{
            wireframeOptionsFolderContext.hide();
            wireframeOptionsFolderContext.close();
        }
    }).listen();
    var wireframeOptionsFolderContext = physicalMaterialContext.addFolder('Wireframe Settings');
    wireframeOptionsFolderContext.add(controls.PhysicalMaterial.wireframeOptions,'wireframeLinecap',{
        butt                     :"butt",
        round                    :"round",
        square                   :"square"
    }).listen();
    wireframeOptionsFolderContext.add(controls.PhysicalMaterial.wireframeOptions,'wireframeLinejoin',{
        bevel                    :"bevel",
        round                    :"round",
        miter                    :"miter"
    }).listen();
    wireframeOptionsFolderContext.add(controls.PhysicalMaterial.wireframeOptions,'wireframeLinewidth',0.0,1.0).listen()
    wireframeOptionsFolderContext.hide();
    wireframeOptionsFolderContext.close();
    physicalMaterialContext.add(controls.PhysicalMaterial,'map',{
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

    var displacementOptionsFolderContext = physicalMaterialContext.addFolder('Displacement Settings');
    displacementOptionsFolderContext.add(controls.PhysicalMaterial.displacementOptions, 'displacementScale', 0, 1).listen();
    displacementOptionsFolderContext.add(controls.PhysicalMaterial.displacementOptions, 'displacementBias', -5, 5).listen();
    displacementOptionsFolderContext.add(controls.PhysicalMaterial.displacementOptions, 'normalScale', 0, 1).listen();
    displacementOptionsFolderContext.open();
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
    
    var material = new THREE.MeshPhysicalMaterial();
    var loader = new THREE.TextureLoader();
    var concrete_texture = loader.load("textures/concrete_base.jpg");
    var concrete_displacement = loader.load("textures/concrete_height.png");
    var concrete_normal = loader.load("textures/concrete_normal.jpg");
    var concrete_roughness = loader.load("textures/concrete_roughness.jpg");

    var sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = -2.5;
    scene.add( sphere );

    var geometry1 = new THREE.BoxGeometry(1, 1, 1, 32, 32, 32);
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
        if(controls.PhysicalMaterial.map == 0) {
            material.map = null;
            material.normalMap = null;
            material.displacementMap = null;
            material.roughnessMap = null;
        } else if(controls.PhysicalMaterial.map == 1) {
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

    material.color.setHex(controls.PhysicalMaterial.color);
    material.clearcoat = controls.PhysicalMaterial.clearcoat;
    material.clearcoatRoughness = controls.PhysicalMaterial.clearcoatRoughness;
    material.reflectivity = controls.PhysicalMaterial.reflectivity;
    material.transparency = controls.PhysicalMaterial.transparency;
    material.wireframe = controls.PhysicalMaterial.wireframe;
    material.wireframeLinecap = controls.PhysicalMaterial.wireframeOptions.wireframeLinecap;
    material.wireframeLinejoin = controls.PhysicalMaterial.wireframeOptions.wireframeLinejoin;
    material.wireframeLinewidth = controls.PhysicalMaterial.wireframeOptions.wireframeLinewidth;
    material.metalness = controls.PhysicalMaterial.metalness;
    material.roughness = controls.PhysicalMaterial.roughness;
    material.displacementScale = controls.PhysicalMaterial.displacementOptions.displacementScale;
    material.displacementBias = controls.PhysicalMaterial.displacementOptions.displacementBias;
    material.normalScale = new THREE.Vector2(controls.PhysicalMaterial.displacementOptions.normalScale, controls.PhysicalMaterial.displacementOptions.normalScale);
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