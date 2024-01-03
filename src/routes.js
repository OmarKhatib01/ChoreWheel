// make router for all pages

// import react
import React from 'react';

// import css
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// import router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import pages
import ApartmentCreation from './apartments/ApartmentCreation';
import ApartmentLogin from './apartments/ApartmentLogin';
import ApartmentPage from './pages/ApartmentPage';
import NotFound from './pages/NotFound';





const Router = () => {
    
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<ApartmentLogin />} />
                <Route exact path="/signup" element={<ApartmentCreation />} />
                <Route exact path="/apartment/:id" element={<ApartmentPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

        </BrowserRouter>
    );
}

export default Router;