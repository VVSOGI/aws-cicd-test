#!/bin/bash
set -e
cd "$(dirname "$0")"
source ../../.env
source ../.config

# Login
login_response=$(curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "'$EMAIL'", "password": "'$PASSWORD'"}' \
  $URL/auth/login)

accessToken=$(echo $login_response | jq -r '.accessToken')
refreshToken=$(echo $login_response | jq -r '.refreshToken')

echo "Access token: $accessToken"
echo "Refresh token: $refreshToken"

# Profile
profile_response=$(curl -X GET \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $accessToken" \
  $URL/auth/profile)

echo profile_response $profile_response

# Get Google Auth URL
google_url_response=$(curl -X GET \
  -H "Content-Type: application/json" \
  $URL/auth/google)

echo google_url_response $google_url_response

# refresh token
user_id=$(echo $profile_response | jq -r '.id')
echo $user_id

refresh_token_response=$(curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "'$refreshToken'"}' \
  $URL/auth/refresh/$user_id)