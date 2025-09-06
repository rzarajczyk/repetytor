<?php
require_once 'init.php';

function atLeastOneInArray($array, $left, $right)
{
    return in_array($left, $array) || in_array($right, $array);
}

function bothInArray($array, $left, $right)
{
    return in_array($left, $array) && in_array($right, $array);
}

class Card implements JsonSerializable {
    public function __construct(
        public ?string $id,
        public string $question,
        public string $answer,
        public float $bias,
        public int $timeout,
        public string $type
    ) {}

    public function jsonSerialize(): array {
        return array(
            'id' => $this->id,
            'question' => $this->question,
            'answer' => $this->answer,
            'timeout' => $this->timeout,
            'bias' => $this->bias,
            'type' => $this->type
        );
    }
}


interface CardsGenerator {
    /** @return Card[] */
    function generate(): array;
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
