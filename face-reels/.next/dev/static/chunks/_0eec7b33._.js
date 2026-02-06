(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/FaceScrollController.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FaceScrollController
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mediapipe/tasks-vision/vision_bundle.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function FaceScrollController({ onLookDown, onLookUp, onTiltLeft, onTiltRight, onBlink, muted, onToggleMute, showDebug }) {
    _s();
    // Stable callbacks (won't restart camera/model)
    const onLookDownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onLookDown);
    const onLookUpRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onLookUp);
    const onTiltLeftRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onTiltLeft);
    const onTiltRightRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onTiltRight);
    const onBlinkRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(onBlink);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            onLookDownRef.current = onLookDown;
        }
    }["FaceScrollController.useEffect"], [
        onLookDown
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            onLookUpRef.current = onLookUp;
        }
    }["FaceScrollController.useEffect"], [
        onLookUp
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            onTiltLeftRef.current = onTiltLeft;
        }
    }["FaceScrollController.useEffect"], [
        onTiltLeft
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            onTiltRightRef.current = onTiltRight;
        }
    }["FaceScrollController.useEffect"], [
        onTiltRight
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            onBlinkRef.current = onBlink;
        }
    }["FaceScrollController.useEffect"], [
        onBlink
    ]);
    // ✅ Accurate fired counters (never miss because of UI throttling)
    const firedDownCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const firedUpCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const firedLeftCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const firedRightCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const firedBlinkCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Model/video refs
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const landmarkerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const streamRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Baselines + misc refs
    const pitchBaselineRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rollBaselineRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const recalTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Frame counters
    const downFramesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const upFramesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const leftFramesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const rightFramesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Cooldowns
    const lastDownTriggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastUpTriggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastLeftTriggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastRightTriggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    // Blink refs
    const blinkFramesCountRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const blinkLatchedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastBlinkTriggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Starting...");
    // Debug UI
    const [debug, setDebug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        pitchDelta: 0,
        rollDelta: 0,
        blink: 0,
        blinkFrames: 0,
        blinkLatched: false,
        state: "—",
        firedDown: 0,
        firedUp: 0,
        firedLeft: 0,
        firedRight: 0,
        firedBlink: 0,
        fDown: 0,
        fUp: 0,
        fLeft: 0,
        fRight: 0
    });
    // Tunables (sliders)
    const [downThreshold, setDownThreshold] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.015);
    const [upThreshold, setUpThreshold] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.03);
    const [tiltThreshold, setTiltThreshold] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.25);
    const [framesNeeded, setFramesNeeded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(2);
    const [blinkThreshold, setBlinkThreshold] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0.55);
    const [blinkFramesNeeded, setBlinkFramesNeeded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(2);
    // Keep tunables in refs for loop
    const downThrRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(downThreshold);
    const upThrRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(upThreshold);
    const tiltThrRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(tiltThreshold);
    const framesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(framesNeeded);
    const blinkThrRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(blinkThreshold);
    const blinkFramesRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(blinkFramesNeeded);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            downThrRef.current = downThreshold;
        }
    }["FaceScrollController.useEffect"], [
        downThreshold
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            upThrRef.current = upThreshold;
        }
    }["FaceScrollController.useEffect"], [
        upThreshold
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            tiltThrRef.current = tiltThreshold;
        }
    }["FaceScrollController.useEffect"], [
        tiltThreshold
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            framesRef.current = framesNeeded;
        }
    }["FaceScrollController.useEffect"], [
        framesNeeded
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            blinkThrRef.current = blinkThreshold;
        }
    }["FaceScrollController.useEffect"], [
        blinkThreshold
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            blinkFramesRef.current = blinkFramesNeeded;
        }
    }["FaceScrollController.useEffect"], [
        blinkFramesNeeded
    ]);
    const cooldownMs = 1200;
    const blinkCooldownMs = 700;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FaceScrollController.useEffect": ()=>{
            let cancelled = false;
            async function waitForVideoReady(video) {
                if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) return;
                await new Promise({
                    "FaceScrollController.useEffect.waitForVideoReady": (resolve)=>{
                        const onLoaded = {
                            "FaceScrollController.useEffect.waitForVideoReady.onLoaded": ()=>resolve()
                        }["FaceScrollController.useEffect.waitForVideoReady.onLoaded"];
                        video.addEventListener("loadeddata", onLoaded, {
                            once: true
                        });
                        video.addEventListener("loadedmetadata", onLoaded, {
                            once: true
                        });
                    }
                }["FaceScrollController.useEffect.waitForVideoReady"]);
                await new Promise({
                    "FaceScrollController.useEffect.waitForVideoReady": (r)=>setTimeout(r, 100)
                }["FaceScrollController.useEffect.waitForVideoReady"]);
            }
            function computeRoll(face) {
                const leftEyeOuter = face[33];
                const rightEyeOuter = face[263];
                const dx = rightEyeOuter.x - leftEyeOuter.x;
                const dy = rightEyeOuter.y - leftEyeOuter.y;
                return Math.atan2(dy, dx);
            }
            async function init() {
                try {
                    setStatus("Requesting camera...");
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: true
                    });
                    streamRef.current = stream;
                    const video = videoRef.current;
                    if (!video) return;
                    video.srcObject = stream;
                    await video.play();
                    setStatus("Loading face model...");
                    const vision = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FilesetResolver"].forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
                    if (cancelled) return;
                    landmarkerRef.current = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mediapipe$2f$tasks$2d$vision$2f$vision_bundle$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaceLandmarker"].createFromOptions(vision, {
                        baseOptions: {
                            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
                        },
                        runningMode: "VIDEO",
                        numFaces: 1,
                        outputFaceBlendshapes: true
                    });
                    await waitForVideoReady(video);
                    if (cancelled) return;
                    setStatus("Face tracking active ✅");
                    loop();
                } catch (err) {
                    console.error(err);
                    setStatus("Camera/model error ❌");
                }
            }
            let lastUiUpdate = 0;
            function loop() {
                const video = videoRef.current;
                const landmarker = landmarkerRef.current;
                if (!video || !landmarker) return;
                if (video.videoWidth === 0 || video.videoHeight === 0) {
                    rafRef.current = requestAnimationFrame(loop);
                    return;
                }
                const results = landmarker.detectForVideo(video, performance.now());
                let state = "OK";
                let blinkScore = 0;
                if (results.faceLandmarks?.length) {
                    const face = results.faceLandmarks[0];
                    // Nod signal: nose relative to eye line
                    const nose = face[1];
                    const leftEyeOuter = face[33];
                    const rightEyeOuter = face[263];
                    const eyeMidY = (leftEyeOuter.y + rightEyeOuter.y) / 2;
                    const pitch = nose.y - eyeMidY;
                    const roll = computeRoll(face);
                    if (pitchBaselineRef.current === null) pitchBaselineRef.current = pitch;
                    if (rollBaselineRef.current === null) rollBaselineRef.current = roll;
                    const pitchBase = pitchBaselineRef.current ?? pitch;
                    const rollBase = rollBaselineRef.current ?? roll;
                    const pitchDelta = pitch - pitchBase;
                    const rollDelta = roll - rollBase;
                    const downThr = downThrRef.current;
                    const upThr = upThrRef.current;
                    const tiltThr = tiltThrRef.current;
                    const need = framesRef.current;
                    const isDownRaw = pitchDelta > downThr;
                    const isUpRaw = pitchDelta < -upThr;
                    const isTiltLeft = rollDelta < -tiltThr;
                    const isTiltRight = rollDelta > tiltThr;
                    // accumulate tilt frames using the SAME threshold you show in UI
                    leftFramesRef.current = isTiltLeft ? leftFramesRef.current + 1 : 0;
                    rightFramesRef.current = isTiltRight ? rightFramesRef.current + 1 : 0;
                    const tilting = leftFramesRef.current > 0 || rightFramesRef.current > 0;
                    const isDown = !tilting && isDownRaw;
                    const isUp = !tilting && isUpRaw;
                    downFramesRef.current = isDown ? downFramesRef.current + 1 : 0;
                    upFramesRef.current = isUp ? upFramesRef.current + 1 : 0;
                    if (isDown) state = "DOWN";
                    else if (isUp) state = "UP";
                    else if (isTiltLeft) state = "TILT_L";
                    else if (isTiltRight) state = "TILT_R";
                    const nowMs = Date.now();
                    // DOWN trigger
                    if (downFramesRef.current >= need && nowMs - lastDownTriggerRef.current > cooldownMs) {
                        lastDownTriggerRef.current = nowMs;
                        downFramesRef.current = 0;
                        upFramesRef.current = 0;
                        leftFramesRef.current = 0;
                        rightFramesRef.current = 0;
                        firedDownCountRef.current += 1;
                        onLookDownRef.current();
                    }
                    // UP trigger
                    if (upFramesRef.current >= need && nowMs - lastUpTriggerRef.current > cooldownMs) {
                        lastUpTriggerRef.current = nowMs;
                        upFramesRef.current = 0;
                        downFramesRef.current = 0;
                        leftFramesRef.current = 0;
                        rightFramesRef.current = 0;
                        firedUpCountRef.current += 1;
                        onLookUpRef.current();
                    }
                    // TILT LEFT trigger  ✅ FIXED: increments LEFT
                    if (leftFramesRef.current >= need && nowMs - lastLeftTriggerRef.current > cooldownMs) {
                        lastLeftTriggerRef.current = nowMs;
                        leftFramesRef.current = 0;
                        rightFramesRef.current = 0;
                        downFramesRef.current = 0;
                        upFramesRef.current = 0;
                        firedLeftCountRef.current += 1; // ✅ was wrong before
                        onTiltLeftRef.current();
                    }
                    // TILT RIGHT trigger
                    if (rightFramesRef.current >= need && nowMs - lastRightTriggerRef.current > cooldownMs) {
                        lastRightTriggerRef.current = nowMs;
                        rightFramesRef.current = 0;
                        leftFramesRef.current = 0;
                        downFramesRef.current = 0;
                        upFramesRef.current = 0;
                        firedRightCountRef.current += 1;
                        onTiltRightRef.current();
                    }
                    // Blink from blendshapes
                    const bs = results.faceBlendshapes?.[0]?.categories;
                    if (bs) {
                        const left = bs.find({
                            "FaceScrollController.useEffect.loop": (c)=>c.categoryName === "eyeBlinkLeft"
                        }["FaceScrollController.useEffect.loop"])?.score ?? 0;
                        const right = bs.find({
                            "FaceScrollController.useEffect.loop": (c)=>c.categoryName === "eyeBlinkRight"
                        }["FaceScrollController.useEffect.loop"])?.score ?? 0;
                        blinkScore = (left + right) / 2;
                    }
                    const bThr = blinkThrRef.current;
                    const bNeed = blinkFramesRef.current;
                    const blinking = blinkScore > bThr;
                    blinkFramesCountRef.current = blinking ? blinkFramesCountRef.current + 1 : 0;
                    if (!blinking && blinkLatchedRef.current && blinkScore < bThr * 0.5) {
                        blinkLatchedRef.current = false;
                    }
                    if (blinkFramesCountRef.current >= bNeed && !blinkLatchedRef.current && nowMs - lastBlinkTriggerRef.current > blinkCooldownMs) {
                        lastBlinkTriggerRef.current = nowMs;
                        blinkLatchedRef.current = true;
                        blinkFramesCountRef.current = 0;
                        firedBlinkCountRef.current += 1;
                        onBlinkRef.current();
                    }
                    // UI updates (throttled)
                    const now = performance.now();
                    if (now - lastUiUpdate > 100) {
                        lastUiUpdate = now;
                        setDebug({
                            "FaceScrollController.useEffect.loop": ()=>({
                                    pitchDelta: Number(pitchDelta.toFixed(3)),
                                    rollDelta: Number(rollDelta.toFixed(3)),
                                    blink: Number(blinkScore.toFixed(2)),
                                    blinkFrames: blinkFramesCountRef.current,
                                    blinkLatched: blinkLatchedRef.current,
                                    state,
                                    firedDown: firedDownCountRef.current,
                                    firedUp: firedUpCountRef.current,
                                    firedLeft: firedLeftCountRef.current,
                                    firedRight: firedRightCountRef.current,
                                    firedBlink: firedBlinkCountRef.current,
                                    fDown: downFramesRef.current,
                                    fUp: upFramesRef.current,
                                    fLeft: leftFramesRef.current,
                                    fRight: rightFramesRef.current
                                })
                        }["FaceScrollController.useEffect.loop"]);
                    }
                }
                rafRef.current = requestAnimationFrame(loop);
            }
            init();
            return ({
                "FaceScrollController.useEffect": ()=>{
                    cancelled = true;
                    if (rafRef.current) cancelAnimationFrame(rafRef.current);
                    if (recalTimeoutRef.current) window.clearTimeout(recalTimeoutRef.current);
                    streamRef.current?.getTracks().forEach({
                        "FaceScrollController.useEffect": (t)=>t.stop()
                    }["FaceScrollController.useEffect"]);
                    landmarkerRef.current?.close?.();
                }
            })["FaceScrollController.useEffect"];
        }
    }["FaceScrollController.useEffect"], []);
    const btnStyle = {
        color: "white",
        background: "rgba(255,255,255,0.15)",
        border: "1px solid rgba(255,255,255,0.25)",
        borderRadius: 6,
        padding: "4px 8px",
        cursor: "pointer"
    };
    //Fixed debug by including showDebug in destructuring, then checking it before rendering the debug UI. If showDebug is false, we still render the video element but keep it hidden to ensure the face tracking continues to work
    if (showDebug === false) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
            ref: videoRef,
            style: {
                display: "none"
            },
            playsInline: true
        }, void 0, false, {
            fileName: "[project]/components/FaceScrollController.tsx",
            lineNumber: 409,
            columnNumber: 10
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            bottom: 12,
            left: 12,
            background: "rgba(0,0,0,0.75)",
            color: "white",
            padding: 10,
            borderRadius: 10,
            fontSize: 12,
            zIndex: 20,
            width: 340
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontWeight: 700
                        },
                        children: [
                            status,
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 500,
                                    opacity: 0.85
                                },
                                children: [
                                    "| blink ",
                                    debug.blink.toFixed(2),
                                    " | bf ",
                                    debug.blinkFrames,
                                    " |",
                                    " ",
                                    debug.blinkLatched ? "latched" : "armed"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 429,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 427,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            gap: 8
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                style: btnStyle,
                                onClick: onToggleMute,
                                children: muted ? "Unmute" : "Mute"
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 436,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                style: btnStyle,
                                onClick: ()=>{
                                    pitchBaselineRef.current = null;
                                    rollBaselineRef.current = null;
                                    downFramesRef.current = 0;
                                    upFramesRef.current = 0;
                                    leftFramesRef.current = 0;
                                    rightFramesRef.current = 0;
                                    blinkFramesCountRef.current = 0;
                                    blinkLatchedRef.current = false;
                                    setStatus("Recalibrating…");
                                    if (recalTimeoutRef.current) window.clearTimeout(recalTimeoutRef.current);
                                    recalTimeoutRef.current = window.setTimeout(()=>{
                                        setStatus("Face tracking active ✅");
                                    }, 600);
                                },
                                children: "Recalibrate"
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 440,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 435,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 426,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 8,
                    fontFamily: "monospace"
                },
                children: [
                    "state: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                        children: debug.state
                    }, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 467,
                        columnNumber: 16
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 468,
                        columnNumber: 9
                    }, this),
                    "pitch Δ: ",
                    debug.pitchDelta,
                    " | f: ",
                    debug.fDown,
                    "/",
                    debug.fUp,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 470,
                        columnNumber: 9
                    }, this),
                    "roll Δ: ",
                    debug.rollDelta,
                    " | fL/fR: ",
                    debug.fLeft,
                    "/",
                    debug.fRight,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 472,
                        columnNumber: 9
                    }, this),
                    "blink: ",
                    debug.blink,
                    " frames: ",
                    debug.blinkFrames,
                    " fired: ",
                    debug.firedBlink,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 474,
                        columnNumber: 9
                    }, this),
                    "fired: D ",
                    debug.firedDown,
                    " / U ",
                    debug.firedUp,
                    " / L ",
                    debug.firedLeft,
                    " / R ",
                    debug.firedRight
                ]
            }, void 0, true, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 466,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Down threshold"
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 480,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "monospace"
                                },
                                children: downThreshold.toFixed(3)
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 481,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 479,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0.001",
                        max: "0.120",
                        step: "0.001",
                        value: downThreshold,
                        onChange: (e)=>setDownThreshold(Number(e.target.value)),
                        style: {
                            width: "100%"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 483,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 478,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Up threshold"
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 496,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "monospace"
                                },
                                children: upThreshold.toFixed(3)
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 497,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 495,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0.001",
                        max: "0.120",
                        step: "0.001",
                        value: upThreshold,
                        onChange: (e)=>setUpThreshold(Number(e.target.value)),
                        style: {
                            width: "100%"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 499,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 494,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Tilt threshold"
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 512,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "monospace"
                                },
                                children: tiltThreshold.toFixed(3)
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 513,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 511,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0.040",
                        max: "0.300",
                        step: "0.005",
                        value: tiltThreshold,
                        onChange: (e)=>setTiltThreshold(Number(e.target.value)),
                        style: {
                            width: "100%"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 515,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 510,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Frames needed"
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 528,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "monospace"
                                },
                                children: framesNeeded
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 529,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 527,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "1",
                        max: "12",
                        step: "1",
                        value: framesNeeded,
                        onChange: (e)=>setFramesNeeded(Number(e.target.value)),
                        style: {
                            width: "100%"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 531,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 526,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Blink threshold"
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 544,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "monospace"
                                },
                                children: blinkThreshold.toFixed(2)
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 545,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 543,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "0.20",
                        max: "0.90",
                        step: "0.01",
                        value: blinkThreshold,
                        onChange: (e)=>setBlinkThreshold(Number(e.target.value)),
                        style: {
                            width: "100%"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 547,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 542,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Blink frames"
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 560,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontFamily: "monospace"
                                },
                                children: blinkFramesNeeded
                            }, void 0, false, {
                                fileName: "[project]/components/FaceScrollController.tsx",
                                lineNumber: 561,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 559,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "1",
                        max: "6",
                        step: "1",
                        value: blinkFramesNeeded,
                        onChange: (e)=>setBlinkFramesNeeded(Number(e.target.value)),
                        style: {
                            width: "100%"
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/FaceScrollController.tsx",
                        lineNumber: 563,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 558,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 10
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                    ref: videoRef,
                    width: 320,
                    height: 190,
                    muted: muted,
                    playsInline: true,
                    style: {
                        borderRadius: 10,
                        width: "100%"
                    }
                }, void 0, false, {
                    fileName: "[project]/components/FaceScrollController.tsx",
                    lineNumber: 575,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 574,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: 8,
                    opacity: 0.8
                },
                children: "Tip: if left/right feel swapped, swap handlers in page.tsx."
            }, void 0, false, {
                fileName: "[project]/components/FaceScrollController.tsx",
                lineNumber: 585,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/FaceScrollController.tsx",
        lineNumber: 412,
        columnNumber: 5
    }, this);
}
_s(FaceScrollController, "k4dPMw33Y3T+yPve/RgHcb83+u8=");
_c = FaceScrollController;
var _c;
__turbopack_context__.k.register(_c, "FaceScrollController");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FaceScrollController$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/FaceScrollController.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
//Content of reels is hardcoded for demo purposes. They're all related to FALLOUT New Vegas/West Coast because I like FALLOUT.
const REELS = [
    {
        id: 1,
        src: "/videos/MaximumNCR.mp4"
    },
    {
        id: 2,
        src: "/videos/NCRArrives.mp4"
    },
    {
        id: 3,
        src: "/videos/NewVegasEdit.mp4"
    },
    {
        id: 4,
        src: "/videos/OpSunburst.mp4"
    },
    {
        id: 5,
        src: "/videos/NVTrailer.mp4"
    },
    {
        id: 6,
        src: "/videos/RangerArmor.mp4"
    }
];
const ACTION_COOLDOWN_MS = 650;
function clamp01(x) {
    return Math.max(0, Math.min(1, x));
}
function Home() {
    _s();
    const reels = REELS;
    //Features like refs and state for managing reels, playback, and user interactions
    const reelRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const videoRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const indexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const lastActionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const [index, setIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [muted, setMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [paused, setPaused] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [liked, setLiked] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Home.useState": ()=>Array(reels.length).fill(false)
    }["Home.useState"]);
    const [saved, setSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Home.useState": ()=>Array(reels.length).fill(false)
    }["Home.useState"]);
    const [progressPct, setProgressPct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showDebug, setShowDebug] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const progRafRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastProgUiRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            indexRef.current = index;
        }
    }["Home.useEffect"], [
        index
    ]);
    //This is a debug feature to toggle visibility of debug info with the "D" key. It adds a keydown event listener on mount and cleans up on unmount.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            function onKeyDown(e) {
                if (e.key.toLowerCase() === "d") setShowDebug({
                    "Home.useEffect.onKeyDown": (s)=>!s
                }["Home.useEffect.onKeyDown"]);
            }
            window.addEventListener("keydown", onKeyDown);
            return ({
                "Home.useEffect": ()=>window.removeEventListener("keydown", onKeyDown)
            })["Home.useEffect"];
        }
    }["Home.useEffect"], []);
    // Helper functions below to manage actions with cooldown to prevent spamming and ensure smooth UX
    function canAct() {
        const now = Date.now();
        if (now - lastActionRef.current < ACTION_COOLDOWN_MS) return false;
        lastActionRef.current = now;
        return true;
    }
    function scrollTo(i) {
        reelRefs.current[i]?.scrollIntoView({
            behavior: "smooth"
        });
    }
    function goTo(i) {
        setIndex(i);
        scrollTo(i);
    }
    function next() {
        if (!canAct()) return;
        goTo(Math.min(indexRef.current + 1, reels.length - 1));
    }
    function prev() {
        if (!canAct()) return;
        goTo(Math.max(indexRef.current - 1, 0));
    }
    function toggleMuted() {
        if (!canAct()) return;
        setMuted((m)=>!m);
    }
    function togglePause() {
        if (!canAct()) return;
        setPaused((p)=>!p);
    }
    function toggleAtIndex(setter) {
        if (!canAct()) return;
        setter((arr)=>{
            const copy = [
                ...arr
            ];
            const i = indexRef.current;
            copy[i] = !copy[i];
            return copy;
        });
    }
    function toggleLike() {
        toggleAtIndex(setLiked);
    }
    function toggleSave() {
        toggleAtIndex(setSaved);
    }
    // Keep index in sync with manual scroll
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            const els = reelRefs.current.filter(Boolean);
            if (els.length === 0) return;
            const io = new IntersectionObserver({
                "Home.useEffect": (entries)=>{
                    let best = null;
                    for (const e of entries){
                        if (!e.isIntersecting) continue;
                        const idx = els.indexOf(e.target);
                        if (idx === -1) continue;
                        const ratio = e.intersectionRatio;
                        if (!best || ratio > best.ratio) best = {
                            idx,
                            ratio
                        };
                    }
                    if (best && best.ratio >= 0.6) setIndex(best.idx);
                }
            }["Home.useEffect"], {
                threshold: [
                    0.1,
                    0.25,
                    0.5,
                    0.6,
                    0.75,
                    0.9
                ]
            });
            els.forEach({
                "Home.useEffect": (el)=>io.observe(el)
            }["Home.useEffect"]);
            return ({
                "Home.useEffect": ()=>io.disconnect()
            })["Home.useEffect"];
        }
    }["Home.useEffect"], []);
    // Playback policy: only active reel plays; apply muted + paused
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            for(let i = 0; i < videoRefs.current.length; i++){
                const v = videoRefs.current[i];
                if (!v) continue;
                v.muted = muted;
                if (i === index) {
                    if (paused) v.pause();
                    else v.play().catch({
                        "Home.useEffect": ()=>{}
                    }["Home.useEffect"]);
                } else {
                    v.pause();
                    v.currentTime = 0;
                }
            }
            setProgressPct(0);
        }
    }["Home.useEffect"], [
        index,
        muted,
        paused
    ]);
    // Smooth progress loop (rAF) for active reel
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (progRafRef.current) cancelAnimationFrame(progRafRef.current);
            function tick() {
                const v = videoRefs.current[index];
                if (v && isFinite(v.duration) && v.duration > 0) {
                    const pct = clamp01(v.currentTime / v.duration);
                    // throttle React updates (~20fps)
                    const now = performance.now();
                    if (now - lastProgUiRef.current > 50) {
                        lastProgUiRef.current = now;
                        setProgressPct(pct);
                    }
                } else {
                    setProgressPct(0);
                }
                progRafRef.current = requestAnimationFrame(tick);
            }
            progRafRef.current = requestAnimationFrame(tick);
            return ({
                "Home.useEffect": ()=>{
                    if (progRafRef.current) cancelAnimationFrame(progRafRef.current);
                }
            })["Home.useEffect"];
        }
    }["Home.useEffect"], [
        index
    ]);
    const topControls = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Home.useMemo[topControls]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    top: 12,
                    left: 12,
                    zIndex: 10,
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    pointerEvents: "none",
                    opacity: 0.35
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        pointerEvents: "auto"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: prev,
                            children: "Prev"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 227,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: next,
                            children: "Next"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 228,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                background: "white",
                                padding: "4px 8px",
                                borderRadius: 6
                            },
                            children: [
                                index + 1,
                                "/",
                                reels.length
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 229,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 226,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this)
    }["Home.useMemo[topControls]"], [
        index,
        reels.length
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        style: {
            height: "100vh",
            overflowY: "scroll",
            scrollSnapType: "y mandatory"
        },
        children: [
            topControls,
            reels.map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: (el)=>{
                        reelRefs.current[i] = el;
                    },
                    style: {
                        height: "100vh",
                        scrollSnapAlign: "start",
                        position: "relative",
                        background: "black",
                        overflow: "hidden",
                        borderBottom: "1px solid #111"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: (el)=>{
                                videoRefs.current[i] = el;
                            },
                            src: r.src,
                            muted: muted,
                            playsInline: true,
                            preload: "metadata",
                            style: {
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 257,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                height: 4,
                                width: "100%",
                                background: "rgba(255,255,255,0.18)",
                                pointerEvents: "none"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    height: "100%",
                                    width: `${(i === index ? progressPct : 0) * 100}%`,
                                    background: "white",
                                    transition: "none"
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 280,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 269,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "absolute",
                                left: 16,
                                bottom: 22,
                                color: "white",
                                maxWidth: "70%",
                                textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                                fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
                                pointerEvents: "none"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    marginTop: 8,
                                    fontSize: 12,
                                    opacity: 0.8
                                },
                                children: [
                                    paused ? "Paused" : "Playing",
                                    " • ",
                                    muted ? "Muted" : "Sound on"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 303,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "absolute",
                                right: 14,
                                bottom: 90,
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                                alignItems: "center",
                                color: "white",
                                textShadow: "0 2px 12px rgba(0,0,0,0.7)",
                                fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
                                pointerEvents: "none"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleLike,
                                    style: {
                                        pointerEvents: "auto",
                                        background: "rgba(0,0,0,0.35)",
                                        border: "1px solid rgba(255,255,255,0.25)",
                                        color: "white",
                                        borderRadius: 999,
                                        padding: "10px 12px",
                                        cursor: "pointer"
                                    },
                                    "aria-label": "Like",
                                    title: "Like",
                                    children: liked[i] ? "❤️" : "🤍"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 324,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: toggleSave,
                                    style: {
                                        pointerEvents: "auto",
                                        background: "rgba(0,0,0,0.35)",
                                        border: "1px solid rgba(255,255,255,0.25)",
                                        color: "white",
                                        borderRadius: 999,
                                        padding: "10px 12px",
                                        cursor: "pointer"
                                    },
                                    "aria-label": "Save",
                                    title: "Save",
                                    children: saved[i] ? "🔖" : "📑"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 341,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: togglePause,
                                    style: {
                                        pointerEvents: "auto",
                                        background: "rgba(0,0,0,0.35)",
                                        border: "1px solid rgba(255,255,255,0.25)",
                                        color: "white",
                                        borderRadius: 999,
                                        padding: "10px 12px",
                                        cursor: "pointer"
                                    },
                                    "aria-label": "Pause/Play",
                                    title: "Pause/Play",
                                    children: paused ? "▶️" : "⏸️"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 358,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 309,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                position: "absolute",
                                top: 12,
                                right: 12,
                                background: "rgba(0,0,0,0.45)",
                                color: "white",
                                padding: "6px 10px",
                                borderRadius: 999,
                                fontSize: 12,
                                fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
                                pointerEvents: "none"
                            },
                            children: [
                                "Reel ",
                                i + 1
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 377,
                            columnNumber: 11
                        }, this)
                    ]
                }, r.id, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 243,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$FaceScrollController$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onLookDown: next,
                onLookUp: prev,
                onTiltLeft: toggleLike,
                onTiltRight: toggleSave,
                onBlink: togglePause,
                muted: muted,
                onToggleMute: toggleMuted,
                showDebug: showDebug
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 396,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
_s(Home, "SybOMeyl5Y0q8rQB8Q0TgawH0WM=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0eec7b33._.js.map