/**
 * Description of Sequencer
 *
 * @author vincent
 */
Aetion.Sequencer = function(entity) {

};

Aetion.Sequencer.chooseFromRange = function(start, end, seed) {
	return Math.floor(this.rand(seed)*(end - start + 1)) + start;
};

Aetion.Sequencer.rand = function(seed){;
	if(typeof seed === 'string'){
		seed = seed.hashCode();
	}
	var mt = new MersenneTwister(seed);
	c = mt.random();
	return c;
};