# Natours - Adventure Tours Application

Natours is a full-stack web application for booking and managing adventure tours. It provides a seamless experience for users to explore, book, and review tours, while offering administrators powerful tools to manage tours and users.

## Features

- **User Authentication**: Secure login/signup with JWT and password encryption
- **Tour Management**: Create, read, update, and delete tours
- **Booking System**: Integrated with Stripe for secure payments
- **Reviews & Ratings**: Users can leave reviews and ratings for tours
- **Advanced Filtering**: Search and filter tours with various criteria
- **Image Upload**: Support for tour images with processing via Sharp
- **Security**: Implemented with best practices including rate limiting, data sanitization, and XSS protection

## Technologies Used

### Backend

- **Node.js** (v20) - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email sending
- **Sharp** - Image processing
- **Multer** - File upload handling

### Frontend

- **Next.js** (v15) - React framework
- **React** (v19) - JavaScript library
- **React Hot Toast** - Notifications
- **React Leaflet** - Maps integration
- **Lucide React** - Icons

### Development Tools

- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **Dotenv** - Environment variables

### Prerequisites

- Node.js (v20 or higher)
- MongoDB
- Stripe account
- SendGrid account

## Access the application:

- Frontend: `https://natours-zeta-six.vercel.app`
- Backend: `https://natours-sluw.onrender.com/api/v1`

## API Documentation

Explore the API endpoints using our [Postman Documentation](https://documenter.getpostman.com/view/41950997/2sAYdeKWFL)

## Acknowledgments

- Inspired by Jonas Schmedtmann's Node.js course
