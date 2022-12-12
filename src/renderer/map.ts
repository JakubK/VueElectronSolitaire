import { computed, Ref, ref } from "vue"
import { Cell } from "./cell";

const map:Ref<Cell[]> = ref([]);

const cell:Ref<Cell | null> = ref(null);

export const useMap = () => {
    const resetMap = () => {
        map.value = [];
    }

    const isLost = computed(() => {
        const takenNodes = map.value.filter(x => x.isTaken);
        for(let i = 0;i < takenNodes.length;i++) {
            const foundXAdjacency = takenNodes.findIndex(node => node.x + 1 == takenNodes[i].x && node.y == takenNodes[i].y || node.x - 1 == takenNodes[i].x);
            if(foundXAdjacency)
                return false;
            const foundYAdjacency = takenNodes.findIndex(node => node.y + 1 == takenNodes[i].y && node.x == takenNodes[i].x || node.y - 1 == takenNodes[i].y);
            if(foundYAdjacency)
                return false;
        }
        return true;
    });

    const isWon = computed(() => {
        return map.value.filter(x => x.isTaken == true).length === 1;
    });

    const handleClickCell = (x:number, y:number) => {

    }

    const clickedCell = computed(() => cell.value);

    return {
        resetMap,
        isLost,
        isWon,
        clickedCell,
        handleClickCell
    }
}