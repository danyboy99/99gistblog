# 99 Gist Blog Project Index

## Server & Configuration
- `server.js` - Main application entry point
- `package.json` - Project dependencies and scripts

## Routes
- `router/index.js` - Main routes for the blog frontend
- `router/admin.js` - Admin routes (not fully visible in context)

## Models
- `model/blogs.js` - Blog data model

## Views
- `views/index.ejs` - Main blog listing page
- Other EJS templates (not fully visible in context)

## Public Assets
- `public/stylesheets/Blog.css` - Styling for blog pages
- `public/stylesheets/index.css` - Styling for index page

## Database
- MongoDB connection configured in `server.js`
- Using Mongoose ODM for data modeling

## Authentication
- Using Passport.js for authentication
- Session management with express-session and connect-mongo