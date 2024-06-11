import { split } from 'postcss/lib/list';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const Movies = () => {
    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState({});
    const [page, setPage] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedMovie, setExpandedMovie] = useState(null);
    const [filterMoview, setFilterMoview] = useState(null);
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=5c7f402feaee1b179168f7f94ee284fc`);
                const data = await response.json();
                setGenres(data.genres);

                // Initialize movies and page state for each genre
                const initialPages = {};
                const initialMovies = {};
                data.genres.forEach((genre) => {
                    initialPages[genre.id] = 1;
                    initialMovies[genre.id] = [];
                    fetchMoviesByGenre(genre.id, 1);
                });

                setPage(initialPages);
                setMovies(initialMovies);
            } catch (error) {
                setError('Something went wrong while fetching genres!');
                setLoading(false);
            }
        };

        fetchGenres();
    }, []);

    const fetchMoviesByGenre = async (genreId, page) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=5c7f402feaee1b179168f7f94ee284fc&with_genres=${genreId}&page=${page}`);
            const data = await response.json();
            const moviesWithDetails = await Promise.all(data.results.map(async (movie) => {
                const movieDetails = await fetchMovieDetails(movie.id);
                return { ...movie, ...movieDetails };
            }));
            setMovies((prevMovies) => ({
                ...prevMovies,
                [genreId]: [...(prevMovies[genreId] || []), ...moviesWithDetails],
            }));
            setLoading(false);
        } catch (error) {
            setError('Something went wrong while fetching movies!');
            setLoading(false);
        }
    };

    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=5c7f402feaee1b179168f7f94ee284fc&append_to_response=videos`);
            const data = await response.json();
            const trailer = data.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            return {
                overview: data.overview,
                trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
            };
        } catch (error) {
            console.error('Failed to fetch movie details:', error);
            return { overview: '', trailerUrl: null };
        }
    };

    const loadMoreMovies = (genreId) => {
        const nextPage = page[genreId] + 1;
        setPage((prevPage) => ({
            ...prevPage,
            [genreId]: nextPage,
        }));
        fetchMoviesByGenre(genreId, nextPage);
    };

    const handleToggleDetails = (movieId) => {
        setExpandedMovie((prevMovieId) => (prevMovieId === movieId ? null : movieId));
    };

    const truncateOverview = (overview) => {
        if (overview.length > 100) {
            return overview.slice(0, 100) + "...";
        }
        return overview;
    };

    if (loading && Object.keys(movies).length === 0) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    const store = (img, title , year) => {
        if(localStorage.getItem('title')){
            const image = localStorage.getItem('img') + img + ","
            const check = localStorage.getItem('title')
            const Title = localStorage.getItem('title') + title + ","
            const dataofp = localStorage.getItem('year') + year.slice(0,4) + ","
            const all = split(check, ',')
            if (all.includes(title) === true) {
                alert('already saved')
                } else {
                localStorage.setItem('title', Title)
                localStorage.setItem('img', image)
                localStorage.setItem('year', dataofp)
                
                }
                console.log(all)
                console.log(all.includes(title))
                }else{
                    localStorage.setItem('img' , img + ",")
                    localStorage.setItem('title', title + ",")
                    localStorage.setItem('year', year.slice(0,4) + ",")
                    
        }
    }
    return (
        <div className='movies bg-black '>
            <div className="nav w-[90%] flex gap-x-4 justify-end mb-4">
                    <Link to={'/'}>
                        <h1 className="text-white hover:text-blue-800 duration-200">Seacrh Page</h1>
                    </Link>
                    <Link to={'/movies'}>
                        <h1 className="text-white hover:text-blue-800 duration-200">All Movies Page</h1>
                    </Link>
                </div>
            <h1 className='text-white text-center mb-3'>Here You Search With Your Fav Category EX: Horror</h1>
            <div className=' flex justify-center'>
            <select className=' w-fit py-3  px-5 bg-gray-800 text-white' onClick={(e)=>{
                setFilterMoview(e.target.value)
            }}>
                <option value={''} >All</option>
            {
                genres.map((item)=>(
                            <option key={item.id} value={item.name}>{item.name}</option>
                ))
                }
            </select>
            </div>
            {
                filterMoview ? genres.filter((item)=>item.name == filterMoview).map((genre) => (
                    <div key={genre.id} className='w-[90%] m-auto'>
                        <h2 className='text-white text-xl ms-3 (mb-4'>{genre.name} Movies</h2>
                        <div className='flex flex-wrap justify-center gap-3'>
                            {movies[genre.id]?.map((movie) => (
                                <div key={movie.id} className='w-[300px] relative'>
                                    <h1 className=" bg-yellow-500 text-white w-fit p-2 absolute top-0 ">{movie.vote_average}</h1>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <h3 className='text-white mt-3'>Title: {movie.title}</h3>
                                    <p className='text-white mt-3'>Realeased Time: {movie.release_date}</p>
                                    {expandedMovie === movie.id ? (
                                        <div >
                                            <p className='text-white mt-3'>Story: {movie.overview}</p>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleToggleDetails(movie.id)} className="text-blue-600 mt-3">Show Details</button>
                                    )}
                                    {movie.trailerUrl && (
                                        <div className='mt-5 mb-5 text-center flex justify-between'>
                                            <a className='text-white bg-yellow-400 py-4 px-8 rounded-2xl' href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">Watch Trailer</a>
                                            <a className='text-white bg-yellow-400 py-4 px-8 rounded-2xl' onClick={()=>{
                                                store(`https://image.tmdb.org/t/p/w300${movie.poster_path}`,movie.title,movie.release_date)
                                            }}>Save</a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='text-center'>
                        <button className='px-10 py-2 bg-yellow-400 text-white rounded-2xl' onClick={() => loadMoreMovies(genre.id)}>Load More {genre.name} Movies</button>
                        </div>
                    </div>
                )):genres.map((genre) => (
                    <div key={genre.id} className='w-[90%] m-auto'>
                        <h2 className='text-white text-xl ms-3 (mb-4'>{genre.name} Movies</h2>
                        <div className='flex flex-wrap justify-center gap-3'>
                            {movies[genre.id]?.map((movie) => (
                                <div key={movie.id} className='w-[300px] relative'>
                                    <h1 className=" bg-yellow-500 text-white w-fit p-2 absolute top-0 ">{movie.vote_average}</h1>
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <h3 className='text-white mt-3'>Title: {movie.title}</h3>
                                    <p className='text-white mt-3'>Realeased Time: {movie.release_date}</p>
                                    {expandedMovie === movie.id ? (
                                        <div >
                                            <p className='text-white mt-3'>Story: {movie.overview}</p>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleToggleDetails(movie.id)} className="text-blue-600 mt-3">Show Details</button>
                                    )}
                                    {movie.trailerUrl && (
                                        <div className='mt-5 mb-5 text-center flex justify-between'>
                                            <a className='text-white bg-yellow-400 py-4 px-8 rounded-2xl' href={movie.trailerUrl} target="_blank" rel="noopener noreferrer">Watch Trailer</a>
                                            <a className='text-white bg-yellow-400 py-4 px-8 rounded-2xl' onClick={()=>{
                                                store(`https://image.tmdb.org/t/p/w300${movie.poster_path}`,movie.title,movie.release_date)
                                            }}>Save</a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='text-center'>
                        <button className='px-10 py-2 bg-yellow-400 text-white rounded-2xl' onClick={() => loadMoreMovies(genre.id)}>Load More {genre.name} Movies</button>
                        </div>
                    </div>
                ))}
            
        </div>
    );
};

export default Movies;
