import axios from "axios"

const API_KEY = '24371516-b10d2b2a42c8e4a8969a3fdf2&q';
const BASE_URL = 'https://pixabay.com';

export default class ImagesApiService {
     constructor() {
          this.searchName = '';
          this.perPage = 40;
          this.page = 1;
     };

     async fetchImages() {
          const fetchImages = await axios.get(`${BASE_URL}/api/?key=${API_KEY}=${this.searchName}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`)
          this.incrementPage();
          return fetchImages.data;
     };

     incrementPage() {
          this.page += 1;
     };

     resetPage() {
          this.page = 1;
     };

     get query() {
          return this.searchName;
     };

     set query(newQuery) {
          this.searchName = newQuery;
     }

}