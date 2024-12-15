import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: [process.env.PRODUCTION_API_URL, process.env.VITE_API_URL],
    methods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['Authorization'],
};

app.use(cors(corsOptions));

// console.log("Allowed origins:", [process.env.PRODUCTION_API_URL, process.env.VITE_API_URL]);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});

// Serve static files from the public directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/default_images', express.static(path.join(__dirname, 'public/default_images')));

const port = process.env.PORT || 8090;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});

// Default route
app.get('/', (req, res) => {
    res.send('API is working!');
});

// ======================= Authentication Routes =========================
import signinRouter from './routes/auth/signinRoute.js';
app.post('/api/signin', signinRouter);

import verifyToken from './verifyToken.js';
app.get('/api/signin', verifyToken, (req, res) => {
    return res.json({ 
        Status: "Success", 
        id: req.id, 
        name: req.name, 
        email: req.email, 
        role: req.role,
        image: req.image
    });
});

import signupRouter from './routes/auth/signupRoute.js';
app.post('/api/signup', signupRouter);

import resetRouter from './routes/auth/resetRoute.js';
app.post('/api/verifyEmail', resetRouter);
app.post('/api/resetPassword', resetRouter);

import logoutRouter from './routes/auth/logoutRoute.js';
app.get('/api/logout', logoutRouter);

// ======================= User Routes =================================
import updateUserRouter from './routes/users/updateUserRoute.js';
app.put('/api/updateUser/:userId', updateUserRouter);

import deleteUserRouter from './routes/users/deleteUserRoute.js';
app.delete('/api/deleteUser', deleteUserRouter);

import deleteProfileImageRouter from './routes/users/deleteProfileImageRoute.js';
app.delete('/api/deleteProfileImage/:userId', deleteProfileImageRouter);

import fetchUsersRouter from './routes/users/fetchUsersRoute.js';
app.get('/api/roles', fetchUsersRouter); // Fetch Roles
app.get('/api/getUser', fetchUsersRouter); // Fetch All Users
app.get('/api/getUserById/:userId', fetchUsersRouter); // Fetch User by ID

// ======================= Category Routes =============================
import addCategoryRouter from './routes/categories/addCategoryRoute.js';
app.post('/api/categories/addCategory', addCategoryRouter);

import updateCategoryRouter from './routes/categories/updateCategoryRoute.js';
app.put('/api/updateCategory/:categoryId', updateCategoryRouter);

import deleteCategoryRouter from './routes/categories/deleteCategoryRoute.js';
app.delete('/api/deleteCategory', deleteCategoryRouter);

import fetchCategoriesRouter from './routes/categories/fetchCategoriesRoute.js';
app.get('/api/fetchCategories', fetchCategoriesRouter);
app.get('/api/fetchOnlyRequiredCategories', fetchCategoriesRouter);
app.get('/api/fetchCategoryById/:categoryId', fetchCategoriesRouter);

// ======================= Product Routes ==============================
import addProductRouter from './routes/products/addProductRoute.js';
app.post('/api/products/addProduct', addProductRouter);

import updateProductRouter from './routes/products/updateProductRoute.js';
app.put('/api/updateProduct/:productId', updateProductRouter);

import deleteProductRouter from './routes/products/deleteProductRoute.js';
app.delete('/api/deleteProduct', deleteProductRouter);

import deleteProductImageRouter from './routes/products/deleteProductImageRoute.js';
app.delete('/api/deleteProductImage/:ProductId', deleteProductImageRouter);

import fetchProductsRouter from './routes/products/fetchProductsRoute.js';
app.get('/api/fetchProducts', fetchProductsRouter);
app.get('/api/fetchProductById/:productId', fetchProductsRouter);
app.get('/api/fetchProductByName/:productName', fetchProductsRouter);
app.get('/api/fetchProductByCategory/:categoryName', fetchProductsRouter);
app.get('/api/fetchProductsByCategory/newArrivals', fetchProductsRouter);
app.get('/api/fetchProductsByCategory/bestSellers', fetchProductsRouter);
app.get('/api/fetchProductsByCategory/specialOffers', fetchProductsRouter);

// ======================= Order Routes =================================
import ordersRouter from './routes/orders/orderRoute.js';
app.post('/api/orders', ordersRouter);
app.use('/api/orders', ordersRouter);

import fetchOrdersRouter from './routes/orders/fetchOrderRoute.js';
app.use('/api/orders', fetchOrdersRouter);

// ======================= Order Routes =================================
import searchRouter from './routes/search/searchRoute.js';
app.get('/api/search', searchRouter);

// Export app for Vercel
export default app;