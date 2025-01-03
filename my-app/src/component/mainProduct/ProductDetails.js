import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './productList.css';

const ProductDetails = ({ data }) => {
    return (
        <div className="product-item">
            <img src={data.image} alt={data.productName} />
            <div className="product-name">{data.productName}</div>
            <div className="product-price">{data.price}</div>
            <button className="btn-add-to-cart">
                <Link to={`/Cart/${data.productId}`} className="">Add to cart</Link>
            </button>
        </div>
    );
};

export default ProductDetails;
