// Fluent UI setup
import '@fluentui/web-components/button.js';
import '@fluentui/web-components/text-input.js';
import '@fluentui/web-components/checkbox.js';
import { setTheme } from '@fluentui/web-components';
import { webLightTheme } from '@fluentui/tokens';

setTheme(webLightTheme);

// WebUI component hydration
import './todo-app/todo-app.js';
import './todo-item/todo-item.js';

window.addEventListener('webui:hydration-complete', () => {
  const total = performance.getEntriesByName('webui:hydrate:total', 'measure')[0];
  console.log(`Hydration complete in ${total?.duration.toFixed(1)}ms`);
});
