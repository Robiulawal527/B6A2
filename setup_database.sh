#!/bin/bash
set -e

echo "Checking for Homebrew..."
if ! command -v brew &> /dev/null; then
    echo "Homebrew is not installed. Please install Homebrew first."
    exit 1
fi

echo "Installing PostgreSQL..."
brew install postgresql || echo "PostgreSQL might already be installed"

echo "Starting PostgreSQL Service..."
brew services start postgresql

echo "Waiting for PostgreSQL to start..."
sleep 5

echo "Creating Database 'vrs_db'..."
createdb vrs_db || echo "Database 'vrs_db' might already exist"

echo "Database setup complete!"
echo "You can now run 'npx prisma migrate dev' to setup the schema."
