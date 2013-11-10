/**
 * Description of Opening
 *
 * @author vincent
 */
Aetion.Opening = function(position, boundaries, parent, seed) {
	Aetion.Entity.call(this, position, boundaries, parent, seed);
	
	this.createMesh = function() {
		return;
	};
	
	this.getHole = function(){
		return new ThreeBSP(this.boundaries, this.position);
	};
};
