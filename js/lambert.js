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
    this.LambertMaterial = new function(){
        this.color = 0xffffff;
        this.emissive = 0x50505;
        this.emissiveIntensity = 0.9999;
        this.wireframe = false;
        this.wireframeOptions = new function(){
            this.wireframeLinecap = "round";
            this.wireframeLinejoin = "round";
            this.wireframeLinewidth = 0.9999;
        }
        this.reflectivity = 0.5;
        this.combine = THREE.MultiplyOperation;
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


    var LambertMaterialContext = gui.addFolder('Lambert Material Settings');
    LambertMaterialContext.addColor(controls.LambertMaterial,'color').listen();
    LambertMaterialContext.addColor(controls.LambertMaterial,'emissive').listen();
    LambertMaterialContext.add(controls.LambertMaterial,'wireframe').onChange(function(value){
        if(value){
            wireframeOptionsFolderContext.show();
            wireframeOptionsFolderContext.open();
        }else{
            wireframeOptionsFolderContext.hide();
            wireframeOptionsFolderContext.close();
        }
    }).listen();
    var wireframeOptionsFolderContext = LambertMaterialContext.addFolder('Wireframe Settings');
    wireframeOptionsFolderContext.add(controls.LambertMaterial.wireframeOptions,'wireframeLinecap',{
        butt                     :"butt",
        round                    :"round",
        square                   :"square"
    }).listen();
    wireframeOptionsFolderContext.add(controls.LambertMaterial.wireframeOptions,'wireframeLinejoin',{
        bevel                    :"bevel",
        round                    :"round",
        miter                    :"miter"
    }).listen();
    wireframeOptionsFolderContext.add(controls.LambertMaterial.wireframeOptions,'wireframeLinewidth',0.0,1.0).listen()
    wireframeOptionsFolderContext.hide();
    wireframeOptionsFolderContext.close();
    LambertMaterialContext.add(controls.LambertMaterial,'reflectivity',0.0,1.0).listen();
    LambertMaterialContext.add(controls.LambertMaterial,'combine',{
        Multiply                 :THREE.MultiplyOperation,
        Mix                      :THREE.MixOperation,
        Add                      :THREE.AddOperation
    }).listen();


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
    var material = new THREE.MeshLambertMaterial();
    material.needsUpdate = true;

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
        setMaterialsOnControls(sphere.material);
        setMaterialsOnControls(box.material);
        setMaterialsOnControls(plane.material);
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

    material.color.setHex(controls.LambertMaterial.color);
    material.emissive.setHex(controls.LambertMaterial.emissive);
    material.emissiveIntensity = controls.LambertMaterial.emissiveIntensity;
    material.wireframe = controls.LambertMaterial.wireframe;
    material.wireframeLinecap = controls.LambertMaterial.wireframeOptions.wireframeLinecap;
    material.wireframeLinejoin = controls.LambertMaterial.wireframeOptions.wireframeLinejoin;
    material.wireframeLinewidth = controls.LambertMaterial.wireframeOptions.wireframeLinewidth;
    material.reflectivity = controls.LambertMaterial.reflectivity;
    material.combine = controls.LambertMaterial.combine;
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