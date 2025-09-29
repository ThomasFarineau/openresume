import {JSX} from "solid-js";
import BasicEditor from "./editor/BasicEditor.js";
import ArrayEditor from "./editor/ArrayEditor.js";
import LanguagesSection from "./sections/LanguagesSection.js";
import {
    awardSchema,
    basicsSchema,
    educationSchema,
    interestSchema,
    locationSchema,
    profileSchema,
    projectSchema,
    publicationSchema,
    referenceSchema,
    skillSchema,
    volunteerSchema,
    workSchema,
} from "./schemas.js";

interface EditorProps {
    resume: any;
    onChange: (json: any) => void;
    onSave: () => void;
    onDownload: () => void;
}

export default function Editor(props: EditorProps): JSX.Element {
    return (<div class="bg-gray-900 shadow rounded-xl p-4 flex flex-col gap-6 flex-1 min-h-0 overflow-y-auto">
            <h2 class="text-2xl font-bold">Éditeur JSON Resume</h2>

        <div class="flex gap-2 sticky bottom-0 bg-gray-900 py-2">
            <button
                onClick={props.onSave}
                class="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition"
            >
                Sauvegarder
            </button>
            <button
                onClick={props.onDownload}
                class="bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition"
            >
                Télécharger JSON
            </button>
        </div>

            {/* Basics */}
            <BasicEditor
                data={props.resume.basics || {}}
                onChange={(basics) => props.onChange({...props.resume, basics})}
                schema={basicsSchema}
            />

            {/* Location */}
            {props.resume.basics?.location && (<BasicEditor
                    data={props.resume.basics.location}
                    onChange={(location) => props.onChange({
                        ...props.resume, basics: {...props.resume.basics, location},
                    })}
                    schema={locationSchema}
                />)}

            {/* Profiles */}
            {props.resume.basics?.profiles && (<ArrayEditor
                    items={props.resume.basics.profiles}
                    onChange={(profiles) => props.onChange({
                        ...props.resume, basics: {...props.resume.basics, profiles},
                    })}
                    schema={profileSchema}
                    title="Réseaux sociaux"
                />)}

            {/* Work */}
            <ArrayEditor
                items={props.resume.work || []}
                onChange={(work) => props.onChange({...props.resume, work})}
                schema={workSchema}
                title="Expériences professionnelles"
            />

            {/* Education */}
            <ArrayEditor
                items={props.resume.education || []}
                onChange={(education) => props.onChange({...props.resume, education})}
                schema={educationSchema}
                title="Éducation"
            />

            {/* Skills */}
            <ArrayEditor
                items={props.resume.skills || []}
                onChange={(skills) => props.onChange({...props.resume, skills})}
                schema={skillSchema}
                title="Compétences"
            />

            {/* Projects */}
            <ArrayEditor
                items={props.resume.projects || []}
                onChange={(projects) => props.onChange({...props.resume, projects})}
                schema={projectSchema}
                title="Projets"
            />

            {/* Volunteer */}
            <ArrayEditor
                items={props.resume.volunteer || []}
                onChange={(volunteer) => props.onChange({...props.resume, volunteer})}
                schema={volunteerSchema}
                title="Bénévolat"
            />

            {/* Awards */}
            <ArrayEditor
                items={props.resume.awards || []}
                onChange={(awards) => props.onChange({...props.resume, awards})}
                schema={awardSchema}
                title="Récompenses"
            />

            {/* Publications */}
            <ArrayEditor
                items={props.resume.publications || []}
                onChange={(publications) => props.onChange({...props.resume, publications})}
                schema={publicationSchema}
                title="Publications"
            />

            {/* Languages (🔹 custom section) */}
            <LanguagesSection
                languages={props.resume.languages || []}
                onChange={(languages) => props.onChange({...props.resume, languages})}
            />

            {/* Interests */}
            <ArrayEditor
                items={props.resume.interests || []}
                onChange={(interests) => props.onChange({...props.resume, interests})}
                schema={interestSchema}
                title="Centres d'intérêt"
            />

            {/* References */}
            <ArrayEditor
                items={props.resume.references || []}
                onChange={(references) => props.onChange({...props.resume, references})}
                schema={referenceSchema}
                title="Références"
            />

            {/* Boutons généraux */}

        </div>);
}
