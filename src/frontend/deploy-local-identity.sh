#!/usr/bin/env bash

dfx identity use default

dfx deploy internet_identity

dfx generate internet_identity

sed -i '' /^VITE_IDENTITY_CANISTER_ID/d .env
dfx canister id internet_identity | awk '{print "VITE_IDENTITY_CANISTER_ID="$1}' >> .env
