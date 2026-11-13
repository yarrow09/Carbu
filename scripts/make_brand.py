"""Génère les images de marque de Carbu (custom_components/carbu/brand/).

Icône originale : goutte de carburant blanche portant une jauge, sur un carré
arrondi vert. Dessin vectoriel suréchantillonné (×4) puis réduit, pour un
rendu lissé. Usage : ``python scripts/make_brand.py``.
"""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

GREEN = (46, 125, 50, 255)  # #2e7d32, couleur « carburant » des cartes
WHITE = (255, 255, 255, 255)
OUT = Path(__file__).resolve().parent.parent / "custom_components" / "carbu" / "brand"


def draw(size: int) -> Image.Image:
    """Dessiner l'icône à la taille ``size`` (carrée)."""
    scale = 4
    s = size * scale
    image = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)

    # Fond : carré arrondi occupant toute l'image (pas de marge).
    d.rounded_rectangle((0, 0, s - 1, s - 1), radius=int(s * 0.22), fill=GREEN)

    # Goutte : cercle bas + triangle vers la pointe haute.
    cx = s / 2
    radius = s * 0.27
    cy = s * 0.60
    tip = s * 0.13
    d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=WHITE)
    # Tangentes depuis la pointe vers le cercle.
    dist = cy - tip
    angle = math.asin(radius / dist)
    for sign in (-1, 1):
        x = cx + sign * radius * math.cos(angle)
        y = cy - radius * math.sin(angle)
        d.polygon([(cx, tip), (x, y), (cx, cy)], fill=WHITE)
    d.polygon(
        [
            (cx, tip),
            (cx - radius * math.cos(angle), cy - radius * math.sin(angle)),
            (cx + radius * math.cos(angle), cy - radius * math.sin(angle)),
        ],
        fill=WHITE,
    )

    # Jauge dans la goutte : arc et aiguille vertes.
    gauge_r = radius * 0.62
    gy = cy + radius * 0.18
    width = max(1, int(s * 0.035))
    d.arc(
        (cx - gauge_r, gy - gauge_r, cx + gauge_r, gy + gauge_r),
        start=200,
        end=340,
        fill=GREEN,
        width=width,
    )
    needle = math.radians(-55)  # aiguille vers le haut à droite : « économique »
    nx = cx + gauge_r * 0.85 * math.cos(needle)
    ny = gy + gauge_r * 0.85 * math.sin(needle)
    d.line((cx, gy, nx, ny), fill=GREEN, width=width)
    hub = s * 0.035
    d.ellipse((cx - hub, gy - hub, cx + hub, gy + hub), fill=GREEN)

    return image.resize((size, size), Image.Resampling.LANCZOS)


def main() -> None:
    """Écrire icon.png (256 px) et icon@2x.png (512 px)."""
    OUT.mkdir(parents=True, exist_ok=True)
    for name, size in (("icon.png", 256), ("icon@2x.png", 512)):
        draw(size).save(OUT / name, optimize=True)
        print(OUT / name)


if __name__ == "__main__":
    main()
