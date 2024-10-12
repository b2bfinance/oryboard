#!/usr/bin/env sh

# You will need oapi-codegen
# go install github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest

oapi-codegen -generate "types,server,spec" -package api apispec.yaml > pkg/api/spec.gen.go
