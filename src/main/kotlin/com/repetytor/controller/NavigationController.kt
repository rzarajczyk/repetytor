package com.repetytor.controller

import com.repetytor.model.LinkItem
import com.repetytor.model.NavigationResponse
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/actions")
class NavigationController {
    
    @GetMapping("/get-navigation.php")
    fun getNavigation(): NavigationResponse {
        val links = listOf(
            LinkItem(link = "index.php", name = "Graj!")
        )
        
        return NavigationResponse(status = true, navigation = links)
    }
}
