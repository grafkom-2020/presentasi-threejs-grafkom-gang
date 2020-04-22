var renderer, camera;

var controls = new function() {
    this.cameraZ = 5;
    this.color = 0xffffff;
    this.transparent = false;
    this.transparentOptions = new function(){
        this.opacity = 0.9999;
    };
    this.alphaTest = 0.00001;
    this.blending = THREE.NormalBlending;
    this.blendingOptions = new function(){
        this.blendDst = THREE.OneMinusSrcAlphaFactor;
        this.blendDstAlpha = 0;
        this.blendEquation = THREE.AddEquation;
        this.blendEquationAlpha = 0;
        this.blendSrc = THREE.SrcAlphaFactor;
        this.blendSrcAlpha = 0;
    };
    this.clipIntersection = false;
    this.clipShadows = false;
    this.colorWrite = true;
    this.depthFunc = THREE.LessEqualDepth;
    this.depthWrite = true;
    this.stencilWrite = false;
    this.stencilWriteMask = 0xFF;
    this.stencilFunc = THREE.AlwaysStencilFunc;
    this.stencilRef = 0;
    this.stencilFuncMask = 0xFF;
    this.stencilFail = THREE.KeepStencilOp;
    this.stencilZFail = THREE.KeepStencilOp;
    this.stencilZPass = THREE.KeepStencilOp;
    this.flatShading = false;
    this.fog = true;
    this.polygonOffset = false;
    this.polygonOffsetOptions = new function(){
        this.polygonOffsetFactor = 0;
        this.polygonOffsetUnits = 0;
    };
    this.premultipliedAlpha = false;
    this.dithering = false;
    this.shadowSide = null;
    this.side = THREE.FrontSide;
    this.toneMapped = true;
    this.vertexColors = false;
    this.visible = true;
}

