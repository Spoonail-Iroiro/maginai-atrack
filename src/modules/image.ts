export type RectTuple = [number, number, number, number];

export interface IsesouLayer {
  cvs: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
}

export interface DrawInfoRect {
  cvs: HTMLCanvasElement | OffscreenCanvas;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  rect: RectTuple;
}

export interface DrawInfoTLWH {
  cvs: HTMLCanvasElement | OffscreenCanvas;
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * `srcInfo`をもとにctxを使用して(x,y)に画像を貼り付けます
 * （srcInfoがtop/left/width/heightの時用）
 */
export function pasteTLWH(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  srcInfo: DrawInfoTLWH,
  x: number,
  y: number
) {
  const c = srcInfo;
  ctx.drawImage(
    c.cvs,
    c.left,
    c.top,
    c.width,
    c.height,
    x,
    y,
    c.width,
    c.height
  );
}

/**
 * `srcInfo`をもとにctxを使用して(x,y)に画像を貼り付けます
 * （srcInfoがrectの時用）
 */
export function pasteRect(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  srcInfo: DrawInfoRect,
  x: number,
  y: number
) {
  const c = srcInfo;
  ctx.drawImage(
    c.cvs,
    c.rect[0],
    c.rect[1],
    c.rect[2],
    c.rect[3],
    x,
    y,
    c.rect[2],
    c.rect[3]
  );
}
