# File Uploader

[![The Odin Project](https://img.shields.io/badge/The%20Odin%20Project-A9792B?logo=theodinproject&logoColor=fff)](#)

## Overview

This is a project from [The Odin Project](https://theodinproject.com): [Project: File Uploader](https://www.theodinproject.com/lessons/nodejs-file-uploader). In this project, I built a stripped down version of [Google Drive](https://workspace.google.com/products/drive/). This is where we are using Prisma ORM and the [multer middleware](https://github.com/expressjs/multer) for file upload.

## Learning Points

- Understand the benefits of using an Object-Relation Mapping to manipulate a relational database using object-oriented code instead of raw SQL
- Understand the use of the Multer middleware to upload files to a backend web server
- Implemented a cloud-based storage system for uploading files to the database, such as Supabase

## Tech Stack

- [![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
- [![CSS](https://img.shields.io/badge/CSS-1572B6?logo=css3&logoColor=fff)](#)
- [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)
- [![Node.js](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)
- [![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)

## Getting Started

### Prerequisites

You will need to install the latest version of npm and have PostgreSQL set up to get started on using this project

- npm

```sh
npm install npm@latest -g
```

- [PostgreSQL setup](https://www.theodinproject.com/lessons/nodejs-using-postgresql)

### Installation

Getting started on running the express server on your localhost, localhost:3000

1. Cloning the repository

```sh
git clone git@github.com:JohnFerrancol/file-uploader.git
```

2. Navigate to file-uploader folder and install npm packages

```sh
cd file-uploader && npm install
```

3. Set up local environment and fill in DATABASE_URL, Session Secret and the Supabase information

```sh
cp .env.example .env
```

4. Run prisma migrations to create the database tables

```sh
npx prisma migrate dev 
```

5. Generate prisma client

```sh
npx prisma generate
```

6. Running the Express server

```sh
npm run start
```

7. Open in web browser via: http://localhost:3000

## Roadmap

- [x] Add login and register forms to the web application for user authentication using Passport.js and Prisma
- [x] Add a form for authenticated users to upload a file
- [x] Add functionalities to add folders to organise the files
- [x] Add file validation
- [x] Put the files inside a Supabase instead of locally on an uploads folder
