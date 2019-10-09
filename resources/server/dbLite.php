<?php
ini_set( 'display_errors', 1 );
ini_set( 'display_startup_errors', 1 );
error_reporting( E_ALL );

if ( extension_loaded( 'sqlite3' ) ) {

	class dbLite extends SQLite3 {

		private $args;

		function __construct( $args = [] ) {
			$this->args = $args;
			$hasDb = array_key_exists( 'dbLocation', $args );

            $env = require dirname(__FILE__) . '/environment.php';
            include( $env . '/config.inc' );

			$database = $hasDb ? $args['dbLocation'] : $db['dbDatabase'];

			if ( $hasDb ) {
				$database = $_SERVER['DOCUMENT_ROOT'] . $database . '/BugReporter.db';
			}

			$this::open( $database );
		}

		function openDatabase() {
			//$res = $this::query( "PRAGMA table_info(Log)" );

			//var_dump($res);

			//if ( $res !== 0 ) { // no results !!!

			$this::exec( "
                    CREATE TABLE if not exists Log (
                       id              INTEGER    
                                       PRIMARY 
                                       KEY 
                                       AUTOINCREMENT
                                       NOT NULL,
                       project         VARCHAR (128),
                       date            DATETIME,
                       name            VARCHAR (64),
                       email           VARCHAR (64),
                       phone           VARCHAR (50),
                       type            CHAR (1),
                       priority        CHAR (1),
                       module          CHAR (1),
                       subject         VARCHAR (256),
                       message         BLOB,
                       reproduction    BLOB,
                       due             CHAR (1),
                       due_date        DATE,
                       feedback        TEXT (1),
                       login           VARCHAR (50),
                       solution        BLOB,
                       solver          VARCHAR (64),
                       solved_date     DATETIME,
                       solved_status   CHAR (1),
                       solved_feedback CHAR (1),
                       solved_remarks  BLOB 
                    )
                " );

			return true;
		}

		function addLog() {
			$args = $this->args;
			$res = $this->openDatabase();

			if ( $res !== false ) {

				$sql = "
                   INSERT INTO Log (
                      project,
                      date,
                      name,
                      email,
                      phone,
                      type,
                      priority,
                      module,
                      subject,
                      message,
                      reproduction,
                      due,
                      due_date,
                      feedback,
                      login,
                      solution,
                      solver,
                      solved_date,
                      solved_status,
                      solved_feedback,
                      solved_remarks
                   )
                   VALUES (
					  '{$args['project']}',   
                      '{$args['date_form']}',
                      '{$args['name']}',
                      '{$args['email']}',
                      '{$args['phone']}',
                      '{$args['type']}',
                      '{$args['priority']}',
                      '{$args['module']}',
                      '{$args['subject']}',
                      '{$args['message']}',
                      '{$args['reproduction']}',
                      '{$args['due']}',
                      '{$args['due_date']}',
                      '{$args['feedback']}',
                      '{$args['login']}',
                      null,
                      null,
                      null,
                      'O',
                      null,
                      null 
                   )
                ";

				$this::exec( $sql );
			}

			return $this::lastErrorCode();
		}

		function getRecords() {
			$start = array_key_exists( 'start', $this->args ) ? $this->args['start'] : 0;
			$limit = array_key_exists( 'limit', $this->args ) ? $this->args['limit'] : 25;

			$sql = "
                SELECT *
                FROM Log
                LIMIT {$start}, {$limit}
            ";

			$query = $this::query( $sql );

			$itemList = [];
			while ( $row = $query->fetchArray( SQLITE3_ASSOC ) ) {
				$itemList[] = $row;
			}

			$dbStatus = $this::lastErrorCode() === 101;
			$query->finalize();

			return [
				'success' => $dbStatus,
				'message' => $dbStatus ? 'OK' : 'Query Error: ' . $this::lastErrorCode(),
				'dbStatus' => [
					'error' => $this::lastErrorCode(),
					'msg' => $this::lastErrorMsg(),
				],
				'records' => $itemList,
				'total' => $dbStatus ? count( $itemList ) : 0
			];
		}
	}
}