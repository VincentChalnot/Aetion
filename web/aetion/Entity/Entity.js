/**
 * Description of Entity
 *
 * @author vincent
 */
Aetion.Entity = function(boundaries, parent, seed) {
	
	this.init = function(boundaries, parent, seed){
		this.id = Aetion.registerEntity(this);
		parent.add(this);
		this.parent = parent;
		this.children = [];
		this.boundaries = boundaries;
		if(seed){
			this.seed = seed;
		} else {
			this.seed = Aetion.getGlobalSeed();
		}
		this.seed;
		this.context;
	};
	
	this.add = function (child) {
		this.children.push(child);
	};
	
	this.init(boundaries, parent, seed);
};

