import { CanvasContext } from "@tarojs/taro";

export default class JCanvasContext {
  private ctx: CanvasContext;
  private chart: any;
  private canvasNode: any;
  private event: {};

  constructor(ctx: CanvasContext, isNew: boolean, canvasNode?: any) {
    this.ctx = ctx;
    this.chart = null;
    if (isNew) {
      this.canvasNode = canvasNode;
    } else {
      if(process.env.TARO_ENV === 'dd' || process.env.TARO_ENV === 'alipay'){
        this._initAlipayStyle(ctx);
      }else{
        this._initWxStyle(ctx);
      }
    }

    // this._initCanvas(zrender, ctx);

    this._initEvent();
  }

  getContext(contextType) {
    if (contextType === '2d') {
      return this.ctx;
    }
  }

  // canvasToTempFilePath(opt) {
  //   if (!opt.canvasId) {
  //     opt.canvasId = this.canvasId;
  //   }
  //   return wx.canvasToTempFilePath(opt, this);
  // }

  setChart(chart) {
    this.chart = chart;
  }

  attachEvent() {
    // noop
  }

  detachEvent() {
    // noop
  }

  _initCanvas(zrender, ctx) {
    zrender.util.getContext = function () {
      return ctx;
    };

    zrender.util.$override('measureText', function (text, font) {
      ctx.font = font || '12px sans-serif';
      return ctx.measureText(text);
    });
  }

  _initWxStyle(ctx) {
    var styles = [
      'fillStyle',
      'strokeStyle',
      'globalAlpha',
      'textAlign',
      'textBaseAlign',
      'shadow',
      'lineWidth',
      'lineCap',
      'lineJoin',
      'lineDash',
      'miterLimit',
      'fontSize',
    ];

    styles.forEach(style => {
      Object.defineProperty(ctx, style, {
        set: value => {
          if (
            (style !== 'fillStyle' && style !== 'strokeStyle') ||
            (value !== 'none' && value !== null)
          ) {
            ctx['set' + style.charAt(0).toUpperCase() + style.slice(1)](value);
          }
        },
      });
    });

    ctx.createRadialGradient = function () {
      return ctx.createCircularGradient.apply(ctx, arguments);
    };
  }
  strLen(str: string) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
        len++;
      } else {
        len += 2;
      }
    }
    return len;
  }
  _initAlipayStyle(ctx){
    var styles = [
      'fillStyle',
      'strokeStyle',
      'globalAlpha',
      'textAlign',
      'textBaseAlign',
      'shadow',
      'lineWidth',
      'lineCap',
      'lineJoin',
      'lineDash',
      'miterLimit',
      'fontSize',
      'font'
    ];

    styles.forEach(style => {
      Object.defineProperty(ctx, style, {
        set: value => {
          if(value !== null&&value !== 'none'){
            if (style === 'shadow' && ctx.setShadow && Array.isArray(value)) {
              ctx.setShadow(value[0], value[1], value[2], value[3]);
              return;
            }
            const name = 'set' + style.charAt(0).toUpperCase() + style.slice(1);
            ctx[name]&&ctx[name](value);
          }

        },
      });
    });

    ctx.createRadialGradient = function () {
      return ctx.createCircularGradient.apply(ctx, arguments);
    };

    if (!ctx.measureText) {
      ctx.measureText = (text: string) => {
        let fontSize = 12;
        const font = ctx.__font;
        if (font) {
          fontSize = parseInt(font.split(' ')[3], 10);
        }
        fontSize /= 2;
        return {
          width: this.strLen(text) * fontSize
        };
      }
    }
  }

  _initEvent() {
    this.event = {};
    const eventNames = [
      {
        wxName: 'touchStart',
        ecName: 'mousedown',
      },
      {
        wxName: 'touchMove',
        ecName: 'mousemove',
      },
      {
        wxName: 'touchEnd',
        ecName: 'mouseup',
      },
      {
        wxName: 'touchEnd',
        ecName: 'click',
      },
    ];

    eventNames.forEach(name => {
      this.event[name.wxName] = e => {
        const touch = e.touches[0];
        this.chart.getZr().handler.dispatch(name.ecName, {
          zrX: name.wxName === 'tap' ? touch.clientX : touch.x,
          zrY: name.wxName === 'tap' ? touch.clientY : touch.y,
        });
      };
    });
  }

  set width(w) {
    if (this.canvasNode) this.canvasNode.width = w;
  }
  set height(h) {
    if (this.canvasNode) this.canvasNode.height = h;
  }

  get width() {
    if (this.canvasNode) return this.canvasNode.width;
    return 0;
  }
  get height() {
    if (this.canvasNode) return this.canvasNode.height;
    return 0;
  }
}
