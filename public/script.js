document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elemen Global ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const featuresContainer = document.getElementById('features-container');
    const navMenu = document.querySelector('.nav-menu');

    // --- Logika Ubah Tema (Terang/Gelap) ---
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

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        enableDarkMode();
    } else {
        enableLightMode();
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });

    // --- Fungsi Filter Kategori (dipanggil setelah navbar dibuat) ---
    const attachNavFilterListeners = () => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');

                const categoryToShow = link.getAttribute('data-category');
                const allSections = document.querySelectorAll('.feature-section');

                allSections.forEach(section => {
                    // Toggle class 'hidden' jika kategori tidak cocok dan bukan 'all'
                    section.classList.toggle('hidden', !(categoryToShow === 'all' || section.id === categoryToShow));
                });
            });
        });
    };

    // --- Fungsi Utama untuk Memuat Fitur dan Navbar Dinamis ---
    const loadFeaturesAndNav = async () => {
        try {
            const response = await fetch('/api/endpoints');
            const endpoints = await response.json();

            const categories = {};
            endpoints.forEach(endpoint => {
                const category = endpoint.category.toLowerCase();
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(endpoint);
            });
            
            navMenu.innerHTML = '<li><a href="#" class="nav-link active" data-category="all">Semua</a></li>';
            const categoryNames = Object.keys(categories).sort(); 
            
            categoryNames.forEach(name => {
                const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
                const navItem = document.createElement('li');
                navItem.innerHTML = `<a href="#" class="nav-link" data-category="${name}">${formattedName}</a>`;
                navMenu.appendChild(navItem);
            });

            featuresContainer.innerHTML = '';
            categoryNames.forEach(name => {
                const section = document.createElement('section');
                section.id = name;
                section.className = 'feature-section';

                const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
                const icons = { anime: 'fa-fire', fun: 'fa-face-grin-beam', game: 'fa-gamepad', quotes: 'fa-quote-left' };
                const iconClass = icons[name] || 'fa-star'; 
                
                section.innerHTML = `
                    <h2><i class="fa-solid ${iconClass}"></i> ${formattedName}</h2>
                    <div class="feature-grid">
                        ${categories[name].map(endpoint => {
                            const tryLink = endpoint.path.includes('?') ? endpoint.path.replace(/=\.\.\./, '=Contoh') : endpoint.path;
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
                        `}).join('')}
                    </div>
                `;
                featuresContainer.appendChild(section);
            });

            attachNavFilterListeners();

        } catch (error) {
            featuresContainer.innerHTML = '<p style="text-align: center; color: red;">Gagal memuat daftar fitur. Pastikan server berjalan dan endpoint /api/endpoints berfungsi.</p>';
            console.error('Error saat memuat fitur:', error);
        }
    };
    
    loadFeaturesAndNav();
});