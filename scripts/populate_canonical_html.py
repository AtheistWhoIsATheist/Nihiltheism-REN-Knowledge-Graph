# scripts/populate_canonical_html.py
import re
import json

tree1_html = """    <details open class="level-0 root-node"><summary><span class="node-label">JOURNAL314 Ω — Nihiltheistic Hypermarkmap</span><span class="count">1</span></summary>
<div class="children">
<details open class="level-1 "><summary><span class="node-label">0. Orientation: The Map Is Not a Summary</span><span class="count">1</span></summary>
<div class="children">
<details class="level-2 "><summary><span class="node-label">Knowledge-distribution engine</span><span class="count">2</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Absorbs original 314 Markmap</span><span class="count">4</span></summary>
<div class="children">
<details class="level-4 "><summary><span class="node-label">Original Structure</span><span class="count">4</span></summary>
<div class="children">
<details class="level-5 "><summary><span class="node-label">Theme</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Key concepts</span></div>
<div class="leaf level-6 "><span class="node-label">Major topics</span></div>
<div class="leaf level-6 "><span class="node-label">Relevant issues</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Figure</span><span class="count">1</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Notable figures</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Philosophers</span></div>
<div class="leaf level-6 "><span class="node-label">Authors</span></div>
<div class="leaf level-6 "><span class="node-label">Thinkers</span></div>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Quote-fragment</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Significant statements</span></div>
<div class="leaf level-6 "><span class="node-label">Contextual importance</span></div>
<div class="leaf level-6 "><span class="node-label">Reflection prompts</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Recurrence-signal</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Patterns in thought</span></div>
<div class="leaf level-6 "><span class="node-label">Common themes</span></div>
<div class="leaf level-6 "><span class="node-label">Repeated phrases</span></div>
</div></details>
</div></details>
<details class="level-4 "><summary><span class="node-label">Preservation Features</span><span class="count">6</span></summary>
<div class="children">
<details class="level-5 "><summary><span class="node-label">Conceptual continuity</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Maintaining core ideas</span></div>
<div class="leaf level-6 "><span class="node-label">Connecting themes over time</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Thematic relevance</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Addressing contemporary issues</span></div>
<div class="leaf level-6 "><span class="node-label">Aligning with current discourse</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Signal retention</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Key concepts highlighted</span></div>
<div class="leaf level-6 "><span class="node-label">Identifying significant phrases</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Content fidelity</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Original meanings preserved</span></div>
<div class="leaf level-6 "><span class="node-label">Authentic representation of thoughts</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Adaptive integration</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Tailoring to diverse audiences</span></div>
<div class="leaf level-6 "><span class="node-label">Balancing rigor and accessibility</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Stability across revisions</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Consistent structure</span></div>
<div class="leaf level-6 "><span class="node-label">Evolution without loss of essence</span></div>
</div></details>
</div></details>
<details class="level-4 "><summary><span class="node-label">Integration Process</span><span class="count">5</span></summary>
<div class="children">
<details class="level-5 "><summary><span class="node-label">Content Curation</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Content filtering</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Relevance assessment</span></div>
<div class="leaf level-6 "><span class="node-label">Quality checks</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Selection principles</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Criteria for inclusion</span></div>
<div class="leaf level-6 "><span class="node-label">Elimination of redundancy</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Contextual modifications</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Tailoring themes</span></div>
<div class="leaf level-6 "><span class="node-label">Adjusting tone and style</span></div>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Collaboration</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Stakeholder input</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Feedback loops</span></div>
<div class="leaf level-6 "><span class="node-label">Engaging experts</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Multidisciplinary approach</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Incorporating diverse fields</span></div>
<div class="leaf level-6 "><span class="node-label">Cross-sectional collaboration</span></div>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Continuous Improvement</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Iterative revisions</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Reviewing effectiveness</span></div>
<div class="leaf level-6 "><span class="node-label">Updating based on feedback</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Performance metrics</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Measuring impact</span></div>
<div class="leaf level-6 "><span class="node-label">Analyzing user engagement</span></div>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Accessibility</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">User-friendly design</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Simplified navigation</span></div>
<div class="leaf level-6 "><span class="node-label">Visual aids integration</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Diverse formats</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Text, audio, video</span></div>
<div class="leaf level-6 "><span class="node-label">Interactive events and discussions</span></div>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Knowledge Sharing</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Community building</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Forum creation</span></div>
<div class="leaf level-6 "><span class="node-label">Resource-sharing initiatives</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Open access policies</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Public availability</span></div>
<div class="leaf level-6 "><span class="node-label">Elimination of paywalls</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-4 "><summary><span class="node-label">Utility</span><span class="count">5</span></summary>
<div class="children">
<details class="level-5 "><summary><span class="node-label">Enhanced Understanding</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Deepens knowledge retention</span></div>
<div class="leaf level-6 "><span class="node-label">Facilitates theory application</span></div>
<div class="leaf level-6 "><span class="node-label">Promotes critical inquiry</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Comparative Analysis</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Evaluation of philosophical schools</span></div>
<div class="leaf level-6 "><span class="node-label">Contrasting varying worldviews</span></div>
<div class="leaf level-6 "><span class="node-label">Synthesizing insights and critiques</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Framework for Discourse</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Structured philosophical dialogues</span></div>
<div class="leaf level-6 "><span class="node-label">Resources for academic debates</span></div>
<div class="leaf level-6 "><span class="node-label">Platforms for public engagement</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Practical Applications</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Integration in educational settings</span></div>
<div class="leaf level-6 "><span class="node-label">Utilization in therapy and counseling</span></div>
<div class="leaf level-6 "><span class="node-label">Influence on art and creative expression</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Informing Future Research</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Identifying gaps in literature</span></div>
<div class="leaf level-6 "><span class="node-label">Inspiration for new philosophical inquiries</span></div>
<div class="leaf level-6 "><span class="node-label">Encouraging interdisciplinary studies</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-3 "><summary><span class="node-label">Extends original map</span><span class="count">3</span></summary>
<div class="children">
<details class="level-4 "><summary><span class="node-label">Original map queries</span><span class="count">4</span></summary>
<div class="children">
<details class="level-5 "><summary><span class="node-label">Thinkers under existential themes</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Key figures</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Prominent philosophers</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Jean-Paul Sartre</span></div>
<div class="leaf level-6 "><span class="node-label">Simone de Beauvoir</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Influential authors</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Fyodor Dostoevsky</span></div>
<div class="leaf level-6 "><span class="node-label">Franz Kafka</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Modern theorists</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Albert Camus</span></div>
<div class="leaf level-6 "><span class="node-label">Viktor Frankl</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Core philosophies</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Existentialism</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Freedom of choice</span></div>
<div class="leaf level-6 "><span class="node-label">Authenticity</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Absurdism</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Search for meaning</span></div>
<div class="leaf level-6 "><span class="node-label">Acceptance of chaos</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Nihilism</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Rejection of inherent meaning</span></div>
<div class="leaf level-6 "><span class="node-label">Consequences on perception</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Influential quotes</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Foundational statements</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">&quot;Existence precedes essence.&quot; – Sartre</span></div>
<div class="leaf level-6 "><span class="node-label">&quot;The struggle itself towards the heights is enough to fill a man&#x27;s heart.&quot; – Camus</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Key insights</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Meaning through individual experience</span></div>
<div class="leaf level-6 "><span class="node-label">Embracing absurdity as a response</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Thought-provoking reflections</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">The impact of despair</span></div>
<div class="leaf level-6 "><span class="node-label">The role of action in creating meaning</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Hypermap queries</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Nihilistic disclosure</span><span class="count">5</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Definitions</span><span class="count">6</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Core Concepts</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Inherent Meaning Absence</span></div>
<div class="leaf level-6 "><span class="node-label">Existential Void</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Theoretical Frameworks</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Critiques of Existentialism</span></div>
<div class="leaf level-6 "><span class="node-label">Perspectives on Absurdism</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Historical Perspectives</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Influential Figures</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Friedrich Nietzsche</span></div>
<div class="leaf level-6 "><span class="node-label">Arthur Schopenhauer</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Key Movements</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Nihilism in Literature</span></div>
<div class="leaf level-6 "><span class="node-label">Philosophical Anarchism</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Current Implications</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Societal Impacts</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Rise of Skepticism</span></div>
<div class="leaf level-6 "><span class="node-label">Challenges to Belief Systems</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Contemporary Discourse</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Nihilism in Modern Philosophy</span></div>
<div class="leaf level-6 "><span class="node-label">Critiques in Cultural Studies</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Cultural Interpretations</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Media Representation</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Literature Examples</span></div>
<div class="leaf level-6 "><span class="node-label">Film and Art References</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Public Perception</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Misunderstandings of Nihilism</span></div>
<div class="leaf level-6 "><span class="node-label">Associative Stigma</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Personal Implications</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Existential Reflections</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Individual Search for Meaning</span></div>
<div class="leaf level-6 "><span class="node-label">Coping with Inherent Uncertainty</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Psychological Effects</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Emotional Responses</span></div>
<div class="leaf level-6 "><span class="node-label">Strategies for Resilience</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Historical perspectives</span><span class="count">4</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Influential Figures</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Friedrich Nietzsche</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Existential nihilism advocate</span></div>
<div class="leaf level-6 "><span class="node-label">Concept of the &quot;Übermensch&quot;</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Arthur Schopenhauer</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Pessimistic philosophy</span></div>
<div class="leaf level-6 "><span class="node-label">Will to live concept</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Key Movements</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Nihilism in Literature</span><span class="count">5</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Key Works</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Prominent Authors</span><span class="count">4</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Albert Camus</span></div>
<div class="leaf level-6 "><span class="node-label">Fyodor Dostoevsky</span></div>
<div class="leaf level-6 "><span class="node-label">Jean-Paul Sartre</span></div>
<div class="leaf level-6 "><span class="node-label">Franz Kafka</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Notable Titles</span><span class="count">4</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">&quot;The Stranger&quot; - Camus</span></div>
<div class="leaf level-6 "><span class="node-label">&quot;Notes from Underground&quot; - Dostoevsky</span></div>
<div class="leaf level-6 "><span class="node-label">&quot;Nausea&quot; - Sartre</span></div>
<div class="leaf level-6 "><span class="node-label">&quot;The Metamorphosis&quot; - Kafka</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Themes</span><span class="count">4</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Existential Despair</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Characters&#x27; struggles</span></div>
<div class="leaf level-6 "><span class="node-label">Search for meaning</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Absurdity</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Encountering chaos</span></div>
<div class="leaf level-6 "><span class="node-label">Rejection of traditional values</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Alienation</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Isolation of protagonists</span></div>
<div class="leaf level-6 "><span class="node-label">Disconnection from society</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Moral Cynicism</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Questioning ethical frameworks</span></div>
<div class="leaf level-6 "><span class="node-label">Exploration of nihilistic morality</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Literary Techniques</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Symbolism</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Objects representing nihilistic concepts</span></div>
<div class="leaf level-6 "><span class="node-label">Ambiguity in meanings</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Characterization</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Complex, flawed characters</span></div>
<div class="leaf level-6 "><span class="node-label">Development through nihilistic experiences</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Narrative Structure</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Non-linear storytelling</span></div>
<div class="leaf level-6 "><span class="node-label">Unconventional plot resolutions</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Impact</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Influence on Genre</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Shaping modern literature</span></div>
<div class="leaf level-6 "><span class="node-label">Paving the way for existentialism</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Cultural Reflections</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Representation in modern media</span></div>
<div class="leaf level-6 "><span class="node-label">Reflection of societal issues</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Reader Responses</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Provoking critical thought</span></div>
<div class="leaf level-6 "><span class="node-label">Challenging perceptions of meaning</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Critiques</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Misinterpretations</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Misconceptions about nihilism</span></div>
<div class="leaf level-6 "><span class="node-label">Association with despair</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Contextual Relevance</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Literature as a response to historical events</span></div>
<div class="leaf level-6 "><span class="node-label">Connection to philosophical discourses</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Evolution of Themes</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Changes over time</span></div>
<div class="leaf level-6 "><span class="node-label">Adaptation to contemporary issues</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Philosophical Anarchism</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Rejection of conventional authority</span></div>
<div class="leaf level-6 "><span class="node-label">Emphasis on individual autonomy</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Societal Impact</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Rise of Skepticism</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Challenges to traditional beliefs</span></div>
<div class="leaf level-6 "><span class="node-label">Doubt in established norms</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Erosion of Communal Values</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Decreased trust in social institutions</span></div>
<div class="leaf level-6 "><span class="node-label">Shift towards individualism</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Contemporary Discourse</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Nihilism in Modern Philosophy</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Discussions on meaning and existence</span></div>
<div class="leaf level-6 "><span class="node-label">Critiques from contemporary thinkers</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Cultural Studies Critiques</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Analyzing nihilism&#x27;s portrayal in media</span></div>
<div class="leaf level-6 "><span class="node-label">Impact on cultural narratives</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Current implications</span><span class="count">6</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Societal Impacts</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Growing skepticism</span></div>
<div class="leaf level-6 "><span class="node-label">Challenges to belief systems</span></div>
<div class="leaf level-6 "><span class="node-label">Decreased communal values</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Contemporary Discourse</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Nihilism in modern philosophy</span></div>
<div class="leaf level-6 "><span class="node-label">Cultural studies critiques</span></div>
<div class="leaf level-6 "><span class="node-label">Evolution of public perception</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Personal Implications</span><span class="count">4</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Existential reflections</span></div>
<div class="leaf level-6 "><span class="node-label">Coping with uncertainty</span></div>
<div class="leaf level-6 "><span class="node-label">Psychological effects</span></div>
<div class="leaf level-6 "><span class="node-label">Strategies for resilience</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Ethical Considerations</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Moral dilemmas</span></div>
<div class="leaf level-6 "><span class="node-label">Challenges to traditional ethics</span></div>
<div class="leaf level-6 "><span class="node-label">Debates on nihilism&#x27;s validity</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Psychological Impacts</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Mental health concerns</span></div>
<div class="leaf level-6 "><span class="node-label">Emotional responses</span></div>
<div class="leaf level-6 "><span class="node-label">Coping mechanisms</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Educational Integration</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Curriculum development</span></div>
<div class="leaf level-6 "><span class="node-label">Discussions in classrooms</span></div>
<div class="leaf level-6 "><span class="node-label">Exploration of nihilistic themes</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Cultural interpretations</span><span class="count">4</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Media Representation</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Literature Examples</span><span class="count">1</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Key Works</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">&quot;Nausea&quot; - Sartre</span></div>
<div class="leaf level-6 "><span class="node-label">&quot;The Metamorphosis&quot; - Kafka</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Film and Art References</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Notable Films</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">&quot;Fight Club&quot;</span></div>
<div class="leaf level-6 "><span class="node-label">&quot;The Truman Show&quot;</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Artistic Movements</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Absurdist Theatre</span></div>
<div class="leaf level-6 "><span class="node-label">Dadaism</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Public Perception</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Misunderstandings of Nihilism</span><span class="count">1</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Common Myths</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Nihilism as despair</span></div>
<div class="leaf level-6 "><span class="node-label">Misconception as anti-social</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Associative Stigma</span><span class="count">1</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Societal Reactions</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Fear of nihilistic views</span></div>
<div class="leaf level-6 "><span class="node-label">Marginalization of nihilist thinkers</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Impact on Society</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Cultural Narratives</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Influence on Modern Art</span></div>
<div class="leaf level-6 "><span class="node-label">Reflections in Popular Culture</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Responses to Nihilism</span><span class="count">1</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Counter Movements</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Existentialism resurgence</span></div>
<div class="leaf level-6 "><span class="node-label">Hopeful philosophies</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Personal Reflections</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Existential Search for Meaning</span><span class="count">1</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Individual Experiences</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Stories of finding purpose</span></div>
<div class="leaf level-6 "><span class="node-label">Coping with void</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Coping with Inherent Uncertainty</span><span class="count">1</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Strategies Adopted</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Community support</span></div>
<div class="leaf level-6 "><span class="node-label">Philosophical inquiry</span></div>
</div></details>
</div></details>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Personal implications</span><span class="count">8</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Existential reflections</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Individual search for meaning</span></div>
<div class="leaf level-6 "><span class="node-label">Coping with inherent uncertainty</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Psychological effects</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Emotional responses</span></div>
<div class="leaf level-6 "><span class="node-label">Strategies for resilience</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Impact on relationships</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Shift in social dynamics</span></div>
<div class="leaf level-6 "><span class="node-label">Influence on interpersonal connections</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Philosophical insights</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Integration of nihilistic themes</span></div>
<div class="leaf level-6 "><span class="node-label">Exploration of identity and purpose</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Coping mechanisms</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Practices for mindfulness</span></div>
<div class="leaf level-6 "><span class="node-label">Seeking community support</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Narrative transformations</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Personal storytelling</span></div>
<div class="leaf level-6 "><span class="node-label">Redefining life experiences</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Learning and growth</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Lessons from nihilistic viewpoints</span></div>
<div class="leaf level-6 "><span class="node-label">Encouragement of critical thinking</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Influence on creativity</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Embracing absurdity in art</span></div>
<div class="leaf level-6 "><span class="node-label">Innovation through exploration</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Distribution</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Channels of dissemination</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Academic forums</span></div>
<div class="leaf level-6 "><span class="node-label">Digital media presence</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Audience engagement</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Interactive discussions</span></div>
<div class="leaf level-6 "><span class="node-label">Diverse formats</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Cross-disciplinary links</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Sociology connections</span></div>
<div class="leaf level-6 "><span class="node-label">Psychology intersections</span></div>
<div class="leaf level-6 "><span class="node-label">Art and literature relations</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Philosophical hazard</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Risks of nihilism</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Individual consequences</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Existential crises</span></div>
<div class="leaf level-6 "><span class="node-label">Loss of motivation</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Societal effects</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Increased apathy</span></div>
<div class="leaf level-6 "><span class="node-label">Erosion of communal values</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Ethical considerations</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Moral implications</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Challenges to traditional ethics</span></div>
<div class="leaf level-6 "><span class="node-label">Dilemmas in decision-making</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Philosophical debates</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Arguments for/against nihilism</span></div>
<div class="leaf level-6 "><span class="node-label">Impact on ethical theories</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Psychological impacts</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Emotional health</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Anxiety and depression</span></div>
<div class="leaf level-6 "><span class="node-label">Sense of isolation</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Coping strategies</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Resilience building</span></div>
<div class="leaf level-6 "><span class="node-label">Finding meaning in chaos</span></div>
</div></details>
</div></details>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Distribution</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Channels of dissemination</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Academic publications</span></div>
<div class="leaf level-6 "><span class="node-label">Online platforms</span></div>
<div class="leaf level-6 "><span class="node-label">Social media outreach</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Audience engagement</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Target demographics</span></div>
<div class="leaf level-6 "><span class="node-label">Interactive formats</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Cross-disciplinary links</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Connections to sociology</span></div>
<div class="leaf level-6 "><span class="node-label">Intersections with psychology</span></div>
<div class="leaf level-6 "><span class="node-label">Relationship to art and literature</span></div>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Philosophical hazard</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Risks of nihilism</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Individual consequences</span></div>
<div class="leaf level-6 "><span class="node-label">Societal effects</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Ethical considerations</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Moral implications</span></div>
<div class="leaf level-6 "><span class="node-label">Philosophical debates</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Psychological impacts</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Mental health concerns</span></div>
<div class="leaf level-6 "><span class="node-label">Coping mechanisms</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-4 "><summary><span class="node-label">Hypermap queries</span><span class="count">3</span></summary>
<div class="children">
<details class="level-5 "><summary><span class="node-label">Nihilistic disclosure</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Definitions</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Core concepts</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Absence of inherent meaning</span></div>
<div class="leaf level-6 "><span class="node-label">Existential void</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Theoretical frameworks</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Existentialism&#x27;s critique</span></div>
<div class="leaf level-6 "><span class="node-label">Absurdism&#x27;s perspectives</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Historical perspectives</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Influential figures</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Friedrich Nietzsche</span></div>
<div class="leaf level-6 "><span class="node-label">Arthur Schopenhauer</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Key movements</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Nihilism in literature</span></div>
<div class="leaf level-6 "><span class="node-label">Philosophical anarchism</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Current implications</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Societal impacts</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Rise of skepticism</span></div>
<div class="leaf level-6 "><span class="node-label">Challenges to belief systems</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Contemporary discourse</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Nihilism in modern philosophy</span></div>
<div class="leaf level-6 "><span class="node-label">Critiques in cultural studies</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Distribution</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Channels of dissemination</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Academic forums</span></div>
<div class="leaf level-6 "><span class="node-label">Digital media presence</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Audience engagement</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Interactive discussions</span></div>
<div class="leaf level-6 "><span class="node-label">Diverse formats</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Cross-disciplinary links</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Sociology connections</span></div>
<div class="leaf level-6 "><span class="node-label">Psychology intersections</span></div>
<div class="leaf level-6 "><span class="node-label">Art and literature relations</span></div>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Philosophical hazard</span><span class="count">3</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Risks of nihilism</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Individual consequences</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Existential crises</span></div>
<div class="leaf level-6 "><span class="node-label">Loss of motivation</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Societal effects</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Increased apathy</span></div>
<div class="leaf level-6 "><span class="node-label">Erosion of communal values</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Ethical considerations</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Moral implications</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Challenges to traditional ethics</span></div>
<div class="leaf level-6 "><span class="node-label">Dilemmas in decision-making</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Philosophical debates</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Arguments for and against nihilism</span></div>
<div class="leaf level-6 "><span class="node-label">Impact on ethical theories</span></div>
</div></details>
</div></details>
<details class="level-6 "><summary><span class="node-label">Psychological impacts</span><span class="count">2</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Emotional health</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Anxiety and depression</span></div>
<div class="leaf level-6 "><span class="node-label">Sense of isolation</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Coping strategies</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Resilience building</span></div>
<div class="leaf level-6 "><span class="node-label">Finding meaning in chaos</span></div>
</div></details>
</div></details>
</div></details>
</div></details>
<details class="level-4 "><summary><span class="node-label">Result</span><span class="count">4</span></summary>
<div class="children">
<details class="level-5 "><summary><span class="node-label">Enhanced visual representation</span><span class="count">6</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Interactive elements</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Dynamic content</span></div>
<div class="leaf level-6 "><span class="node-label">Engaging interfaces</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">User navigation</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Intuitive layout</span></div>
<div class="leaf level-6 "><span class="node-label">Streamlined paths</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Data integration</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Cross-referenced sources</span></div>
<div class="leaf level-6 "><span class="node-label">Real-time updates</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Visual aids</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Infographics</span></div>
<div class="leaf level-6 "><span class="node-label">Diagrams and charts</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Accessibility features</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Alternative formats</span></div>
<div class="leaf level-6 "><span class="node-label">Multi-device compatibility</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">User feedback</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Input mechanisms</span></div>
<div class="leaf level-6 "><span class="node-label">Iterative design process</span></div>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Broader thematic mapping</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Connections to other ideologies</span></div>
<div class="leaf level-6 "><span class="node-label">Evolution over time</span></div>
<div class="leaf level-6 "><span class="node-label">Cultural relevance</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Impact on comprehension</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Clarity of concepts</span></div>
<div class="leaf level-6 "><span class="node-label">Encouragement of critical thinking</span></div>
<div class="leaf level-6 "><span class="node-label">Facilitation of discourse</span></div>
</div></details>
<details class="level-5 "><summary><span class="node-label">Engagement strategies</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">User participation</span></div>
<div class="leaf level-6 "><span class="node-label">Diverse formats for presentation</span></div>
<div class="leaf level-6 "><span class="node-label">Feedback mechanisms</span></div>
</div></details>
</div></details>
</div></details>
</div></details>
</div></details>
</div></details>"""

print("Tree 1 loaded, length:", len(tree1_html))
with open('/tmp/tree1.html', 'w', encoding='utf-8') as f:
    f.write(tree1_html)
