document.addEventListener("keydown", keydownEvent, false);
document.addEventListener("keyup", keyupEvent, false);

function keydownEvent(e) {
  if (!e) {
    e = event;
  }
}

function keyupEvent(e) {
  if (!e) {
    e = event;
  }
}

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size, model, spaceBlanket;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var loader = new THREE.ColladaLoader();
// loader.load('assets/spaceBlanket.dae', function(result) {
//   spaceBlanket = result.scene;
  loader.load('assets/grandma.dae', function(r){
    model = r.scene;
    init();
    animate();
  });
// });

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
  camera = new THREE.TargetCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
  camera.addTarget({
    name: 'gTarget',
    targetObject: model,
    cameraPosition: new THREE.Vector3(0, 5, 20),
    fixed: false,
    stiffness: 1,
    matchRotation: true
  });

  camera.setTarget( 'gTarget' );

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );

  geometry = new THREE.Geometry();

  for ( i = 0; i < 20000; i ++ ) {
    var vertex = new THREE.Vector3();
    vertex.x = Math.random() * 5000 - 1000;
    vertex.y = Math.random() * 5000 - 1000;
    vertex.z = Math.random() * 5000 - 1000;

    geometry.vertices.push( vertex );
  }

  parameters = [
    [ [1, 1, 0.5], 5 ],
    [ [0.95, 1, 0.5], 4 ],
    [ [0.90, 1, 0.5], 3 ],
    [ [0.85, 1, 0.5], 2 ],
    [ [0.80, 1, 0.5], 1 ]
  ];

  for ( i = 0; i < parameters.length; i ++ ) {
    color = parameters[i][0];
    size  = parameters[i][1];

    materials[i] = new THREE.PointsMaterial( { size: size } );

    particles = new THREE.Points( geometry, materials[i] );

    particles.rotation.x = Math.random() * 6;
    particles.rotation.y = Math.random() * 6;
    particles.rotation.z = Math.random() * 6;

    scene.add( particles );
  }
  scene.add(model);
  model.position.x = 0;
  model.position.y = 0;
  model.position.z = 0;

  // scene.add(spaceBlanket);
  // spaceBlanket.position.x = 0;
  // spaceBlanket.position.y = 150;
  // spaceBlanket.position.z = 500;

  // Add our moon/planet.
  // return to https://open.bekk.no/procedural-planet-in-webgl-and-three-js
  // at some point
  var radius = 1000, widthSegs = 40, heightSegs = 40;
  var sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0xCC0000
  });
  var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, widthSegs, heightSegs),
      sphereMaterial);

  sphere.position.x = 0;
  sphere.position.y = 0;
  sphere.position.z = -2000;

  scene.add(sphere);

  // Eventually this should be point from a nearby star/planet or something
  var light = new THREE.AmbientLight( 0xFFFFFF );
  scene.add( light );

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  document.addEventListener( 'touchstart', onDocumentTouchStart, false );
  document.addEventListener( 'touchmove', onDocumentTouchMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
  mouseX = event.clientX - windowHalfX;
  mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart( event ) {
  if ( event.touches.length === 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

function onDocumentTouchMove( event ) {
  if ( event.touches.length === 1 ) {
    event.preventDefault();
    mouseX = event.touches[ 0 ].pageX - windowHalfX;
    mouseY = event.touches[ 0 ].pageY - windowHalfY;
  }
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  processInput();
  var time = Date.now() * 0.00005;

  camera.update();

  for ( i = 0; i < scene.children.length; i ++ ) {
    var object = scene.children[ i ];

    if ( object instanceof THREE.Points ) {
      object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
    }
  }

  for ( i = 0; i < materials.length; i ++ ) {
    color = parameters[i][0];

    h = ( 360 * ( color[0] + time ) % 360 ) / 360;
    materials[i].color.setHSL( h, color[1], color[2] );
  }
  renderer.render( scene, camera );

}

function processInput() {
  if (keydown.w){
    model.rotation.x += .01;
  }
  if (keydown.a){
    model.rotation.y += .01;
  }
  if(keydown.d){
    model.rotation.y -= .01;
  }
  if (keydown.s){
    model.rotation.x -= .01;
  }
  if (keydown.space){
    model.translateZ(-10);
  }
}
