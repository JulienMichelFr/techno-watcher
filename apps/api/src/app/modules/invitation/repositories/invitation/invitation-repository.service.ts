import { InvitationModel } from '../../models/invitation/invitation.model';

export abstract class InvitationRepositoryService {
  public abstract findByCode(code: string): Promise<InvitationModel>;
}
