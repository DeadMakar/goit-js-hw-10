import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import { refs } from './refs.js';
import Notiflix from 'notiflix';

async function populateBreedsSelect() {
  try {
    refs.loader.style.display = 'block';
    const breeds = await fetchBreeds();

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      refs.breedSelect.appendChild(option);
    });
  } catch (err) {
    refs.error.style.display = 'block';
    console.error(err);

    Notiflix.Notify.failure('An error occurred while loading cat breeds');
  } finally {
    refs.loader.style.display = 'none';
  }
}

async function searchCat() {
  const selectedBreedId = refs.breedSelect.value;

  try {
    refs.loader.style.display = 'block';
    refs.error.style.display = 'none';
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
      refs.catInfo.innerHTML = catInfoTemplate;
    } else {
      refs.catInfo.innerHTML = '';

      Notiflix.Notify.warning('There is no data on this breed of cat');
    }
  } catch (err) {
    refs.error.style.display = 'block';
    console.error(err);

    Notiflix.Notify.failure('An error occurred while searching for a cat');
  } finally {
    refs.loader.style.display = 'none';
  }
}

refs.breedSelect.addEventListener('change', searchCat);

populateBreedsSelect();
