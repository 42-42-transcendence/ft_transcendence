import { Item } from "./Item";
import {vec2} from "gl-matrix";
import PhysicsEngine from "./PhysicsEngine";
import { GameDataDto } from "../dto/in-game.dto";

export class ItemManager {
    private static instance: ItemManager;
    private lastItemCreationTime: number;

    constructor() {
        this.lastItemCreationTime = Date.now();
    }

    public static getInstance(): ItemManager {
        if (!this.instance) {
            this.instance = new ItemManager();
        }
        return this.instance;
    }

    public createItem(items: Item[]) {
        const currentTime = Date.now();
        let randomX = Math.random();

        if (currentTime - this.lastItemCreationTime < 1000 || items.length >= 5)
            return;
        if (randomX < 0.5) {
            randomX = randomX * 0.6 - 0.5;
        } else {
            randomX = randomX * 0.6 + 0.2;
        }
        const position = vec2.fromValues(0.0, 0.0);
        let randomY = Math.random() - 0.5;
        const direction = vec2.normalize(vec2.create(), vec2.fromValues(randomX, randomY));
        const velocity = 1.0;
        const radius = 0.01;

        const newItem = new Item(position, direction, velocity, radius);
        items.push(newItem);
        this.lastItemCreationTime = currentTime;
    }

    public updateItems(delta: number, gamedata: GameDataDto) {
        gamedata.items.forEach(item => PhysicsEngine.GuaranteeConflict(item, gamedata, delta));
        gamedata.items = gamedata.items.filter(item => !item.toBeDestroyed);
    }

    public clearItems(items: Item[]) {
        items = [];
    }
}