var renderer, camera;

var controls = new function() {
    this.cameraZ = 5;
    this.displacementMap = 0;
    this.displacementScale = 1;
    this.displacementBias = 0;
    this.newGui = function() {
        var gui = new dat.GUI();
        gui.add(this, 'cameraZ', 0, 10.0);
        gui.add(this, 'displacementMap', {
            None: 0,
            Concrete: 1
        });
        gui.add(this, 'displacementScale', 0, 1);
        gui.add(this, 'displacementBias', 0, 10);
    }
}

function main(){

    var material = new THREE.MeshDepthMaterial();
    var concrete = new THREE.TextureLoader().load('textures/concrete_height.png');

    var gui = controls.newGui();

    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    var scene = new THREE.Scene();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);


    var geometry = new THREE.SphereGeometry(1,256,256);
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
        if (controls.displacementMap == 0) material.displacementMap = null;
        else if (controls.displacementMap == 1) material.displacementMap = concrete;
        material.needsUpdate = true;
        material.displacementScale = controls.displacementScale;
        material.displacementBias = controls.displacementBias;
        camera.position.z = controls.cameraZ;
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

function resize() {
    if (!camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}