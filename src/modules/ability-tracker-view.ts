import maginai from 'maginai';
import * as imageUtil from './image.js';
export class AbilityTrackerView {
  cvs: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
  lastRect: [number, number, number, number] | null;
  private isRefreshRequired: boolean;
  private text: string;
  constructor() {
    this.cvs = new OffscreenCanvas(100, 100);
    const ctx = this.cvs.getContext('2d');
    if (ctx === null) {
      throw new Error('Image not available');
    }
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false;
    this.lastRect = null;

    this.isRefreshRequired = false;
    this.text = '';
  }

  init() {
    const trackerView = this;
    maginai.patcher.patchMethod(tGameTime, 'frameActionDraw', (origMethod) => {
      const rtnFn = function (this: tGameTime, ...args: any[]) {
        const rtn = origMethod.call(this, ...args);
        trackerView.draw();
        return rtn;
      };
      return rtnFn;
    });

    // Update on save loaded
    // maginai.events.saveLoaded.addHandler(() => {
    //   this.isRefreshRequired = true;
    // });
  }

  private getViewImage(text: string): imageUtil.DrawInfoRect {
    // clear
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

    // draw window background
    this.ctx.globalAlpha = 0.4;
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);

    this.ctx.globalAlpha = 1;

    const gm = tWgm;

    const textImage = gm.tGameText.createText({
      text: text,
      maxWidth: this.cvs.width - 5,
      fontSize: 11,
      lineHeight: 0,
    });

    imageUtil.pasteTLWH(this.ctx, textImage, 5, 5);

    return {
      cvs: this.cvs,
      ctx: this.ctx,
      rect: [0, 0, this.cvs.width, this.cvs.height],
    };
  }

  private drawToLayer(targetLayer: imageUtil.IsesouLayer, text: string) {
    if (this.lastRect !== null) {
      targetLayer.ctx.clearRect(...this.lastRect);
    }
    const image = this.getViewImage(text);
    const rect: imageUtil.RectTuple = [5, 66, image.rect[2], image.rect[3]];
    imageUtil.pasteRect(targetLayer.ctx, image, rect[0], rect[1]);
    this.lastRect = rect;
  }

  draw() {
    if (this.isRefreshRequired) {
      this.drawToLayer(
        tWgm.screen.layers.over,
        this.text
        // '%c[nowtime]' + this.count.toString() + '\ncount'
      );
      this.isRefreshRequired = false;
    }
  }

  setText(text: string) {
    this.text = text;
    this.isRefreshRequired = true;
  }
}
