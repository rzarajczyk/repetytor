package com.repetytor.controller

import com.repetytor.model.ApiResponse
import com.repetytor.model.Card
import com.repetytor.service.AdditionCardsGenerator
import com.repetytor.service.BiasedRandom
import com.repetytor.service.MultiplicationCardsGenerator
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/actions")
class CardsController {
    
    @GetMapping("/get-cards.php")
    fun getCards(
        @RequestParam deckId: String,
        @RequestParam(defaultValue = "10") limit: Int,
        @RequestParam(defaultValue = "true") randomize: Boolean
    ): ApiResponse<List<Card>> {
        val generator = when (deckId) {
            "1" -> MultiplicationCardsGenerator(30)
            "2" -> MultiplicationCardsGenerator(100)
            "3" -> AdditionCardsGenerator()
            else -> AdditionCardsGenerator()
        }
        
        var cards = generator.generate()
        
        if (randomize) {
            val biases = cards.map { it.bias }
            cards = BiasedRandom.getMultipleBiasedRandomElements(cards, biases, limit)
        }
        
        return ApiResponse(status = true, data = cards)
    }
}
