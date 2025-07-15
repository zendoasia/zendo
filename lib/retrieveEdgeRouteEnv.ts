/**
 * lib/retrieveEdgeRouteEnv.ts
 * ---------------------------
 *
 * Retrieves an environment variable from the process environment.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use server";

/**
 * Retrieves an environment variable from the process environment.
 *
 * @param variableName - The name  of the environment variable to retrieve.
 * @returns The value of the environment variable, or undefined if the variable is not set.
 */
export async function getEnvVariable(variableName: string): Promise<string | undefined> {
  const value = process.env[variableName.toUpperCase()];
  return value;
}
