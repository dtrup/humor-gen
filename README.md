# Humor Lab 🎭

A tool for understanding and generating humor using cognitive science principles. Built on the theory that comedy arises from controlled violations of expectation that can be quickly repaired.

## Quick Start

### 1. Setup

```bash
cd app
npm install
```

### 2. Configure API Key

Create `.env` in the `app` folder:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## How It Works

Humor Lab follows a **4-step workflow**:

### Step 1: Extract Bindings (The "Setup")

1. Enter a **Topic** (e.g., "dating", "gym", "AI")
2. Select a **Voice** (e.g., Observational, Deadpan, Sardonic)
3. Click **"Extract Bindings →"**

**Result:** Cards appear showing "default interpretations" — the automatic meanings your audience attaches to the topic.

> 💡 **What's a Binding?** It's the default assumption people make. "Gym" binds to "fitness" and "self-improvement". Comedy breaks these assumptions.

---

### Step 2: Generate Jokes (The "Punchline")

1. **Click on 1+ binding cards** to select them
2. (Optional) Adjust **Operation Weights** to influence the style:
   - **Reversal** → flip expectations
   - **Emptying** → remove expected meaning
   - **Exposure** → reveal hidden truths
3. Click **"Generate from X bindings →"**

**Result:** The AI creates jokes that exploit your selected bindings using the weighted operations.

> 💡 **Pro Tip:** Weights over 60% become "preferred" instructions to the AI. Extract once, then regenerate with different weights to see varied styles!

---

### Step 3: Evaluate & Mutate

Each generated joke shows:
- **Scores:** Snap (binding strength), Originality, Economy
- **Mechanism:** Expandable view of default → twist → repair
- **Tags:** Operation type and violation category

**Actions:**
- 👍/👎 — Rate the joke
- 🧬 **Mutate** — Try a variation:
  - ✂️ Sharpen Twist
  - 🔪 Trim Setup
  - 🎭 More Misdirection
  - 🔄 Swap Operation
  - 💥 Amplify
  - 📝 Change Format
- 💾 **Save** — Add to your library

---

### Step 4: Save & Export

Go to the **Library** tab to:
- View all saved jokes with metadata
- 📥 Export as JSON
- 📋 Copy all jokes
- 🗑️ Delete individual jokes

---

## The Theory

The **Theory** tab explains the cognitive mechanics:

### The Formula
```
Strong Default + Detachment Operation + Quick Repair + Benignness = Funny
```

### 8 Detachment Operations
| Operation | What It Does |
|-----------|--------------|
| **Emptying** | Remove expected meaning |
| **Loading** | Attach unexpected meaning |
| **Exposure** | Reveal hidden truths |
| **Reflection** | Self-reference, meta |
| **Reversal** | Flip roles/status |
| **Overliteralization** | Take metaphors literally |
| **Category Crossing** | Mix incompatible categories |
| **Compression** | Maximum density |

### Benignness Strategies
Why we laugh instead of wince:
- Fictional Frame ("It's not real")
- Self-Inclusion ("I'm guilty too")
- Punching Up ("Target has power")
- Hyperbole ("Obviously exaggerated")
- Universal Truth ("We all do this")

---

## Configuration

### Voices (7 available)
| Voice | Style |
|-------|-------|
| 😐 Deadpan | Flat, understated |
| 🔍 Observational | "We all do this" |
| 🌀 Absurdist | Logic to extremes |
| 🙃 Self-Deprecating | Self as target |
| 😏 Sardonic | Bitter wit |
| ✨ Whimsical | Playful, light |
| 🍸 Dry Wit | Understated clever |

### Audiences (4 presets)
| Audience | Taboo Tolerance |
|----------|-----------------|
| Family | Very low |
| General | Moderate |
| Adult | High |
| Edgy | Very high |

---

## Tech Stack

- **Frontend:** Next.js 16 + React 19
- **Styling:** Tailwind CSS + Custom Design System
- **AI:** Google Gemini API
- **State:** React Query + localStorage

---

## File Structure

```
app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main UI
│   │   └── api/              # API routes
│   │       ├── extract-bindings/
│   │       ├── generate-jokes/
│   │       └── mutate-joke/
│   ├── components/
│   │   ├── ui/               # Design system
│   │   └── generation/       # Joke-specific components
│   └── lib/
│       ├── prompts/          # LLM prompt templates
│       ├── hooks/            # React Query hooks
│       ├── constants.ts      # Voices, audiences, defaults
│       └── types.ts          # TypeScript types
```

---

## License

MIT
