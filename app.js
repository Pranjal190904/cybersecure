const express = require('express') ; 
const app = express() ;
const { PORT } = require('./config/env.config') ;
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth.route') ;
const cookieParser = require('cookie-parser') ;

app.set('view engine', 'ejs') ;
app.use(cookieParser()) ;
app.use(express.json()) ;
app.use(express.urlencoded({ extended: true })) ;
app.use('/v1/auth', authRoutes) ;

connectDB() ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})