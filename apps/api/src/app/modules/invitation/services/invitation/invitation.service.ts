import { Injectable } from '@nestjs/common';
import { InvitationRepositoryService } from '../../repositories/invitation/invitation-repository.service';
import { InvitationModel } from '../../models/invitation/invitation.model';

@Injectable()
export class InvitationService {
  public constructor(private readonly invitationRepository: InvitationRepositoryService) {}

  public async findByCode(code: string): Promise<InvitationModel> {
    return this.invitationRepository.findByCode(code);
  }
}
