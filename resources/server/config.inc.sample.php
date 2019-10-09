<?php
/*
 *  Modify this file, if you would like to add/change
 *  the values to your application
 */

$config = array(
    // priorities for the priority combo box
    'priority' => array(
        array('key' => 'L', 'value' => 'Low', 'icon' => 'green.png'),
        array('key' => 'N', 'value' => 'Normal', 'icon' => 'blue.png'),
        array('key' => 'H', 'value' => 'High', 'icon' => 'orange.png'),
        array('key' => 'S', 'value' => 'Showstopper', 'icon' => 'red.png'),
        array('key' => '-', 'value' => 'Not applicable', 'icon' => 'not-applicable.png')
    ),
    'due' => array(
        array('key' => 'N', 'value' => 'Today'),
        array('key' => 'T', 'value' => 'Tomorrow'),
        array('key' => 'O', 'value' => 'Other')
    ),
    'feedback' => array(
        array('key' => 'N', 'value' => 'None'),
        array('key' => 'E', 'value' => 'by Email'),
        array('key' => 'T', 'value' => 'by Phone')
    ),
    // types for the bug types combo box
    'types' => array(
        array('key' => 'B', 'value' => 'Bug', 'icon' => 'bug_16.png'),
        array('key' => 'R', 'value' => 'Request', 'icon' => 'request.png'),
        array('key' => 'S', 'value' => 'Suggestion', 'icon' => 'suggestion.png'),
        array('key' => 'Q', 'value' => 'Question', 'icon' => 'question.png')
    ),
    'modules' => array(
        array('key' => 'M1', 'value' => 'Module 1'),
        array('key' => 'M2', 'value' => 'Module 2'),
        array('key' => 'M3', 'value' => 'Module 3'),
        array('key' => 'O', 'value' => 'Other')
    ),
    'mail' => array(
        'templateHtml' => 'f0a4f2e8-72f1-416d-b267-d3d35e3cdc3a.html',
        'templateText' => 'f0a4f2e8-72f1-416d-b267-d3d35e3cdc3a.txt',
        'customer' => 'Customer Name',
        'subject_prefix' => 'Customer Name Bug Report:',
        'language' => 'en',
        'charset' => 'UTF-8',
        'mailto' => 'service@example.com',     // Service desk email, where to send the email
        'recipient_name' => 'Helpdesk',        // Service desk name
        'protocol' => 'sendmail',              // 'sendmail', 'mail'
        'host' => '',
        'auth' => true,
        'security' => 'tls',
        'port' => 587,
        'user' => '',
        'pass' => ''
    ),
    // saves records in sqllite(3) table Log (see resources/db/ReporterLog.db)
    'dbLog' => true,
    'dbPath' => $dbPath . '/BugReporter.db',
    'dateFmt' => 'd.m.Y'
);

// this will be executed after the mail has been sent
$submit = array(
    // name of the php or controller to execute
    'url' => $absPath . '/Mailer.php',
    // if you have no parameters set 'parameter => false'
    'parameters' => array(
        'parameter' => 'submit'
    )
);

$plugin = array(
    'plugin' => 'BugReporter',
    'version' => '1.0',
    'compatible' => 'Ext JS 6'
);