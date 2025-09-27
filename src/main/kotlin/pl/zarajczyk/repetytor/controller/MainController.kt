package pl.zarajczyk.repetytor.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping

@Controller
class MainController {
    
    @GetMapping("/", "/index.php")
    fun index(): String {
        return "index"
    }
}
