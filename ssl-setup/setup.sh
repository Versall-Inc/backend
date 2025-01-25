#!/bin/bash

echo "Starting complete SSL setup..."

# Define variables
DOMAIN="172.105.99.198.nip.io"
EMAIL="lhlrahman@gmail.com"  # Replace this with your email

# Clean up any existing setup
docker-compose down -v &>/dev/null
rm -rf certbot nginx

# Create directory structure with proper permissions
mkdir -p certbot/conf/{live,archive,renewal}
mkdir -p certbot/www/.well-known/acme-challenge
mkdir -p nginx/conf.d
chmod -R 755 certbot/www
chmod -R 700 certbot/conf

# Create nginx configuration
cat > nginx/conf.d/default.conf << 'NGINX_CONF'
server {
    listen 80;
    listen [::]:80;
    server_name 172.105.99.198.nip.io;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files $uri =404;
    }

    location / {
        return 200 'Nginx is working - Ready for SSL!';
        add_header Content-Type text/plain;
    }
}
NGINX_CONF

# Create docker-compose configuration
cat > docker-compose.yml << 'DOCKER_CONF'
services:
  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    networks:
      - ssl-network
    command: "/bin/sh -c 'nginx -g \"daemon off;\"'"

  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    networks:
      - ssl-network

networks:
  ssl-network:
    name: ssl-network
DOCKER_CONF

# Start Nginx
echo "Starting Nginx..."
docker-compose up -d nginx

# Wait for Nginx to start
echo "Waiting for Nginx to start..."
sleep 5

# Test Nginx configuration
echo "Testing Nginx configuration..."
docker-compose exec nginx nginx -t

# Test ACME challenge directory
echo "Testing ACME challenge directory..."
curl -I http://$\{DOMAIN\}/.well-known/acme-challenge/test-file

# Request the certificate
echo "Requesting SSL certificate from Let's Encrypt..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email ${EMAIL} \
    --agree-tos \
    --no-eff-email \
    --staging \
    --force-renewal \
    -d ${DOMAIN}

echo "Setup complete! You can test the configuration at:"
echo "http://${DOMAIN}"
