
import React from 'react'

const Footer = () => {
  return (
    <>
        <footer className="footer bg-gray-900 text-white p-4 ">
          <div className="footer-content">
            <div className="footer-links flex justify-center gap-8">
              <a href="/about">About Us</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
            <p className='flex justify-center' >&copy; 2024 Your Website. All rights reserved.</p>
          </div>
        </footer>
        
    </>
      );
  
};

export default Footer
