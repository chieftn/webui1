import { WebUIElement, attr, observable } from '@microsoft/webui-framework';

export class TodoApp extends WebUIElement {
  // Reflected attribute – kept in sync with the DOM attribute
  @attr title = '';

  // Observable array – changes trigger a re-render of the <for> loop
  @observable items: Array<{ id: string; title: string; state: string }> = [];

  // Remaining count – kept in sync by event handlers
  @observable remainingCount = 0;

  private updateRemaining(): void {
    this.remainingCount = (this.items ?? []).filter(i => i.state !== 'done').length;
  }

  private get inputEl(): HTMLElement | null {
    return this.shadowRoot?.querySelector('fluent-text-input') ?? null;
  }

  private nextId = 100;

  onAddKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      this.addTodo();
    }
  }

  onAddClick(): void {
    this.addTodo();
  }

  private addTodo(): void {
    const input = this.inputEl as any;
    if (!input) return;

    const text = (input.value || input.currentValue || '').trim();
    if (!text) return;

    this.items = [
      ...this.items,
      { id: String(this.nextId++), title: text, state: 'pending' },
    ];
    input.value = '';
    input.focus();
  }

  onToggleItem(e: CustomEvent<{ id: string }>): void {
    const item = (this.items ?? []).find(i => i.id === e.detail.id);
    if (item) {
      item.state = item.state === 'done' ? 'pending' : 'done';
      this.items = [...this.items]; // Reassign to trigger reactive update
    }
  }

  onDeleteItem(e: CustomEvent<{ id: string }>): void {
    this.items = (this.items ?? []).filter(item => item.id !== e.detail.id);
  }
}

TodoApp.define('todo-app');
