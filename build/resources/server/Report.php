<?php
error_reporting( E_ALL );

$env = require dirname(__FILE__) . '/environment.php';
include( $env . '/config.inc' );

require 'dbLite.php';

/**
 * Language
 */
$file = './../language/' . $config['language'] . '.json';
$languageJson = file_get_contents( $file );
$language = json_decode( $languageJson );

/**
 * Post variables to args
 */
$args = [
	'dbLocation' => $_POST['dbLocation'],
	'start' => $_POST['start'],
	'limit' => $_POST['limit']
];

/**
 * Database retrieval
 */
$db = new dbLite( $args );

$result = $db->getRecords();

foreach ( $result['records'] as $idx => $record ) {
	$rec = $result['records'][ $idx ];
	$dateTime = strtotime( $record['date'] );
	$newDate = date( 'Y-m-d', $dateTime );
	$newTime = date( 'H:i:s', $dateTime );
	$item = [
		'priority_desc' => Substitute( $record['priority'], $config['priority'] ),
		'type_desc' => Substitute( $record['type'], $config['types'] ),
		'module_desc' => Substitute( $record['module'], $config['modules'] ),
		'due_desc' => Substitute( $record['due'], $config['due'] ),
		'feedback_desc' => Substitute( $record['feedback'], $config['feedback'] ),
		'solved_status_desc' => Substitute( $record['solved_status'], $config['status'] ),
		'solved_feedback_desck' => Substitute( $record['solved_feedback'], $config['feedback'] ),
		'date' => $newDate,
		'time' => $newTime
	];

	$result['records'][ $idx ] = array_merge( $result['records'][ $idx ], $item );
}

/**
 * Feedback as JSON
 */
echo json_encode( $result );

/**
 * Substitute Keys into Values
 *
 * @param $key
 * @param $haystack
 *
 * @return mixed
 */
function Substitute( $key, $haystack ) {
	if ( ! is_array( $haystack ) ) {
		return $key;
	}

	foreach ( $haystack as $row ) {
		if ( $row['key'] === $key ) {
			return $row['value'];
		}
	}

	return $key;
}