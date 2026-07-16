# Contributing to Frank2Open-Notificaties

Thank you for your interest in contributing! This document provides some basic guidelines.

## Getting Started

Set up your local development environment by following the steps in [README.md](README.md).

## Branching

- Base new branches off `main`
- Use descriptive branch names `42-add-some-feature`
  - Preferably create branches from a GitHub issue, they will automaticly be prefixed with the issue number

## Testing

The project has two layers of testing: Larva integration tests and Bruno API tests.

### Larva (integration tests)

Larva is the Frank!Framework's built-in test tool. Tests live in `src/test/testtool/` and are organised by module (e.g. `Notificaties/`, `Kanalen/`).

**Running tests**

1. Start the application with Frank!Runner (`.\restart.bat` / `./restart.sh`)
2. Open the Frank!Console at `http://localhost:8080`
3. Navigate to **Testing → Larva**
4. Select the scenario folder and click **Run**

Each scenario file (e.g. `scenario01.properties`) describes the steps in plain properties syntax. A `common.properties` file in the same folder defines shared adapter and stub registrations.

**Writing new tests**

- Add `scenarioNN.properties` and a matching `scenarioNN/` folder for supporting files (`request.json`, `response.json`, fixture files, etc.)
- Register any new fixture adapters or stubs in `common.properties`
- Fixture adapters (in `src/main/configurations/Database/`) seed the H2 database into a known state before each scenario
- Keep scenarios independent — always clean and reseed state in steps 1–2

## Making Changes

- Keep pull requests focused — one feature or fix per PR
- Follow the existing naming conventions in the Frank configurations (e.g. camelCase adapter names, kebab-case file names)
- Test your changes locally using Frank!Runner before opening a PR

## Pull Requests

- Reference the related issue in your PR description
- Provide a short summary of what changed and why
- PRs require at least one review before merging

## Issues

Use the GitHub issue tracker to report bugs or propose features. Please check for existing issues before opening a new one.

## Links

- [WeAreFrank!](https://wearefrank.nl/)
- [Frank!Framework](https://frankframework.org/)
- [Frank!Runner](https://github.com/wearefrank/frank-runner)
- [Frank Manual](https://frank-manual.readthedocs.io)
- [Frank Docs](https://frankdoc.frankframework.org)
