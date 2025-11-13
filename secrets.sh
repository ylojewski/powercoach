#!/bin/bash
set -euo pipefail

# === CONFIG ===
PROJECT_ID="powercoach"
REGION="europe-west1"
SERVICE_NAME="api"
REPO_NAME="docker-artifacts-repository"
GITHUB="ylojewski/powercoach"
SA_NAME="github-actions-deployer"
POOL_NAME="github-actions-pool"
PROVIDER_NAME="github-actions-provider"

echo "Récupération de toutes les variables pour GitHub Secrets..."
echo "------------------------------------------------------------"


GCP_PROJECT_ID="$PROJECT_ID"
GCP_REGION="$REGION"
GCP_SERVICE="$SERVICE_NAME"
GCP_ARTIFACT_REPOSITORY="$REPO_NAME"

# 5. GCR_API_URL (Cloud Run direct)
GCP_SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
  --project=$PROJECT_ID \
  --region=$REGION \
  --format="value(status.address.url)" 2>/dev/null || echo "NOT_DEPLOYED_YET")

# 6. WIF_SERVICE_ACCOUNT
GCP_SERVICE_ACCOUNT="$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

# 7. WIF_PROVIDER (chemin complet)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
GCP_WIF_PROVIDER="projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/providers/$PROVIDER_NAME"

# === AFFICHAGE FINAL ===
echo ""
echo "Variables prêtes pour GitHub Secrets (copie-colle) :"
echo "------------------------------------------------------------"
echo "GCP_PROJECT_ID=$GCP_PROJECT_ID"
echo "GCP_REGION=$GCP_REGION"
echo "GCP_SERVICE=$GCP_SERVICE"
echo "GCP_SERVICE_URL=$GCP_SERVICE_URL"
echo "GCP_SERVICE_ACCOUNT=$GCP_SERVICE_ACCOUNT"
echo "GCP_ARTIFACTS_REPOSITORY=$GCP_ARTIFACT_REPOSITORY"
echo "GCP_WIF_PROVIDER=$GCP_WIF_PROVIDER"
echo "------------------------------------------------------------"