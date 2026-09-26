"""
Niki demo GIF renderer.

Reproduces the structure measured out of the reference `demo.gif` in
`~/.agents/skills/demo-gif/`: a floating macOS window over a bled wallpaper, a
full-window TUI capture, discrete text streaming with no typing animation, coral
spinner and thought rows, an orange running row, a dim completed ledger with
green/coral status dots, a pinned bottom input row and branch bar, and dark
pill keystroke overlays on beats.

Deliberate improvements over the reference:

  * Higher resolution. 1920x1200 rather than 1552x992.
  * More frames. 12 fps over a longer story, so the sequence is denser and the
    discrete scroll steps read as intentional motion instead of judder.
  * The wallpaper is Niki's warm-dusk field rather than the reference's
    orange/blue arcs, so the asset belongs to the site.
  * A drawn Niki mark replaces the reference's pixel robot.
  * A soft window shadow and a vignette give the composition depth the
    reference flattens away.

Two outputs come out of one pass, because the landing needs both:
`full` (wallpaper + window + TUI, the skill deliverable) and `tui` (the TUI
content alone, to sit inside the landing's own window chrome).

Usage:
  python3 render_demo.py --out /tmp/niki-demo
"""

from __future__ import annotations

import argparse
import math
import os
import shutil
import subprocess
from dataclasses import dataclass, field

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ---------------------------------------------------------------- canvas ----

# Design grid is half the export, matching the reference's 776x496 -> 1552x992
# convention. Ours is 960x600 -> 1920x1200.
DESIGN_W, DESIGN_H = 960, 540
SCALE = 2
CANVAS_W, CANVAS_H = DESIGN_W * SCALE, DESIGN_H * SCALE

PACE = 1.95  # scales authored holds up to the reference's 42s running time

FPS = 12
FRAME_MS = 1000 // FPS  # 83ms, quantised to GIF's 10ms grid on export

# Canvas geometry in design units. The canvas *is* the card: a light textured
# plate with a Terminal window on it, running past the bottom edge so the
# content is cropped rather than fitted. That crop is what makes it read as
# footage of a terminal rather than a diagram of one.
WIN_W = 740
WIN_X = (DESIGN_W - WIN_W) // 2
WIN_Y = 88
WIN_H = DESIGN_H - WIN_Y + 168  # deliberately past the bottom edge
WIN_R = 8

TITLEBAR_H = 32
PAD_X = 18

# ----------------------------------------------------------------- colour ---
# Sampled from the reference capture, then warmed to sit with Niki's palette.

# The reference runs its TUI on a teal panel. On Niki's warm canvas that teal
# reads as a foreign object pasted into the page, so the panel takes the site's
# own canvas and every text role is re-picked to clear WCAG AA against it.
# Structure, grammar and motion are the reference's; the colour is ours.
BG = (0x12, 0x12, 0x12)  # terminal surface
SURFACE = (0x1B, 0x19, 0x13)  # --landing-surface, for the submit block
INK = (0xE8, 0xEE, 0xF0)  # bold action text  15.98:1
INK_SOFT = (0x83, 0x94, 0x9B)  # prompt + body  5.95:1
DIM = (0x7E, 0x8B, 0x8F)  # indented detail lines  5.33:1
THOUGHT = (0x8A, 0x97, 0x9B)  # "Thought for Ns" rows  6.23:1
RUNNING = (0xE0, 0x97, 0x4E)  # the live orange line  7.77:1
ERROR = (0xE0, 0x70, 0x6A)  # failed step  5.97:1
GREEN = (0x5C, 0xBF, 0x6E)  # completed step  8.15:1
CORAL = (0xE6, 0x6F, 0x4D)  # brand + spinner  6.02:1
EMBER = (0xF5, 0x4E, 0x00)  # the brand accent  5.33:1
PAREN = (0xC0, 0x6A, 0x50)  # branch parens
DIVIDER = (0x2E, 0x2A, 0x22)  # hairlines, decorative
HEADER_TITLE = (0xB0, 0xAA, 0x9E)
HEADER_DIM = (0x8A, 0x84, 0x78)  # version, model and path lines
SUBMIT_BLOCK = (0x24, 0x20, 0x18)
CURSOR = (0x93, 0xA1, 0xA4)  # static block cursor  7.02:1

