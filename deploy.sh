#!/bin/bash
ssh $SU@$SH -p $SPP  \
  '. ~/.nvm/nvm.sh; cd ~/apps/entrybot; git checkout .; git pull origin master; npm ci; pm2 restart npm;'
