//placeholder for the voice API call 
var voiceApiCall = 'https://api.voicerss.org/?key=68c1383670f94020b6398d1b0e3a5fa8&hl=en-us&src=Hello,%20world!'

//placeholder for the drink API call
var drinkApiCall = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';

fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=')
    .then(function (result) {
        return result.json();
    }).then(function(drinkData){
        var cockTails = [];
        console.log(drinkData.drinks.length);

        for (i=0; i < drinkData.drinks.length; i++) {
            cockTails[i] = {
                drinkName: "",
                drinkCategory: "",
                drinkGlass: "",
                drinkIngredients: [/*measuments and ingredients*/],
                
            }
        }
    })