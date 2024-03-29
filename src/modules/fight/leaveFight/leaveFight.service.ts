import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import mongoose from 'mongoose';
import { ILeaveFightDto } from './leaveFight.types';
import { EAction } from '../../../enums';
import { UserNotInFight } from '../../../errors';
import ActionsRooster from '../../action/action.rooster';
import StateService from '../../state/state.service';
import FightRooster from '../fight.rooster';

@Injectable()
export default class LeaveFightService {
  constructor(
    private readonly service: StateService,
    private readonly rooster: FightRooster,
    private readonly actions: ActionsRooster,
  ) {
    //
  }

  async leaveFight(@Payload() payload: ILeaveFightDto): Promise<void> {
    const dbFight = await this.rooster.getActiveByUser(payload.user);
    if (!this.service.get(payload.user) && !dbFight) throw new UserNotInFight();

    if (this.service.get(payload.user)) this.service.leaveFight(payload);
    if (dbFight) await this.rooster.update(dbFight._id.toString(), { active: false });
    if (dbFight)
      await this.actions.add({
        character: new mongoose.Types.ObjectId(payload.user),
        action: EAction.Leave,
        target: new mongoose.Types.ObjectId(payload.user),
        value: 0,
      });
  }
}
