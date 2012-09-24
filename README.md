capstone
========

Git reference
-------------

There are GitHub apps for Mac and Windows available. Download links follow:

- [GitHub for Mac](http://mac.github.com/)
- [GitHub for Windows](http://windows.github.com/)

We will/should be using Vincent Driessen's [Git branching model](http://nvie.com/posts/a-successful-git-branching-model/) (this is a good read for any programmers who want to work in a professional/colloborative environment). It's intuitive for the most part, but I'll try to summarize.

    develop     master
       |          |
       O  <-----  O
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


    develop     master
       |          |
       O  <-----  O
       |          |
       O          |
       |          |
       O  ----->  O
       |          |


Feature branches are what you're going to be working on most of the time.


As for hotfix branches, we will not have to use them hopefully.


GitHub for Mac instructions
---------------------------

The user interface for GitHub Windows is probably similar enough to the Mac version such that these instructions will be applicable for both.

1. Choose the `develop` branch.

2. Press `Clone in Mac/Windows`.

Command-line instructions
-------------------------

Branching off from the develop branch to work on something called featureName.

    git checkout -b featureName develop

Merging from the featureName branch back into develop.
