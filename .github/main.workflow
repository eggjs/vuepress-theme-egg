workflow "Pull Request" {
  on = "pull_request"
  resolves = ["Release"]
}

action "Release" {
  uses = "thonatos/github-actions-release@master"
  args = "actions-release"
  secrets = [
    "GITHUB_TOKEN",
    "NPM_AUTH_TOKEN",
    "RELEASE_SSH_ID_RSA",
    "RELEASE_SSH_ID_RSA_PUB",
    "RELEASE_GIT_USER_NAME",
    "RELEASE_GIT_USER_EMAIL",
  ]
}
