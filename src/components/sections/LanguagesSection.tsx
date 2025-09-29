import ArrayEditor from "../editor/ArrayEditor.js";

const languageSchema = {
    language: "text",
    fluency: "text",
};

const fluencyOptions = ["A1", "A2", "B1", "B2", "C1", "C2", "Native"];

interface LanguagesSectionProps {
    languages: any[];
    onChange: (languages: any[]) => void;
}

export default function LanguagesSection(props: LanguagesSectionProps) {
    return (
        <ArrayEditor
            items={props.languages || []}
            onChange={props.onChange}
            schema={languageSchema}
            title="Langues"
            customRender={{
                fluency: (value, onChange) => (
                    <select
                        value={value || ""}
                        onInput={(e) => onChange(e.currentTarget.value)}
                        class="w-full border border-gray-700 rounded-lg p-2 bg-black text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">-- Choisir --</option>
                        {fluencyOptions.map((opt) => (
                            <option value={opt}>{opt}</option>
                        ))}
                    </select>
                ),
            }}
        />
    );
}
