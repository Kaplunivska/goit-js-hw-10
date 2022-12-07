import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;
const MAX_SHOWN_COUNTRIES = 10;
const refs = {
    query: document.querySelector('#search-box'),
    countries: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.query.addEventListener('input', debounce(searchHandler, DEBOUNCE_DELAY));

function searchHandler(e) {

    const name = e.target.value.trim();
    
    if (name.length === 0) {
        clearCountries();
        clearCountry();
        return;   
    }
  
    fetchCountries(name).then(showResult).catch(searchError);
}

function showResult(data) {

    if (data.length >= MAX_SHOWN_COUNTRIES) {
        clearCountry();
        clearCountries();

        Notify.info('Too many matches found. Please enter a more specific name.');
    } else if (data.length === 1) {
        clearCountries();
        showCountry(data[0]); 
    } else {
        clearCountry();
        showCountries(data);
    }
}

function searchError() {
    clearCountry();
    clearCountries();
    Notify.failure('Oops, there is no country with that name');
}

function showCountry(country) {
    const {
      name: { official },
      capital,
      population,
      flags: { svg: flag },
      languages,
    } = country;
  
    refs.countryInfo.innerHTML = `
      <div class="country-info__name">
        <img src="${flag}" width="50" alt="${official}">
        <h1>${official}</h1>
      </div>
      <ul class="country-info__desc">
        <li><b>Capital: </b>${capital}</li>
        <li><b>Population: </b>${population}</li>
        <li><b>Languages: </b>${Object.values(languages).join(', ')}</li>
      </ul>
    `;
  }

  function clearCountry() {
    refs.countryInfo.innerHTML = '';
}

function showCountries(list) {
 refs.countries.innerHTML = list
   .map(({ flags: { svg }, name: { official } }) => {
    return `
     <li class="country-list__item">
          <img src="${svg}" width="30" alt="${official}"> ${official}
        </li>
        `;
    })
   .join('');
}

function clearCountries() {
refs.countries.innerHTML = '';
}

