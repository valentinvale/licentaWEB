import React from "react";
import "../Styles/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="social-media">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-facebook"></i>
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <i className="bi bi-instagram"></i>
                    </a>
                </div>
                <div className="contact-info">
                    <p><i className="bi bi-telephone"></i> +123 456 7890</p>
                    <p><i className="bi bi-envelope"></i> help@fureverhome.com</p>
                    <p><i className="bi bi-geo-alt"></i> Strada Leilor, Drobeta-Turnu Severin, Mehedinti</p>
                </div>
                <p className="footer-text">Adopta un prieten blanos si ofera-i o casa!</p>
            </div>
        </footer>
    );
};
export default Footer;