# macOS chrome. The window bar is a warm off-white rather than the system
# default, so it sits with Niki rather than shouting.
CHROME_BG = (0x17, 0x17, 0x19)
CHROME_TEXT = (0xD6, 0xD6, 0xDA)
CHROME_DIM = (0x8A, 0x8A, 0x90)
MENUBAR_BG = (0x24, 0x1E, 0x17)
MENUBAR_INK = (0xE8, 0xE4, 0xDE)
DOCK_BG = (0x2A, 0x26, 0x20)
DOCK_EDGE = (0x46, 0x40, 0x37)
PROMPT_USER = (0x7F, 0xC9, 0x8F)
PROMPT_PATH = (0x8A, 0xC7, 0xE8)
DOT_RED = (0xFB, 0x60, 0x5B)
DOT_YELLOW = (0xFE, 0xBC, 0x2F)
DOT_GREEN = (0x27, 0xC8, 0x40)

# Card texture. A cool, light paper, sampled off the reference: the plate reads
# as a physical surface the terminal is sitting on, which is why the dark window
# separates from it so cleanly.
CARD_HI = (0xD4, 0xE1, 0xF2)
CARD_MID = (0xC3, 0xD3, 0xE8)
CARD_LO = (0xAE, 0xC0, 0xD8)
CARD_WARM = (0xD8, 0xDD, 0xE4)

# ------------------------------------------------------------------- type ----

RUN_COMMAND = 'niki run "Add a /health endpoint"'

MONO_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
]
MONO_BOLD_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
]
SANS_BOLD_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def _first_existing(paths: list[str]) -> str:
    for path in paths:
        if os.path.exists(path):
            return path
    raise SystemExit(f"no usable font among: {paths}")


