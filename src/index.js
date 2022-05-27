import ImagesApiService from './js/pixabay-api';
import loadMore from './js/load-more';
import galleryCardTpl from './templates/gallery-card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import './sass/main.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';


const refs = {
  searchForm: document.querySelector('#search-form'),
  imagesGallery: document.querySelector('.gallery'),
  };


const loadMoreButton = new loadMore ({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const imagesApiService = new ImagesApiService();


refs.searchForm.addEventListener('submit', onSearch);
loadMoreButton.refs.button.addEventListener('click', onLoadMore);


async function onSearch(event) {
  event.preventDefault();
  clearMarkup();
  imagesApiService.query = event.currentTarget.searchQuery.value.trim();
  
  if (imagesApiService.query === '') {
    loadMoreButton.hide();
    Notify.failure('Please enter a search word.');
    return 
  };

  loadMoreButton.show();
  loadMoreButton.disable();

  imagesApiService.resetPage();

  const images = await showImages();

  if (images.hits.length !== 0) {
      Notify.success(`Hooray! We found ${images.totalHits} images.`, {timeout: 3000})
  
  } else {
      loadMoreButton.hide();
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  };
      
  if (images.totalHits <= imagesApiService.perPage && images.hits.length !== 0) {
      loadMoreButton.hide();
      Notify.info("We're sorry, but you've reached the end of search results.", {timeout: 6000});
};
}

async function onLoadMore() {
  loadMoreButton.disable();

  const imagesOnClickButton = await showImages();

  if (imagesOnClickButton.hits.length < imagesApiService.perPage) {
    loadMoreButton.hide();
    Notify.info("We're sorry, but you've reached the end of search results.", {timeout: 3000});
};

  // scroll
  const { height: cardHeight } = document.querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

  window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});
}


//Обработка запроса
async function showImages() {
  try {
    const images = await imagesApiService.fetchImages();
    renderImagesList(images.hits)
    loadMoreButton.enable();
    return images

  } catch (error) {
  console.log(error.name);
}
}

//Рендер карточки
function renderImagesList(images) {
  const markup = galleryCardTpl(images);
      
  refs.imagesGallery.insertAdjacentHTML('beforeend', markup);
        
  let gallery = new SimpleLightbox('.gallery a', { captionsData:'alt', captionDelay:250});
  gallery.refresh()
}

//Очистка разметки
function clearMarkup() {
  refs.imagesGallery.innerHTML = '';
}
