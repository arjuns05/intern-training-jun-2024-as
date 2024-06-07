#!/usr/bin/env bash

set -euo pipefail

if [[ $(gcloud config get-value project) != 'cp-sandbox-joseph-jeff705' ]]; then
 echo "Please set your gcloud project to cp-sandbox-joseph-jeff705"
 echo "gcloud config set project cp-sandbox-joseph-jeff705"
 echo "gcloud auth application-default set-quota-project cp-sandbox-joseph-jeff705 || gcloud auth application-default login"
 exit 1
fi

REGISTRY=us-east4-docker.pkg.dev/cp-artifact-registry/intern-training
SERVICE=aas
IMAGE="$REGISTRY/$SERVICE"

docker buildx build --platform linux/amd64 -t "$IMAGE" .
docker push "$IMAGE"

gcloud run deploy "$SERVICE" \
 --image "$IMAGE" \
 --region us-east4 \
 --no-allow-unauthenticated \
 --network=default \
 --subnet=default \
 --vpc-egress all-traffic \
 --set-env-vars OPENAI_API_URL=https://external.api.dev.ai-hub.colpal.cloud \
 --ingress internal-and-cloud-load-balancing \
 --port 8000
