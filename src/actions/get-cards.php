<?php
require_once '../internal/init-json.php';
// ==
require_once '../internal/standard-generators.php';
require_once '../internal/biased-random.php';

$deckId = $_GET['deckId'] ?? throw new Exception('deckId');
$limit = $_GET['limit'] ?? 10;
$randomize = $_GET['randomize'] ?? true;

$generator = null;
switch ($deckId) {
    case "1":
        $generator = new MultiplicationCardsGenerator(30);
        break;
    case "2":
        $generator = new MultiplicationCardsGenerator(100);
        break;
    case "3":
    default:
        $generator = new AdditionCardsGenerator();
}

$cards = $generator->generate();

if ($randomize) {
    $biases = array_map(fn($it) => $it->bias, $cards);
    $cards = getMultipleBiasedRandomElements($cards, $biases, $limit);
}

echo Json::encode(OK($cards));