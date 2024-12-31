import React from 'react';

const ProductList = ({data}) => {
    return (
    <div>
        <div>
            <img src={data.image} alt="" />
        </div>
        <div className="product-name">{data.name}</div>
        <div className='product-price'>{data.price}</div>  
    </div>
    );
};

export default ProductList;