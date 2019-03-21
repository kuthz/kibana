/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import { I18nContext } from 'ui/i18n';

import chrome from 'ui/chrome';
import { DOC_LINK_VERSION, ELASTIC_WEBSITE_URL } from 'ui/documentation_links';
import { management, MANAGEMENT_BREADCRUMB } from 'ui/management';
import { fatalError } from 'ui/notify';
import routes from 'ui/routes';

import { HashRouter } from 'react-router-dom';

export interface AppCore {
  i18n: {
    [i18nPackage: string]: any;
    Context: typeof I18nContext;
    FormattedMessage: typeof FormattedMessage;
  };
  chrome: typeof chrome;
  notification: {
    fatalError: typeof fatalError;
  };
  http: {
    getClient(): any;
    setClient(client: any): void;
  };
  documentation: {
    esDocBasePath: string;
    esPluginDocBasePath: string;
  };
}

export interface AppPlugins {
  management: {
    sections: typeof management;
    constants: {
      BREADCRUMB: typeof MANAGEMENT_BREADCRUMB;
    };
  };
}

export interface Core extends AppCore {
  routing: {
    registerAngularRoute(path: string, config: object): void;
    registerRouter(router: HashRouter): void;
    getRouter(): HashRouter | undefined;
  };
}

export interface Plugins extends AppPlugins {} // tslint:disable-line no-empty-interface

export function createShim(): { core: Core; plugins: Plugins } {
  // This is an Angular service, which is why we use this provider pattern
  // to access it within our React app.
  let httpClient: ng.IHttpService;

  let reactRouter: HashRouter | undefined;

  return {
    core: {
      i18n: {
        ...i18n,
        Context: I18nContext,
        FormattedMessage,
      },
      routing: {
        registerAngularRoute: (path: string, config: object): void => {
          routes.when(path, config);
        },
        registerRouter: (router: HashRouter): void => {
          reactRouter = router;
        },
        getRouter: (): HashRouter | undefined => {
          return reactRouter;
        },
      },
      http: {
        setClient: (client: any): void => {
          httpClient = client;
        },
        getClient: (): any => httpClient,
      },
      chrome,
      notification: {
        fatalError,
      },
      documentation: {
        esDocBasePath: `${ELASTIC_WEBSITE_URL}guide/en/elasticsearch/reference/${DOC_LINK_VERSION}/`,
        esPluginDocBasePath: `${ELASTIC_WEBSITE_URL}guide/en/elasticsearch/plugins/${DOC_LINK_VERSION}/`,
      },
    },
    plugins: {
      management: {
        sections: management,
        constants: {
          BREADCRUMB: MANAGEMENT_BREADCRUMB,
        },
      },
    },
  };
}
