# 🤖 GPT-DUO: AI-to-AI Debate Framework

**GPT-DUO** is a lightweight Node.js application that lets two AI agents debate a topic, record their conversation, and summarize the outcome automatically using OpenAI’s new **Responses API** with **Structured Outputs**.

> 🧠 Who are the agents?:  
> A debate between *Ranil Wikramasingha* and *Anura Kumara Dissanayaka* on **“Making the Sri Lankan economy stable.”**

---

## 🚀 Features

- 🗣️ Two GPT agents take turns discussing a topic  
- 🎙️ Automatic transcript logging in `transcript.jsonl`  
- 🧾 Final structured JSON summary with agreements, disagreements & action items  
- 🧱 Uses the **OpenAI Responses API** (recommended)  
- ⚙️ Easily configurable prompts and models  
- 🧰 Clean modular code (TypeScript + ES Modules)

---

## 🧩 Project Structure

```
gpt-duo/
├─ .env.example              # API key placeholder
├─ .gitignore                # Ignores .env, node_modules, etc.
├─ package.json              # Dependencies & scripts
└─ src/
   ├─ llm.ts                 # Wrapper for OpenAI Responses API
   ├─ agents.ts              # Agent class (handles responses)
   ├─ orchestrator.ts        # Debate orchestration + summarization
   └─ index.ts               # CLI entry point
```

---

## ⚙️ Setup

### 1. Clone & install
```bash
git clone https://github.com/jeevakanuwan/gpt-duo.git
cd gpt-duo
npm install
```

### 2. Add your OpenAI API key
Create a `.env` file (or copy the example):
```bash
cp .env.example .env
```
Then edit:
```
OPENAI_API_KEY=sk-your-key-here
```

### 3. Run the debate
```bash
npm run start
```
or specify your own topic:
```bash
npm run start -- "How can Sri Lanka attract more foreign investment?"
```

---

## 📄 Output Files

| File | Description |
|------|--------------|
| **result.json** | Full run (agents, config, transcript, outcome, metrics) |
| **transcript.jsonl** | Raw JSON-lines of each turn for analytics or replay |

---

## 🧠 How It Works

1. Each agent (A & B) has its **own system prompt**.  
2. The orchestrator alternates turns up to `maxTurns` or until the phrase `AGREEMENT REACHED` appears.  
3. The full transcript is summarized using a **Structured JSON Output** schema for consistent downstream use.

---

## 🧰 Customization

- Change agent personas in `src/index.ts`
- Adjust max turns, model, or stop phrase in the `runDebate()` call
- Use any model supported by the Responses API (e.g. `gpt-4o-mini`, `gpt-4o`, etc.)

---

## 🧑‍💻 Example

```bash
npm run start -- "Making Sri Lankan economy stable"
```

**Agents**

-  *Ranil Wikramasingha*: pragmatic fiscal-stability focus  
-  *Anura Kumara Dissanayaka*: social-justice & accountability focus  

The app logs their exchange and produces a concise, structured summary.

---

## 📜 License

MIT License © Jeevaka Nuwan Fernando

---

## 💡 Future Ideas

- Third “referee” agent for scoring or fact-checking  
- Web-UI for live debates  
- Persistent history database (SQLite/Postgres)  
- Support for tool-calling or function-use inside debates

---

*Built with ❤️ using OpenAI’s Responses API and TypeScript.*