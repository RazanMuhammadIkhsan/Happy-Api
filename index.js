const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const endpoints = [];
const routesPath = path.join(__dirname, 'routes');

fs.readdirSync(routesPath).forEach(categoryFolder => {
    const categoryPath = path.join(routesPath, categoryFolder);
    
    if (fs.statSync(categoryPath).isDirectory()) {
        fs.readdirSync(categoryPath).forEach(file => {
            if (file.endsWith('.js')) {
                const routePath = path.join(categoryPath, file);
                const routeModule = require(routePath);
                
                if (routeModule.router && routeModule.category && routeModule.description) {
                    const routeName = path.basename(file, '.js');
                    const apiPath = `/api/${categoryFolder.toLowerCase()}/${routeName}`;
                    
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
});

// --- Endpoint Baru untuk Dashboard ---
app.get('/api/endpoints', (req, res) => {
    res.json(endpoints);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});