#!/bin/bash
set -e

# SSHで接続したサーバー内で行いたい処理を書く
echo "Deploy start..."

cd ~/broadcast-ws

# 最新ビルドをコピー（or git pullでもOK）
git pull origin main
npm install
pm2 restart broadcast-ws

echo "Deploy complete!"
