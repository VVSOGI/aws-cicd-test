#!/bin/bash
set -e
cd "$(dirname "$0")"
source ../.env
source ./.config

# findAll boards
findAll() {
    local url=$1

    local response=$(curl -X GET \
    -H "Content-Type: application/json" \
    "$url/boards")

    echo "$response"
}

# search boards
search() {
    local url=$1
    local query=$2
    
    SEARCH_KEYWORD_ENCODED=$(printf '%s' "$query" | jq -sRr @uri)

    local response=$(curl -X GET \
        -H "Content-Type: application/json" \
        "$url/boards/search?keyword=$SEARCH_KEYWORD_ENCODED")
    
    echo "$response"
}

