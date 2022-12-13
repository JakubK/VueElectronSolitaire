import { computed, ref, Ref } from "vue";
import { Position } from "../models/position";

const undoStack: Ref<Position[]> = ref([]);
export const useStack = () => {
	const clearStack = () => undoStack.value = [];
	const isStackEmpty = computed(() => undoStack.value.length === 0);
	const pushStack = (cell: Position) => undoStack.value.push(cell);
	const popStack = () => undoStack.value.pop();

	return {
		clearStack,
		isStackEmpty,
		pushStack,
		popStack
	}
} 