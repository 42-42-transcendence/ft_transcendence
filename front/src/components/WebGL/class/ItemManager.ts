import { Item } from "./Item";
import {vec2} from "gl-matrix";
import PhysicsEngine from "./PhysicsEngine";

export class ItemManager {
    private static instance: ItemManager;
    public items: Item[];
    private lastItemCreationTime: number;

    constructor() {
        this.lastItemCreationTime = Date.now();
        this.items = [];
    }

    public static getInstance(): ItemManager {
        if (!this.instance) {
            this.instance = new ItemManager();
        }
        return this.instance;
    }

    public createItem() {
        const currentTime = Date.now();
        let randomX = Math.random();

        if (currentTime - this.lastItemCreationTime < 1000 || this.items.length >= 5)
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
        this.items.push(newItem);
        this.lastItemCreationTime = currentTime;
    }

    public updateItems(delta: number) {
        this.items.forEach(item => PhysicsEngine.GuaranteeConflict(item, delta));
        this.items = this.items.filter(item => !item.toBeDestroyed);
    }
}