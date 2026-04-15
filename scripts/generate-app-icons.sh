#!/usr/bin/env bash
# Gera ícones PWA (public/icons/*.png) e favicon.ico a partir de uma imagem quadrada ou retangular.
# Requer ImageMagick (convert).
# Uso: ./scripts/generate-app-icons.sh [caminho/para/fonte.png]
# Padrão: ./screen.png na raiz do projeto front.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${1:-$ROOT/screen.png}"
OUT_ICONS="$ROOT/public/icons"
FAV="$ROOT/public/favicon.ico"

if [[ ! -f "$SRC" ]]; then
  echo "Arquivo não encontrado: $SRC"
  echo "Salve o PNG do ícone em $ROOT/screen.png ou passe o caminho como argumento."
  exit 1
fi

if ! convert "$SRC" /dev/null 2>/dev/null; then
  echo "Arquivo de imagem inválido ou corrompido: $SRC"
  echo "Exporte novamente como PNG e tente de novo."
  exit 1
fi

mkdir -p "$OUT_ICONS"

# Redimensiona cobrindo o quadrado (crop central) para evitar distorção
for size in 72 96 128 144 152 192 384 512; do
  convert "$SRC" \
    -resize "${size}x${size}^" \
    -gravity center \
    -extent "${size}x${size}" \
    "$OUT_ICONS/icon-${size}x${size}.png"
done

TMPDIR="${TMPDIR:-/tmp}"
F16="$TMPDIR/pp-fav-16-$$.png"
F32="$TMPDIR/pp-fav-32-$$.png"
F48="$TMPDIR/pp-fav-48-$$.png"
convert "$SRC" -resize 16x16^ -gravity center -extent 16x16 "$F16"
convert "$SRC" -resize 32x32^ -gravity center -extent 32x32 "$F32"
convert "$SRC" -resize 48x48^ -gravity center -extent 48x48 "$F48"
convert "$F16" "$F32" "$F48" "$FAV"
rm -f "$F16" "$F32" "$F48"

echo "OK: $OUT_ICONS/icon-*.png e $FAV"
