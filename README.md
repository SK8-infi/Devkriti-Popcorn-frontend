# Devkriti Popcorn - Movie Theatre Booking System

## Project Description

Devkriti Popcorn is a comprehensive movie theatre booking system built with React.js frontend and Node.js backend. The application provides a modern, responsive interface for users to browse movies, book tickets, and manage their bookings, while offering powerful admin tools for theatre management.

The system features real-time seat availability, secure payment processing with Stripe, Google OAuth authentication, and a complete notification system. It supports multiple user roles (User, Admin, Owner) with role-based access control and provides comprehensive analytics for theatre management.

## Screenshots

----Screenshots----

<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/5a6567fb-64b2-4716-ab2e-a3b934892a1c" />

<img width="1919" height="932" alt="image" src="https://github.com/user-attachments/assets/a70336a4-f48c-4f6c-aee3-7d8adcc951ef" />

<img width="1919" height="926" alt="image" src="https://github.com/user-attachments/assets/255c5e3a-7e95-4373-af9e-b3b5078342ed" />

<img width="1917" height="927" alt="image" src="https://github.com/user-attachments/assets/ef0a0e96-09bd-4325-bbfc-bc1962f6acbe" />

<img width="1919" height="923" alt="image" src="https://github.com/user-attachments/assets/eb72e7c3-4f2d-4347-a21f-d97963967458" />

<img width="1919" height="922" alt="image" src="https://github.com/user-attachments/assets/ca533062-7b3c-4d76-afaa-6f3e649d1409" />

<img width="1914" height="926" alt="image" src="https://github.com/user-attachments/assets/db5d3e0d-9dab-4818-ac70-8ceebe9be8c6" />

<img width="1919" height="921" alt="image" src="https://github.com/user-attachments/assets/a7472c5a-8592-438b-8974-4ac83c772717" />

<img width="1118" height="850" alt="image" src="https://github.com/user-attachments/assets/ecfb9a08-b71a-4e48-bf2e-0c0be2206dee" />

<img width="1154" height="902" alt="image" src="https://github.com/user-attachments/assets/ecb30960-71e0-4a71-a18b-e437ccf86e39" />

<img width="1919" height="926" alt="image" src="https://github.com/user-attachments/assets/63725167-3504-4857-a7a7-32cea44e282e" />

<img width="1919" height="928" alt="image" src="https://github.com/user-attachments/assets/7b64b11d-0f10-4fc6-bcae-096750226da2" />

<img width="1919" height="918" alt="image" src="https://github.com/user-attachments/assets/2a2cd0ef-f443-46e4-871f-1f95943693c9" />

<img width="1919" height="927" alt="image" src="https://github.com/user-attachments/assets/39a7960f-1249-4db0-acf3-a7cbf870314c" />



*[Screenshots will be added here showing the main interfaces: Home page, Movie browsing, Seat selection, Booking confirmation, Admin dashboard, etc.]*

## Hosted URL

*https://devkriti-popcorn-frontend.vercel.app/*
*https://popcorn-backend.duckdns.org/*

## Features Implemented

### Frontend

----Frontend Features----

#### **User Interface & Experience**
- **Responsive Design**: Mobile-first approach with adaptive layouts for all screen sizes
- **Modern UI/UX**: Clean, intuitive interface with smooth animations using Framer Motion
- **Interactive Seat Selection**: Visual seat layout with real-time availability and pricing
- **Dynamic Show Filtering**: Filter shows by date, time, language, and format
- **Real-time Updates**: Live booking status and seat availability
- **Toast Notifications**: User-friendly feedback for all actions using React Hot Toast
- **Loading States**: Visual feedback during API operations and page transitions

#### **Movie Management**
- **Movie Discovery**: Browse latest movies with TMDB integration
- **Movie Details**: Comprehensive movie information including trailers, cast, ratings
- **Trailer Integration**: Embedded video players for movie trailers
- **Movie Reviews**: User-generated reviews and ratings system
- **Favorite Movies**: Save and manage favorite movies
- **Search & Filter**: Advanced search functionality with multiple filters

#### **Booking System**
- **Show Selection**: Choose from available showtimes with detailed information
- **Seat Layout**: Interactive seat selection with different pricing tiers (Silver, Gold, Premium)
- **Booking Confirmation**: Real-time booking status and confirmation
- **QR Code Tickets**: Generate and display QR codes for tickets
- **Booking Management**: View, cancel, and manage all user bookings
- **Payment Integration**: Seamless Stripe payment processing

