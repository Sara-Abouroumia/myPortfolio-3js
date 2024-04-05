import * as THREE from 'three';

// Interactivity allows us to move around the scene using our mouse
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


window.addEventListener('resize', () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  renderer.setPixelRatio ( window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);


})

/*  1. Scene  2. Camera   3. Renderer  */

// Like a container
const scene = new THREE.Scene();

// To View inside the the scene (field of view fov, aspect ratio, view frustrum, view frustrum)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


// to render out the real graphics
const renderer = new THREE.WebGLRenderer ( {
  // Which DOM element to use.
  canvas: document.querySelector('#bg'),
} );

renderer.setPixelRatio ( window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);


// By default the camera is positioned in the middle of the scene, 
// we can position it along the z axes, for a better rpespective
camera.position.setZ(30);
camera.position.setX(-3);

// render means draw 
renderer.render(scene, camera);


// Three basic steps to create an object
/*
1. Geometry: {x,y,z} points that makeup a shape
2. Material: wrapping paper for an object/Geometry, like a texture "The Skin"
3. MESH: geometry + material... The result 
*/


// Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

// .MeshBasicMaterial does not require light source
// .MeshStandardMaterial require light, so you gotta define light
const material = new THREE.MeshStandardMaterial( { color:0xFF6347 } );
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// emits light in all directions
const pointLight = new THREE.PointLight(0xffffff);
pointLight.intensity = 300;
pointLight.position.set( 0 , 0 , 0 );

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 3;

scene.add(pointLight, ambientLight);

/* // Very Useful
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper);

 */

// Listens to events on the mouse and update the camera position respectively
const controls = new OrbitControls(camera, renderer.domElement);

// Better than renderring manually
// renderer.render( scene, camera );


// Generates a star at a random position
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff });
  const star = new THREE.Mesh( geometry, material );

  // random x,y,z position
  const [x,y,z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);

  scene.add(star);
}
// How many stars you wanna have
Array(200).fill().forEach(addStar);


const textureLoader = new THREE.TextureLoader();


const spaceTexture =  textureLoader.load('assets/space.jpg');
spaceTexture.colorSpace = THREE.SRGBColorSpace;
// Add background to the scene
scene.background = spaceTexture;

// Avatar
const saraTexture =  textureLoader.load('assets/sara.jpeg');
saraTexture.colorSpace = THREE.SRGBColorSpace;

const sara = new THREE.Mesh(
  new THREE.BoxGeometry(2 ,2 ,2),
  new THREE.MeshBasicMaterial( { map: saraTexture } )
); 

scene.add(sara);


// Moon

const moonTexture =  textureLoader.load('assets/moon.jpg');
const normalTexture =  textureLoader.load('assets/normal.jpg');
moonTexture.colorSpace = THREE.SRGBColorSpace;

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial(
    { 
      map: moonTexture,
      normalMap: normalTexture // Normal map can make an object seem more realistic
    }
  )
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

sara.position.z = -5;
sara.position.x = 2;

function moveCamera()
{ 
  // Calculate where the user is currently scrolled to 
  // The func .getBoundingClientRect gives us teh dimensions of the viewport
  // and the .top will calculate how far we are from the top
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;


  sara.rotation.y += 0.01;

  // The top value will always be negtive, 
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

// This will fire the function every time there is a scroll event
document.body.onscroll = moveCamera;
moveCamera();




// We can create a recurFunc that does that automatically... Like a game loop
function animate() {
  requestAnimationFrame(animate); // tells the browser that you wanna perform an animation

  // Each shape has properties, if we define them in a loop they will animate
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  moon.rotation.x += 0.005;

  // to reflect the changes on the UI of navigating through the scene
  // controls.update();

  renderer.render(scene, camera);
}

animate();

