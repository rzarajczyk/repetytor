<?php
require_once 'init-internal.php';

require_once 'CardsGenerator.php';

function atLeastOneInArray($array, $left, $right)
{
    return in_array($left, $array) || in_array($right, $array);
}

function bothInArray($array, $left, $right)
{
    return in_array($left, $array) && in_array($right, $array);
}

class MultiplicationCardsGenerator implements CardsGenerator {
    public function __construct(private int $limit) {}

    function generate(): array
    {
        $cards = array();
        for ($left=0; $left<=10; $left++) {
            for ($right=0; $right<=10; $right++) {
                if ($left * $right <= $this->limit) {
                    $bias = 1.0;
                    if (bothInArray([0, 1, 10], $left, $right)) {
                        $bias = 0.25;
                    }
                    if (atLeastOneInArray([2, 5], $left, $right) || bothInArray([3], $left, $right)) {
                        $bias = 0.5;
                    }
                    if (atLeastOneInArray([7, 8, 9], $left, $right)) {
                        $bias = 2.0;
                    }
                    $result = $left * $right;
                    $card = new Card('', "$left x $right", "$result", $bias, 10000, "number");
                    $cards []= $card;
                }
            }
        }
        return $cards;
    }
}

class AdditionCardsGenerator implements CardsGenerator
{
    function generate(): array
    {
        $cards = array();
        for ($left = 0; $left <= 10; $left++) {
            for ($right = 0; $right <= 10; $right++) {
                $bias = 1.0;
                if (atLeastOneInArray([0, 1, 2], $left, $right)) {
                    $bias = 0.75;
                }
                if (bothInArray([5, 6, 7, 8, 9], $left, $right)) {
                    $bias = 2.0;
                }
                $result = $left + $right;
                $card = new Card('', "$left + $right", "$result", $bias, 10000, "number");
                $cards [] = $card;
            }
        }
        return $cards;
    }
}
