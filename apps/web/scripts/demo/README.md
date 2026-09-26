# The demo

The hero's product demo, rendered frame by frame rather than screen-recorded.

## Why it is rendered

A screen recording of a terminal is noisy: font hinting varies, scroll timing is uneven, and the
file is large. This is composited from a scripted storyboard instead, so the result is
deterministic, re-generatable, and diffable.

## What it reproduces

The structure follows the reference `demo.gif` in the `demo-gif` skill, which was itself measured
frame by frame:

- A floating macOS window over a bled wallpaper, title bar and all.
- A full-window TUI capture, not a cropped sub-frame.
- **No typing animation.** The prompt line is complete in the first frame, exactly as in the
  reference. Motion is whole-row bursts and discrete scroll jumps.
- Row grammar: `● Verb(arg)` over an indented `└` detail line, `::` thought rows, a coral `*`
  running line, and green or coral status dots.
- A pinned input row and branch bar at the bottom that do not scroll with the transcript.
- Dark keystroke pill overlays on beats, removed by repainting the rows underneath.
- Single play, no loop extension on the GIF.

## What is different, and why

| | Reference | Here |
| --- | --- | --- |
| Canvas | 1552x992 | 1920x1200 |
| Frame rate | 10 fps | 12 fps |
| Frames | 414 | 446 |
| Running time | 42.4 s | 37.2 s |
| Wallpaper | orange/blue photographic arcs | Niki's warm-dusk field |
| Mark | pixel robot | the Niki mark |
| TUI background | teal `#002B36` | the landing canvas `#14120b` |

The colour changes are deliberate. The reference's teal panel reads as a foreign object on a warm
near-black page, and every text role in the reference palette fails WCAG AA against Niki's canvas.
The structure is the reference's; the colour is the site's, with every role re-picked to clear AA.

The file is also far smaller than the reference despite being larger and longer, because a
composited gradient wallpaper compresses much better than photographic noise.

## Regenerating

```bash
cd apps/web
python3 scripts/demo/render_demo.py --out /tmp/niki-demo
python3 scripts/demo/export_demo.py --frames /tmp/niki-demo/frames --out /tmp/niki-demo/out \
  --public public
```

Rendering takes about two minutes and writes 446 PNG frames. Export re-crops the TUI region,
builds a global palette, and writes the three assets.

Requires Pillow and an ffmpeg with `libvpx-vp9` and `libx264`.

## Outputs

| File | Where it ships | Notes |
| --- | --- | --- |
| `niki-demo.webm` | `public/niki-tui-demo.webm` | hero, VP9, ~0.33 MB |
| `niki-demo.mp4` | `public/niki-tui-demo.mp4` | hero fallback, H.264, ~0.53 MB |
| `niki-demo-poster.webp` | `public/niki-tui-demo-poster.webp` | end-card frame, for reduced motion |
| `niki-demo.gif` | `public/demo/niki-demo.gif` | standalone, full window, ~0.6 MB |

The hero crops the baked macOS title bar off and lets the landing's own `RunWindow` supply the
chrome. Keeping the bar would render a window inside a window.

## Editing the story

`render_demo.py` holds the storyboard in `build_beats()`. Beats accumulate rows onto a list, so
each beat shows one or two more lines than the last. Every noun in the story maps to something
Niki actually does: the four agents, `plan.md`, `changes.patch`, `report.md`,
`artifacts/*.json`, the branch gate, and a failing test suite that blocks the branch.
