document.addEventListener('DOMContentLoaded', () => {
    
    // Fitur Gelap / Terang
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const themeText = document.getElementById('theme-text');
    const themeIcon = themeToggle.querySelector('i');

    const enableDarkMode = () => {
        body.classList.add('dark-theme');
        themeText.textContent = 'Terang';
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    };

    const enableLightMode = () => {
        body.classList.remove('dark-theme');
        themeText.textContent = 'Gelap';
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    };

    // Cek tema yang tersimpan di localStorage saat halaman pertama kali dimuat
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        enableDarkMode();
    } else {
        enableLightMode(); // Default ke tema terang jika tidak ada setting
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });

    // Memuat Fitur
    const featuresContainer = document.getElementById('features-container');

    const createCard = (endpoint) => {
        const tryLink = endpoint.path.includes('?') 
            ? endpoint.path.replace(/=\.\.\./, '=Contoh') 
            : endpoint.path;

        return `
            <div class="card" data-category="${endpoint.category}">
                <div class="card-header">
                    <span class="method get">GET</span>
                    <p class="endpoint">${endpoint.path}</p>
                </div>
                <div class="card-body">
                    <p>${endpoint.description}</p>
                    <a href="${tryLink}" target="_blank" class="try-btn">Coba Sekarang</a>
                </div>
            </div>
        `;
    };

    const loadFeatures = async () => {
        try {
            const response = await fetch('/api/endpoints');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const endpoints = await response.json();

            const categories = {};
            endpoints.forEach(endpoint => {
                const category = endpoint.category.toLowerCase();
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(endpoint);
            });

            featuresContainer.innerHTML = ''; 

            for (const categoryName in categories) {
                const section = document.createElement('section');
                section.id = categoryName;
                section.className = 'feature-section';

                const title = document.createElement('h2');
                const icons = { anime: 'fa-fire', fun: 'fa-face-grin-beam', game: 'fa-gamepad' };
                const iconClass = icons[categoryName] || 'fa-star';
                const formattedName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
                
                title.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${formattedName}`;

                const grid = document.createElement('div');
                grid.className = 'feature-grid';
                grid.innerHTML = categories[categoryName].map(createCard).join('');

                section.appendChild(title);
                section.appendChild(grid);
                featuresContainer.appendChild(section);
            }

        } catch (error) {
            featuresContainer.innerHTML = '<p style="text-align: center; color: red;">Gagal memuat daftar fitur. Pastikan server berjalan dengan benar.</p>';
            console.error('Gagal mengambil data endpoints:', error);
        }
    };
    
    // Filter Katagori
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            const categoryToShow = link.getAttribute('data-category');
            const allSections = document.querySelectorAll('.feature-section');

            allSections.forEach(section => {
                if (categoryToShow === 'all' || section.id === categoryToShow) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });

    loadFeatures();
});