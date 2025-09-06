<?php
require_once 'init.php';

function random(): float {
    return mt_rand() / mt_getrandmax();
}

function getBiasedRandomIndex(array $biases): int {
    /* example
    biases = [ 1.0, 0.5, 2.0, 1.25, 1.0 ]
    expected ranges = [0-1.0)[1.0-1.5)[1.5-3.5)[3.5-4.75)[4.75-5.75)
    if random = 0.0   => [0] 0.0 >= 1.0 False => return 0
    if random = 0.6   => [0] 0.6 >= 1.0 False => return 0
    if random = 4.5   => [0] 4.5 >= 1.0 True [1] 4.5 >= 1.5 True [2] 4.5 >= 3.5 True [3] 4.5 >= 4.75 False => return 3
    if random = 1.5   => [0] 1.5 >= 1.0 True [1] 1.5 >= 1.5 True [2] 1.5 >= 3.5 False => return 2
    if random = 5.74  => [0] 5.74 >= 1.0 [1] 5.74 >= 1.5 [2] >= 3.5 [3] >=4.75 [4] 5.74 >= 5.75 False => return 4
    */

    $rightRangeBordersExclusive = array();
    $border = 0.0;
    foreach ($biases as $bias) {
        $border += $bias;
        $rightRangeBordersExclusive []= $border;
    }

    $random = random() * $border;

    $index = 0;
    while ($random >= $rightRangeBordersExclusive[$index]) {
        $index++;
    }
    return $index;
}

function getMultipleBiasedRandomElements(array $array, array $biases, int $count) {
    if (count($array) <= $count) {
        // nothing to select, just randomize the input array
        $copy = $array;
        shuffle($copy);
        return $copy;
    }
    $result = array();
    $arrayCopy = $array;
    $biasesCopy = $biases;
    for ($i=0; $i<$count; $i++) {
        $randomIndex = getBiasedRandomIndex($biasesCopy);
        $selectedElement = $arrayCopy[$randomIndex];
        $result []= $selectedElement;
        array_splice($arrayCopy, $randomIndex, 1);
        array_splice($biasesCopy, $randomIndex, 1);
    }
    return $result;
}
