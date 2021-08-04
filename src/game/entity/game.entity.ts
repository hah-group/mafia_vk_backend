import { Game, Role, Stage } from '@prisma/client';
import { PlayerEntity } from '../../player/player.entity';
import { GameJobRequest } from '../job/game.job-request';
import { BaseEntity } from '../../base.entity';
import { Logger } from '@nestjs/common';
import { PlayerManager } from '../../player/player.manager';
import { TempTransportGateway } from '../../temp-transport.gateway';
import { Times } from '../job/times';

export interface GameConstructorData extends Game {
  players: PlayerEntity[];
}

export interface CircleResult {
  type: 'KILL' | 'VOTING' | 'SAW';
  players: number[];
}

export class GameEntity implements BaseEntity<Game> {
  public readonly id: number;
  public playerManager: PlayerManager;
  private readonly logger;
  private stage: Stage | null;
  private dayNumber: number;
  private dayPlayerOffset: number;
  private justificationIndex: number;
  private jobId: string | null;
  private circleResult: CircleResult | null;
  private sawVotes: Set<number>;
  private lastSpeechIndex: number;
  private roles: Role[];
  private roleIndex: number;

  constructor(
    data: GameConstructorData,
    private readonly queueManager: GameJobRequest,
    private readonly gateway: TempTransportGateway,
  ) {
    const {
      id,
      players,
      stage,
      dayNumber,
      dayPlayerOffset,
      justificationIndex,
      jobId,
      circleResult,
      sawVotes,
      lastSpeechIndex,
      roles,
      roleIndex,
    } = data;

    this.logger = new Logger(`Game:${id}`);

    this.id = id;
    this.stage = stage;
    this.dayNumber = dayNumber; // Номер игрового дня
    this.dayPlayerOffset = dayPlayerOffset; // Индекс сдвига игроков в течении дня
    this.playerManager = new PlayerManager(players);
    this.justificationIndex = justificationIndex;
    this.jobId = jobId;
    this.circleResult = circleResult as any;
    this.sawVotes = new Set<number>(sawVotes);
    this.lastSpeechIndex = lastSpeechIndex;
    this.roles = roles;
    this.roleIndex = roleIndex;
  }

  //===========================Boolean statements===========================
  private get isExitsResult(): boolean {
    return this.circleResult !== null;
  }

  private get isNewGame(): boolean {
    return this.stage === null;
  }

  private get isStartDiscussionStage(): boolean {
    return this.stage === Stage.NIGHT;
  }

  private get isDiscussionStage(): boolean {
    return this.stage === Stage.DISCUSSION;
  }

  private get isExistDiscussionSpokenPlayers(): boolean {
    return this.dayPlayerOffset < this.playerManager.size;
  }

  private get isExistVotingPlayers(): boolean {
    return (
      (this.dayNumber === 0 && this.playerManager.votingPlayersCount > 1) ||
      (this.dayNumber > 0 && this.playerManager.votingPlayersCount > 0)
    );
  }

  private get isSingleVotingPlayer(): boolean {
    return this.playerManager.votingPlayersCount === 1;
  }

  private get isStartJustificationStage(): boolean {
    return (
      (this.stage === Stage.DISCUSSION && this.isExistVotingPlayers && !this.isSingleVotingPlayer) ||
      (this.stage === Stage.VOTING_1 && !this.isExitsResult)
    );
  }

  private get isFirstJustificationStage(): boolean {
    return this.stage === Stage.JUSTIFICATION_1;
  }

  private get isSecondJustificationStage(): boolean {
    return this.stage === Stage.JUSTIFICATION_2;
  }

  private get isJustificationStage(): boolean {
    return this.isFirstJustificationStage || this.isSecondJustificationStage;
  }

  private get isExistJustificationSpokenPlayers(): boolean {
    return this.justificationIndex < this.playerManager.votingPlayersCount;
  }

  private get isStartVotingStage(): boolean {
    return (
      this.isExistVotingPlayers &&
      ((this.isDiscussionStage && this.isSingleVotingPlayer) || this.isJustificationStage)
    );
  }

  private get isFirstVotingStage(): boolean {
    return this.stage === Stage.VOTING_1;
  }

  private get isSecondVotingStage(): boolean {
    return this.stage === Stage.VOTING_2;
  }

  private get isVotingStage(): boolean {
    return this.isFirstVotingStage || this.isSecondVotingStage;
  }

  private get isAllPlayersVoted(): boolean {
    return this.playerManager.votedPlayers.length === this.playerManager.activePlayers.length;
  }

