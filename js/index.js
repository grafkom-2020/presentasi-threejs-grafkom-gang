var renderer, camera;

function addGui(controls){
    var gui = new dat.GUI();
    gui.add(controls, 'cameraZ', 0, 10.0).listen();

    var material = gui.addFolder('material');
    material.add(controls, 'transparent').onChange(function(value){
        if(value){
            transparentOptionsFolderContext.show();
            transparentOptionsFolderContext.open();
        }else{
            transparentOptionsFolderContext.hide();
            transparentOptionsFolderContext.close();
        }
    }).listen();
    var transparentOptionsFolderContext = material.addFolder('Opacity');
    transparentOptionsFolderContext.add(controls.transparentOptions,'opacity',0.0,1.0).listen();
    transparentOptionsFolderContext.close();
    transparentOptionsFolderContext.hide();
    material.add(controls,'blending',{
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
    var customBlendingOptionsFolderContext = material.addFolder('Blending Options');
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
    material.add(controls,'alphaTest',0.0,1.0).listen();
    material.add(controls,'clipIntersection').listen();
    material.add(controls,'clipShadows').listen();
    material.add(controls,'colorWrite').listen();
    material.add(controls,'depthFunc',{
        LessEqual               :THREE.LessEqualDepth,
        Never                   :THREE.NeverDepth,
        Always                  :THREE.AlwaysDepth,
        Less                    :THREE.LessDepth,
        GreaterEqual            :THREE.GreaterEqualDepth,
        Greater                 :THREE.GreaterDepth,
        NotEqual                :THREE.NotEqualDepth
    }).listen();
    material.add(controls,'depthWrite').listen();
    material.add(controls,'stencilWrite').listen();
    material.add(controls,'stencilWriteMask').listen(); // gatau range nya sumpah
    material.add(controls,'stencilFunc',{
        Always                  :THREE.AlwaysStencilFunc,
        Never                   :THREE.NeverStencilFunc,
        Less                    :THREE.LessStencilFunc,
        Equal                   :THREE.EqualStencilFunc,
        LessEqual               :THREE.LessEqualStencilFunc,
        Greater                 :THREE.GreaterStencilFunc,
        NotEqual                :THREE.NotEqualStencilFunc,
        GreaterEqual            :THREE.GreaterEqualStencilFunc
    }).listen();
    material.add(controls,'stencilRef').listen();
    material.add(controls,'stencilFuncMask').listen(); // gatau range nya sumpah
    material.add(controls,'stencilFail',{
        Keep                    :THREE.KeepStencilOp,
        Zero                    :THREE.ZeroStencilOp,
        Replace                 :THREE.ReplaceStencilOp,
        Increment               :THREE.IncrementStencilOp,
        Decrement               :THREE.DecrementStencilOp,
        IncrementWrap           :THREE.IncrementWrapStencilOp,
        DecrementWrap           :THREE.DecrementWrapStencilOp,
        Invert                  :THREE.InvertStencilOp
    }).listen();
    material.add(controls,'stencilZFail',{
        Keep                    :THREE.KeepStencilOp,
        Zero                    :THREE.ZeroStencilOp,
        Replace                 :THREE.ReplaceStencilOp,
        Increment               :THREE.IncrementStencilOp,
        Decrement               :THREE.DecrementStencilOp,
        IncrementWrap           :THREE.IncrementWrapStencilOp,
        DecrementWrap           :THREE.DecrementWrapStencilOp,
        Invert                  :THREE.InvertStencilOp
    }).listen();
    material.add(controls,'stencilZPass',{
        Keep                    :THREE.KeepStencilOp,
        Zero                    :THREE.ZeroStencilOp,
        Replace                 :THREE.ReplaceStencilOp,
        Increment               :THREE.IncrementStencilOp,
        Decrement               :THREE.DecrementStencilOp,
        IncrementWrap           :THREE.IncrementWrapStencilOp,
        DecrementWrap           :THREE.DecrementWrapStencilOp,
        Invert                  :THREE.InvertStencilOp
    }).listen();
    material.add(controls,'flatShading').listen();
    material.add(controls,'fog').listen();
    material.add(controls,'polygonOffset').onChange(function(value){
        if(value){
            polygonOffsetOptionsFolderContext.show();
            polygonOffsetOptionsFolderContext.open();
        }else{
            polygonOffsetOptionsFolderContext.hide();
            polygonOffsetOptionsFolderContext.close();
        }
    }).listen();
    var polygonOffsetOptionsFolderContext = material.addFolder('Polygon Offset Options');
    polygonOffsetOptionsFolderContext.add(controls.polygonOffsetOptions,'polygonOffsetFactor',-10,10).listen();
    polygonOffsetOptionsFolderContext.add(controls.polygonOffsetOptions,'polygonOffsetUnits',-10,10).listen();
    polygonOffsetOptionsFolderContext.hide();
    polygonOffsetOptionsFolderContext.close();
    material.add(controls,'premultipliedAlpha').listen();
    material.add(controls,'dithering').listen();
    material.add(controls,'shadowSide',{
        Null                    :null,
        Front                   :THREE.FrontSide,
        Back                    :THREE.BackSide,
        Double                  :THREE.DoubleSide
    }).listen();
    material.add(controls,'side',{
        Front                   :THREE.FrontSide,
        Back                    :THREE.BackSide,
        Double                  :THREE.DoubleSide
    }).listen();
    material.add(controls,'toneMapped').listen();
    material.add(controls,'vertexColors').listen();
    material.add(controls,'visible').listen();
    
    return gui;
}

function addGuiMeshBasic(gui, controls){
    gui.addColor(controls,'color').listen();
}

function main(){

    var mat = document.getElementsByClassName("active")[0].innerHTML;
    var material = null;
    if (mat === 'MeshBasicMaterial') {
        material = new THREE.MeshBasicMaterial();
    } else if (mat === 'MeshNormalMaterial') {
        material = new THREE.MeshNormalMaterial();
    } else if (mat === 'LineBasicMaterial') {
        material = new THREE.LineBasicMaterial({
            linewidth : 2
        });
    } else if (mat === 'LineDashedMaterial') {
        material = new THREE.LineDashedMaterial();
    } else {
        material = new THREE.MeshBasicMaterial();
    }

    var controls = new function() {
        this.cameraZ = 5;
        this.transparent = material.transparent;
        this.transparentOptions = new function(){
            this.opacity = material.opacity;
        };
        this.alphaTest = material.alphaTest;
        this.blending = material.blending;
        this.blendingOptions = new function(){
            this.blendDst = THREE.OneMinusSrcAlphaFactor;
            this.blendDstAlpha = 0;
            this.blendEquation = THREE.AddEquation;
            this.blendEquationAlpha = 0;
            this.blendSrc = THREE.SrcAlphaFactor;
            this.blendSrcAlpha = 0;
        };
        this.clipIntersection = material.clipIntersection;
        this.clipShadows = material.clipShadows;
        this.colorWrite = material.colorWrite;
        this.depthFunc = material.depthFunc;
        this.depthWrite = material.depthWrite;
        this.stencilWrite = material.stencilWrite;
        this.stencilWriteMask = material.stencilWriteMask;
        this.stencilFunc = material.stencilFunc;
        this.stencilRef = material.stencilRef;
        this.stencilFuncMask = material.stencilFuncMask;
        this.stencilFail = material.stencilFail;
        this.stencilZFail = material.stencilZFail;
        this.stencilZPass = material.stencilZPass;
        this.flatShading = material.flatShading;
        this.fog = material.fog;
        this.polygonOffset = material.polygonOffset;
        this.polygonOffsetOptions = new function(){
            this.polygonOffsetFactor = material.polygonOffsetFactor;
            this.polygonOffsetUnits = material.polygonOffsetUnits;
        };
        this.premultipliedAlpha = material.premultipliedAlpha;
        this.dithering = material.dithering;
        this.shadowSide = material.shadowSide;
        this.side = material.side;
        this.toneMapped = material.toneMapped;
        this.vertexColors = material.vertexColors;
        this.visible = material.visible;
    }

    var gui = addGui(controls);

    if(material instanceof THREE.MeshBasicMaterial){
        controls.color = material.color.getHex();
        addGuiMeshBasic(gui, controls);
    }

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
        setMaterialsOnControls(sphere.material, controls);
        setMaterialsOnControls(box.material, controls);
        setMaterialsOnControls(plane.material, controls);
        if(material instanceof THREE.MeshBasicMaterial){
            setBasicMaterialOnControl(sphere.material, controls);
            setBasicMaterialOnControl(box.material, controls);
            setBasicMaterialOnControl(plane.material, controls);
        }
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

function setMaterialsOnControls(material, controls){
    material.transparent = controls.transparent;
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

function setBasicMaterialOnControl(material, controls){
    material.color.setHex(controls.color);
}

function resize() {
    if (!camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
}