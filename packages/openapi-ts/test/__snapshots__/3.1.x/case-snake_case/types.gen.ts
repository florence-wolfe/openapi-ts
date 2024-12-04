// This file is auto-generated by @hey-api/openapi-ts

/**
 * original name: 201
 */
export type _201 = number;

/**
 * original name: Foo
 */
export type foo = {
    /**
     * original name: fooBar
     */
    fooBar: foo_bar;
    /**
     * original name: BarBaz
     */
    BarBaz: foo;
    /**
     * original name: qux_quux
     */
    qux_quux: {
        /**
         * original name: fooBar
         */
        fooBar: foo_bar2;
        /**
         * original name: BarBaz
         */
        BarBaz: foo_bar3;
        /**
         * original name: qux_quux
         */
        qux_quux: boolean;
    };
};

/**
 * original name: foo_bar
 */
export type foo_bar = boolean;

/**
 * original name: fooBar
 */
export type foo_bar2 = number;

/**
 * original name: FooBar
 */
export type foo_bar3 = string;

export type get_foo_data = {
    body: foo;
    path?: never;
    query: {
        /**
         * original name: fooBar
         */
        fooBar: string;
        /**
         * original name: BarBaz
         */
        BarBaz: string;
        /**
         * original name: qux_quux
         */
        qux_quux: string;
    };
    url: '/foo';
};

export type get_foo_responses = {
    /**
     * OK
     */
    200: foo;
    /**
     * OK
     */
    201: _201;
};

export type get_foo_response = get_foo_responses[keyof get_foo_responses];