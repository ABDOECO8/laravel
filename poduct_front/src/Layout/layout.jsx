import { Link, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <header>
    <nav class="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="https://flowbite.com" class="flex items-center">
            </a>
            <div class="flex items-center lg:order-2">
                <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-white rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
                    <svg class="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
            </div>
            <div class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
                <ul class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                        <Link to={'/'} class="block py-2 pr-4 pl-3 text-white border-b border-gray-100 hover:bg-blue-800 lg:hover:bg-transparent lg:border-0 lg:hover:text-white lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Home</Link>
                    </li>
                    <li>
                        <Link to={'/Categorie'} class="block py-2 pr-4 pl-3 text-white border-b border-gray-100 hover:bg-blue-800 lg:hover:bg-transparent lg:border-0 lg:hover:text-white lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Categories</Link>
                    </li>
                    <li>
                        <Link to={'/Product'} class="block py-2 pr-4 pl-3 text-white border-b border-gray-100 hover:bg-blue-800 lg:hover:bg-transparent lg:border-0 lg:hover:text-white lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">Product</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>

            <main>
                <Outlet />
            </main>
            

            <footer class="fixed bottom-0 left-0 z-20 w-full p-4 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
    <span class="text-sm text-white sm:text-center dark:text-gray-400">© 2024 <a href="#" class="hover:underline">ABDELKRIM EL-FETOUAKI</a>. All Rights Reserved.</span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-white dark:text-gray-400 sm:mt-0">
        <li>
            <Link to={'/'} class="hover:underline me-4 md:me-6">Home</Link>
        </li>
    </ul>
</footer>


        </>
    );
}
