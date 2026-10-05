export * from './nature/types.js';
export { NatureOptionsError } from './nature/validation.js';
export { createNatureState } from './nature/state.js';
export { markMagneticStones } from './nature/marking.js';
export { applyMagneticPulse, previewMagneticPulse } from './nature/attraction.js';
export { applyPowerDrop, previewPowerDrop } from './nature/rebound.js';
export { applyEarthquake, applyLightning, isEnvironmentTurnScheduled, previewEarthquake, previewFault, previewJumble, previewLightning } from './nature/environment.js';
export type { EarthquakeKind, EarthquakeOptions, EnvironmentEvent, EnvironmentPreview, EnvironmentSchedule, EnvironmentTransition, FaultPreview, JumblePreview, LightningOptions, LightningPreview } from './nature/environment.js';
