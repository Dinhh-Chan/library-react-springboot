import React, { useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import BookDisplay from "../../components/BookDisplay/BookDisplay";
import "./HomePage.css";

function HomePage() {
    const userName = localStorage.getItem("userName") || "";

    return (
        <>
            <NavBar />
            <div className="LandingPageWrapper">
                <div className="LandingPageContent">
                    <h1>Thư viện trực tuyến <br></br>cho học sinh, sinh viên</h1>
                    <p>Do sinh viên, của sinh viên, vì sinh viên</p>
                    {userName == "" ? <></> : <h2>Xin chào {userName}</h2>}
                </div>
            </div>
            <BookDisplay /> 
            <Footer />
        </>
    )
}

export default HomePage;