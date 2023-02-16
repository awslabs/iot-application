import { DashboardsHttp } from './dashboards.http';
import { HttpClient } from './interfaces/http.interface';

const createHttpClient = () => {
  return {
    get: jest.fn().mockResolvedValue({ data: undefined }),
    post: jest.fn().mockResolvedValue({ data: undefined }),
    put: jest.fn().mockResolvedValue({ data: undefined }),
    delete: jest.fn().mockResolvedValue({ data: undefined }),
  } as unknown as HttpClient;
};

const createFailingHttpClient = () => {
  return {
    get: jest.fn().mockRejectedValue({ data: undefined }),
    post: jest.fn().mockRejectedValue({ data: undefined }),
    put: jest.fn().mockRejectedValue({ data: undefined }),
    delete: jest.fn().mockRejectedValue({ data: undefined }),
  } as unknown as HttpClient;
};

const createDashboardsHttpClient = (httpClient: HttpClient) => {
  return new DashboardsHttp(httpClient);
};

describe('DashboardsHttp', () => {
  it('can be instantiated', () => {
    const http = createHttpClient();
    const client = createDashboardsHttpClient(http);

    expect(client).not.toBe(null);
  });

  it('lists dashboards', async () => {
    const http = createHttpClient();
    const client = createDashboardsHttpClient(http);

    await client.list();

    expect(http.get).toHaveBeenCalled();
  });

  it('fails to list dashboards', async () => {
    const http = createFailingHttpClient();
    const client = createDashboardsHttpClient(http);

    await expect(client.list()).rejects.toThrow();
  });

  it('creates a dashboard', async () => {
    const http = createHttpClient();
    const client = createDashboardsHttpClient(http);
    const name = 'dashboard name';
    const description = 'dashboard description';
    const definition = {};

    await client.create(name, description, definition);

    expect(http.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ name, description, definition }),
    );
  });

  it('fails to create a dashboard', async () => {
    const http = createFailingHttpClient();
    const client = createDashboardsHttpClient(http);
    const name = 'dashboard name';
    const description = 'dashboard description';
    const definition = {};

    await expect(
      client.create(name, description, definition),
    ).rejects.toThrow();
  });

  it('reads a dashboard', async () => {
    const http = createHttpClient();
    const client = createDashboardsHttpClient(http);
    const id = 'x_3fsS-r7d1l';

    await client.read(id);

    expect(http.get).toHaveBeenCalledWith(expect.stringContaining(id));
  });

  it('fails to read a dashboard', async () => {
    const http = createFailingHttpClient();
    const client = createDashboardsHttpClient(http);
    const id = 'x_3fsS-r7d1l';

    await expect(client.read(id)).rejects.toThrow();
  });

  it('updates a dashboard', async () => {
    const http = createHttpClient();
    const client = createDashboardsHttpClient(http);
    const id = 'x_3fsS-r7d1l';
    const name = 'new dashboard name';
    const description = 'dashboard description';
    const definition = {};

    await client.update(id, name, description, definition);

    expect(http.put).toHaveBeenCalledWith(
      expect.stringContaining(id),
      expect.objectContaining({ name, definition }),
    );
  });

  it('fails to update a dashboard', async () => {
    const http = createFailingHttpClient();
    const client = createDashboardsHttpClient(http);
    const id = 'x_3fsS-r7d1l';
    const name = 'new dashboard name';
    const description = 'dashboard description';
    const definition = {};

    await expect(
      client.update(id, name, description, definition),
    ).rejects.toThrow();
  });

  it('deletes a dashboard', async () => {
    const http = createHttpClient();
    const client = createDashboardsHttpClient(http);
    const id = 'x_3fsS-r7d1l';

    await client.delete(id);

    expect(http.delete).toHaveBeenCalledWith(expect.stringContaining(id));
  });

  it('fails to delete a dashboard', async () => {
    const http = createFailingHttpClient();
    const client = createDashboardsHttpClient(http);
    const id = 'x_3fsS-r7d1l';

    await expect(client.delete(id)).rejects.toThrow();
  });
});