function addGui(){
    var gui = new dat.GUI();
    gui.add(controls, 'cameraZ', 0, 10.0).listen();
    gui.addColor(controls,'color').listen();
    gui.add(controls, 'transparent').onChange(function(value){
        if(value){
            transparentOptionsFolderContext.show();
            transparentOptionsFolderContext.open();
        }else{
            transparentOptionsFolderContext.hide();
            transparentOptionsFolderContext.close();
        }
    }).listen();
    var transparentOptionsFolderContext = gui.addFolder('Opacity');
    transparentOptionsFolderContext.add(controls.transparentOptions,'opacity',0.0,1.0).listen();
    transparentOptionsFolderContext.close();
    transparentOptionsFolderContext.hide();
    gui.add(controls,'blending',{
        NormalBlending      :THREE.NormalBlending,
        NoBlending          :THREE.NoBlending,
        AdditiveBlending    :THREE.AdditiveBlending,
        SubstractiveBlending:THREE.SubtractiveBlending,
        MultiplyBlending    :THREE.MultiplyBlending,
        CustomBlending      :THREE.CustomBlending,
    }).onChange(function(value){
        if(value == THREE.CustomBlending){
           customBlendingOptionsFolderContext.show();
           customBlendingOptionsFolderContext.open();
        }else{
            customBlendingOptionsFolderContext.hide();
            customBlendingOptionsFolderContext.close();
        }
    }).listen();
    var customBlendingOptionsFolderContext = gui.addFolder('Blending Options');
    customBlendingOptionsFolderContext.add(controls.blendingOptions,'blendDst',{
        Zero                :THREE.ZeroFactor, 
        One                 :THREE.OneFactor, 
        SrcColor            :THREE.SrcColorFactor,
        OneMinusSrcColor    :THREE.OneMinusSrcColorFactor,
        SrcAlpha            :THREE.SrcAlphaFactor,
        OneMinusSrcAlpha    :THREE.OneMinusSrcAlphaFactor,
        OneMinusDstAlpha    :THREE.DstAlphaFactor,
        OneMinusDstAlpha    :THREE.OneMinusDstAlphaFactor,
        DstColor            :THREE.DstColorFactor,
        OneMinusDstColor    :THREE.OneMinusDstColorFactor
    }).listen();
    customBlendingOptionsFolderContext.add(controls.blendingOptions,'blendDstAlpha',-10,10).listen();
    customBlendingOptionsFolderContext.add(controls.blendingOptions,'blendEquation',{
        Add                 :THREE.AddEquation, 
        Substract           :THREE.SubtractEquation, 
        ReverseSubstract    :THREE.ReverseSubtractEquation, 
        Min                 :THREE.MinEquation,
        Max                 :THREE.MaxEquation
    }).listen();
    customBlendingOptionsFolderContext.add(controls.blendingOptions,'blendEquationAlpha',-10,10).listen();
    customBlendingOptionsFolderContext.add(controls.blendingOptions,'blendSrc',{
        Zero                :THREE.ZeroFactor, 
        One                 :THREE.OneFactor, 
        SrcColor            :THREE.SrcColorFactor,
        OneMinusSrcColor    :THREE.OneMinusSrcColorFactor,
        SrcAlpha            :THREE.SrcAlphaFactor,
        OneMinusSrcAlpha    :THREE.OneMinusSrcAlphaFactor,
        OneMinusDstAlpha    :THREE.DstAlphaFactor,
        OneMinusDstAlpha    :THREE.OneMinusDstAlphaFactor,
        DstColor            :THREE.DstColorFactor,
        OneMinusDstColor    :THREE.OneMinusDstColorFactor,
        SrcAlphaSaturate    :THREE.SrcAlphaSaturateFactor
    }).listen();
    customBlendingOptionsFolderContext.add(controls.blendingOptions,'blendSrcAlpha',-10,10).listen();
    customBlendingOptionsFolderContext.hide();
    customBlendingOptionsFolderContext.close();
    gui.add(controls,'alphaTest',0.0,1.0).listen();
    gui.add(controls,'clipIntersection').listen();
    gui.add(controls,'clipShadows').listen();
    gui.add(controls,'colorWrite').listen();
    gui.add(controls,'depthFunc',{
        LessEqual               :THREE.LessEqualDepth,
        Never                   :THREE.NeverDepth,
        Always                  :THREE.AlwaysDepth,
        Less                    :THREE.LessDepth,
        GreaterEqual            :THREE.GreaterEqualDepth,
        Greater                 :THREE.GreaterDepth,
        NotEqual                :THREE.NotEqualDepth
    }).listen();
    gui.add(controls,'depthWrite').listen();
    gui.add(controls,'stencilWrite').listen();
    gui.add(controls,'stencilWriteMask').listen(); // gatau range nya sumpah
    gui.add(controls,'stencilFunc',{
        Always                  :THREE.AlwaysStencilFunc,
        Never                   :THREE.NeverStencilFunc,
        Less                    :THREE.LessStencilFunc,
        Equal                   :THREE.EqualStencilFunc,
        LessEqual               :THREE.LessEqualStencilFunc,
        Greater                 :THREE.GreaterStencilFunc,
        NotEqual                :THREE.NotEqualStencilFunc,
        GreaterEqual            :THREE.GreaterEqualStencilFunc
    }).listen();
    gui.add(controls,'stencilRef').listen();
    gui.add(controls,'stencilFuncMask').listen(); // gatau range nya sumpah
    gui.add(controls,'stencilFail',{
        Keep                    :THREE.KeepStencilOp,
        Zero                    :THREE.ZeroStencilOp,
        Replace                 :THREE.ReplaceStencilOp,
        Increment               :THREE.IncrementStencilOp,
        Decrement               :THREE.DecrementStencilOp,
        IncrementWrap           :THREE.IncrementWrapStencilOp,
        DecrementWrap           :THREE.DecrementWrapStencilOp,
        Invert                  :THREE.InvertStencilOp
    }).listen();
    gui.add(controls,'stencilZFail',{
        Keep                    :THREE.KeepStencilOp,
        Zero                    :THREE.ZeroStencilOp,
        Replace                 :THREE.ReplaceStencilOp,
        Increment               :THREE.IncrementStencilOp,
        Decrement               :THREE.DecrementStencilOp,
        IncrementWrap           :THREE.IncrementWrapStencilOp,
        DecrementWrap           :THREE.DecrementWrapStencilOp,
        Invert                  :THREE.InvertStencilOp
    }).listen();
    gui.add(controls,'stencilZPass',{
        Keep                    :THREE.KeepStencilOp,
        Zero                    :THREE.ZeroStencilOp,
        Replace                 :THREE.ReplaceStencilOp,
        Increment               :THREE.IncrementStencilOp,
        Decrement               :THREE.DecrementStencilOp,
        IncrementWrap           :THREE.IncrementWrapStencilOp,
        DecrementWrap           :THREE.DecrementWrapStencilOp,
        Invert                  :THREE.InvertStencilOp
    }).listen();
    gui.add(controls,'flatShading').listen();
    gui.add(controls,'fog').listen();
    gui.add(controls,'polygonOffset').onChange(function(value){
        if(value){
            polygonOffsetOptionsFolderContext.show();
            polygonOffsetOptionsFolderContext.open();
        }else{
            polygonOffsetOptionsFolderContext.hide();
            polygonOffsetOptionsFolderContext.close();
        }
    }).listen();
    var polygonOffsetOptionsFolderContext = gui.addFolder('Polygon Offset Options');
    polygonOffsetOptionsFolderContext.add(controls.polygonOffsetOptions,'polygonOffsetFactor',-10,10).listen();
    polygonOffsetOptionsFolderContext.add(controls.polygonOffsetOptions,'polygonOffsetUnits',-10,10).listen();
    polygonOffsetOptionsFolderContext.hide();
    polygonOffsetOptionsFolderContext.close();
    gui.add(controls,'premultipliedAlpha').listen();
    gui.add(controls,'dithering').listen();
    gui.add(controls,'shadowSide',{
        Null                    :null,
        Front                   :THREE.FrontSide,
        Back                    :THREE.BackSide,
        Double                  :THREE.DoubleSide
    }).listen();
    gui.add(controls,'side',{
        Front                   :THREE.FrontSide,
        Back                    :THREE.BackSide,
        Double                  :THREE.DoubleSide
    }).listen();
    gui.add(controls,'toneMapped').listen();
    gui.add(controls,'vertexColors').listen();
    gui.add(controls,'visible').listen();
    
    return gui;
}


