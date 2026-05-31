"""Regenerate Android + iOS launcher icons.

- Launcher icons: src/assets/images/applogo.png
- Android 12+ splash animated icon: src/assets/images/splash.png (higher-res to avoid blur)
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
RES = ROOT / "android" / "app" / "src" / "main" / "res"
LAUNCHER_SOURCE = ROOT / "src" / "assets" / "images" / "applogo.png"
SPLASH_SOURCE = ROOT / "src" / "assets" / "images" / "splash.png"
IOS_ICON = (
    ROOT
    / "ios"
    / "aceCamMobile"
    / "Images.xcassets"
    / "AppIcon.appiconset"
    / "Icon-App-1024x1024@1x.png"
)

BACKGROUND = (255, 255, 255, 255)
# Logo occupies this fraction of the square (lower = more padding / less zoomed in).
LOGO_FILL_RATIO = 0.66
SPLASH_FILL_RATIO = 0.74

MIPMAP_SIZES = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

FOREGROUND_SIZES = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}


def trim_near_white_border(img: Image.Image, threshold: int = 248) -> Image.Image:
    """Remove excess white padding from the source asset."""
    rgba = img.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 16:
                continue
            if r >= threshold and g >= threshold and b >= threshold:
                continue
            found = True
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)
    if not found:
        return rgba
    return rgba.crop((min_x, min_y, max_x + 1, max_y + 1))


def crop_center_square(img: Image.Image) -> Image.Image:
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    return img.crop((left, top, left + side, top + side))


def fit_on_square(img: Image.Image, size: int, fill_ratio: float) -> Image.Image:
    trimmed = trim_near_white_border(img)
    target = max(1, int(size * fill_ratio))
    fitted = trimmed.copy()
    fitted.thumbnail((target, target), Image.Resampling.LANCZOS)
    out = Image.new("RGBA", (size, size), BACKGROUND)
    x = (size - fitted.width) // 2
    y = (size - fitted.height) // 2
    out.paste(fitted, (x, y), fitted)
    return out


def load_rgba(path: Path) -> Image.Image:
    if not path.is_file():
        raise SystemExit(f"Missing source: {path}")
    return Image.open(path).convert("RGBA")


def main() -> None:
    launcher = load_rgba(LAUNCHER_SOURCE)
    master = fit_on_square(launcher, 1024, LOGO_FILL_RATIO)
    IOS_ICON.parent.mkdir(parents=True, exist_ok=True)
    master.save(IOS_ICON, format="PNG", optimize=True)
    print(f"Wrote iOS 1024 icon -> {IOS_ICON}")

    for folder, px in MIPMAP_SIZES.items():
        icon = fit_on_square(launcher, px, LOGO_FILL_RATIO)
        out_dir = RES / folder
        out_dir.mkdir(parents=True, exist_ok=True)
        for name in ("ic_launcher.png", "ic_launcher_round.png"):
            path = out_dir / name
            icon.convert("RGB").save(path, format="PNG", optimize=True)
            print(f"Wrote {path}")

    splash_sq = crop_center_square(load_rgba(SPLASH_SOURCE))
    for folder, px in FOREGROUND_SIZES.items():
        fg = fit_on_square(splash_sq, px, SPLASH_FILL_RATIO)
        path = RES / folder / "ic_launcher_foreground.png"
        path.parent.mkdir(parents=True, exist_ok=True)
        fg.save(path, format="PNG", optimize=True)
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()
