export type GamePrompt = { text: string; choices: [string, string, string]; answer: number; why: string };
export type FieldGame = { id: string; title: string; levelId: string; description: string; prompts: GamePrompt[] };

export const games: FieldGame[] = [
  { id: 'status-code-match', title: 'Status Code Match', levelId: 'L0-recruit', description: 'Use the response as a clue to understand what happened.', prompts: [
    { text: 'A customer requests an order ID that does not exist. Which response is the clearest clue?', choices: ['200 — OK', '404 — Not Found', '500 — Server Error'], answer: 1, why: '404 says the requested resource was not found.' },
    { text: 'The API request worked and returned the expected record.', choices: ['200 — OK', '401 — Unauthorized', '503 — Unavailable'], answer: 0, why: 'A 2xx response signals success; 200 is a common success response.' },
    { text: 'The service is temporarily overloaded and asks the client to try later.', choices: ['429 — Too Many Requests', '200 — OK', '404 — Not Found'], answer: 0, why: '429 indicates rate limiting. Respect the retry guidance.' },
  ] },
  { id: 'terminal-quest', title: 'Terminal Quest', levelId: 'L0-recruit', description: 'Choose a safe command for the task in front of you.', prompts: [
    { text: 'You want to see which folder you are currently in. What do you run?', choices: ['pwd', 'rm', 'git push'], answer: 0, why: '`pwd` prints the current working directory.' },
    { text: 'You want to list files in the current folder.', choices: ['cd ..', 'ls', 'exit'], answer: 1, why: '`ls` lists files and folders.' },
    { text: 'You want to move into a folder named `project`.', choices: ['cd project', 'pwd project', 'delete project'], answer: 0, why: '`cd project` changes into the project folder.' },
  ] },
  { id: 'json-debugger', title: 'JSON Debugger', levelId: 'L0-recruit', description: 'Check the shape and type of data before it moves.', prompts: [
    { text: 'Which JSON value is a valid text string?', choices: ['ready', '"ready"', '"ready'], answer: 1, why: 'A JSON string needs a matching pair of double quotes.' },
    { text: 'Which JSON object is valid?', choices: ['{ "id": 7 }', '{ id: 7 }', '{ "id": 7, }'], answer: 0, why: 'JSON object keys are quoted, and the last item has no trailing comma.' },
    { text: 'The receiver expects a numeric `count`. Which value matches?', choices: ['"12"', '12', 'twelve'], answer: 1, why: '12 is a number. "12" is text, which is a different data type.' },
  ] },
  { id: 'api-range', title: 'API Range', levelId: 'L1-builder', description: 'Choose a request that fits the customer task.', prompts: [
    { text: 'You need to read an order without changing it. Which method is the best fit?', choices: ['GET', 'DELETE', 'POST'], answer: 0, why: 'GET is used to retrieve a resource without changing it.' },
    { text: 'You are creating a new support ticket with a JSON body.', choices: ['POST /tickets', 'GET /tickets/7', 'DELETE /tickets'], answer: 0, why: 'POST commonly creates a resource from the supplied body.' },
    { text: 'A private endpoint returns 401. What should you inspect first?', choices: ['Authentication and token scope', 'The page color', 'The response font'], answer: 0, why: '401 points to missing or invalid authentication.' },
  ] },
  { id: 'data-desk', title: 'Data Desk', levelId: 'L1-builder', description: 'Read a small table and choose a precise query.', prompts: [
    { text: 'You need only unpaid invoices. Which step narrows the rows?', choices: ['Filter status = unpaid', 'Select every column', 'Delete paid rows'], answer: 0, why: 'A filter selects the rows matching the task.' },
    { text: 'Invoice rows contain customer_id. You need the customer name too.', choices: ['Join customers on customer_id', 'Sort invoice IDs', 'Rename every invoice'], answer: 0, why: 'A join connects related rows through a shared key.' },
    { text: 'Before an approved UPDATE, how do you check the target rows?', choices: ['Run a SELECT with the same WHERE clause', 'Run DELETE first', 'Remove the WHERE clause'], answer: 0, why: 'A SELECT preview helps verify scope before changing data.' },
  ] },
  { id: 'dockerfile-puzzle', title: 'Dockerfile Puzzle', levelId: 'L1-builder', description: 'Arrange safe, repeatable container choices.', prompts: [
    { text: 'Where should a production API key go?', choices: ['Runtime secret configuration', 'A Dockerfile literal', 'A committed README'], answer: 0, why: 'Secrets should be injected securely at runtime, not baked into an image.' },
    { text: 'A service listens on port 8080 inside its container. What should you document?', choices: ['The container port and required run configuration', 'Only the laptop wallpaper', 'A database password'], answer: 0, why: 'Clear port configuration lets the environment route traffic correctly.' },
    { text: 'What makes a container build repeatable?', choices: ['Pinned runtime and explicit dependencies', 'Installing random latest packages on every run', 'Editing the running container by hand'], answer: 0, why: 'Explicit versions reduce “works on my machine” surprises.' },
  ] },
  { id: 'retry-storm', title: 'Retry Storm', levelId: 'L2-integrator', description: 'Recover from temporary failures without amplifying them.', prompts: [
    { text: 'An API returns 429 with a retry-after value. What is the right response?', choices: ['Wait as requested, then retry within a limit', 'Retry every millisecond', 'Disable authentication'], answer: 0, why: 'Respect rate limits and bound the retry behavior.' },
    { text: 'A create request times out after the provider may have processed it.', choices: ['Retry with the same idempotency key', 'Retry with a new action ID each time', 'Assume it definitely failed'], answer: 0, why: 'A stable idempotency key prevents duplicate effects.' },
    { text: 'Failures continue after several attempts. What should happen?', choices: ['Stop, record the failure, and alert or queue recovery', 'Retry forever', 'Hide all errors'], answer: 0, why: 'Bounded retries protect the service and make recovery visible.' },
  ] },
  { id: 'pipeline-builder', title: 'Pipeline Builder', levelId: 'L2-integrator', description: 'Connect extraction, validation, transformation, and loading.', prompts: [
    { text: 'A source record is missing a required customer ID. Where should it go?', choices: ['A visible rejected-record path', 'Silently into the destination', 'Back into the source as a password'], answer: 0, why: 'Invalid rows should be reported for correction rather than silently accepted.' },
    { text: 'A pipeline restarts halfway through a large import.', choices: ['Resume from a checkpoint or stable cursor', 'Start an untracked duplicate import', 'Discard the run log'], answer: 0, why: 'A checkpoint supports safe recovery.' },
    { text: 'The destination expects a different date format.', choices: ['Transform and validate the date before loading', 'Rename the destination table', 'Ignore the schema'], answer: 0, why: 'Transform data to the destination contract, then validate it.' },
  ] },
  { id: 'webhook-doctor', title: 'Webhook Doctor', levelId: 'L2-integrator', description: 'Diagnose a webhook and process deliveries safely.', prompts: [
    { text: 'A webhook includes a signature header. What do you do before trusting its body?', choices: ['Verify the signature with the shared secret', 'Trust the sender IP alone', 'Log the secret publicly'], answer: 0, why: 'Signature verification helps confirm the payload came from the expected sender.' },
    { text: 'The provider may deliver the same event twice.', choices: ['Store the event ID and make processing idempotent', 'Create two records every time', 'Reject all future events'], answer: 0, why: 'Deduplication prevents repeated deliveries from causing duplicate effects.' },
    { text: 'A handler needs 40 seconds to update downstream systems.', choices: ['Validate, enqueue work, and acknowledge promptly', 'Keep the webhook connection open indefinitely', 'Return success before checking the signature'], answer: 0, why: 'Acknowledge promptly and process slower work asynchronously.' },
  ] },
  { id: 'rag-workshop', title: 'RAG Workshop', levelId: 'L3-ai-engineer', description: 'Ground an answer in relevant, permitted source material.', prompts: [
    { text: 'A user asks about a policy. What should happen before searching documents?', choices: ['Filter to documents the user may access', 'Search every tenant’s files', 'Invent a policy from memory'], answer: 0, why: 'Access checks must constrain retrieval.' },
    { text: 'Retrieved passages do not contain the answer.', choices: ['Say the sources do not provide enough evidence', 'Make up a confident answer', 'Cite an unrelated file'], answer: 0, why: 'A grounded assistant should admit when evidence is missing.' },
    { text: 'How can the customer verify the answer?', choices: ['Show links or citations to the retrieved passages', 'Hide the sources', 'Show a random URL'], answer: 0, why: 'Citations let users check the evidence.' },
  ] },
  { id: 'tool-calling', title: 'Tool Calling', levelId: 'L3-ai-engineer', description: 'Use narrow tools with validated arguments and permissions.', prompts: [
    { text: 'The model requests an order lookup. What must the application verify?', choices: ['Argument shape and the user’s access to that order', 'Only that the model wrote valid English', 'Nothing if the model sounds certain'], answer: 0, why: 'Validate tool inputs and authorization outside the model.' },
    { text: 'The model proposes refunding a payment.', choices: ['Require an explicit policy check and confirmation path', 'Execute every generated request immediately', 'Hide the action from the audit log'], answer: 0, why: 'Consequential actions need strict safeguards and traceability.' },
    { text: 'A tool returns an error.', choices: ['Handle the error and give the model safe result context', 'Pretend the tool succeeded', 'Send its credentials in the prompt'], answer: 0, why: 'The workflow must handle tool failures honestly and securely.' },
  ] },
  { id: 'prompt-fixer', title: 'Prompt Fixer', levelId: 'L3-ai-engineer', description: 'Improve an instruction so the model can do a bounded task.', prompts: [
    { text: 'The model writes long summaries. What prompt detail could help?', choices: ['A target length and required fields', '“Do something good”', 'More unrelated documents'], answer: 0, why: 'Specific constraints make the expected output clearer.' },
    { text: 'The source may not contain an answer. What instruction is useful?', choices: ['Say when the evidence is missing', 'Always guess', 'Invent a source'], answer: 0, why: 'An uncertainty rule reduces unsupported claims.' },
    { text: 'A revised prompt appears better on one example. What next?', choices: ['Try a varied set of representative examples', 'Ship without checking edge cases', 'Remove the original test cases'], answer: 0, why: 'Evaluate changes across examples, not just one demo.' },
  ] },
  { id: 'eval-lab', title: 'Eval Lab', levelId: 'L3-ai-engineer', description: 'Check AI behavior against a repeatable set of examples.', prompts: [
    { text: 'What is a useful starting evaluation set?', choices: ['Representative inputs with expected behavior', 'Only the best demo', 'Random production secrets'], answer: 0, why: 'A representative set makes regressions visible.' },
    { text: 'A grounded answer cites a passage that does not support it.', choices: ['Mark it as a grounding failure', 'Pass it because the citation exists', 'Ignore source quality'], answer: 0, why: 'A citation must support the answer, not just be present.' },
    { text: 'You changed the retrieval step. What should you do?', choices: ['Re-run relevant quality and latency evaluations', 'Assume results are unchanged', 'Delete previous measurements'], answer: 0, why: 'Changes can affect quality and performance, so compare them.' },
  ] },
  { id: 'security-checkpoint', title: 'Security Checkpoint', levelId: 'L4-field-operator', description: 'Catch unsafe access and secret-handling decisions.', prompts: [
    { text: 'A service only needs to read tickets. Which permission is safer?', choices: ['Read-only ticket access', 'Administrator access to the full account', 'A shared employee password'], answer: 0, why: 'Grant only the access needed for the task.' },
    { text: 'A token appears in a source file committed to Git.', choices: ['Revoke or rotate it and remove it from active use', 'Leave it because the repository is private', 'Paste it in a bug report'], answer: 0, why: 'Treat the credential as exposed and rotate it.' },
    { text: 'A request contains a customer-supplied tenant ID.', choices: ['Verify it against the authenticated identity', 'Trust it as the authorization decision', 'Use it to choose any database'], answer: 0, why: 'Tenant scope needs a trusted server-side authorization check.' },
  ] },
  { id: 'incident-commander', title: 'Incident Commander', levelId: 'L4-field-operator', description: 'Reduce impact, coordinate responders, and communicate clearly.', prompts: [
    { text: 'Customers report failed syncs after a release. What comes first?', choices: ['Confirm impact and stabilize or roll back safely', 'Add unrelated features', 'Delete the incident timeline'], answer: 0, why: 'Reduce customer impact and establish the facts.' },
    { text: 'A nontechnical stakeholder asks for an update.', choices: ['Share impact, current action, owner, and next update time', 'Send raw stack traces only', 'Wait until the incident is over'], answer: 0, why: 'Clear updates help stakeholders know what is happening.' },
    { text: 'The service is stable again.', choices: ['Verify recovery, document causes and follow-up owners', 'Close without checking metrics', 'Blame one person publicly'], answer: 0, why: 'Confirm recovery and turn lessons into owned follow-ups.' },
  ] },
  { id: 'deploy-roulette', title: 'Deploy Roulette', levelId: 'L4-field-operator', description: 'Choose a deployment approach that fits the environment.', prompts: [
    { text: 'The customer network is air-gapped. How do you deliver dependencies?', choices: ['Use the approved signed transfer process', 'Assume public package downloads work', 'Disable all integrity checks'], answer: 0, why: 'Respect the network boundary and verify the approved artifact.' },
    { text: 'A database migration may be hard to reverse.', choices: ['Test it on representative data and define a recovery plan', 'Run it first on production with no backup', 'Skip release notes'], answer: 0, why: 'Understand impact and recovery before a risky migration.' },
    { text: 'A rollout affects many customer tenants.', choices: ['Use a staged rollout and monitor signals', 'Enable it everywhere without checks', 'Turn off alerts'], answer: 0, why: 'Gradual rollout limits blast radius and supports early detection.' },
  ] },
  { id: 'customer-room', title: 'Customer Room', levelId: 'L5-fde-hero', description: 'Ask questions that uncover the workflow behind a request.', prompts: [
    { text: 'A customer says, “We need AI for invoices.” What is a useful first question?', choices: ['Walk me through how invoices are reviewed today', 'Which model name should we use?', 'Can we skip the users?'], answer: 0, why: 'Start with the workflow and the people doing it.' },
    { text: 'The customer describes three exception types.', choices: ['Ask which exception causes the greatest impact', 'Promise to automate all three immediately', 'Change the subject'], answer: 0, why: 'Prioritize based on impact and evidence.' },
    { text: 'You summarize the request back to the team.', choices: ['Ask them to correct your understanding', 'Assume silence means agreement', 'Hide the constraints'], answer: 0, why: 'A playback gives people a chance to correct assumptions.' },
  ] },
  { id: 'scope-wars', title: 'Scope Wars', levelId: 'L5-fde-hero', description: 'Turn an ambitious request into a clear, testable first outcome.', prompts: [
    { text: 'The team requests six features for a one-week pilot.', choices: ['Agree on the smallest outcome that tests the core value', 'Promise all six without checking dependencies', 'Remove acceptance criteria'], answer: 0, why: 'A focused slice makes the pilot achievable and informative.' },
    { text: 'A data permission is owned by another team.', choices: ['Record it as a dependency with an owner and date', 'Pretend it is already approved', 'Ignore it until launch'], answer: 0, why: 'Explicit dependencies help the plan reflect reality.' },
    { text: 'A stakeholder adds a new requirement mid-pilot.', choices: ['Review impact and agree whether scope or timing changes', 'Quietly absorb the work', 'Reject without discussion'], answer: 0, why: 'Make trade-offs visible and agree on the change.' },
  ] },
  { id: 'interview-gauntlet', title: 'Interview Gauntlet', levelId: 'L5-fde-hero', description: 'Choose a response that shows technical judgment and customer ownership.', prompts: [
    { text: 'You get an ambiguous system-design question. What should you do first?', choices: ['Ask a few clarifying questions and state assumptions', 'Guess silently', 'Start listing technologies'], answer: 0, why: 'Clarifying the goal and constraints makes the design useful.' },
    { text: 'You have not used the tool mentioned by the interviewer.', choices: ['Be honest and explain how you would learn or reason through it', 'Claim expert experience', 'End the conversation'], answer: 0, why: 'Honest reasoning is stronger than invented experience.' },
    { text: 'You describe a project result.', choices: ['Explain your contribution and evidence for the outcome', 'Claim team work as only yours', 'Avoid the result'], answer: 0, why: 'Specific ownership and evidence make the story credible.' },
  ] },
  { id: 'portfolio-review', title: 'Portfolio Review', levelId: 'L5-fde-hero', description: 'Make a project easy to understand, run, and verify.', prompts: [
    { text: 'Your demo uses customer records. What should you publish?', choices: ['A synthetic-data version with private details removed', 'The original records', 'A screenshot showing API keys'], answer: 0, why: 'Use safe sample data and never expose customer information or secrets.' },
    { text: 'A reviewer wants to run your project.', choices: ['Provide prerequisites and exact run steps', 'Tell them it only works on your laptop', 'Omit the README'], answer: 0, why: 'Clear setup instructions make the work reproducible.' },
    { text: 'Your project has a known limitation.', choices: ['State it plainly and explain what you would improve', 'Hide it', 'Claim the feature is complete'], answer: 0, why: 'A clear limitation shows judgment and gives context.' },
  ] },
];

export const gameById = Object.fromEntries(games.map((game) => [game.id, game])) as Record<string, FieldGame>;
