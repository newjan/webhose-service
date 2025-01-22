# Webhose Service Project Setup

This README provides instructions for setting up and running the Webhose Service project, which includes a Node.js backend and a PostgreSQL database using Docker.

## Prerequisites
Ensure you have the following installed on your machine:
- [Docker](https://www.docker.com/products/docker-desktop) (with Docker Compose)
- [Node.js](https://nodejs.org/) (if running the project locally)
- [Yarn](https://classic.yarnpkg.com/) (if running the project locally)

## Project Structure
- **`Dockerfile`**: Defines the container image for the Node.js backend.
- **`docker-compose.yml`**: Configures the services for the application.
- **`src/`**: Contains the source code for the backend service.
- **`.env`**: Environment variables for the project.

## Setup Instructions

### 1. Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/newjan/webhose-service
cd webhose-service
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory with the following keys:
```env
NODE_ENV=development
PORT=8000
TZ=UTC

# postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=<your_database_name>
POSTGRES_USER=<your_username>
POSTGRES_PASSWORD=<your_password>
WEBZIO_API_KEY=<your_webzio_api_key>
```

### 3. Build and Start Services
Use Docker Compose to build and run the application:
```bash
docker compose up --build
```
This will:
- Build the `webhose-node-backend` image.
- Start the `web` service and the `postgres` service.

### 4. Access the Application
Once the services are running:
- The backend is available at `http://localhost:8000`.
- PostgreSQL is available at `localhost:5432`.

### 5. Run Migrations
Ensure the database is up-to-date with the latest schema:
```bash
docker exec -it webhose-be yarn migration:up
```

### 6. Run Tests
To run tests using Jest, execute the following:
```bash
docker exec -it webhose-be yarn test
```

## Local Development (Without Docker)

### 1. Install Dependencies
Install Node.js dependencies:
```bash
yarn install
```

### 2. Start the Application
Run the application locally:
```bash
yarn dev
```

### 3. Run Tests
Execute tests:
```bash
yarn test
```

## Project Details

### Services
#### Web
- **Image**: `webhose-node-backend`
- **Container Name**: `webhose-be`
- **Command**: `yarn dev`
- **Ports**: `8000:8000`

#### PostgreSQL
- **Image**: `postgres:15`
- **Container Name**: `webhose-postgres`
- **Ports**: `5432:5432`


### Docker Volumes
- **`db_data`**: Persists PostgreSQL data.

### Networks
- **`webhose`**: Bridge network connecting the services.

## Troubleshooting

### Common Issues
1. **Service Not Starting**:
   - Ensure Docker is running.
   - Check the `.env` file for correct environment variables.

2. **Database Connection Error**:
   - Verify `POSTGRES_HOST`, `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` in the `.env` file.

3. **Tests Failing**:
    - Ensure docker web service is running if running using docker
