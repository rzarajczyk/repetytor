<?php
require_once 'init-web.php';
header("Content-type: application/json; charset=utf-8");

require_once 'NonCriticalException.php';

class MissingParameterException extends Exception {
    public function __construct(
        public string $param
    ) {
        parent::__construct("Missing parameter $this->param");
    }
}


set_exception_handler(function (Throwable $exception) {
    require_once 'Json.php';
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
    if (!($exception instanceof NonCriticalException)) {
        http_response_code(500);
    }
    echo Json::encode($result);
});


function OK(mixed $data = null): array {
    if ($data === null) {
        return ['status' => true];
    } else {
        return ['status' => true, 'data' => $data];
    }
}