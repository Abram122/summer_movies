import { split } from 'postcss/lib/list';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/loader';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar';

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
                setLoading(true);
                const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=5c7f402feaee1b179168f7f94ee284fc`);
                const data = await response.json();
                setGenres(data.genres);
                const initialPages = {};
                const initialMovies = {};
                data.genres.forEach((genre) => {
                    initialPages[genre.id] = 1;
                    initialMovies[genre.id] = [];
                    fetchMoviesByGenre(genre.id, 1);
                });
                setPage(initialPages);
                setMovies(initialMovies);
                setLoading(false);
            } catch (error) {
                setError('Something went wrong while fetching genres!');
                setLoading(false);
            }
        };
        fetchGenres();
        // eslint-disable-next-line
    }, []);

    const fetchMoviesByGenre = async (genreId, page) => {
        try {
            setLoading(true);
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

    if (loading) {
        return <div className='w-full h-[100vh]'><Loader /></div>;
    }

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    const store = (img, title, year) => {
        if (localStorage.getItem('title')) {
            const image = localStorage.getItem('img') + img + ",";
            const check = localStorage.getItem('title');
            const Title = localStorage.getItem('title') + title + ",";
            const dataofp = localStorage.getItem('year') + year.slice(0, 4) + ",";
            const all = split(check, ',');
            if (all.includes(title) === true) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'This movie is already saved!',
                });
            } else {
                localStorage.setItem('title', Title);
                localStorage.setItem('img', image);
                localStorage.setItem('year', dataofp);
                Swal.fire({
                    icon: 'success',
                    title: 'Saved!',
                    text: 'Movie has been saved successfully!',
                });
            }
        } else {
            localStorage.setItem('img', img + ",");
            localStorage.setItem('title', title + ",");
            localStorage.setItem('year', year.slice(0, 4) + ",");
        }
    };

    return (
        <div className='movies bg-gradient-to-b from-gray-900 to-black min-h-screen pb-10'>
            <Navbar />
            <h1 className='text-white text-center mb-6 text-3xl font-bold tracking-wide'>Search By Your Favorite Category (e.g. Horror)</h1>
            <div className='flex justify-center mb-8'>
                <select
                    className='w-fit py-3 px-5 bg-gray-800 text-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-yellow-400'
                    onChange={(e) => setFilterMoview(e.target.value)}
                >
                    <option value={''}>All</option>
                    {genres.map((item) => (
                        <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                </select>
            </div>
            {(filterMoview ? genres.filter((item) => item.name === filterMoview) : genres).map((genre) => (
                <div key={genre.id} className='w-[95%] m-auto mb-12'>
                    <h2 className='text-yellow-400 text-2xl font-semibold ms-3 mb-8'>{genre.name} Movies</h2>
                    <div className='flex flex-wrap justify-center gap-8'>
                        {movies[genre.id]?.map((movie) => (
                            <div
                                key={movie.id}
                                className='w-[300px] bg-gray-800 rounded-xl shadow-lg overflow-hidden relative group transition-transform duration-300 hover:scale-105'
                            >
                                <div className="absolute top-2 left-2 z-10">
                                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
                                        {movie.vote_average.toFixed(1)}
                                    </span>
                                </div>
                                <img
                                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-[400px] object-cover"
                                />
                                <div className="p-4 flex flex-col gap-2">
                                    <h3 className='text-white text-lg font-semibold truncate' title={movie.title}>
                                        {movie.title.length > 20 ? movie.title.slice(0, 20) + "..." : movie.title}
                                    </h3>
                                    <p className='text-gray-300 text-sm'>Released: {movie.release_date}</p>
                                    <div className="flex justify-between mt-2">
                                        <Link
                                            to={`/movies/${movie.id}`}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            Details
                                        </Link>
                                        <button
                                            className="bg-yellow-500 hover:bg-yellow-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                                            onClick={() => store(`https://image.tmdb.org/t/p/w300${movie.poster_path}`, movie.title, movie.release_date)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                    {expandedMovie === movie.id && (
                                        <div className="mt-3">
                                            <p className='text-white text-sm'>{movie.overview}</p>
                                            {movie.trailerUrl && (
                                                <a
                                                    href={movie.trailerUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block mt-2 text-blue-400 underline text-sm"
                                                >
                                                    Watch Trailer
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="absolute top-2 right-2 bg-gray-700 bg-opacity-70 text-white rounded-full p-1 hover:bg-yellow-500 transition"
                                    onClick={() => handleToggleDetails(movie.id)}
                                    title={expandedMovie === movie.id ? "Hide Story" : "Show Story"}
                                >
                                    {expandedMovie === movie.id ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className='text-center mt-8'>
                        <button
                            className='px-10 py-3 bg-yellow-400 text-white rounded-2xl hover:bg-yellow-500 transition my-10 font-semibold shadow'
                            onClick={() => loadMoreMovies(genre.id)}
                        >
                            Load More {genre.name} Movies
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Movies;