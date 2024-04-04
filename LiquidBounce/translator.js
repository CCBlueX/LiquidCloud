// printing bugs out with latin alfabet. because minecraft is wierd and doesnt "allow" it

const URL = Java.type("java.net.URL");
const HttpURLConnection = Java.type("java.net.HttpURLConnection");
const BufferedReader = Java.type("java.io.BufferedReader");
const InputStreamReader = Java.type("java.io.InputStreamReader");

const script = registerScript({
   name: "Translator",
   version: "1.0.8",
   authors: ["Trikaes"]
});

script.registerCommand({
   name: "translate",
   aliases: ["tr"],
   parameters: [
      {
         name: "sourceLanguage",
         type: "string",
         required: true,
         description: "The source language code (en, fr, de, etc...)"
      },
      {
         name: "targetLanguage",
         type: "string",
         required: true,
         description: "The target language code (en, fr, de, etc...)"
      },
      {
         name: "word",
         type: "string",
         required: true,
         description: "The word to translate"
      }
   ],
   onExecute(sourceLanguage, targetLanguage, word) {
      try {
         const url = new URL(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(word)}`); // finally got this to work
         
         // starting a connection to the api
         const connection = url.openConnection();
         // setting the request method to GET (getting a value back from the server)
         connection.setRequestMethod("GET");
         
         // getting the response code from the server (went successfully or went wrong)
         const responseCode = connection.getResponseCode();
         if (responseCode === 200) {
            // reading the response from the server (the value returned from the server)
            const inputStream = connection.getInputStream();
            const reader = new BufferedReader(new InputStreamReader(inputStream));
            let line;
            let response = "";
            while ((line = reader.readLine()) !== null) {
               response += line;
            }
            reader.close();
            inputStream.close();

            // parsing the JSON response -> converting a string to object
            const jsonResponse = JSON.parse(response);
            const translatedText = jsonResponse[0][0][0];

            Client.displayChatMessage(`§cTranslation §7(§c${sourceLanguage} §7to §c${targetLanguage}§7): §c${word} §7-> §c${translatedText}`); // cool colors


         } else {
            Client.displayChatMessage(`§4failed to translate word '${word}'. response code: ${responseCode}`); // hope i dont get this
         }
      } catch (error) {
         Client.displayChatMessage(`§4error translating word '${word}': ${error}`); // hope i dont get this
      }
   }
});
