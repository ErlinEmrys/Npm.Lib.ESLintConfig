import { ESLintConfig } from "./index";
import genericTypeParameterSpacing from "./Rules/GenericTypeParamSpacing";

export default ESLintConfig( {
	plugins:
		{
			local:
				{
					rules:
						{
							"generic-type-parameter-spacing": genericTypeParameterSpacing,
						},
				},
		},
	rules:
		{
			"local/generic-type-parameter-spacing": "error",
		},
} );
