var renderer, camera;

var controls = new function() {
    this.cameraZ = 5;
    this.alphaTest = 0.001;
    this.blending = {
        NormalBlending      :THREE.NormalBlending,
        NoBlending          :THREE.NoBlending,
        AdditiveBlending    :THREE.AdditiveBlending,
        SubstractiveBlending:THREE.SubtractiveBlending,
        MultiplyBlending    :THREE.MultiplyBlending,
        CustomBlending      :THREE.CustomBlending   
    };
    this.BlendingOptions = new function(){
        this.blendDst = {
            OneMinusSrcAlpha    :THREE.OneMinusSrcAlphaFactor, 
            Zero                :THREE.ZeroFactor, One:THREE.OneFactor, 
            SrcColor            :THREE.SrcColorFactor,
            OneMinusSrcColot    :THREE.OneMinusSrcColorFactor,
            SrcAlpha            :THREE.SrcAlphaFactor,
            DstColor            :THREE.DstColorFactor,
            OneMinusDstColor    :THREE.OneMinusDstColorFactor
        };
        this.blendDstAlpha = null;
        this.blendEquation = {
            Add: THREE.AddEquation, 
            Substract:THREE.SubtractEquation, 
            ReverseSubstract:THREE.ReverseSubtractEquation, 
            Min:THREE.MinEquation, 
            Max:THREE.MaxEquation
        };
        this.blendEquationAlpha = null;
        this.blendSrc = {
            OneMinusSrcAlpha    :THREE.OneMinusSrcAlphaFactor, 
            Zero                :THREE.ZeroFactor, One:THREE.OneFactor, 
            SrcColor            :THREE.SrcColorFactor,
            OneMinusSrcColot    :THREE.OneMinusSrcColorFactor,
            SrcAlpha            :THREE.SrcAlphaFactor,
            DstColor            :THREE.DstColorFactor,
            OneMinusDstColor    :THREE.OneMinusDstColorFactor,
            SrcAlphaSaturate    :THREE.SrcAlphaSaturateFactor
        };
        this.blendSrcAlpha = null;
    };
    this.clipIntersection = false;
    this.clipShadows = false;
    this.colorWrite = true;
    this.depthFunc = {
        LessEqual               :THREE.LessEqualDepth,
        Never                   :THREE.NeverDepth,
        Always                  :THREE.AlwaysDepth,
        Less                    :THREE.LessDepth,
        GreaterEqual            :THREE.GreaterEqualDepth,
        Greater                 :THREE.GreaterDepth,
        NotEqual                :THREE.NotEqualDepth
    };
    this.depthWrite = true;
    this.stencilWrite = false;
    this.stencilWriteMask = 0xFF;
    this.stencilFunc = {
        Always                  :THREE.AlwaysStencilFunc,
        Never                   :THREE.NeverStencilFunc,
        Less                    :THREE.LessStencilFunc,
        Equal                   :THREE.EqualStencilFunc,
        LessEqual               :THREE.LessEqualStencilFunc,
        Greater                 :THREE.GreaterStencilFunc,
        NotEqual                :THREE.NotEqualStencilFunc,
        GreaterEqual            :THREE.GreaterEqualStencilFunc
    };
    this.stencilRef = 0;
    this.stencilFuncMask = 0xFF;
    this.stencilFail = {
        Keep                    :THREE.KeepStencilOp,
        Zero                    :THREE.ZeroStencilOp,
        Replace                 :THREE.ReplaceStencilOp,
        Increment               :THREE.IncrementStencilOp,
        Decrement               :THREE.DecrementStencilOp,
        IncrementWrap           :THREE.IncrementWrapStencilOp,
        DecrementWrap           :THREE.DecrementWrapStencilOp,
        Invert                  :THREE.InvertStencilOp
    };
    this.stencilZFail = {
        Keep                    :THREE.KeepStencilOp,
        Zero                    :THREE.ZeroStencilOp,
        Replace                 :THREE.ReplaceStencilOp,
        Increment               :THREE.IncrementStencilOp,
        Decrement               :THREE.DecrementStencilOp,
        IncrementWrap           :THREE.IncrementWrapStencilOp,
        DecrementWrap           :THREE.DecrementWrapStencilOp,
        Invert                  :THREE.InvertStencilOp
    };
    this.stencilZPass = {
        Keep                    :THREE.KeepStencilOp,
        Zero                    :THREE.ZeroStencilOp,
        Replace                 :THREE.ReplaceStencilOp,
        Increment               :THREE.IncrementStencilOp,
        Decrement               :THREE.DecrementStencilOp,
        IncrementWrap           :THREE.IncrementWrapStencilOp,
        DecrementWrap           :THREE.DecrementWrapStencilOp,
        Invert                  :THREE.InvertStencilOp
    };
    this.flatShading = false;
    this.fog = true;
    this.transparent = false;
    this.transparentOptions = new function(){
        this.opacity = 0.99;
    };
    this.polygonOffset = false;
    this.polygonOffsetOptions = new function(){
        this.polygonOffsetFactor = 0;
        this.polygonOffsetUnits = 0;
    };
    this.premultipliedAlpha = false;
    this.dithering = false;
    this.shadowSide = {
        Null                    :null,
        Front                   :THREE.FrontSide,
        Back                    :THREE.FrontSide,
        Double                  :THREE.DoubleSide
    };
    this.side = {
        Front                   :THREE.FrontSide,
        Back                    :THREE.FrontSide,
        Double                  :THREE.DoubleSide
    };
    this.toneMapped = true;
    this.vertexColors = false;
    this.visible = true;
}

function addGui(){
    var gui = new dat.GUI();
    gui.add(controls, 'cameraZ', 0, 10.0);
    var transparentOptionsFolderContext = null;
    gui.add(controls, 'transparent').onChange(function(value){
        if(value){
            transparentOptionsFolderContext = gui.addFolder('Opacity');
            transparentOptionsFolderContext.add(controls.transparentOptions,'opacity',0.0,1.0);
        }else{
            gui.removeFolder(transparentOptionsFolderContext);
            transparentOptionsFolderContext = null;
        }
    });
    
    
    
    return gui;
}


function main(){
    var gui = addGui(gui);
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    var scene = new THREE.Scene();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(1,32,32);
    var material = new THREE.MeshStandardMaterial( { color: 0xffffff , alphaTest : 0.5} );
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1,1,2.6);
    scene.add( directionalLight );

    function animate(){
        requestAnimationFrame(animate);
        camera.position.z = controls.cameraZ;
        sphere.material.transparent = controls.transparent;
        sphere.material.opacity = controls.transparentOptions.opacity;
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