import React, { useState, useEffect } from 'react'; // Import useState and useEffect from React
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import Navbar from '../../component/Navbar/Navbar'; // Import Navbar component
import { getProductId } from '../../fetchData'; // Import your data fetching function
import ProductDetails from '../../component/mainProduct/ProductDetails'; // Import ProductDetails component

function ProductDetailPage() {
    const { id } = useParams(); // Get the id from URL
    const [product, setProduct] = useState(null); // State to store the product data

    useEffect(() => {
        const fetchProductDetails = async () => {
            const fetchedProduct = await getProductId(id); // Fetch product by id
            setProduct(fetchedProduct); // Set the product in state
        };
        fetchProductDetails();
    }, [id]); // Run when the component mounts or id changes

    if (!product) {
        return <div>Loading...</div>; // Show loading if product is not yet fetched
    }

    return (
        <>
            <Navbar /> {/* Navbar component */}
            <div>
                <ProductDetails data={product} />
            </div>
        </>
    );
}

export default ProductDetailPage;
