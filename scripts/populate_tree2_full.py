# scripts/populate_tree2_full.py
import os

# Write T1, T2, T6, T13
with open('/tmp/tree2_part1.html', 'r', encoding='utf-8') as f:
    t1_part = f.read()

# Now create the remaining parts of Tree 2:
# T1 remaining branches, T2, T6, T13
remaining = """<details class="level-4 "><summary><span class="node-label">Metaphysics</span><span class="count">3</span></summary>
<div class="children">
<details class="level-5 "><summary><span class="node-label">Key Philosophers</span><span class="count">4</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Aristotelian Metaphysics</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Substance and Essence</span></div>
<div class="leaf level-6 "><span class="node-label">Four Causes</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Leibniz</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Monadology</span></div>
<div class="leaf level-6 "><span class="node-label">Principle of Sufficient Reason</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Kant</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Transcendental Idealism</span></div>
<div class="leaf level-6 "><span class="node-label">Noumenon vs. Phenomenon</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Heidegger</span><span class="count">4</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Key Ideas</span><span class="count">5</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Being</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">What does it mean to be?</span></div>
<div class="leaf level-6 "><span class="node-label">Nature of existence</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Time</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Past, present, future interrelation</span></div>
<div class="leaf level-6 "><span class="node-label">Influence of history on Being</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Language</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Connection between language and understanding</span></div>
<div class="leaf level-6 "><span class="node-label">Language as a pathway to Being</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Technology</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Technology's impact on perception of nature</span></div>
<div class="leaf level-6 "><span class="node-label">Critique of modern technological mindset</span></div>
</div></details>
<details class="level-6 "><summary><span class="node-label">Authenticity</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Being-in-the-world as caring</span></div>
<div class="leaf level-6 "><span class="node-label">Encountering nothingness in existence</span></div>
</div></details>
</div></details>
</div></details>
</div></details>
<details class="level-5 "><summary><span class="node-label">Major Themes</span><span class="count">5</span></summary>
<div class="children">
<details class="level-6 "><summary><span class="node-label">Groundlessness</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Personal perspective</span></div>
<div class="leaf level-6 "><span class="node-label">Experience shapes understanding</span></div>
<div class="leaf level-6 "><span class="node-label">Fluidity of truth</span></div>
<div class="leaf level-6 "><span class="node-label">Existential doubt</span></div>
<div class="leaf level-6 "><span class="node-label">Interconnected identity</span></div>
<div class="leaf level-6 "><span class="node-label">Impact of relationships on self</span></div>
</div></details>
</div></details>
</div></details>
<details class="level-4 "><summary><span class="node-label">Ethics</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Moral Philosophy</span></div>
<div class="leaf level-5 "><span class="node-label">Virtue Ethics</span></div>
</div></details>
<details class="level-4 "><summary><span class="node-label">Political Philosophy</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Justice and Rights</span></div>
<div class="leaf level-5 "><span class="node-label">Social Contract Theory</span></div>
</div></details>
<details class="level-4 "><summary><span class="node-label">Aesthetics</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Nature of Beauty</span></div>
<div class="leaf level-5 "><span class="node-label">Art and Interpretation</span></div>
</div></details>
</div></details>
<details class="level-2 "><summary><span class="node-label">Psychology</span><span class="count">2</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Existential Anxiety</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-4 "><span class="node-label">Fear of meaninglessness</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Identity Crisis</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-4 "><span class="node-label">Questioning self and purpose</span></div>
</div></details>
</div></details>
<details class="level-2 "><summary><span class="node-label">Literature</span><span class="count">2</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Modernism</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-4 "><span class="node-label">Fragmentation of narrative</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Postmodernism</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-4 "><span class="node-label">Challenge of grand narratives</span></div>
</div></details>
</div></details>
<details class="level-2 "><summary><span class="node-label">Art</span><span class="count">2</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Abstract Expressionism</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-4 "><span class="node-label">Reflection of chaotic emotions</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Surrealism</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-4 "><span class="node-label">Exploration of unconscious mind</span></div>
</div></details>
</div></details>
<details class="level-2 "><summary><span class="node-label">Spirituality</span><span class="count">2</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Zen Buddhism</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-4 "><span class="node-label">Emphasis on emptiness</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Taoism</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-4 "><span class="node-label">Flow with the path of life</span></div>
</div></details>
</div></details>
</div></details>
<details open class="level-1 "><summary><span class="node-label">T2 Death / Mortality</span><span class="count">3</span></summary>
<div class="children">
<details class="level-2 "><summary><span class="node-label">Phenomenological</span><span class="count">4</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Key Theorists</span><span class="count">2</span></summary>
<div class="children">
<details class="level-4 "><summary><span class="node-label">Edmund Husserl</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Consciousness directed towards objects</span></div>
<div class="leaf level-6 "><span class="node-label">Suspension of judgment</span></div>
</div></details>
<details class="level-4 "><summary><span class="node-label">Maurice Merleau-Ponty</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Perception through the body</span></div>
<div class="leaf level-6 "><span class="node-label">Shared experience</span></div>
</div></details>
</div></details>
<details class="level-3 "><summary><span class="node-label">Core Concepts</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Subjective reality</span></div>
<div class="leaf level-5 "><span class="node-label">First-person perspective</span></div>
<div class="leaf level-6 "><span class="node-label">Past, present, future dimensions</span></div>
<div class="leaf level-6 "><span class="node-label">Memory and anticipation</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Methodological Approaches</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Detailed exploration of experiences</span></div>
<div class="leaf level-5 "><span class="node-label">Bracketing biases and assumptions</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Applications</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Understanding human experience</span></div>
<div class="leaf level-5 "><span class="node-label">Analyzing artistic expression through perception</span></div>
<div class="leaf level-5 "><span class="node-label">Moral implications of lived experiences</span></div>
</div></details>
</div></details>
<details class="level-2 "><summary><span class="node-label">Christian</span><span class="count">6</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Theological Concepts</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Unmerited favor</span></div>
<div class="leaf level-5 "><span class="node-label">Role in salvation</span></div>
<div class="leaf level-5 "><span class="node-label">Restoration of relationship with God</span></div>
<div class="leaf level-5 "><span class="node-label">Faith and works</span></div>
<div class="leaf level-5 "><span class="node-label">Assurance of salvation</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Biblical Perspectives</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Sermon on the Mount</span></div>
<div class="leaf level-6 "><span class="node-label">Parables</span></div>
<div class="leaf level-6 "><span class="node-label">Justification by faith</span></div>
<div class="leaf level-6 "><span class="node-label">Role of love</span></div>
<div class="leaf level-6 "><span class="node-label">Abrahamic covenant</span></div>
<div class="leaf level-6 "><span class="node-label">Mosaic law</span></div>
<div class="leaf level-6 "><span class="node-label">Predictions of Jesus</span></div>
<div class="leaf level-6 "><span class="node-label">Fulfillment in the New Testament</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Historical Context</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Writings and practices</span></div>
<div class="leaf level-6 "><span class="node-label">Persecution</span></div>
<div class="leaf level-6 "><span class="node-label">Legalization and expansion</span></div>
<div class="leaf level-6 "><span class="node-label">95 Theses</span></div>
<div class="leaf level-6 "><span class="node-label">Sola Scriptura</span></div>
<div class="leaf level-6 "><span class="node-label">Predestination</span></div>
<div class="leaf level-6 "><span class="node-label">Influence on Protestantism</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Spiritual Practices</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Intercessory</span></div>
<div class="leaf level-6 "><span class="node-label">Contemplative</span></div>
<div class="leaf level-5 "><span class="node-label">Role in personal growth</span></div>
<div class="leaf level-6 "><span class="node-label">Symbolism of new life</span></div>
<div class="leaf level-6 "><span class="node-label">Sign of faith</span></div>
<div class="leaf level-6 "><span class="node-label">Communion significance</span></div>
<div class="leaf level-6 "><span class="node-label">Symbol of Christ’s sacrifice</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Ethical Teachings</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Love your neighbor</span></div>
<div class="leaf level-5 "><span class="node-label">Social justice</span></div>
<div class="leaf level-5 "><span class="node-label">Importance of forgiveness</span></div>
<div class="leaf level-5 "><span class="node-label">Implications for relationships</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Mystical Traditions</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Asceticism</span></div>
<div class="leaf level-5 "><span class="node-label">Spiritual journeys</span></div>
<div class="leaf level-5 "><span class="node-label">Connection with God</span></div>
<div class="leaf level-5 "><span class="node-label">Silence and stillness</span></div>
</div></details>
</div></details>
<details class="level-2 "><summary><span class="node-label">Existentialist / Pessimist</span><span class="count">5</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Key Philosophers</span><span class="count">7</span></summary>
<div class="children">
<details class="level-4 "><summary><span class="node-label">Nietzsche</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Will to Power</span></div>
<div class="leaf level-5 "><span class="node-label">Eternal Recurrence</span></div>
<div class="leaf level-5 "><span class="node-label">Critique of Morality</span></div>
</div></details>
<details class="level-4 "><summary><span class="node-label">Sartre</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Existence Precedes Essence</span></div>
<div class="leaf level-5 "><span class="node-label">Freedom and Responsibility</span></div>
<div class="leaf level-5 "><span class="node-label">Bad Faith</span></div>
</div></details>
<details class="level-4 "><summary><span class="node-label">Cioran</span><span class="count">6</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Romanian heritage</span></div>
<div class="leaf level-6 "><span class="node-label">Education in philosophy</span></div>
<div class="leaf level-6 "><span class="node-label">Move to France</span></div>
<div class="leaf level-6 "><span class="node-label">Influence of French culture</span></div>
<div class="leaf level-6 "><span class="node-label">Themes of existential anguish</span></div>
<div class="leaf level-6 "><span class="node-label">Reflections on despair and suffering</span></div>
<div class="leaf level-6 "><span class="node-label">Critique of modern civilization</span></div>
<div class="leaf level-6 "><span class="node-label">Exploration of nihilism</span></div>
<div class="leaf level-6 "><span class="node-label">Examination of existence</span></div>
<div class="leaf level-6 "><span class="node-label">Rejection of life as inherent value</span></div>
<div class="leaf level-6 "><span class="node-label">Nature of existence</span></div>
<div class="leaf level-6 "><span class="node-label">Absurdity and meaninglessness</span></div>
<div class="leaf level-6 "><span class="node-label">Rejection of traditional values</span></div>
<div class="leaf level-6 "><span class="node-label">Emphasis on futility of life's pursuits</span></div>
<div class="leaf level-6 "><span class="node-label">View of life as suffering</span></div>
<div class="leaf level-6 "><span class="node-label">Acceptance of sorrow as part of existence</span></div>
<div class="leaf level-6 "><span class="node-label">Contemplation on mortality</span></div>
<div class="leaf level-6 "><span class="node-label">Acceptance of death’s inevitability</span></div>
<div class="leaf level-6 "><span class="node-label">Importance of solitude for self-reflection</span></div>
<div class="leaf level-6 "><span class="node-label">Isolation as a catalyst for thought</span></div>
<div class="leaf level-6 "><span class="node-label">Relativity and perception of time</span></div>
<div class="leaf level-6 "><span class="node-label">Diminishing significance of past and future</span></div>
</div></details>
</div></details>
<details class="level-3 "><summary><span class="node-label">Major Concepts</span><span class="count">5</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Personal perspective and experience</span></div>
<div class="leaf level-6 "><span class="node-label">Fading certainties in life</span></div>
<div class="leaf level-6 "><span class="node-label">Interconnectedness of being</span></div>
<div class="leaf level-6 "><span class="node-label">Acceptance</span></div>
<div class="leaf level-6 "><span class="node-label">Legacy</span></div>
<div class="leaf level-6 "><span class="node-label">Transience</span></div>
<div class="leaf level-6 "><span class="node-label">Absurdism</span></div>
<div class="leaf level-6 "><span class="node-label">Nihilism</span></div>
<div class="leaf level-6 "><span class="node-label">Existential Anxiety</span></div>
</div></details>
</div></details>
</div></details>
<details open class="level-1 "><summary><span class="node-label">T6 Darkness / Unknowing</span><span class="count">1</span></summary>
<div class="children">
<details class="level-2 "><summary><span class="node-label">Christian Apophatic</span><span class="count">4</span></summary>
<div class="children">
<details class="level-3 "><summary><span class="node-label">Key Figures</span><span class="count">3</span></summary>
<div class="children">
<details class="level-4 "><summary><span class="node-label">Pseudo-Dionysius</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">God beyond comprehension</span></div>
<div class="leaf level-6 "><span class="node-label">Mystical language</span></div>
</div></details>
<details class="level-4 "><summary><span class="node-label">John of the Cross</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Spiritual journey</span></div>
<div class="leaf level-6 "><span class="node-label">Purification process</span></div>
</div></details>
<details class="level-4 "><summary><span class="node-label">Nicholas of Cusa</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-6 "><span class="node-label">Learned ignorance</span></div>
<div class="leaf level-6 "><span class="node-label">Paradox of knowledge</span></div>
</div></details>
</div></details>
<details class="level-3 "><summary><span class="node-label">Core Concepts</span><span class="count">3</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Negation of attributes</span></div>
<div class="leaf level-5 "><span class="node-label">Emphasis on ineffability</span></div>
<div class="leaf level-5 "><span class="node-label">Direct encounter with God</span></div>
<div class="leaf level-5 "><span class="node-label">Silence as a spiritual path</span></div>
<div class="leaf level-5 "><span class="node-label">Limitations of human understanding</span></div>
<div class="leaf level-5 "><span class="node-label">Faith beyond reason</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Practices</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Silence and stillness</span></div>
<div class="leaf level-5 "><span class="node-label">Focus on awareness</span></div>
<div class="leaf level-5 "><span class="node-label">Self-denial for spiritual growth</span></div>
<div class="leaf level-5 "><span class="node-label">Emphasis on inner transformation</span></div>
</div></details>
<details class="level-3 "><summary><span class="node-label">Comparisons</span><span class="count">2</span></summary>
<div class="children">
<div class="leaf level-5 "><span class="node-label">Affirmative vs. negative theology</span></div>
<div class="leaf level-5 "><span class="node-label">Different approaches to God</span></div>
<div class="leaf level-5 "><span class="node-label">Influence on mystics</span></div>
<div class="leaf level-5 "><span class="node-label">Relevance in modern spirituality</span></div>
</div></details>
</div></details>
</div></details>
<details open class="level-1 "><summary><span class="node-label">T13 Language / Silence</span><span class="count">3</span></summary>
<div class="children">
<details class="level-2 "><summary><span class="node-label">Analytic</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-3 "><span class="node-label">Wittgenstein — limits of language</span></div>
</div></details>
<details class="level-2 "><summary><span class="node-label">Buddhist</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-3 "><span class="node-label">Zen kōans — silence beyond words</span></div>
</div></details>
<details class="level-2 "><summary><span class="node-label">Postmodern</span><span class="count">1</span></summary>
<div class="children">
<div class="leaf level-3 "><span class="node-label">Derrida — the undecidable</span></div>
</div></details>
</div></details>
</div></details>"""

full_tree2 = t1_part + remaining

with open('/tmp/tree2.html', 'w', encoding='utf-8') as f:
    f.write(full_tree2)

print("Full Tree 2 assembled and saved to /tmp/tree2.html. Length:", len(full_tree2))
