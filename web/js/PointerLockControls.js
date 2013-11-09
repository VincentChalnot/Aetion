THREE.controlParameters = {
	keyUp: 90, // Z
	altKeyUp: 38, // Up
	keyRight: 68, // D
	altKeyRight: 39, // right
	keyDown: 83, // S
	altKeyDown: 40, // Down
	keyLeft: 81, // Q
	altKeyLeft: 37, // left
	keyJump: 32 // Space
};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author schteppe / https://github.com/schteppe
 */
var PointerLockControls = function(camera, cannonBody) {

	var eyeYPos = 1.8; // eyes are 2 meters above the ground
	var velocityFactor = 0.16;
	var jumpVelocity = 8;
	var scope = this;

	var pitchObject = new THREE.Object3D();
	pitchObject.add(camera);

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 2;
	yawObject.add(pitchObject);

	var quat = new THREE.Quaternion();

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var canJump = false;

	var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
	var upAxis = new CANNON.Vec3(0, 1, 0);
	cannonBody.addEventListener("collide", function(e) {
		var contact = e.contact;

		// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
		// We do not yet know which one is which! Let's check.
		if (contact.bi.id == cannonBody.id)  // bi is the player body, flip the contact normal
			contact.ni.negate(contactNormal);
		else
			contact.ni.copy(contactNormal); // bi is something else. Keep the normal as it is

		// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
		if (contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
			canJump = true;
	});

	var velocity = cannonBody.velocity;

	var PI_2 = Math.PI / 2;

	var onMouseMove = function(event) {

		if (scope.enabled === false)
			return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, pitchObject.rotation.x));
	};

	var onKeyboard = function(event) {
		switch (event.keyCode) {
			case THREE.controlParameters.altKeyUp:
			case THREE.controlParameters.keyUp:
				moveForward = event.type === 'keydown';
				break;

			case THREE.controlParameters.altKeyLeft:
			case THREE.controlParameters.keyLeft:
				moveLeft = event.type === 'keydown';
				break;

			case THREE.controlParameters.altKeyDown:
			case THREE.controlParameters.keyDown:
				moveBackward = event.type === 'keydown';
				break;

			case THREE.controlParameters.altKeyRight:
			case THREE.controlParameters.keyRight:
				moveRight = event.type === 'keydown';
				break;

			case THREE.controlParameters.keyJump:
				if (event.type === 'keydown') {
					if (canJump === true)
						velocity.y = jumpVelocity;
					canJump = false;
				}
				break;

		}

	};

	document.addEventListener('mousemove', onMouseMove, false);
	document.addEventListener('keydown', onKeyboard, false);
	document.addEventListener('keyup', onKeyboard, false);

	this.enabled = false;

	this.getObject = function() {
		return yawObject;
	};

	this.getDirection = function(targetVec) {
		targetVec.set(0, 0, -1);
		quat.multiplyVector3(targetVec);
	};

	// Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
	var inputVelocity = new THREE.Vector3();
	this.update = function(delta) {
		if (scope.enabled === false)
			return;

		delta *= 0.1;
		var inertia = 0.5;
		
		// Quaternion to convert velocity with right orientation
		quat.setFromEuler(new THREE.Euler(pitchObject.rotation.x, yawObject.rotation.y, 0, "XYZ"));

		inputVelocity.set(0, 0, 0);

		if (moveForward) {
			inputVelocity.z = -velocityFactor * delta;
		} else if (moveBackward) {
			inputVelocity.z = velocityFactor * 0.6 * delta;
		}

		if (moveLeft) {
			inputVelocity.x = -velocityFactor * 0.8 * delta;
		} else if (moveRight) {
			inputVelocity.x = velocityFactor * 0.8 * delta;
		}
		
		if(inputVelocity.length() > velocityFactor * delta){
			inputVelocity.setLength(velocityFactor * delta);
		}

		// Convert velocity to world coordinates
		inputVelocity.applyQuaternion(quat);

		// Add to the object
		velocity.x += inputVelocity.x;
		velocity.z += inputVelocity.z;

		cannonBody.position.copy(yawObject.position);
	};
};