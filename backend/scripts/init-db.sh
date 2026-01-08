#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "postgres" -U "postgres" -d "vibeclip" -c '\q' 2>/dev/null; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready!"

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Database initialization complete!"
