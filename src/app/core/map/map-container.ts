import * as PIXI from 'pixi.js';
import { Creature } from 'src/app/shared/models/creature';
import { Map } from 'src/app/shared/models/map';
import { environment } from 'src/environments/environment';
import { Layer } from './layers/layer';
import { GridLayer } from './layers/grid-layer';
import { BackgroundLayer } from './layers/background-layer';
import { TokenView } from './views/token-view';
import { TokensLayer } from './layers/tokens-layer';
import { Grid } from './models/grid';

export class MapContainer extends Layer {

    backgroundLayer: BackgroundLayer;
    gridLayer: GridLayer;
    canvasLayer: Layer;
    areaEffectsLayer: Layer;
    tokensLayer: TokensLayer;

    dmLayer: Layer;
    topLayer: Layer;
    middleLayer: Layer;
    bottomLayer: Layer;

    visionLayer: Layer;
    lightLayer: Layer;

    // data
    
    map: Map;
    creatures: Array<Creature>;

    grid: Grid = new Grid();

    data: PIXI.interaction.InteractionData;
    dragging: boolean;

    constructor() {
        super();

        this.backgroundLayer = this.addChild(new BackgroundLayer());
        this.gridLayer = this.addChild(new GridLayer());
        this.tokensLayer = this.addChild(new TokensLayer());
    }

    update(map: Map) {
        console.debug("updating map");
        this.map = map;

        this.grid.size = map.gridSize;
        this.grid.offsetX = map.gridOffsetX;
        this.grid.offsetY = map.gridOffsetY;
        this.grid.color = map.gridColor;

        // update grid
        this.backgroundLayer.update(map);
        this.gridLayer.update(map);
        this.tokensLayer.grid = this.grid
    }

    async draw() {
        await this.backgroundLayer.draw();
        await this.gridLayer.draw();
        await this.tokensLayer.draw();

        this.w = this.backgroundLayer.w;
        this.h = this.backgroundLayer.h;

        // this.hitArea = new PIXI.Rectangle(0, 0, this.w, this.h);
        // this.interactive = true;
        // this.buttonMode = true;

        // this
        //     .on('pointerdown', this.onDragStart)
        //     .on('pointerup', this.onDragEnd)
        //     .on('pointerupoutside', this.onDragEnd)
        //     .on('pointermove', this.onDragMove);

        return this;
    }

    onDragStart(event: PIXI.interaction.InteractionEvent) {
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.dragging = true;
    }
    
    onDragEnd() {
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
    }
    
    onDragMove() {
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x += this.data.global.x - this.x;
            this.y += this.data.global.y - this.y;
        }
    }
}