const core = require('@actions/core')
const github = require('@actions/github')

const octokit = github.getOctokit(process.env.GITHUB_TOKEN)

const actor = github.context.actor
const org = github.context.repository_owner
const team_slug = core.getInput('team')

async function main() {
  try {
    const res = await octokit.teams.listMembersInOrg({ org, team_slug })

    const usersInTeam = res.data.map(user => user.login)
    
    if (!usersInTeam.includes(actor)) {
      core.setFailed(`Approvals failed: user ${actor} is NOT in team ${team_slug}`)
    }
  } catch (err) {
    core.setFailed(err.message)
  }
}

main()

