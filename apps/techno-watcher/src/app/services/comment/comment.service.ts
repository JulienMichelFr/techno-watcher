import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CommentModel } from '@techno-watcher/api-models';

import { ApiServiceBase } from '../../bases/api-service.base';

@Injectable({
  providedIn: 'root',
})
export class CommentService extends ApiServiceBase<CommentModel> {
  protected readonly baseUrl: string = `${this.apiUrl}/comments`;

  public deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${commentId}`);
  }
}
