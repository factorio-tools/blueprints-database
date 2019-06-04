#!/bin/bash

# print outputs and exit on first failure
set -xe

echo .travis/SERVER_SSH_KEY >> $HOME/.ssh/known_hosts

if [ $TRAVIS_BRANCH == "master" ] ; then

    # setup ssh agent, git config and remote
    eval "$(ssh-agent -s)"
    ssh-add ./deploy_key
    git remote add deploy "$USER@$IP:/home/sapper/blueprints-app"
    git config user.name "Travis CI"
    git config user.email "travis@factorio.tools"

    # commit compressed files and push it to remote
    rm -f .gitignore
    cp .travis/deployignore .gitignore
    git add .
    git status # debug
    git commit -m "Deploy compressed files"
    git push -f deploy HEAD:refs/heads/master


elif [ $TRAVIS_BRANCH == "staging" ] ; then

    # setup ssh agent, git config and remote
    eval "$(ssh-agent -s)"
    ssh-add ./deploy_key
    git remote add deploy "$USER@$IP:/home/sapper/my-app"
    git config user.name "Travis CI"
    git config user.email "travis@factorio.tools"

    # commit compressed files and push it to remote
    rm -f .gitignore
    cp .travis/deployignore .gitignore
    git add .
    git status # debug
    git commit -m "Deploy compressed files"
    git push -f deploy HEAD:refs/heads/staging

else

    echo "No deploy script for branch '$TRAVIS_BRANCH'"

fi
