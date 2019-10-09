<?php
/**
 * Don't change this
 */
$packagePath = dirname( __FILE__, 3 );
$packageURL = isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
$packageURL .= str_replace( '/server', '', $_SERVER['HTTP_HOST'] . dirname( $_SERVER['REQUEST_URI'] ) );

$absPath = dirname( __FILE__ );
$dbPath = $packagePath . '/db';

/*
 *  Modify this file, if you would like to add/change
 *  the values to your application
 */
$config = [
	'language' => 'de',
	'dateFmt' => 'd.m.Y',
	'dateFmtLong' => 'd.m.Y H:i:s',
	'priority' => [
		[ 'key' => 'L', 'value' => 'Niedrig', 'glyph' => 'circle bugreporter green', 'color' => 'green' ],
		[ 'key' => 'N', 'value' => 'Normal', 'glyph' => 'circle bugreporter blue', 'color' => 'blue' ],
		[ 'key' => 'H', 'value' => 'Hoch', 'glyph' => 'circle bugreporter orange', 'color' => 'orange' ],
		[ 'key' => 'S', 'value' => 'Showstopper', 'glyph' => 'circle bugreporter red', 'color' => 'red' ],
		[ 'key' => '-', 'value' => 'Nicht anwendbar', 'glyph' => 'circle bugreporter white', 'color' => '' ]
	],
	'due' => [
		[ 'key' => 'N', 'value' => 'Heute' ],
		[ 'key' => 'T', 'value' => 'Morgen' ],
		[ 'key' => 'O', 'value' => 'Anders' ]
	],
	'feedback' => [
		[ 'key' => 'N', 'value' => 'Kein' ],
		[ 'key' => 'E', 'value' => 'über Email' ],
		[ 'key' => 'T', 'value' => 'über Phone' ]
	],
	// types for the bug types combo box
	'types' => [
		[ 'key' => 'B', 'value' => 'Fehler', 'glyph' => 'bug bugreporter red', 'class' => 'fa fa-bug red' ],
		[ 'key' => 'R', 'value' => 'Anforderung', 'glyph' => 'comment-o bugreporter gray', 'class' => 'fa fa-comment-o gray' ],
		[ 'key' => 'S', 'value' => 'Vorschlag', 'glyph' => 'coffee bugreporter gray', 'class' => 'fa fa-coffee gray' ],
		[ 'key' => 'Q', 'value' => 'Frage', 'glyph' => 'question-circle bugreporter gray', 'class' => 'fa fa-question-circle gray' ]
	],
	'modules' => [
		[ 'key' => 'F', 'value' => 'Formen' ],
		[ 'key' => 'R', 'value' => 'Reservierung' ],
		[ 'key' => 'P', 'value' => 'Produktion' ],
		[ 'key' => 'O', 'value' => 'Überige' ]
	],
	'status' => [
		[ 'key' => 'O', 'value' => 'Open', 'icon' => 'fa fa-circle-o red' ],
		[ 'key' => 'S', 'value' => 'Gelöst', 'icon' => 'fa fa-circle-o green' ],
		[ 'key' => 'U', 'value' => 'Unlösbar', 'icon' => 'fa fa-circle-o orange' ],
		[ 'key' => 'C', 'value' => 'Geschlossen', 'icon' => 'fa fa-circle-o gray' ],
	],
	'styles' => [
		'headerBgColor' => '#ff0000', // '#088aff',
		'footerBgColor' => '#e1e1e1'
	]
];

$db = [
	'dbLog' => true,
	'dbPath' => $dbPath,
	'dbDatabase' => $dbPath . '/BugReporter.db'
];

$mail = [
	'templateHtml' => 'bugreporter.html',
	'templateText' => 'bugreporter.txt',
	'customer' => 'Betonwerk Lintel GmbH',
	'subject_prefix' => 'Betonwerk Bug Report:',
	'charset' => 'UTF-8',
    'fromMail' => 'mail@johanvandemerwe.nl',
    'fromName' => 'BugReporter Assistant',
	'mailto' => 'mail@johanvandemerwe.nl', // Service desk email, where to send the email
	'recipient_name' => 'Helpdesk',        // Service desk name
	'protocol' => 'smtp', // 'sendmail', 'mail'
	'host' => 'smtp.ziggo.nl',
	'auth' => true,
	'security' => 'tls',
	'port' => 587,
	'user' => 'j.vd.merwe@ziggo.nl',
	'pass' => 'Nijverdal@zigg0'
];

// this will be executed when the form is submitted
$submit = [
	// name of the php or controller to execute
	'url' => $packageURL . '/Mailer.php',
	// if you have no parameters set 'parameter => false'
	'parameters' => [
		'parameter' => 'submit'
	]
];