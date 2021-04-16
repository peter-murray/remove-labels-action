# remove-labels-action

A GitHub Action that will remove labels from Issues and Pull Requests.


## Parameters

* `github_token`: A GitHub token for access the Issue or Pull Request, will default to the `GITHUB_TOKEN` for the workflow if not specified.
* `labels`: `required` The labels, comma separated if there are more than one. e.g. "label1, label2, some_other label"
* `repo`: The repository in `<owner>/<repo_name>` form. Will default to the current repository for the workflow if not specified
* `issue_number`: The number for the Issue or Pull Request to remove the labels from, if not specified, the action will attempt to resolve the issue or pulle request number from the context (i.e. the event that triggered the workflow), failing if one cannot be resolved.


## Examples

Ensuring all labels are removed if currently present on an issue from an workflow event for an issue (like issue:
```
- name: Remove all specified labels if present
  uses: peter-murray/remove-labels-action@v1
  with:
    labels: bug, triage, process testing
```


Removing a single label from a specified issue on another repository:
```
- name: Remove bug label
  uses: peter-murray/remove-labels-action@v1
  with:
    github_token: ${{ secrets.OCTODEMO_ACCESS_TOKEN }}
    labels: bug
    repo: octodemo/testing
    issue_number: 1
```
