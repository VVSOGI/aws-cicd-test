#!/bin/bash
set -e

# login
login() {
  local email=$1
  local password=$2
  local url=$3

  local response=$(curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"email": "'"$email"'", "password": "'"$password"'"}' \
    "$url/auth/login")

  echo "$response"
}

# profile
get_profile() {
  local accessToken=$1
  local url=$2

  local response=$(curl -X GET \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $accessToken" \
    "$url/auth/profile")

  echo "$response"
}

# Google URL
get_google_auth_url() {
  local url=$1

  local response=$(curl -X GET \
    -H "Content-Type: application/json" \
    "$url/auth/google")

  echo "$response"
}

# refresh token
refresh_token() {
  local refreshToken=$1
  local userId=$2
  local url=$3

  local response=$(curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"refreshToken": "'"$refreshToken"'"}' \
    "$url/auth/refresh/$userId")

  echo "$response"
}
