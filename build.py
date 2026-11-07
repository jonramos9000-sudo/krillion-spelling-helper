"""Build store packages for Chrome and Firefox from shared extension source."""
from pathlib import Path
import json
import shutil
import sys
import zipfile

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "source"
DIST = ROOT / "dist"
VERSION = sys.argv[1] if len(sys.argv) > 1 else "1.1.2"


def write_zip(path: Path, folder: Path, prefix: str = "") -> None:
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as archive:
        for item in sorted(folder.iterdir()):
            if item.is_file():
                archive.write(item, f"{prefix}{item.name}")


if DIST.exists():
    shutil.rmtree(DIST)
DIST.mkdir()

for browser in ("chrome", "firefox"):
    extension = DIST / browser
    extension.mkdir()
    for item in (SOURCE / "common").iterdir():
        if item.is_file():
            shutil.copy2(item, extension / item.name)
    manifest = json.loads((SOURCE / "manifests" / f"{browser}.json").read_text())
    manifest["version"] = VERSION
    (extension / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    shutil.copy2(SOURCE / "readmes" / f"{browser}.md", extension / "README.md")

    if browser == "chrome":
        write_zip(DIST / "krillion-spelling-helper-chrome.zip", extension)
    else:
        write_zip(DIST / "krillion-spelling-helper-firefox.xpi", extension)

print(f"Built Chrome and Firefox packages for version {VERSION} in {DIST}")
