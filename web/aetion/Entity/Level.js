/**
 * Description of Building
 *
 * @author vincent
 */
Aetion.Level = function(position, boundaries, parent, seed, isGroundLevel) {
	Aetion.Entity.call(this, position, boundaries, parent, seed);
	
	this.wallDepth = 0.4;
	this.isGroundLevel = isGroundLevel;
	this.levelGeometry = null;

	this.init = function() {
		if(this.isGroundLevel){
			var doorGeometry = new THREE.CubeGeometry(this.wallDepth, 2, 1);
			var doorMatrix = new THREE.Matrix4();
			doorMatrix.makeTranslation(this.boundaries.width / 2 - doorGeometry.width / 2, -this.boundaries.height / 2 + doorGeometry.height / 2, 0);
			new Aetion.Door(doorMatrix, doorGeometry, this, this.seed); // Already added to this.children in the parent constructor
		}
	};

	this.createMesh = function() {
		var levelGeometry = new ThreeBSP(this.getLevelGeometry());
		var child = null;
		for (i in this.children) {
			child = this.children[i];
			if (child.getHole) {
				var openingBSP = child.getHole();
				levelGeometry = levelGeometry.subtract(openingBSP);
			}
		}
		return levelGeometry.toMesh(this.defaultMaterial);
	};

	this.getLevelGeometry = function() {
		if(this.levelGeometry){
			return this.levelGeometry;
		}
		var sequencer = new Aetion.LevelSequencer(this);
		return this.levelGeometry = sequencer.generateGeometry();
	};
	
	this.setGroundLevel = function(bool) {
		this.isGroundLevel = bool;
		return this;
	};

	this.init();
};
