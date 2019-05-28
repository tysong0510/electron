#!/bin/bash
secret=voxpopsecret && \
    time=$(date +%s) && \
    expiry=315360000 && \
    username=$(( $time + $expiry )) && \
    echo username:$username && \
    echo password : $(echo -n $username | openssl dgst -binary -sha1 -hmac $secret | openssl base64)