#### **User Management**
- **Google OAuth**: Secure authentication with Google accounts
- **Role-based Access**: User, Admin, and Owner roles with different permissions
- **Profile Management**: User profile and preferences
- **Notification System**: In-app notifications for bookings, reminders, and updates
- **Review System**: User-generated reviews for movies and theatres

#### **Theatre Features**
- **Theatre Information**: Detailed theatre profiles and locations
- **Theatre Reviews**: User reviews and ratings for theatres
- **Contact System**: Contact forms and support channels

#### **Admin Panel**
- **Dashboard**: Comprehensive analytics with revenue tracking and booking statistics
- **Show Management**: Create, edit, and manage movie shows
- **Theatre Setup**: Configure theatre details, rooms, and layouts
- **User Management**: Admin and owner role management (Owner only)
- **Booking Oversight**: Monitor and manage all theatre bookings
- **Review Analytics**: Track and analyze user reviews and ratings

#### **AI Integration**
- **Ask AI**: AI-powered assistance for movie recommendations and queries (To be implemented)
- **Smart Recommendations**: AI-driven movie suggestions based on user preferences (To be implemented)

### Backend

----Backend Features----

#### **Authentication & Authorization**
- **JWT Token Management**: Secure token-based authentication
- **Google OAuth Integration**: Third-party authentication
- **Role-based Access Control**: User, Admin, Owner permissions
- **Session Management**: Secure session handling

#### **Movie Management**
- **TMDB Integration**: Real-time movie data from The Movie Database
- **Movie Caching**: Optimized data caching for performance
- **Show Scheduling**: Flexible show scheduling system
- **Movie Reviews**: User review and rating system

#### **Booking System**
- **Real-time Seat Management**: Live seat availability tracking
- **Booking Validation**: Comprehensive booking validation and conflict resolution
- **Payment Processing**: Stripe integration for secure payments
- **Booking Timeouts**: Automatic booking cleanup for incomplete transactions
- **Cancellation System**: Booking cancellation with refund processing

#### **Payment Integration**
- **Stripe Webhooks**: Real-time payment status updates
- **Multiple Payment Methods**: Support for various payment options
- **Currency Support**: INR with proper amount conversion
- **Refund Processing**: Automated refund handling

#### **Notification System**
- **Email Notifications**: Automated email reminders and confirmations
- **In-app Notifications**: Real-time notification system
- **Show Reminders**: Automated reminders for upcoming shows
- **Payment Confirmations**: Payment success/failure notifications

#### **Theatre Management**
- **Theatre Configuration**: Theatre setup and room management
- **Seat Layout Management**: Dynamic seat layout configuration
- **Theatre Analytics**: Performance tracking and reporting
- **Review Management**: Theatre review and response system

#### **Background Services**
- **Cron Jobs**: Automated tasks for reminders and cleanup
- **Email Service**: Nodemailer integration for email notifications
- **Ticket Generation**: PDF ticket generation with QR codes
- **Data Cleanup**: Automated cleanup of old data and expired bookings

## Technologies/Libraries/Packages Used

----List Out----

### **Frontend Technologies**
- **React 19**: Modern React with latest features
- **Vite**: Fast build tool and development server
- **React Router DOM v7**: Client-side routing
- **React Context API**: State management
- **React Hot Toast**: Toast notifications
- **Lucide React**: Icon library
- **Axios**: HTTP client for API calls
- **React Player**: Video player for trailers
- **ESLint**: Code linting and quality

### **Backend Technologies**
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **Passport.js**: Authentication middleware
- **Stripe**: Payment processing
- **Nodemailer**: Email service
- **Cron**: Scheduled task management
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

### **Development Tools**
- **Git**: Version control
- **npm**: Package manager
- **ESLint**: Code linting
- **Vercel**: Deployment platform

### **Third-party Services**
- **Google OAuth**: Authentication service
- **Stripe**: Payment processing
- **TMDB**: Movie database API
- **Nodemailer**: Email service
- **QR Code**: Ticket generation

## Project Architecture & File Structure

### **Frontend File Structure**

