<?php
require_once 'init.php';

if (!defined('ACCESSIBLE_REACHED')) {
    http_response_code(500);
    echo "Direct access forbidden";
}