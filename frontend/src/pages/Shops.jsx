import React, { useState,useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useLocation } from 'react-router-dom';
import { IoIosArrowForward } from "react-icons/io";
import { Range } from 'react-range';
import {AiFillStar} from 'react-icons/ai'
import {CiStar} from 'react-icons/ci' 
import Products from '../components/products/Products';
import {BsFillGridFill} from 'react-icons/bs'
import {FaThList} from 'react-icons/fa'
import ShopProducts from '../components/products/ShopProducts';
import Pagination from '../components/Pagination';
import { useDispatch } from 'react-redux';
import { price_range_product,query_products } from '../store/reducers/homeReducer';
import { useHomeState } from '../hooks/useSafeSelector';

const Shops = () => {

    const dispatch = useDispatch()
    const location = useLocation()
    const {products,categorys,priceRange,latest_product,totalProduct,parPage} = useHomeState()

    // Get URL parameters
    const searchParams = new URLSearchParams(location.search)
    const urlCategory = searchParams.get('category') || ''
    const urlSearch = searchParams.get('search') || ''

    useEffect(() => { 
        dispatch(price_range_product())
    },[])
    useEffect(() => { 
        setState({
            values: [priceRange.low, priceRange.high]
        })
    },[priceRange])

    // Initialize category from URL parameter
    useEffect(() => {
        if (urlCategory) {
            setCategory(urlCategory)
        }
    }, [urlCategory])

    const [filter, setFilter] = useState(true) 

    const [state, setState] = useState({values: [priceRange.low, priceRange.high]})
    const [rating, setRating] = useState('')
    const [styles, setStyles] = useState('grid')

   
    const [pageNumber, setPageNumber] = useState(1)

    const [sortPrice, setSortPrice] = useState('')
    const [category, setCategory] = useState(urlCategory)
    const [isLoading, setIsLoading] = useState(false)
    const queryCategory = (e, value) => {
        if (e.target.checked) {
            setCategory(value)
            setPageNumber(1) // Reset to first page when changing category
        } else {
            setCategory('')
            setPageNumber(1) // Reset to first page when clearing category
        }
    }

    // Clear all filters function
    const clearAllFilters = () => {
        setCategory('')
        setRating('')
        setSortPrice('')
        setState({values: [priceRange.low, priceRange.high]})
        setPageNumber(1)
    }

    // Clear individual filters
    const clearCategoryFilter = () => {
        setCategory('')
        setPageNumber(1)
    }

    const clearRatingFilter = () => {
        setRating('')
        setPageNumber(1)
    }

    const clearSortFilter = () => {
        setSortPrice('')
        setPageNumber(1)
    }

    useEffect(() => { 
        setIsLoading(true)
        const queryParams = {
            low: state.values[0],
            high: state.values[1],
            category: category || '',
            rating: rating || '',
            sortPrice: sortPrice || '',
            pageNumber,
            searchValue: urlSearch || ''
        }
        
        // console.log('Querying products with params:', queryParams)
        
        dispatch(
            query_products(queryParams)
         ).finally(() => {
             setIsLoading(false)
         })
    },[state.values[0],state.values[1],category,rating,sortPrice,pageNumber,urlSearch])

    const resetRating = () => {
        setRating('')
        setPageNumber(1) // Reset to first page when clearing rating
    }
    

    return (
        <div>
           <Header/>
           <section className='bg-[url("http://localhost:3000/images/banner/shop.png")] h-[220px] mt-6 bg-cover bg-no-repeat relative bg-left'>
            <div className='absolute left-0 top-0 w-full h-full bg-[#2422228a]'>
                <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
                    <div className='flex flex-col justify-center gap-1 items-center h-full w-full text-white'>
                <h2 className='text-3xl font-bold'>Shop Page </h2>
                <div className='flex justify-center items-center gap-2 text-2xl w-full'>
                        <Link to='/'>Home</Link>
                        <span className='pt-1'>
                        <IoIosArrowForward />
                        </span>
                        <span>Shop </span>
                      </div>
                    </div> 
                </div> 
            </div> 
           </section>

           <section className='py-16'>
            <div className='w-[85%] md:w-[80%] sm:w-[90%] lg:w-[90%] h-full mx-auto'>
            <div className={` md:block hidden ${!filter ? 'mb-6' : 'mb-0'} `}>
                <button onClick={() => setFilter(!filter)} className='text-center w-full py-2 px-3 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors'>Filter Product</button> 
            </div>

            <div className='w-full flex flex-wrap'>
                <div className={`w-3/12 md-lg:w-4/12 md:w-full pr-8 ${filter ? 'md:h-0 md:overflow-hidden md:mb-6' : 'md:h-auto md:overflow-auto md:mb-0' } `}>
                    <h2 className='text-3xl font-bold mb-3 text-slate-600'>Category </h2>
        <div className='py-2'>
            {
                categorys.map((c,i) => (
                    <div key={i} className='flex justify-between items-center gap-2 py-2 px-2 rounded-md hover:bg-gray-50 transition-colors'>
                        <div className='flex justify-start items-center gap-2'>
                            <input 
                                checked={category === c.name ? true : false} 
                                onChange={(e)=>queryCategory(e,c.name)} 
                                type="checkbox" 
                                id={c.name}
                                className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2'
                            />
                            <label className='text-slate-600 block cursor-pointer font-medium' htmlFor={c.name}>
                                {c.name}
                            </label>
                        </div>
                        {category === c.name && (
                            <span className='text-xs bg-primary text-white px-2 py-1 rounded-full'>
                                Active
                            </span>
                        )}
                    </div>
                ))
            }
        </div>

        <div className='py-2 flex flex-col gap-5'>
            <h2 className='text-3xl font-bold mb-3 text-slate-600'>Price</h2>
             
             <Range
                step={5}
                min={priceRange.low}
                max={priceRange.high}
                values={(state.values)}
                onChange={(values) => setState({values})}
                renderTrack={({props,children}) => (
                    <div {...props} className='w-full h-[6px] bg-slate-200 rounded-full cursor-pointer'>
                        {children}
                    </div>
                )}
                renderThumb={({ props }) => (
                    <div className='w-[15px] h-[15px] bg-[#059473] rounded-full' {...props} />
    
                )} 
             />  
         <div>
         <span className='text-slate-800 font-bold text-lg'>${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}</span>  
           </div>
         </div>

         <div className='py-3 flex flex-col gap-4'>
            <h2 className='text-3xl font-bold mb-3 text-slate-600'>Rating </h2>
            <div className='flex flex-col gap-3'>
                 <div onClick={() => setRating(5)} className='text-primary flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-primary-dark transition-colors'>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                  </div>

                  <div onClick={() => setRating(4)} className='text-primary flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-primary-dark transition-colors'>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><CiStar/> </span>
                  </div>

                  <div onClick={() => setRating(3)} className='text-primary flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-primary-dark transition-colors'>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                  </div>

                  <div onClick={() => setRating(2)} className='text-primary flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-primary-dark transition-colors'>
                    <span><AiFillStar/> </span>
                    <span><AiFillStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                  </div>

                  <div onClick={() => setRating(1)} className='text-primary flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-primary-dark transition-colors'>
                    <span><AiFillStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                    <span><CiStar/> </span>
                  </div>

                  <div onClick={resetRating} className='text-primary flex justify-start items-start gap-2 text-xl cursor-pointer hover:text-primary-dark transition-colors'>
                  <span><CiStar/> </span>
                  <span><CiStar/> </span>
                  <span><CiStar/> </span>
                  <span><CiStar/> </span>
                  <span><CiStar/> </span>
                  </div> 
            </div> 
         </div>
        
        
        <div className='py-5 flex flex-col gap-4 md:hidden'>
            <Products title='Latest Product'  products={latest_product} />
        </div>

        {/* Clear Filters Button */}
        <div className='py-4 border-t border-gray-200'>
            <button 
                onClick={clearAllFilters}
                className='w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium'
            >
                Clear All Filters
            </button>
        </div> 
          </div>

        <div className='w-9/12 md-lg:w-8/12 md:w-full'>
            <div className='pl-8 md:pl-0'>
                {/* Search and Filter Bar */}
                <div className='py-4 bg-white mb-10 px-3 rounded-md flex flex-col md:flex-row justify-between items-start gap-4 border'>
                    <div className='flex flex-col md:flex-row items-start md:items-center gap-4 flex-1'>
                        <h2 className='text-lg font-medium text-slate-600'> ({totalProduct}) Products </h2>
                        {urlSearch && (
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-gray-500'>Searching for:</span>
                                <span className='bg-primary text-white px-3 py-1 rounded-full text-sm font-medium'>
                                    "{urlSearch}"
                                </span>
                            </div>
                        )}
                        {category && (
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-gray-500'>Category:</span>
                                <span className='bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'>
                                    {category}
                                    <button 
                                        onClick={clearCategoryFilter}
                                        className='ml-1 hover:bg-primary-dark rounded-full p-0.5'
                                    >
                                        ×
                                    </button>
                                </span>
                            </div>
                        )}
                        {rating && (
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-gray-500'>Rating:</span>
                                <span className='bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'>
                                    {rating}+ Stars
                                    <button 
                                        onClick={clearRatingFilter}
                                        className='ml-1 hover:bg-yellow-600 rounded-full p-0.5'
                                    >
                                        ×
                                    </button>
                                </span>
                            </div>
                        )}
                        {sortPrice && (
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-gray-500'>Sort:</span>
                                <span className='bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'>
                                    {sortPrice === 'low-to-high' ? 'Low to High' : 'High to Low'}
                                    <button 
                                        onClick={clearSortFilter}
                                        className='ml-1 hover:bg-blue-600 rounded-full p-0.5'
                                    >
                                        ×
                                    </button>
                                </span>
                            </div>
                        )}
                        {(state.values[0] !== priceRange.low || state.values[1] !== priceRange.high) && (
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-gray-500'>Price:</span>
                                <span className='bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1'>
                                    ${Math.floor(state.values[0])} - ${Math.floor(state.values[1])}
                                    <button 
                                        onClick={() => setState({values: [priceRange.low, priceRange.high]})}
                                        className='ml-1 hover:bg-green-600 rounded-full p-0.5'
                                    >
                                        ×
                                    </button>
                                </span>
                            </div>
                        )}
                    </div>
                    <div className='flex justify-center items-center gap-3'>
                        <select onChange={(e)=>setSortPrice(e.target.value)} className='p-1 border outline-0 text-slate-600 font-semibold' name="" id="">
                            <option value="">Sort By</option>
                            <option value="low-to-high">Low to High Price</option>
                            <option value="high-to-low">High to Low Price </option>
                        </select>
                        <div className='flex justify-center items-start gap-4 md-lg:hidden'>
                            <div onClick={()=> setStyles('grid')} className={`p-2 ${styles === 'grid' && 'bg-slate-300'} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm `} >
                                  <BsFillGridFill/>  
                            </div>
                            <div onClick={()=> setStyles('list')} className={`p-2 ${styles === 'list' && 'bg-slate-300'} text-slate-600 hover:bg-slate-300 cursor-pointer rounded-sm `} >
                                  <FaThList/>  
                            </div> 
                        </div> 
                    </div> 
                </div> 

         <div className='pb-8'>
                  {isLoading ? (
                      <div className='w-full flex justify-center items-center py-16'>
                          <div className='text-center'>
                              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
                              <p className='text-gray-600'>Loading products...</p>
                          </div>
                      </div>
                  ) : products && products.length > 0 ? (
                      <ShopProducts products={products} styles={styles} />
                  ) : (
                      <div className='w-full flex flex-col justify-center items-center py-16'>
                          <div className='text-center'>
                              <div className='mb-4'>
                                  <svg className='mx-auto h-24 w-24 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                                  </svg>
                              </div>
                              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                                  {category ? `No products found in "${category}" category` : 'No products found'}
                              </h3>
                              <p className='text-gray-600 mb-6'>
                                  {category 
                                      ? `We don't have any products in the "${category}" category at the moment. Try selecting a different category or browse all products.`
                                      : 'No products match your current filters. Try adjusting your search criteria.'
                                  }
                              </p>
                              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                                  {category && (
                                      <button 
                                          onClick={clearCategoryFilter}
                                          className='px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors'
                                      >
                                          Clear Category Filter
                                      </button>
                                  )}
                                  <button 
                                      onClick={clearAllFilters}
                                      className='px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors'
                                  >
                                      Clear All Filters
                                  </button>
                              </div>
                          </div>
                      </div>
                  )}
         </div>

         <div>
           {
             totalProduct > parPage &&  <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalItem={totalProduct} parPage={parPage} showItem={Math.floor(totalProduct / parPage )} />
           }
         </div>





            </div> 
         </div>  




            </div>
            </div> 
           </section>

           <Footer/>
        </div>
    );
};

export default Shops;