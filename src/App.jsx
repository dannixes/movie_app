import { useState, useEffect } from 'react'
import Search from './assets/components/Search'
import Spinner from './assets/components/Spinner'
import MovieCard from "./assets/components/MovieCard.jsx";
import {useDebounce} from "react-use";

const API_BASE_URL = 'https://api.themoviedb.org/3'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {

  const [SearchTerm, setSearchTerm] = useState('');
  const [ErrorMessage, setErrorMessage] = useState('');
  const [MovieList, setMovieList] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');


useDebounce(()=> setDebouncedSearchTerm(SearchTerm), 500, [SearchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading (true);
    setErrorMessage('');


    try {
      const endpoint = query
        ?  `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        :  `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

    if(!response.ok){
      throw new Error('Failerd to fetch movies');
    }

    const data = await response.json();

    if(data.response == 'False') {
      setErrorMessage(data.Error || 'Feiled to fetch movies');
      setMovieList([]);
      return;
    }
    setMovieList(data.results || []);

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. pleas try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect( () => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm] );

  return (
    <main>
      <div className='pattern' />

      <div className='wrapper'>
      <header>
        <img src="/hero.png" alt="hero banner" />
        <h1>Find <span className='text-gradient' >Movies</span> you`ll enjoy without a hassle</h1>
        <Search SearchTerm={SearchTerm} setSearchTerm={setSearchTerm} />     
      </header>


      <section className='all-movies' >
        <h2 className='mt-[40px]' >All Movies</h2>

        {IsLoading ? (
          <Spinner />
        ) : ErrorMessage ? (
          <p className='text-red-500' >{ErrorMessage}</p>
        ) : (
        <ul>
          {MovieList.map((movie) => (
            <MovieCard key={movie.id} movie={movie}/>
          ))}
        </ul> 
        )}
      </section>
      </div> 
    </main>
  )
}

export default App
