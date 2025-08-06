# Devkriti Popcorn - Frontend Application

A modern React.js frontend application for a movie theatre booking system with a beautiful, responsive UI and seamless user experience.

## Features

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Real-time Updates**: Live seat availability and booking status
- **Interactive Elements**: Dynamic seat selection and showtime filtering
- **Toast Notifications**: User-friendly feedback for all actions

### Core Functionality
- **Movie Discovery**: Browse latest movies with trailers and details
- **Show Selection**: Filter shows by date, time, language, and format
- **Seat Booking**: Interactive seat layout with real-time availability
- **Payment Integration**: Seamless Stripe payment processing
- **Booking Management**: View and manage all bookings with status tracking
- **User Authentication**: Google OAuth integration with role-based access

### Admin Features
- **Dashboard**: Comprehensive analytics and theatre overview
- **Show Management**: Create, edit, and manage movie shows
- **Theatre Setup**: Configure theatre details and room layouts
- **User Management**: Admin and owner role management
- **Booking Oversight**: Monitor and manage all theatre bookings

## Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS v4 with custom animations
- **State Management**: React Context API with custom hooks
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios for API communication
- **UI Components**: Lucide React icons
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Video Player**: React Player for trailers
- **Development**: ESLint for code quality

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see backend README)
- Google OAuth credentials
- Stripe account for payments

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Devkriti-Popcorn-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:3000/api
   VITE_FRONTEND_URL=http://localhost:5173
   
   # Google OAuth
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   
   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # Currency
   VITE_CURRENCY=inr
   
   # Environment
   VITE_NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

## Project Structure

```
Devkriti-Popcorn-frontend/
├── public/                  # Static assets
│   ├── index.html          # Main HTML file
│   └── favicon.ico         # Site favicon
├── src/
│   ├── assets/             # Images and static files
│   ├── components/         # Reusable UI components
│   │   ├── admin/         # Admin-specific components
│   │   │   ├── AddShows.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ListBookings.jsx
│   │   │   ├── ListShows.jsx
│   │   │   ├── ManageRooms.jsx
│   │   │   ├── ManageUsers.jsx
│   │   │   ├── SignIn.jsx
│   │   │   ├── TestOwnerAccess.jsx
│   │   │   ├── TheatreSetupModal.jsx
│   │   │   ├── TheatreSettingsModal.jsx
│   │   │   └── UpdateLayout.jsx
│   │   ├── TrailersSection.jsx
│   │   └── ...            # Other shared components
│   ├── context/            # React Context providers
│   │   └── AppContext.jsx # Main app state management
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   ├── pages/              # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── ContactUs.jsx
│   │   ├── Favorite.jsx
│   │   ├── Home.jsx
│   │   ├── Loading.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── Movies.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Notifications.jsx
│   │   ├── SeatLayout.jsx
│   │   ├── SelectShowtime.jsx
│   │   ├── Theatre.jsx
│   │   └── Theatres.jsx
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component
│   ├── index.css           # Global styles
│   └── main.jsx            # App entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── eslint.config.js        # ESLint configuration
```

## Key Components

### User Pages
- **Home**: Landing page with movie trailers and featured content
- **Movies**: Browse all available movies with filtering
- **MovieDetails**: Detailed movie information with showtimes
- **SelectShowtime**: Choose show date, time, language, and format
- **SeatLayout**: Interactive seat selection with pricing
- **MyBookings**: View and manage all user bookings
- **Theatres**: Theatre information and location details
- **ContactUs**: Contact form and support information

### Admin Pages
- **Dashboard**: Analytics, revenue, and theatre overview
- **AddShows**: Create new movie shows with scheduling
- **ListShows**: Manage existing shows and schedules
- **ListBookings**: Monitor all theatre bookings
- **ManageUsers**: User role management (Owner only)
- **Layout**: Theatre room layout configuration
- **ManageRooms**: Room setup and management

