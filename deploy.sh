sshpass -p $SP ssh -t $SU@$SH -p $SPP \
  'cd ~/apps/entrybot; git pull origin master; npm i; pm2 restart npm;'
