import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');
const loader = document.querySelector('.loader');
const error = document.querySelector('.error');
const catInfo = document.querySelector('.cat-info');

async function populateBreedsSelect() {
  try {
    loader.style.display = 'block';
    const breeds = await fetchBreeds();

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });
  } catch (err) {
    error.style.display = 'block';
    console.error(err);
  } finally {
    loader.style.display = 'none';
  }
}

async function searchCat() {
  const selectedBreedId = breedSelect.value;

  try {
    loader.style.display = 'block';
    error.style.display = 'none';
    const catData = await fetchCatByBreed(selectedBreedId);

    if (catData) {
      const catInfoTemplate = `
    <div style="display: flex; align-items: center;">
      <img src="${catData.url}" alt="Cat of breed ${catData.breeds[0].name}" class="cat-image">
      <div class="cat-info-container">
        <h2>Cat Information</h2>
        <p>Name: ${catData.breeds[0].name}</p>
        <p>Description: ${catData.breeds[0].description}</p>
        <p>Temperament: ${catData.breeds[0].temperament}</p>
      </div>
    </div>
  `;
      catInfo.innerHTML = catInfoTemplate;
    } else {
      catInfo.innerHTML = '';
    }
  } catch (err) {
    error.style.display = 'block';
    console.error(err);
  } finally {
    loader.style.display = 'none';
  }
}

breedSelect.addEventListener('change', searchCat);

populateBreedsSelect();