```
Devkriti-Popcorn-frontend/
├── public/                          # Static assets
│   ├── index.html                   # Main HTML file
│   └── favicon.ico                  # Site favicon
├── src/
│   ├── assets/                      # Images and static files
│   ├── components/                  # Reusable UI components
│   │   ├── admin/                   # Admin-specific components
│   │   │   ├── AdminNavbar.jsx      # Admin navigation bar
│   │   │   ├── AdminSidebar.jsx     # Admin sidebar navigation
│   │   │   ├── AdminSubNavbar.jsx   # Admin sub-navigation
│   │   │   ├── SeatLayoutEditor.jsx # Theatre seat layout editor
│   │   │   ├── TheatreDebug.jsx     # Theatre debugging component
│   │   │   ├── TheatreSetupModal.jsx # Theatre setup modal
│   │   │   ├── TheatreSettingsModal.jsx # Theatre settings modal
│   │   │   └── Title.jsx            # Admin page title component
│   │   ├── AboutUs.jsx              # About us component
│   │   ├── CancellationModal.jsx    # Booking cancellation modal
│   │   ├── CircularGallery.jsx      # Circular movie gallery
│   │   ├── CircularRating.jsx       # Circular rating display
│   │   ├── DateSelect.jsx           # Date selection component
│   │   ├── DarkVeil.jsx             # Dark overlay component
│   │   ├── Dock.jsx                 # Dock navigation component
│   │   ├── FeaturedSection.jsx      # Featured movies section
│   │   ├── Footer.jsx               # Site footer
│   │   ├── GlareHover.jsx           # Glare hover effect
│   │   ├── HeroSection.jsx          # Hero section with movie trailers
│   │   ├── Loading.jsx              # Loading spinner component
│   │   ├── MobileBottomDock.jsx     # Mobile bottom navigation
│   │   ├── MobileNavigation.jsx     # Mobile navigation
│   │   ├── MovieCard.jsx            # Movie card component
│   │   ├── MovieReviews.jsx         # Movie reviews component
│   │   ├── MovieReviewForm.jsx      # Movie review form
│   │   ├── Navbar.jsx               # Main navigation bar
│   │   ├── RecommendedSection.jsx   # Recommended movies section
│   │   ├── ResponsiveContainer.jsx  # Responsive container wrapper
│   │   ├── ResponsiveGrid.jsx       # Responsive grid layout
│   │   ├── ReviewAnalytics.jsx      # Review analytics component
│   │   ├── TheatreAnalytics.jsx     # Theatre analytics component
│   │   ├── TheatreReviews.jsx       # Theatre reviews component
│   │   ├── TheatreReviewForm.jsx    # Theatre review form
│   │   ├── TheatreResponseForm.jsx  # Theatre response form
│   │   ├── TicketQRModal.jsx        # QR code ticket modal
│   │   ├── TrailerModal.jsx         # Movie trailer modal
│   │   └── TrailersSection.jsx      # Trailers section component
│   ├── context/                     # React Context providers
│   │   └── AppContext.jsx           # Main app state management
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility libraries
│   ├── pages/                       # Page components
│   │   ├── admin/                   # Admin pages
│   │   │   ├── AddShows.jsx         # Add new shows page
│   │   │   ├── Dashboard.jsx        # Admin dashboard
│   │   │   ├── DebugAccess.jsx      # Debug access page
│   │   │   ├── Layout.jsx           # Admin layout wrapper
│   │   │   ├── ListBookings.jsx     # List all bookings
│   │   │   ├── ListShows.jsx        # List all shows
│   │   │   ├── ManageRooms.jsx      # Manage theatre rooms
│   │   │   ├── ManageUsers.jsx      # Manage users (Owner only)
│   │   │   ├── ReviewAnalytics.jsx  # Review analytics page
│   │   │   ├── TheatreAnalytics.jsx # Theatre analytics page
│   │   │   ├── TestOwnerAccess.jsx  # Test owner access
│   │   │   └── UpdateLayout.jsx     # Update theatre layout
│   │   ├── AskAI.jsx                # AI assistance page
│   │   ├── ContactUs.jsx            # Contact us page
│   │   ├── Favorite.jsx             # Favorite movies page
│   │   ├── Home.jsx                 # Home page
│   │   ├── Loading.jsx              # Loading page
│   │   ├── MovieDetails.jsx         # Movie details page
│   │   ├── Movies.jsx               # Movies listing page
│   │   ├── MyBookings.jsx           # User bookings page
│   │   ├── Notifications.jsx        # Notifications page
│   │   ├── SeatLayout.jsx           # Seat selection page
│   │   ├── SelectShowtime.jsx       # Showtime selection page
│   │   ├── Theatre.jsx              # Theatre page
│   │   ├── TheatreDetails.jsx       # Theatre details page
│   │   ├── Theatres.jsx             # Theatres listing page
│   │   └── UserReviews.jsx          # User reviews page
│   ├── utils/                       # Utility functions
│   ├── App.jsx                      # Main app component
│   ├── index.css                    # Global styles
│   └── main.jsx                     # App entry point
├── package.json                     # Dependencies and scripts
├── vite.config.js                   # Vite configuration
└── eslint.config.js                 # ESLint configuration
```

