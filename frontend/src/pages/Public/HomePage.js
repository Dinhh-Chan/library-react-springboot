import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import ChatBot from "../../components/ChatBot/ChatBot"; 
import BookDisplay from "../../components/BookDisplay/BookDisplay";
import "./HomePage.css";

function HomePage() {
    return (
        <>
            <NavBar />
            <div className="LandingPageWrapper">
                <div className="LandingPageContent">
                    <h1>Thư viện trực tuyến <br></br>cho học sinh, sinh viên</h1>
                    <p>Do sinh viên, của sinh viên, vì sinh viên</p>
                </div>
            </div>
            <BookDisplay /> 
            {/* <ChatBot />  */}
            <Footer />
        </>
    )
}

export default HomePage;