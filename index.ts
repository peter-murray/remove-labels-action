import * as github from '@actions/github';
import * as core from '@actions/core';
import { inspect } from 'util';

async function run() {
  try {
    await exec();
  } catch (err) {
    core.debug(inspect(err))
    core.setFailed(err);
  }
}
run();


async function exec(): Promise<void> {
  const labels = getLabels();

  if (labels.length === 0) {
    core.info('No labels specified to remove, nothing to do.');
  } else {
    const octokit = github.getOctokit(getRequiredInput('github_token'));
    const repo = getRepository();
    const issueNumber: number =  getIssueNumber();

    const promises: Promise<void>[] = [];
    labels.forEach(label => {
      promises.push(removeLabel(octokit, repo, issueNumber, label));
    })

    await Promise.all(promises);
  }
}

function removeLabel(octokit, repo, issueNumber: number, label: string): Promise<void> {
  return octokit.issues.removeLabel({
    ...repo,
    issue_number: issueNumber,
    name: label
  })
  .catch(err => {
    // Ignore errors that provide the label is not there
    if (err.status !== 404 || err.status !== 410) {
      throw err;
    }
  });
}

function getRepository() {
  const input = core.getInput('repo');

  if (input) {
    const [owner, repo] = getRequiredInput('repo').split('/');
    if (!owner || ! repo) {
      throw new Error(`Invalid repo value supplied '${input}', must be of the <owner/<name> format`);
    }
    return {
      owner: owner,
      repo: repo
    };
  } else {
    return github.context.repo;
  }
}

function getIssueNumber(): number {
  const input = core.getInput('issue_number');

  if (input) {
    const value = parseInt(input);
    if (value === NaN) {
      throw new Error(`Invalid issue number provided: '${input}'`);
    }
    return value;
  } else {
    const issueNumber = github.context.issue.number;
    if (! issueNumber) {
      throw new Error(`A issue number could not be obtained from the workflow event`);
    }
    return issueNumber;
  }
}

function getRequiredInput(name: string): string {
  return core.getInput(name, {required: true});
}

function getLabels(): string[] {
  const labelsInput = getRequiredInput('labels');
  const values = labelsInput.split(',');

  return values.map(val => val.trim()).filter(val => val.length > 0);
}
