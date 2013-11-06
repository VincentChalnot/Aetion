<?php

namespace Aetion\Entity;

/**
 * Description of Building
 *
 * @author vincent
 */
class Building extends Volume {
	
	const DEFAULT_SIZE = 20;

	public function __construct(Entity $parent = null, $seed = null) {
		parent::__construct($parent, $seed);
	}
}
