import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewDecisions, openActions } from './decision-log.mjs';
import { briefAsMarkdown, createMeetingBrief } from './meeting-brief.mjs';
import { buildQualitySnapshot, snapshotNarrative } from './quality-dashboard.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const review = JSON.parse(await fs.readFile(path.join(projectRoot, 'examples/leadership-review.json'), 'utf8'));
const decisions = reviewDecisions(review.decisions, new Date('2026-01-20T00:00:00Z'));
const snapshot = buildQualitySnapshot(review.metrics);
const brief = createMeetingBrief(review.brief);

console.log(JSON.stringify({
  decisions,
  openActions: openActions(review.decisions),
  snapshot,
  narrative: snapshotNarrative(snapshot),
  markdownBrief: briefAsMarkdown(brief)
}, null, 2));
