const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname, {
    setHeaders: (res, filepath) => {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
    }
}));

const registrations = [];

app.post('/api/register', (req, res) => {
    const registration = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    registrations.push(registration);
    
    console.log('تسجيل جديد:', registration);
    
    res.json({
        success: true,
        message: 'تم التسجيل بنجاح',
        data: registration
    });
});

app.get('/api/registrations', (req, res) => {
    res.json({
        success: true,
        count: registrations.length,
        data: registrations
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ خادم نعمة يعمل على المنفذ ${PORT}`);
    console.log(`🌐 الموقع متاح على: http://0.0.0.0:${PORT}`);
});
