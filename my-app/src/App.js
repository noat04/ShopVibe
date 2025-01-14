import React from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter, createBrowserRouter, Router, RouterProvider, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './page/Login/login';
import Register from './page/Register/Register';
import Product from './page/Products/Products';
import ProductDetailPage from './page/Products/ProductDetailPage';
import Home from './page/Home/Home';
import NoPage from './page/Error/NoPage';
import Cart from './page/Cart/Cart';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} path="/" />
          <Route index element={<Home />} path="/" />
          <Route path='/home' element={<Home />} />
          <Route path='/products/:category' element={<Product />} />
          <Route path='/products/:sort' element={<Product />} />
          <Route path='/products' element={<Product />} />
          <Route path='/product-detail/:id' element={<ProductDetailPage />} />
          <Route path='*' element={<NoPage />} />
          <Route path='/cart' element={<Cart />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
