# Trendz Furnishing — Premium Upholstery & Custom Furniture Website

A premium portfolio, product showcase, and enquiry management website built for an upholstery and custom furniture business.

The platform combines a modern public-facing website with a powerful admin dashboard, allowing the business owner to manage website content, projects, enquiries, images, services, and other business information without modifying the source code.

### Technology Stack

* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Express
* **Database:** MongoDB
* **Authentication:** JWT
* **Image Management:** Cloudinary
* **Animations:** Framer Motion
* **Icons:** Lucide React

## Project Structure

```text
client/   React + Vite + Tailwind CSS frontend
          Public website and admin dashboard

server/   Express + MongoDB backend
          REST API, authentication, uploads, and database management
```

## Getting Started

### 1. Install Dependencies

Install the dependencies for the root project, frontend, and backend:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 2. Configure Environment Variables

Create the server environment file from the provided example:

```bash
cp server/.env.example server/.env
```

Configure the following variables:

| Variable                | Description                               |
| ----------------------- | ----------------------------------------- |
| `PORT`                  | API server port. Defaults to `5000`.      |
| `MONGO_URI`             | MongoDB connection string.                |
| `JWT_SECRET`            | Secret key used for JWT authentication.   |
| `CLIENT_URL`            | Frontend URL used for CORS configuration. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name. Optional.          |
| `CLOUDINARY_API_KEY`    | Cloudinary API key. Optional.             |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. Optional.          |

Cloudinary is optional. If Cloudinary credentials are not provided, uploaded images are stored locally in:

```text
server/uploads/
```

The frontend uses the same image API regardless of which storage option is configured.

### 3. Start MongoDB

Make sure MongoDB is running locally.

The default database connection is:

```text
mongodb://127.0.0.1:27017/trendz-upholstery
```

Alternatively, update `MONGO_URI` to use a hosted MongoDB database.

### 4. Seed Initial Data

Run the seed script to create the initial website content and administrator account:

```bash
npm run seed
```

The seed process creates:

* Default admin account
* Placeholder projects
* Services
* Categories
* Testimonials
* Collections
* Materials
* Website settings

### 5. Start the Application

Run the development environment:

```bash
npm run dev
```

The application will be available at:

* **Website:** `http://localhost:5173`
* **API:** `http://localhost:5000`

## Admin Dashboard

The admin dashboard is available at:

```text
http://localhost:5173/admin/login
```

### Default Login

```text
Email:    admin@trendz.com
Password: *********
```

For security, change the default password immediately after the first login from the **Settings** page.

### Admin Features

The dashboard allows the business owner to manage the website without editing code.

#### Project Management

* Create and edit projects
* Upload project images
* Drag and drop images
* Add before/after images
* Mark projects as featured
* Publish or unpublish projects

#### Content Management

* Services
* Collections
* Materials
* Categories
* Testimonials
* Gallery content
* Website settings

#### Enquiry Management

* View customer enquiries
* Review enquiry details
* Update enquiry status
* Add internal notes
* Track enquiries through different stages

Available enquiry statuses include:

```text
New
Contacted
Quotation Sent
In Progress
Completed
Closed
```

## Enquiries

Customer quote requests submitted through the website are stored in MongoDB and made available through the **Enquiries** section of the admin dashboard.

Administrators can update each enquiry as it progresses through the sales process and add private internal notes for follow-up and management.

## Image Uploads

The application supports Cloudinary for production-ready image management.

When Cloudinary is configured:

* Images are uploaded directly to Cloudinary
* MongoDB stores image URLs and metadata
* Responsive image transformations can be generated
* WebP and optimized image formats can be used
* Thumbnail and responsive image sizes are supported

When Cloudinary is not configured, images are stored locally in `server/uploads/` and served through the Express API.

## Deployment

### Build the Frontend

Create a production build with:

```bash
npm run build
```

The compiled frontend is generated in:

```text
client/dist
```

### Production Options

The application can be deployed in either of the following configurations:

1. **Single-server deployment**

   * Express serves the compiled React application from `client/dist`
   * Express also provides the backend API

2. **Separate deployment**

   * Deploy the React frontend independently
   * Deploy the Express API separately
   * Configure `CLIENT_URL` and the frontend API URL accordingly

For production deployments, use a hosted MongoDB instance and configure Cloudinary for reliable image storage and optimization.

## Security Recommendations

Before deploying the application publicly:

* Change the default admin password
* Use a strong, unique `JWT_SECRET`
* Keep database credentials private
* Keep Cloudinary credentials private
* Configure `CLIENT_URL` correctly
* Never commit `.env` files to version control
* Use HTTPS in production

## License

This is a private project.

**All rights reserved.**
