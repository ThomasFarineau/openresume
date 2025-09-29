import { createSignal, For, JSX, Show } from "solid-js";
import {
    HiSolidChevronDown,
    HiSolidChevronUp,
    HiSolidPlus,
    HiSolidTrash,
    HiSolidBars3,
} from "solid-icons/hi";
import {
    closestCenter,
    createSortable,
    DragDropProvider,
    DragDropSensors,
    SortableProvider,
} from "@thisbeyond/solid-dnd";
import BasicEditor from "./BasicEditor.js";

interface ArrayEditorProps<T extends Record<string, any>> {
    items: T[];
    onChange: (items: T[]) => void;
    schema?: Record<string, string>;
    customRender?: Record<string, (value: any, onChange: (v: any) => void) => JSX.Element>;
    title: string;
}

export default function ArrayEditor<T extends Record<string, any>>(props: ArrayEditorProps<T>) {
    const [open, setOpen] = createSignal(true);

    const updateItem = (index: number, updated: T) => {
        const newItems = [...props.items];
        newItems[index] = updated;
        props.onChange(newItems);
    };

    const addItem = () => {
        props.onChange([...props.items, {} as T]);
    };

    const removeItem = (index: number) => {
        props.onChange(props.items.filter((_, i) => i !== index));
    };

    const handleDragEnd = (e: any) => {
        const { draggable, droppable } = e;
        if (!draggable || !droppable) return;

        const fromIndex = +draggable.id;
        const toIndex = +droppable.id;
        if (fromIndex === toIndex) return;

        const newItems = [...props.items];
        const [moved] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, moved);
        props.onChange(newItems);
    };

    return (
        <div class="bg-gray-800 shadow rounded-xl p-4 flex flex-col gap-2">
            {/* Header */}
            <h2 class="text-xl font-semibold flex justify-between items-center">
                <span>{props.title}</span>
                <div class="flex gap-2">
                    <button
                        type="button"
                        onClick={addItem}
                        class="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                        title="Ajouter un élément"
                    >
                        <HiSolidPlus size={20} />
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen(!open())}
                        class="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center"
                        title="Ouvrir/Fermer"
                    >
                        {open() ? <HiSolidChevronUp size={20} /> : <HiSolidChevronDown size={20} />}
                    </button>
                </div>
            </h2>

            {/* Contenu collapsible */}
            <Show when={open()}>
                <DragDropProvider collisionDetector={closestCenter} onDragEnd={handleDragEnd}>
                    <DragDropSensors />
                    <SortableProvider ids={props.items.map((_, i) => i.toString())}>
                        <For each={props.items}>
                            {(item, i) => {
                                const sortable = createSortable(i().toString());
                                return (
                                    <div
                                        use:sortable
                                        id={i().toString()}
                                        class="bg-gray-700 rounded-lg p-4 flex flex-col gap-3 transition-transform shadow cursor-move"
                                    >
                                        <div class="flex justify-between items-center mb-2">
                                            <div class="cursor-grab text-gray-400">
                                                <HiSolidBars3 size={20} />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeItem(i())}
                                                class="text-red-500 hover:text-red-600"
                                                title="Supprimer"
                                            >
                                                <HiSolidTrash size={20} />
                                            </button>
                                        </div>

                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <BasicEditor
                                                data={item}
                                                onChange={(data) => updateItem(i(), data as T)}
                                                schema={props.schema}
                                                customRender={props.customRender}
                                            />
                                        </div>
                                    </div>
                                );
                            }}
                        </For>
                    </SortableProvider>
                </DragDropProvider>
            </Show>
        </div>
    );
}