def load_font(candidates: list[str], size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(_first_existing(candidates), size)


# ------------------------------------------------------------------- rows ----


@dataclass
class Row:
    """One line of TUI content.

    `kind` picks the glyph and colour grammar. Action rows are a bold verb plus
    a dim argument, which is how the reference writes `Read(path)`. Detail rows
    are the indented `L` continuations under each action.
    """

    kind: str  # prose | action | detail | thought | running | next | error
    text: str
    arg: str = ""
    status: str | None = None  # dot colour for action rows


@dataclass
class Beat:
    """One discrete state of the transcript.

    The renderer holds each beat for a number of frames, so motion is whole-row
    bursts and scroll jumps rather than a tween, exactly as the reference does.
    """

    name: str
    rows: list[Row]
    hold: int = 8  # frames to hold this state
    running: bool = False  # draw the live orange row on top of `rows`
    running_text: str = "Working"
    running_next: str = "Next:"
    pill: str | None = None  # keystroke glyph overlay
    submitted: bool = False  # prompt block highlight on
    step: str = "1/8"


# ---------------------------------------------------------------- desktop ----

# ------------------------------------------------------------------ story ----
# Niki's actual product: four independent agents turn one sentence into a
# reviewable branch. Every noun here maps to something Niki really does.

def build_beats() -> list[Beat]:
    """Niki's actual product, told the way the reference tells its story.

    Four independent agents turn one sentence into a reviewable branch. The
    ledger builds one or two rows at a time so the transcript streams the way the
    reference's does, rather than jumping every couple of seconds. Every noun
    here is something Niki really does.
    """
    beats: list[Beat] = []
    acc: list[Row] = []

    def add(
        name: str,
        hold: int,
        *,
        step: str,
        running: str | None = None,
        nxt: str = "Next:",
        pill: str | None = None,
        submitted: bool = False,
    ) -> None:
        beats.append(
            Beat(
                name,
                list(acc),
                hold=hold,
                submitted=submitted,
                running=running is not None,
                running_text=running or "Working",
                running_next=nxt,
                pill=pill,
                step=step,
            )
        )

    def rows(*new_rows: Row) -> None:
        acc.extend(new_rows)

    # --- 1. Cold open: the prompt is already complete, no typing animation ---
    add("cold-open", 16, step="1/8", submitted=False)
    add("cold-open-hold", 6, step="1/8", submitted=False, pill="return")

    # --- 2. Submit: highlight block, status flips to thinking ---
    add("submit", 6, step="1/8", running="Planning the task", pill=None, submitted=True)

    # --- 3. Thinking: prose, a thought row, first reads ---
    rows(Row("prose", "I'll plan this first, then run it through the whole pipeline."))
    add("prose", 10, step="2/8", running="Planning the task", submitted=True)

    rows(Row("thought", "Thought for 4s (ctrl+o to show thinking)"))
    add("thought", 8, step="2/8", running="Reading the repository", nxt="Next: write a TaskSpec", submitted=True)

    # --- 4. Planner reads ---
    rows(Row("action", "Planner", "src/routes/health.ts", "green"), Row("detail", "Read 118 lines"))
    add("planner-1", 10, step="3/8", running="Reading the repository", nxt="Next: write a TaskSpec", submitted=True)

    rows(Row("action", "Planner", "tests/health.test.ts", "green"), Row("detail", "Read 64 lines"))
    add("planner-2", 10, step="3/8", running="Reading the repository", nxt="Next: write a TaskSpec", submitted=True)

    rows(Row("action", "Planner", "TaskSpec: add GET /health, 2 files", "green"))
    add("planner-3", 8, step="3/8", running="Writing the plan", nxt="Next: hand the TaskSpec to the Coder", submitted=True)

    rows(Row("detail", "plan.md written  ·  plan mode"))
    add("planner-4", 10, step="3/8", running="Applying the diff", nxt="Next: run the test suite", pill="return", submitted=True)

    # --- 5. Coder applies the change ---
    rows(Row("action", "Coder", "unified diff applied  +142  -6", "green"))
    add("coder-1", 10, step="4/8", running="Applying the diff", nxt="Next: run the test suite", submitted=True)

    rows(Row("detail", "changes.patch written"))
    add("coder-2", 8, step="4/8", running="Running the test suite", nxt="Next: check the suite", submitted=True)

    # --- 6. The suite fails. This is the beat the whole product is about. ---
    rows(
        Row("action", "Tester", "npx vitest run tests/health.test.ts", "coral"),
        Row("error", "Error: expected 200, received 404"),
    )
    add("tester-fail", 14, step="5/8", running="Running the test suite", nxt="Next: review the diff", pill="return", submitted=True)

    rows(Row("thought", "Thought for 3s (ctrl+o to show thinking)"))
    add("tester-think", 10, step="5/8", running="Diagnosing the failure", nxt="Next: amend the diff", submitted=True)

    # --- 7. The fix, and the gate that lets the branch exist ---
    rows(Row("action", "Coder", "fixed: match the mounted router prefix", "green"))
    add("fix-1", 10, step="5/8", running="Amending the diff", nxt="Next: re-run the suite", submitted=True)

    rows(Row("detail", "unified diff amended  +14  -3"))
    add("fix-2", 8, step="5/8", running="Re-running the suite", nxt="Next: re-run the suite", submitted=True)

    rows(Row("action", "Tester", "8/8 passed", "green"), Row("detail", "vitest 4 files, 0 failed"))
    add("tester-pass", 12, step="6/8", running="Reviewing the diff", nxt="Next: approve and branch", submitted=True)

    # --- 8. Reviewer approves, artifacts land, the branch appears ---
    rows(Row("action", "Reviewer", "approve: diff is scoped and tested", "green"))
    add("review-1", 10, step="7/8", running="Reviewing the diff", nxt="Next: write the run report", submitted=True)

    rows(Row("detail", "report.md written"))
    add("review-2", 8, step="7/8", running="Writing the artifacts", nxt="Next: create the branch", pill="return", submitted=True)

    rows(
        Row("action", "Niki", "artifacts/planner.json", "green"),
        Row("action", "Niki", "artifacts/coder.json", "green"),
    )
    add("artifacts-1", 8, step="8/8", running="Writing the artifacts", nxt="Next: create the branch", submitted=True)

    rows(
        Row("action", "Niki", "artifacts/tester.json", "green"),
        Row("action", "Niki", "artifacts/reviewer.json", "green"),
    )
    add("artifacts-2", 8, step="8/8", running="Creating the branch", nxt="Next: done", submitted=True)

    rows(
        Row("action", "Niki", "branch niki/4f2a created", "green"),
        Row("detail", "1 commit ahead of main  ·  main untouched"),
    )
    add("branch", 12, step="8/8", running="Creating the branch", nxt="Next: done", submitted=True)

    # --- 9. Settle: the running row clears and the ledger rests as the end card ---
    add("settle", 10, step="8/8", running=None, submitted=True)
    add("end", 30, step="8/8", running=None, submitted=True)

    # The reference is 42.4s. Holds below are authored for readability; this
    # scales them into the same running time without the end card dominating.
    for beat in beats:
        beat.hold = max(4, round(beat.hold * PACE))
    for beat in beats:
        if beat.name == "end":
            beat.hold = 26

    return beats


# ---------------------------------------------------------------- drawing ----


def text_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont) -> int:
    if not text:
        return 0
    return int(draw.textlength(text, font=font))


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_w: int) -> list[str]:
    """Greedy word wrap. The reference wraps prose across two lines."""
    words = text.split(" ")
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and text_width(draw, candidate, font) > max_w:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def _value_noise(w: int, h: int, cells: int, seed: int):
    """Smooth value noise on a coarse lattice, bilinearly interpolated."""
    import random

    rng = random.Random(seed)
    grid = [[rng.random() for _ in range(cells + 1)] for _ in range(cells + 1)]
    out = [[0.0] * w for _ in range(h)]
    for y in range(h):
        fy = y / (h - 1) * cells
        y0 = int(fy)
        y1 = min(y0 + 1, cells)
        sy = fy - y0
        sy = sy * sy * (3 - 2 * sy)
        row0, row1 = grid[y0], grid[y1]
        target = out[y]
        for x in range(w):
            fx = x / (w - 1) * cells
            x0 = int(fx)
            x1 = min(x0 + 1, cells)
            sx = fx - x0
            sx = sx * sx * (3 - 2 * sx)
            a = row0[x0] * (1 - sx) + row0[x1] * sx
            b = row1[x0] * (1 - sx) + row1[x1] * sx
            target[x] = a * (1 - sy) + b * sy
    return out


