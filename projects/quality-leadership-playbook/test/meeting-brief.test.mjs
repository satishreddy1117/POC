import test from 'node:test';
import assert from 'node:assert/strict';
import { briefAsMarkdown, createMeetingBrief } from '../src/meeting-brief.mjs';

test('creates a structured decision brief', () => {
  const brief = createMeetingBrief({ title: 'Review', decision: 'Hold', evidence: [{ label: 'Tests', status: 'fail' }], audience: ['Product'] });
  assert.equal(brief.title, 'Review');
  assert.equal(brief.evidence[0].status, 'fail');
  assert.ok(brief.generatedAt);
});

test('renders a brief for executive review', () => {
  const markdown = briefAsMarkdown(createMeetingBrief({ title: 'Review', decision: 'Pass', audience: ['Engineering'], evidence: [{ label: 'API', status: 'pass', detail: 'Green' }] }));
  assert.match(markdown, /# Review/);
  assert.match(markdown, /\| API \| pass \| Green \|/);
});
