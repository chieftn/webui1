import { WebUIElement, attr } from '@microsoft/webui-framework';

export class InfoCard extends WebUIElement {
  @attr title = '';
  @attr body = '';
}

InfoCard.define('info-card');
