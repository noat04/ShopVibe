
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// API để lấy tất cả sản phẩm
const getAllProducts = async () => {
    const url = 'https://localhost:7180/api/Products/GetAllProducts';
    return fetchData(url);
};

const getProductId = async (id) => {
    const url = `https://localhost:7180/api/Products/GetByProductId/variants/${id}`;
    return fetchData(url);
}

const getDataFilter = async (category) => {
    const url = `https://localhost:7180/api/Products/GetAllProductsByCategories/by-category/${category}`;
    return fetchData(url);
};

const sortLowToHigh = async () => {
    const url = `https://localhost:7180/api/Products/GetAllProductsAsc/asc`;
    return fetchData(url);
}

const sortHighToLow = async () => {
    const url = `https://localhost:7180/api/Products/GetAllProductsDesc/desc`;
    return fetchData(url);
}
const getPagesProduct = async (page) => {
    const url = `https://localhost:7180/api/Products/GetPagedProducts/paged?page=${page}`;  // Use 'page' instead of 'i'
    return fetchData(url);
};
    
// Xuất hàm API
export { getAllProducts, getProductId, getDataFilter, sortLowToHigh, sortHighToLow, getPagesProduct }; // Export hàm getAllProducts
