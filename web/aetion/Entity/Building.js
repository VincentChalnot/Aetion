/**
 * Description of Building
 *
 * @author vincent
 */
Aetion.Building = function(position, boundaries, parent, seed) {
	Aetion.Entity.call(this, position, boundaries, parent, seed);

	this.init = function() {
		var levelGeometry = new THREE.CubeGeometry(this.boundaries.width, 3, this.boundaries.depth);
		var levelMatrix = new THREE.Matrix4();
		levelMatrix.makeTranslation(0, -this.boundaries.height / 2 + levelGeometry.height /2, 0);
		this.add(new Aetion.Level(levelMatrix, levelGeometry, this, this.seed));
	};
	
	this.defaultMaterial = new THREE.MeshLambertMaterial({wireframe: true});

	this.init();
};
