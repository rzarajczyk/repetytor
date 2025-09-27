package com.repetytor.service

import com.repetytor.model.Card

interface CardsGenerator {
    fun generate(): List<Card>
}

class MultiplicationCardsGenerator(private val limit: Int) : CardsGenerator {
    
    override fun generate(): List<Card> {
        val cards = mutableListOf<Card>()
        
        for (left in 0..10) {
            for (right in 0..10) {
                if (left * right <= limit) {
                    val bias = calculateBias(left, right)
                    val result = left * right
                    val card = Card("", "$left x $right", "$result", bias, 10000, "number")
                    cards.add(card)
                }
            }
        }
        
        return cards
    }
    
    private fun calculateBias(left: Int, right: Int): Double {
        return when {
            bothInArray(listOf(0, 1, 10), left, right) -> 0.25
            atLeastOneInArray(listOf(2, 5), left, right) || bothInArray(listOf(3), left, right) -> 0.5
            atLeastOneInArray(listOf(7, 8, 9), left, right) -> 2.0
            else -> 1.0
        }
    }
    
    private fun atLeastOneInArray(array: List<Int>, left: Int, right: Int): Boolean {
        return array.contains(left) || array.contains(right)
    }
    
    private fun bothInArray(array: List<Int>, left: Int, right: Int): Boolean {
        return array.contains(left) && array.contains(right)
    }
}

class AdditionCardsGenerator : CardsGenerator {
    
    override fun generate(): List<Card> {
        val cards = mutableListOf<Card>()
        
        for (left in 0..10) {
            for (right in 0..10) {
                val bias = calculateBias(left, right)
                val result = left + right
                val card = Card("", "$left + $right", "$result", bias, 10000, "number")
                cards.add(card)
            }
        }
        
        return cards
    }
    
    private fun calculateBias(left: Int, right: Int): Double {
        return when {
            atLeastOneInArray(listOf(0, 1, 2), left, right) -> 0.75
            bothInArray(listOf(5, 6, 7, 8, 9), left, right) -> 2.0
            else -> 1.0
        }
    }
    
    private fun atLeastOneInArray(array: List<Int>, left: Int, right: Int): Boolean {
        return array.contains(left) || array.contains(right)
    }
    
    private fun bothInArray(array: List<Int>, left: Int, right: Int): Boolean {
        return array.contains(left) && array.contains(right)
    }
}