### **Backend File Structure**

```
Devkriti-Popcorn-backend/
├── configs/                         # Configuration files
│   ├── db.js                        # Database connection configuration
│   └── passport.js                  # Passport authentication configuration
├── controllers/                     # Route controllers
│   ├── adminController.js           # Admin operations controller
│   ├── authController.js            # Authentication controller
│   ├── bookingController.js         # Booking operations controller
│   ├── cancellationController.js    # Cancellation operations controller
│   ├── contactController.js         # Contact form controller
│   ├── movieController.js           # Movie operations controller
│   ├── movieReviewController.js     # Movie review controller
│   ├── notificationController.js    # Notification controller
│   ├── reviewController.js          # Theatre review controller
│   ├── showController.js            # Show operations controller
│   ├── stripeWebhooks.js            # Stripe webhook handler
│   ├── ticketController.js          # Ticket operations controller
│   └── userController.js            # User operations controller
├── images/                          # Image storage
├── middleware/                      # Custom middleware
│   └── auth.js                      # Authentication middleware
├── models/                          # MongoDB schemas
│   ├── Booking.js                   # Booking schema
│   ├── Movie.js                     # Movie schema
│   ├── MovieReview.js               # Movie review schema
│   ├── Notification.js              # Notification schema
│   ├── Review.js                    # Theatre review schema
│   ├── Show.js                      # Show schema
│   ├── Theatre.js                   # Theatre schema
│   └── User.js                      # User schema
├── routes/                          # API routes
│   ├── adminRoutes.js               # Admin routes
│   ├── authRoutes.js                # Authentication routes
│   ├── bookingRoutes.js             # Booking routes
│   ├── cancellationRoutes.js        # Cancellation routes
│   ├── contactRoutes.js             # Contact routes
│   ├── cronRoutes.js                # Cron job routes
│   ├── movieRoutes.js               # Movie routes
│   ├── movieReviewRoutes.js         # Movie review routes
│   ├── notificationRoutes.js        # Notification routes
│   ├── reviewRoutes.js              # Theatre review routes
│   ├── showRoutes.js                # Show routes
│   ├── ticketRoutes.js              # Ticket routes
│   └── userRoutes.js                # User routes
├── utils/                           # Utility functions
│   ├── bookingTimeout.js            # Booking timeout management
│   ├── cronJobs.js                  # Scheduled tasks
│   ├── emailService.js              # Email service
│   ├── notificationService.js       # Notification service
│   ├── simpleTicketGenerator.js     # Simple ticket generation
│   └── ticketGenerator.js           # Advanced ticket generation
├── movies_latest.json               # Cached movie data
├── package.json                     # Dependencies and scripts
├── server.js                        # Main server file
└── vercel.json                      # Vercel deployment configuration
```

## Database Schema & Relationships

### **MongoDB Collections & Schemas**

#### **1. User Collection (`users`)**
```javascript
{
  _id: ObjectId,
  googleId: String,                    // Google OAuth ID
  name: String,                        // User's full name
  email: String,                       // User's email address
  picture: String,                     // Profile picture URL
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],  // User role
    default: 'user'
  },
  createdAt: Date,                     // Account creation date
  updatedAt: Date                      // Last update date
}
```

