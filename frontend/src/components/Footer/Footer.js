import React from "react";
import "./Footer.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareFacebook, faInstagram} from "@fortawesome/free-brands-svg-icons";

function Footer() {
    const teamMember = [
        {id: 1, name: "Trần Đức Định", msv:"B23DCCC038", phone:"0989811424", role:"Trưởng nhóm", fb:"https://www.facebook.com/2107.2909.1209dinh"},
        {id: 2, name: "Nguyễn Trường Giang", msv:"B23DCCC054", phone:"0764623705", role:"Thành viên Fontend", fb:"https://www.facebook.com/profile.php?id=100019964265445", ig:"https://www.instagram.com/zianggg01/"},
        {id: 3, name: "Lưu Đức Tuấn", msv: "B23DCCC170", phone:"0396356905", role:"Thành viên Frontend", fb: "https://www.facebook.com/profile.php?id=100035168808826"},
        {id: 4, name: "Nguyễn Viết Sang", msv: "B23DCCC142", phone:"0357366078", role:"Thành viên Backend", fb:"https://www.facebook.com/SagHuyn"},

    ]
    return ( 
        <>
        <div className="footerWraper">
            <div >
                <h1>Sản phẩm của nhóm Ngũ Trụ Triều Đình</h1>
                <div className="row">
                    <b style={{padding: "15px", fontSize:"medium"}}>Bài tập lớn cho môn <br/>Lập trình hướng đối tượng <br/>và môn Lập trình web</b>
                    <ul className="teamMember">
                    {teamMember.map(teamMember => 
                                <div className="listWrapper">
                                <li key={teamMember.id}>
                                    <b>{teamMember.name}</b>
                                    <p>Vai trò: {teamMember.role}</p>
                                    <p>Mã sinh viên: {teamMember.msv}</p>
                                    <p>Số điện thoại: {teamMember.phone}</p>
                                    <div>
                                        <a className="FooterA" href={teamMember.fb}><FontAwesomeIcon icon={faSquareFacebook}/></a>
                                        {teamMember.ig? <a className="FooterA" href={teamMember.ig}><FontAwesomeIcon icon={faInstagram}/></a> : ""}
                                    </div>
                                </li>
                                </div>)}
                                
                    </ul>
                </div>
                
            <hr></hr>
            <div style={{marginTop:"30px", fontSize:'14px'}}>Sản phẩm mang tính chất để làm bài tập lớn | Chưa đăng ký bản quyền</div>
            </div>
        </div>
        </>
    );
}

export default Footer;