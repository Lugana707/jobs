import { RequestHandler } from 'express';
import got from 'got';
import * as semver from 'semver';
import * as cache from 'memory-cache';
import { INPMPackageVersion, IPackage } from './types';

const CACHE_TIME_MILLISECONDS = 60 * 1000;

const getPackageFromNpmApiOrCache = async (name: string, version: string): Promise<INPMPackageVersion> => {
  const cacheKey = `${name}@${version}`;
  const cachedValue = cache.get(cacheKey);
  if (!!cachedValue) {
    console.debug('Cache hit!', { cachedValue });

    return cachedValue;
  }

  const npmPackageVersion: INPMPackageVersion = await got(`https://registry.npmjs.org/${name}/${version}`).json();

  cache.put(cacheKey, npmPackageVersion, CACHE_TIME_MILLISECONDS);

  return npmPackageVersion;
};

const getPackageAndDependencies = async (name: string, version: string): Promise<IPackage> => {
  const { version: minVersion } = semver.minVersion(version);

  const { dependencies = {} } = await getPackageFromNpmApiOrCache(name, minVersion);

  const nestedDependencies = await Promise.all(
    Object.keys(dependencies).map((packageName) => getPackageAndDependencies(packageName, dependencies[packageName])),
  );

  const npmPackageVersion: IPackage = { name, version, dependencies: nestedDependencies };

  return npmPackageVersion;
};

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getPackage: RequestHandler = async function (req, res, next) {
  const { name, version } = req.params;

  if (!res.getHeader('Cache-Control')) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }

  try {
    const result = await getPackageAndDependencies(name, version);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
