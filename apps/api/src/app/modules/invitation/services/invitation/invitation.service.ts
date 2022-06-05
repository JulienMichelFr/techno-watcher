import { Injectable } from '@nestjs/common';

import { InvitationModel } from '../../models/invitation/invitation.model';
import { InvitationRepositoryService } from '../../repositories/invitation/invitation-repository.service';

@Injectable()
export class InvitationService {
  public constructor(private readonly invitationRepository: InvitationRepositoryService) {}

  public async findByCode(code: string): Promise<InvitationModel> {
    return this.invitationRepository.findByCode(code);
  }
}
