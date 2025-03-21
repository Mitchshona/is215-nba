FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file from the docker folder into the container
COPY docker/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the files from the app directory to the container's /app directory
COPY app/ .

# Copy the files from the model directory to the container's /model directory
WORKDIR /model
COPY model/ .

# For debugging: list files after copying
RUN ls -la

# Expose the port and define the command to run the app
WORKDIR /app

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8080", "main:app"]
