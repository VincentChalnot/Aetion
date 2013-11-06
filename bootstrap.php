<?php

include 'vendor/autoload.php';

use Aetion\Entity\Entity;
use Aetion\Sequencer\Sequencer;

new Sequencer('0a2f3d2c968ffd1dde22d53dcdad6b7c96d4aabf');

$world = new Entity();

$building = new Aetion\Entity\Building($world);

var_dump($building);