docker buildx build --platform linux/amd64 -t gcr.io/ccarse/leaderboard .
# docker build -t gcr.io/ccarse/leaderboard .
docker push gcr.io/ccarse/leaderboard
kubectl apply -f "./leaderboard-deployment.yaml"
kubectl set image deployment leaderboard-deployment leaderboard=$(docker inspect --format='{{index .RepoDigests 0}}' gcr.io/ccarse/leaderboard:latest)