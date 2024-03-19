import type { Operation } from '../../../client/interfaces/Operation';
import type { OperationParameter } from '../../../client/interfaces/OperationParameter';
import type { OperationParameters } from '../../../client/interfaces/OperationParameters';
import type { Config } from '../../../node';
import { getOperationName } from '../../../utils/operation';
import type { OpenApi } from '../interfaces/OpenApi';
import type { OpenApiOperation } from '../interfaces/OpenApiOperation';
import type { OpenApiRequestBody } from '../interfaces/OpenApiRequestBody';
import { getOperationErrors } from './getOperationErrors';
import { getOperationParameters } from './getOperationParameters';
import { getOperationRequestBody } from './getOperationRequestBody';
import { getOperationResponseHeader } from './getOperationResponseHeader';
import { getOperationResponses } from './getOperationResponses';
import { getOperationResults } from './getOperationResults';
import { getRef } from './getRef';
import { allowedServiceMethods, getServiceName } from './service';

// add global path parameters, skip duplicate names
const mergeParameters = (opParams: OperationParameter[], globalParams: OperationParameter[]): OperationParameter[] => {
    let mergedParameters = [...opParams];
    let pendingParameters = [...globalParams];
    while (pendingParameters.length > 0) {
        const pendingParam = pendingParameters[0];
        pendingParameters = pendingParameters.slice(1);
        const canMerge = mergedParameters.every(
            param => param.in !== pendingParam.in || param.name !== pendingParam.name
        );
        if (canMerge) {
            mergedParameters = [...mergedParameters, pendingParam];
        }
    }
    return mergedParameters;
};

export const getOperation = (
    openApi: OpenApi,
    options: Pick<Required<Config>, 'operationId'> & Omit<Config, 'operationId'>,
    data: {
        method: (typeof allowedServiceMethods)[number];
        op: OpenApiOperation;
        pathParams: OperationParameters;
        tag: string;
        url: string;
    }
): Operation => {
    const { method, op, pathParams, tag, url } = data;
    const service = getServiceName(tag);
    const name = getOperationName(url, method, options, op.operationId);

    const operation: Operation = {
        $refs: [],
        deprecated: Boolean(op.deprecated),
        description: op.description || null,
        errors: [],
        imports: [],
        method: method.toUpperCase(),
        name,
        parameters: [],
        parametersBody: pathParams.parametersBody,
        parametersCookie: [],
        parametersForm: [],
        parametersHeader: [],
        parametersPath: [],
        parametersQuery: [],
        path: url,
        responseHeader: null,
        results: [],
        service,
        summary: op.summary || null,
    };

    if (op.parameters) {
        const parameters = getOperationParameters(openApi, op.parameters);
        operation.$refs = [...operation.$refs, ...parameters.$refs];
        operation.imports = [...operation.imports, ...parameters.imports];
        operation.parameters = [...operation.parameters, ...parameters.parameters];
        operation.parametersBody = parameters.parametersBody;
        operation.parametersCookie = [...operation.parametersCookie, ...parameters.parametersCookie];
        operation.parametersForm = [...operation.parametersForm, ...parameters.parametersForm];
        operation.parametersHeader = [...operation.parametersHeader, ...parameters.parametersHeader];
        operation.parametersPath = [...operation.parametersPath, ...parameters.parametersPath];
        operation.parametersQuery = [...operation.parametersQuery, ...parameters.parametersQuery];
    }

    if (op.requestBody) {
        const requestBodyDef = getRef<OpenApiRequestBody>(openApi, op.requestBody);
        const requestBody = getOperationRequestBody(openApi, requestBodyDef);
        operation.$refs = [...operation.$refs, ...requestBody.$refs];
        operation.imports = [...operation.imports, ...requestBody.imports];
        operation.parameters = [...operation.parameters, requestBody];
        operation.parametersBody = requestBody;
    }

    if (op.responses) {
        const operationResponses = getOperationResponses(openApi, op.responses);
        const operationResults = getOperationResults(operationResponses);
        operation.errors = getOperationErrors(operationResponses);
        operation.responseHeader = getOperationResponseHeader(operationResults);

        operationResults.forEach(operationResult => {
            operation.$refs = [...operation.$refs, ...operationResult.$refs];
            operation.imports = [...operation.imports, ...operationResult.imports];
            operation.results = [...operation.results, operationResult];
        });
    }

    operation.parameters = mergeParameters(operation.parameters, pathParams.parameters);
    operation.parametersCookie = mergeParameters(operation.parametersCookie, pathParams.parametersCookie);
    operation.parametersForm = mergeParameters(operation.parametersForm, pathParams.parametersForm);
    operation.parametersHeader = mergeParameters(operation.parametersHeader, pathParams.parametersHeader);
    operation.parametersPath = mergeParameters(operation.parametersPath, pathParams.parametersPath);
    operation.parametersQuery = mergeParameters(operation.parametersQuery, pathParams.parametersQuery);

    // place required parameters first so we don't generate invalid types since
    // optional parameters cannot be positioned before required ones
    operation.parameters = operation.parameters.sort((a: OperationParameter, b: OperationParameter): number => {
        const aNeedsValue = a.isRequired && a.default === undefined;
        const bNeedsValue = b.isRequired && b.default === undefined;
        if (aNeedsValue && !bNeedsValue) return -1;
        if (bNeedsValue && !aNeedsValue) return 1;
        return 0;
    });

    return operation;
};