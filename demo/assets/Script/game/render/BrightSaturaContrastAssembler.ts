import GTSimpleSpriteAssembler2D from "./GTSimpleSpriteAssembler2D";

// 自定义顶点格式，在vfmtPosUvColor基础上，加入 a_brightness  a_saturation  a_constrast
let gfx = cc.gfx;
const vfmtCustom = new gfx.VertexFormat([
    { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
    { name: gfx.ATTR_COLOR, type: gfx.ATTR_TYPE_UINT8, num: 4, normalize: true },
    { name: 'a_brightness', type: gfx.ATTR_TYPE_FLOAT32, num: 1 },
    { name: 'a_saturation', type: gfx.ATTR_TYPE_FLOAT32, num: 1 },
    { name: 'a_constrast', type: gfx.ATTR_TYPE_FLOAT32, num: 1 },
]);


export default class BrightSaturaContrastAssembler extends GTSimpleSpriteAssembler2D {
    // 根据自定义顶点格式，调整下述常量
    verticesCount = 4;
    indicesCount = 6;
    uvOffset = 2;
    colorOffset = 4;
    brightnessOffset = 5;
    saturationOffset = 6;
    constrastOffset = 7;
    floatsPerVert = 8;


    brightness = 1;
    saturation = 1;
    constrast = 1;

    initData() {
        let data = this._renderData;
        // createFlexData支持创建指定格式的renderData
        data.createFlexData(0, this.verticesCount, this.indicesCount, this.getVfmt());

        // createFlexData不会填充顶点索引信息，手动补充一下
        let indices = data.iDatas[0];
        let count = indices.length / 6;
        for (let i = 0, idx = 0; i < count; i++) {
            let vertextID = i * 4;
            indices[idx++] = vertextID;
            indices[idx++] = vertextID + 1;
            indices[idx++] = vertextID + 2;
            indices[idx++] = vertextID + 1;
            indices[idx++] = vertextID + 3;
            indices[idx++] = vertextID + 2;
        }
    }

    // 自定义格式以getVfmt()方式提供出去，除了当前assembler，render-flow的其他地方也会用到
    getVfmt() {
        return vfmtCustom;
    }

    // 重载getBuffer(), 返回一个能容纳自定义顶点数据的buffer
    // 默认fillBuffers()方法中会调用到
    getBuffer() {
        return cc.renderer._handle.getBuffer("mesh", this.getVfmt());
    }


    updateUVs(sprite) {
        super.updateUVs(sprite);
        let dstOffset;
        let verts = this._renderData.vDatas[0];
        for (let i = 0; i < this.verticesCount; ++i) {
            // fill 
            let floatsOffset = this.floatsPerVert * i;

            dstOffset = floatsOffset + this.brightnessOffset;
            verts[dstOffset] = this.brightness;

            dstOffset = floatsOffset + this.saturationOffset;
            verts[dstOffset] = this.saturation;

            dstOffset = floatsOffset + this.constrastOffset;
            verts[dstOffset] = this.constrast;

        }

    }
}
