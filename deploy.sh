#!/bin/bash
ssh $SU@$SH -p $SPP  << EOF
. ~/.nvm/nvm.sh
cd ~/apps/entrybot
git checkout .
git pull origin master | grep package.json
test $? -ne 0 && npm ci
pm2 restart entry
EOF
