var renderer, camera;

var extraControls = new function() {
    this.texture = 0;
}

function addGuiMeshBasic(gui, controls){
    gui.addColor(controls,'color').listen();
    gui.add(extraControls, 'texture', {
        None: 0,
        Concrete: 1
    });
}

function main(){

    var material = new THREE.MeshBasicMaterial();
    var concrete = new THREE.TextureLoader().load('textures/concrete_base.jpg');

    var controls = new Control(material);

    var gui = controls.newGui();

    controls.color = material.color.getHex();
    addGuiMeshBasic(gui, controls);

    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    var scene = new THREE.Scene();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);


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
        controls.setMaterialToThis(sphere.material);
        controls.setMaterialToThis(box.material);
        controls.setMaterialToThis(plane.material);
        if (extraControls.texture == 0) {
            sphere.material.map = null;
            box.material.map = null;
            plane.material.map = null;
        } else if (extraControls.texture == 1) {
            sphere.material.map = concrete;
            box.material.map = concrete;
            plane.material.map = concrete;
        }
        sphere.material.needsUpdate = true;
        box.material.needsUpdate = true;
        plane.material.needsUpdate = true;
        setBasicMaterialOnControl(sphere.material, controls);
        setBasicMaterialOnControl(box.material, controls);
        setBasicMaterialOnControl(plane.material, controls);
        rotateMesh(sphere);
        rotateMesh(box);
        renderer.render(scene,camera);
    }
    animate();
}

function rotateMesh(mesh){
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
}

function setBasicMaterialOnControl(material, controls){
    material.color.setHex(controls.color);
}

function resize() {
    if (!camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}