  private get isStartSawStage(): boolean {
    return this.isSecondVotingStage && !this.isExitsResult;
  }

  private get isSawStage(): boolean {
    return this.stage === Stage.SAW;
  }

  private get isStartDayEndStage(): boolean {
    return (
      (this.isVotingStage && this.isExitsResult) ||
      (this.isDiscussionStage && !this.isExistVotingPlayers) ||
      this.isSawStage
    );
  }

  private get isDayEndStage(): boolean {
    return this.stage === Stage.DAY_END;
  }

  private get isStartLastSpeechStage(): boolean {
    return this.isDayEndStage && this.isExitsResult;
  }

  private get isExistLastSpokenPlayers(): boolean {
    return this.lastSpeechIndex < this.circleResult.players.length;
  }

  private get isLastSpeechStage(): boolean {
    return this.stage === Stage.LAST_SPEECH;
  }

  private get isStartNightStage(): boolean {
    return (
      (this.isLastSpeechStage && !this.isExistLastSpokenPlayers) ||
      (this.isDayEndStage && !this.isExitsResult)
    );
  }

  private get isNightStage(): boolean {
    return this.stage === Stage.NIGHT;
  }

  private get isStartNightEndStage(): boolean {
    return this.isNightStage;
  }

  //===========================Tick processor===========================
  public async tick(): Promise<void> {
    if (this.isNewGame) return await this.tickStartDiscussionStage();
    if (this.isStartDiscussionStage) return await this.tickStartDiscussionStage();
    if (this.isStartJustificationStage) return await this.tickStartJustificationStage();
    if (this.isStartVotingStage) return await this.tickStartVotingStage();
    if (this.isStartSawStage) return await this.tickStartSawStage();
    if (this.isStartDayEndStage) return await this.tickStartDayEndStage();
    if (this.isStartLastSpeechStage) return await this.tickStartLastSpeechStage();
    if (this.isStartNightStage) return await this.tickStartNightStage();
    if (this.isStartNightEndStage) return;
  }

