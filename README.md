capstone
========

Git reference
-------------

There are GitHub apps for Mac and Windows available.

- [GitHub for Mac](http://mac.github.com/)
- [GitHub for Windows](http://windows.github.com/)

We will/should be using Vincent Driessen's [Git branching model](http://nvie.com/posts/a-successful-git-branching-model/) (this is a good read for any programmers who want to work in a professional/colloborative environment). It's intuitive for the most part, but I'll try to summarize.

    develop     master
       |          |
       O  <-----  O
       |          |
       O          |
       |          |
       O          |
       |          |
       O  ----->  O
       |          |

(The arrows are merges, the Os are commits. Also, his diagrams are much better.)

There are two named branches:

- The `master` branch, which contains stable, release-worthy code (think major versions of operating systems).
- The `develop` branch, which is what we branch off whenever we want to create new features (think nightly builds) It should contain.

In addition, there are three categories of supporting branches we can create:

- Feature branches
- Release branches
- Hotfix branches

Since we're not working in a production environment where we have to ship code, we're only going to be using feature branches.

When working with multiple people, there are two models of collaborative development:

- Shared repository model
- Fork-and-pull

Because of how small the team is, following the shared repository would allow us to develop faster.


GitHub for Mac instructions
---------------------------

The user interface for GitHub Windows is probably similar enough to the Mac version such that these instructions will be applicable for both.

0. Download and install the GitHub app.

1. Go to the [`develop` branch](https://github.com/razh/capstone/tree/develop) of the repo.

2. Click `Clone in Mac/Windows`.

3. This should open up the GitHub app. Sign in with your credentials if you haven't already done so.

4. Choose where to save the folder.

5. Click on repo when the download is finished.

6. Click on the `Branches` tab.

7. The `develop` branch should be there. Click the `+` to create a new feature branch with your desired name (e.g. `area-weapon` or `sound-manager`). This new branch should now be the current branch.

8. Make a change. Code. Program. Hack.

9. Click on the `Changes` tab.

10. Type in a commit summary. (Provide useful information on the changes you've made!)

11. Click the `+` button with arrows around it and then `Commit and Sync`. You can just click Commit if you don't want to upload your changes just yet, though you'll still have to sync later.

Merging back into the `develop` branch
--------------------------------------

When you're finished programming the feature and you've committed all of your changes, you're now ready to merge back into the `develop` branch.

1. Go to your branch page located at <https://github.com/$USERNAME$/capstone/tree/$FEATURENAME$>.

2. Click on `Pull Request`.

3. Make sure the `base branch` is set to `develop`.

4. Enter a short summary of the feature.

5. Click `Send pull request`.

Assuming there are no major conflicts, your feature should now be in the `develop` branch.

Merging new changes into your personal branch
---------------------------------------------

If there's a branch with some changes that you want in your personal branch, you'll want to merge the changed branch into your personal branch.


Command-line instructions
-------------------------

Getting the repository from GitHub.

    git clone

Branching off from the develop branch to work on something called featureName.

    git checkout -b featureName develop

Merging from the featureName branch back into develop.

    git checkout develop
    git merge --no-ff featureName
    git branch -d featureName
    git push origin develop


Code style
----------

- Make sure you've set your code editor to use Unix line-endings.
- Make sure your code is formatted in a readable manner.
- Comment your code. (Okay, I need to do that.)
