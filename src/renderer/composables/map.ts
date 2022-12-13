import { computed, Ref, ref } from "vue"
import { Cell } from "../models/cell";
import { useStack } from "./stack";

const map: Ref<Cell[]> = ref([]);
const selectedCell: Ref<Cell | null> = ref(null);

export const useMap = () => {
	const { clearStack, popStack, pushStack } = useStack();

	const resetMap = () => {
		selectedCell.value = null;
		clearStack();
		map.value = [];
		for (let x = 1; x <= 7; x++)
			for (let y = 1; y <= 7; y++)
				if ((x > 2 && x < 6) || (y > 2 && y < 6))
					map.value.push({
						isTaken: true,
						position:
						{
							x, y
						}
					});

		const emptyCell = map.value.find(cell => cell.position.x === 4 && cell.position.y === 4)!;
		emptyCell.isTaken = false;
	}

	const undo = () => {
		const actions = [popStack(), popStack(), popStack()];
		actions.forEach(action => {
			const toUpdate = map.value.find(node => node.position.x == action?.x && node.position.y == action.y)!;
			toUpdate.isTaken = !toUpdate.isTaken;
		});
	}

	const isLost = computed(() => {
		const takenNodes = map.value.filter(x => x.isTaken);

		for (let i = 0; i < takenNodes.length; i++) {
			const rightCell = map.value.filter(node => takenNodes[i].position.x + 1 === node.position.x && takenNodes[i].position.y === node.position.y && node.isTaken);
			if (rightCell.length === 1 && map.value.filter(node => rightCell[0].position.x + 1 === node.position.x && rightCell[0].position.y === node.position.y && !node.isTaken).length === 1)
				return false;
			const leftCell = map.value.filter(node => takenNodes[i].position.x - 1 === node.position.x && takenNodes[i].position.y === node.position.y && node.isTaken);
			if (leftCell.length === 1 && map.value.filter(node => leftCell[0].position.x - 1 === node.position.x && leftCell[0].position.y === node.position.y && !node.isTaken).length === 1)
				return false;
			const topCell = map.value.filter(node => takenNodes[i].position.y - 1 === node.position.y && takenNodes[i].position.x === node.position.x && node.isTaken);
			if (topCell.length === 1 && map.value.filter(node => topCell[0].position.y - 1 === node.position.y && topCell[0].position.x === node.position.x && !node.isTaken).length === 1)
				return false;
			const bottomCell = map.value.filter(node => takenNodes[i].position.y + 1 === node.position.y && takenNodes[i].position.x === node.position.x && node.isTaken);
			if (bottomCell.length === 1 && map.value.filter(node => bottomCell[0].position.y + 1 === node.position.y && bottomCell[0].position.x === node.position.x && !node.isTaken).length === 1)
				return false;
		}
		return true;

	});

	const isWon = computed(() => map.value.filter(x => x.isTaken == true).length === 1);

	const handleClickCell = (x: number, y: number) => {
		const cell = map.value.find(node => node.position.x == x && node.position.y == y)!;
		if (cell.isTaken)
			selectedCell.value = cell;
		else if (selectedCell.value) {
			//  Check if focused cell has common axis with empty space
			const xAxis = selectedCell.value.position.x === x;
			const yAxis = selectedCell.value.position.y === y;
			if (!xAxis && !yAxis)
				return;

			const xDiff = (selectedCell.value.position.x - x);
			const yDiff = (selectedCell.value.position.y - y);
			const diff = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
			if (diff !== 2)
				return;

			let cellToFree: (Cell | null) = null;

			if (xAxis) {
				const removeTargetY = y < selectedCell.value.position.y ? y + 1 : y - 1;
				cellToFree = map.value.find(node => node.position.x == x && node.position.y == removeTargetY)!;
			} else {
				const removeTargetX = x < selectedCell.value.position.x ? x + 1 : x - 1;
				cellToFree = map.value.find(node => node.position.y == y && node.position.x == removeTargetX)!;
			}
			if (!cellToFree.isTaken)
				return;


			cellToFree!.isTaken = false;
			cell.isTaken = true;
			selectedCell.value.isTaken = false;

			pushStack({
				x: cellToFree.position.x,
				y: cellToFree.position.y
			});

			pushStack({
				x: cell.position.x,
				y: cell.position.y
			});

			pushStack({
				x: selectedCell.value.position.x,
				y: selectedCell.value.position.y
			});

			selectedCell.value = null;
		}
	}

	const focusedCell = computed(() => selectedCell.value);

	const isCellSelected = (x: number, y: number) => focusedCell.value?.position.x == x && focusedCell.value.position.y == y;
	const isCellTaken = (x: number, y: number) => map.value.find(node => node.position.x == x && node.position.y == y)?.isTaken;

	return {
		resetMap,
		isLost,
		isWon,
		focusedCell,
		handleClickCell,
		isCellTaken,
		isCellSelected,
		undo
	}
}