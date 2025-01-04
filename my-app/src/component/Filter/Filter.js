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
        setOpenMenu(item);
        setIsCategoriesOpen(item);
        setOpenMenu(false);
        setIsCategoriesOpen(false);
    };

    return (
        <div className='container-filter'>
            <div>
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-toggle="button"
                    aria-pressed="false"
                    autocomplete="off"
                >
                    BEST SELLER
                </button>

            </div>
            <div class="dropdown open"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <button
                    class="btn btn-secondary"
                    type="button"
                    id="triggerId"
                    aria-haspopup="true"
                    aria-expanded={openMenu}
                >
                    PRICE
                </button>
                {openMenu && (<div className='dropdown-menu show' aria-labelledby="triggerId">
                    <button onClick={() => clickItem('Low to high')} class="dropdown-item" href="#">Low to high</button>
                    <button onClick={() => clickItem('High to low')} class="dropdown-item" href="#">High to low</button>
                </div>)}

            </div>
            <div class="dropdown open"
                onMouseEnter={handleCategoriesEnter}
                onMouseLeave={handleCategoriesLeave}>
                <button
                    class="btn btn-secondary"
                    type="button"
                    id="triggerId"
                    aria-haspopup="true"
                    aria-expanded={isCategoriesOpen}
                >
                    CATEGORIES
                </button>
                {isCategoriesOpen && (<div className='dropdown-menu show' aria-labelledby="triggerId">
                    <button onClick={() => clickItem('Sneakers')} class="dropdown-item" href="#">Addidas</button>
                    <button onClick={() => clickItem('Boots')} class="dropdown-item" href="#">Nike</button>
                    <button onClick={() => clickItem('Loafers')} class="dropdown-item" href="#">Converse</button>
                    <button onClick={() => clickItem('Sports')} class="dropdown-item" href="#">MLB</button>
                    <button onClick={() => clickItem('Fashion')} class="dropdown-item" href="#">VANS</button>
                </div>)}

            </div>

        </div>
    );
};

export default Filter;