def draw_wallpaper(w: int, h: int) -> Image.Image:
    """The light card texture the terminal sits on.

    Multi-octave value noise plus a ridged layer for the veining that gives the
    plate its stone-paper look, then a soft vertical wash so the top of the card
    is a touch lighter than the bottom. Sampled from the reference's cool
    blue-grey rather than the site's warm neutrals, because a warm plate makes a
    dark window look muddy instead of crisp.
    """
    # Weighted toward the fine scales. The reference's plate is a paper or
    # stone surface, and without high-frequency detail it reads as a blur.
    octaves = [
        (_value_noise(w, h, 3, 11), 0.34),
        (_value_noise(w, h, 7, 29), 0.22),
        (_value_noise(w, h, 17, 47), 0.18),
        (_value_noise(w, h, 41, 53), 0.15),
        (_value_noise(w, h, 97, 59), 0.11),
    ]
    ridge = _value_noise(w, h, 9, 71)
    ridge_fine = _value_noise(w, h, 23, 83)

    import random

    rng = random.Random(101)
    grain = [rng.random() - 0.5 for _ in range(4096)]

    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        # Light at the top, cooler and a shade deeper toward the bottom.
        wash = y / (h - 1)
        base = [CARD_HI[i] * (1 - wash) + CARD_MID[i] * wash for i in range(3)]
        row = [0.0] * w
        for layer, weight in octaves:
            src = layer[y]
            for x in range(w):
                row[x] += src[x] * weight
        for x in range(w):
            # The reference plate is a fine paper: soft low-frequency mottle and
            # a visible grain, and nothing that reads as a pattern. Ridged noise
            # was tried here and produced contour outlines, so it is gone.
            g = grain[(y * 131 + x * 7) & 4095]
            k = (row[x] - 0.5) * 0.20 + g * 0.055
            px[x, y] = (
                max(0, min(255, int(base[0] + k * 66))),
                max(0, min(255, int(base[1] + k * 66))),
                max(0, min(255, int(base[2] + k * 58))),
            )
    return img


