// This file is auto-generated by @hey-api/openapi-ts

export type Foo = {
    foo: Array<{
        baz: Bar | null;
    }>;
};

export type Bar = {
    bar: number;
};

export type GetFooData = {
    body?: never;
    path?: never;
    query?: never;
    url: '/foo';
};

export type GetFooResponses = {
    /**
     * OK
     */
    200: Foo | null;
};

export type GetFooResponse = GetFooResponses[keyof GetFooResponses];

export type ClientOptions = {
    baseUrl: `${string}://${string}` | (string & {});
};