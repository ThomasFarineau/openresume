import { JSX } from "solid-js";

interface ViewerProps {
    html: string;
}

export default function Viewer(props: ViewerProps): JSX.Element {
    return (
        <div class="bg-gray-900 shadow rounded-xl p-4 flex flex-col space-y-4">
            <h2 class="text-xl font-semibold">Prévisualisation</h2>
            <iframe
                class="flex-1 border border-gray-700 rounded-lg bg-white"
                srcdoc={props.html}
                sandbox="allow-same-origin allow-forms allow-popups allow-scripts"
            />
        </div>
    );
}
