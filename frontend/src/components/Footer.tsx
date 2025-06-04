import React from 'react';
import { FaDiscord, FaTwitter, FaTelegram, FaYoutube, FaVimeo } from 'react-icons/fa';

/**
 * Footer Component: Displays the footer section of the website.
 *
 */
function Footer() {
    return (
        <footer className="theme-bg theme-text py-8 text-center border-t border-[var(--text-color)] border-opacity-20">
            <p className="text-base md:text-lg">
                <span className="font-bold">ImmersivΞ</span> © 2025
            </p>           

            <div className="flex flex-row space-x-4 justify-center mt-4 mb-[20px]">
                <a
                    href="#"
                    className="flex items-center justify-center text-sm hover:text-[var(--text-color)] 
                    opacity-70 hover:opacity-100 transition-all hover:scale-105"
                >
                    <FaDiscord className="w-5 h-5 social-icon" />
                </a>
                <a
                    href="#"
                    className="flex items-center justify-center text-sm hover:text-[var(--text-color)] 
                    opacity-70 hover:opacity-100 transition-all hover:scale-105"
                >
                    <FaTwitter className="w-5 h-5 social-icon" />
                </a>
                <a
                    href="#"
                    className="flex items-center justify-center text-sm hover:text-[var(--text-color)] 
                    opacity-70 hover:opacity-100 transition-all hover:scale-105"
                >
                    <FaTelegram className="w-5 h-5 social-icon" />
                </a>
                <a
                    href="#"
                    className="flex items-center justify-center text-sm hover:text-[var(--text-color)] 
                    opacity-70 hover:opacity-100 transition-all hover:scale-105"
                >
                    <FaYoutube className="w-5 h-5 social-icon" />
                </a>
                <a
                    href="#"
                    className="flex items-center justify-center text-sm hover:text-[var(--text-color)] 
                    opacity-70 hover:opacity-100 transition-all hover:scale-105"
                >
                    <FaVimeo className="w-5 h-5 social-icon" />
                </a>
            </div>
        </footer>
    );
}

export default Footer;