# Landing section pass

## The problem

The page reads as one template repeated. Five blocks share a card anatomy (rounded
tile, mono eyebrow, title, body), four share a feature anatomy (macOS window + copy
block + ember arrow link), and every one of them arrives with the same 24px fade-up
on scroll. The hero, the wave, the header, the mega-menus and the portal are
all distinctive; everything between them is not.

That is the AI-slop signature, and it is a repetition problem, not a polish problem.
Adding more surface detail would make it worse.

## The rule for this pass

**One signature idea per section. No two sections share a layout skeleton. Motion
expresses what a section *is*, not that it scrolled.**

The uniform `Reveal` stays as the baseline arrival. Everything added on top of it
must be specific to the section it lives in. If a section's motion could be lifted
and dropped onto another section unchanged, it is wrong.

Nothing gets invented to fill space. Every claim traces to `apps/web/src/data/` or
the Niki repository. No customer names, no adoption numbers, no reference assets.

## Per section

### 1. Hero — the one place a reveal belongs
The reference hero is quiet, so this stays restrained: the headline reveals line by
line, the actions follow. It is the only entrance on the page that is choreographed
rather than faded, because it is the only moment with nothing above it.

### 2. Provider strip — the count becomes the subject
A row of twelve pills is filler. Make the **count** the subject: a large
"Twelve providers" display figure that resolves on scroll, with the marks arriving
beneath it as a considered grid, staggered against the count. Keeps the same
inventory, loses the strip-of-logos look.

### 3. Feature A, four agents — the handoff
Keeps the run explorer, which is real and interactive. Signature: the artifact
*flows* from the stage you came from into the stage you selected. The list currently
swaps; a pipeline hands things over.

### 4. Feature B, the branch gate — the gates check
Four gates currently render as a static `required / required / required / never
rewritten` list. This section's entire claim is "nothing lands until the tests pass",
so it should **show the checking**: each gate resolves in sequence and the branch row
only commits at the end. This is the section that most needs to be a moment.

### 5. Feature C, receipts — real excerpts
The tabs already switch; they swap hard. Each tab's content should arrive as
content: diff lines, report headings, JSON keys. Evidence that assembles, not a
carousel.

### 6. Feature D, model routing — the config lights up per stage
Currently a plain grey `<pre>`, the weakest section visually, for the most
interesting claim. Signature: a highlighted config where each `[agents.*]` block
lights in sequence as the section enters, with the stage's provider and model read
out beside it. The motion *is* the claim: a model routed to every stage.

### 7. Receipt grid — excerpts, not cards
Replace three identical cards with three real artifact excerpts, each in its own
typographic treatment: a diff, a report, a JSON document. This section already
exists to carry evidence; it should look like evidence.

### 8. Changelog — a timeline
Four more identical cards. Replace with a hairline spine, ember nodes, version and
date on the spine, title and detail beside it. A different anatomy from every other
block on the page, and the right shape for releases.

### 9. Capability row — one system, not three windows
Three columns each with its own identical window. Replace with three distinct
treatments on a single connected hairline: a stage ladder, a runtime switch, a
guardrail ledger.

### 10. Manifesto — tie it back
"Runs on your machine" and "Talks to 12 providers" should reference the same
inventory as the strip rather than restating it as a sentence.

### 11. Highlights — a ledger, not cards
Four more cards. A hairline-ruled list with the category as a mono gutter label.
Last block before the CTA, so it should read as a quiet index.

### 12. Closing CTA, portal, footer
Left alone. Already distinctive, and the portal's own motion is the strongest thing
on the page.

## Rhythm

The page is one flat `#14120b` field from the hero to the footer, which is part of
why it feels endless. Add hairline rules and a very subtle raised plate at a few
section boundaries so the page has cadence.

## Order of work

1. Feature B, the gates — biggest single win, most obviously static
2. Feature D, the config — weakest visually, strongest claim
3. Feature A, the handoff; Feature C, the excerpts
4. Changelog timeline, highlights ledger, receipt excerpts, capability system
5. Provider strip count, hero reveal
6. Section rhythm
7. Full verification, re-approve baselines, review every image
