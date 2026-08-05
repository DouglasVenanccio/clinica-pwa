# 06 - Paleta de Cores e Identidade Visual

## Paleta de Cores

### Cores Principais
| Cor | Hex | RGB | Uso |
|-----|-----|-----|-----|
| **Creme** | `#F5F0E8` | 245, 240, 232 | Fundo principal |
| **Branco** | `#FFFFFF` | 255, 255, 255 | Cards, fundo secundário |
| **Dourado** | `#C9A96E` | 201, 169, 110 | Acentos, CTA, botões |
| **Dourado Escuro** | `#A8893E` | 168, 137, 62 | Hover, secundário |
| **Marrom** | `#8B6914` | 139, 105, 20 | Títulos |
| **Marrom Escuro** | `#5C4A3A` | 92, 74, 58 | Texto principal |
| **Marrom Sidebar** | `#2C2C2C` | 44, 44, 44 | Sidebar admin |

### Cores de Status
| Cor | Hex | Uso |
|-----|-----|-----|
| **Sucesso** | `#4CAF50` | Confirmado, Pago |
| **Alerta** | `#FF9800` | Pendente |
| **Erro** | `#E53935` | Cancelado, Falhou |
| **Info** | `#2196F3` | Informações |

### Cores Neutras
| Cor | Hex | Uso |
|-----|-----|-----|
| **Cinza Claro** | `#F5F5F5` | Fundo de tabela |
| **Cinza** | `#E0E0E0` | Bordas |
| **Cinza Médio** | `#9E9E9E` | Texto secundário |
| **Cinza Escuro** | `#616161` | Texto desabilitado |

## Tipografia

### Fontes
| Uso | Fonte | Peso |
|-----|-------|------|
| **Títulos** | Playfair Display | 400, 600, 700 |
| **Corpo** | Inter | 400, 500, 600 |

### Tamanhos
| Elemento | Tamanho | Peso |
|----------|---------|------|
| **H1** | 48px / 3rem | 700 |
| **H2** | 36px / 2.25rem | 600 |
| **H3** | 24px / 1.5rem | 600 |
| **H4** | 20px / 1.25rem | 600 |
| **Corpo** | 16px / 1rem | 400 |
| **Pequeno** | 14px / 0.875rem | 400 |
| **Mini** | 12px / 0.75rem | 400 |

## Espaçamento

### Escala
| Token | Valor |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

## Bordas e Raios

| Elemento | Raio |
|----------|------|
| **Cards** | 12px |
| **Botões** | 8px |
| **Inputs** | 8px |
| **Badges** | 16px (pill) |
| **Avatares** | 50% (círculo) |

## Sombras

| Nível | Valor |
|-------|-------|
| **Sombra Leve** | `0 1px 3px rgba(0,0,0,0.1)` |
| **Sombra Média** | `0 4px 6px rgba(0,0,0,0.1)` |
| **Sombra Forte** | `0 10px 15px rgba(0,0,0,0.1)` |

## Componentes Visuais

### Botões

#### Botão Primário (Dourado)
```css
background: #C9A96E;
color: #FFFFFF;
border: none;
border-radius: 8px;
padding: 12px 24px;
font-weight: 600;

&:hover {
  background: #A8893E;
}
```

#### Botão Secundário (Outline)
```css
background: transparent;
color: #C9A96E;
border: 2px solid #C9A96E;
border-radius: 8px;
padding: 12px 24px;
font-weight: 600;

&:hover {
  background: #C9A96E;
  color: #FFFFFF;
}
```

#### Botão Fantasma
```css
background: transparent;
color: #5C4A3A;
border: none;
border-radius: 8px;
padding: 12px 24px;
font-weight: 500;

&:hover {
  background: #F5F0E8;
}
```

### Cards

#### Card Padrão
```css
background: #FFFFFF;
border: 1px solid #E0E0E0;
border-radius: 12px;
padding: 24px;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
```

#### Card Selecionado
```css
background: #FFFFFF;
border: 2px solid #C9A96E;
border-radius: 12px;
padding: 24px;
box-shadow: 0 4px 6px rgba(0,0,0,0.1);
```

### Inputs

#### Input Padrão
```css
background: #FFFFFF;
border: 1px solid #E0E0E0;
border-radius: 8px;
padding: 12px 16px;
font-size: 16px;

&:focus {
  border-color: #C9A96E;
  outline: none;
  box-shadow: 0 0 0 3px rgba(201,169,110,0.2);
}
```

### Badges

#### Badge Sucesso
```css
background: #E8F5E9;
color: #4CAF50;
border-radius: 16px;
padding: 4px 12px;
font-size: 12px;
font-weight: 600;
```

#### Badge Alerta
```css
background: #FFF3E0;
color: #FF9800;
border-radius: 16px;
padding: 4px 12px;
font-size: 12px;
font-weight: 600;
```

#### Badge Erro
```css
background: #FFEBEE;
color: #E53935;
border-radius: 16px;
padding: 4px 12px;
font-size: 12px;
font-weight: 600;
```

## Ícones

### Biblioteca
- **Lucide React** para ícones gerais

### Ícones Principais
| Uso | Ícone |
|-----|-------|
| Agendamento | `Calendar` |
| Horário | `Clock` |
| Serviço | `Sparkles` |
| Profissional | `User` |
| Cliente | `Users` |
| Pagamento | `CreditCard` |
| Configuração | `Settings` |
| Notificação | `Bell` |
| Busca | `Search` |
| Adicionar | `Plus` |
| Editar | `Pencil` |
| Excluir | `Trash2` |
| Visualizar | `Eye` |
| Voltar | `ArrowLeft` |
| Próximo | `ArrowRight` |

## Animações

### Transições
```css
/* Padrão */
transition: all 0.2s ease-in-out;

/* Rápida */
transition: all 0.1s ease-in-out;

/* Lenta */
transition: all 0.3s ease-in-out;
```

### Hover
```css
/* Cards */
&:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

/* Botões */
&:hover {
  transform: translateY(-1px);
}

/* Ícones */
&:hover {
  transform: scale(1.1);
}
```

## Layout

### Largura Máxima
- **Conteúdo:** 1200px
- **Cards:** 100% (responsivo)

### Grid
- **Desktop:** 12 colunas
- **Tablet:** 8 colunas
- **Mobile:** 4 colunas

### Breakpoints
| Nome | Largura |
|------|---------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## Exemplos de Componentes

### Header (Landing Page)
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo]   Início | Sobre | Serviços | Pacotes | Contato    │
│                                       [AGENDAR AGORA]      │
└─────────────────────────────────────────────────────────────┘
```

### Sidebar (Admin)
```
┌──────────────┐
│ [Logo]       │
│              │
│ 🏠 Dashboard│
│ 📅 Agenda    │
│ 👥 Clientes  │
│ 💆 Serviços  │
│ 👨‍⚕️ Profission│
│ 💰 Pagamentos│
│ ⚙️ Config    │
└──────────────┘
```

### Card de Serviço
```
┌─────────────────────┐
│     [Ícone]         │
│                     │
│   LIMPEZA DE PELE   │
│                     │
│ Remove impurezas... │
│                     │
│ ⏱️ 60 min           │
│ 💰 R$ 150,00        │
│                     │
│   [SAIBA MAIS]      │
└─────────────────────┘
```

### Card de Profissional
```
┌─────────────────────┐
│      [Foto]         │
│                     │
│    Juliana A.       │
│    Esteticista      │
│                     │
│    ⭐⭐⭐⭐⭐ (32)     │
└─────────────────────┘
```
