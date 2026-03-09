import type { TSESTree } from "@typescript-eslint/utils";
import { ESLintUtils } from "@typescript-eslint/utils";

type MessageIds = "missingSpaceAfterOpen" | "missingSpaceBeforeClose" | "missingSpaceAfterComma";

type Options = [];

type GenericNode = TSESTree.TSTypeParameterDeclaration | TSESTree.TSTypeParameterInstantiation;

const createRule = ESLintUtils.RuleCreator( name => name );

const rule = createRule< Options, MessageIds >( {
	name: "generic-type-parameter-spacing",
	meta:
		{
			type: "layout",
			docs:
				{
					description: "Enforce spaces inside TypeScript generic type parameter brackets",
				},
			fixable: "whitespace",
			schema: [],
			messages:
				{
					missingSpaceAfterOpen: "Expected a space after '<'.",
					missingSpaceBeforeClose: "Expected a space before '>'.",
					missingSpaceAfterComma: "Expected a space after ','.",
				},
			defaultOptions: [],
		},

	create( context )
	{
		const sourceCode = context.sourceCode;

		function check( node: GenericNode ): void
		{
			if( node.params.length === 0 )
			{
				return;
			}

			const openToken = sourceCode.getFirstToken( node );
			const closeToken = sourceCode.getLastToken( node );

			if( !openToken || !closeToken || openToken.value !== "<" || closeToken.value !== ">" )
			{
				return;
			}

			const firstParamToken = sourceCode.getFirstToken( node.params[ 0 ] );
			const lastParamToken = sourceCode.getLastToken( node.params[ node.params.length - 1 ] );

			if( !firstParamToken || !lastParamToken )
			{
				return;
			}

			const textAfterOpen = sourceCode.text.slice( openToken.range[ 1 ], firstParamToken.range[ 0 ] );
			if( textAfterOpen === "" )
			{
				context.report( {
					node,
					loc: openToken.loc,
					messageId: "missingSpaceAfterOpen",
					fix( fixer )
					{
						return fixer.insertTextAfter( openToken, " " );
					},
				} );
			}

			const textBeforeClose = sourceCode.text.slice( lastParamToken.range[ 1 ], closeToken.range[ 0 ] );
			if( textBeforeClose === "" )
			{
				context.report( {
					node,
					loc: closeToken.loc,
					messageId: "missingSpaceBeforeClose",
					fix( fixer )
					{
						return fixer.insertTextBefore( closeToken, " " );
					},
				} );
			}

			for( let index = 0; index < node.params.length - 1; index++ )
			{
				const currentParam = node.params[ index ];
				const nextParam = node.params[ index + 1 ];

				const commaToken = sourceCode.getTokenAfter( currentParam );
				const nextParamToken = sourceCode.getFirstToken( nextParam );

				if( !commaToken || commaToken.value !== "," || !nextParamToken )
				{
					continue;
				}

				const textAfterComma = sourceCode.text.slice( commaToken.range[ 1 ], nextParamToken.range[ 0 ] );
				if( textAfterComma === "" )
				{
					context.report( {
						node,
						loc: commaToken.loc,
						messageId: "missingSpaceAfterComma",
						fix( fixer )
						{
							return fixer.insertTextAfter( commaToken, " " );
						},
					} );
				}
			}
		}

		return {
			TSTypeParameterDeclaration( node: TSESTree.TSTypeParameterDeclaration )
			{
				check( node );
			},
			TSTypeParameterInstantiation( node: TSESTree.TSTypeParameterInstantiation )
			{
				check( node );
			},
		};
	},
} );

export default rule;
