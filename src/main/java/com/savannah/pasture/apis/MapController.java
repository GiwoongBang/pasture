package com.savannah.pasture.apis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MapController {

    @Value("${google.map.key}")
    private String googleMapKey;

    @GetMapping("/")
    public String showMap(Model model) {
        model.addAttribute("googleMapKey", googleMapKey);
        return "map";
    }

}
