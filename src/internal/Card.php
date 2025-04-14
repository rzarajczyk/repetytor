<?php
require_once 'init-internal.php';

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
