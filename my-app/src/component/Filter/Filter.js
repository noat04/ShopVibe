import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getDataFilter } from '../../fetchData';
import './Filter.css';

const Filter = () => {
    const [openPrice, setOpenPrice] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [selectItem, setSelectItem] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleMouseEnterPrice = () => {
        setOpenPrice(true);
    };

    const handleMouseLeavePrice = () => {
        setOpenPrice(false);
    };

    const handleCategoriesEnter = () => {
        setIsCategoriesOpen(true);
    };

    const handleCategoriesLeave = () => {
        setIsCategoriesOpen(false);
    };

    const clickItem = async (item) => {
        setOpenPrice(false);
        setIsCategoriesOpen(false);
        setSelectItem(item);

    };

    useEffect(() => {
        if (selectItem) {
            getDataFilter(selectItem);
        }
    }, [selectItem]);

    const dataFilter = async (getDataFilter) => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.example.com/products?filter=${getDataFilter}`);
            const data = await response.json();
            setData(data);  // Lưu dữ liệu trả về vào state
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);  // Dừng loading
        }
    };



    return (
        <div className='container-filter'>
            <div>
                <button
                    type="button"
                    className="btn btn-secondary" // Thay class bằng className
                    data-bs-toggle="button"
                    aria-pressed="false"
                    autoComplete="off"
                >
                    BEST SELLER
                </button>
            </div>
            <div
                className="dropdown open"
                onMouseEnter={handleMouseEnterPrice}
                onMouseLeave={handleMouseLeavePrice}
            >
                <button
                    className="btn btn-secondary"
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openPrice}
                >
                    PRICE
                </button>
                {openPrice && (
                    <div className='dropdown-menu show'>
                        <button onClick={() => clickItem('Low to high')} className="dropdown-item">Low to high</button>
                        <button onClick={() => clickItem('High to low')} className="dropdown-item">High to low</button>
                    </div>
                )}
            </div>
            <div
                className="dropdown open"
                onMouseEnter={handleCategoriesEnter}
                onMouseLeave={handleCategoriesLeave}
            >
                <button
                    className="btn btn-secondary"
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isCategoriesOpen}
                >
                    CATEGORIES
                </button>
                {isCategoriesOpen && (
                    <div className='dropdown-menu show'>
                        <button onClick={() => clickItem('Adidas')} className="dropdown-item">Adidas</button>
                        <button onClick={() => clickItem('Nike')} className="dropdown-item">Nike</button>
                        <button onClick={() => clickItem('Converse')} className="dropdown-item">Converse</button>
                        <button onClick={() => clickItem('MLB')} className="dropdown-item">MLB</button>
                        <button onClick={() => clickItem('VANS')} className="dropdown-item">VANS</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filter;
