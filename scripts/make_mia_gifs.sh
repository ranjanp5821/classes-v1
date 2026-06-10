#!/usr/bin/env bash
# Regenerate the small-circle assistant GIFs from the Anam avatar's idle video.
#
#   public/assets/vidya-idle.gif     calm "idle" loop of the avatar (Mia)
#   public/assets/vidya-talking.gif  same girl + animated speaking equalizer,
#                                     shown only while our model is responding
#
# The idle source comes from Anam (GET /v1/avatars/{id} -> videoUrl). That URL
# is signed (~1h TTL), so this script fetches it fresh each run using the key
# in .env. Run from the repo root:  bash scripts/make_mia_gifs.sh
set -euo pipefail
cd "$(dirname "$0")/.."

KEY=$(grep '^ANAM_API_KEY=' .env | cut -d= -f2-)
AV=$(grep '^ANAM_AVATAR_ID=' .env | cut -d= -f2-)
VURL=$(curl -s -H "Authorization: Bearer $KEY" "https://api.anam.ai/v1/avatars/$AV" \
        | python3 -c "import sys,json;print(json.load(sys.stdin)['videoUrl'])")

SRC=$(mktemp /tmp/mia_idle.XXXXXX)   # ffmpeg sniffs the format; no extension needed
curl -s "$VURL" -o "$SRC"

# ── Idle: center-crop square on the face, 240px, 12fps, ~4s, quality palette ──
ffmpeg -y -loglevel error -ss 1 -t 4 -i "$SRC" \
  -vf "crop=480:480:120:0,scale=240:240,fps=12,palettegen=stats_mode=diff" /tmp/pal_idle.png
ffmpeg -y -loglevel error -ss 1 -t 4 -i "$SRC" -i /tmp/pal_idle.png \
  -lavfi "crop=480:480:120:0,scale=240:240,fps=12[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 public/assets/vidya-idle.gif

# ── Talking ────────────────────────────────────────────────────────────────
# PREFERRED: a real "talking" capture of the avatar (her lips actually move).
# Produce one first with:  node scripts/capture_mia_talking.mjs  (needs Anam
# streaming quota). It writes /tmp/mia_talk.webm. Override path with TALK_SRC=…
TALK_SRC="${TALK_SRC:-/tmp/mia_talk.webm}"
if [ -f "$TALK_SRC" ]; then
  echo "using real talking capture: $TALK_SRC (lips move)"
  # Center square-crop on the face, regardless of source dimensions.
  W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width  -of csv=p=0 "$TALK_SRC")
  H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$TALK_SRC")
  S=$(( W < H ? W : H )); X=$(( (W - S) / 2 )); Y=$(( (H - S) / 2 ))
  TFILT="crop=${S}:${S}:${X}:${Y},scale=240:240,fps=14"
  # Pick a 3.5s talking segment (skip the first ~1.5s of session start-up).
  ffmpeg -y -loglevel error -ss 1.5 -t 3.5 -i "$TALK_SRC" -vf "${TFILT},palettegen=stats_mode=diff" /tmp/pal_talk.png
  ffmpeg -y -loglevel error -ss 1.5 -t 3.5 -i "$TALK_SRC" -i /tmp/pal_talk.png \
    -lavfi "${TFILT}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
    -loop 0 public/assets/vidya-talking.gif
else
  echo "no talking capture found — using equalizer placeholder (no lip movement)"
  # Fallback: same girl (idle) + animated speaking equalizer overlay.
  FILT="crop=480:480:120:0,scale=240:240,setpts=PTS/1.4,fps=14,\
drawbox=x=64:y=165:w=112:h=64:color=black@0.25:t=fill,\
drawbox=x=74:y=222-(14+30*abs(sin(2*PI*3*t))):w=12:h=14+30*abs(sin(2*PI*3*t)):color=white@0.92:t=fill,\
drawbox=x=94:y=222-(14+30*abs(sin(2*PI*3*t+0.9))):w=12:h=14+30*abs(sin(2*PI*3*t+0.9)):color=white@0.92:t=fill,\
drawbox=x=114:y=222-(14+30*abs(sin(2*PI*3*t+1.8))):w=12:h=14+30*abs(sin(2*PI*3*t+1.8)):color=white@0.92:t=fill,\
drawbox=x=134:y=222-(14+30*abs(sin(2*PI*3*t+2.7))):w=12:h=14+30*abs(sin(2*PI*3*t+2.7)):color=white@0.92:t=fill,\
drawbox=x=154:y=222-(14+30*abs(sin(2*PI*3*t+3.6))):w=12:h=14+30*abs(sin(2*PI*3*t+3.6)):color=white@0.92:t=fill"
  ffmpeg -y -loglevel error -ss 9 -t 4 -i "$SRC" -vf "${FILT},palettegen=stats_mode=diff" /tmp/pal_talk.png
  ffmpeg -y -loglevel error -ss 9 -t 4 -i "$SRC" -i /tmp/pal_talk.png \
    -lavfi "${FILT}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3" \
    -loop 0 public/assets/vidya-talking.gif
fi

rm -f "$SRC"
echo "wrote public/assets/vidya-idle.gif and public/assets/vidya-talking.gif"
