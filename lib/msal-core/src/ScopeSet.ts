import { Utils } from './utils/Utils';
import { AuthenticationParameters } from './AuthenticationParameters';
import { ClientConfigurationError } from './error/ClientConfigurationError';

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class ScopeSet {

  private clientId: string;
  private scopes : Set<string>;

  constructor(request : AuthenticationParameters, clientId : string, isLoginCall : boolean) {
    this.clientId = clientId;
    this.validateInputScope(request.scopes, isLoginCall);
    let requestScopes = request.scopes ? request.scopes : [];

    this.scopes = new Set<string>(Utils.convertArrayEntriesToLowerCase(requestScopes));
    if (isLoginCall) {
      this.addExtraScopesToConsent(request);
    }
  }

  /**
   * @hidden
   *
   * Used to validate the scopes input parameter requested  by the developer.
   * @param {Array<string>} scopes - Developer requested permissions. Not all scopes are guaranteed to be included in the access token returned.
   * @param {boolean} scopesRequired - Boolean indicating whether the scopes array is required or not
   * @ignore
   */
  private validateInputScope(scopes: Array<string>, scopesRequired: boolean): void {
    if (!scopes) {
      if (scopesRequired) {
        throw ClientConfigurationError.createScopesRequiredError(scopes);
      } else {
        return;
      }
    }

    // Check that scopes is an array object (also throws error if scopes == null)
    if (!Array.isArray(scopes)) {
      throw ClientConfigurationError.createScopesNonArrayError(scopes);
    }

    // Check that scopes is not an empty array
    if (scopes.length < 1) {
      throw ClientConfigurationError.createEmptyScopesArrayError(scopes.toString());
    }

    // Check that clientId is passed as single scope
    if (scopes.indexOf(this.clientId) > -1) {
      if (scopes.length > 1) {
        throw ClientConfigurationError.createClientIdSingleScopeError(scopes.toString());
      }
    }
  }

  /**
   * @ignore
   * Appends extraScopesToConsent if passed
   * @param {@link AuthenticationParameters}
   */
  private addExtraScopesToConsent(request: AuthenticationParameters): void {
    if (request) {
      
    }
  }

  /**
   * Check if there are any intersecting scopes between this set of scopes 
   * and the set or array given.
   *
   * @param cachedScopes
   * @param scopes
   */
  checkScopeIntersection(otherScopes: Array<string>) : boolean;
  checkScopeIntersection(otherScopes: Set<string>) : boolean;
  checkScopeIntersection(otherScopes: Array<string> | Set<string>): boolean {
    let otherSetOfScopes = new Set<string>(otherScopes);
    for (let scopeEntry in otherSetOfScopes) {
      if (this.scopes.has(scopeEntry.toLowerCase())) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a given scope is present in the request
   *
   * @param cachedScopes
   * @param scopes
   */
  containsScopes(containedScopes: Array<string>): boolean
  containsScopes(containedScopes: Set<string>): boolean
  containsScopes(containedScopes: Array<string> | Set<string>): boolean {
    let otherScopes = new Set<string>(containedScopes);
    for (let scopeEntry in otherScopes) {
      if (!this.scopes.has(scopeEntry)) {
        return false;
      }
    }

    return true;
  }

  /**
   * remove one element from a scope array
   *
   * @param scopes
   */
  removeScope(scope: string): void {
    this.scopes.delete(scope);
  }

  /**
   * Prints the scopes as a formatted space-delimited string
   * @param scopes
   */
  printScopes(): string {
    let scopeList: string = "";
    if (this.scopes) {
      for (let scopeEntry in this.scopes) {
        scopeList += scopeEntry + " ";
      }
    }

    return scopeList.substring(0, scopeList.length);
  }
}
