<?php
require_once '../internal/init-json.php';

class Deck{
    public function __construct(
        public string $id,
        public string $name,
        public bool $own
    ) {}
}

$decks = [
    new Deck("1", "Mnożenie do 30", true),
    new Deck("2", "Mnożenie do 100", true),
    new Deck("3", "Dodawanie", true)
];

echo Json::encode(OK($decks));