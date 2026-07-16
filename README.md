# Frank2Open-Notificaties

## Description

This project is a notification component built with the [Frank!Framework](https://frankframework.org/). It is designed to adhere to the [Common Ground](https://commonground.nl/) principles, ensuring that it can be easily integrated and used across various ZGW (Zaakgericht Werken) systems and applications.

## Prerequisites

- Java 11+
- Frank Runner (for running the application locally)
- Docker & Docker Compose (for containerized deployment)
- PostgreSQL 15 (for production) or H2 (for local development)

## Getting Started

### Local Development

First download the Frank!Runner from the [frank-runner GitHub](https://github.com/wearefrank/frank-runner) and place it next to this project.

```
├── frank-runner
│   ├── build.xml
│   └── other-files
└── Notificatie-Component
    ├── build.xml
    └── other-files
```

From the project root in the terminal run:

**Windows:**
```cmd
.\restart.bat
```

**Unix:**
```bash
./restart.sh
```

The application will be available at:
- `http://localhost:8080`

> **Note:** HTTPS is disabled by default because requests from Open Zaak do not reach the NC when HTTPS is enabled. To enable HTTPS, set `application.security.http.transportGuarantee=confidential` in `DeploymentSpecifics.properties`.

### Docker Deployment

To run the application with PostgreSQL using Docker Compose:

```bash
docker-compose up
```

This will start:
- **Frank Application**: Available at `http://localhost:8080`
- **Frank Flow (UI)**: Available at `http://localhost:8080/frank-flow`
- **PostgreSQL Database**: Exposed on host port `5433` (internal: 5432)

### ZGW Integration Stack

`docker-compose-zgw.yaml` spins up a self-contained ZGW environment so the Notificatie Component can be exercised end-to-end against real ZGW APIs:

```bash
docker compose -f docker-compose-zgw.yaml up
```

| Service | Host port | Admin login |
|---|---|---|
| Open Zaak | http://localhost:8001/admin/ | `admin` / `admin` |
| Open Klant | http://localhost:8002/admin/ | `admin` / `admin` |

The Notificatie Component itself is **not** part of this stack — run it separately (via Frank!Runner or `docker-compose.yaml`) on host port `8080`. Both ZGW services reach it via `host.docker.internal:8080`. Port `8000` is reserved for a future Open Notificaties service.

**Demo data seeded on first start**

`DatabaseChangelog.xml` populates the Notificatie Component's database with:

- `jwt_secret` rows for `admin` / `admin`, `open-zaak` / `G2LIVfXal1J93puQkV3O`, and `open-klant` / `open-klant-secret`
- The standard ZGW resource channels (`zaken`, `zaaktypen`, `documenten`, `besluiten`, `besluittypen`, `informatieobjecttypen`, `autorisaties`) plus Open Klant's `internetaken` and `partijen`

Open Zaak's `setup_configuration/data.yaml` registers each of those clients with `heeft_alle_autorisaties: true`, so scope checks succeed for every channel.

Open Klant additionally seeds:
- An API token `a0f0289867093781be61c4962c7314ebe9da6a09` for the Bruno tests under `bruno/Open Klant/`
- A demo `Klantcontact` (UUID `e8442b0c-756d-44df-a61a-fbfd2b3504c4`) and `Actor` (UUID `fe824e27-e5b1-42e6-92c7-db4565a360f9`) via `docker/open-klant/fixtures/demo.json`, so "Create interne taak" runs end-to-end without manual setup

## Configuration Files

| File | Local | Docker | Notes |
|---|:---:|:---:|---|
| `frank-runner.properties` | ✅ | ❌ | Port (`tomcat.connector.port`), FF version |
| `src/main/resources/resources.yml` | ❌ | ✅ | Frank!Framework datasource registration; PostgreSQL credentials use property substitution (`${postgresql.host:-localhost}` etc.) |
| `.env` | ❌ | ✅ | Injected as env vars by Docker Compose — overrides `jdbc.datasource.default`, `PORT`, `nc.api.base-url`, `postgresql.*` credentials, and `nc.zgw.autorisaties-api.root-url` |
| `docker-compose.yaml` | ❌ | ✅ | Notificatie Component stack (app, frank-flow, postgres) |
| `docker-compose-zgw.yaml` | ❌ | ✅ | Optional ZGW integration stack: Open Zaak (`:8001`), Open Klant (`:8002`), shared db/redis/rabbitmq |
| `docker/open-zaak/**` | ❌ | ✅ | Postgres init script, RabbitMQ config, `setup_configuration/data.yaml`, catalogi fixture |
| `docker/open-klant/**` | ❌ | ✅ | Postgres init script, `setup_configuration/data.yaml`, Django demo fixture |
| `Dockerfile` | ❌ | ✅ | Container build |
| `src/main/resources/DeploymentSpecifics.properties` | ✅ | ✅ | Instance properties (`nc.api.base-url`, migrator, auth config) |
| `src/main/resources/credentialprovider.properties` | ✅ | ✅ | Points to the credentials file |
| `src/main/secrets/credentials.properties` | ✅ | ✅ | JWT secrets for Open Zaak — **gitignored**, create manually |
| `src/main/configurations/**` | ✅ | ✅ | All Frank!Framework pipeline logic |
| `src/main/configurations/Database/DatabaseChangelog.xml` | ✅ | ✅ | Liquibase schema + seeded demo data (jwt_secret rows, kanalen) |

## Testing

See [CONTRIBUTING.md](CONTRIBUTING.md) for instructions on running the Larva integration tests.

## Support

No

## Links

- [WeAreFrank!](https://wearefrank.nl/)
- [Frank!Framework](https://frankframework.org/)
- [Frank!Runner](https://github.com/wearefrank/frank-runner)
- [Frank Manual](https://frank-manual.readthedocs.io)
- [Frank Docs](https://frankdoc.frankframework.org)
- [Common Ground](https://commonground.nl/)
- [VNG Realisatie - Common Ground](https://vng.nl/artikelen/common-ground)
- [VNG Realisatie - Notificaties API Standaarden](https://vng-realisatie.github.io/gemma-zaken/standaard/notificaties/redoc-1.0.1)
- [ZGW API Standaarden](https://www.zaakgerichtwerken.nl/)
