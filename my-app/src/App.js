// import './App.css';
import Home from './page/Home/Home';
import Products from './page/Products/Products';
import ProductList from './component/mainProduct/ProductList';
import fetchData from './fetchData';
function App() {
  return (
    <div className="App">
      {/* <Home></Home> */}
      <Products></Products>
      {/* <fetchData></fetchData> */}
    </div>
  );
}

export default App;
