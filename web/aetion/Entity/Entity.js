/**
 * Description of Entity
 *
 * @author vincent
 */
Aetion.Entity = function(position, boundaries, parent, seed) {

	this.position = new THREE.Matrix4();
	this.parent = undefined;
	this.id = undefined;
	this.children = [];
	this.mesh = undefined;
	this.defaultMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
	this.castShadow = true;
	this.receiveShadow = true;

	this.init = function(position, boundaries, parent, seed) {
		this.id = Aetion.registerEntity(this);
		if (parent) {
			parent.add(this);
			this.parent = parent;
		}
		this.boundaries = boundaries;
		this.position = position;
		if (seed) {
			this.seed = seed;
		} else {
			this.seed = Aetion.getGlobalSeed();
		}
	};

	this.add = function(child) {
		this.children.push(child);
	};

	this.getMesh = function() {
		if (this.mesh) {
			return this.mesh;
		}
		this.mesh = this.createMesh();
		if(!this.mesh){
			this.mesh = new THREE.Mesh();
		}
		this.mesh.castShadow = this.castShadow;
		this.mesh.receiveShadow = this.receiveShadow;
		this.mesh.applyMatrix(this.position);
		var childMesh = null;
		for (i in this.children) {
			childMesh = this.children[i].getMesh();
			if(childMesh){
				this.mesh.add(childMesh);
			}
		}
		return this.mesh;
	};

	this.createMesh = function() {
		return new THREE.Mesh(this.boundaries, this.defaultMaterial);
	};

	this.init(position, boundaries, parent, seed);
};

