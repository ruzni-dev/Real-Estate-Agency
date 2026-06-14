from pathlib import Path

root = Path(__file__).resolve().parent.parent
replacements = [
    ("css/main.css", "assets/css/main.css"),
    ("../css/main.css", "../assets/css/main.css"),
    ("./css/tailwind.css", "./assets/css/tailwind.css"),
    ("./css/main.css", "./assets/css/main.css"),
]
files = [root / "index.html"] + sorted(root.glob("pages/*.html")) + [root / "package.json"]
updated_files = []
for path in files:
    text = path.read_text(encoding="utf-8")
    new_text = text
    for old, new in replacements:
        new_text = new_text.replace(old, new)
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        updated_files.append(str(path.relative_to(root)))
print("Updated files:", updated_files)
