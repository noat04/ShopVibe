// fetchData.js
// Hàm fetch chung
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
    const url = `https://localhost:7180/api/Products/GetByProductId/${id}`;
    return fetchData(url);
}

// Xuất hàm API
export { getAllProducts }; // Export hàm getAllProducts
export { getProductId }; // Export hàm getProductId
