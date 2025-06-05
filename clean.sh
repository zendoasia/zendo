#!/bin/sh

# Cleans waste before building so it does not get into uploaded assets on cloudflare

rm -rf ./static
rm -rf ./public/.well-known/appspecific