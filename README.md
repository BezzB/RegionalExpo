# Regional Climate Expo Website

A comprehensive web application for managing and promoting a Regional Climate Expo event focused on climate change awareness, sustainable agriculture, and environmental conservation in Africa.

## Overview

This platform provides a complete solution for event management, registration, sponsorship, and content management for the Regional Climate Exchange initiative. The application features multiple event types including main events, pre-conference events, gala dinners, gala breakfasts, and special events like the First Lady Marathon for forest conservation.

## Features

### Public Interface
- **Event Showcase**: Browse various climate-focused events with detailed information
- **Event Registration**: Register for different event types
- **Sponsorship Packages**: View and select sponsorship opportunities
- **Gallery**: View images from past and upcoming events
- **Testimonials**: Read participant and stakeholder testimonials
- **Contact Form**: Send inquiries directly to organizers
- **Newsletter Subscription**: Subscribe to event updates

### Admin Dashboard
- **Comprehensive Statistics**: View key metrics and participant data
- **Event Management**: Create, update, and delete events
- **User Management**: Admin account management
- **Gallery Management**: Upload and organize event images
- **Sponsorship Management**: Configure sponsorship tiers and packages
- **Testimonial Management**: Approve and feature testimonials
- **Contact Message Management**: View and respond to inquiries
- **Export Functionality**: Export contact information and registrations

## 🛠️ Tech Stack

| Layer         | Stack                          |
|---------------|--------------------------------|
| Frontend      | Next.js (App Router)           |
| Styling       | Tailwind CSS                   |
| Animation     | Framer Motion, Lottie          |
| Auth          | Supabase Auth                  |
| Database      | Supabase PostgreSQL            |
| File Storage  | Supabase Storage               |
| State/API     | React Query + Supabase SDK     |
| Forms         | React Hook Form + Zod          |
| Icons         | Lucide, Heroicons              |
| Hosting       | c-panel                         |

### 🔒 Admin Dashboard
Login securely via Supabase Auth
- View dashboard metrics (e.g., total events, registrations, messages)
- Add/Edit/Delete:
  - Events
  - Sponsors
  - Testimonials
  - Gallery media
  - Contact messages
- Upload images to Supabase Storage
- Export registrations and messages as CSV

### Frontend
- **HTML/CSS/JavaScript**: Frontend structure and styling
- **Font Awesome**: Icons
- **AOS**: Animation library
- **Slick Carousel**: Content sliders
- **Responsive Design**: Mobile-friendly interface

## Directory Structure

## ⚙️ Project Structure

/
├── app/ # Next.js app directory
│ ├── (public pages)/ # Home, Events, Contact, etc.
│ ├── admin/ # Admin panel routes
├── components/ # Reusable UI components
├── lib/ # Supabase client, API helpers
├── styles/ # Tailwind config + global styles
├── public/ # Static assets
├── .env.local # Environment variables
└── README.md

## Key Pages

### Public Pages
- **Home (index.php)**: Main landing page with event highlights
- **Events (events.php, events_details.php)**: Event listings and details
- **Pre-Conference (pre_conference.php)**: Pre-conference event information
- **Gala Dinner (gala_dinner.php)**: Gala dinner event information
- **Gala Breakfast (gala_breakfast.php)**: Gala breakfast event information
- **First Lady Marathon (first_lady_marathon.php)**: Special marathon event
- **About Us (about_us.php)**: Information about the organization
- **Contact (contact.php)**: Contact form and information
- **Sponsorship (sponsorship.php)**: Sponsorship packages and information

### Admin Pages
- **Dashboard (dashboard.php)**: Overview and statistics
- **Manage Events (manage_events.php)**: Event CRUD operations
- **Manage Users (manage_users.php)**: User management
- **Manage Gallery (manage_gallery.php)**: Image management
- **Manage Sponsors (manage_sponsors.php)**: Sponsor management
- **Manage Testimonials (manage_testimonials.php)**: Testimonial management
- **View Contact (view_contact.php)**: View and manage contact submissions

## Database Schema

The application uses the following database tables:
- `events`: Event details (title, description, date, location)
- `gallery`: Image gallery storage
- `gala_dinner`: Gala dinner event specifics
- `messages`: Contact form submissions
- `newsletter`: Newsletter subscriptions
- `payment_logs`: Payment transaction records
- `registrations`: Event participant registrations
- `sponsors`: Sponsor information
- `sponsorship`: Sponsorship package details
- `testimonials`: User testimonials
- `users`: Admin user accounts


## Usage

### Admin Access
1. Navigate to `/admin/login.php`
2. Log in with administrator credentials
3. Use the dashboard to manage all aspects of the site

### Public Access
1. Navigate to the homepage
2. Browse events, register for activities, and view information
3. Contact organizers through the contact form
4. Subscribe to the newsletter for updates

## Security Notes

- Database credentials should be properly secured
- Admin passwords should follow strong password guidelines
- Regular backups of the database are recommended

## Environmental Focus

This application serves as a platform for promoting climate awareness, sustainable agriculture, and environmental conservation initiatives across Africa, with a particular emphasis on regional climate change mitigation strategies. 