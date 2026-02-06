
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '../knowledge/course_map.csv');
const OUTPUT_DIR = path.join(__dirname, '../src/content/lessons');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Read CSV
const csvFile = fs.readFileSync(CSV_PATH, 'utf8');

Papa.parse(csvFile, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
        const rows = results.data;

        rows.forEach((row) => {
            // Create a slug from the competency or ID
            // The CSV has "Competency" column like "0.1. Professional Communication\nTyping & Clarity"
            // We need to parse out the ID and the Title

            let competencyRaw = row['Competency'] || '';
            // Remove newlines and extra spaces
            competencyRaw = competencyRaw.replace(/\n/g, ' ').trim();

            // Extract ID (e.g., "0.1.")
            const idMatch = competencyRaw.match(/^([\d\.]+)/);
            const id = idMatch ? idMatch[1].replace(/\.$/, '') : 'unknown'; // "0.1"

            // Extract Title
            let title = competencyRaw.replace(/^[\d\.]+\s*/, '').trim();

            // Create slug
            const slug = title.toLowerCase()
                .replace(/[^\w\s-]/g, '') // remove non-word chars
                .replace(/\s+/g, '-')     // replace spaces with dashes
                .substring(0, 50);        // limit length

            const fileName = `${id}-${slug}.md`;
            const filePath = path.join(OUTPUT_DIR, fileName);

            // Construct Frontmatter
            const frontmatter = `---
id: "${id}"
title: "${title}"
domain: "${row['Domain']}"
progression: "${row['Course Progression']}"
learning_objective: "${(row['Learning Objective'] || '').replace(/"/g, '\\"')}"
enduring_understandings: "${(row['Enduring Understandings'] || '').replace(/"/g, '\\"')}"
essential_questions: "${(row['Essential Questions'] || '').replace(/"/g, '\\"')}"
assessment_project: "${(row['Assessment Project\nCheck Bloom\'s & Webb\'s'] || '').replace(/"/g, '\\"')}"
mastery_criteria: "${(row['Mastery Criteria / Success Metrics'] || '').replace(/"/g, '\\"')}"
activities: "${(row['Activities'] || '').replace(/"/g, '\\"')}"
---
`;

            // Content Body
            // We can add some default structure based on the columns
            const content = `${frontmatter}

# ${title}

## Learning Objective
${row['Learning Objective']}

## Enduring Understandings
${row['Enduring Understandings']}

## Essential Questions
${row['Essential Questions']}

## Activities
${row['Activities']}

## Assessment
${row['Assessment Project\nCheck Bloom\'s & Webb\'s']}

## Mastery Criteria
${row['Mastery Criteria / Success Metrics']}
`;

            fs.writeFileSync(filePath, content);
            console.log(`Generated: ${fileName}`);
        });

        console.log(`Successfully generated ${rows.length} lessons.`);
    },
    error: function (err) {
        console.error("Error parsing CSV:", err);
    }
});
