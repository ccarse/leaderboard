npm i
npm run build
docker build -f Dockerfile.workaround -t gcr.io/ccarse/leaderboard . 
docker push gcr.io/ccarse/leaderboard
kubectl apply -f "./leaderboard-deployment.yaml"
kubectl set image deployment leaderboard-deployment leaderboard=$(docker inspect --format='{{index .RepoDigests 0}}' gcr.io/ccarse/leaderboard:latest)