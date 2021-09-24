/**
 * The result of a package request against `https://registry.npmjs.org`. This is
 * a subset of the returned data, not a full representation, that contains
 * everything you will need to carry out the exercise.
 *
 * @example
 * {
 *   "name": "react",
 *   "description": "React is a JavaScript library for building user interfaces.",
 *   "dist-tags": {
 *     "latest": "16.13.0"
 *   },
 *   "versions": {
 *     "16.13.0": {
 *       "name": "react",
 *       "version": "16.13.0",
 *       "dependencies": {
 *         "loose-envify": "^1.1.0",
 *         "object-assign": "^4.1.1",
 *         "prop-types": "^15.6.2",
 *       }
 *     }
 *   }
 * }
 */
export interface INPMPackage {
  name: string;
  description: string;
  'dist-tags': {
    [tag: string]: string;
  };
  versions: {
    [version: string]: {
      name: string;
      version: string;
      dependencies?: {
        [packageName: string]: string;
      };
    };
  };
}

/**
 * @example
 * {
 *   "name": "react",
 *   "description": "React is a JavaScript library for building user interfaces.",
 *   "dist-tags": {
 *     "latest": "16.13.0"
 *   },
 *   "dependencies": {
 *     "loose-envify": "^1.1.0",
 *     "object-assign": "^4.1.1",
 *     "prop-types": "^15.6.2",
 *   }
 * }
 */
export interface INPMPackageVersion {
  name: string;
  description: string;
  'dist-tags': {
    [tag: string]: string;
  };
  dependencies?: {
    [packageName: string]: string;
  };
}

export interface IPackage {
  name: string;
  version: string;
  dependencies?: IPackage[];
}
