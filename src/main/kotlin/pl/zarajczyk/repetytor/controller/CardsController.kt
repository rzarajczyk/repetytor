package pl.zarajczyk.repetytor.controller

import pl.zarajczyk.repetytor.model.ApiResponse
import pl.zarajczyk.repetytor.model.Card
import pl.zarajczyk.repetytor.service.AdditionCardsGenerator
import pl.zarajczyk.repetytor.service.BiasedRandom
import pl.zarajczyk.repetytor.service.MultiplicationCardsGenerator
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
