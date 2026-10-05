/** Shared presentation preferences; simulation remains authoritative. */
const key = 'houseki-animations';
const motion = matchMedia('(prefers-reduced-motion: reduce)');
let enabled = true;
try { enabled = localStorage.getItem(key) !== 'off'; } catch { /* Optional storage. */ }
document.documentElement.dataset.animations=enabled?'on':'off';
function cancelEffects() { document.querySelectorAll('.game-screen').forEach(screen => screen.getAnimations({subtree:true}).forEach(effect => effect.cancel())); }
motion.addEventListener('change',()=>{if(motion.matches)cancelEffects();});
export function animationEnabled() { return enabled; }
export function setAnimations(value) {
 enabled = Boolean(value);
 document.documentElement.dataset.animations=enabled?'on':'off';
 try { localStorage.setItem(key, enabled ? 'on' : 'off'); } catch { /* Optional storage. */ }
 cancelEffects();
}
export function positions(container) {
 return new Map([...container.querySelectorAll('.gem[data-id]:not(.ghost)')].map(gem => [gem.dataset.id, { rect:gem.getBoundingClientRect(), active:gem.classList.contains('active') }]));
}
export function settle(container, previous) {
 if (!enabled || motion.matches || document.documentElement.dataset.motion === 'reduced') return;
 for (const gem of container.querySelectorAll('.gem[data-id]:not(.ghost)')) {
  const before = previous.get(gem.dataset.id);
  if (!before) continue;
  const rect = gem.getBoundingClientRect();
  const dx = before.rect.x - rect.x, dy = before.rect.y - rect.y;
  const landing = before.active && !gem.classList.contains('active');
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && !landing) continue;
  const fall = dy < -1 || landing;
  const bounce = Math.min(2,rect.height * .04);
  gem.animate([
   { transform:`translate(${dx}px,${dy}px)`, offset:0, easing:fall?'cubic-bezier(.45,0,.9,.6)':'ease-out' },
   { transform:'translate(0,0) scale(1, .97)', offset:.76, easing:'ease-out' },
   { transform:`translate(0,${fall?-bounce:0}px)`, offset:.88, easing:'ease-in' },
   { transform:'translate(0,0)', offset:1 }
  ], {duration:fall?Math.min(200,100+Math.abs(dy)*.3):70});
 }
}
