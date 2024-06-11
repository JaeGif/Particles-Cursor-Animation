import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import particlesVertexShader from './shaders/particles/vertex.glsl';
import particlesFragmentShader from './shaders/particles/fragment.glsl';

/**
 * Base
 */
// Canvas

const isMobile = (window.mobileCheck = function () {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
});
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight + 1,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight + 1;
  sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);

  // Materials
  particlesMaterial.uniforms.uResolution.value.set(
    sizes.width * sizes.pixelRatio,
    sizes.height * sizes.pixelRatio
  );

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(sizes.pixelRatio);
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 18);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
if (isMobile) controls.enableRotate = false;
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setClearColor('#181818');
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);

// Displacement
const displacement = {};
displacement.canvas = document.createElement('canvas');
displacement.canvas.width = 128;
displacement.canvas.height = 128;
displacement.canvas.style.position = 'fixed';
displacement.canvas.style.width = '256px';
displacement.canvas.style.height = '256px';
displacement.canvas.style.top = 0;
displacement.canvas.style.left = 0;
displacement.canvas.style.zIndex = 10;
// document.body.append(displacement.canvas);
// context
displacement.context = displacement.canvas.getContext('2d');
displacement.context.fillRect(
  0,
  0,
  displacement.canvas.width,
  displacement.canvas.height
);

// glow cursor
displacement.glowImage = new Image();
displacement.glowImage.src = './glow.png';

// interactive plane
displacement.interactivePlane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
);
displacement.interactivePlane.visible = false;

scene.add(displacement.interactivePlane);

// raycaster
displacement.raycaster = new THREE.Raycaster();
displacement.screenCursor = new THREE.Vector2(9999, 9999);
displacement.canvasCursor = new THREE.Vector2(9999, 9999);
displacement.canvasCursorPrevious = new THREE.Vector2(9999, 9999);

window.addEventListener('pointermove', (e) => {
  displacement.screenCursor.x = (e.clientX / sizes.width) * 2 - 1;
  displacement.screenCursor.y = -(e.clientY / sizes.height) * 2 + 1;
});

// displacement texture
displacement.texture = new THREE.CanvasTexture(displacement.canvas);

/**
 * Particles
 */
const particlesGeometry = new THREE.PlaneGeometry(10, 10, 128, 128);
const intensitiesArray = new Float32Array(
  particlesGeometry.attributes.position.count
);
const anglesArray = new Float32Array(
  particlesGeometry.attributes.position.count
);

for (let i = 0; i < particlesGeometry.attributes.position.count; i++) {
  intensitiesArray[i] = Math.random();
  anglesArray[i] = Math.random() * Math.PI * 2;
}
particlesGeometry.setAttribute(
  'aIntensity',
  new THREE.BufferAttribute(intensitiesArray, 1)
);

particlesGeometry.setAttribute(
  'aAngle',
  new THREE.BufferAttribute(anglesArray, 1)
);

particlesGeometry.setIndex(null);
particlesGeometry.deleteAttribute('normal');
const randomImageIndex = Math.floor(Math.random() * 3) + 1;
const particlesMaterial = new THREE.ShaderMaterial({
  vertexShader: particlesVertexShader,
  fragmentShader: particlesFragmentShader,
  uniforms: {
    uResolution: new THREE.Uniform(
      new THREE.Vector2(
        sizes.width * sizes.pixelRatio,
        sizes.height * sizes.pixelRatio
      )
    ),
    uPictureTexture: new THREE.Uniform(
      textureLoader.load(`./picture-${randomImageIndex}.png`)
    ),
    uDisplacementTexture: new THREE.Uniform(displacement.texture),
  },
});
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // raycaster
  displacement.raycaster.setFromCamera(displacement.screenCursor, camera);
  const intersections = displacement.raycaster.intersectObject(
    displacement.interactivePlane
  );

  if (intersections.length) {
    const uv = intersections[0].uv;

    displacement.canvasCursor.x = uv.x * displacement.canvas.width;
    displacement.canvasCursor.y = (1 - uv.y) * displacement.canvas.height;
  }

  // displacement
  displacement.context.globalCompositeOperation = 'source-over';
  displacement.context.globalAlpha = 0.02;

  displacement.context.fillRect(
    0,
    0,
    displacement.canvas.width,
    displacement.canvas.height
  );

  // Speed alpha
  const cursorDistance = displacement.canvasCursorPrevious.distanceTo(
    displacement.canvasCursor
  );
  displacement.canvasCursorPrevious.copy(displacement.canvasCursor);
  const alpha = Math.min(cursorDistance * 0.05, 1);

  // draw glow
  const glowSize = displacement.canvas.width * 0.25;
  displacement.context.globalCompositeOperation = 'lighten';
  displacement.context.globalAlpha = alpha;

  displacement.context.drawImage(
    displacement.glowImage,
    displacement.canvasCursor.x - glowSize * 0.5,
    displacement.canvasCursor.y - glowSize * 0.5,
    glowSize,
    glowSize
  );

  // update canvas texture
  displacement.texture.needsUpdate = true;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
