import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <div className="w-full bg-gray-900 shadow-md mb-8">
            <nav className="w-[90%] mx-auto flex flex-col sm:flex-row items-center justify-between py-4 px-2">
                <div className="text-2xl font-bold text-yellow-400 mb-2 sm:mb-0">
                    <Link to={'/'}>
                        Summer Movies
                    </Link>
                </div>
                <div className="flex gap-x-6">
                    <Link to={'/'}>
                        <span className="text-white hover:text-yellow-400 transition-colors duration-200 text-lg">Search Page</span>
                    </Link>
                    <Link to={'/movies'}>
                        <span className="text-white hover:text-yellow-400 transition-colors duration-200 text-lg">All Movies Page</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
