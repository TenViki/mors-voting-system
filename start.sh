#!/bin/sh
set -e

DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}

echo "Waiting for database at $DB_HOST:$DB_PORT..."
while ! nc -z $DB_HOST $DB_PORT; do
  echo "Waiting for $DB_HOST:$DB_PORT..."
  sleep 1
done

echo "Database reachable, running migrations..."
yarn prisma migrate deploy --schema=prisma/schema.prisma

echo "Starting server"
exec npm run start
