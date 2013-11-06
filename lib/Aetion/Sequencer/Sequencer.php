<?php

namespace Aetion\Sequencer;

use Aetion\Entity\Entity;

/**
 * Description of Sequencer
 *
 * @author vincent
 */
class Sequencer {

	protected static $instance;
	protected $entities;
	protected $currentId = 1;
	protected $globalSeed;
	
	public function __construct($seed = null) {
		if(!$seed){
			$this->globalSeed = self::generateSeed();
		} else {
			$this->globalSeed = $seed;
		}
		self::$instance = $this;
	}

	/**
	 * Return current sequencer instance
	 * @return Sequencer
	 */
	public static function getInstance() {
		if (!self::$instance) {
			self::$instance = new self;
		}
		return self::$instance;
	}

	/**
	 * Register entity in Sequencer
	 * @param Entity $entity
	 * @return int assigned unique id
	 */
	public static function registerEntity(Entity $entity) {
		$id = self::getNextId();
		self::getInstance()->entities[$id] = $entity;
		return $id;
	}

	/**
	 * Get next id and increment value
	 * @return int
	 */
	protected static function getNextId() {
		return self::getInstance()->currentId++;
	}

	/**
	 * Get next id and increment value
	 * @return int
	 */
	public static function getGlobalSeed() {
		return self::getInstance()->globalSeed;
	}

	public static function generateSeed() {
		$seed = sha1(uniqid());
		return $seed;
	}
	
	public static function getContextForEntity(Entity $entity){
		
	}
}
