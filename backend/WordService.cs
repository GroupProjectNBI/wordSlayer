namespace backend;

using System;
using System.Collections.Generic;
using System.IO;

public class WordService
{
    private readonly HashSet<string> _validWords = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

    // 1. STANDARD-KONSTRUKTORN
    public WordService()
    {
        string filePath = Path.Combine(Directory.GetCurrentDirectory(), "wordlists", "english.txt");
        if (File.Exists(filePath))
        {
            string[] words = File.ReadAllLines(filePath);
            foreach (string word in words)
            {
                _validWords.Add(word.Trim());
            }
            // LÄGG TILL DENNA RAD SÅ VI SER ATT DET FUNKAR!
            Console.WriteLine($"\nSUCCESS: Laddade in {_validWords.Count} ord i ordboken!\n");
        }
        else
        {
            // LÄGG TILL DENNA RAD SÅ VI SER OM FILEN SAKNAS!
            Console.WriteLine($"\nERROR: Kunde INTE hitta filen på sökvägen: {filePath}\n");
        }
    }

    // 2. TEST-KONSTRUKTORN (Används av våra xUnit-tester!)
    public WordService(string[] testWords)
    {
        foreach (string word in testWords)
        {
            _validWords.Add(word.Trim());
        }
    }

    public bool IsValidWord(string word)
    {
        return _validWords.Contains(word.Trim());
    }
}