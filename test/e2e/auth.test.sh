#!/bin/bash
set -e
. ./.config

TITLE "프로필 조회"
GET /auth/profile \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN"

USER_ID=$(echo $BODY | jq -r '.id')

TITLE "구글 로그인 URL 조회"
GET /auth/google \
    -H "Content-Type: application/json"

TITLE "토큰 갱신"
GET /auth/refresh/$USER_ID \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $REFRESH_TOKEN"