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
	this.defaultMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});

	this.init = function() {
		this.sequencer = new Aetion.LevelSequencer(this);
		if(this.isGroundLevel){
			var doorGeometry = new THREE.CubeGeometry(this.wallDepth, 2, 1);
			var doorMatrix = new THREE.Matrix4();
			doorMatrix.makeTranslation(this.boundaries.width / 2 - doorGeometry.width / 2, -this.boundaries.height / 2 + doorGeometry.height / 2, 0);
			new Aetion.Door(doorMatrix, doorGeometry, this, this.seed); // Already added to this.children in the parent constructor
		}
		if(!this.isGroundLevel){
			var windows = this.sequencer.getWindowsPositions();
			for(i in windows){
				var windowGeometry = new THREE.CubeGeometry(this.wallDepth, this.boundaries.height-1.5, 1);
				new Aetion.Window(windows[i], windowGeometry, this, this.seed); // Already added to this.children in the parent constructor
			}
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
		return this.levelGeometry = this.sequencer.getGeometry();
	};
	
	this.setGroundLevel = function(bool) {
		this.isGroundLevel = bool;
		return this;
	};

	this.init();
};
