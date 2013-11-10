<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>cannon.js + three.js physics shooter</title>
		<link type="text/css" rel="stylesheet" href="/css/main.css">
        <script src="/threejs/build/three.min.js"></script>
        <script src="/cannonjs/build/cannon.min.js"></script>
		<script src="/js/csg.js"></script>
		<script src="/js/ThreeCSG.js"></script>
        <script src="/js/PointerLockControls.js"></script>
		<script src="/aetion/Core/Aetion.js"></script>
		<?php foreach (['Building', 'Door', 'Entity', 'Environment', 'Hall', 'Item', 'Level', 'Opening', 'Room', 'Window'] as $file): ?>
			<script src="/aetion/Entity/<?php echo $file ?>.js"></script>
		<?php endforeach ?>
		<script src="/aetion/Sequencer/LevelSequencer.js"></script>
    </head>
    <body>
        <div id="blocker">

            <div id="instructions">
                <span style="font-size:40px">Click to play</span>
                <br />
                (W,A,S,D = Move, SPACE = Jump, MOUSE = Look, CLICK = Shoot)
            </div>

        </div>

        <script>

			var playerShape, playerBody, world, physicsMaterial, walls = [], balls = [], ballMeshes = [], boxes = [], boxMeshes = [];
			var playerPosition = {x: 0, y: 2, z: 3};

			var camera, scene, renderer;
			var geometry, material, mesh;
			var controls, time = Date.now();

			initCannon();
			init();
			animate();

			function initCannon() {
				// Setup our world
				world = new CANNON.World();
				world.quatNormalizeSkip = 0;
				world.quatNormalizeFast = false;

				var solver = new CANNON.GSSolver();

				world.defaultContactMaterial.contactEquationStiffness = 1e9;
				world.defaultContactMaterial.contactEquationRegularizationTime = 4;

				solver.iterations = 7;
				solver.tolerance = 0.1;
				var split = true;
				if (split)
					world.solver = new CANNON.SplitSolver(solver);
				else
					world.solver = solver;

				world.gravity.set(0, -20, 0);
				world.broadphase = new CANNON.NaiveBroadphase();

				// Create a slippery material (friction coefficient = 0.0)
				physicsMaterial = new CANNON.Material("slipperyMaterial");
				var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
						physicsMaterial,
						0.2, // friction coefficient
						0.4  // restitution
						);
				// We must add the contact materials to the world
				world.addContactMaterial(physicsContactMaterial);

				playerMaterial = new CANNON.Material("playerMaterial");
				var playerContactMaterial = new CANNON.ContactMaterial(playerMaterial,
						playerMaterial,
						0.9, // friction coefficient
						0.4  // restitution
						);
				// We must add the contact materials to the world
				world.addContactMaterial(playerContactMaterial);

				// Create a sphere for player camera
				var mass = 70, radius = 1.3;
				playerShape = new CANNON.Sphere(radius);
				playerBody = new CANNON.RigidBody(mass, playerShape, playerMaterial);
				playerBody.position.set(playerPosition.x, playerPosition.y, playerPosition.z);
				world.add(playerBody);

				// Create a plane
				var groundShape = new CANNON.Plane();
				var groundBody = new CANNON.RigidBody(0, groundShape, physicsMaterial);
				groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
				world.add(groundBody);
			}

			function init() {

				camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
				
				scene = new THREE.Scene();
				scene.fog = new THREE.Fog(0x000000, 0, 500);

				var ambient = new THREE.AmbientLight(0x111111);
				scene.add(ambient);

				light = new THREE.SpotLight(0xffffff);
				light.position.set(10, 30, 20);
				light.target.position.set(0, 0, 0);
				if (true) {
					light.castShadow = true;

					light.shadowCameraNear = 20;
					light.shadowCameraFar = 50;//camera.far;
					light.shadowCameraFov = 40;

					light.shadowMapBias = 0.1;
					light.shadowMapDarkness = 0.7;
					light.shadowMapWidth = 2 * 512;
					light.shadowMapHeight = 2 * 512;

					//light.shadowCameraVisible = true;
				}
				scene.add(light);

				controls = new PointerLockControls(camera, playerBody);
				scene.add(controls.getObject());

				// floor
				geometry = new THREE.PlaneGeometry(300, 300, 50, 50);
				geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

				material = new THREE.MeshLambertMaterial({color: 0xffffff});

				mesh = new THREE.Mesh(geometry, material);
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				scene.add(mesh);

				renderer = new THREE.WebGLRenderer();
				renderer.shadowMapEnabled = true;
				renderer.shadowMapSoft = true;
				renderer.setSize(window.innerWidth, window.innerHeight);
				renderer.setClearColor(scene.fog.color, 1);

				document.body.appendChild(renderer.domElement);

				window.addEventListener('resize', onWindowResize, false);

				var buildingMatrix = new THREE.Matrix4();
				buildingMatrix.makeTranslation(0, 5, 0);
				var building = new Aetion.Building(buildingMatrix, new THREE.CubeGeometry(15, 10, 20));
				var buildingMesh = building.getMesh();
				scene.add(buildingMesh);
			}

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			}

			var dt = 1 / 60;
			function animate() {
				requestAnimationFrame(animate);
				if (controls.enabled) {
					world.step(dt);

					// Update ball positions
					for (var i = 0; i < balls.length; i++) {
						balls[i].position.copy(ballMeshes[i].position);
						balls[i].quaternion.copy(ballMeshes[i].quaternion);
					}

					// Update box positions
					for (var i = 0; i < boxes.length; i++) {
						boxes[i].position.copy(boxMeshes[i].position);
						boxes[i].quaternion.copy(boxMeshes[i].quaternion);
					}
				}

				controls.update(Date.now() - time);
				renderer.render(scene, camera);
				time = Date.now();

			}

			var ballShape = new CANNON.Sphere(0.1);
			var ballGeometry = new THREE.SphereGeometry(ballShape.radius);
			var shootDirection = new THREE.Vector3();
			var shootVelo = 60;
			var projector = new THREE.Projector();
			function getShootDir(targetVec) {
				var vector = targetVec;
				targetVec.set(0, 0, 1);
				projector.unprojectVector(vector, camera);
				var ray = new THREE.Ray(playerBody.position, vector.sub(playerBody.position).normalize());
				targetVec.x = ray.direction.x;
				targetVec.y = ray.direction.y;
				targetVec.z = ray.direction.z;
			}

			window.addEventListener("click", function(e) {
				if (!controls.enabled) {
					return;
				}
				var x = playerBody.position.x;
				var y = playerBody.position.y;
				var z = playerBody.position.z;
				var ballBody = new CANNON.RigidBody(30, ballShape);
				var ballMesh = new THREE.Mesh(ballGeometry, material);
				world.add(ballBody);
				scene.add(ballMesh);
				ballMesh.castShadow = false;
				ballMesh.receiveShadow = false;
				balls.push(ballBody);
				ballMeshes.push(ballMesh);
				getShootDir(shootDirection);
				ballBody.velocity.set(shootDirection.x * shootVelo,
						shootDirection.y * shootVelo,
						shootDirection.z * shootVelo);

				// Move the ball outside the player sphere
				x += shootDirection.x * (playerShape.radius * 1.02 + ballShape.radius);
				y += shootDirection.y * (playerShape.radius * 1.02 + ballShape.radius);
				z += shootDirection.z * (playerShape.radius * 1.02 + ballShape.radius);
				ballBody.position.set(x, y, z);
				ballMesh.position.set(x, y, z);
			});

        </script>
        <script src="/js/pointerLockInit.js"></script>
    </body>
</html>
