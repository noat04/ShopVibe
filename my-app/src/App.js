import React from 'react';
// import Login from './page/Login/login';  // Giữ lại chỉ những gì bạn sử dụng
import Product from './page/Products/Products';
import Home from './page/Home/Home'

function App() {
  return (
    <div className="App">
      {/* <Login />  Sử dụng Login ở đây */}
      <Product></Product>
      {/* <Home></Home> */}
    </div>
  );
}

export default App;
