import React from 'react';
import Navbar from '../../component/Navbar/Navbar';
import Banner from '../../component/Banner/Banner';
import Footer from '../../component/Footer/Footer';
import Categories from '../../component/Categories/Categories';
import './Home.css';
const Home = () => {

    return (
        <div>
            <Navbar></Navbar>
            <Banner></Banner>
            <Categories></Categories>
            <Footer></Footer>
        </div>
    );
};

export default Home;