import {
    elements
} from './base';

export const getInput = () => elements.searchInput.value;
export const getProtein = () => elements.proteinInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
    elements.proteinInput.value = '';
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active');
};


export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        //return the result
        return `${newTitle.join(' ')} ...)`
    }
    return title;
}

const renderRecipe = recipe => {
    let img = `https://spoonacular.com/recipeImages/${recipe.id}-90x90.jpg`;
    const markup = `
                <li>
                    <a class="results__link results__link--active" href="#${recipe.id}">
                        <figure class="results__fig">
                            <img src="${img}" alt=${recipe.title}>
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                        </div>
                    </a>
                </li>
`;
//<p class="results__author">${recipe.publisher}</p>
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

//Type : prev or next
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1: page + 1}>
         <span>Page ${type === 'prev' ? page - 1: page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
        </svg>
    </button>
   
`

;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        //Button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both buttons 
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
            `
    } else if (page === pages && pages > 1) {
        //Only button to go to prev page
        button = createButton(page, 'prev');
    } else{
        button = ' ';
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    if(recipes.length === 0){
        elements.searchResList.insertAdjacentHTML('beforeend', `<li><div class="results__data"><h4 class="results__name">no more results</h4></div></li>`);
    }else{
    recipes.slice(start, end).forEach(renderRecipe);
    }

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};
