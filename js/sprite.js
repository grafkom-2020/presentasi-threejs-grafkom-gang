var renderer, camera;

function addGui(gui, controls){
    gui.addColor(controls,'color').listen();
}

function main(){

    var spriteMap = new THREE.TextureLoader().load('textures/concrete_base.jpg');
    var material = new THREE.SpriteMaterial( { map: spriteMap});

    var controls = new Control(material);

    var gui = controls.newGui();

    controls.color = material.color.getHex();
    addGui(gui, controls);

    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    var scene = new THREE.Scene();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(1,32,32);
    
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 1, 1);
    scene.add(sprite);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1,1,2.6);
    scene.add( directionalLight );
    
    function animate(){
        requestAnimationFrame(animate);
        camera.position.z = controls.cameraZ;
        controls.setMaterialToThis(sprite.material);
        setMaterialOnControl(sprite.material, controls);
        rotateMesh(sprite);
        renderer.render(scene,camera);
    }
    animate();
}

function rotateMesh(mesh){
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
}

function setMaterialOnControl(material, controls){
    material.color.setHex(controls.color);
}

function resize() {
    if (!camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}