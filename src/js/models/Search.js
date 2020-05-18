import axios from 'axios';
import {key, proxy} from '../config';

export default class Search {
    constructor(query, protein) {
        console.log(query);
        this.query = query;
        this.protein = protein;

    }
    async getResults(query) {
        try {
            const res = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?query=${this.query}&apiKey=${key}&diet=vegetarian&number=100&minProtein=${this.protein}`);
            
            this.result = res.data.results;
            console.log(this.result);
        } catch (error) {
            alert(error)
        }
    }
}
