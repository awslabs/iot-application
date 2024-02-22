# EdgeLogin

`EdgeLoginModule` extends Core with the `/edge-login` REST API.

This module is for calling the `/authenticate` endpoint of a SiteWise Edge Gateway. The endpoint does not have CORS support, so this endpoint is used to proxy the call from the client.