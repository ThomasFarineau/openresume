// schemas.ts
export const basicsSchema = {
    name: "text",
    label: "text",
    image: "url",
    email: "email",
    phone: "text",
    url: "url",
    summary: "textarea",
};

export const locationSchema = {
    address: "text",
    postalCode: "text",
    city: "text",
    countryCode: "text",
    region: "text",
};

export const profileSchema = {
    network: "text",
    username: "text",
    url: "url",
};

export const workSchema = {
    name: "text",
    position: "text",
    url: "url",
    startDate: "month",
    endDate: "month",
    summary: "textarea",
    location: "text",
};

export const educationSchema = {
    institution: "text",
    url: "url",
    area: "text",
    studyType: "text",
    startDate: "month",
    endDate: "month",
    score: "text",
};

export const skillSchema = {
    name: "text",
    level: "text",
};

export const projectSchema = {
    name: "text",
    description: "textarea",
    url: "url",
    startDate: "month",
    endDate: "month",
};

export const volunteerSchema = {
    organization: "text",
    position: "text",
    url: "url",
    startDate: "month",
    endDate: "month",
    summary: "textarea",
};

export const awardSchema = {
    title: "text",
    date: "date",
    awarder: "text",
    summary: "textarea",
};

export const publicationSchema = {
    name: "text",
    publisher: "text",
    releaseDate: "date",
    url: "url",
    summary: "textarea",
};

export const languageSchema = {
    language: "text",
    fluency: "text",
};

export const interestSchema = {
    name: "text",
};

export const referenceSchema = {
    name: "text",
    reference: "textarea",
};
