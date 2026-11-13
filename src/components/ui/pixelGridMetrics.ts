/** Pixel grid geometry shared by PixelGrid and anything sized to fit it. */

/** Cell size, in CSS pixels. */
export const PIXEL_BLOCK = 3
/** Space between cells — and at the grid's edges — in CSS pixels. */
export const PIXEL_GAP = 1
/** Distance from one cell to the next. */
export const PIXEL_CELL = PIXEL_BLOCK + PIXEL_GAP

/**
 * Extra space (0 to PIXEL_CELL - 1 px) to add to `size` so the grid fits it
 * exactly: n cells with one gap between each and one gap at both ends.
 */
export const fitPadding = (size: number) => {
  const remainder = (Math.round(size) - PIXEL_GAP) % PIXEL_CELL
  return remainder === 0 ? 0 : PIXEL_CELL - remainder
}
