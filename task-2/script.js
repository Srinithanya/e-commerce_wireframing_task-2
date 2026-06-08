document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const navSteps = document.querySelectorAll('.nav-step');
    const frameContents = document.querySelectorAll('.frame-content');
    const indicators = document.querySelectorAll('.indicator');
    const btnPrevFrame = document.getElementById('btn-prev-frame');
    const btnNextFrame = document.getElementById('btn-next-frame');
    const currentFrameTitle = document.getElementById('current-frame-title');
    
    // Global controls
    const btnToggleGrid = document.getElementById('btn-toggle-grid');
    const btnToggleAnnotations = document.getElementById('btn-toggle-annotations');
    const desktopGridOverlay = document.getElementById('desktop-grid-overlay');
    const annotationBadges = document.querySelectorAll('.wf-annotation-badge');
    
    // Frame titles map
    const frameTitles = {
        1: "Problem Analysis",
        2: "User Flow Diagram",
        3: "Desktop Homepage Wireframe",
        4: "Wireframe Explanation",
        5: "Mobile Homepage Wireframe"
    };
    
    let currentFrame = 1;
    const totalFrames = 5;

    // ==========================================================================
    // FRAME NAVIGATION SYSTEM
    // ==========================================================================
    function switchFrame(frameNum) {
        if (frameNum < 1 || frameNum > totalFrames) return;
        
        currentFrame = frameNum;

        // Update active classes on sidebar steps
        navSteps.forEach(step => {
            if (parseInt(step.getAttribute('data-frame')) === currentFrame) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update active classes on slides
        frameContents.forEach(frame => {
            frame.classList.remove('active');
        });
        document.getElementById(`frame-${currentFrame}`).classList.add('active');

        // Update indicators
        indicators.forEach(ind => {
            if (parseInt(ind.getAttribute('data-frame')) === currentFrame) {
                ind.classList.add('active');
            } else {
                ind.classList.remove('active');
            }
        });

        // Update breadcrumb
        currentFrameTitle.textContent = frameTitles[currentFrame];

        // Disable/enable navigation arrows
        btnPrevFrame.disabled = currentFrame === 1;
        btnNextFrame.disabled = currentFrame === totalFrames;

        // Reset grid overlay button if we change frames
        if (currentFrame !== 3) {
            btnToggleGrid.classList.remove('active');
            desktopGridOverlay.classList.remove('active');
        }
    }

    // Nav button clicks
    navSteps.forEach(step => {
        step.addEventListener('click', () => {
            const target = parseInt(step.getAttribute('data-frame'));
            switchFrame(target);
        });
    });

    indicators.forEach(ind => {
        ind.addEventListener('click', () => {
            const target = parseInt(ind.getAttribute('data-frame'));
            switchFrame(target);
        });
    });

    btnPrevFrame.addEventListener('click', () => {
        switchFrame(currentFrame - 1);
    });

    btnNextFrame.addEventListener('click', () => {
        switchFrame(currentFrame + 1);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            switchFrame(currentFrame - 1);
        } else if (e.key === 'ArrowRight') {
            switchFrame(currentFrame + 1);
        }
    });

    // ==========================================================================
    // GLOBAL TOOLBAR CONTROLS
    // ==========================================================================
    // Toggle 12 Column Grid (Only visual on Desktop Frame 3)
    btnToggleGrid.addEventListener('click', () => {
        if (currentFrame !== 3) {
            // Automatically jump to desktop wireframe
            switchFrame(3);
        }
        btnToggleGrid.classList.toggle('active');
        desktopGridOverlay.classList.toggle('active');
    });

    // Toggle Annotation Badges Visibility
    btnToggleAnnotations.addEventListener('click', () => {
        btnToggleAnnotations.classList.toggle('active');
        annotationBadges.forEach(badge => {
            badge.style.display = badge.style.display === 'none' ? 'flex' : 'none';
        });
    });

    // Clicking annotation badge jumps to explanation slide and highlights explanation card
    annotationBadges.forEach(badge => {
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            const annotationId = badge.getAttribute('data-annotation');
            switchFrame(4);
            highlightExplanationCard(annotationId);
        });
    });

    // ==========================================================================
    // FRAME 1: INTERACTIVE PAIN POINTS HOVER
    // ==========================================================================
    const painCards = document.querySelectorAll('.pain-point-card');
    
    painCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Remove previous active state
            painCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Highlight matching bad wireframe item
            const painType = card.getAttribute('data-pain');
            highlightBadWireframeItem(painType);
        });
        
        card.addEventListener('click', () => {
            painCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const painType = card.getAttribute('data-pain');
            highlightBadWireframeItem(painType);
        });
    });

    function highlightBadWireframeItem(type) {
        // Clear all highlights
        document.querySelectorAll('.bad-item').forEach(item => {
            item.classList.remove('highlight');
        });
        
        // Add highlight to current
        let targetId = '';
        if (type === 'clutter') targetId = 'bad-item-clutter';
        else if (type === 'distractions') targetId = 'bad-item-distractions';
        else if (type === 'hidden-checkout') targetId = 'bad-item-hidden-checkout';
        else if (type === 'poor-cta') targetId = 'bad-item-poor-cta';
        
        if (targetId) {
            document.getElementById(targetId).classList.add('highlight');
        }
    }

    // Set initial hover state for Frame 1
    if (painCards.length > 0) {
        painCards[0].classList.add('active');
        highlightBadWireframeItem('clutter');
    }

    // ==========================================================================
    // FRAME 2: USER FLOW SIMULATOR
    // ==========================================================================
    const flowSteps = document.querySelectorAll('.flow-step-node');
    const btnFlowPrev = document.getElementById('btn-flow-prev');
    const btnFlowNext = document.getElementById('btn-flow-next');
    const infoStepNum = document.getElementById('info-step-num');
    const infoStepTitle = document.getElementById('info-step-title');
    const infoStepDesc = document.getElementById('info-step-desc');
    const infoStepRationale = document.getElementById('info-step-rationale');

    let currentFlowStep = 1;
    const totalFlowSteps = 7;

    const flowStepsData = {
        1: {
            title: "Homepage",
            desc: "The entry point of the funnel is optimized to reduce visual noise. Its primary objective is to direct users clearly to relevant categories or featured collections, keeping navigation simple and CTAs highly visible.",
            rationales: [
                "High CTA contrast elements guide the user to product lists.",
                "Persistent, search-centric header lets user jump stages."
            ]
        },
        2: {
            title: "Product Category Page",
            desc: "Displays products grouped by collection. Incorporates persistent filters on the left and sorting controls at the top. Grid hierarchy ensures quick visual comparison and discovery.",
            rationales: [
                "Left-aligned sidebar for rapid, sticky faceted filtering.",
                "Breadcrumb navigation confirms visual path context."
            ]
        },
        3: {
            title: "Product Details Page",
            desc: "Focuses on single-item details. Prominently sizes price and delivery timelines right above the primary call-to-action button, ensuring the purchase triggers are clearly readable.",
            rationales: [
                "Primary CTA is isolated and styled with solid black block contrast.",
                "Shipping and stock tags placed directly near action button to create urgency."
            ]
        },
        4: {
            title: "Slide-out Cart Drawer",
            desc: "Rather than routing users to a separate cart page, a slide-out cart drawer opens immediately. This keeps the user in their browse context while summarizing items and exposing a prominent Checkout trigger.",
            rationales: [
                "Slide-out cart maintains browse context, reducing disruption.",
                "Clear subtotal and big black CTA button to proceed directly to checkout."
            ]
        },
        5: {
            title: "Checkout Form",
            desc: "Unifies shipping address, delivery selection, and contact details into a single layout. Guest checkout option is highlighted to avoid forcing registration.",
            rationales: [
                "Guest checkout bypasses the login barrier to increase speed.",
                "Input fields stack logically with real-time inline validation cues."
            ]
        },
        6: {
            title: "Payment Screen",
            desc: "Handles payment details (credit card inputs, digital wallets). Clean security indicators are placed around input fields to build brand trust and reduce cart abandonment.",
            rationales: [
                "Clear visual indicators of security SSL badges.",
                "Auto-formatting credit card input blocks minimize user mistakes."
            ]
        },
        7: {
            title: "Order Confirmation",
            desc: "Confirms transaction completion. Displays tracking information, receipt details, and clear instructions on what happens next.",
            rationales: [
                "Provides instant confirmation and digital PDF receipt download.",
                "Clean shipping tracking links reduce customer support inquiries."
            ]
        }
    };

    function updateFlowStep(stepNum) {
        if (stepNum < 1 || stepNum > totalFlowSteps) return;

        currentFlowStep = stepNum;

        // Update active class on diagram nodes
        flowSteps.forEach(node => {
            const nodeStep = parseInt(node.getAttribute('data-step'));
            if (nodeStep === currentFlowStep) {
                node.classList.add('active');
                node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                node.classList.remove('active');
            }
        });

        // Update info panel
        const stepData = flowStepsData[currentFlowStep];
        infoStepNum.textContent = currentFlowStep;
        infoStepTitle.textContent = stepData.title;
        infoStepDesc.textContent = stepData.desc;

        // Update rationales list
        infoStepRationale.innerHTML = '';
        stepData.rationales.forEach(rat => {
            const li = document.createElement('li');
            li.textContent = rat;
            infoStepRationale.appendChild(li);
        });

        // Update flow buttons
        btnFlowPrev.disabled = currentFlowStep === 1;
        btnFlowNext.textContent = currentFlowStep === totalFlowSteps ? "Restart Flow" : "Next Step";
    }

    flowSteps.forEach(node => {
        node.addEventListener('click', () => {
            const stepNum = parseInt(node.getAttribute('data-step'));
            updateFlowStep(stepNum);
        });
    });

    btnFlowPrev.addEventListener('click', () => {
        updateFlowStep(currentFlowStep - 1);
    });

    btnFlowNext.addEventListener('click', () => {
        if (currentFlowStep === totalFlowSteps) {
            updateFlowStep(1);
        } else {
            updateFlowStep(currentFlowStep + 1);
        }
    });

    // ==========================================================================
    // FRAME 4: INTERACTIVE EXPLANATION RATIO
    // ==========================================================================
    const explanationCards = document.querySelectorAll('.explanation-card');
    const miniLayers = document.querySelectorAll('.mini-wf-layer');

    function highlightExplanationCard(id) {
        const numId = parseInt(id);
        
        explanationCards.forEach(card => {
            if (parseInt(card.getAttribute('data-exp')) === numId) {
                card.classList.add('active');
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                card.classList.remove('active');
            }
        });

        miniLayers.forEach(layer => {
            if (layer.getAttribute('id') === `mini-wf-layer-${numId}`) {
                layer.classList.add('highlight-active');
            } else {
                layer.classList.remove('highlight-active');
            }
        });
    }

    explanationCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const expId = card.getAttribute('data-exp');
            highlightExplanationCard(expId);
        });
        
        card.addEventListener('click', () => {
            const expId = card.getAttribute('data-exp');
            highlightExplanationCard(expId);
        });
    });
});
