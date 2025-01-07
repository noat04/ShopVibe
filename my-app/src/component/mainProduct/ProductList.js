import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './productList.css';

const ProductList = ({ data }) => {
    return (
        <div>
            <div className='product-item'>
                <div>
                    <img src={data.image} alt={data.productName || 'Product'} />
                </div>
                <div className="product-name">{data.productName}</div>
                <div className="product-price">{data.price}</div>
                <button className="btn-view-details">
                    <Link to={`/product-detail/${data.productId}`} className="product-link">View</Link>
                </button>
            </div>

        </div >

    );
};

export default ProductList;
