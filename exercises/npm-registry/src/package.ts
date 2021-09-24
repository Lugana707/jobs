import { RequestHandler } from 'express';
import got from 'got';
import * as semver from 'semver';
import { NPMPackageVersion, IPackage } from './types';

const getPackageFromNpmApi = async (name: string, version: string): Promise<IPackage> => {
  const { version: minVersion } = semver.minVersion(version);

  const npmPackage: NPMPackageVersion = await got(`https://registry.npmjs.org/${name}/${minVersion}`).json();

  const { dependencies = {} } = npmPackage;

  const nestedDependencies = await Promise.all(
    Object.keys(dependencies).map(packageName => getPackageFromNpmApi(packageName, dependencies[packageName]))
  );

  return { name, version, dependencies: nestedDependencies };
};

/**
 * Attempts to retrieve package data from the npm registry and return it
 */
export const getPackage: RequestHandler = async function(req, res, next) {
  const { name, version } = req.params;

  try {
    const result = await getPackageFromNpmApi(name, version);

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};
