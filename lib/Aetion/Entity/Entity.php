<?php

namespace Aetion\Entity;

use Aetion\Sequencer\Sequencer;

/**
 * Description of Entity
 *
 * @author vincent
 */
class Entity {

	protected $id;
	protected $parent;
	protected $children;
	protected $seed;
	protected $context;
	protected $sequencer;

	public function __construct(Entity $parent = null, $seed = null) {
		$this->id = Sequencer::registerEntity($this);
		$this->parent = $parent;
		if ($seed) {
			$this->seed = $seed;
		} else {
			$this->seed = Sequencer::getGlobalSeed();
		}
	}

}

