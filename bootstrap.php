<?php

include 'vendor/autoload.php';

use Aetion\Entity\Entity;
use Aetion\Sequencer\Sequencer;

new Sequencer('0a2f3d2c968ffd1dde22d53dcdad6b7c96d4aabf');

$world = new Entity();

$building = new Aetion\Entity\Building($world);

$polygon = geoPHP::load('POLYGON ((30 10 0, 10 20 0, 20 40 0, 40 40 10, 30 10 10))', 'wkt');

var_dump($building, json_encode($polygon->asText()));