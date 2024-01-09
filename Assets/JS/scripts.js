//global dom manipulation
var recipeEl = document.querySelector('#cocktail-recipe');
var createParagraph = document.createElement('p');
var createAudio = document.createElement('audio');
var createAudioSrc = document.createElement('source');
var selectOptionsEl = document.querySelectorAll('#cocktails option');
var selectEl = document.getElementById("cocktails")

//placeholder for the voice API call 
var voiceApiCall = 'https://api.voicerss.org/?key=68c1383670f94020b6398d1b0e3a5fa8&hl=en-us&src='

//placeholder for the drink API call
var drinkApiCall = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

//list to store drinks in.
var drinkList = [];

//initializes the value that remembers the last picked item in the select list
if (localStorage.getItem('lastPicked') !== null) {
    var initialValue = parseInt(localStorage.getItem('lastPicked')) - 1;
} else {
    var initialValue = 0;
}

//fetch chain
fetch(drinkApiCall)
    .then(function (result) { return result.json(); })
    .then(genDrinksList)
    .then(addDrinks)


//function returns 25 drink objects when called
function genDrinksList(drinkData) {
    //logic to grab the 15 ingredients from the data provided
    function getIngredients(drink) {
        const ingredients = [];
        let i = 1;

        for (const [key, value] of Object.entries(drink)) {
            if (key === 'strIngredient' + i) {
                ingredients.push(value);
                if (i <= 15) {
                    i++;
                }
            }
        }

        return ingredients;
    }

    //logic to grab the 15 Measurements from the data provided
    function getMeasurements(drink) {
        const measurements = [];
        let i = 1;

        for (const [key, value] of Object.entries(drink)) {
            if (key === 'strMeasure' + i) {
                measurements.push(value);
                if (i <= 15) {
                    i++;
                }
            }
        }

        return measurements;
    }

    //logic to place both the ingredients and the corresponding measurements in an object together
    function createIngredientData(drink) {
        const ingredients = getIngredients(drink);
        const measurements = getMeasurements(drink);

        const ingredientObjects = [];
        for (let i = 0; i < ingredients.length; i++) {
            if (!ingredients[i]) {
                continue;
            }

            const ingredientObject = {
                ingredient: ingredients[i],
                measurement: measurements[i]
            };

            ingredientObjects.push(ingredientObject);
        }
        return ingredientObjects;
    }

    // logic to make an object per drink from the data provided.
    for (var i = 0; i < drinkData.drinks.length; i++) {
        var drinkCall = drinkData.drinks[i];
        drinkList[i] = {
            drinkName: drinkCall.strDrink,
            drinkCategory: drinkCall.strCategory,
            drinkGlass: drinkCall.strGlass,
            drinkIngredients: createIngredientData(drinkCall),
            drinkInstructions: drinkCall.strInstructions
        }
    }
    //returns global variable to next item in fetch chain
    return drinkList;
}

//adds the options to the select element
function addDrinks(drinkList) {

    //sets the text of each option in the select element to the corresponding drink
    for (var i = 0; i < selectOptionsEl.length; i++) {
        selectOptionsEl[i].text = drinkList[i].drinkName;

        //selects the initial option based on local storage
        if (i === initialValue) {
            selectOptionsEl[i].setAttribute('selected', 'true');
        }
    }

    addIngredients(drinkList[initialValue]);
}

//adds the ingredients and instructions to the corresponding div element.
//adds the audio player and fetch
function addIngredients(drinkData) {
    //empty container for the ingredients and measurements
    var ingredientList = "";

    //concatenates the ingredients with their corresponding 
    for (i = 0; i < drinkData.drinkIngredients.length; i++) {
        if (drinkData.drinkIngredients[i].measurement !== null) {
            ingredientList += drinkData.drinkIngredients[i].ingredient + " - " + drinkData.drinkIngredients[i].measurement + "\n";
        } else {
            ingredientList += drinkData.drinkIngredients[i].ingredient + "\n";
        }
    }

    //variable stores the total text for the instructions and TTS fetch
    var instructionsText =
        "\nDrink: " + drinkData.drinkName + "\n\n" +
        "Category: " + drinkData.drinkCategory + "\n\n" +
        "Type of Glass: " + drinkData.drinkGlass + "\n\n" +
        "Ingredients and Measurements: \n" + ingredientList + "\n" +
        "Instructions: \n" + drinkData.drinkInstructions;

    //variable returns an mp3 file with the instructions when called
    var TTSsrc = "https://api.voicerss.org/?key=68c1383670f94020b6398d1b0e3a5fa8&hl=en-us&src=" + instructionsText;

    //small fix to make the AT&T actually read in the TTS vs cutting off earlier
    if (drinkData.drinkName === "AT&T") {
        TTSsrc =
            "https://api.voicerss.org/?key=68c1383670f94020b6398d1b0e3a5fa8&hl=en-us&src=" + 

            "\nDrink: " + "A.T. and T." + "\n\n" +
            "Category: " + drinkData.drinkCategory + "\n\n" +
            "Type of Glass: " + drinkData.drinkGlass + "\n\n" +
            "Ingredients and Measurements: \n" + ingredientList + "\n" +
            "Instructions: \n" + drinkData.drinkInstructions;
    }
    //resets the ingredients and instructions before generating new ones
    recipeEl.innerHTML = "";

    //makes a paragraph with instructionsText as its text
    createParagraph.innerText = instructionsText;

    //appends the paragraph to the div containing the recipe
    recipeEl.appendChild(createParagraph);
    //appends the audio source to the div containing the recipe
    recipeEl.appendChild(createAudio);

    //Dom sets up the audio player
    createAudio.setAttribute("id", "audio");
    createAudio.setAttribute("controls", "controls");
    //dom sets the audio player source
    createAudioSrc.setAttribute("id", "audioSrc");
    //dom ensures that the audio player can reload even if the full page doesn't
    document.getElementById('audio').load();
    //feeds the audio source the TTS defined above
    createAudioSrc.setAttribute("src", TTSsrc);
    //appends the audio source to audio element
    createAudio.appendChild(createAudioSrc);
}

//event listening for the select element to change
selectEl.addEventListener("change", function () {

    //updates recipe
    addIngredients(drinkList[selectEl.value - 1]);

    //updates localStorage
    localStorage.setItem("lastPicked", selectEl.value);
    initialValue = parseInt(localStorage.getItem('lastPicked'));
});