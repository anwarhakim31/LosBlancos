<div align="center">
  <h1>LosBlancos</h1>
  <p>E-commerce</p>
</div>

![School Management System](https://github.com/user-attachments/assets/1a004898-ce13-4ef0-bd46-9c8dfcea15db)

## About

LosBlancos is a cutting-edge e-commerce platform designed to offer a seamless shopping experience while empowering store administrators with a robust Content Management System (CMS). The platform integrates a secure payment gateway for smooth transactions and includes real-time shipping cost calculation, ensuring customers can easily view the total price before completing their purchase.

LosBlancos enhances user interaction with a dynamic real-time dashboard, giving administrators instant insights into crucial activities such as stock availability and new customer orders. The platform's notification system promptly alerts administrators when a product is out of stock or when a new order is placed, ensuring efficient management and timely responses.


## The dependencies that this project uses:

_Frontend_

-scss: for stayling

-React Hook Form: For Form validation

-axios-interceptors: For making HTTP requests

-rechart js: For making chart

-Redux Toolkit : For State management feature

-next-auth : For authentication

-Sonner : For toast notification

-socket.io : For real time dashboard

-lucide: icon

_Backend_

-express: For creating the server

-mongoose: For interacting with MongoDB

-bcryptjs: For hashing passwords

-jsonwebtoken: For authentication

-next-auth:For authencatication 

-cloudinary: for upload image

-midtrans: for payment gateway

-nodemailer: for send email

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js: [Download and install Node.js](https://nodejs.org/)
- npm: Node.js package manager (comes with Node.js installation)

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/anwarhakim31/LosBlancos.git
   ```

2. Navigate to root project directory and install depedencies:

   ```bash
   cd LosBlancos
    npm install
   ```
3. Navigate to socket-server directory and install depedencies

   ```bash
   cd socket-server
   npm install
   ```

## Setup Environment

1. Create a .env file in the root next.js of your project.

NEXT_PUBLIC_PROCESS = development

DATABASE_URL = 

NEXTAUTH_SECRET = 

NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_BASE_URL = /api

GOOGLE_OAUTH_CLIENT_ID =

GOOGLE_OAUTH_CLIENT_SECRET = 

NEXT_PUBLIC_CLOUD_PRESET = 

NEXT_PUBLIC_CLOUD_NAME = 

NEXT_PUBLIC_CLOUD_APIKEY =

NEXT_PUBLIC_CLOUD_SECRETKEY = 

//binderbyte untuk mengambil provinsi, kota
BINDERBYTE_KEY = 

RAJAONGKIR_KEY = 

MIDTRANS_SECRET_SERVER_KEY = 

MIDTRANS_BASE_URL = https://api.sandbox.midtrans.com/v2

NEXT_PUBLIC_SOCKET_URL = http://localhost:4000

NEXT_PUBLIC_DOMAIN = http://localhost:3000

EMAIL_ADMIN = 

PASSWORD_APLIKASI_EMAIL  =



2. Create a .env file in the server-socket of your project.
   
ORIGIN = http://localhost:3000

MONGODB_URL =

## Development

1. To start the root , run:

   ```bash
   npm run dev
   ```

2. To start the socket-server run :

   ```bash
   npm run dev
   ```

## Deployment

Deploy the `dist` directory to your hosting platform of choice.
