import * as request from 'supertest';
import { createApp } from '../src/app';

describe('/package/:name/:version endpoint', () => {
  it('responds', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    await request(createApp())
      .get(`/package/${packageName}/${packageVersion}`)
      .expect('Cache-Control', 'public, max-age=86400')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(({ body }) => expect(body.name).toEqual(packageName));
  });

  it('returns dependencies', async () => {
    const packageName = 'react';
    const packageVersion = '16.13.0';

    const expectedDependencies = [
      {
        dependencies: [ { dependencies: [], name: 'js-tokens', version: '^1.0.1' } ],
        name: 'loose-envify',
        version: '^1.1.0',
      },
      { dependencies: [], name: 'object-assign', version: '^4.1.1' },
      {
        dependencies: [
          {
            dependencies: [ { dependencies: [], name: 'js-tokens', version: '^3.0.0' } ],
            name: 'loose-envify',
            version: '^1.3.1',
          },
          { dependencies: [], name: 'object-assign', version: '^4.1.1' },
        ],
        name: 'prop-types',
        version: '^15.6.2',
      },
    ];

    await request(createApp())
      .get(`/package/${packageName}/${packageVersion}`)
      .expect(({ body }) => expect(body.dependencies).toEqual(expectedDependencies));
  });
});
