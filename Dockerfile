# Start with an image containing node.js pinned to the version we are using for development.
FROM node:20.13.1-alpine3.19 as build-stage

# I like to always use a non-standard working directory. My favorite at the moment is `/app`
WORKDIR /app

# Copy in our `package.json` and `package-lock.json`
COPY ./frontend/package*.json ./

# Install the packages we need to build our frontend
RUN npm ci

# Copy in the rest of our frontend code
COPY ./frontend .

# Build the frontend
RUN npm run build

# Start a new image
FROM python:3.12-alpine3.19 as dist

WORKDIR /app

# Copy in our `requirements.txt`
COPY ./backend/requirements.txt requirements.txt
# Install our python dependencies
RUN pip install --no-cache-dir -r requirements.txt

COPY ./backend .

# Copy the assets folder from the build stage
COPY --from=build-stage /app/dist /app/static

# Set the default command to be ran when starting the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]