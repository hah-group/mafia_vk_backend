import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [ConfigModule.forRoot()],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should pass signature verification', () => {
    expect(
      service.validateSign(
        'vk_access_token_settings=&vk_app_id=7477902&vk_are_notifications_enabled=0&vk_is_app_user=0&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1621375582&vk_user_id=152879324',
        'bsW9oT606gRZMgNJgY-kzHYiEEmoNnAsTNbqYyu5rxk',
      ),
    ).toBeTruthy();
  });

  it('should fail the test', () => {
    expect(
      service.validateSign(
        'vk_access_token_settings=&vk_app_id=7477900&vk_are_notifications_enabled=0&vk_is_app_user=0&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1621375582&vk_user_id=152879324&',
        'bsW9oT606gRZMgNJgY-kzHYiEEmoNnAsTNbqYyu5rxk',
      ),
    ).toBeFalsy();
  });
});
