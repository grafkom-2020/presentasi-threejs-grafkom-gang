var renderer, camera;

var controls = new function() {
    this.cameraZ = 5;
}

function main(){
    var gui = new dat.GUI();
    gui.add(controls, 'cameraZ', 0, 10.0);
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    var scene = new THREE.Scene();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(1,32,32);
    var material = new THREE.MeshStandardMaterial( { color: 0xffffff } );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1,1,2.6);
    scene.add( directionalLight );

    function animate(){
        requestAnimationFrame(animate);
        camera.position.z = controls.cameraZ;
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        renderer.render(scene,camera);
    }
    animate();
}

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}