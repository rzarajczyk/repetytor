<?php
require_once 'init-internal.php';

interface CardsGenerator {
    /** @return Card[] */
    function generate(): array;
}

