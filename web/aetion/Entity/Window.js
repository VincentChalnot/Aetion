/**
 * Description of Window
 *
 * @author vincent
 */
Aetion.Window = function(boundaries, parent, seed) {
	Aetion.Opening.call(this, boundaries, parent, seed);
	
	this.defaultMaterial = new THREE.MeshPhongMaterial({color: 0x000011});
			
	this.createMesh = function() {
		var windowGeometry = new THREE.PlaneGeometry(this.boundaries.depth, this.boundaries.height);
		this.defaultMaterial.emissive = new THREE.Color(Aetion.Sequencer.chooseFromRange(0, 1, this.seed + this.id) ? 0x000000 : 0xEDE97B);
		var windowMesh = new THREE.Mesh(windowGeometry, this.defaultMaterial);
		windowMesh.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI/2));
		windowMesh.applyMatrix(new THREE.Matrix4().makeTranslation(-this.boundaries.width / 4, 0, 0));
		return windowMesh;
	};
};
