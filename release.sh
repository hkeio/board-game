git push --follow-tags
git fetch
git pull
git checkout main
git fetch
git pull
git merge develop
git push
git checkout develop
(cd dist/hex-board && npm publish)
