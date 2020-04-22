var renderer, camera;

function addLineDashed(gui, controls){
    gui.addColor(controls,'color').listen();
    gui.add(controls, 'dashSize', 0.0, 10.0);
    gui.add(controls, 'gapSize', 0.0, 10.0);
    gui.add(controls, 'scale', 0.0, 10.0);
}

function main(){

    var material = new THREE.LineDashedMaterial();
    material.gapSize = 4;

    var controls = new Control(material);

    var gui = controls.newGui();

    controls.color = material.color.getHex();
    controls.dashSize = material.dashSize;
    controls.gapSize = material.gapSize;
    controls.scale = material.scale;
    addLineDashed(gui, controls);

    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    var scene = new THREE.Scene();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);


    var geometry = new THREE.SphereGeometry(1,32,32);
    var sphere = new THREE.Line( geometry, material );
    sphere.computeLineDistances();
    sphere.position.x = -2.5;
    scene.add( sphere );

    var geometry1 = new THREE.BoxGeometry(1, 1, 1);
    var box = new THREE.Line(geometry1, material);
    box.computeLineDistances();
    box.position.x = 2.5;
    scene.add(box);

    var geometry2 = new THREE.PlaneGeometry(10000, 10000, 100, 100);
    var plane = new THREE.Line(geometry2, material);
    plane.computeLineDistances();
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
        setLineDashedMaterialOnControl(sphere.material, controls);
        setLineDashedMaterialOnControl(box.material, controls);
        setLineDashedMaterialOnControl(plane.material, controls);
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

function setLineDashedMaterialOnControl(material, controls){
    material.color.setHex(controls.color);
    material.dashSize = controls.dashSize;
    material.gapSize = controls.gapSize;
    material.scale = controls.scale;
}

function resize() {
    if (!camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}