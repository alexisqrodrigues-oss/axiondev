---
title: "Setup completo do Neovim para Dev + IA"
date: "2026-04-18"
category: "tutoriais"
tags: ["neovim", "ide", "produtividade", "lua"]
lang: "pt"
excerpt: "Meu setup atual do Neovim: LSP, completion, copilot, chat com IA e atalhos que mudaram minha vida."
---

# Setup completo do Neovim para Dev + IA

Depois de **anos** alternando entre VS Code, Cursor e Zed, voltei pro Neovim. E dessa vez é pra ficar. Esse post documenta meu setup atual, otimizado pra trabalhar com IA no terminal.

## Por que Neovim em 2026?

A resposta curta: **velocidade + extensibilidade**. A longa:

1. Abre instantaneamente, mesmo em projetos enormes
2. Roda dentro do `tmux` (workflow remoto via SSH é trivial)
3. Lua como linguagem de config é maravilhosa
4. Plugins de IA modernos (Avante, CodeCompanion) competem com Cursor
5. Memória muscular que carrego há 10 anos

## Estrutura de configuração

```
~/.config/nvim/
├── init.lua
├── lazy-lock.json
└── lua/
    ├── config/
    │   ├── options.lua
    │   ├── keymaps.lua
    │   └── lazy.lua
    └── plugins/
        ├── lsp.lua
        ├── completion.lua
        ├── ui.lua
        └── ai.lua
```

## Instalação base

No macOS:

```bash
brew install neovim ripgrep fd lazygit
```

No Arch (btw):

```bash
sudo pacman -S neovim ripgrep fd lazygit
```

## Plugin manager: lazy.nvim

```lua
-- lua/config/lazy.lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable", lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup("plugins", {
  change_detection = { notify = false },
})
```

## Atalhos essenciais

| Atalho | Ação |
|--------|------|
| `<leader>ff` | Buscar arquivos (Telescope) |
| `<leader>fg` | Live grep |
| `<leader>aa` | Abrir chat com IA |
| `<leader>gg` | LazyGit |
| `<C-h/j/k/l>` | Navegar entre splits |
| `[d` / `]d` | Diagnostic anterior/próximo |

## Fluxo com IA

O plugin que mais mudou meu workflow é o **Avante.nvim** — um clone do Cursor dentro do Vim:

```lua
-- lua/plugins/ai.lua
return {
  "yetone/avante.nvim",
  event = "VeryLazy",
  build = "make",
  opts = {
    provider = "claude",
    auto_suggestions_provider = "claude",
    behaviour = {
      auto_suggestions = false, -- inline ghost text
    },
  },
}
```

Combina com `<leader>aa` para abrir o chat e `<leader>ae` para editar seleção.

```mermaid
flowchart LR
  A[Você escreve código] --> B{Precisa de ajuda?}
  B -->|Sim| C[<leader>aa]
  C --> D[Chat com Claude]
  D --> E[Aplica patch]
  B -->|Não| F[Continua codando]
  E --> F
```

## Performance

Inline com 50 plugins: **42ms** de startup. `nvim --startuptime startup.log` é seu amigo.

> Dica: `lazy.nvim` faz lazy-loading muito bem. Se algum plugin tá pesado, marca `event = "VeryLazy"` ou `cmd = "ComandoEspecifico"`.

## Conclusão

Neovim + IA no terminal é o setup mais **rápido** e **focado** que já tive. Sem distrações, sem janelas piscando, sem RAM evaporando.

Se quiser meu dotfiles completo, está no [github.com/axison/dotfiles](https://github.com/axison).

---

_Próximo post: como integro `tmux + neovim + zellij` num único workflow._