def draw_niki_mark(draw: ImageDraw.ImageDraw, x: int, y: int, size: int) -> None:
    """A drawn Niki mark in the brand ember, replacing the reference's robot.

    Same construction as the site's logo: a rounded square with a squared N.
    """
    draw.rounded_rectangle(
        (x, y, x + size, y + size), radius=max(2, size // 5), fill=CORAL
    )
    inset = size // 4
    lw = max(2, size // 10)
    draw.line(
        [
            (x + inset, y + size - inset),
            (x + inset, y + inset),
            (x + size - inset, y + size - inset),
            (x + size - inset, y + inset),
        ],
        fill=(0x14, 0x12, 0x0B),
        width=lw,
        joint="curve",
    )


class Renderer:
    def __init__(self) -> None:
        self.f_mono = load_font(MONO_CANDIDATES, 15 * SCALE)
        self.f_mono_b = load_font(MONO_BOLD_CANDIDATES, 15 * SCALE)
        self.f_mono_sm = load_font(MONO_CANDIDATES, 13 * SCALE)
        self.f_mono_sm_b = load_font(MONO_BOLD_CANDIDATES, 13 * SCALE)
        self.f_mono_lg = load_font(MONO_CANDIDATES, 16 * SCALE)
        self.f_title = load_font(MONO_CANDIDATES, 12 * SCALE)
        self.f_wallpaper = None
        self._measure = ImageDraw.Draw(Image.new("RGB", (8, 8)))

    # -- row layout ---------------------------------------------------------

    def measure(self, row: Row) -> list[str]:
        """Return the physical lines one logical row occupies.

        Action rows are `Glyph Bold(verb)` + `(arg)`; detail rows are indented
        under them. Prose wraps.
        """
        inner_w = WIN_W * SCALE - 2 * PAD_X * SCALE
        if row.kind == "prose":
            lines = wrap(self._measure, row.text, self.f_mono, inner_w - 18 * SCALE)
            return [f"●  {lines[0]}"] + [f"   {line}" for line in lines[1:]] if lines else []
        if row.kind == "action":
            verb = row.text
            arg = row.arg
            return [f"●  {verb}  {arg}"] if arg else [f"●  {verb}"]
        if row.kind == "detail":
            return [f"└  {row.text}"]
        if row.kind == "thought":
            return [f"::  {row.text}"]
        if row.kind == "running":
            return [f"*  {row.text}  (esc to interrupt)"]
        if row.kind == "next":
            return [f"└  {row.text}"]
        if row.kind == "error":
            return [f"└  {row.text}"]
        return [row.text]

    def draw_row(self, draw: ImageDraw.ImageDraw, row: Row, y: int) -> int:
        """Draw one logical row; return the y of the next row."""
        pitch = 22 * SCALE
        lines = self.measure(row)
        x0 = PAD_X * SCALE
        for i, line in enumerate(lines):
            self._draw_line(draw, row, line, x0, y + i * pitch, i)
        return y + len(lines) * pitch

    def _draw_line(self, draw, row: Row, line: str, x: int, y: int, line_index: int) -> None:
        mono, mono_b, mono_sm = self.f_mono, self.f_mono_b, self.f_mono_sm

        if row.kind == "prose":
            draw.text((x, y), line, font=mono, fill=INK_SOFT)
            return

        if row.kind == "action":
            colour = {
                "green": GREEN,
                "coral": CORAL,
            }.get(row.status or "", INK)
            # Glyph, then bold verb, then a dim argument.
            draw.ellipse(
                (x + 2 * SCALE, y + 6 * SCALE, x + 8 * SCALE, y + 12 * SCALE), fill=colour
            )
            cx = x + 18 * SCALE
            verb, _, rest = line[3:].partition("  ")
            draw.text((cx, y), verb, font=mono_b, fill=INK)
            if rest:
                draw.text(
                    (cx + text_width(draw, verb, mono_b) + 6 * SCALE, y),
                    rest,
                    font=mono,
                    fill=INK_SOFT,
                )
            return

        if row.kind == "detail":
            draw.text((x, y), "└", font=mono, fill=DIM)
            draw.text((x + 14 * SCALE, y), line[3:], font=mono_sm, fill=DIM)
            return

        if row.kind == "thought":
            draw.text((x, y), "::", font=mono, fill=THOUGHT)
            draw.text((x + 18 * SCALE, y), line[3:], font=mono_sm, fill=THOUGHT)
            return

        if row.kind == "running":
            draw.text((x, y), "*", font=mono, fill=RUNNING)
            draw.text((x + 14 * SCALE, y), line[3:], font=mono, fill=RUNNING)
            return

        if row.kind in ("next", "error"):
            colour = ERROR if row.kind == "error" else DIM
            font = mono if row.kind == "error" else mono_sm
            draw.text((x, y), "└", font=font, fill=colour)
            draw.text((x + 14 * SCALE, y), line[3:], font=font, fill=colour)
            return

        draw.text((x, y), line, font=mono, fill=INK_SOFT)

    # -- window chrome ------------------------------------------------------

    def draw_chrome(self, draw: ImageDraw.ImageDraw, title: str, step: str) -> None:
        sx, sy = WIN_X * SCALE, WIN_Y * SCALE
        sw, sh = WIN_W * SCALE, WIN_H * SCALE
        h = TITLEBAR_H * SCALE

        # Traffic lights.
        r = 4 * SCALE
        cy = sy + h // 2
        for i, colour in enumerate((DOT_RED, DOT_YELLOW, DOT_GREEN)):
            cx = sx + (14 + i * 11) * SCALE
            draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=colour)

        # Centred title, right step label.
        tw = text_width(draw, title, self.f_title)
        draw.text(
            (sx + sw // 2 - tw // 2, sy + h // 2 - 8 * SCALE), title, font=self.f_title, fill=CHROME_TEXT
        )
        lw = text_width(draw, step, self.f_mono_sm)
        draw.text(
            (sx + sw - PAD_X * SCALE - lw, sy + h // 2 - 7 * SCALE), step, font=self.f_mono_sm, fill=(0x6B, 0x6B, 0x70)
        )

    # -- pills --------------------------------------------------------------

    def draw_pill(self, draw: ImageDraw.ImageDraw, glyph: str) -> None:
        """A keystroke overlay: a dark keycap with a drawn symbol.

        Drawn rather than typed, so it reads as a key press instead of a text
        box. The reference does the same with a thin white glyph on near-black.
        """
        w, h = 78 * SCALE, 54 * SCALE
        cx = WIN_W * SCALE // 2
        cy = WIN_H * SCALE - 66 * SCALE

        draw.rounded_rectangle(
            (cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2),
            radius=12 * SCALE,
            fill=(0x11, 0x15, 0x19),
        )
        # A hairline top edge catches the light the way a physical keycap does.
        draw.line(
            (cx - w // 2 + 6 * SCALE, cy - h // 2 + 1, cx + w // 2 - 6 * SCALE, cy - h // 2 + 1),
            fill=(0x3A, 0x36, 0x30),
            width=SCALE,
        )

        ink = (0xFF, 0xFF, 0xFF)
        lw = 3 * SCALE
        a = 16 * SCALE  # glyph half-extent
        if glyph == "return":
            # Up-and-back: a vertical stem with a hook to the left, arrowhead on
            # the left end. This is the return/enter symbol.
            draw.line(
                [(cx + a, cy - a), (cx + a, cy), (cx - a, cy)],
                fill=ink,
                width=lw,
                joint="curve",
            )
            draw.line([(cx - a, cy), (cx - a + 8 * SCALE, cy - 8 * SCALE)], fill=ink, width=lw)
            draw.line([(cx - a, cy), (cx - a + 8 * SCALE, cy + 8 * SCALE)], fill=ink, width=lw)
        else:
            # Right arrow, for a forward step.
            draw.line([(cx - a, cy), (cx + a, cy)], fill=ink, width=lw)
            draw.line([(cx + a, cy), (cx + a - 8 * SCALE, cy - 8 * SCALE)], fill=ink, width=lw)
            draw.line([(cx + a, cy), (cx + a - 8 * SCALE, cy + 8 * SCALE)], fill=ink, width=lw)

    # -- frame --------------------------------------------------------------

    def frame(self, beat: Beat, out: "FrameSink") -> None:
        canvas = out.wallpaper.copy()

        # Window shadow, then the window body.
        shadow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(shadow)
        sx, sy = WIN_X * SCALE, WIN_Y * SCALE
        sw, sh = WIN_W * SCALE, WIN_H * SCALE
        sd.rounded_rectangle(
            (sx, sy + 10 * SCALE, sx + sw, sy + sh + 10 * SCALE),
            radius=WIN_R * SCALE,
            fill=(0, 0, 0, 130),
        )
        shadow = shadow.filter(ImageFilter.GaussianBlur(radius=22 * SCALE))
        canvas = Image.alpha_composite(canvas.convert("RGBA"), shadow).convert("RGB")

        win = Image.new("RGB", (sw, sh), BG)
        wd = ImageDraw.Draw(win)

        # Title bar.
        h = TITLEBAR_H * SCALE
        wd.rectangle((0, 0, sw, h), fill=CHROME_BG)
        r = 4 * SCALE
        for i, colour in enumerate((DOT_RED, DOT_YELLOW, DOT_GREEN)):
            cx = (14 + i * 11) * SCALE
            wd.ellipse((cx - r, h // 2 - r, cx + r, h // 2 + r), fill=colour)
        step = self._step_label(beat)
        tw = text_width(wd, self._title, self.f_title)
        wd.text(
            (sw // 2 - tw // 2, h // 2 - 9 * SCALE),
            self._title,
            font=self.f_title,
            fill=CHROME_TEXT,
        )
        lw = text_width(wd, step, self.f_mono_sm)
        wd.text(
            (sw - PAD_X * SCALE - lw, h // 2 - 8 * SCALE),
            step,
            font=self.f_mono_sm,
            fill=(0x6B, 0x6B, 0x70),
        )

        self._draw_body(wd, beat, h)
        # The window is taller than the card, so pasting it crops its bottom edge
        # and the transcript runs off the frame the way real footage does.
        canvas.paste(win.crop((0, 0, sw, min(win.size[1], canvas.size[1] - sy))), (sx, sy))

        out.write(canvas)

    def _draw_body(self, draw: ImageDraw.ImageDraw, beat: Beat, titlebar_h: int) -> None:
        sw = WIN_W * SCALE
        sh = WIN_H * SCALE
        x0 = PAD_X * SCALE
        y = titlebar_h + 14 * SCALE

        # --- header: mark, name/version, model, path ---
        mark = 30 * SCALE
        draw_niki_mark(draw, x0, y, mark)
        ty = y + 1 * SCALE
        name_w = text_width(draw, "Niki", self.f_mono_b)
        draw.text((x0 + mark + 14 * SCALE, ty), "Niki", font=self.f_mono_b, fill=HEADER_TITLE)
        draw.text(
            (x0 + mark + 14 * SCALE + name_w + 6 * SCALE, ty),
            "v0.8.0",
            font=self.f_mono,
            fill=HEADER_DIM,
        )
        draw.text(
            (x0 + mark + 14 * SCALE, ty + 15 * SCALE),
            "Planner · Coder · Tester · Reviewer",
            font=self.f_mono_sm,
            fill=HEADER_DIM,
        )
        draw.text(
            (x0 + mark + 14 * SCALE, ty + 30 * SCALE),
            "/Users/ravani/niki/flawed-app",
            font=self.f_mono_sm,
            fill=HEADER_DIM,
        )

        y = ty + 52 * SCALE
        draw.line((x0, y, sw - x0, y), fill=DIVIDER, width=SCALE)
        y += 14 * SCALE

        # --- prompt row ---
        # A shell prompt, so the window reads as a real Terminal rather than a
        # mock UI. Host and path are coloured the way a real prompt is.
        font = self.f_mono
        cx = x0
        for chunk, colour in (
            ("niki", PROMPT_USER),
            ("@", INK_SOFT),
            ("flawed-app", PROMPT_USER),
            ("  ~/flawed-app  ", PROMPT_PATH),
        ):
            draw.text((cx, y), chunk, font=font, fill=colour)
            cx += text_width(draw, chunk, font) + 2 * SCALE
        draw.text((cx, y), "$", font=font, fill=INK_SOFT)
        cx += text_width(draw, "$", font) + 4 * SCALE

        command_x = cx
        command = RUN_COMMAND
        cw = text_width(draw, command, font)
        if beat.submitted:
            # The reference paints a highlight block behind the submitted line.
            draw.rectangle(
                (command_x - 3 * SCALE, y - 3 * SCALE, command_x + cw + 5 * SCALE, y + 18 * SCALE),
                fill=SUBMIT_BLOCK,
            )
        draw.text((command_x, y), command, font=font, fill=INK)
        if not beat.submitted:
            # Cursor trails the command, the way a shell leaves it.
            draw.rectangle(
                (command_x + cw + 4 * SCALE, y - 1 * SCALE, command_x + cw + 13 * SCALE, y + 15 * SCALE),
                fill=CURSOR,
            )
        y += 26 * SCALE

        draw.line((x0, y, sw - x0, y), fill=DIVIDER, width=SCALE)
        y += 12 * SCALE

        # --- streaming body, bottom-aligned so new rows push old ones up ---
        lines: list[tuple[Row, str]] = []
        for row in beat.rows:
            for line in self.measure(row):
                lines.append((row, line))

        if beat.running:
            for row in (
                Row("running", beat.running_text),
                Row("next", beat.running_next),
            ):
                measured = self.measure(row)
                lines.append((row, measured[0] if measured else ""))

        pitch = 22 * SCALE
        status_h = 22 * SCALE
        input_h = 30 * SCALE
        avail = sh - y - (status_h + input_h + 12 * SCALE)

        # Discrete scroll: the tail is shown, older lines are cut. One jump per
        # beat, never a tween.
        max_lines = max(1, int(avail // pitch))
        visible = lines[-max_lines:]

        for row, line in visible:
            if line:
                self._draw_line(draw, row, line, x0, y, 0)
            y += pitch

        # --- pinned input row + status bar ---
        input_y = sh - status_h - input_h
        draw.line((x0, input_y, sw - x0, input_y), fill=DIVIDER, width=SCALE)
        draw.text((x0, input_y + 8 * SCALE), ">", font=self.f_mono_lg, fill=INK_SOFT)
        draw.rectangle(
            (x0 + 16 * SCALE, input_y + 7 * SCALE, x0 + 28 * SCALE, input_y + 27 * SCALE),
            fill=CURSOR,
        )
        draw.line((x0, input_y + input_h, sw - x0, input_y + input_h), fill=DIVIDER, width=SCALE)

        branch = "niki/4f2a" if (beat.submitted and not beat.running) else "main"
        draw.text((x0, input_y + input_h + 5 * SCALE), branch, font=self.f_mono, fill=HEADER_DIM)
        draw.text(
            (x0 + 14 * SCALE + text_width(draw, branch, self.f_mono), input_y + input_h + 5 * SCALE),
            f"({branch})",
            font=self.f_mono,
            fill=PAREN,
        )
        if not beat.submitted:
            right = "/ide for Niki"
        elif beat.running:
            right = "Thinking on (tab to toggle)"
        else:
            right = "Done  ·  branch niki/4f2a"
        rw = text_width(draw, right, self.f_mono)
        rx = sw - x0 - rw
        draw.ellipse(
            (rx - 14 * SCALE, input_y + input_h + 8 * SCALE, rx - 8 * SCALE, input_y + input_h + 14 * SCALE),
            outline=HEADER_DIM,
            width=SCALE,
        )
        draw.text((rx, input_y + input_h + 5 * SCALE), right, font=self.f_mono, fill=HEADER_DIM)

        if beat.pill:
            self.draw_pill(draw, beat.pill)

    def _step_label(self, beat: Beat) -> str:
        return beat.step


class FrameSink:
    def __init__(self, out_dir: str, keep: set[int], wallpaper: Image.Image) -> None:
        self.out_dir = out_dir
        self.wallpaper = wallpaper
        self.keep = set(keep)
        self.index = 0
        self.paths: list[tuple[str, int]] = []

    def write(self, img: Image.Image) -> None:
        full = os.path.join(self.out_dir, "frames", f"full-{self.index:04d}.png")
        img.save(full)
        if self.index in self.keep:
            tui = self._crop_tui(img)
            tui_path = os.path.join(self.out_dir, "frames", f"tui-{self.index:04d}.png")
            tui.save(tui_path)
        self.paths.append((full, FRAME_MS))
        self.index += 1

    def _crop_tui(self, img: Image.Image) -> Image.Image:
        """The TUI content alone, for the landing's own window chrome."""
        return img.crop(
            (WIN_X * SCALE, WIN_Y * SCALE, (WIN_X + WIN_W) * SCALE, (WIN_Y + WIN_H) * SCALE)
        )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="/tmp/niki-demo")
    parser.add_argument("--preview", type=int, default=8, help="sample frames to save")
    args = parser.parse_args()

    out_dir = args.out
    shutil.rmtree(out_dir, ignore_errors=True)
    os.makedirs(os.path.join(out_dir, "frames"), exist_ok=True)

    beats = build_beats()
    total = sum(b.hold for b in beats)

    # Sample a few frames for visual review.
    step = max(1, total // args.preview)
    keep = set(range(0, total, step)) | {0, total - 1}

    renderer = Renderer()
    renderer._title = "Niki run"

    wall = draw_wallpaper(CANVAS_W, CANVAS_H)
    renderer.wallpaper = wall
    renderer._wallpaper = wall

    sink = FrameSink(out_dir, keep, wall)

    # Expand beats into a frame list.
    print(f"beats={len(beats)} total_frames={total} fps={FPS}")
    for beat in beats:
        for _ in range(beat.hold):
            renderer.frame(beat, sink)

    print(f"rendered {sink.index} frames at {CANVAS_W}x{CANVAS_H}")
    with open(os.path.join(out_dir, "manifest.txt"), "w") as fh:
        for path, delay in sink.paths:
            fh.write(f"{path}\t{delay}\n")


if __name__ == "__main__":
    main()
