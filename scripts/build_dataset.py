# scripts/build_dataset.py
import json
import re

tree_data = {
    "name": "JOURNAL314 Ω — Nihiltheistic Hypermap Visual",
    "roots": [
        {
            "id": "root-1",
            "name": "JOURNAL314 Ω — Nihiltheistic Hypermarkmap",
            "count": 1,
            "level": 0,
            "children": [
                {
                    "id": "node-0-orientation",
                    "name": "0. Orientation: The Map Is Not a Summary",
                    "count": 1,
                    "level": 1,
                    "children": [
                        {
                            "id": "node-kde",
                            "name": "Knowledge-distribution engine",
                            "count": 2,
                            "level": 2,
                            "children": [
                                {
                                    "id": "node-absorbs-314",
                                    "name": "Absorbs original 314 Markmap",
                                    "count": 4,
                                    "level": 3,
                                    "children": [
                                        {
                                            "id": "node-orig-struct",
                                            "name": "Original Structure",
                                            "count": 4,
                                            "level": 4,
                                            "children": [
                                                {
                                                    "id": "node-theme",
                                                    "name": "Theme",
                                                    "count": 3,
                                                    "level": 5,
                                                    "children": [
                                                        {"id": "leaf-key-concepts", "name": "Key concepts", "level": 6, "leaf": True},
                                                        {"id": "leaf-major-topics", "name": "Major topics", "level": 6, "leaf": True},
                                                        {"id": "leaf-relevant-issues", "name": "Relevant issues", "level": 6, "leaf": True}
                                                    ]
                                                },
                                                {
                                                    "id": "node-figure",
                                                    "name": "Figure",
                                                    "count": 1,
                                                    "level": 5,
                                                    "children": [
                                                        {
                                                            "id": "node-notable-figures",
                                                            "name": "Notable figures",
                                                            "count": 3,
                                                            "level": 6,
                                                            "children": [
                                                                {"id": "leaf-philosophers", "name": "Philosophers", "level": 6, "leaf": True},
                                                                {"id": "leaf-authors", "name": "Authors", "level": 6, "leaf": True},
                                                                {"id": "leaf-thinkers", "name": "Thinkers", "level": 6, "leaf": True}
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "id": "node-quote-frag",
                                                    "name": "Quote-fragment",
                                                    "count": 3,
                                                    "level": 5,
                                                    "children": [
                                                        {"id": "leaf-sig-statements", "name": "Significant statements", "level": 6, "leaf": True},
                                                        {"id": "leaf-context-importance", "name": "Contextual importance", "level": 6, "leaf": True},
                                                        {"id": "leaf-reflection-prompts", "name": "Reflection prompts", "level": 6, "leaf": True}
                                                    ]
                                                },
                                                {
                                                    "id": "node-recurrence-signal",
                                                    "name": "Recurrence-signal",
                                                    "count": 3,
                                                    "level": 5,
                                                    "children": [
                                                        {"id": "leaf-patterns-thought", "name": "Patterns in thought", "level": 6, "leaf": True},
                                                        {"id": "leaf-common-themes", "name": "Common themes", "level": 6, "leaf": True},
                                                        {"id": "leaf-repeated-phrases", "name": "Repeated phrases", "level": 6, "leaf": True}
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "id": "node-preservation-feat",
                                            "name": "Preservation Features",
                                            "count": 6,
                                            "level": 4,
                                            "children": [
                                                {"id": "node-concept-cont", "name": "Conceptual continuity", "count": 2, "level": 5, "children": [
                                                    {"id": "leaf-maintaining-core", "name": "Maintaining core ideas", "level": 6, "leaf": True},
                                                    {"id": "leaf-connecting-themes", "name": "Connecting themes over time", "level": 6, "leaf": True}
                                                ]},
                                                {"id": "node-thematic-rel", "name": "Thematic relevance", "count": 2, "level": 5, "children": [
                                                    {"id": "leaf-addressing-issues", "name": "Addressing contemporary issues", "level": 6, "leaf": True},
                                                    {"id": "leaf-aligning-discourse", "name": "Aligning with current discourse", "level": 6, "leaf": True}
                                                ]},
                                                {"id": "node-signal-ret", "name": "Signal retention", "count": 2, "level": 5, "children": [
                                                    {"id": "leaf-concepts-highlighted", "name": "Key concepts highlighted", "level": 6, "leaf": True},
                                                    {"id": "leaf-identifying-phrases", "name": "Identifying significant phrases", "level": 6, "leaf": True}
                                                ]},
                                                {"id": "node-content-fidelity", "name": "Content fidelity", "count": 2, "level": 5, "children": [
                                                    {"id": "leaf-original-meanings", "name": "Original meanings preserved", "level": 6, "leaf": True},
                                                    {"id": "leaf-authentic-rep", "name": "Authentic representation of thoughts", "level": 6, "leaf": True}
                                                ]},
                                                {"id": "node-adaptive-integ", "name": "Adaptive integration", "count": 2, "level": 5, "children": [
                                                    {"id": "leaf-diverse-audiences", "name": "Tailoring to diverse audiences", "level": 6, "leaf": True},
                                                    {"id": "leaf-balance-rigor", "name": "Balancing rigor and accessibility", "level": 6, "leaf": True}
                                                ]},
                                                {"id": "node-stability-rev", "name": "Stability across revisions", "count": 2, "level": 5, "children": [
                                                    {"id": "leaf-consistent-struct", "name": "Consistent structure", "level": 6, "leaf": True},
                                                    {"id": "leaf-evol-essence", "name": "Evolution without loss of essence", "level": 6, "leaf": True}
                                                ]}
                                            ]
                                        },
                                        {
                                            "id": "node-integration-proc",
                                            "name": "Integration Process",
                                            "count": 5,
                                            "level": 4,
                                            "children": [
                                                {"id": "node-content-curation", "name": "Content Curation", "count": 3, "level": 5, "children": [
                                                    {"id": "node-content-filtering", "name": "Content filtering", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-relevance-assess", "name": "Relevance assessment", "level": 6, "leaf": True},
                                                        {"id": "leaf-quality-checks", "name": "Quality checks", "level": 6, "leaf": True}
                                                    ]},
                                                    {"id": "node-sel-principles", "name": "Selection principles", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-criteria-inclusion", "name": "Criteria for inclusion", "level": 6, "leaf": True},
                                                        {"id": "leaf-elim-redundancy", "name": "Elimination of redundancy", "level": 6, "leaf": True}
                                                    ]},
                                                    {"id": "node-context-mods", "name": "Contextual modifications", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-tailor-themes", "name": "Tailoring themes", "level": 6, "leaf": True},
                                                        {"id": "leaf-adjust-tone", "name": "Adjusting tone and style", "level": 6, "leaf": True}
                                                    ]}
                                                ]},
                                                {"id": "node-collaboration", "name": "Collaboration", "count": 2, "level": 5, "children": [
                                                    {"id": "node-stakeholder-input", "name": "Stakeholder input", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-feedback-loops", "name": "Feedback loops", "level": 6, "leaf": True},
                                                        {"id": "leaf-engaging-experts", "name": "Engaging experts", "level": 6, "leaf": True}
                                                    ]},
                                                    {"id": "node-multidisciplinary", "name": "Multidisciplinary approach", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-inc-diverse-fields", "name": "Incorporating diverse fields", "level": 6, "leaf": True},
                                                        {"id": "leaf-cross-collab", "name": "Cross-sectional collaboration", "level": 6, "leaf": True}
                                                    ]}
                                                ]},
                                                {"id": "node-cont-improvement", "name": "Continuous Improvement", "count": 2, "level": 5, "children": [
                                                    {"id": "node-iterative-rev", "name": "Iterative revisions", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-rev-effectiveness", "name": "Reviewing effectiveness", "level": 6, "leaf": True},
                                                        {"id": "leaf-update-feedback", "name": "Updating based on feedback", "level": 6, "leaf": True}
                                                    ]},
                                                    {"id": "node-perf-metrics", "name": "Performance metrics", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-measure-impact", "name": "Measuring impact", "level": 6, "leaf": True},
                                                        {"id": "leaf-user-engagement", "name": "Analyzing user engagement", "level": 6, "leaf": True}
                                                    ]}
                                                ]},
                                                {"id": "node-accessibility", "name": "Accessibility", "count": 2, "level": 5, "children": [
                                                    {"id": "node-user-friendly-des", "name": "User-friendly design", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-simplified-nav", "name": "Simplified navigation", "level": 6, "leaf": True},
                                                        {"id": "leaf-visual-aids-int", "name": "Visual aids integration", "level": 6, "leaf": True}
                                                    ]},
                                                    {"id": "node-diverse-formats", "name": "Diverse formats", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-txt-aud-vid", "name": "Text, audio, video", "level": 6, "leaf": True},
                                                        {"id": "leaf-interact-events", "name": "Interactive events and discussions", "level": 6, "leaf": True}
                                                    ]}
                                                ]},
                                                {"id": "node-knowledge-sharing", "name": "Knowledge Sharing", "count": 2, "level": 5, "children": [
                                                    {"id": "node-comm-building", "name": "Community building", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-forum-creation", "name": "Forum creation", "level": 6, "leaf": True},
                                                        {"id": "leaf-res-sharing", "name": "Resource-sharing initiatives", "level": 6, "leaf": True}
                                                    ]},
                                                    {"id": "node-open-access", "name": "Open access policies", "count": 2, "level": 6, "children": [
                                                        {"id": "leaf-pub-avail", "name": "Public availability", "level": 6, "leaf": True},
                                                        {"id": "leaf-elim-paywalls", "name": "Elimination of paywalls", "level": 6, "leaf": True}
                                                    ]}
                                                ]}
                                            ]
                                        },
                                        {
                                            "id": "node-utility",
                                            "name": "Utility",
                                            "count": 5,
                                            "level": 4,
                                            "children": [
                                                {"id": "node-enh-understanding", "name": "Enhanced Understanding", "count": 3, "level": 5, "children": [
                                                    {"id": "leaf-deepen-knowledge", "name": "Deepens knowledge retention", "level": 6, "leaf": True},
                                                    {"id": "leaf-facil-theory", "name": "Facilitates theory application", "level": 6, "leaf": True},
                                                    {"id": "leaf-prom-crit-inq", "name": "Promotes critical inquiry", "level": 6, "leaf": True}
                                                ]},
                                                {"id": "node-comp-analysis", "name": "Comparative Analysis", "count": 3, "level": 5, "children": [
                                                    {"id": "leaf-eval-phil-schools", "name": "Evaluation of philosophical schools", "level": 6, "leaf": True},
                                                    {"id": "leaf-contrast-worldviews", "name": "Contrasting varying worldviews", "level": 6, "leaf": True},
                                                    {"id": "leaf-synth-insights", "name": "Synthesizing insights and critiques", "level": 6, "leaf": True}
                                                ]},
                                                {"id": "node-frame-discourse", "name": "Framework for Discourse", "count": 3, "level": 5, "children": [
                                                    {"id": "leaf-struct-phil-dial", "name": "Structured philosophical dialogues", "level": 6, "leaf": True},
                                                    {"id": "leaf-res-acad-debates", "name": "Resources for academic debates", "level": 6, "leaf": True},
                                                    {"id": "leaf-plat-pub-eng", "name": "Platforms for public engagement", "level": 6, "leaf": True}
                                                ]},
                                                {"id": "node-practical-apps", "name": "Practical Applications", "count": 3, "level": 5, "children": [
                                                    {"id": "leaf-integ-edu-settings", "name": "Integration in educational settings", "level": 6, "leaf": True},
                                                    {"id": "leaf-util-therapy", "name": "Utilization in therapy and counseling", "level": 6, "leaf": True},
                                                    {"id": "leaf-inf-art-creative", "name": "Influence on art and creative expression", "level": 6, "leaf": True}
                                                ]},
                                                {"id": "node-inf-future-res", "name": "Informing Future Research", "count": 3, "level": 5, "children": [
                                                    {"id": "leaf-id-gaps-lit", "name": "Identifying gaps in literature", "level": 6, "leaf": True},
                                                    {"id": "leaf-insp-new-phil", "name": "Inspiration for new philosophical inquiries", "level": 6, "leaf": True},
                                                    {"id": "leaf-enc-interdisc", "name": "Encouraging interdisciplinary studies", "level": 6, "leaf": True}
                                                ]}
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
}

print("Base schema prepared.")
