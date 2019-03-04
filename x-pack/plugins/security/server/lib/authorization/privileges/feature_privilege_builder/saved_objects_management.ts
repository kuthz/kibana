/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { flatten, uniq } from 'lodash';
import {
  Feature,
  FeatureKibanaPrivileges,
} from 'x-pack/plugins/xpack_main/server/lib/feature_registry/feature_registry';
import { FeaturePrivilegeBuilder } from './feature_privilege_builder';

export class FeaturePrivilegeSavedObjectsManagementBuilder extends FeaturePrivilegeBuilder {
  public getActions(privilegeDefinition: FeatureKibanaPrivileges, feature: Feature): string[] {
    return uniq([
      ...flatten(
        privilegeDefinition.savedObject.all.map(type => [
          this.actions.ui.get('savedObjectsManagement', type, 'delete'),
          this.actions.ui.get('savedObjectsManagement', type, 'edit'),
          this.actions.ui.get('savedObjectsManagement', type, 'read'),
        ])
      ),
      ...privilegeDefinition.savedObject.read.map(type =>
        this.actions.ui.get('savedObjectsManagement', type, 'read')
      ),
    ]);
  }
}