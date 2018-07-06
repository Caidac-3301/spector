# Spector

Open source alternative to monitor, debug and improve your Lambda Functions.

Spector will make use of AWS APIs to fetch data from your AWS account and produce actionable metrics and detailed data without the need of editing any code!

> *You will need to provide Spector with read access to your AWS account to collect the data.*

## What will it do?

* Spector will periodically poll your AWS account for data and save everything to the local database.

* After importing the logs, an **aggregator** will start and go through all imported data and extract metrics by each invocation. The Aggregator will detect the result, duration, memory usage and other meaningful information about the invocation.

* Spector will also detect errors from invocations and show them in the UI for you to see and debug.

## Security?

This will be provided as a customizable docker image for you to host, or run locally.
No data will be sent to any remote servers for any reasons, to uphold maximum security.

## What about overhead?

Spector will get all of the information from logs when they reach AWS CloudWatch, meaning that the service will have no effect on the code execution itself.

# Development

### Requirements

* Docker
* Editor of your choice
* Yup, that's it!

### Installation

* Clone the repo: `git clone https://github.com/Caidac-3301/spector.git`
    * The [wiki](https://github.com/Caidac-3301/spector/wiki) is made available in the repo as `docs/` with help of [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules).
    * Either pass `--recurse-submodules` flag with the above `git clone` command,
    * Or run `git submodule init` and `git submodule update` separately after cloning
    * This is optional, in case you don't need the docs.
* Run `docker-compose up`
* Visit http://localhost:3000/
* Play with it

### Developer Notes

Dev environment is set up in a way to watch over your files, copy it to the container, compile it and run it. Simply run `docker-compose up` to start the container. Additionally you may pass `-d` flag to start in detached mode. Read more [here](https://docs.docker.com/v17.09/compose/reference/up/).

Any change you make to your local file will be reflected to the container immediately.
**Currently the changes to `package.json` is not reflected without rebuilding the image.** *This will be fixed in the upcoming commits soon.*

### Rebuilding the images

After adding new npm packages, you will have to rebuild your images as follows:

* docker-compose stop
* docker-compose rm
* docker-compose up --build

### Add new npm packages directly:

```shell
docker-compose run app npm install <package-name> --save
```

## Todo

- [ ] Get Logs from AWS (Prototype)
- [ ] Dockerize PostgreSQL
- [ ] Implement initial models
- [ ] Implement a basic Aggregator
- [ ] Implement Project view
- [ ] Implement Function view
- [ ] Implement Invocation view