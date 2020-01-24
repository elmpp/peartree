#!/bin/bash

if $(npm whoami >/dev/null 2>&1); then
  echo 'Already logged in'
else
  echo "Pword: FzA7Q@,_tERhM;7"
  npm login
fi
