<?php
$config = $plugin = $callback = [];

$imgPath = $_POST['imgpath'];

$env = require dirname(__FILE__) . '/environment.php';
include( $env . '/config.inc' );

$data = [
	'success' => true,
	'data' => $config,
	'config' => $plugin,
	'submit' => $submit
	//'db' => $db
];

echo json_encode( $data );