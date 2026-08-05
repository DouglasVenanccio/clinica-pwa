import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Configuracao ESLint para o projeto Clinica.
 * Utiliza a configuracao do Next.js como base.
 */
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Regras personalizadas
  {
    rules: {
      // Regras de formatacao
      "indent": ["error", 2],
      "quotes": ["error", "double"],
      "semi": ["error", true],

      // Regras de TypeScript
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",

      // Regras de React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",

      // Regras de imports
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc" },
        },
      ],
    },
  },

  // Ignorar arquivos especificos
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "dist/",
      "prisma/migrations/",
    ],
  },
];

export default eslintConfig;
