# Build decisions

- The provided reference HTML file `reference/fde-mission-control.html` was not present in the project folder. Level 0 games were built from the written game descriptions in the build prompt; the missing prototype can be ported later if supplied.
- The DeepBook screenshot’s dark, immersive data field is represented with a small native canvas animation. This avoids adding a 3D framework dependency and keeps the visual light enough for a static, offline-capable site.
- Blue is used for primary actions, saffron for XP and learning milestones, and teal for success. These repeated labels support navigation and association; the app does not claim color alone improves memory.
- The company list is a dated snapshot of official career pages because version 1 is static and has no backend to refresh open roles automatically.
- Version 1 stores progress on the device and has no account system or server.
