import React from 'react';
import { Route } from 'react-router-dom';
import { BrowserRouter, createBrowserRouter, Router, RouterProvider, Routes } from 'react-router-dom';
import Login from './page/Login/login';
import Product from './page/Products/Products';
import ProductDetailPage from './page/Products/ProductDetailPage';
import Home from './page/Home/Home';
import NoPage from './page/Error/NoPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} path="/" />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/product' element={<Product />} />
          <Route path='/product-detail/:id' element={<ProductDetailPage />} />
          <Route path='*' element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
