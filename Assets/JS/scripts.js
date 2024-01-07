var recipeEl = document.querySelector('#cocktail-recipe');
var createParagraph = document.createElement('p');
var createAudio = document.createElement('audio');
var createAudioSrc = document.createElement('source');

var selectEl = document.getElementById("cocktails")

//placeholder for the voice API call 
var voiceApiCall = 'https://api.voicerss.org/?key=68c1383670f94020b6398d1b0e3a5fa8&hl=en-us&src='

//placeholder for the drink API call
var drinkApiCall = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

//list to store drinks in.

var drinkList = [];

if (localStorage.getItem('lastPicked') !== null) {
    var initialValue = parseInt(localStorage.getItem('lastPicked')) - 1;
} else {
    var initialValue = 0;
}

//fetch chain
fetch(drinkApiCall)
.then(function (result) {
    return result.json();
})
.then(genDrinksList)
.then(addDrinks)


//function returns 25 drink objects when called
function genDrinksList(drinkData) {
    // var drinkList = [];

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

    //logic to grab the 15 Measurments from the data provided
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

    //logic to place both the ingredients and the corrosponding measuments in an object together
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

    return drinkList;
}

//adds the options to the select element
function addDrinks(drinkList) {

    var selectOptionsEl = document.querySelectorAll('#cocktails option');

    for (var i = 0; i < selectOptionsEl.length; i++) {
        selectOptionsEl[i].text = drinkList[i].drinkName;

        if (i === initialValue){
            selectOptionsEl[i].setAttribute('selected', 'true');
        }
    }

    addIngredients(drinkList[initialValue]);
}


function addIngredients(drinkData) {
    var ingredientList = "";

    for (i = 0; i < drinkData.drinkIngredients.length; i++) {
        if (drinkData.drinkIngredients[i].measurement !== null){
            ingredientList += drinkData.drinkIngredients[i].ingredient + " - " + drinkData.drinkIngredients[i].measurement + "\n";
        } else {
            ingredientList += drinkData.drinkIngredients[i].ingredient + "\n";
        }
    }

    var instructionsText =
    "\nDrink: " + drinkData.drinkName + "\n\n" +
    "Category: " + drinkData.drinkCategory + "\n\n" +
    "Type of Glass: " + drinkData.drinkGlass + "\n\n" +
    "Ingredients and Measurments: \n" + ingredientList + "\n" +
    "Instructions: \n" + drinkData.drinkInstructions;

    var TTSsrc = "https://api.voicerss.org/?key=68c1383670f94020b6398d1b0e3a5fa8&hl=en-us&src=" + instructionsText;

    recipeEl.innerHTML = "";

    createParagraph.innerText = instructionsText;

    recipeEl.appendChild(createParagraph);
    recipeEl.appendChild(createAudio);

    createAudio.setAttribute("id", "audio");
    createAudio.setAttribute("controls", "controls");
    createAudioSrc.setAttribute("id", "audioSrc");
    document.getElementById('audio').load();
    createAudioSrc.setAttribute("src", TTSsrc);
    createAudio.appendChild(createAudioSrc);
}

selectEl.addEventListener("change", function () {
    addIngredients(drinkList[selectEl.value-1]);
    localStorage.setItem("lastPicked", selectEl.value);
    initialValue = parseInt(localStorage.getItem('lastPicked'));
});