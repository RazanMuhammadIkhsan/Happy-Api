document.addEventListener('DOMContentLoaded', () => {
    
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navMenuFeatures = document.querySelector('.nav-menu-features');
    const featuresContainer = document.getElementById('features-container');
    const themeToggle = document.getElementById('theme-toggle');
    const mainHeaderTitle = document.querySelector('.main-header h1');

    let categories = {};

    mobileMenuToggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    
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

    const createCardHTML = (endpoint) => {
        const tryLink = endpoint.path.includes('?') ? endpoint.path.replace(/=\.\.\./, '=Contoh') : endpoint.path;
        return `
        <div class="card" data-category="${endpoint.category}">
            <div class="card-header"><span class="method get">GET</span><p class="endpoint">${endpoint.path}</p></div>
            <div class="card-body"><p>${endpoint.description}</p><a href="${tryLink}" target="_blank" class="try-btn">Coba Sekarang</a></div>
        </div>`;
    };

    const createSection = (name, withTitle = true) => {
        const section = document.createElement('section');
        section.id = name;
        section.className = 'feature-section';
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
        const icons = { anime: 'fa-solid fa-fire', fun: 'fa-solid fa-face-grin-beam', game: 'fa-solid fa-gamepad', quotes: 'fa-solid fa-quote-left' };
        const iconClass = icons[name] || 'fa-solid fa-star';
        
        let titleHTML = '';
        if (withTitle) {
            titleHTML = `<h2><i class="${iconClass}"></i> ${formattedName}</h2>`;
        }

        section.innerHTML = `
            ${titleHTML}
            <div class="feature-grid">
                ${categories[name].map(createCardHTML).join('')}
            </div>
        `;
        return section;
    };
    
    const renderContent = (categoryToShow) => {
        if (categoryToShow === 'all') {
            mainHeaderTitle.textContent = "Dashboard";
            featuresContainer.innerHTML = '';
            Object.keys(categories).sort().forEach(name => featuresContainer.appendChild(createSection(name, true)));
        } else {
            const formattedName = categoryToShow.charAt(0).toUpperCase() + categoryToShow.slice(1);
            mainHeaderTitle.textContent = formattedName;
            featuresContainer.innerHTML = '';
            if (categories[categoryToShow]) {
                featuresContainer.appendChild(createSection(categoryToShow, false));
            }
        }
    };

    const attachNavFilterListeners = () => {
        const allLinks = document.querySelectorAll('.nav-menu a, .nav-menu-features a');
        allLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                allLinks.forEach(nav => nav.classList.remove('active'));
                link.classList.add('active');
                const categoryToShow = link.getAttribute('data-category');
                renderContent(categoryToShow);
                sidebar.classList.remove('active');
            });
        });
    };

    const loadInitialData = async () => {
        try {
            const response = await fetch('/api/endpoints');
            const endpoints = await response.json();

            endpoints.forEach(endpoint => {
                const category = endpoint.category.toLowerCase();
                if (!categories[category]) categories[category] = [];
                categories[category].push(endpoint);
            });

            navMenu.innerHTML = `<li><a href="#" class="nav-link active" data-category="all"><i class="fa-solid fa-table-columns"></i> Dashboard</a></li>`;

            navMenuFeatures.innerHTML = '';
            const categoryNames = Object.keys(categories).sort();
            
            categoryNames.forEach(name => {
                const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
                const icons = { anime: 'fa-solid fa-fire', fun: 'fa-solid fa-face-grin-beam', game: 'fa-solid fa-gamepad', quotes: 'fa-solid fa-quote-left' };
                const iconClass = icons[name] || 'fa-solid fa-star';
                const navItem = document.createElement('li');
                navItem.innerHTML = `<a href="#" class="nav-link" data-category="${name}"><i class="${iconClass}"></i> ${formattedName}</a>`;
                navMenuFeatures.appendChild(navItem);
            });

            renderContent('all');
            attachNavFilterListeners();

        } catch (error) {
            featuresContainer.innerHTML = '<p style="text-align: center; color: red;">Gagal memuat daftar fitur.</p>';
            console.error('Error saat memuat fitur:', error);
        }
    };
    
    const clockElement = document.getElementById('real-time-clock')?.querySelector('span');
    if (clockElement) {
        setInterval(() => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            clockElement.textContent = `${hours}:${minutes}:${seconds}`;
        }, 1000);
    }
    const batteryElement = document.getElementById('battery-status');
    if (batteryElement && 'getBattery' in navigator) {
        const batterySpan = batteryElement.querySelector('span');
        const batteryIcon = batteryElement.querySelector('i');
        
        navigator.getBattery().then(battery => {
            const updateBatteryStatus = () => {
                const level = Math.floor(battery.level * 100);
                batterySpan.textContent = `${level}%`;
                if (battery.charging) batteryIcon.className = 'fa-solid fa-bolt';
                else if (level > 90) batteryIcon.className = 'fa-solid fa-battery-full';
                else if (level > 60) batteryIcon.className = 'fa-solid fa-battery-three-quarters';
                else if (level > 30) batteryIcon.className = 'fa-solid fa-battery-half';
                else if (level > 10) batteryIcon.className = 'fa-solid fa-battery-quarter';
                else batteryIcon.className = 'fa-solid fa-battery-empty';
            };
            updateBatteryStatus();
            battery.addEventListener('levelchange', updateBatteryStatus);
            battery.addEventListener('chargingchange', updateBatteryStatus);
        });
    } else if (batteryElement) {
        batteryElement.querySelector('span').textContent = "Tidak Didukung";
    }
    const ipElement = document.getElementById('ip-address')?.querySelector('span');
    if (ipElement) {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => ipElement.textContent = data.ip)
            .catch(error => ipElement.textContent = "Gagal Mendapatkan IP");
    }

    loadInitialData();
});