function main(){
    var gui = addGui(gui);
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight, 0.1, 1000);
    var scene = new THREE.Scene();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var mat = document.getElementsByClassName("active")[0].innerHTML;
    var material = null;
    if (mat === 'MeshBasicMaterial') {
        material = new THREE.MeshBasicMaterial();
    } else if (mat === 'MeshNormalMaterial') {
        material = new THREE.MeshNormalMaterial();
    } else {
        material = new THREE.MeshBasicMaterial();
    }

    var geometry = new THREE.SphereGeometry(1,32,32);
    var sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1,1,2.6);
    scene.add( directionalLight );
    
    function animate(){
        requestAnimationFrame(animate);
        camera.position.z = controls.cameraZ;
        setMaterialsOnControls(sphere.material);
        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;
        renderer.render(scene,camera);
    }
    animate();
}

function setMaterialsOnControls(material){
    material.transparent = controls.transparent;
    if (material instanceof THREE.MeshBasicMaterial) material.color.setHex(controls.color);
    material.opacity = controls.transparentOptions.opacity;
    material.alphaTest = controls.alphaTest;
    material.blending = controls.blending;
    material.blendDst = controls.blendingOptions.blendDst;
    material.blendDstAlpha = controls.blendingOptions.blendDstAlpha;
    material.blendEquation = controls.blendingOptions.blendEquation;
    material.blendEquationAlpha = controls.blendingOptions.blendEquationAlpha;
    material.blendSrc = controls.blendingOptions.blendSrc;
    material.blendSrcAlpha = controls.blendingOptions.blendSrcAlpha;
    material.clipIntersection = controls.clipIntersection;
    material.clipShadows = controls.clipShadows;
    material.colorWrite = controls.colorWrite;
    material.depthFunc = controls.depthFunc;
    material.depthWrite = controls.depthWrite;
    material.stencilWrite = controls.stencilWrite;
    material.stencilWriteMask = controls.stencilWriteMask;
    material.stencilFunc = controls.stencilFunc;
    material.stencilRef = controls.stencilRef;
    material.stencilFuncMask = controls.stencilFuncMask;
    material.stencilFail = controls.stencilFail;
    material.stencilZFail = controls.stencilZFail;
    material.stencilZPass = controls.stencilZPass;
    material.flatShading = controls.flatShading;
    material.fog = controls.fog;
    material.polygonOffset = controls.polygonOffset;
    material.polygonOffsetFactor = controls.polygonOffsetOptions.polygonOffsetFactor;
    material.polygonOffsetUnits = controls.polygonOffsetOptions.polygonOffsetUnits;
    material.premultipliedAlpha = controls.premultipliedAlpha;
    material.dithering = controls.dithering;
    material.shadowSide = controls.shadowSide;
    material.side = controls.side;
    material.toneMapped = controls.toneMapped;
    material.vertexColors = controls.vertexColors;
    material.visible = controls.visible;

}

function resize() {
    if (!camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}