FROM python:3.11-slim

# Install Node.js for lunar-javascript validation
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install lunar-javascript globally
RUN npm install -g lunar-javascript

WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY src/ ./src/
COPY scripts/ ./scripts/

# Create data directories
RUN mkdir -p data/raw data/processed data/validated data/export

# Default command
CMD ["python", "scripts/scrape_year.py", "2025", "--output", "data/export"]
