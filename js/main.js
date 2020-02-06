const app = new Vue({
    el: '#app',
    data: {
        tgData: {
            color: {
                bg: 'hsl(151,95%,30%)',
                text: '#fff',
                point: 'hsl(151,95%,36%)',
            },
            text: [{
                content: '',
                pos: 'cc',
                font: 'sans-serif',
                size: 16
            }, {
                content: '',
                pos: 'bc',
                font: 'sans-serif',
                size: 10
            }, {
                content: '',
                pos: 'vr',
                font: 'serif',
                size: 8
            }],
            effect: 'stripe',
            size: {
                w: 1280,
                h: 670
            }
        },
        img: {
            dataURL: null,
            size: 'cover'
        },
        ctx: null,
        prCtx: null,
        tab: {
            color: 'random',
            text: 0
        },
        textPos: [{
            str: 'tl',
            label: '左上'
        }, {
            str: 'cc',
            label: '中央'
        }, {
            str: 'tr',
            label: '右上'
        }, {
            str: 'bl',
            label: '左下'
        }, {
            str: 'bc',
            label: '中下'
        }, {
            str: 'br',
            label: '右下'
        }, {
            str: 'vl',
            label: '縦左'
        }, {
            str: 'vc',
            label: '縦中'
        }, {
            str: 'vr',
            label: '縦右'
        }],
        fontList: [
            {
                name: 'sans-serif',
                label: 'ゴシック体'
            }, {
                name: 'serif',
                label: '明朝体'
            }, {
                name: 'YuGothic, "Yu Gothic"',
                label: '游ゴシック体'
            }, {
                name: 'YuMincho, "Yu Mincho"',
                label: '游明朝体'
            }, {
                name: 'YuKyokasho, "Yu Kyokasho"',
                label: '游教科書体'
            }, {
                name: 'Source Han Sans',
                label: '源ノ角ゴシック'
            }, {
                name: 'Source Han Serif',
                label: '源ノ明朝'
            }, {
                name: 'Hiragino Kaku Gothic StdN',
                label: 'ヒラギノ角ゴ StdN'
            }, {
                name: 'Corporate Logo Bold',
                label: 'コーポレート・ロゴB Bold'
            }, {
                name: 'HannariMincho',
                label: 'はんなり明朝'
            }, {
                name: '"02UtsukushiMincho"',
                label: 'うつくし明朝体'
            }
        ],
        colorList: [
            {
                label: 'ふわっと',
                s: 60,
                l: 85,
                toneType: 0,
                currColor: '#fff',
                currColorText: '#fff',
                currColorPoint: '#fff'
            },{
                label: 'しっとり',
                s: 20,
                l: 70,
                toneType: -1,
                currColor: '#fff',
                currColorText: '#fff',
                currColorPoint: '#fff'
            },{
                label: 'ポップ',
                s: 95,
                l: 60,
                toneType: 0,
                currColor: '#fff',
                currColorText: '#fff',
                currColorPoint: '#fff'
            },{
                label: 'どっしり',
                s: 95,
                l: 30,
                toneType: 1,
                currColor: '#fff',
                currColorText: '#fff',
                currColorPoint: '#fff'
            }
        ],
        sizeList: [
            {
                label: 'note 記事見出し画像',
                size: {
                    w: 1280,
                    h: 670
                }
            },{
                label: 'note マガジン/クリエイター ヘッダー画像',
                size: {
                    w: 1600,
                    h: 568
                }
            },{
                label: 'Twitter ヘッダー画像',
                size: {
                    w: 1500,
                    h: 500
                }
            },{
                label: 'はてなブックマーク',
                size: {
                    w: 1200,
                    h: 840
                }
            },{
                label: 'pixiv 小説 表紙',
                size: {
                    w: 480,
                    h: 600
                }
            },{
                label: 'OGP 1200×630',
                size: {
                    w: 1200,
                    h: 630
                }
            },{
                label: '正方形 1024',
                size: {
                    w: 1024,
                    h: 1024
                }
            }
        ]
    },
    created: function() {
        const self = this;
        if (!location.search) return;

        const arg = location.search.substring(1)
        .split('&').reduce((acc, cur) => {
            acc[cur.split('=')[0]] = decodeURIComponent(cur.split('=')[1]);
            return acc;
        }, {});
        arg.colorbg && (self.tgData.color.bg = arg.colorbg);
        arg.colortext && (self.tgData.color.text = arg.colortext);
        arg.colorpoint && (self.tgData.color.point = arg.colorpoint);
        arg.text0content && (self.tgData.text[0].content = arg.text0content);
        arg.text0pos && (self.tgData.text[0].pos = arg.text0pos);
        arg.text0font && (self.tgData.text[0].font = arg.text0font);
        arg.text0size && (self.tgData.text[0].size = arg.text0size);
        arg.text1content && (self.tgData.text[1].content = arg.text1content);
        arg.text1pos && (self.tgData.text[1].pos = arg.text1pos);
        arg.text1font && (self.tgData.text[1].font = arg.text1font);
        arg.text1size && (self.tgData.text[1].size  = arg.text1size);
        arg.text2content && (self.tgData.text[2].content = arg.text2content);
        arg.text2pos && (self.tgData.text[2].pos = arg.text2pos);
        arg.text2font && (self.tgData.text[2].font = arg.text2font);
        arg.text2size && (self.tgData.text[2].size  = arg.text2size);
        arg.effect && (self.tgData.effect = arg.effect);
        arg.sizew && (self.tgData.size.w = arg.sizew);
        arg.sizeh && (self.tgData.size.h = arg.sizeh);

        if (!arg.colorbg && !arg.colortext && !arg.colorpoint) {
            self.randomColor(self.colorList[3]);
            self.setRandomColor(self.colorList[3]);
        }
    },
    mounted: function() {
        const self = this;

        self.ctx = self.$refs.tgCanvas.getContext('2d');
        self.prCtx = self.$refs.prCanvas.getContext('2d');

        self.colorList.forEach(el => {
            self.randomColor(el);
        });
        self.createImg();
    },
    computed: {
        queryString: function () {
            const self = this;

            self.tgData.text.forEach(txt => {
                txt.content = txt.content
                    .replace(/<iframe/gi, '&lt;iframe')
                    .replace(/\n/g, '<br>');
            });

            let str = '?';
            for (key in self.tgData) {
                if (self.tgData[key] instanceof Object) {
                    for (key2 in self.tgData[key]) {
                        if (self.tgData[key][key2] instanceof Object) {
                            for (key3 in self.tgData[key][key2]) {
                                str += `&${key}${key2}${key3}=${encodeURIComponent(self.tgData[key][key2][key3])}`;
                            }
                        } else if (self.tgData[key][key2]) {
                            str += `&${key}${key2}=${encodeURIComponent(self.tgData[key][key2])}`;
                        }
                    }
                } else if (self.tgData[key]) {
                    str += `&${key}=${encodeURIComponent(self.tgData[key])}`;
                }
            }
            return str;
        }
    },
    watch: {
        queryString: function() {
            const self = this;

            Vue.nextTick(function () {
                self.createImg();
                history.replaceState('', '', self.queryString);
            });
        },
        img: {
            handler: function() {
                const self = this;

                Vue.nextTick(function () {
                    self.createImg();
                });
            },
            deep: true
        }
    },
    methods: {
        textStyle: function(txt) {
            return {
                fontFamily: txt.font, color: this.tgData.color.text, fontSize: txt.size + 'vmin'
            }
        },
        setRandomColor: function(cl) {
            const self = this;
            self.tgData.color.bg = cl.currColor;
            self.tgData.color.text = cl.currColorText;
            self.tgData.color.point = cl.currColorPoint;
            self.randomColor(cl);
        },
        randomColor: function(cl) {
            const self = this;
            let h = Math.floor(Math.random()*360);
            h = ((105 < h && h < 135) || (290 < h && h < 310)) ? h-60 : h;
            cl.currColor = `hsl(${h},${cl.s}%,${cl.l}%)`;
            cl.currColorText = ((cl.l > 80) ? '#000' : '#fff');
            cl.currColorPoint = `hsl(${cl.toneType ? h : (h+180)%360},${cl.s}%,${cl.l+cl.toneType*6}%)`;
        },
        selectImage: function(e) {
            const self = this;
            if (!e.target.files.length) {
                return;
            }

            const file = e.target.files[0];
            const fr = new FileReader();
            fr.onload = function() {
                self.img.dataURL = fr.result;
            }
            fr.readAsDataURL(file);
        },
        cancelImage: function() {
            const self = this;
            self.img.dataURL = null;
        },
        createImg: function() {
            const self = this;
            const serializeHtml = (new XMLSerializer).serializeToString(self.$refs.html);

            let longShadow = `text-shadow: 1px 1px 0 ${self.tgData.color.point}`;

            if (self.tgData.effect === 'longShadow') {
                for (let i=2; i<self.tgData.size.h; i++) {
                    longShadow += `,${i}px ${i}px 0 ${self.tgData.color.point}`
                }
            }
            longShadow += ';'

            const data =
`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0, 0, ${self.tgData.size.w}, ${self.tgData.size.h}' width='${self.tgData.size.w}' height='${self.tgData.size.h}'>
    <foreignObject width='100%' height='100%'>
        <div xmlns="http://www.w3.org/1999/xhtml">
            <style>
            .wrapper {
                width: 100%;
                height: 100vh;
                font-kerning: normal;
                font-feature-settings: "palt";
                -webkit-font-feature-settings: "palt";
                font-weight: 900;
            }
            bb {
                font-size: 150%;
            }
            .ab-100 {
                position: absolute;
                width: 100%;
            }
            .tp-tl {
                top: 6vmin;
                left: 8vmin;
            }
            .tp-tr {
                top: 6vmin;
                right: 8vmin;
                text-align: right;
            }
            .tp-bl {
                bottom: 6vmin;
                left: 8vmin;
            }
            .tp-br {
                right: 8vmin;
                bottom: 6vmin;
                text-align: end;
            }
            .tp-bc {
                bottom: 8vmin;
                text-align: center;
            }
            .table-cc {
                height: 100vh;
                display: table;
            }
            .tp-cc {
                display: table-cell;
                vertical-align: middle;
                text-align: center;
            }
            .table-v {
                height: 95vh;
                display: table;
                writing-mode: vertical-rl;
                text-orientation: upright;
                padding-top: 6vmin;
                font-feature-settings: initial;
                -webkit-font-feature-settings: initial;
            }
            .tp-vc {
                display: table-cell;
                vertical-align: middle;
            }
            .tp-vl {
                display: table-cell;
                vertical-align: bottom;
                padding-left: 6vmin;
            }

            .tp-vr {
                display: table-cell;
                padding-right: 6vmin;
            }
            .fuchidori {
                text-shadow:
                ${self.tgData.color.point} 8px 0px 1px,  ${self.tgData.color.point} -8px 0px 1px,
                ${self.tgData.color.point} 0px -8px 1px, ${self.tgData.color.point} 0px 8px 1px,
                ${self.tgData.color.point} 8px 8px 1px, ${self.tgData.color.point} -8px 8px 1px,
                ${self.tgData.color.point} 8px -8px 1px, ${self.tgData.color.point} -8px -8px 1px,
                ${self.tgData.color.point} 4px 8px 1px,  ${self.tgData.color.point} -4px 8px 1px,
                ${self.tgData.color.point} 4px -8px 1px, ${self.tgData.color.point} -4px -8px 1px,
                ${self.tgData.color.point} 8px 4px 1px,  ${self.tgData.color.point} -8px 4px 1px,
                ${self.tgData.color.point} 8px -4px 1px, ${self.tgData.color.point} -8px -4px 1px;
            }
            .longShadow {
                ${longShadow}
            }
            .stripe {
                background-image: -webkit-gradient(linear, 0 0, 100% 100%,color-stop(.25, ${self.tgData.color.point}), color-stop(.25, transparent),color-stop(.5, transparent), color-stop(.5, ${self.tgData.color.point}),color-stop(.75, ${self.tgData.color.point}), color-stop(.75, transparent),to(transparent));
                background-image: linear-gradient(-45deg, ${self.tgData.color.point} 25%, transparent 25%, transparent 50%, ${self.tgData.color.point} 50%, ${self.tgData.color.point} 75%, transparent 75%, transparent);
                -webkit-background-size: 200px 200px;
                background-size: 200px 200px;
            }
            </style>
            ${serializeHtml}
        </div>
  </foreignObject>
</svg>`;

            const svg = new Blob([data], {
                type: 'image/svg+xml'
            });

            const DOMURL = window.URL || window.webkitURL || window;
            const url = DOMURL.createObjectURL(svg);

            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url;

            img.onload = () => {
                self.ctx.clearRect(0, 0, self.tgData.size.w, self.tgData.size.h);
                self.ctx.drawImage(img, 0, 0);
                self.prCtx.clearRect(0, 0, self.tgData.size.w, self.tgData.size.h);
                self.prCtx.drawImage(img, 0, 0);
                DOMURL.revokeObjectURL(url);
            }
        }
    }
});