  /**
   * [1.2] Выставление игрока на голосование
   * --
   */
  public onPutToVote(fromPlayerId: number, toPlayerId: number): void {
    if (!this.isDiscussionStage) return;
    if (fromPlayerId === toPlayerId) return;
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.userId !== fromPlayerId) return;
    if (!currentPlayer.isActive) return;
    const toPlayer = this.playerManager.getById(toPlayerId);
    if (!toPlayer) return;
    if (!toPlayer.isActive) return;
    this.logger.log(`Put player:${toPlayerId} to voting by a player:${fromPlayerId}`);
    toPlayer.putToVoting(this.playerManager.votingPlayersCount);
  }

  /**
   * [1.3] Событие завершение речи игрока
   * --
   * @param playerId number
   * @param timeout
   */
  public async onEndPlayerSpeech(playerId: number, timeout = false): Promise<void> {
    if (!this.isDiscussionStage) return;
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.userId !== playerId) return;
    this.logger.log(`End speech player:${playerId} (due timeout: ${timeout})`);
    if (!timeout) await this.queueManager.removeJob(currentPlayer.jobId);
    currentPlayer.jobId = null;

    await this.tickDiscussion();
  }

  /**
   * [2.1.2] Событие заверешения оправдания игрока
   * --
   * @param playerId
   * @param timeout
   */
  public async onEndPlayerJustification(playerId: number, timeout = false): Promise<void> {
    if (!this.isJustificationStage) return;
    const currentPlayer = this.getCurrentJustificationPlayer();
    if (currentPlayer.userId !== playerId) return;
    this.logger.log(`End justification player:${playerId} (due timeout: ${timeout})`);
    if (!timeout) await this.queueManager.removeJob(currentPlayer.jobId);
    currentPlayer.jobId = null;

    await this.tickJustification();
  }

  /**
   * [2.2.2] Событие голосвания за игрока
   * --
   * @param fromPlayerId
   * @param toPlayerId
   */
  public async onVote(fromPlayerId: number, toPlayerId: number): Promise<void> {
    if (!this.isVotingStage) return;
    if (fromPlayerId === toPlayerId) return;
    const fromPlayer = this.playerManager.getById(fromPlayerId);
    if (!fromPlayer) return;
    if (!fromPlayer.isActive) return;
    if (fromPlayer.isVoted) return;
    const toPlayer = this.playerManager.getById(toPlayerId);
    if (!toPlayer) return;
    if (!toPlayer.isActive) return;
    if (!toPlayer.onTheVote) return;
    this.logger.log(`Vote to player:${toPlayerId} by a player:${fromPlayerId}`);
    toPlayer.vote(fromPlayer);
    await this.onEndVoting(false);
  }

  /**
   * [2.2.3] Событие завершения голосования
   * --
   * @param timeout
   */
  public async onEndVoting(timeout = false): Promise<void> {
    if (!timeout && !this.isAllPlayersVoted) return;
    this.logger.log('Voting end');

    if (!timeout) await this.queueManager.removeJob(this.jobId);
    this.jobId = null;

    const players = this.playerManager.getVotingResult();
    let maxKey = players.keys().next().value;
    for (const key of players.keys()) if (key >= maxKey) maxKey = key;

    const kickedPlayers = players.get(maxKey);
    if (kickedPlayers && kickedPlayers.length < 2) {
      kickedPlayers[0].kill();
      this.circleResult = {
        type: 'VOTING',
        players: [kickedPlayers[0].userId],
      };
    }

    this.playerManager.unVoteExcept(kickedPlayers);
    await this.tick();
  }

  /**
   * [2.3.2] Событие голосования за попил стола
   * --
   * @param fromPlayerId
   */
  public async onSawVote(fromPlayerId: number): Promise<void> {
    if (!this.isSawStage) return;
    if (this.sawVotes.has(fromPlayerId)) return;
    this.logger.log(`Vote to saw table by a player:${fromPlayerId}`);
    this.sawVotes.add(fromPlayerId);
  }

  /**
   * [2.3.4] Событие завершения голосования за попил стола
   * --
   */
  public async onEndSaw(): Promise<void> {
    if (!this.isSawStage) return;
    this.logger.log(`Saw end`);
    this.jobId = null;
    let absoluteMajority = Math.ceil(parseInt((this.playerManager.size / 2).toFixed(2)));
    if (this.playerManager.size % 2 === 0) absoluteMajority += 1;

    if (this.sawVotes.size >= absoluteMajority) {
      const kickedPlayers = this.playerManager.votingPlayers(false);
      kickedPlayers.forEach((player) => {
        player.kill();
      });
      this.circleResult = {
        type: 'SAW',
        players: kickedPlayers.map((player) => player.userId),
      };
    }

    await this.tick();
  }

  public async onDayEndTimeout(): Promise<void> {
    if (!this.isDayEndStage) return;
    this.logger.log(`Day end timeout`);
    this.jobId = null;
    await this.tick();
  }

  /**
   * [3.3] Событие завершения последней речи игрока
   * --
   * @param playerId
   * @param timeout
   */
  public async onEndPlayerLastSpeech(playerId: number, timeout = false) {
    if (!this.isLastSpeechStage) return;
    const currentPlayer = this.getCurrentLastSpeechPlayer();
    if (currentPlayer.userId !== playerId) return;
    this.logger.log(`End last speech player:${playerId} (due timeout: ${timeout})`);
    if (!timeout) await this.queueManager.removeJob(currentPlayer.jobId);
    currentPlayer.jobId = null;

    await this.tickLastSpeech();
  }

  /**
   * [4.2] Событие действия роли
   */
  public async onRoleAction(fromPlayerId: number, toPlayerId: number): Promise<void> {
    if (!this.isNightStage) return;
    const fromPlayer = this.playerManager.getById(fromPlayerId);
    const currentRole = this.getCurrentRole();
    if (!fromPlayer.role || fromPlayer.role.id !== currentRole) return;
    const toPlayer = this.playerManager.getById(toPlayerId);
    if (!toPlayer) return;
    if (!toPlayer.isActive) return;
    this.logger.log(
      `Role:${currentRole.toLowerCase()} action from player:${fromPlayerId} to player:${toPlayerId}`,
    );
    fromPlayer.role.onAction(toPlayer, this.circleResult);
    await this.endRolePlay(currentRole, false);
  }

  /**
   * [4.3] Событие завершения хода роли
   */
  public async endRolePlay(role: Role, timeout = false) {
    if (!this.isNightStage) return;
    const currentRole = this.getCurrentRole();
    if (currentRole !== role) return;

    if (!timeout) await this.queueManager.removeJob(this.jobId);
    this.jobId = null;

    this.logger.log(`End role:${currentRole.toLowerCase()} action (due timeout: ${timeout})`);
    await this.tickNight();
  }

  public data(): Game {
    return {
      id: this.id,
      stage: this.stage,
      dayNumber: this.dayNumber,
      dayPlayerOffset: this.dayPlayerOffset,
      justificationIndex: this.justificationIndex,
      jobId: this.jobId,
      circleResult: <any>this.circleResult,
      sawVotes: Array.from(this.sawVotes.values()),
      lastSpeechIndex: this.lastSpeechIndex,
      roles: this.roles,
      roleIndex: this.roleIndex,
    };
  }

  //===========================Tick subprocess===========================
  private async tickStartDiscussionStage(): Promise<void> {
    this.logger.log('Start discussion stage');
    this.stage = Stage.DISCUSSION;
    this.dayPlayerOffset = -1;
    await this.tickDiscussion();
  }

  private async tickDiscussion(): Promise<void> {
    this.dayPlayerOffset += 1;
    if (!this.isExistDiscussionSpokenPlayers) return await this.tick();

    this.logger.log('Discussion tick');
    const player = this.getCurrentPlayer();
    if (player) await this.startPlayerDiscussion(player);
    else await this.tickDiscussion();
  }

  private async tickStartJustificationStage(): Promise<void> {
    this.logger.log('Start justification stage');
    if (this.isDiscussionStage) this.stage = Stage.JUSTIFICATION_1;
    else if (this.isFirstVotingStage) this.stage = Stage.JUSTIFICATION_2;
    this.justificationIndex = -1;
    await this.tickJustification();
  }

  private async tickJustification(): Promise<void> {
    this.justificationIndex += 1;
    if (!this.isExistJustificationSpokenPlayers) return await this.tick();

    this.logger.log(`Justification ${this.stage === Stage.JUSTIFICATION_1 ? '1' : '2'} tick`);
    const player = this.getCurrentJustificationPlayer();
    await this.startPlayerJustification(player);
  }

  private async tickStartVotingStage(): Promise<void> {
    this.logger.log('Start voting stage');
    this.playerManager.resetVotingState();
    if (this.isFirstJustificationStage || this.isDiscussionStage) this.stage = Stage.VOTING_1;
    else if (this.isSecondJustificationStage) this.stage = Stage.VOTING_2;

    if (this.isSingleVotingPlayer) return await this.singlePlayerVote();
    await this.startVoting();
  }

  private async tickStartSawStage(): Promise<void> {
    this.logger.log('Start saw stage');
    this.sawVotes = new Set<number>();
    this.stage = Stage.SAW;
    await this.startSaw();
  }

  private async tickStartDayEndStage(): Promise<void> {
    this.logger.log('Start day end stage');
    this.stage = Stage.DAY_END;
    this.dayNumber += 1;
    await this.startDayEnd();
  }

  private async tickStartLastSpeechStage(): Promise<void> {
    this.logger.log('Start last speech stage');
    this.lastSpeechIndex = -1;
    this.stage = Stage.LAST_SPEECH;
    await this.tickLastSpeech();
  }

  private async tickLastSpeech(): Promise<void> {
    this.lastSpeechIndex += 1;
    if (!this.isExistLastSpokenPlayers) return await this.tick();

    this.logger.log('Last speech tick');
    const player = this.getCurrentLastSpeechPlayer();
    if (player) await this.startPlayerLastSpeech(player);
  }

  private async tickStartNightStage(): Promise<void> {
    this.logger.log('Start night stage');
    this.stage = Stage.NIGHT;
    this.playerManager.resetVotingState();
    this.circleResult = null;
    this.roleIndex = -1;
    await this.tickNight();
  }

  private async tickNight(): Promise<void> {
    this.logger.log('Night tick');
    if (!this.isNightStage) return;
    this.roleIndex += 1;
    const role = this.getCurrentRole();
    if (role) await this.startRolePlay(role);
    else await this.tick();
  }

  private async tickStartNightEndStage(): Promise<void> {
    this.logger.log('Start night end stage');
    this.stage = Stage.NIGHT_END;
  }

  /**
   * [1.1] Событие начала обсуждения игрока
   * --
   * @param player PlayerEntity
   * @private
   */
  private async startPlayerDiscussion(player: PlayerEntity): Promise<void> {
    this.logger.log(`Start speech player:${player.userId}`);
    this.gateway.server.emit('data', {
      event: 'Discussion',
      time: Times.SPEECH_TIMEOUT,
      payload: `Player ${player.userId}`,
    });
    player.jobId = await this.queueManager.playerSpeechTimeout({
      userId: player.userId,
      gameId: this.id,
    });
  }

  /**
   * [2.1.1] Событие начала оправдания игрока
   * --
   * @param player
   * @private
   */
  private async startPlayerJustification(player: PlayerEntity): Promise<void> {
    this.logger.log(`Start justification speech player:${player.userId}`);
    this.gateway.server.emit('data', {
      event: `Justification ${this.isFirstJustificationStage ? '1' : '2'}`,
      time: Times.JUSTIFICATION_SPEECH_TIMEOUT,
      payload: `Player ${player.userId}`,
    });
    player.jobId = await this.queueManager.playerJustificationTimeout({
      userId: player.userId,
      gameId: this.id,
    });
  }

  /**
   * [2.2.1] Запуск голосования
   * --
   */
  private async startVoting(): Promise<void> {
    this.gateway.server.emit('data', {
      event: 'Voting',
      time: Times.VOTING_TIMEOUT,
      payload: '',
    });
    this.jobId = await this.queueManager.votingTimeout({
      gameId: this.id,
    });
  }

  private async singlePlayerVote(): Promise<void> {
    this.logger.log('Single player voting');
    const [player] = this.playerManager.votingPlayers(false);
    player.kill();
    this.circleResult = {
      type: 'VOTING',
      players: [player.userId],
    };
    await this.tick();
  }

  /**
   * [2.3.1] Запуск голосования за попил стола
   * --
   * @private
   */
  private async startSaw(): Promise<void> {
    this.gateway.server.emit('data', {
      event: 'Saw',
      payload: '',
      time: Times.SAW_TIMEOUT,
    });
    this.jobId = await this.queueManager.sawTimeout({
      gameId: this.id,
    });
  }

  /**
   * [3.1] Завершение дня
   * --
   */
  private async startDayEnd(): Promise<void> {
    this.logger.log(`Day end`);
    let payload = 'Not result';

    if (this.isExitsResult) {
      this.logger.log(
        `Result: ${this.circleResult.type.toLowerCase()} | kicked out players: ${
          this.circleResult.players.length
        }`,
      );

      payload = `Result: ${this.circleResult.type.toLowerCase()} | kicked out players: ${
        this.circleResult.players.length
      }`;
    }

    this.gateway.server.emit('data', {
      event: 'Day end',
      payload: payload,
      time: Times.DAY_END_TIMEOUT,
    });

    this.jobId = await this.queueManager.dayEndTimeout({
      gameId: this.id,
    });
  }

  /**
   * [3.2] Событие начала последней речи игрока
   * --
   * @param player
   * @private
   */
  private async startPlayerLastSpeech(player: PlayerEntity): Promise<void> {
    this.logger.log(`Start last speech player:${player.userId}`);
    this.gateway.server.emit('data', {
      event: 'Last speech',
      payload: `Player ${player.userId}`,
      time: Times.SPEECH_TIMEOUT,
    });
    player.jobId = await this.queueManager.lastSpeechTimeout({
      userId: player.userId,
      gameId: this.id,
    });
  }

  /**
   * [4.1] Начало игры роли
   * --
   */
  private async startRolePlay(role: Role): Promise<void> {
    this.gateway.server.emit('data', {
      event: 'Role play',
      time: Times.ROLE_PLAY_TIMEOUT,
      payload: `${role}`,
    });
    this.jobId = await this.queueManager.rolePlay({
      gameId: this.id,
      role: role,
    });
  }

  private async startNightEnd(): Promise<void> {
    this.gateway.server.emit('data', {
      event: 'Night end',
      time: Times.ROLE_PLAY_TIMEOUT,
      payload: ``,
    });
    this.jobId = await this.queueManager.rolePlay({
      gameId: this.id,
      role: role,
    });
  }

  /**
   * Получение игрока по индексам
   * --
   * @private
   */
  private getCurrentPlayer(): PlayerEntity | undefined {
    const index = this.dayNumber + this.dayPlayerOffset;
    const player = this.playerManager.getByIndex(index);
    if (player && player.isActive) return player;
  }

  /**
   * Получение оправдывающегося игрока по индексу
   * --
   * @private
   */
  private getCurrentJustificationPlayer(): PlayerEntity | undefined {
    return this.playerManager.getJustificationByIndex(this.justificationIndex);
  }

  /**
   * Получение выбывших игроков за полукруг по индексу
   * --
   * @private
   */
  private getCurrentLastSpeechPlayer(): PlayerEntity | undefined {
    if (!this.isExitsResult) return undefined;
    const playerId = this.circleResult.players[this.lastSpeechIndex];
    return this.playerManager.getById(playerId);
  }

  /**
   * Получение текущей играющей роли
   * --
   * @private
   */
  private getCurrentRole(): Role | undefined {
    return this.roles[this.roleIndex];
  }
}
