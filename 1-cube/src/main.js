// 윈도우가 로드될 때, 초기화 함수를 호출합니다.
window.addEventListener('load', function () {
  init();
});

// 초기화 함수입니다.
function init() {
  // 큐브 색상을 위한 초기 옵션을 설정합니다.
  const options = {
    color: 0x00ffff,  // 큐브의 시작 색상.
  };

  // WebGL 렌더러를 생성하고, 창의 크기에 맞게 설정합니다.
  const renderer = new THREE.WebGLRenderer({
    antialias: true,  // 계단 현상 감소를 위한 안티알리어싱 활성화.
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 렌더러의 캔버스 요소를 문서의 본문에 추가합니다.
  document.body.appendChild(renderer.domElement);

  // 3D 객체들을 담을 새로운 씬을 생성합니다.
  const scene = new THREE.Scene();

  
// PerspectiveCamera 생성자:
// new THREE.PerspectiveCamera(시야각, 종횡비, 가까운 클리핑 평면, 먼 클리핑 평면)

// 시야각 (fov): 카메라 시야각을 설정합니다. 값이 작을수록 줌 인된 효과가 발생합니다.
// 종횡비 (aspect): 카메라 뷰포트의 가로와 세로 비율을 설정합니다.
// 가까운 클리핑 평면 (near): 카메라가 렌더링하는 시작 거리를 설정합니다.
// 먼 클리핑 평면 (far): 카메라가 렌더링하는 끝 거리를 설정합니다.

// 카메라 위치 설정:
// camera.position.set(x, y, z);
// 3D 공간 내에서 카메라의 위치를 (x, y, z) 좌표로 지정합니다.

  // 씬을 볼 수 있게 하는 원근 카메라를 생성합니다.
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);
  camera.position.set(0, 0, 5);  // 카메라를 3D 공간에 배치합니다.
  scene.add(camera);  // 카메라를 씬에 추가합니다.

  // 카메라 주위를 돌아다니기 위한 컨트롤을 생성합니다.
  const controls = new OrbitControls(camera, renderer.domElement);

  // 큐브의 geometry와 material을 생성합니다.
  const cubeGeometry = new THREE.IcosahedronGeometry(1);  // 기하학적 모양을 생성합니다.
  const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff, emissive: 0x111111 });  // 재질 속성을 지정합니다.

  // geometry와 material을 사용하여 큐브 메시를 생성합니다.
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

  // 큐브 주위에 와이어프레임 스켈레톤을 생성합니다.
  const skeletonGeometry = new THREE.IcosahedronGeometry(2, 0);  // 더 큰 와이어프레임 모양.
  const skeletonMaterial = new THREE.MeshBasicMaterial({
    wireframe: true,
    transparent: true,
    opacity: 0.1,
    color: 0xaaaaaa
  });  // 와이어프레임을 위한 재질.

  const skeleton = new THREE.Mesh(skeletonGeometry, skeletonMaterial);

  // 씬에 큐브와 스켈레톤을 추가합니다.
  scene.add(skeleton);
  scene.add(cube);

  // 방향성 빛을 생성하고 씬에 추가합니다.
  const light = new THREE.DirectionalLight(0xffffff, 1);
  scene.add(light);

  // 시간 추적을 위한 클럭을 생성합니다.
  const clock = new THREE.Clock();

  // 씬을 렌더링합니다.
  render();

  // 렌더링 함수입니다.
  function render() {
    const elapsedTime = clock.getElapsedTime();

    // 경과된 시간에 따라 큐브와 스켈레톤을 회전시킵니다.
    cube.rotation.x = elapsedTime;
    cube.rotation.y = elapsedTime;

    skeleton.rotation.x = elapsedTime * 1.5;
    skeleton.rotation.y = elapsedTime * 1.5;

    // 카메라를 사용하여 씬을 렌더링합니다.
    renderer.render(scene, camera);

    // 다음 애니메이션 프레임을 요청하여 계속해서 렌더링합니다.
    requestAnimationFrame(render);
  }

  // 창 크기 변경 이벤트를 처리하는 함수입니다.
  function handleResize() {
    // 카메라의 종횡비와 투영 행렬을 업데이트합니다.
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // 렌더러의 크기를 새 창 크기에 맞게 업데이트합니다.
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 업데이트된 카메라와 크기로 씬을 다시 렌더링합니다.
    renderer.render(scene, camera);
  }

  // 창 크기 변경 이벤트를 청취하고 handleResize 함수를 호출합니다.
  window.addEventListener('resize', handleResize);

  // 대화형 조정을 위한 GUI를 생성합니다.
  const gui = new GUI();

  // 슬라이더를 추가하여 큐브의 수직 위치를 조절합니다.
  gui
    .add(cube.position, 'y')
    .min(-3)  // 슬라이더의 최소 값.
    .max(3)   // 슬라이더의 최대 값.
    .step(0.01);  // 슬라이더 조절 시 증감하는 단위.

  // 체크박스를 추가하여 큐브의 가시성을 전환합니다.
  gui.add(cube, 'visible');

  // 컬러 피커를 추가하여 큐브의 색상을 조절합니다.
  gui
    .addColor(options, 'color')
    .onChange(value => {
      cube.material.color.set(value);  // 선택한 값으로 큐브의 색상을 업데이트합니다.
    });
}
