    import axios from "axios";
    import { split } from "postcss/lib/list";
    import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
    const Home = () => {
        const [data, setData] = useState('')
        const [search, setSearch] = useState('')
        const [save, setSave] = useState('save')
        const [saved, setSaved] = useState([])
        const [saved2, setSaved2] = useState([])
        const [saved3, setSaved3] = useState([])
        const [counter, setCounter] = useState(0)
        const getData = () => {
            axios.get(`https://www.omdbapi.com/?t=${search}&&apiKey=7009afb4`).then((res) => {
                setData(res.data)
                console.log(res.data)
                console.log(localStorage.getItem('title', ','))
            }).catch((err) => {
                console.log(err)
            })
        }
        const store = (img, title , year) => {
            if(localStorage.getItem('title')){
                const image = localStorage.getItem('img') + img + ","
                const check = localStorage.getItem('title')
                const Title = localStorage.getItem('title') + title + ","
                const dataofp = localStorage.getItem('year') + year.slice(-4) + ","
                const all = split(check, ',')
                if (all.includes(title) === true) {
                    alert('already saved')
                    } else {
                    localStorage.setItem('title', Title)
                    localStorage.setItem('img', image)
                    localStorage.setItem('year', dataofp)
                    setCounter(counter+1)
                    }
                    console.log(all)
                    console.log(all.includes(title))
                    }else{
                        localStorage.setItem('img' , img + ",")
                        localStorage.setItem('title', title + ",")
                        localStorage.setItem('year', year.slice(-4) + ",")
                        setCounter(counter+1)
            }
        }
        const deleteItem = (title) => {
                const check = localStorage.getItem('title')
                const check2 = localStorage.getItem('img')
                const check3 = localStorage.getItem('year')
                const all = split(check, ',')
                const all2 = split(check2, ',')
                const all3 = split(check3, ',')
                const index = all.indexOf(title)
                all.splice(index,1)
                all2.splice(index,1)
                all3.splice(index,1)
                localStorage.setItem('title',all.join())
                localStorage.setItem('img',all2.join())
                localStorage.setItem('year',all3.join())
                setCounter(counter+1)
                console.log(all)
        }
        const getSaved = ()=>{
            if(localStorage.getItem('title')){
                const all = split(localStorage.getItem('title'), ',')
                const all2 = split(localStorage.getItem('img'), ',')
                const all3 = split(localStorage.getItem('year'), ',')
                setSaved(all)
                setSaved2(all2)
                setSaved3(all3)
            }
        }
        useEffect(() => {
            getData()
            getSaved()
        }, [search,counter])
        return (
            <div className="bg-black m py-4 ">
                <div className="nav w-[90%] flex gap-x-4 justify-end mb-4">
                    <Link to={'/'}>
                        <h1 className="text-white hover:text-blue-800 duration-200">Seacrh Page</h1>
                    </Link>
                    <Link to={'/movies'}>
                        <h1 className="text-white hover:text-blue-800 duration-200">All Movies Page</h1>
                    </Link>
                </div>
                <div className="container bg-black text-white m-auto">
                    <h1 className="text-center text-3xl">Welcome to Abram Website for searching <br /> and store your fav film to see at any time</h1>
                    <form action="" className="w-[90%] m-auto">
                        <input type="text" placeholder="Enter the film Name" className=" text-black mt-4 peer w-full h-full  text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0  disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900" onChange={(e) => {
                            setSearch(e.target.value)
                        }} />
                    </form>
                    {
                        search ? <div className="flex flex-wrap justify-center lg:justify-between gap-3 items-center mt-5 w-[75%] m-auto border border-white rounded-lg p-3">
                            <div className="w-64 relative">
                                <h1 className=" bg-yellow-500 text-white w-fit p-2 absolute top-0 ">{data.imdbRating}</h1>
                                <img src={data.Poster} alt="" />
                            </div>
                            <div className="content space-y-2 lg:p-0 lg:w-[50%]">
                                <h1>Title: {data.Title}</h1>
                                <h1>Realease Time: {data.Released}</h1>
                                <h1>Time: {data.Runtime}</h1>
                                <h1>Type: {data.Type}</h1>
                                <h1>Category: {data.Genre}</h1>
                                <h1 className=" text-wrap lg:text-wrap xlg:w-[600px]">Story: {data.Plot}</h1>
                                <div className="text-center">
                                    <button onClick={() => {
                                        store(data.Poster, data.Title, data.Released)
                                    }} className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded duration-300  w-40 mt-4">{save}</button>
                                </div>
                            </div>
                        </div> : <h1 className="ms-10 mt-4">Search For A Movie</h1>
                    }
                </div>
                <div className="w-[75%] m-auto mt-3">
                    <h1 className="text-yellow-500 text-3xl">Your Saved</h1>
                    {
                        saved && saved2&&saved.map((item,index)=>(
                            <div key={index} className="flex flex-wrap flex-col lg:flex-row justify-center lg:justify-around items-center mt-4">
                                <div className="lg:w-[50%]">
                                    <img className="lg:w-24 lg:h-24" src={saved2[index]} alt="" />
                                </div>
                                <div className="lg:w-[50%] text-center">
                                    <h1 className="text-white">Title: {item}</h1>
                                    <a className="text-blue-900" href={`https://wecima.show/watch/مشاهدة-فيلم-${item.replace(/ /g, '-')}-${saved3[index]}-مترجم/`}>Watch on MyCima</a> <br />
                                    <a className="text-blue-900" href={`https://web5.topcinema.top/فيلم-${item.replace(/ /g, '-')}-${saved3[index]}-مترجم-اون-لاين/watch/`}>Watch on topCima</a> <br />
                                    <a className="text-blue-900" href={`https://r9.cimalek.buzz/movies/${item.replace(/ /g, '-')}/watch/`}>Watch on cimalek</a> <br />
                                    <a className="text-blue-900" href={`https://xxz.tuktukcinema.shop//${item.replace(/ /g, '-')}-${saved3[index]}/`}>Watch on tuktok(may not work)</a>  <br />                           
                                    <button onClick={()=>{
                                        deleteItem(item)
                                    }} className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded duration-300  w-40 mt-4">Delete</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
    export default Home;