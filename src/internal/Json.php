<?php
require_once 'init.php';

class Json {
    public static function encode(mixed $data) {
        $flags = JSON_PRETTY_PRINT;
        $flags |= JSON_THROW_ON_ERROR;
        return json_encode($data, $flags);
    }

    public static function decode(string $data) {
        return json_decode($data, associative: true);
    }
}