#### **2. Theatre Collection (`theatres`)**
```javascript
{
  _id: ObjectId,
  name: String,                        // Theatre name
  location: String,                    // Theatre location
  address: String,                     // Full address
  contactNumber: String,               // Contact phone
  email: String,                       // Contact email
  description: String,                 // Theatre description
  amenities: [String],                 // Available amenities
  images: [String],                    // Theatre images
  layout: {
    rows: Number,                      // Number of rows
    seatsPerRow: Number,               // Seats per row
    seatTypes: {
      silver: { price: Number, seats: [String] },
      gold: { price: Number, seats: [String] },
      premium: { price: Number, seats: [String] }
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### **3. Movie Collection (`movies`)**
```javascript
{
  _id: ObjectId,
  tmdbId: Number,                      // TMDB movie ID
  title: String,                       // Movie title
  overview: String,                    // Movie description
  posterPath: String,                  // Poster image path
  backdropPath: String,                // Backdrop image path
  releaseDate: Date,                   // Release date
  runtime: Number,                     // Movie duration
  genres: [String],                    // Movie genres
  rating: Number,                      // Average rating
  voteCount: Number,                   // Number of votes
  trailerKey: String,                  // YouTube trailer key
  cast: [String],                      // Cast members
  director: String,                    // Director name
  language: String,                    // Movie language
  isActive: Boolean,                   // Active status
  createdAt: Date,
  updatedAt: Date
}
```

#### **4. Show Collection (`shows`)**
```javascript
{
  _id: ObjectId,
  movie: {
    type: ObjectId,
    ref: 'Movie'                       // Reference to Movie collection
  },
  theatre: {
    type: ObjectId,
    ref: 'Theatre'                     // Reference to Theatre collection
  },
  date: Date,                          // Show date
  time: String,                        // Show time (HH:MM)
  language: String,                    // Show language
  format: String,                      // Show format (2D, 3D, IMAX)
  price: {
    silver: Number,                    // Silver seat price
    gold: Number,                      // Gold seat price
    premium: Number                    // Premium seat price
  },
  availableSeats: [String],            // Available seat numbers
  bookedSeats: [String],               // Booked seat numbers
  isActive: Boolean,                   // Show status
  createdAt: Date,
  updatedAt: Date
}
```

#### **5. Booking Collection (`bookings`)**
```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User'                        // Reference to User collection
  },
  show: {
    type: ObjectId,
    ref: 'Show'                        // Reference to Show collection
  },
  seats: [String],                     // Booked seat numbers
  totalAmount: Number,                 // Total booking amount
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  stripeSessionId: String,             // Stripe session ID
  stripePaymentIntentId: String,       // Stripe payment intent ID
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'expired'],
    default: 'confirmed'
  },
  qrCode: String,                      // QR code data
  ticketNumber: String,                // Unique ticket number
  bookingDate: Date,                   // Booking creation date
  showDate: Date,                      // Show date
  showTime: String,                    // Show time
  movieTitle: String,                  // Movie title
  theatreName: String,                 // Theatre name
  seatTypes: [{
    seatNumber: String,
    type: String,                      // silver, gold, premium
    price: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### **6. Review Collection (`reviews`)**
```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User'                        // Reference to User collection
  },
  theatre: {
    type: ObjectId,
    ref: 'Theatre'                     // Reference to Theatre collection
  },
  title: String,                       // Review title
  content: String,                     // Review content
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  categories: {
    cleanliness: Number,               // Cleanliness rating
    service: Number,                   // Service rating
    comfort: Number,                   // Comfort rating
    value: Number                      // Value for money rating
  },
  images: [String],                    // Review images
  isVerified: Boolean,                 // Verified booking status
  theatreResponse: {
    content: String,                   // Theatre response
    respondedBy: {
      type: ObjectId,
      ref: 'User'                      // Admin/Owner who responded
    },
    respondedAt: Date
  },
  helpfulCount: Number,                // Number of helpful votes
  createdAt: Date,
  updatedAt: Date
}
```

#### **7. MovieReview Collection (`moviereviews`)**
```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User'                        // Reference to User collection
  },
  movie: {
    type: ObjectId,
    ref: 'Movie'                       // Reference to Movie collection
  },
  title: String,                       // Review title
  content: String,                     // Review content
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  isVerified: Boolean,                 // Verified booking status
  helpfulCount: Number,                // Number of helpful votes
  createdAt: Date,
  updatedAt: Date
}
```

#### **8. Notification Collection (`notifications`)**
```javascript
{
  _id: ObjectId,
  user: {
    type: ObjectId,
    ref: 'User'                        // Reference to User collection
  },
  title: String,                       // Notification title
  message: String,                     // Notification message
  type: {
    type: String,
    enum: ['booking', 'show', 'reminder', 'system', 'cancellation'],
    default: 'system'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  relatedId: ObjectId,                 // Related entity ID
  relatedModel: String,                // Related model name
  createdAt: Date
}
```

### **Database Relationships**

#### **One-to-Many Relationships:**
1. **User → Bookings**: One user can have multiple bookings
2. **User → Reviews**: One user can write multiple reviews
3. **User → MovieReviews**: One user can write multiple movie reviews
4. **User → Notifications**: One user can have multiple notifications
5. **Theatre → Shows**: One theatre can have multiple shows
6. **Theatre → Reviews**: One theatre can have multiple reviews
7. **Movie → Shows**: One movie can have multiple shows
8. **Movie → MovieReviews**: One movie can have multiple reviews
9. **Show → Bookings**: One show can have multiple bookings

#### **Many-to-One Relationships:**
1. **Bookings → User**: Multiple bookings belong to one user
2. **Bookings → Show**: Multiple bookings belong to one show
3. **Reviews → User**: Multiple reviews belong to one user
4. **Reviews → Theatre**: Multiple reviews belong to one theatre
5. **MovieReviews → User**: Multiple movie reviews belong to one user
6. **MovieReviews → Movie**: Multiple movie reviews belong to one movie
7. **Shows → Theatre**: Multiple shows belong to one theatre
8. **Shows → Movie**: Multiple shows belong to one movie
9. **Notifications → User**: Multiple notifications belong to one user

#### **Indexes for Performance:**
```javascript
// User Collection
{ email: 1 }                           // Unique email index
{ googleId: 1 }                        // Google OAuth lookup

// Booking Collection
{ user: 1 }                           // User bookings lookup
{ show: 1 }                           // Show bookings lookup
{ paymentStatus: 1 }                  // Payment status filtering
{ bookingStatus: 1 }                  // Booking status filtering
{ bookingDate: -1 }                   // Recent bookings

// Show Collection
{ movie: 1 }                          // Movie shows lookup
{ theatre: 1 }                        // Theatre shows lookup
{ date: 1, time: 1 }                  // Date/time filtering
{ isActive: 1 }                       // Active shows filtering

// Review Collection
{ theatre: 1 }                        // Theatre reviews lookup
{ user: 1 }                           // User reviews lookup
{ rating: -1 }                        // Rating sorting

// Notification Collection
{ user: 1 }                           // User notifications lookup
{ isRead: 1 }                         // Unread notifications
{ createdAt: -1 }                     // Recent notifications
```

## Local Setup

----Steps to setup the project locally----

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB database
- Google OAuth credentials
- Stripe account

### **Backend Setup**
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Devkriti-Popcorn-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   STRIPE_PUBLISHABLE_KEY=
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   TMDB_API_KEY=your_tmdb_api_key
   FRONTEND_URL=....for stripe and oauth
   BACKEND_URL=....for stipe and oauth
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### **Frontend Setup**
1. **Navigate to frontend directory**
   ```bash
   cd Devkriti-Popcorn-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_BASE_URL=http://localhost:3000
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_CURRENCY=₹
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### **Database Setup**
1. **MongoDB Connection**: Ensure MongoDB is running and accessible
2. **Initial Data**: The system will automatically create necessary collections
3. **Admin User**: Create an admin user through the application interface

### **Payment Setup**
1. **Stripe Account**: Set up a Stripe account for payment processing
2. **Webhook Configuration**: Configure Stripe webhooks for payment status updates
3. **Test Mode**: Use Stripe test keys for development

### **Email Setup**
1. **Email Service**: Configure Nodemailer with your email service
2. **SMTP Settings**: Set up SMTP configuration for automated emails

## Team Members

----Name----

*Shivansh Katiyar: @SK8-infi*
*Prabal Poddar: @princexpoddar*
*Veditha Keerti Rani: @Veditha08*

## Demo Video

----Demo Video Link----

*[Demo video link will be added here once created]*

---

**Note**: This is a comprehensive movie theatre booking system with full-stack functionality. Ensure all prerequisites are met and services are properly configured for optimal performance.
