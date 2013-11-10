/**
 * Description of Building
 *
 * @author vincent
 */
Aetion.Level = function(position, boundaries, parent, seed) {
	Aetion.Entity.call(this, position, boundaries, parent, seed);

	this.init = function() {
		var doorGeometry = new THREE.CubeGeometry(0.2, 2, 1);
		var doorMatrix = new THREE.Matrix4();
		doorMatrix.makeTranslation(this.boundaries.width / 2 - doorGeometry.width / 2, -this.boundaries.height / 2 + doorGeometry.height / 2, 0);
		new Aetion.Door(doorMatrix, doorGeometry, this, this.seed); // Already added to this.children in the parent constructor
	};

	this.createMesh = function() {
		var levelGeometry = new ThreeBSP(this.boundaries.clone());
		var child = null;
		for(i in this.children){
			child = this.children[i];
			if(child.getHole){
				var openingBSP = child.getHole();
				levelGeometry = levelGeometry.subtract(openingBSP);
			}
		}
		return levelGeometry.toMesh(this.defaultMaterial);
	};

	this.init();
};
