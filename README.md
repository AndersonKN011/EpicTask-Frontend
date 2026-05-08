# 🛡️ EpicTask Mobile

O EpicTask transforma uma lista de tarefas em um sistema gamificado inspirado em RPG, incentivando produtividade através de progressão, níveis e penalidades.

---

## 🛠️ Tecnologias e Ferramentas

- React Native
- Expo
- TypeScript
- React Query (TanStack Query)
- TailwindCSS / NativeWind

---

## 🎮 Funcionalidades da Interface

### 📊 Dashboard de Status

Exibe barras dinâmicas de:
- HP (Vida)
- XP (Experiência)

Os dados são carregados diretamente do backend.

### 🎲 Sistema de Raridade

Ao criar uma tarefa, o usuário seleciona uma raridade para o card.

Com base nessa escolha, o frontend calcula automaticamente os valores de:
- experiência recebida
- dano causado ao jogador

### ✅ Feedback Visual

- Cards concluídos mudam para verde
- Botões são habilitados/desabilitados conforme o estado da tarefa

### 📝 Gerenciamento de Hábitos

Sistema de criação de missões com:
- título
- dificuldade
- raridade
- controle de conclusão