### Shared Components
- **TrailersSection**: Movie trailer carousel
- **TheatreSetupModal**: Initial theatre configuration
- **TheatreSettingsModal**: Theatre settings updates

## Authentication & Authorization

### User Roles
- **User**: Basic booking and profile access
- **Admin**: Theatre management and show creation
- **Owner**: Full system access including user management

### Authentication Flow
1. User clicks "Sign In with Google"
2. Google OAuth redirects to backend
3. Backend validates and returns JWT token
4. Frontend stores token and updates user state
5. Role-based navigation and access control

## Payment Integration

### Stripe Integration
- **Checkout Sessions**: Secure payment processing
- **Currency Support**: INR with proper amount conversion
- **Success/Failure Handling**: Automatic booking status updates
- **Webhook Processing**: Real-time payment status updates

### Payment Flow
1. User selects seats and clicks "Book Now"
2. Frontend sends booking request to backend
3. Backend creates Stripe Checkout Session
4. User completes payment on Stripe
5. Webhook updates booking status
6. User receives confirmation email

## UI/UX Features

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop Experience**: Full-featured desktop interface

### Interactive Elements
- **Seat Selection**: Visual seat layout with availability
- **Show Filtering**: Date, time, language, and format filters
- **Real-time Updates**: Live booking status and availability
- **Smooth Animations**: Framer Motion for transitions

### User Feedback
- **Toast Notifications**: Success, error, and info messages
- **Loading States**: Visual feedback during operations
- **Error Handling**: Graceful error display and recovery
- **Progress Indicators**: Booking and payment progress

## Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Key Responsive Features
- **Flexible Grid**: CSS Grid and Flexbox layouts
- **Adaptive Typography**: Responsive font sizes
- **Touch-Friendly**: Mobile-optimized touch targets
- **Progressive Enhancement**: Core functionality on all devices

## Performance Optimization

### Code Splitting
- **Route-based**: Lazy loading of page components
- **Component-based**: Dynamic imports for heavy components
- **Bundle Optimization**: Vite for fast builds and HMR

### Asset Optimization
- **Image Optimization**: Compressed and optimized images
- **Font Loading**: Optimized web font loading
- **CSS Optimization**: Purged unused styles

## Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Features
- **Hot Module Replacement**: Instant code updates
- **ESLint Integration**: Code quality enforcement
- **Error Overlay**: In-browser error display
- **Source Maps**: Debug-friendly builds

## Deployment

### Build Process
1. **Install Dependencies**: `npm install`
2. **Environment Setup**: Configure production environment variables
3. **Build Application**: `npm run build`
4. **Deploy**: Upload `dist/` folder to hosting service

### Environment Variables
Ensure all production environment variables are set:
- API URL
- Google OAuth credentials
- Stripe publishable key
- Frontend URL

### Hosting Options
- **Vercel**: Recommended for React applications
- **Netlify**: Static site hosting
- **AWS S3**: Static website hosting
- **Firebase Hosting**: Google's hosting solution

## Troubleshooting

### Common Issues
1. **API Connection**: Verify backend is running and accessible
2. **OAuth Errors**: Check Google OAuth credentials
3. **Payment Issues**: Verify Stripe configuration
4. **Build Errors**: Check Node.js version and dependencies

### Debug Mode
Enable debug logging by setting:
```env
VITE_NODE_ENV=development
VITE_DEBUG=true
```

## Code Quality

### ESLint Configuration
- **React Hooks**: Enforces hooks rules
- **React Refresh**: Fast refresh support
- **Code Style**: Consistent code formatting

### Best Practices
- **Component Structure**: Functional components with hooks
- **State Management**: Context API for global state
- **Error Boundaries**: Graceful error handling
- **Accessibility**: ARIA labels and keyboard navigation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions:
- Check the existing documentation
- Review the component structure
- Contact the development team

---

**Note**: This frontend is designed to work with the Devkriti Popcorn backend API. Ensure both applications are properly configured and running for full functionality.
