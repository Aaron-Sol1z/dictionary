const wordForm = document.querySelector(".searchbar");
const wordInput = document.querySelector(".word-input");
const wordEntry = document.querySelector(".word-entry");
const sound = document.getElementById("sound");
const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";

wordForm.addEventListener("submit", async event => {
    event.preventDefault();
    const word = wordInput.value;
    if(word){
        try{
            const wordData = await getWordData(word);
            displayWordEntry(wordData);
        }catch(error){
            displayError(error);
        }
    }else{
        const errorMsg = `Please enter a valid word.`;
        displayError(errorMsg);
    }
});

async function getWordData(word){
    const url = apiUrl + word;
    const response = await fetch(url);
    if(!response.ok){
        throw new Error(`Could not fetch definition for "${word}." Please enter a valid word.`);
    }
    return await response.json();
}

function displayWordEntry(data){
    console.log(data);

    wordEntry.textContent = "";
    wordEntry.style.display = "";
    
    for(let i=0; i < data.length; i++){//iterate through data[]
        //word
        let word = data[i].word;
        const wordDisplay = document.createElement("h2");
        wordDisplay.textContent = word.toUpperCase();
        wordDisplay.classList.add("word-display");
        wordEntry.appendChild(wordDisplay);
        //phonetic
        if(data[i].phonetics.length !== 0){
            let phoneticText = data[i].phonetics[0].text;
            for(let l=0; l < data[i].phonetics.length; l++){
                if(data[i].phonetics[l].text !=='undefined'){
                    phoneticText = data[i].phonetics[l].text;
                }
            }
            const phoneticDisplay = document.createElement("h5");
            phoneticDisplay.textContent = `${phoneticText}`;
            phoneticDisplay.classList.add("phonetic-display");
            wordEntry.appendChild(phoneticDisplay);
            //phonetic audio
            if(data[i].phonetics[0].audio){
                let audioText = data[i].phonetics[0].audio;
                wordEntry.insertAdjacentHTML('beforeend', "<button class='sound-button' onclick='playSound()'><i class='fa-solid fa-volume-high'></i></button>");
                sound.setAttribute("src", audioText);
            }
        }
        for(let j=0; j < data[i].meanings.length; j++){//iterate through meanings[]
            //part of speech
            let partOfSpeech = data[i].meanings[j].partOfSpeech;
            const partOfSpeechDisplay = document.createElement("p");
            partOfSpeechDisplay.textContent = partOfSpeech.charAt(0).toUpperCase() + partOfSpeech.slice(1);
            partOfSpeechDisplay.classList.add("part-of-speech-display");
            wordEntry.appendChild(partOfSpeechDisplay);
            for(let k=0; k < data[i].meanings[j].definitions.length; k++){//iterate through definitions[]
                //definition
                let definition = data[i].meanings[j].definitions[k].definition;
                const defDisplay = document.createElement("p");
                defDisplay.textContent = `${k+1}. ${definition}`;
                defDisplay.classList.add("def-display");
                wordEntry.appendChild(defDisplay);
                //example
                if(data[i].meanings[j].definitions[k].example){
                    let example = data[i].meanings[j].definitions[k].example;
                    const exampleDisplay = document.createElement("p");
                    exampleDisplay.textContent = `Example: "${example}"`;
                    exampleDisplay.classList.add("example-display");
                    wordEntry.appendChild(exampleDisplay);
                }
            }
        }
        if(data.length > 1 && i+1 !== data.length){
            wordEntry.appendChild(document.createElement("hr"));
        }
    }    
}

function playSound(){
    sound.play();
}

function displayError(message){
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("error-display");
    wordEntry.textContent = "";
    wordEntry.style.display = "";
    wordEntry.appendChild(errorDisplay);
}