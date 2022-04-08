var camera;
var renderer;
var controls;
var scene = new THREE.Scene();
var home;
var helper_size;
var building = {};

  let apis = {
    bounding: {
      api:"https://api.openstreetmap.org/api/0.6/map?bbox=",
      url: (left, bottom, right, top) => {
        return apis.bounding.api + left + "," + bottom + "," + right + "," + top;
      }
    },
    get_relation: {
      api:"https://api.openstreetmap.org/api/0.6/relation/",
      parameters:"/full",
      url: (relation_id) => {
        return apis.get_relation.api + relation_id + apis.get_relation.parameters;
      }
    },
    get_way: {
      api:"https://api.openstreetmap.org/api/0.6/way/",
      parameters:"/full",
      url: (way_id) => {
        return apis.get_way.api + way_id + apis.get_way.parameters;
      }
    }
  };

/**
 * Initialize the screen
 */
function init() {
  var type = "way";
  var id = 66418809;
  if (window.location.search.substr(1) !== null) {
    window.location.search.substr(1).split("&")
      .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === "type") {
          type = decodeURIComponent(tmp[1]);
        } else if (tmp[0] === "id") {
          id = decodeURIComponent(tmp[1]);
        }
      });
  }
  Building.create(type, id).then(function(myObj){
      myObj.render();
  });
  camera = new THREE.PerspectiveCamera(
    50,
    document.documentElement.clientWidth /
      document.documentElement.clientHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({
    alpha: false
  });
  renderer.setSize(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight-20
  );
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.zIndex = 0;
  renderer.domElement.style.top = 0;
  document.body.appendChild(renderer.domElement);
}

/**
 * Create the scene
 */
function createScene() {
  addLights();
 
  camera.position.set(0, 0, 200); // x y z
  
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  function render() {
    requestAnimationFrame(render);

    renderer.render(scene, camera);
  }
  render();
}

function addLights() {
  const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.2 );
  scene.add( ambientLight );
  
  var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.position.set( -1, 0.75, 1 );
  dirLight.position.multiplyScalar( 1000 );
  //dirLight.name = "dirlight";
   // dirLight.shadowCameraVisible = true;

   scene.add( dirLight );

   //dirLight.castShadow = true;
   //dirLight.shadowMapWidth = dirLight.shadowMapHeight = 1024*2;

   //var d = 300;

   //dirLight.shadowCameraLeft = -d;
   //dirLight.shadowCameraRight = d;
   //dirLight.shadowCameraTop = d;
   //dirLight.shadowCameraBottom = -d;

   //dirLight.shadowCameraFar = 3500;
   //dirLight.shadowBias = -0.0001;
   //dirLight.shadowDarkness = 0.35;
}

  init();
  createScene();
  window.addEventListener("resize", resize, false);

function resize() {
  camera.aspect =
    document.documentElement.clientWidth /
    document.documentElement.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  ); 
}
