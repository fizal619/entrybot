#!/bin/bash
ssh pi@fizal.mynetgear.com -p 4001  \
  '. ~/.nvm/nvm.sh; cd ~/apps/entrybot; git pull origin master; npm i; pm2 restart npm;'
