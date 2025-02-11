// panneau deroulant
document.addEventListener('DOMContentLoaded', () => {
    const servicesLink = document.querySelector('nav ul li a[href="services.html"]');
    const servicesDropdown = document.createElement('div');
    servicesDropdown.classList.add('services-dropdown');
    
    servicesDropdown.innerHTML = `
        <ul>
            <li><a href="billetterie.html">Billetterie</a></li>
            <li><a href="recherche.html">Pour vous reperer</a></li>
        </ul>
    `;
    
    servicesLink.parentElement.appendChild(servicesDropdown);
});
