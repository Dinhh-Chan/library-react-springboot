import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import CategoriesList from "../../components/CategoriesList/CategoriesList"

function CategoriesPage() {
    return (
        <>
            <NavBar />
            <CategoriesList /> 
            <Footer />
        </>
    )
}

export default CategoriesPage;