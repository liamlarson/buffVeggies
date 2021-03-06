import axios from 'axios';
import {
    key,
    proxy
} from '../config';


export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            console.log(this.id);
            const res = await axios.get(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}&includeNutrition=true`);
            console.log(res.data);
            this.title = res.data.title;
            this.author = res.data.creditsText;
            this.img = res.data.image;
            this.url = res.data.sourceUrl;
            this.ingredients = res.data.extendedIngredients;
            this.protein = res.data.nutrition.nutrients[8].amount.toString() + res.data.nutrition.nutrients[8].unit  ;
            console.log(this.protein);


        } catch (error) {
            console.log(error)
            alert('Something went wrong :(');
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServerings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g', 'tsps']

        const newIngredients = this.ingredients.map(el => {
            // Uniform units
            let ingredient = el.original.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove paranthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // Parse ingredients into count, unit and ingredient.
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;

            if (unitIndex > -1) {
                // There is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'))
                }
                
                objIng = {
                    count, 
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
                
            } else if (parseInt(arrIng[0], 10)) {
                // There is NO unit, but the 1est element is a number

                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }
    
    updateServings(type){
        //Servings
        const newServings = type === 'dec' ? this.servings -1 : this.servings +1;
        
        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });
        
        this.servings = newServings;
    }
}
