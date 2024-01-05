//placeholder for the voice API call 
var voiceApiCall = 'https://api.voicerss.org/?key=68c1383670f94020b6398d1b0e3a5fa8&hl=en-us&src=Hello,%20world!'

//placeholder for the drink API call
var drinkApiCall = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

//function returns 25 drink objects when called
function fetchDrinks(){

    //list to store drinks in.
    var drinkList = [];

    fetch(drinkApiCall)
        .then(function (result) {
            return result.json();
        }).then(function(drinkData){


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
                        measurement: measurements[i],
                    };

                    ingredientObjects.push(ingredientObject);
                }
                return ingredientObjects;
            }

            // logic to make an object per drink from the data provided.
            for (var i=0; i < drinkData.drinks.length; i++) {
                var drinkCall = drinkData.drinks[i];
                drinkList[i] = {
                    drinkName: drinkCall.strDrink,
                    drinkCategory: drinkCall.strCategory,
                    drinkGlass: drinkCall.strGlass,
                    drinkIngredients: createIngredientData(drinkCall),
                    drinkInstructions: drinkCall.strInstructions
                }
            }
            
            //returns the list of drink objects
            return drinkList;
        })
}