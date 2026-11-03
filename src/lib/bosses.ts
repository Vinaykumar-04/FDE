export type BossStep = { prompt: string; choices: [string, string, string]; answer: number; why: string };
export type Boss = { id: string; levelId: string; title: string; intro: string; steps: BossStep[] };

export const bosses: Boss[] = [
  { id: 'integration-script', levelId: 'L0-recruit', title: 'Fix the broken sync', intro: 'A customer’s order integration is losing updates. Make careful decisions to repair it and hand it over.', steps: [
    { prompt: 'The customer says their order sync sometimes misses updates. What do you do first?', choices: ['Ask for one affected example and map the current workflow', 'Rewrite the integration immediately', 'Tell them to send every database record'], answer: 0, why: 'Start with a concrete example and the workflow. That narrows the problem safely.' },
    { prompt: 'The receiver expects `order_id`, but the script sends `id`. What next?', choices: ['Map the fields and test one safe sample', 'Change every field name in production', 'Ignore the mismatch'], answer: 0, why: 'Confirm the mapping with a sample before changing a live flow.' },
    { prompt: 'The test passes. What closes the engagement well?', choices: ['Explain the change, limits, and how to monitor it', 'Delete the notes', 'Leave without telling the customer'], answer: 0, why: 'A clear handover helps the customer operate the fix.' },
  ] },
  { id: 'container-api', levelId: 'L1-builder', title: 'Ship the container API', intro: 'A customer needs a small service they can run consistently. Prepare, test, and hand off the container.', steps: [
    { prompt: 'The API works locally but uses an unpinned Python version. What should you do?', choices: ['Pin a supported runtime and dependencies', 'Copy your entire laptop into the image', 'Skip the build check'], answer: 0, why: 'Pinned runtime details make the build repeatable.' },
    { prompt: 'A secret is required when the container starts.', choices: ['Inject it from the approved runtime secret store', 'Bake it into the Dockerfile', 'Add it to the image README'], answer: 0, why: 'Runtime secrets stay outside the distributed image.' },
    { prompt: 'What is a useful final handover check?', choices: ['Run the image with documented ports and configuration', 'Only check that the file exists', 'Delete the startup instructions'], answer: 0, why: 'A clean run using documented settings verifies the customer path.' },
  ] },
  { id: 'duplicate-safe-sync', levelId: 'L2-integrator', title: 'Sync two systems safely', intro: 'Events may arrive late or more than once. Design a sync that can recover without duplicate records.', steps: [
    { prompt: 'A webhook delivery is repeated. What identifies the duplicate?', choices: ['A stored stable event ID', 'The color of the dashboard', 'A new random ID each time'], answer: 0, why: 'A stable event ID lets the receiver recognize re-delivery.' },
    { prompt: 'The destination API is rate-limiting requests.', choices: ['Use bounded backoff and respect retry guidance', 'Send more parallel requests', 'Drop every pending event'], answer: 0, why: 'Backoff reduces pressure while keeping a recovery path.' },
    { prompt: 'How do you verify the sync did not lose or duplicate data?', choices: ['Compare run counts and sample records across both systems', 'Trust one success response', 'Clear the logs before checking'], answer: 0, why: 'Reconciliation checks provide evidence of completeness and uniqueness.' },
  ] },
  { id: 'grounded-assistant', levelId: 'L3-ai-engineer', title: 'Ship a grounded assistant', intro: 'Build an assistant that uses approved documents, shows evidence, and handles missing answers honestly.', steps: [
    { prompt: 'A user asks about a private policy. What constrains the search?', choices: ['The user’s authorized document set', 'Every customer’s files', 'The model’s guess'], answer: 0, why: 'Access must be enforced before retrieval.' },
    { prompt: 'The retrieved passages do not answer the question.', choices: ['Say the sources do not provide enough evidence', 'Invent a citation', 'Answer confidently anyway'], answer: 0, why: 'A grounded assistant must be allowed to say it does not know.' },
    { prompt: 'What is a useful release check?', choices: ['Run a representative evaluation set and inspect citations', 'Try one ideal prompt only', 'Remove the failure examples'], answer: 0, why: 'A varied evaluation checks quality and grounding beyond the happy path.' },
  ] },
  { id: 'production-incident', levelId: 'L4-field-operator', title: 'Survive the incident', intro: 'A release has disrupted customer syncs. Reduce impact, coordinate recovery, and leave the system safer.', steps: [
    { prompt: 'Customers report widespread failures after a release. First action?', choices: ['Confirm impact and stabilize or roll back safely', 'Continue the rollout without checks', 'Delete the incident channel'], answer: 0, why: 'Reduce impact first, using the safest available recovery action.' },
    { prompt: 'A stakeholder needs an update while responders investigate.', choices: ['State impact, current action, owner, and next update time', 'Send raw logs with no context', 'Wait silently until the end'], answer: 0, why: 'Regular, clear updates keep the customer aligned.' },
    { prompt: 'The service appears recovered. What confirms that?', choices: ['Check customer-facing signals and document follow-ups', 'Close the incident from one green metric', 'Remove the alert rules'], answer: 0, why: 'Verify recovery across useful signals, then assign follow-up work.' },
  ] },
  { id: 'customer-engagement', levelId: 'L5-fde-hero', title: 'Lead the engagement', intro: 'Turn a customer request into a measured outcome, deliver a useful solution, and hand it over clearly.', steps: [
    { prompt: 'The customer asks for a broad AI project. How do you start?', choices: ['Map the workflow and agree on a measurable first outcome', 'Promise every requested feature', 'Choose a model before asking about users'], answer: 0, why: 'Discovery and a measurable outcome keep the work tied to customer value.' },
    { prompt: 'The pilot has a dependency owned by another team.', choices: ['Record the dependency, owner, risk, and decision date', 'Hide the dependency', 'Assume it will be ready'], answer: 0, why: 'Visible ownership lets the team manage the risk early.' },
    { prompt: 'The solution is ready for handover. What belongs in the closeout?', choices: ['Demo, operating notes, known limits, owners, and next steps', 'A feature list only', 'An unverified impact claim'], answer: 0, why: 'A useful closeout helps the customer run and evaluate the solution.' },
  ] },
];

export const bossById = Object.fromEntries(bosses.map((boss) => [boss.id, boss])) as Record<string, Boss>;
