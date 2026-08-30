import type { ImageMetadata } from "astro";
import aeris from "../assets/portraits/aeris.webp";
import avalokita from "../assets/portraits/avalokita.webp";
import ironRegent from "../assets/portraits/iron-regent.webp";
import littlePrince from "../assets/portraits/little-prince.webp";
import metis from "../assets/portraits/metis.webp";
import socrates from "../assets/portraits/socrates.webp";
import type { FigureSlug } from "../types/content";

export const PORTRAITS = {
  aeris,
  "iron-regent": ironRegent,
  avalokita,
  metis,
  socrates,
  "little-prince": littlePrince,
} satisfies Record<FigureSlug, ImageMetadata>;
