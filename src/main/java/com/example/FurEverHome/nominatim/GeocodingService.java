package com.example.FurEverHome.nominatim;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeocodingService {
    private final RestTemplate restTemplate;

    @Autowired
    public GeocodingService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map<String, Double> getCoordinates(String city, String county) {
        String url = "https://nominatim.openstreetmap.org/search?city={city}&county={county}&format=json&limit=1";
        Map<String, String> params = new HashMap<>();
        params.put("city", city);
        params.put("county", county);
        Map<String, Object>[] response = restTemplate.getForObject(url, Map[].class, params);
        if (response != null && response.length > 0) {
            Map<String, Object> locationData = response[0];
            Double latitude = Double.parseDouble((String) locationData.get("lat"));
            Double longitude = Double.parseDouble((String) locationData.get("lon"));
            Map<String, Double> coordinates = new HashMap<>();
            coordinates.put("latitude", latitude);
            coordinates.put("longitude", longitude);
            return coordinates;
        }
        return null;
    }

}
