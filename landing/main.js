// Detect scroll and apply animations
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;

        // Picture in the dowload section
        const img = section.querySelector('.image-content img');
        if (img && sectionTop < windowHeight * 0.5 && sectionBottom > 0) {
            img.classList.remove('fade-out');
            img.classList.remove('slide-up');
        } else if (img) {
            img.classList.add('fade-out');
            img.classList.add('slide-up');
        }

        // Text in all sections
        const textElements = section.querySelectorAll('h1, h2, h3, p, .download-btn, ul li, .tech-box, .tech-rectangle');
        textElements.forEach(el => {
            if (sectionTop < windowHeight * 0.7 && sectionBottom > 0) {
                el.classList.remove('fade-out');
                el.classList.remove('slide-up');
                el.classList.remove('slide-down');
                el.classList.remove('scale-down');
            } else if (sectionTop >= windowHeight * 0.7) {
                el.classList.add('fade-out');
                el.classList.add('slide-down');
                el.classList.add('scale-down');
            } else if (sectionBottom <= 0) {
                el.classList.add('fade-out');
                el.classList.add('slide-up');
                el.classList.add('scale-down');
            }
        });
    });
});

// Execute the function when downloading the page for stablidhing the initian state
window.dispatchEvent(new Event('scroll'));

// Fire effect on the pointer
document.addEventListener('mousemove', (e) => {
    const particle = document.createElement('div');
    particle.classList.add('fire-particle');
    particle.style.left = `${e.pageX - 4}px`;
    particle.style.top = `${e.pageY - 4}px`;
    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 650); // Animation duration
});