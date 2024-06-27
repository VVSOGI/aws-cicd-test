#!/bin/bash
set -e
cd "$(dirname "$0")"
. ./common.cfg

login

. ./boards.test.sh