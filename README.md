# Claro

> Status: partial source only — see `RELAY-NOTE.md`. The app does not build/run yet
> (`claro-app.tsx`, `claro-owner.tsx`, `claro-public.tsx`, `intake.ts`, `files.ts`, `package.json`/config are missing;
> git history — all branches — was searched on Oct 26, 2026 and contains no other copy).

## 3D depth effect (`src/lib/claro/depth3d.js`)

Self-contained, silent canvas renderer ("3D depth effect / Efecto de profundidad 3D"): perspective tilt,
parallax particle layers, depth shadow. No dependencies, network, audio or credentials. Same module as in
One-Minute Answer Page.

```js
Depth3D.enabled = true;
Depth3D.render(ctx, (c) => drawYourFlatFrame(c), performance.now()); // call per animation frame
```

Draws onto the same canvas, so `canvas.captureStream()` + `MediaRecorder` recordings include it.
It is a procedural effect only — fully AI-generated scenes need a supported video service connected
(`video.ts` targets xAI `grok-imagine-video`, which requires `XAI_API_KEY` on the server; not configured here).

The "Create a 3D Video / Crear un video 3D" first-screen button is **not wired** because the main screen
(`src/components/claro-app.tsx`) was never received.
