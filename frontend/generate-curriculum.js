import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function sanitize(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[\r\n]/g, ' ');
}

function buildPdfString(title, subtitle, sections) {
  let content = `BT\n/F1 18 Tf\n72 770 Td\n(${sanitize(title)}) Tj\n0 -24 Td\n/F1 11 Tf\n(${sanitize(subtitle)}) Tj\n0 -30 Td\n`;
  
  sections.forEach(sec => {
    // Section header
    content += `/F1 13 Tf\n(${sanitize(sec.heading)}) Tj\n0 -18 Td\n`;
    
    // Section content lines
    sec.lines.forEach(line => {
      content += `/F1 9 Tf\n`;
      // wrap lines
      let words = line.split(' ');
      let currentLine = '';
      words.forEach(word => {
        if ((currentLine + ' ' + word).length > 80) {
          content += `(${sanitize(currentLine)}) Tj\n0 -12 Td\n`;
          currentLine = word;
        } else {
          currentLine += (currentLine ? ' ' : '') + word;
        }
      });
      if (currentLine) {
        content += `(${sanitize(currentLine)}) Tj\n0 -14 Td\n`;
      }
    });
    content += `0 -10 Td\n`; // space between sections
  });
  content += 'ET\n';

  const streamLength = Buffer.byteLength(content, 'utf-8');
  
  const header = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length ${streamLength} >>\nstream\n`;
  const footer = `\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000220 00000 n \n0000000302 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${220 + 35 + streamLength + 9}\n%%EOF\n`;

  return Buffer.concat([
    Buffer.from(header, 'utf-8'),
    Buffer.from(content, 'utf-8'),
    Buffer.from(footer, 'utf-8')
  ]);
}

const preparatorySections = [
  {
    heading: '1. EXAM PATTERN & MARKING SCHEME',
    lines: [
      'Total Questions: 35 | Duration: 60 minutes | Total Marks: 40 Marks',
      'Section A: CT & Logical Reasoning (10 Questions, 10 Marks)',
      'Section B: AI & Technology Concepts (10 Questions, 10 Marks)',
      'Section C: Everyday AI Around Us (10 Questions, 10 Marks)',
      'Section D: Innovation Arena (5 Questions, 10 Marks - 2 Marks each)',
      'There is no negative marking.'
    ]
  },
  {
    heading: '2. GRADE 3 SYLLABUS & OUTCOMES',
    lines: [
      'Logical Units: Algorithmic sequencing, pattern recognition, decomposition of 2-3 step problems, basic 3D spatial reasoning (cube viewpoints, mirror images), block-based coding concepts.',
      'AI Units: Introduction to AI - voice assistants, face recognition, YouTube recommendations, autocomplete. How AI learns from examples vs how regular programs work.',
      'Sample Question: A computer is given the rule: IF number is even, PRINT EVEN. IF number is odd, PRINT ODD. For 7, what does it print?'
    ]
  },
  {
    heading: '3. GRADE 4 SYLLABUS & OUTCOMES',
    lines: [
      'Logical Units: Flowcharts with YES/NO decision diamonds, input-output function rules, multi-step decomposition, mirror images and symmetry, grid movements, loop patterns.',
      'AI Units: Training data and supervised learning. Why spam filters work. How IRCTC AI detects fraud bots. Differences between AI and automation.',
      'Sample Question: An AI recommends "Study more" IF exam is tomorrow AND score < 70. Rohan\'s exam is tomorrow and his score is 65. What does the AI recommend?'
    ]
  },
  {
    heading: '4. GRADE 5 SYLLABUS & OUTCOMES',
    lines: [
      'Logical Units: Decision trees with 2^n path counting, multi-rule patterns, pictorial decomposition, water images vs mirror images, combined transformations, Caesar cipher basics.',
      'AI Units: All three AI learning types - supervised, unsupervised, reinforcement. Deep learning basics. AI4Bharat and IndicTrans2. AI bias - why training data matters.',
      'Sample Question: A table shows rainfall and crop yield over 4 years. More rain = more yield. What AI technique models this relationship? Predict yield for 300mm rain.'
    ]
  }
];

const middleSections = [
  {
    heading: '1. EXAM PATTERN & MARKING SCHEME',
    lines: [
      'Total Questions: 45 | Duration: 60 minutes | Total Marks: 50 Marks',
      'Section A: CT & Logical Reasoning (15 Questions, 15 Marks)',
      'Section B: AI & Technology Concepts (15 Questions, 15 Marks)',
      'Section C: Everyday AI Around Us (10 Questions, 10 Marks)',
      'Section D: Innovation Arena (5 Questions, 10 Marks - 2 Marks each)',
      'There is no negative marking.'
    ]
  },
  {
    heading: '2. GRADE 6 SYLLABUS & OUTCOMES',
    lines: [
      'Logical Units: Greedy algorithms, bubble sort full trace, binary search efficiency, Euler\'s formula, cyclic patterns, De Morgan\'s laws, algorithm efficiency O-notation introduction.',
      'AI Units: Human vs machine intelligence, learning types in depth, four data types, digital footprints, secure passwords, phishing recognition, privacy measures.',
      'Sample Question: A town\'s AI traffic system reduces total waiting time by 25% but increases waiting time at one low-income crossing by 40%. Is this fair? What design principle should be added?'
    ]
  },
  {
    heading: '3. GRADE 7 SYLLABUS & OUTCOMES',
    lines: [
      'Logical Units: Recursion (base case, recursive case), divide-and-conquer (merge sort), stacks (LIFO), queues (FIFO), BFS vs DFS, XOR and De Morgan\'s Laws, complexity comparison.',
      'AI Units: Regression, classification, clustering, computer vision (CNNs), NLP limitations, data science (collecting, cleaning, visualising), digital citizenship.',
      'Sample Question: An AI loan system trained on 2010-2020 data denies women at twice the rate of equally qualified men. Give two causes of this bias and how to fix it.'
    ]
  },
  {
    heading: '4. GRADE 8 SYLLABUS & OUTCOMES',
    lines: [
      'Logical Units: Dijkstra\'s shortest path algorithm, dynamic programming, hash tables, binary-to-decimal (1011=11), hexadecimal (#FF0000=red), adjacency matrices.',
      'AI Units: CTAI AI lifecycle (Define, Collect, Test, Reflect), Teachable Machine, ML for Kids, data fairness, explainable AI, DPDP Act 2023, IndiaAI Mission.',
      'Sample Question: Design an AI project using Teachable Machine to help visually impaired students navigate school - applying all four stages of the CTAI project lifecycle.'
    ]
  }
];

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const prepPdf = buildPdfString(
  'BAIO Preparatory Stage Curriculum (Grades 3-5)',
  'Bharat AI Olympiad - CBSE CTAI 2026-27 Aligned Framework',
  preparatorySections
);
fs.writeFileSync(path.join(publicDir, 'preparatory-curriculum.pdf'), prepPdf);
console.log('Generated preparatory-curriculum.pdf');

const midPdf = buildPdfString(
  'BAIO Middle Stage Curriculum (Grades 6-8)',
  'Bharat AI Olympiad - CBSE CTAI 2026-27 Aligned Framework',
  middleSections
);
fs.writeFileSync(path.join(publicDir, 'middle-stage-curriculum.pdf'), midPdf);
console.log('Generated middle-stage-curriculum.pdf');
