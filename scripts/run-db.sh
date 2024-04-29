#!/bin/bash
set -e
cd "$(dirname "$0")"
source ../.env

docker run \
  --name $DB_CONTAINER_NAME \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_USER=$DB_USERNAME \
  -e POSTGRES_DB=$DB_DATABASE \
  -v $DB_VOLUME_NAME:/var/lib/postgresql/data \
  -p $DB_PORT:5432 \
  -d postgres

# 준비 상태 확인을 위한 스크립트
echo "Waiting for PostgreSQL server [$DB_CONTAINER_NAME] to start."
while ! docker exec $DB_CONTAINER_NAME pg_isready -U $DB_USERNAME -d $DB_DATABASE -h localhost > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing command"
docker exec -i $DB_CONTAINER_NAME psql -U $DB_USERNAME -d $DB_DATABASE -c '\dt'
