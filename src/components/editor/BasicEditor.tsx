import { For, JSX } from "solid-js";

interface BasicEditorProps {
    data: Record<string, any>;
    onChange: (data: Record<string, any>) => void;
    schema?: Record<string, string>;
    customRender?: Record<string, (value: any, onChange: (v: any) => void) => JSX.Element>;
}

export default function BasicEditor(props: BasicEditorProps) {
    const handleChange = (key: string, value: any) => {
        props.onChange({ ...props.data, [key]: value });
    };

    return (
        <>
            <For each={Object.keys(props.schema || props.data)}>
                {(key) => {
                    const value = props.data[key] ?? "";
                    const type = props.schema?.[key] || "text";

                    // custom renderer
                    if (props.customRender && props.customRender[key]) {
                        return (
                            <div class="flex flex-col gap-1" key={key}>
                                <label class="text-sm font-medium capitalize">{key}</label>
                                {props.customRender[key](value, (v) => handleChange(key, v))}
                            </div>
                        );
                    }

                    // default renderer
                    return (
                        <div class="flex flex-col gap-1" key={key}>
                            <label class="text-sm font-medium capitalize">{key}</label>
                            {type === "textarea" ? (
                                <textarea
                                    value={value}
                                    onInput={(e) => handleChange(key, e.currentTarget.value)}
                                    class="w-full border border-gray-700 rounded-lg p-2 bg-gray-950 text-white focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <input
                                    type={type}
                                    value={value}
                                    onInput={(e) => handleChange(key, e.currentTarget.value)}
                                    class="w-full border border-gray-700 rounded-lg p-2 bg-gray-950 text-white focus:ring-2 focus:ring-blue-500"
                                />
                            )}
                        </div>
                    );
                }}
            </For>
        </>
    );
}
