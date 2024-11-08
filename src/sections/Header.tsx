"use client"; // This marks the component as a Client Component

import {useEffect, useRef, useState} from 'react';

export const Header = () => {
    const lastActiveSection = useRef<string>("home");
    const [indicatorPosition, setIndicatorPosition] = useState<number>(0); // Store the position of the indicator
    const [indicatorWidth, setIndicatorWidth] = useState<number>(0); // Store the width of the active nav item
    const [activeLink, setActiveLink] = useState<string>("home"); // Track the active link for text color changes

    useEffect(() => {
        const sections: { [key: string]: HTMLElement | null } = {
            home: document.querySelector("#home"),
            projects: document.querySelector("#projects"),
            about: document.querySelector("#about"),
            contact: document.querySelector("#contact")
        };

        const navLinks: { [key: string]: HTMLElement | null } = {
            home: document.querySelector("#home-link"),
            projects: document.querySelector("#projects-link"),
            about: document.querySelector("#about-link"),
            contact: document.querySelector("#contact-link")
        };

        const navbar = document.querySelector("nav"); // Get the navbar container

        const moveIndicator = (section: string) => {
            const activeLink = navLinks[section];
            if (activeLink && navbar) {
                const linkRect = activeLink.getBoundingClientRect();
                const navbarRect = navbar.getBoundingClientRect();

                // Calculate the position relative to the navbar container
                const leftPosition = linkRect.left - navbarRect.left - 2;

                setIndicatorPosition(leftPosition); // Update the indicator's left position relative to the navbar
                setIndicatorWidth(linkRect.width - 2);  // Update the indicator's width to match the link
                setActiveLink(section);             // Set the active link for text color change
            }
        };

        const updateActiveLink = () => {
            let currentSection: string | null = null;

            Object.keys(sections).forEach(section => {
                const sectionElement = sections[section];
                if (sectionElement) {
                    const sectionTop = sectionElement.offsetTop;
                    const sectionHeight = sectionElement.offsetHeight;
                    const scrollPosition = window.scrollY + window.innerHeight / 1.5;

                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section; // Section found, set it as the current section
                    }
                }
            });

            if (currentSection) {
                lastActiveSection.current = currentSection;
                moveIndicator(currentSection); // Move the indicator to the current section's nav link
            } else {
                moveIndicator(lastActiveSection.current); // Use the last active section
            }
        };

        window.addEventListener('scroll', updateActiveLink);

        // Initial position on page load
        moveIndicator("home");

        return () => {
            window.removeEventListener('scroll', updateActiveLink);
        };
    }, []);

    return (
        <div className={"flex justify-center items-center fixed top-3 w-full z-10"}>
            <nav className={"relative flex gap-1 p-0.5 border border-white/15 rounded-full bg-white/10 backdrop-blur"}>
                {/* Sliding indicator */}
                <div
                    className="absolute bg-white rounded-full transition-transform duration-300 ease-out"
                    style={{
                        height: "90%",
                        width: `${indicatorWidth}px`,
                        transform: `translateX(${indicatorPosition}px)`
                    }}
                />
                <a
                    href="#home"
                    id="home-link"
                    className={`nav-item relative z-10 ${activeLink === "home" ? "text-gray-900" : "text-white"}`}
                >Home</a>
                <a
                    href="#projects"
                    id="projects-link"
                    className={`nav-item relative z-10 ${activeLink === "projects" ? "text-gray-900" : "text-white"}`}
                >Projects</a>
                <a
                    href="#about"
                    id="about-link"
                    className={`nav-item relative z-10 ${activeLink === "about" ? "text-gray-900" : "text-white"}`}
                >About</a>
                <a
                    href="#contact"
                    id="contact-link"
                    className={`nav-item relative z-10 ${activeLink === "contact" ? "text-gray-900" : "text-white"}`}
                >Contact</a>
            </nav>
        </div>
    );
};
