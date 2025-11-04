FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy project
COPY . .

# Create necessary directories
RUN mkdir -p /app/staticfiles /app/media /app/logs

# Collect static files (will be overridden by docker-compose command)
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Run gunicorn
CMD ["gunicorn", "soutrali.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120"]
