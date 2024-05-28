package com.example.FurEverHome.utils;

public class StringUtils {
    public static String replaceDiacritics(String input) {
        return input
                .replace("ă", "a")
                .replace("Ă", "A")
                .replace("â", "a")
                .replace("Â", "A")
                .replace("î", "i")
                .replace("Î", "I")
                .replace("ș", "s")
                .replace("Ș", "S")
                .replace("ț", "t")
                .replace("Ț", "T");
    }
}
