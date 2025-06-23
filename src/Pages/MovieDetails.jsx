import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loader from '../components/loader';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

const API_KEY = '5c7f402feaee1b179168f7f94ee284fc';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos`);
                const data = await res.json();
                setMovie(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load movie details');
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    useEffect(() => {
        // Check if movie is already saved
        const titles = localStorage.getItem('title');
        if (titles && movie) {
            const all = titles.split(',');
            setSaved(all.includes(movie.title));
        }
    }, [movie]);

    const store = (img, title, year) => {
        if (localStorage.getItem('title')) {
            const image = localStorage.getItem('img') + img + ",";
            const check = localStorage.getItem('title');
            const Title = localStorage.getItem('title') + title + ",";
            const dataofp = localStorage.getItem('year') + year.slice(0, 4) + ",";
            const all = check.split(',');
            if (all.includes(title)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'This movie is already saved!',
                });
            } else {
                localStorage.setItem('title', Title);
                localStorage.setItem('img', image);
                localStorage.setItem('year', dataofp);
                setSaved(true);
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
            setSaved(true);
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!movie) return null;

    // Find YouTube trailer
    const trailer = movie.videos?.results?.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center pb-10">
            <Navbar />
            <Link to="/movies" className="mb-6 text-blue-400 underline">← Back to Movies</Link>
            <div className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="mb-4 rounded-lg w-full max-w-xs mx-auto"
                />
                <p className="mb-2"><span className="font-semibold">Release Date:</span> {movie.release_date}</p>
                <p className="mb-2"><span className="font-semibold">Rating:</span> {movie.vote_average?.toFixed(1)}</p>
                <p className="mb-4"><span className="font-semibold">Overview:</span> {movie.overview}</p>
                <button
                    className={`py-2 px-6 rounded-2xl mb-4 ${saved ? 'bg-green-500 text-white' : 'bg-yellow-400 text-white hover:bg-yellow-500'}`}
                    onClick={() => store(
                        `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                        movie.title,
                        movie.release_date
                    )}
                    disabled={saved}
                >
                    {saved ? 'Saved' : 'Save'}
                </button>
                {trailer && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Promo Video</h2>
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                width="100%"
                                height="315"
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;