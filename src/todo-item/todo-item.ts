import { WebUIElement, attr } from '@microsoft/webui-framework';

export class TodoItem extends WebUIElement {
  @attr id = '';
  @attr title = '';
  @attr state = 'pending';

  onToggle(): void {
    this.$emit('toggle-item', { id: this.id });
  }

  onDelete(): void {
    this.$emit('delete-item', { id: this.id });
  }
}

TodoItem.define('todo-item');
