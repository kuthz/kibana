/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Embeddable } from 'ui/embeddable';
import { Action } from 'ui/embeddable/actions';

import React from 'react';
import { Container, ContainerInput } from 'ui/embeddable/containers';
import { ContainerOutput } from 'ui/embeddable/containers/container';
import { EmbeddableInput } from 'ui/embeddable/embeddables/embeddable';
import { openFlyout } from 'ui/flyout';
import { CustomizePanelFlyout } from './customize_panel_flyout';

interface CustomizePanelEmbeddableState extends EmbeddableInput {
  customization: { title?: string };
}

interface CustomizePanelContainerInput extends ContainerInput {
  panels: {
    [key: string]: {
      embeddableConfig: {
        title?: string;
      };
    };
  };
}

interface CustomizePanelContainerOutput extends ContainerOutput {
  panels: {
    [key: string]: {
      embeddableConfig: {
        title?: string;
      };
    };
  };
}

type CustomizePanelContainer = Container<
  CustomizePanelContainerInput,
  CustomizePanelContainerOutput,
  CustomizePanelEmbeddableState
>;

export class CustomizePanelTitleAction extends Action {
  constructor() {
    super();
    this.id = 'CUSTOMIZE_PANEL_ACTION';
    this.title = 'Customize Panel Action';
  }

  public execute({
    embeddable,
    container,
  }: {
    embeddable: Embeddable;
    container: CustomizePanelContainer;
  }) {
    if (!embeddable || !container) {
      throw new Error(
        'Customize panel title action requires an embeddable and container as context.'
      );
    }
    openFlyout(
      <CustomizePanelFlyout
        originalTitle={embeddable.getOutput().title}
        titleOverride={container.getInputForEmbeddable(embeddable.id).customization.title}
        onReset={() => this.onReset({ embeddable, container })}
        onUpdatePanelTitle={title => this.onSetTitle({ embeddable, container }, title)}
      />,
      {
        'data-test-subj': 'samplePanelActionFlyout',
      }
    );
  }

  private onReset(panelAPI: { embeddable: Embeddable; container: CustomizePanelContainer }) {
    this.onSetTitle(panelAPI);
  }

  private onSetTitle(
    { embeddable, container }: { embeddable: Embeddable; container: CustomizePanelContainer },
    title?: string
  ) {
    const currentContainerState = container.getInput();
    const embeddableState = currentContainerState.panels[embeddable.id];
    container.onInputChanged({
      ...currentContainerState,
      panels: {
        ...currentContainerState.panels,
        [embeddable.id]: {
          ...embeddableState,
          embeddableConfig: {
            ...embeddableState.embeddableConfig,
            title,
          },
        },
      },
    });
  }
}
