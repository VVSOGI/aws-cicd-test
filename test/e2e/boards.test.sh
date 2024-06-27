#!/bin/bash
set -e
. ./.config

TITLE "게시물 생성"
POST /boards \
    -H "Content-Type: multipart/form-data" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "title=$TITLE" \
    -F "description=$DESCRIPTION" \
    -F "address=$ADDRESS" \
    -F "activityDate[]=MON" \
    -F "activityDate[]=TUE" \
    -F "activityTime[]=MORNING" \
    -F "activityTime[]=AFTERNOON"

TITLE "모든 게시물 조회"
GET /boards \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

SELECTED_BOARD=$(echo $BODY | jq -r '.data[] | select(.title == "cURL-test1")')
SELECTED_BOARD_ID=$(echo $SELECTED_BOARD | jq -r '.id' | head -n 1)

TITLE "게시물 상세 조회"
GET /boards/$SELECTED_BOARD_ID \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

TITLE "게시물 수정"
PATCH /boards \
    -H "Content-Type: multipart/form-data" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -F "id=$SELECTED_BOARD_ID" \
    -F "title=$UPDATE_TITLE" \
    -F "description=$UPDATE_DESCRIPTION" \
    -F "address=$UPDATE_ADDRESS" \
    -F "activityDate[]=MON" \
    -F "activityDate[]=TUE" \
    -F "activityTime[]=MORNING" \
    -F "activityTime[]=AFTERNOON"

TITLE "게시물 수정 확인"
GET /boards/$SELECTED_BOARD_ID \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

TITLE "게시물 삭제"
DELETE /boards/$SELECTED_BOARD_ID \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

TITLE "게시물 삭제 확인"
GET /boards \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

DELETE_BOARD=$(echo $BODY | jq -r '.data[] | select(.id == "'$SELECTED_BOARD_ID'")')

if [[ -z "$DELETE_BOARD" ]]; then
    echo "게시물 삭제 성공"
else
    echo "게시물 삭제 실패"
fi