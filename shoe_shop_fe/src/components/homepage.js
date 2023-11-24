import './responsive.css';
import React from 'react'
import Slider from './layout/sidebar/slider.js';
import ProductHot from './layout/container/product-hot.js'



function Homepage() {
    return (
        <div className='main'>
            
            {/* Slider */}
            <Slider />

            {/* Container */}
            <ProductHot />
        </div>
    );
}

export default Homepage;