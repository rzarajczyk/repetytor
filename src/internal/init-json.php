<?php
require_once 'init.php';
header("Content-type: application/json; charset=utf-8");

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


set_exception_handler(function (Throwable $exception) {
    require_once 'Config.php';
    $config = ConfigProvider::instance();
    $result = [
        'status' => false,
        'reason' => [
            'type' => $exception::class,
            'message' => $exception->getMessage(),
            'code' => $exception->getCode(),
            'details' => $exception,
            'trace' => $config->show_errors() ? $exception->getTrace() : [],
        ]
    ];

    http_response_code(500);
    echo Json::encode($result);
});


function OK(mixed $data = null): array {
    if ($data === null) {
        return ['status' => true];
    } else {
        return ['status' => true, 'data' => $data];
    }
}