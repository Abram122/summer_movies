import axios from "axios";
import { split } from "postcss/lib/list";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";

const Home = () => {
    const [data, setData] = useState('');
    const [search, setSearch] = useState('');
    const [save, setSave] = useState('Save');
    const [saved, setSaved] = useState([]);
    const [saved2, setSaved2] = useState([]);
    const [saved3, setSaved3] = useState([]);
    const [counter, setCounter] = useState(0);

    const getData = () => {
        if (search) {
            axios.get(`https://www.omdbapi.com/?t=${search}&&apiKey=7009afb4`).then((res) => {
                setData(res.data);
            }).catch((err) => {
                console.log(err);
            });
        }
    };

    const store = (img, title, year) => {
        if (localStorage.getItem('title')) {
            const image = localStorage.getItem('img') + img + ",";
            const check = localStorage.getItem('title');
            const Title = localStorage.getItem('title') + title + ",";
            const dataofp = localStorage.getItem('year') + year.slice(-4) + ",";
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
                setCounter(counter + 1);
                Swal.fire({
                    icon: 'success',
                    title: 'Saved!',
                    text: 'Movie has been saved successfully!',
                });
            }
        } else {
            localStorage.setItem('img', img + ",");
            localStorage.setItem('title', title + ",");
            localStorage.setItem('year', year.slice(-4) + ",");
            setCounter(counter + 1);
        }
    };

    const deleteItem = (title) => {
        const check = localStorage.getItem('title');
        const check2 = localStorage.getItem('img');
        const check3 = localStorage.getItem('year');
        const all = split(check, ',');
        const all2 = split(check2, ',');
        const all3 = split(check3, ',');
        const index = all.indexOf(title);
        all.splice(index, 1);
        all2.splice(index, 1);
        all3.splice(index, 1);
        localStorage.setItem('title', all.join());
        localStorage.setItem('img', all2.join());
        localStorage.setItem('year', all3.join());
        setCounter(counter + 1);
    };

    const getSaved = () => {
        if (localStorage.getItem('title')) {
            const all = split(localStorage.getItem('title'), ',');
            const all2 = split(localStorage.getItem('img'), ',');
            const all3 = split(localStorage.getItem('year'), ',');
            setSaved(all.filter(Boolean));
            setSaved2(all2.filter(Boolean));
            setSaved3(all3.filter(Boolean));
        }
    };

    useEffect(() => {
        getData();
        getSaved();
    }, [search, counter]);

    return (
        <div className="bg-gradient-to-b from-gray-900 to-black min-h-[100vh] pb-4">
            <Navbar />
            <div className="container bg-transparent text-white m-auto">
                <h1 className="text-center text-3xl font-bold mb-6">Welcome to Abram Website for searching <br /> and store your fav film to see at any time</h1>
                <form className="w-[90%] m-auto">
                    <input
                        type="text"
                        placeholder="Enter the film Name"
                        className="text-black mt-4 w-full text-blue-gray-700 font-sans font-normal outline-none transition-all border border-blue-gray-200 focus:border-2 focus:border-yellow-400 text-sm px-3 py-2.5 rounded-[7px]"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                {search && data && data.Title ? (
                    <div className="flex flex-wrap justify-center lg:justify-between gap-6 items-center mt-8 w-[90%] m-auto bg-gray-800 border border-yellow-400 rounded-xl p-6 shadow-lg transition-all duration-300">
                        <div className="w-64 relative flex-shrink-0">
                            <h1 className="bg-yellow-500 text-white w-fit p-2 absolute top-0 left-0 rounded-br-lg font-bold shadow">{data.imdbRating}</h1>
                            <img src={data.Poster} alt={data.Title} className="rounded-lg shadow-lg w-full h-[350px] object-cover" />
                        </div>
                        <div className="content space-y-2 lg:w-[50%]">
                            <h1 className="text-xl font-semibold">Title: <span className="font-normal">{data.Title}</span></h1>
                            <h1>Release Time: <span className="font-normal">{data.Released}</span></h1>
                            <h1>Time: <span className="font-normal">{data.Runtime}</span></h1>
                            <h1>Type: <span className="font-normal">{data.Type}</span></h1>
                            <h1>Category: <span className="font-normal">{data.Genre}</span></h1>
                            <h1 className="text-wrap">Story: <span className="font-normal">{data.Plot}</span></h1>
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => store(data.Poster, data.Title, data.Released)}
                                    className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-6 rounded-xl shadow transition-all duration-300 w-40"
                                >
                                    {save}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h1 className="ms-10 mt-4 text-lg text-gray-300">Search For A Movie</h1>
                )}
            </div>
            <div className="w-[90%] m-auto mt-8">
                <h1 className="text-yellow-400 text-3xl font-bold mb-4">Your Saved</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {saved && saved2 && saved.map((item, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-center bg-gray-800 rounded-xl shadow-lg p-4">
                            <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                                <img className="w-32 h-32 object-cover rounded-lg shadow" src={saved2[index]} alt={item} />
                            </div>
                            <div className="md:w-2/3 text-center md:text-left space-y-2">
                                <h1 className="text-white text-xl font-semibold">Title: {item}</h1>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <a className="text-blue-400 underline" href={`https://wecima.show/watch/مشاهدة-فيلم-${item.replace(/ /g, '-')}-${saved3[index]}-مترجم/`} target="_blank" rel="noopener noreferrer">MyCima</a>
                                    <a className="text-blue-400 underline" href={`https://web5.topcinema.top/فيلم-${item.replace(/ /g, '-')}-${saved3[index]}-مترجم-اون-لاين/watch/`} target="_blank" rel="noopener noreferrer">topCima</a>
                                    <a className="text-blue-400 underline" href={`https://r9.cimalek.buzz/movies/${item.replace(/ /g, '-')}/watch/`} target="_blank" rel="noopener noreferrer">cimalek</a>
                                    <a className="text-blue-400 underline" href={`https://xxz.tuktukcinema.shop//${item.replace(/ /g, '-')}-${saved3[index]}/`} target="_blank" rel="noopener noreferrer">tuktok</a>
                                </div>
                                <button
                                    onClick={() => deleteItem(item)}
                                    className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-6 rounded-xl shadow transition-all duration-300 w-40 mt-2"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;