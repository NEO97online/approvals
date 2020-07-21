const core = require('@actions/core')
const github = require('@actions/github')

const octokit = github.getOctokit(process.env.GITHUB_TOKEN)

const actor = github.context.actor
const org = github.context.repository_owner
const team_slug = core.getInput('team')

core.debug(`actor: ${actor}`)
core.debug(`org: ${org}`)
core.debug(`team_slug: ${team_slug}`)

async function main() {
  try {
    const res = await octokit.teams.listMembersInOrg({ org, team_slug })

    const usersInTeam = res.data.map(user => user.login)
    
    if (!usersInTeam.includes(actor)) {
      core.setFailed(`Approvals failed: user ${actor} is NOT in team ${team_slug}`)
    }
  } catch (err) {
    if (err.message = 'Not Found') {
      core.setFailed(`Team ${team_slug} not found. Make sure the team exists in your organization.`)
      return
    }
    core.setFailed(err.message)
  }
}

main()

