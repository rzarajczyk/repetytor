package com.repetytor

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class RepetytorApplication

fun main(args: Array<String>) {
    runApplication<RepetytorApplication>(*args)
}
