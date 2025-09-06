import React from 'react';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css'
import { useHomeState } from '../hooks/useSafeSelector';

const Categorys = () => {
 
    const {categorys} = useHomeState()

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 6
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 6
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 4
        },
        mdtablet: {
            breakpoint: { max: 991, min: 464 },
            items: 4
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 3
        },
        smmobile: {
            breakpoint: { max: 640, min: 0 },
            items: 2
        },
        xsmobile: {
            breakpoint: { max: 440, min: 0 },
            items: 1
        },
    }



    return (
        <div className='w-[87%] mx-auto relative section-padding'>
            <div className='w-full'>
                <div className='text-center flex justify-center items-center flex-col text-3xl text-slate-600 font-bold relative pb-[35px]'>
                    <h2 className="text-gradient">Top Categories</h2>
                    <div className='w-[100px] h-[2px] bg-primary mt-4'></div>
                </div>
            </div>

            <Carousel
                autoPlay={true}
                infinite={true}
                arrows={true} 
                responsive={responsive}
                transitionDuration={500}
                className="category-carousel"
            >
                {
                    categorys.map((c, i) => 
                        <Link className='h-[185px] block mx-2' key={i} to={`/products?category=${c.name}`}>
                            <div className='w-full h-full relative p-3 card hover-scale group'>
                                <img src={c.image} alt={c.name} className="w-full h-[120px] object-cover rounded-lg" />
                                <div className='absolute bottom-6 w-full mx-auto font-bold left-0 flex justify-center items-center'>
                                    <span className='py-[6px] px-4 bg-primary/90 text-white rounded-full text-sm group-hover:bg-primary-dark transition-colors'>{c.name}</span>
                                </div>
                            </div>
                        </Link>
                    )
                }
            </Carousel>        
        </div>
             
    );
};

export default Categorys;