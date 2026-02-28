# Aryan Energy Scroll Experience

Next.js App Router project with cinematic scroll-driven canvas sequences for Aryan Energy.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## System Evolution Frame Pipeline

`SystemEvolution` expects:

- `public/frames/system-evolution/frame_0001.webp`
- ...
- `public/frames/system-evolution/frame_0600.webp`

Source clips:

- `assets/system-evolution/raw/making-of-panel.mp4`
- `assets/system-evolution/raw/panel-to-inverter.mp4`
- `assets/system-evolution/raw/inverter-to-battery.mp4`
- `assets/system-evolution/raw/battery-to-system.mp4`

Merge list:

- `assets/system-evolution/merge.txt`

### Required tools

- `ffmpeg`
- `cwebp` (from libwebp)

### Run pipeline (Windows PowerShell)

```powershell
.\process-system-videos.ps1
```

Optional mobile frames (`public/frames-sm/system-evolution` at 1280 width):

```powershell
.\process-system-videos.ps1 -Mobile
```

### Run pipeline (WSL / Git Bash / macOS / Linux)

```bash
./process-system-videos.sh
```

Optional mobile frames:

```bash
./process-system-videos.sh --mobile
```

## Build Check

```bash
npm run build
```
