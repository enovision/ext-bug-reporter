<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

use Mustache_Engine;

use Noodlehaus\Config;

require dirname(__FILE__, 2) . '/vendor/autoload.php';

$env = require dirname(__FILE__) . '/environment.php';
include($env . '/config.inc');

$config = Config::load($settings);

// require 'PHPMailer/PHPMailerAutoload.php';
require 'dbLite.php';

// Language
$file = './../language/' . $config['language'] . '.json';
$languageJson = file_get_contents($file);
$language = json_decode($languageJson);

//Email information
$mailconfig = $mail;

unset($mail);

// setup email
$mail = new PHPMailer(true);

$mustache = new Mustache_Engine([
    'loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__) . '/templates/views'),
    'partials_loader' => new Mustache_Loader_FilesystemLoader(dirname(__FILE__) . '/templates/views/partials'),
]);

if ($mailconfig['protocol'] === 'smtp') {
    $mail->isSMTP();                                  // Set mailer to use SMTP
    $mail->Host = $mailconfig['host'];                // Specify main and backup SMTP servers
    $mail->SMTPAuth = $mailconfig['auth'];            // Enable SMTP authentication
    $mail->Username = $mailconfig['user'];            // SMTP username
    $mail->Password = $mailconfig['pass'];            // SMTP password
    $mail->SMTPSecure = $mailconfig['security'];      // Enable TLS encryption, `ssl` also accepted
    $mail->Port = $mailconfig['port'];                // TCP port to connect to
} elseif ($mailconfig['protocol'] === 'sendmail') {
    $mail->isSendmail();
} else {
    $mail->isMail();
}

// language, if any set
if (isset($config['language'])) {
    $mail->setLanguage($config['language']);
}
// charset
$mail->CharSet = $mailconfig['charset'];

$dateTime = strtotime($_POST['date']);
$dueDate = isset($_POST['due_date']) ? $_POST['due_date'] : null;
$dueDateTime = $dueDate === null ? null : strtotime($_POST['due_date']);

// format email
$args = array(
    'dbLocation' => $_POST['dbLocation'],
    'dbLog' => $_POST['dbLog'],
    'project' => $_POST['project'],
    'date' => date('Y-m-d H:i:s', $dateTime),
    'date_form' => $_POST['date_form'],
    'name' => $_POST['name'],
    'login' => $_POST['login'],
    'email' => $_POST['email'],
    'phone' => $_POST['phone'],
    'priority' => $_POST['priority'],
    'priority_desc' => Substitute($_POST['priority'], $config['priority']),
    'type' => $_POST['type'],
    'type_desc' => Substitute($_POST['type'], $config['types']),
    'module' => $_POST['module'],
    'module_desc' => Substitute($_POST['module'], $config['modules']),
    'due' => $_POST['due'],
    'due_desc' => Substitute($_POST['due'], $config['due']),
    'due_date' => $dueDate === null ? null : date('Y-m-d', $dueDateTime),
    'feedback' => $_POST['contact'],
    'feedback_desc' => Substitute($_POST['contact'], $config['feedback']),
    'subject' => $_POST['subject'],
    'message' => $_POST['description'],
    'reproduction' => $_POST['reproduction'],
    'customer' => $mailconfig['customer'],
);

$fromMail = $mailconfig['fromMail'] !== null ? $mailconfig['fromMail'] : $args['email'];
$fromName = $mailconfig['fromName'] !== null ? $mailconfig['fromName'] : $args['name'];

$mail->setFrom($fromMail, $fromName);
$mail->addAddress($mailconfig['mailto'], $mailconfig['recipient_name']);   // Add a recipient
$mail->isHTML(true);

$mail->Subject = isset($mailconfig['subject_prefix']) ? $mailconfig['subject_prefix'] . ' ' . $args['subject'] : $args['subject'];

// Styles Substitution
$styles = $config['styles'];

$bodyHtml = $mustache->render('mail_html', array_merge($args, [
        'lbl_reported_by' => $language->mail[0]->lbl_reported_by,
        'lbl_date' => $language->mail[0]->lbl_date,
        'lbl_login' => $language->mail[0]->lbl_login,
        'lbl_priority' => $language->mail[0]->lbl_priority,
        'lbl_name' => $language->mail[0]->lbl_name,
        'lbl_email' => $language->mail[0]->lbl_email,
        'lbl_phone' => $language->mail[0]->lbl_phone,
        'lbl_type' => $language->mail[0]->lbl_type,
        'lbl_module' => $language->mail[0]->lbl_module,
        'lbl_due' => $language->mail[0]->lbl_due,
        'lbl_feedback' => $language->mail[0]->lbl_feedback,
        'lbl_footer' => $language->mail[0]->lbl_footer,
        'style_header_background' => $styles['headerBgColor'],
        'style_footer_background' => $styles['footerBgColor']
    ]
));

$bodyText = $mustache->render('mail_text', array_merge($args, []));

$mail->Body = $bodyHtml;
$mail->AltBody = $bodyText;

// send email
$dbSuccess = null;

if (!$mail->send()) {
    $error = $language->mail[0]->send_error;
    $msg = '<b>' . $mail->ErrorInfo . '</b>';
    $success = false;
} else {
    $msg = $language->mail[0]->send_success;
    $error = false;
    $success = true;

    if ($args['dbLog'] && extension_loaded('sqlite3')) {
        $dbSuccess = logBug($args);
    }
}

// feedback to client (Ajax call)
echo json_encode(array(
    'success' => $success,
    'message' => $msg,
    'error' => $error,
    'status' => [
        'dbLog' => $db['dbLog'],
        'sqlite' => extension_loaded('sqlite3'),
        'dbStatus' => $dbSuccess
    ]
));

/**
 * Substitute Keys into Values
 *
 * @param $key
 * @param $haystack
 *
 * @return mixed
 */
function Substitute($key, $haystack)
{
    if (!is_array($haystack)) {
        return $key;
    }

    foreach ($haystack as $row) {
        if ($row['key'] === $key) {
            return $row['value'];
        }
    }

    return $key;
}

function logBug($args)
{
    $db = new dbLite($args);

    return $db->addLog();
}
