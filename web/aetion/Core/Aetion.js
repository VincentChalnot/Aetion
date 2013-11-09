/**
 * Description of Entity
 *
 * @author vincent
 */
Aetion = function(seed) {
	
	this.init = function(seed) {
		Aetion.obj = this;
		this.entities = {};
		this.currentId = 1;
		if (seed) {
			this.globalSeed = seed;
		} else {
			this.globalSeed = this.generateSeed();
		}
		return this;
	};

	this.getNextId = function() {
		return this.currentId++;
	};

	this.generateSeed = function() {
		seed = this.guid();
		return seed;
	};

	this.guid = function() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
	
	this.init(seed);
};

Aetion.obj = null;
	
Aetion.instance = function(){
	if(this.obj){
		return this.obj;
	} else {
		return this.obj = new Aetion();
	}
};

Aetion.registerEntity = function(entity) {
	id = Aetion.instance().getNextId();
	Aetion.instance().entities[id] = entity;
	return id;
};

Aetion.getGlobalSeed = function() {
	return Aetion.instance().globalSeed;
};