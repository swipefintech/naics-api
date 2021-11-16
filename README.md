# naics-api

Scraper and API built on top of data fed from [NAICS](https://www.naics.com/search/).

## Endpoints

Below endpoints are implemented as of now.
Sample requests and responses can be figured out from the included [Postman](postman/naics.postman_collection.json) collection.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/` | For health check purposes |
| `GET` | `/api/codes` | List all codes from database |
| `GET` | `/api/refresh` | Triggers data refresh |

## Usage

First make sure you have [Docker](https://www.docker.com/) installed on your workstation.
To run the project, just clone or download the project and run below command in project directory:

```shell
docker-compose up -d
```

Migrate the database to latest using below command:

```shell
docker-compose exec app ./node_modules/.bin/knex migrate:latest
```

Lastly, trigger a refresh to fetch data from NAICS website using below command:

```shell
curl -X POST "http://localhost:3000/api/refresh"
```

## License

See [LICENSE](LICENSE) file.
