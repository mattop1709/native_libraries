import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Message } from 'src/app/interface/message';

@Injectable({
  providedIn: 'root',
})
export class InboxService {
  constructor(private storage: Storage) {}

  generateKey(): string {
    let key = `message${parseInt(`${Math.random() * 100}`)}`;
    return key;
  }

  async createMessage(message: Message): Promise<void> {
    let key = this.generateKey();
    return await this.storage.set(key, { id: key, ...message });
  }

  async readMessages(): Promise<Message[]> {
    let messages: Message[] = [];
    await this.storage.forEach((message, key, i) => {
      if (key.startsWith('message')) {
        messages.push(message);
      }
    });
    return messages;
  }

  async removeMessage(key: string): Promise<void> {
    return await this.storage.remove(key);
  }
}
