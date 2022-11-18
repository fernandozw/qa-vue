#!/usr/bin/env bash
set -o errexit

function print()
{
    echo `date "+%Y-%m-%d %H:%M:%S"` " -- " $@
}

function send_reliao_message()
{
    curl --location --request POST "http://api.kunlun.qiyi.domain/hotchat" \
    --header "Content-Type: application/x-www-form-urlencoded" \
    --data "tos=$1&content=$2"
}
