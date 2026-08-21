#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
EMAIL="${1:-smoke+$(date +%s)@example.com}"
PASSWORD="${2:-secret123}"
NAME="${3:-Smoke User}"
COOKIE_JAR="${COOKIE_JAR:-/tmp/inventory-auth-smoke-cookies.txt}"

rm -f "$COOKIE_JAR"

register_status=$(curl -s -o /tmp/inventory-auth-register.json -w "%{http_code}" \
  -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"$NAME\"}")

if [[ "$register_status" != "200" && "$register_status" != "400" ]]; then
  echo "Register failed unexpectedly with status $register_status"
  cat /tmp/inventory-auth-register.json
  exit 1
fi

login_status=$(curl -s -o /tmp/inventory-auth-login.json -w "%{http_code}" -c "$COOKIE_JAR" \
  -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")

if [[ "$login_status" != "200" ]]; then
  echo "Login failed with status $login_status"
  cat /tmp/inventory-auth-login.json
  exit 1
fi

session_status=$(curl -s -o /tmp/inventory-auth-session.json -w "%{http_code}" -b "$COOKIE_JAR" \
  "$BASE_URL/api/auth/session")

if [[ "$session_status" != "200" ]]; then
  echo "Session check failed with status $session_status"
  cat /tmp/inventory-auth-session.json
  exit 1
fi

echo "Auth smoke test passed"
echo "Email: $EMAIL"
