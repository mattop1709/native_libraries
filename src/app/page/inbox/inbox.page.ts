import { Component, OnInit } from '@angular/core';
import { Message } from 'src/app/interface/message';
import { InboxService } from 'src/app/service/inbox.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {
  messages: Message[] = [];
  constructor(private inboxService: InboxService) {}

  async ngOnInit() {
    this.messages = await this.inboxService.readMessages();
  }

  onDelete(key: string): void {
    this.inboxService.removeMessage(key);
    this.ngOnInit();
  }
}
