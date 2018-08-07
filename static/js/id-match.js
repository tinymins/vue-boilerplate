/**
 * @fileoverview Rule to flag non-matching identifiers
 * @author Matthieu Larcher
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "require identifiers to match a specified regular expression",
            category: "Stylistic Issues",
            recommended: false,
            url: "https://eslint.org/docs/rules/id-match"
        },

        schema: [
            {
                type: "string"
            },
            {
                type: "object",
                properties: {
                    properties: {
                        type: ["boolean", "string"]
                    },
                    propertiesPattern: {
                        type: "string"
                    },
                    onlyDeclarations: {
                        type: "boolean"
                    },
                    ignoreDestructuring: {
                        type: "boolean"
                    },
                    errorMessage: {
                        type: "string"
                    },
                    propertiesErrorMessage: {
                        type: "string"
                    }
                }
            }
        ]
    },

    create(context) {

        //--------------------------------------------------------------------------
        // Options
        //--------------------------------------------------------------------------
        const pattern = context.options[0] || "^.+$",
            regexp = new RegExp(pattern);

        const options = context.options[1] || {},
            properties = options.properties === "never" ? false : !!options.properties,
            propertiesPattern = options.propertiesPattern || pattern,
            propertiesRegexp = new RegExp(propertiesPattern),
            onlyDeclarations = !!options.onlyDeclarations,
            ignoreDestructuring = !!options.ignoreDestructuring,
            errorMessage = options.errorMessage || "Identifier '{{name}}' does not match the pattern '{{pattern}}'.",
            propertiesErrorMessage = options.propertiesErrorMessage || errorMessage;

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        // contains reported nodes to avoid reporting twice on destructuring with shorthand notation
        const reported = [];
        const ALLOWED_PARENT_TYPES = new Set(["CallExpression", "NewExpression"]);
        const DECLARATION_TYPES = new Set(["FunctionDeclaration", "VariableDeclarator"]);

        /**
         * Checks if a string matches the provided pattern
         * @param {string} name The string to check.
         * @param {boolean} isProperty Whether the identifier name of the identifier node is a property
         * @returns {boolean} if the string is a match
         * @private
         */
        function isInvalid(name, isProperty) {
            return isProperty ? !propertiesRegexp.test(name) : !regexp.test(name);
        }

        /**
         * Checks if a parent of a node is an ObjectPattern.
         * @param {ASTNode} node The node to check.
         * @returns {boolean} if the node is inside an ObjectPattern
         * @private
         */
        function isInsideObjectPattern(node) {
            let { parent } = node;

            while (parent) {
                if (parent.type === "ObjectPattern") {
                    return true;
                }

                parent = parent.parent;
            }

            return false;
        }

        /**
         * Verifies if we should report an error or not based on the effective
         * parent node and the identifier name.
         * @param {ASTNode} effectiveParent The effective parent node of the node to be reported
         * @param {string} name The identifier name of the identifier node
         * @param {boolean} isProperty Whether the identifier name of the identifier node is a property
         * @returns {boolean} whether an error should be reported or not
         */
        function shouldReport(effectiveParent, name, isProperty) {
            return (!onlyDeclarations || DECLARATION_TYPES.has(effectiveParent.type)) &&
                !ALLOWED_PARENT_TYPES.has(effectiveParent.type) && isInvalid(name, isProperty);
        }

        /**
         * Reports an AST node as a rule violation.
         * @param {ASTNode} node The node to report.
         * @param {boolean} isProperty Whether the identifier name of the reported identifier node is a property
         * @returns {void}
         * @private
         */
        function report(node, isProperty) {
            if (reported.indexOf(node) < 0) {
                context.report({
                    node,
                    message: isProperty ? propertiesErrorMessage : errorMessage,
                    data: {
                        name: node.name,
                        pattern: isProperty ? propertiesPattern : pattern
                    }
                });
                reported.push(node);
            }
        }

        return {

            Identifier(node) {
                const name = node.name,
                    parent = node.parent,
                    effectiveParent = (parent.type === "MemberExpression") ? parent.parent : parent;

                if (parent.type === "MemberExpression") {

                    if (!properties) {
                        return;
                    }

                    // Always check object names
                    if (parent.object.type === "Identifier" &&
                        parent.object.name === name) {
                        if (isInvalid(name, false)) {
                            report(node);
                        }

                    // Report AssignmentExpressions left side's assigned variable id
                    } else if (effectiveParent.type === "AssignmentExpression" &&
                        effectiveParent.left.type === "MemberExpression" &&
                        effectiveParent.left.property.name === node.name) {
                        if (isInvalid(name, true)) {
                            report(node);
                        }

                    // Report AssignmentExpressions only if they are the left side of the assignment
                    } else if (effectiveParent.type === "AssignmentExpression" && effectiveParent.right.type !== "MemberExpression") {
                        if (isInvalid(name, false)) {
                            report(node);
                        }
                    }

                /*
                 * Properties have their own rules, and
                 * AssignmentPattern nodes can be treated like Properties:
                 * e.g.: const { no_camelcased = false } = bar;
                 */
                } else if (parent.type === "Property" || node.parent.type === "AssignmentPattern") {

                    if (node.parent.parent && node.parent.parent.type === "ObjectPattern") {
                        if (node.parent.shorthand && node.parent.value.left && isInvalid(name, false)) {

                            report(node, false);
                        }

                        const assignmentKeyEqualsValue = node.parent.key.name === node.parent.value.name;

                        // prevent checking righthand side of destructured object
                        if (!assignmentKeyEqualsValue && node.parent.key === node) {
                            return;
                        }

                        const valueIsInvalid = node.parent.value.name && isInvalid(name, false);

                        // ignore destructuring if the option is set, unless a new identifier is created
                        if (valueIsInvalid && !(assignmentKeyEqualsValue && ignoreDestructuring)) {
                            report(node, false);
                        }
                    }

                    // never check properties or always ignore destructuring
                    if (!properties || (ignoreDestructuring && isInsideObjectPattern(node))) {
                        return;
                    }

                    // don't check right hand side of AssignmentExpression to prevent duplicate warnings
                    if (node.parent.right !== node && shouldReport(effectiveParent, name, true)) {
                        report(node, true);
                    }

                // Check if it's an import specifier
                } else if (["ImportSpecifier", "ImportNamespaceSpecifier", "ImportDefaultSpecifier"].indexOf(node.parent.type) >= 0) {

                    // Report only if the local imported identifier is invalid
                    if (node.parent.local && node.parent.local.name === node.name && isInvalid(name, false)) {
                        report(node, false);
                    }

                // Report anything that is invalid that isn't a CallExpression
                } else if (shouldReport(effectiveParent, name, false)) {
                    report(node, false);
                }
            }

        };

    }
};
