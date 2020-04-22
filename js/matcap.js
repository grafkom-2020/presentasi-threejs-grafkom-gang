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
    this.MatcapMaterial = new function(){
        this.color = 0xffffff;
        this.matcap = 1;
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


    var MatcapMaterialContext = gui.addFolder('Matcap Material Settings');
    MatcapMaterialContext.addColor(controls.MatcapMaterial,'color').listen();
    MatcapMaterialContext.add(controls.MatcapMaterial,'matcap',{
        none                    :0,
        porcelain_white         :1,
        shiny                   :2,
        metal                   :3,
        frosted                 :4
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
    var material = new THREE.MeshMatcapMaterial();
    
    material.needsUpdate = true;

    var loader = new THREE.TextureLoader();
    var porcelain_white = loader.load("textures/matcap-porcelain-white.jpg");
    var shiny = loader.load("textures/matcap-shiny.jpg");
    var metal = loader.load("textures/matcap-metal.jpg");
    var frosted = loader.load("textures/matcap-frosted.jpg");

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
        if(controls.MatcapMaterial.matcap == 0) material.matcap = null;
        else if(controls.MatcapMaterial.matcap == 1) material.matcap = porcelain_white;
        else if (controls.MatcapMaterial.matcap == 2) material.matcap = shiny;
        else if (controls.MatcapMaterial.matcap == 3) material.matcap = metal;
        else if (controls.MatcapMaterial.matcap == 4) material.matcap = frosted;
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

    material.color.setHex(controls.MatcapMaterial.color);
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