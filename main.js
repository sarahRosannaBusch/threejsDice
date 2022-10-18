"use strict"

/** 
 * @filename    main.js
 * @brief       dice polyhedrons with numbered faces
 * @author      Sarah Rosanna Busch
 * @version     0
 * @date        17 Oct 2022
 */


var main = (function() {
    var that = {}; //public methods and objects
    var elem = {}; //dom elements

    that.init = function() {
        _solidPrimitives();
    }

    function _solidPrimitives() {
        const canvas = f.html.getElem('#f');
        const renderer = new THREE.WebGLRenderer({canvas, antialias: true}); //antialias smooths lines

        const fov = 40;
        const aspect = 2;  // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 120;
        camera.position.y = 0;
        camera.position.x = 0;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        
        renderer.render(scene, camera);

        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);

        const objects = [];
        const spread = 15;
         
        // Create mesh and add to scene
        function addSolidGeometry(x, y, geometry) {
            const mesh = new THREE.Mesh(geometry, createMaterial());
            addObject(x, y, mesh);

            function addObject(x, y, obj) {
                obj.position.x = x * spread;
                obj.position.y = y * spread;         
                scene.add(obj);
                objects.push(obj);
              }
      
              function createMaterial() { //with random colour
                  const material = new THREE.MeshPhongMaterial();           
                  const hue = Math.random(); // 0=red .33=green .66=blue
                  const saturation = 1; // 0=no colour
                  const luminance = .5; // 0=black 1=white .5=max colour
                  material.color.setHSL(hue, saturation, luminance);           
                  return material;
              }
        }   

        function createD2(x, y) {
            const radiusTop = 4;  // ui: radiusTop
            const radiusBottom = 4;  // ui: radiusBottom
            const height = 8;  // ui: height
            const radialSegments = 12;  // ui: radialSegments
            const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
            addSolidGeometry(x, y, geometry);
        }

        function createD3(x, y) {
            const width = 8;
            const height = 8;
            const depth = 8;
            const geometry = new THREE.BoxGeometry(width, height, depth);
            addSolidGeometry(x, y, geometry);
        }     

        function createD4(x, y) {
            const radius = 7;  // ui: radius
            const geometry = new THREE.TetrahedronGeometry(radius);
            addSolidGeometry(x, y, geometry);
        }

        function createD6(x, y) {
            const width = 8;
            const height = 8;
            const depth = 8;
            const geometry = new THREE.BoxGeometry(width, height, depth);
            addSolidGeometry(x, y, geometry);
        }

        function createD12(x, y) {
            const radius = 7;  // ui: radius
            const geometry = new THREE.DodecahedronGeometry(radius);
            addSolidGeometry(x, y, geometry);
        }

        function createD20(x, y) {
            const radius = 7;  // ui: radius
            const geometry = new THREE.IcosahedronGeometry(radius);
            addSolidGeometry(x, y, geometry);
        }

        function createD8(x, y) {
            const radius = 7;  // ui: radius
            const geometry = new THREE.OctahedronGeometry(radius);
            addSolidGeometry(x, y, geometry);
        }

        function createD10(x, y) {
            //vertices and faces taken from https://aqandrew.com/blog/10-sided-die-react/
            const sides = 10;
            const vertices = [
              [0, 0, 1],
              [0, 0, -1],
            ].flat();
          
            for (let i = 0; i < sides; ++i) {
              const b = (i * Math.PI * 2) / sides;
              vertices.push(-Math.cos(b), -Math.sin(b), 0.105 * (i % 2 ? 1 : -1));
            }

            const faces = [
                [0, 2, 3],
                [0, 3, 4],
                [0, 4, 5],
                [0, 5, 6],
                [0, 6, 7],
                [0, 7, 8],
                [0, 8, 9],
                [0, 9, 10],
                [0, 10, 11],
                [0, 11, 2],
                [1, 3, 2],
                [1, 4, 3],
                [1, 5, 4],
                [1, 6, 5],
                [1, 7, 6],
                [1, 8, 7],
                [1, 9, 8],
                [1, 10, 9],
                [1, 11, 10],
                [1, 2, 11],
            ].flat();

            const radius = 7;  
            const detail = 0;
            const geometry = new THREE.PolyhedronGeometry(vertices, faces, radius, detail);
            addSolidGeometry(x, y, geometry);
        }

        createD2(-2, 2);
        createD3(0, 2);
        createD4(2, 2);
        createD6(-2, 0);
        createD8(0, 0);
        createD10(2, 0);
        createD10(-2, -2);
        createD12(0, -2);
        createD20(2, -2);


        //animate
        function render(time) {
            time *= 0.001;  // convert time to seconds  
            
            //to change resolution if necessary (for smooth edges)
            if(_resizeRendererToDisplaySize(renderer)) {
                const canvas = renderer.domElement;
                camera.aspect = canvas.clientWidth / canvas.clientHeight;
                camera.updateProjectionMatrix();
            }

            objects.forEach((obj, i) => {
                obj.rotation.y = time;
                obj.rotation.x = time;
            });

            //to make responsive (so blocks don't stretch)
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();   
        
            renderer.render(scene, camera);           
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render); //req to browser
    }

    //return true if the canvas resolution needs to change
    function _resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    return that;
}());