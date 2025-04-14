<?php
require_once '../internal/init-json.php';

require_once '../internal/Json.php';

class LinkItem {
    public string $type = "link";
    function __construct(
        public string $link,
        public string $name
    ) {}
}

$links = array();
$links []= new LinkItem('index.php', 'Graj!');

echo Json::encode([
    'status' => true,
    'navigation' => $links
]);