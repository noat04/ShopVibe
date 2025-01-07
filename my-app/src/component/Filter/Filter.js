import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Filter.css';

const Filter = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const handleMouseEnter = () => {
        setOpenMenu(true);
    };

    const handleMouseLeave = () => {
        setOpenMenu(false);
    };

    const handleCategoriesEnter = () => {
        setIsCategoriesOpen(true);
    };

    const handleCategoriesLeave = () => {
        setIsCategoriesOpen(false);
    };

    const clickItem = (item) => {
        setOpenMenu(false);
        setIsCategoriesOpen(false);
        console.log(item); // Nếu cần xử lý giá trị sau khi chọn
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
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    className="btn btn-secondary"
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openMenu}
                >
                    PRICE
                </button>
                {openMenu && (
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
                        <button onClick={() => clickItem('Sneakers')} className="dropdown-item">Addidas</button>
                        <button onClick={() => clickItem('Boots')} className="dropdown-item">Nike</button>
                        <button onClick={() => clickItem('Loafers')} className="dropdown-item">Converse</button>
                        <button onClick={() => clickItem('Sports')} className="dropdown-item">MLB</button>
                        <button onClick={() => clickItem('Fashion')} className="dropdown-item">VANS</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Filter;
