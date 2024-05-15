const express = require('express') ; 
const app = express() ;
const { PORT } = require('./config/env.config') ;
const connectDB = require('./config/db.config');
const trendsRoutes = require('./routes/cyber_secure.route') ;
const authRoutes = require('./routes/auth.route') ;
const adminRoutes = require('./routes/admin.route'); 
const handleCors = require("./config/cors.config");
const cookieParser = require('cookie-parser') ;

app.set('view engine', 'ejs') ;
app.use(cookieParser()) ;
app.use(express.json()) ;
app.use(express.urlencoded({ extended: true })) ;
app.use(handleCors);
app.use('/v1', trendsRoutes) ;
app.use('/v1/auth', authRoutes) ;
app.use('/v1/admin', adminRoutes) ;

connectDB() ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})