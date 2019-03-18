/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Action, ActionSavedObject } from 'ui/embeddable/actions';

// @ts-ignore
import { fromExpression } from '@kbn/interpreter/common';
// @ts-ignore
import { interpretAst } from 'plugins/interpreter/interpreter';
import { Embeddable } from 'ui/embeddable';
import { openFlyout } from 'ui/flyout';
import { EXPRESSION_ACTION } from './expression_action_factory';

export class CreateThresholdAlertAction extends Action {
  public expression: string;
  constructor(actionSavedObject?: ActionSavedObject) {
    super({
      actionSavedObject,
      type: EXPRESSION_ACTION,
    });
    this.expression = actionSavedObject ? actionSavedObject.attributes.configuration : '';
  }

  public isCompatible() {
    return Promise.resolve(true);
  }

  public updateConfiguration(config: string) {
    this.expression = config;
  }

  public execute({ embeddable }: { embeddable: Embeddable }) {
    // Open flyout with configuration options.
    openFlyout(embeddable as CreateThresholdAlertAction={embeddable} />
  }

  public getConfiguration() {
    return this.expression;
  }
}
