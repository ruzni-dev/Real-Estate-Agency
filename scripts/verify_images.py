from pathlib import Path
EXPECTED = [
    'beanie-2562646_1280.jpg',
    'beard-1845166_1280.jpg',
    'architecture-1867187_1280.jpg',
    'house-1836070_1280.jpg',
    'living-room-1835923_640.jpg',
    'concert-hall-2526528_1280.jpg',
]

def main():
    root = Path(__file__).resolve().parents[1]
    assets = root / 'assets' / 'images'
    print('Checking', assets)
    ok = []
    missing = []
    placeholder = []
    for name in EXPECTED:
        p = assets / name
        if not p.exists():
            missing.append(name)
            continue
        size = p.stat().st_size
        # treat very small files as placeholders (<=2KB)
        if size <= 2048:
            placeholder.append((name, size))
        else:
            ok.append((name, size))

    if ok:
        print('\nReal files:')
        for n,s in ok:
            print(' -', n, f'({s} bytes)')
    if placeholder:
        print('\nLikely placeholders (<=2KB):')
        for n,s in placeholder:
            print(' -', n, f'({s} bytes)')
    if missing:
        print('\nMissing files:')
        for n in missing:
            print(' -', n)

    print('\nSummary: found', len(ok), 'real,', len(placeholder), 'placeholders,', len(missing), 'missing')

if __name__ == '__main__':
    main()
