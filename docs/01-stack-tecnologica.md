# 01 - Stack Tecnológica

## Framework
| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Next.js** | 15+ | App Router, Server Components, Server Actions, PWA nativo |
| **React** | 19 | Hooks modernos, Server Components |
| **TypeScript** | 5+ | Type safety, better DX |

## Estilização
| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Tailwind CSS** | 4+ | Utility-first, design system |
| **shadcn/ui** | Latest | Componentes reutilizáveis e acessíveis |
| **Lucide React** | Latest | Ícones consistentes |

## Banco de Dados
| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **PostgreSQL** | 16+ | Robusto, relacional, suporte a JSON |
| **Prisma ORM** | 6+ | Type-safe, migrations, schema visual |

## Autenticação
| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Auth.js** | 5+ | NextAuth v5, JWT, sessões, providers |

## Validação
| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Zod** | 3+ | Schema validation, integrado com Prisma |

## Pagamento
| Tecnologia | Justificativa |
|------------|---------------|
| **Mercado Pago** ou **Asaas** | PIX (5% desconto), Cartão de Crédito/Débito |

## Infraestrutura
| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **Docker** | 24+ | Containerização, ambientes reproduzíveis |
| **Docker Compose** | 2+ | Orquestração de serviços |
| **Nginx** | 1.25+ | Proxy reverso, SSL, cache |
| **Cloudflare** | - | DNS, CDN, SSL, DDoS protection |

## PWA
| Tecnologia | Justificativa |
|------------|---------------|
| **next-pwa** ou **Serwist** | Service Worker, manifest, offline |
| **Web Push API** | Notificações push |

## Desenvolvimento
| Tecnologia | Justificativa |
|------------|---------------|
| **ESLint** | Linting |
| **Prettier** | Formatação |
| **Husky** | Git hooks |
| **lint-staged** | Validação pré-commit |

## Versões Recomendadas
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next-auth": "^5.0.0",
    "@prisma/client": "^6.0.0",
    "zod": "^3.23.0",
    "lucide-react": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tailwindcss": "^4.0.0",
    "prisma": "^6.0.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.0.0",
    "prettier": "^3.3.0"
  }
}
```

## Decisões Técnicas

### Por que Next.js App Router?
- Server Components por padrão (menos JS no cliente)
- Server Actions para mutações (sem API routes manuais)
- Streaming e Suspense nativos
- PWA com suporte nativo via `manifest.ts`

### Por que Prisma?
- Type-safe com TypeScript
- Migrations automáticas
- Prisma Studio para visualização do banco
- Integração nativa com Next.js

### Por que Auth.js?
- Suporte a múltiplos providers
- JWT e Database sessions
- Integrado com Next.js App Router
- Gratuito e open-source
