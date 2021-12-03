docker buildx build --platform linux/amd64 -t gcr.io/ccarse/leaderboard-api .
docker push gcr.io/ccarse/leaderboard-api
kubectl apply -f "./leaderboard-api-deployment.yaml"
kubectl set image deployment leaderboard-api-deployment leaderboard-api=$(docker inspect --format='{{index .RepoDigests 0}}' gcr.io/ccarse/leaderboard-api:latest)