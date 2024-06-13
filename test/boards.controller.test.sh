#!/bin/bash
set -e
cd "$(dirname "$0")"
source ../.env
source ./.config
source ./auth.controller.test.sh
source ./utils.sh

# findAll boards
findAll() {
    log "INFO" "Starting find all boards process"
    local url=$1

    local response=$(curl -X GET \
    -H "Content-Type: application/json" \
    "$url/boards")

    echo $response | jq '.'
    log "INFO" "Find all boards process completed"
}

# search boards
search() {
    local url=$1
    local query=$2
    
    SEARCH_KEYWORD_ENCODED=$(printf '%s' "$query" | jq -sRr @uri)

    local response=$(curl -s -X GET \
        -H "Content-Type: application/json" \
        "$url/boards/search?keyword=$SEARCH_KEYWORD_ENCODED")
    
    echo "$response" | jq '.'
}

# create board
create() {
    local url=$1 
    local token=$2 

    local curlCommand=(
        curl -s -X POST "$url/boards"
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

# update board
update() {
    local url=$1
    local token=$2
    local boardId=$3

    local curlCommand=(
        curl -s -X PATCH "$url/boards"
        -H "Content-Type: multipart/form-data"
        -H "Authorization: Bearer $token"
        -F "id=$boardId"
        -F "title=$UPDATE_TITLE"
        -F "description=$UPDATE_DESCRIPTION"
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

delete() {
    local url=$1
    local token=$2
    local boardId=$3

    local response=$(curl -s -X DELETE \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $token" \
        "$url/boards/$boardId")
    
    echo "$response"
}

createTest() {
    log "INFO" "Starting create board process"
    loginResponse=$(login $EMAIL $PASSWORD $URL)
    echo $loginResponse
    accessToken=$(echo $loginResponse | jq -r '.accessToken')
    createResponse=$(create $URL $accessToken)
    statusCode=$(echo $createResponse | jq -r '.statusCode')
    
    if (("$statusCode")); then
        log "ERROR" "Create operation failed: $createResponse"
        exit 1
    fi

    searchResponse=$(search $URL $ADDRESS)
    echo $searchResponse | jq '.'
    boardId=$(echo $searchResponse | jq -r '.data[0].id')
    log "INFO" "Delete operation started..."
    deleteResponse=$(delete $URL $accessToken $boardId)
    log "INFO" "Delete operation successful"
    searchResponse=$(search $URL $ADDRESS)

    echo $searchResponse | jq '.'
}

updateTest() {
    log "INFO" "Starting update board process"
    loginResponse=$(login $EMAIL $PASSWORD $URL)
    accessToken=$(echo $loginResponse | jq -r '.accessToken')
    createResponse=$(create $URL $accessToken)
    statusCode=$(echo $createResponse | jq -r '.statusCode')

    if (("$statusCode")); then
        log "ERROR" "Create operation failed: $createResponse"
        exit 1
    fi

    searchResponse=$(search $URL $ADDRESS)
    echo $searchResponse | jq '.'
    log "INFO" "update board started..."
    boardId=$(echo $searchResponse | jq -r '.data[0].id')
    updateResponse=$(update $URL $accessToken $boardId)

    searchResponse=$(search $URL $ADDRESS)
    echo $searchResponse | jq '.'

    log "INFO" "Delete operation started..."
    deleteResponse=$(delete $URL $accessToken $boardId)
    log "INFO" "Delete operation successful"
    searchResponse=$(search $URL $ADDRESS)

    echo $searchResponse | jq '.'
}

createTest