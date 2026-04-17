# Perseus Auto-Detection Reference

## Language Detection
| Files | Language |
|-------|----------|
| package.json, *.ts, *.js | JavaScript/TypeScript |
| go.mod, *.go | Go |
| composer.json, *.php | PHP |
| requirements.txt, *.py | Python |
| Cargo.toml, *.rs | Rust |
| pom.xml, *.java | Java |
| Gemfile, *.rb | Ruby |
| *.csproj, *.cs | C# |

## Framework Detection
| Files/Patterns | Framework |
|----------------|-----------|
| next.config.*, app/ directory | Next.js |
| nuxt.config.* | Nuxt.js |
| angular.json | Angular |
| vite.config.*, svelte.config.* | Vite/Svelte |
| gin import, echo import | Go (Gin/Echo) |
| artisan, laravel | PHP (Laravel) |
| manage.py, django | Python (Django) |
| fastapi import | Python (FastAPI) |
| actix-web, axum in Cargo.toml | Rust (Actix/Axum) |
| spring-boot | Java (Spring) |
| rails | Ruby on Rails |

## Infrastructure Detection
| Files | Technology |
|-------|------------|
| Dockerfile, docker-compose.yml | Docker |
| .github/workflows/*.yml | GitHub Actions |
| .gitlab-ci.yml | GitLab CI |
| *.tf | Terraform |
| k8s/, kubernetes/, *.yaml with apiVersion | Kubernetes |
| serverless.yml | Serverless |
| vercel.json | Vercel |

## API Detection
| Patterns | Type |
|----------|------|
| /graphql, schema.graphql, *.gql | GraphQL |
| WebSocket, ws://, wss:// | WebSocket |
| *.proto, grpc | gRPC |
| openapi, swagger | REST/OpenAPI |

## AI/LLM Detection
| Patterns | Technology |
|----------|------------|
| openai, anthropic, langchain | LLM Integration |
| vector store, embeddings | RAG System |
| prompt, completion | AI Features |

## Specialist Trigger Rules

Based on detection results and scan findings, queue specialists:

```
DETECTED: Next.js/React     → Queue /client (with SSR focus)
DETECTED: GraphQL           → Queue /api (with GraphQL focus)
DETECTED: Docker            → Queue /config (with container focus)
DETECTED: GitHub Actions    → Queue /config (with CI/CD focus)
DETECTED: Kubernetes        → Queue /config (with K8s focus)
DETECTED: MongoDB/Redis     → Queue /injection (with NoSQL focus)
DETECTED: LLM/AI            → Queue /logic (with AI security focus)
DETECTED: JWT/Auth          → Queue /crypto
DETECTED: File uploads      → Queue /file
DETECTED: Package manifests → Queue /supply-chain
ALWAYS                      → Queue /config
```
