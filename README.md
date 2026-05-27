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

## Configuration Files

| File | Local | Docker | Notes |
|---|:---:|:---:|---|
| `frank-runner.properties` | ✅ | ❌ | Port (`tomcat.connector.port`), FF version |
| `src/main/resources/resources.yml` | ❌ | ✅ | Frank!Framework datasource registration; PostgreSQL credentials use property substitution (`${postgresql.host:-localhost}` etc.) |
| `.env` | ❌ | ✅ | Injected as env vars by Docker Compose — overrides `jdbc.datasource.default`, `PORT`, `nc.api.base-url`, `postgresql.*` credentials, and `nc.zgw.autorisaties-api.root-url` |
| `docker-compose.yaml` | ❌ | ✅ | Service orchestration (app, frank-flow, postgres) |
| `Dockerfile` | ❌ | ✅ | Container build |
| `src/main/resources/DeploymentSpecifics.properties` | ✅ | ✅ | Instance properties (`nc.api.base-url`, migrator, auth config) |
| `src/main/resources/credentialprovider.properties` | ✅ | ✅ | Points to the credentials file |
| `src/main/secrets/credentials.properties` | ✅ | ✅ | JWT secrets for Open Zaak — **gitignored**, create manually |
| `src/main/configurations/**` | ✅ | ✅ | All Frank!Framework pipeline logic |

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
