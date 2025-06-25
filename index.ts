// noinspection SpellCheckingInspection

import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from "@antfu/eslint-config";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";
import type { RuleOptions } from "eslint-plugin-svelte/lib/rule-types";
import AntfuConfig from "@antfu/eslint-config";

export function ESLintConfig( options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},	...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[] ): FlatConfigComposer<TypedFlatConfigItem, ConfigNames>
{
	const rules: Partial<Linter.RulesRecord & RuleOptions> =
		{
			"curly": [ 2, "all" ],
			"no-console": [ 2, {} ],
			"jsonc/array-bracket-spacing": [ 2, "always" ],
			"jsonc/indent": [ 2, "tab" ],
			"style/array-bracket-spacing": [ 2, "always" ],
			"style/brace-style": [ 2, "allman", { allowSingleLine: false } ],
			"style/computed-property-spacing": [ 2, "always", { enforceForClassMembers: true } ],
			"style/indent": [ 2, "tab", { ArrayExpression: 1, CallExpression: { arguments: 1 }, flatTernaryExpressions: false, FunctionDeclaration: { body: 1, parameters: 1 }, FunctionExpression: { body: 1, parameters: 1 }, ignoreComments: false, ignoredNodes: [ "TemplateLiteral *", "JSXElement", "JSXElement > *", "JSXAttribute", "JSXIdentifier", "JSXNamespacedName", "JSXMemberExpression", "JSXSpreadAttribute", "JSXExpressionContainer", "JSXOpeningElement", "JSXClosingElement", "JSXFragment", "JSXOpeningFragment", "JSXClosingFragment", "JSXText", "JSXEmptyExpression", "JSXSpreadChild", "TSUnionType", "TSIntersectionType", "TSTypeParameterInstantiation", "FunctionExpression > .params[decorators.length > 0]", "FunctionExpression > .params > :matches(Decorator, :not(:first-child))", "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key" ], ImportDeclaration: 1, MemberExpression: 1, ObjectExpression: 1, offsetTernaryExpressions: true, outerIIFEBody: 1, SwitchCase: 1, VariableDeclarator: 1 } ],
			"style/keyword-spacing": [ "error", { after: false, before: true, overrides: { return: { after: true }, const: { after: true }, export: { after: true }, import: { after: true }, type: { after: true }, from: { after: true } } } ],
			"style/member-delimiter-style": [ 2, { multiline: { delimiter: "semi", requireLast: true }, singleline: { delimiter: "semi", requireLast: false	}, multilineDetection: "brackets" } ],
			"style/no-tabs": [ 0 ],
			"style/operator-linebreak": [ 2, "after" ],
			"style/padded-blocks": [ 2, { blocks: "never", classes: "never", switches: "never" } ],
			"style/quotes": [ 2, "double" ],
			"style/semi": [ 2, "always" ],
			"style/space-before-function-paren": [ 2, "never" ],
			"style/space-in-parens": [ 2, "always" ],
			"style/spaced-comment": [ 2, "always" ],
			"style/template-curly-spacing": [ 2, "always" ],
			"svelte/html-quotes": [ 2, { prefer: "double" } ],
			"svelte/indent": [ 2, {	indent: "tab", switchCase: 1, alignAttributesVertically: true } ],
			"svelte/mustache-spacing": [ 2, { textExpressions: "always", attributesAndProps: "always", directiveExpressions: "always", tags: { openingBrace: "always", closingBrace: "always" } } ],
			"ts/prefer-literal-enum-member": [ 2, { allowBitwiseExpressions: true } ],
			"unicorn/throw-new-error": [ 0 ],
		};

	const toIgnore = [ "node_modules", "**/node_modules/**", ".DS_Store", "**/.DS_Store/**", "dist", "dist/**", "pnpm-lock.yaml", "**/pnpm-lock.yaml/**", "package-lock.json", "**/package-lock.json/**", "yarn.lock", "**/yarn.lock/**" ];

	options.ignores = ( options.ignores ?? [] ).concat( toIgnore );

	options.rules ??= {};

	for( const [ fKey, fValue ] of Object.entries( rules ) )
	{
		if( !Object.prototype.hasOwnProperty.call( options.rules, fKey ) && ( options.svelte || !fKey.startsWith( "svelte/" ) ) )
		{
			options.rules[ fKey ] = fValue;
		}
	}

	options.jsonc = true;
	options.typescript = true;

	return AntfuConfig( options, ...userConfigs );
}
