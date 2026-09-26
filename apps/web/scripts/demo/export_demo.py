"""
Export the rendered demo frames.

Emits four things from one render pass:

  demo.gif              the full composition, wallpaper + window + TUI. This is
                        the deliverable the demo-gif skill describes.
  niki-demo.webm/.mp4   the TUI content alone, to sit inside the landing's own
                        window chrome rather than nesting a window in a window.
  niki-demo-poster.webp first frame of the TUI crop, for the video poster.

GIF encoding goes through ffmpeg's palettegen/paletteuse rather than a naive
GIF writer: a single global 256-colour palette is what keeps a 446-frame,
1920x1200 animation both small and free of the dither crawl that per-frame
quantisation produces on flat dark backgrounds.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from PIL import Image  # noqa: E402

from render_demo import CANVAS_H, CANVAS_W, FPS, SCALE, WIN_H, WIN_W, WIN_X, WIN_Y  # noqa: E402

# The hero now uses the whole composition. The desktop IS the product shot:
# wallpaper, menu bar, Terminal window, dock. Cropping any of it away would cut
# the menu bar or the dock off the frame.
CROP = (0, 0, CANVAS_W, CANVAS_H)

# GIF stores delays in hundredths of a second, so quantise to that grid.
GIF_DELAY_CS = max(2, round(100 / FPS))


def run(cmd: list[str]) -> None:
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise SystemExit(
            f"command failed: {' '.join(cmd[:6])} ...\n{result.stderr[-2000:]}"
        )


def make_tui_frames(frames_dir: str, out_dir: str) -> list[str]:
    """Crop the window region out of every full frame."""
    os.makedirs(out_dir, exist_ok=True)
    names = sorted(
        f for f in os.listdir(frames_dir) if f.startswith("full-") and f.endswith(".png")
    )
    paths: list[str] = []
    for name in names:
        src = os.path.join(frames_dir, name)
        dst = os.path.join(out_dir, name.replace("full-", "tui-"))
        if not os.path.exists(dst):
            Image.open(src).crop(CROP).save(dst)
        paths.append(dst)
    return paths


def encode_gif(tui_dir: str, names: list[str], out: str) -> None:
    """Full composition, single global palette, no loop extension."""
    palette = out + ".palette.png"
    run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-framerate", str(FPS), "-i", os.path.join(tui_dir, "full-%04d.png"),
            "-vf", f"palettegen=max_colors=256:stats_mode=diff",
            palette,
        ]
    )
    run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-framerate", str(FPS), "-i", os.path.join(tui_dir, "full-%04d.png"),
            "-i", palette,
            "-lavfi",
            f"paletteuse=dither=sierra2_4a:diff_mode=rectangle,setsar=1",
            "-loop", "0",
            "-gifflags", "+transdiff",
            out,
        ]
    )
    os.remove(palette)


def encode_video(tui_dir: str, names: list[str], out: str, codec: str) -> None:
    common = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-framerate", str(FPS), "-i", os.path.join(tui_dir, "tui-%04d.png"),
    ]
    if codec == "webm":
        run(
            common
            + [
                "-c:v", "libvpx-vp9",
                "-crf", "34", "-b:v", "0",
                "-row-mt", "1", "-pix_fmt", "yuv420p",
                "-an", out,
            ]
        )
    else:
        run(
            common
            + [
                "-c:v", "libx264",
                "-crf", "26", "-preset", "slow",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                "-an", out,
            ]
        )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--frames", default="/tmp/niki-demo/frames")
    parser.add_argument("--out", default="/tmp/niki-demo/out")
    parser.add_argument("--public", default=None, help="also copy site assets here")
    args = parser.parse_args()

    os.makedirs(args.out, exist_ok=True)
    frames_dir = args.frames

    names = make_tui_frames(frames_dir, frames_dir)
    print(f"frames ready: {len(names)}")

    gif = os.path.join(args.out, "niki-demo.gif")
    encode_gif(frames_dir, names, gif)
    print(f"gif   {os.path.getsize(gif) / 1e6:.1f} MB  {gif}")

    webm = os.path.join(args.out, "niki-demo.webm")
    encode_video(frames_dir, names, webm, "webm")
    print(f"webm  {os.path.getsize(webm) / 1e6:.2f} MB  {webm}")

    mp4 = os.path.join(args.out, "niki-demo.mp4")
    encode_video(frames_dir, names, mp4, "mp4")
    print(f"mp4   {os.path.getsize(mp4) / 1e6:.2f} MB  {mp4}")

    poster = os.path.join(args.out, "niki-demo-poster.webp")
    # The poster shows the finished ledger, not the empty cold open.
    poster_src = os.path.join(frames_dir, "tui-%04d.png" % (len(names) - 1))
    Image.open(poster_src).save(poster, "WEBP", quality=82, method=6)
    print(f"poster {os.path.getsize(poster) / 1e3:.0f} KB  {poster}")

    if args.public:
        os.makedirs(args.public, exist_ok=True)
        for src, name in (
            (webm, "niki-demo.webm"),
            (mp4, "niki-demo.mp4"),
            (poster, "niki-demo-poster.webp"),
        ):
            shutil.copy2(src, os.path.join(args.public, name))
            print(f"copied {name} -> {args.public}")


if __name__ == "__main__":
    main()
