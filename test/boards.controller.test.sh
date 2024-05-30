#!/bin/bash
set -e
cd "$(dirname "$0")"
source ../.env
source ./.config
source ./auth.controller.test.sh

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

# create board
create() {
    local url=$1 
    local token=$2 

    local curlCommand=(
        curl -X POST "$url/boards"
        -H "Content-Type: multipart/form-data"
        -H "Authorization: Bearer $token"
        -F "title=$TITLE"
        -F "description=$DESCRIPTION"
        -F "address=$ADDRESS"
    )

    for date in "${ACTIVITY_DATE[@]}"; do
        curlCommand+=(-F "activityDate[]=$date")
    done

    for time in "${ACTIVITY_TIME[@]}"; do
        curlCommand+=(-F "activityTime[]=$time")
    done

    curlCommand+=(-F "file=")

    local response=$("${curlCommand[@]}")
    echo "$response"
}