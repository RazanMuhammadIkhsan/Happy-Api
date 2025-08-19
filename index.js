const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// --- Logika Pemuatan Rute Otomatis ---
const endpoints = [];

/**
 * Fungsi rekursif untuk memindai dan memuat rute dari direktori.
 * @param {string} directory - Path sistem file ke direktori yang akan dipindai.
 * @param {string} apiPrefix - Prefix URL API yang akan dibangun.
 */
function loadRoutesRecursive(directory, apiPrefix) {
    fs.readdirSync(directory).forEach(item => {
        const fullPath = path.join(directory, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
            loadRoutesRecursive(fullPath, `${apiPrefix}/${item.toLowerCase()}`);
        } 
        else if (item.endsWith('.js')) {
            const routeModule = require(fullPath);
            
            if (routeModule.router && routeModule.category && routeModule.description) {
                const routeName = path.basename(item, '.js');
                const apiPath = `${apiPrefix}/${routeName}`;
                
                app.use(apiPath, routeModule.router);
                
                endpoints.push({
                    path: apiPath,
                    category: routeModule.category,
                    description: routeModule.description,
                });

                console.log(`✅ Rute berhasil dimuat: ${apiPath}`);
            }
        }
    });
}

const routesPath = path.join(__dirname, 'routes');
loadRoutesRecursive(routesPath, '/api');

// --- Endpoint untuk Dashboard ---
app.get('/api/endpoints', (req, res) => {
    res.json(endpoints);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});