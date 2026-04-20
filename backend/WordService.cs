namespace backend;

using System;
using System.Collections.Generic;
using System.IO;

public class WordService
{
    // En dictionary som håller reda på flera listor av ord, baserat på språkkod
    private readonly Dictionary<string, HashSet<string>> _dictionaries = new(StringComparer.OrdinalIgnoreCase);

    // 1. STANDARD-KONSTRUKTORN
    public WordService()
    {
        // Ladda in båda språken när servicen startar
        LoadDictionary("eng", "english.txt");
        LoadDictionary("swe", "swedish.txt");
    }

    // 2. TEST-KONSTRUKTORN (Används av våra xUnit-tester!)
    // Defaultar till "eng" så att du inte behöver skriva om alla dina gamla tester.
    public WordService(string[] testWords, string langCode = "eng")
    {
        var testSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (string word in testWords)
        {
            testSet.Add(word.Trim());
        }
        _dictionaries[langCode] = testSet;
    }

    // --- HJÄLPMETOD FÖR ATT LADDA FILER ---
    private void LoadDictionary(string langCode, string fileName)
    {
        // ÄNDRING HÄR: Vi använder AppContext.BaseDirectory istället för Directory.GetCurrentDirectory()
        string filePath = Path.Combine(AppContext.BaseDirectory, "wordlists", fileName);

        var wordSet = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        if (File.Exists(filePath))
        {
            string[] words = File.ReadAllLines(filePath);
            foreach (string word in words)
            {
                wordSet.Add(word.Trim());
            }
            Console.WriteLine($"\nSUCCESS: Laddade in {wordSet.Count} ord för språket '{langCode}'!\n");
        }
        else
        {
            Console.WriteLine($"\nERROR: Kunde INTE hitta filen '{fileName}' för språket '{langCode}' på sökvägen: {filePath}\n");
        }

        // Spara listan i vår dictionary, även om den är tom (förhindrar kraschar senare)
        _dictionaries[langCode] = wordSet;
    }

    // --- UPPDATERAD VALIDERING ---
    // Kräver nu att man skickar med vilket språk man vill kolla mot
    public bool IsValidWord(string word, string langCode)
    {
        // Kolla först om språket finns inläst
        if (_dictionaries.TryGetValue(langCode, out var validWordsForLanguage))
        {
            return validWordsForLanguage.Contains(word.Trim());
        }

        // Om någon försöker spela på ett språk vi inte har (t.ex. "ger")
        Console.WriteLine($"WARNING: Försökte validera ord för okänt språk: {langCode}");
        return false;
    }
}