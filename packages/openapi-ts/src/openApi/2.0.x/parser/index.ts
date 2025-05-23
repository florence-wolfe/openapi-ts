import type { IR } from '../../../ir/types';
import type { State } from '../../shared/types/state';
import { canProcessRef, createFilters } from '../../shared/utils/filter';
import { mergeParametersObjects } from '../../shared/utils/parameter';
import type {
  OpenApiV2_0_X,
  OperationObject,
  PathItemObject,
  PathsObject,
  SecuritySchemeObject,
} from '../types/spec';
import { parseOperation } from './operation';
import { parametersArrayToObject } from './parameter';
import { parseSchema } from './schema';
import { parseServers } from './server';

type PathKeys<T extends keyof PathsObject = keyof PathsObject> =
  keyof T extends infer K ? (K extends `/${string}` ? K : never) : never;

export const parseV2_0_X = (context: IR.Context<OpenApiV2_0_X>) => {
  const state: State = {
    ids: new Map(),
    operationIds: new Map(),
  };
  const securitySchemesMap = new Map<string, SecuritySchemeObject>();

  const excludeFilters = createFilters(context.config.input.exclude);
  const includeFilters = createFilters(context.config.input.include);

  const shouldProcessRef = ($ref: string, schema: Record<string, any>) =>
    canProcessRef({
      $ref,
      excludeFilters,
      includeFilters,
      schema,
    });

  for (const name in context.spec.securityDefinitions) {
    const securitySchemeObject = context.spec.securityDefinitions[name]!;
    securitySchemesMap.set(name, securitySchemeObject);
  }

  if (context.spec.definitions) {
    for (const name in context.spec.definitions) {
      const $ref = `#/definitions/${name}`;
      const schema = context.spec.definitions[name]!;

      if (!shouldProcessRef($ref, schema)) {
        continue;
      }

      parseSchema({
        $ref,
        context,
        schema,
      });
    }
  }

  parseServers({ context });

  for (const path in context.spec.paths) {
    if (path.startsWith('x-')) {
      continue;
    }

    const pathItem = context.spec.paths[path as PathKeys]!;

    const finalPathItem = pathItem.$ref
      ? {
          ...context.resolveRef<PathItemObject>(pathItem.$ref),
          ...pathItem,
        }
      : pathItem;

    const commonOperation: OperationObject = {
      consumes: context.spec.consumes,
      produces: context.spec.produces,
      responses: {},
      security: context.spec.security,
    };
    const operationArgs: Omit<Parameters<typeof parseOperation>[0], 'method'> =
      {
        context,
        operation: {
          ...commonOperation,
          parameters: parametersArrayToObject({
            context,
            operation: commonOperation,
            parameters: finalPathItem.parameters,
          }),
        },
        path: path as PathKeys,
        securitySchemesMap,
        state,
      };

    const $refDelete = `#/paths${path}/delete`;
    if (
      finalPathItem.delete &&
      shouldProcessRef($refDelete, finalPathItem.delete)
    ) {
      const parameters = mergeParametersObjects({
        source: parametersArrayToObject({
          context,
          operation: finalPathItem.delete,
          parameters: finalPathItem.delete.parameters,
        }),
        target: operationArgs.operation.parameters,
      });
      parseOperation({
        ...operationArgs,
        method: 'delete',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.delete,
          parameters,
        },
      });
    }

    const $refGet = `#/paths${path}/get`;
    if (finalPathItem.get && shouldProcessRef($refGet, finalPathItem.get)) {
      const parameters = mergeParametersObjects({
        source: parametersArrayToObject({
          context,
          operation: finalPathItem.get,
          parameters: finalPathItem.get.parameters,
        }),
        target: operationArgs.operation.parameters,
      });
      parseOperation({
        ...operationArgs,
        method: 'get',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.get,
          parameters,
        },
      });
    }

    const $refHead = `#/paths${path}/head`;
    if (finalPathItem.head && shouldProcessRef($refHead, finalPathItem.head)) {
      const parameters = mergeParametersObjects({
        source: parametersArrayToObject({
          context,
          operation: finalPathItem.head,
          parameters: finalPathItem.head.parameters,
        }),
        target: operationArgs.operation.parameters,
      });
      parseOperation({
        ...operationArgs,
        method: 'head',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.head,
          parameters,
        },
      });
    }

    const $refOptions = `#/paths${path}/options`;
    if (
      finalPathItem.options &&
      shouldProcessRef($refOptions, finalPathItem.options)
    ) {
      const parameters = mergeParametersObjects({
        source: parametersArrayToObject({
          context,
          operation: finalPathItem.options,
          parameters: finalPathItem.options.parameters,
        }),
        target: operationArgs.operation.parameters,
      });
      parseOperation({
        ...operationArgs,
        method: 'options',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.options,
          parameters,
        },
      });
    }

    const $refPatch = `#/paths${path}/patch`;
    if (
      finalPathItem.patch &&
      shouldProcessRef($refPatch, finalPathItem.patch)
    ) {
      const parameters = mergeParametersObjects({
        source: parametersArrayToObject({
          context,
          operation: finalPathItem.patch,
          parameters: finalPathItem.patch.parameters,
        }),
        target: operationArgs.operation.parameters,
      });
      parseOperation({
        ...operationArgs,
        method: 'patch',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.patch,
          parameters,
        },
      });
    }

    const $refPost = `#/paths${path}/post`;
    if (finalPathItem.post && shouldProcessRef($refPost, finalPathItem.post)) {
      const parameters = mergeParametersObjects({
        source: parametersArrayToObject({
          context,
          operation: finalPathItem.post,
          parameters: finalPathItem.post.parameters,
        }),
        target: operationArgs.operation.parameters,
      });
      parseOperation({
        ...operationArgs,
        method: 'post',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.post,
          parameters,
        },
      });
    }

    const $refPut = `#/paths${path}/put`;
    if (finalPathItem.put && shouldProcessRef($refPut, finalPathItem.put)) {
      const parameters = mergeParametersObjects({
        source: parametersArrayToObject({
          context,
          operation: finalPathItem.put,
          parameters: finalPathItem.put.parameters,
        }),
        target: operationArgs.operation.parameters,
      });
      parseOperation({
        ...operationArgs,
        method: 'put',
        operation: {
          ...operationArgs.operation,
          ...finalPathItem.put,
          parameters,
        },
      });
    }
  }
};
