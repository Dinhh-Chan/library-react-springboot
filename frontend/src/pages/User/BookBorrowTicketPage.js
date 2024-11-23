import React from "react";
import BookBorrowTicket from "../../components/BookBorrowTicket/BookBorrowTicket"
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";


function BookBorrowTicketPage() {
    return (
        <>
            <NavBar />
            <BookBorrowTicket /> 
            <Footer />
        </>
    )
}

export default BookBorrowTicketPage;