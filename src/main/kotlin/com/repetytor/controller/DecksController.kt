package com.repetytor.controller

import com.repetytor.model.ApiResponse
import com.repetytor.model.Deck
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/actions")
class DecksController {
    
    @GetMapping("/get-decks.php")
    fun getDecks(): ApiResponse<List<Deck>> {
        val decks = listOf(
            Deck("1", "Mnożenie do 30", true),
            Deck("2", "Mnożenie do 100", true),
            Deck("3", "Dodawanie", true)
        )
        
        return ApiResponse(status = true, data = decks)
    }
}
