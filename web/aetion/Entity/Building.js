/**
 * Description of Building
 *
 * @author vincent
 */
Aetion.Building = function(position, boundaries, parent, seed) {
	Aetion.Entity.call(this, position, boundaries, parent, seed);

	this.castShadow = false;
	this.receiveShadow = false;
	this.defaultGroundLevelHeight = 4;
	this.defaultLevelHeight = 3;

	this.init = function() {
		var levelGeometry = new THREE.CubeGeometry(this.boundaries.width, this.defaultGroundLevelHeight, this.boundaries.depth);
		var levelMatrix = new THREE.Matrix4();
		levelMatrix.makeTranslation(0, -this.boundaries.height / 2 + levelGeometry.height / 2, 0);
		new Aetion.Level(levelMatrix, levelGeometry, this, this.seed, true);
		
		var currentHeight = this.defaultGroundLevelHeight;
		while (this.boundaries.height >= currentHeight + this.defaultLevelHeight) {
			var upperLevelGeometry = new THREE.CubeGeometry(this.boundaries.width, this.defaultLevelHeight, this.boundaries.depth);
			var upperLevelMatrix = new THREE.Matrix4();
			upperLevelMatrix.makeTranslation(0, -this.boundaries.height / 2 + currentHeight + levelGeometry.height / 2, 0);
			new Aetion.Level(upperLevelMatrix, upperLevelGeometry, this, this.seed);
			currentHeight += this.defaultLevelHeight;
		}
	};

	this.defaultMaterial = new THREE.MeshLambertMaterial({wireframe: true});
	
	this.createMesh = function(){
		return null;
	};

	this.init();
};
