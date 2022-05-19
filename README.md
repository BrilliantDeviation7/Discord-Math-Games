# Discord Math Games Bot by BDimension7

This Discord bot brings the AoPS Reaper game to Discord with additional features:

- Point donations
- Dueling
- Lifetime leaderboard

### **Default Modifications For Low Player Count**

Let $t$ be the number of milliseconds reaped. If $t > 10,000$, then $t$ is updated to $\sqrt{t \cdot 10^7}$.

### **Installation**

The bot is hosted on [Repl.it](https://replit.com) and written in JavaScript.

To run on Repl.it, install these packages with the Repl.it Package Manager:

- @replit/database
- discord.js
- express
- fraction.js

![Repl.it Package Manager](./images/replit_packages.png)

Roadmap:

- Implement dueling reward system
- Implement time robbery
- Implement donation limits
- Greed Control
