# Health

`HealthModule` extends the Core System to add the `/health` endpoint.

When `GET /health HTTP/1.1` is requested by the client, application status
information is returned.

When the application is healthy, the client is returned:

```
HTTP/1.1 200 OK

{
  "status": "ok",
  "info": {
    "core": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "core": {
      "status": "up"
    } 
  }
}
```

When the application is not healthy, the application is returned:

```
HTTP/1.1 503 Service Unavailable
```
