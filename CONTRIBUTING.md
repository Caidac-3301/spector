# How to contribute

I'm really glad you're reading this, because we need volunteer developers to help this project come to fruition.

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.
    
## Pull Request Process

1. Ensure any unused dependencies are removed before creating the pull request.
2. Please create pull request with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)). 
3. When you send a pull request, we will love you forever if you include examples and demo. We can always use more tests. 
4. Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    ```shell
    $ git commit -m "A brief summary of the commit
    > 
    > A paragraph describing what changed and its impact."
    ```
5. Update the `README.md` or `docs/` with details of changes, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
6. Increase the version numbers in any examples files and the README.md to the new version that this
   Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
7. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.
8. Please follow our coding conventions (below) and make sure all of your commits are atomic (one feature per commit).

## Coding conventions

Start reading our code and you'll get the hang of it. We optimize for readability:

  * We indent using four spaces (soft tabs)
  * We make sure linters and test cases are always passing.
  * We avoid logic in views, putting HTML generators into helpers
  * We ALWAYS put spaces after list items and method parameters (`[1, 2, 3]`, not `[1,2,3]`), around operators (`x += 1`, not `x+=1`), and around hash arrows.
  * This is open source software. Consider the people who will read your code, and make it look nice for them. It's sort of like driving a car: Perhaps you love doing donuts when you're alone, but with passengers the goal is to make the ride as smooth as possible.

Thanks,
Risabh Kumar
