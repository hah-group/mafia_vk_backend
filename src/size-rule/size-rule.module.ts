import { Module } from '@nestjs/common';
import { SizeRuleService } from './size-rule.service';

@Module({
  providers: [SizeRuleService],
  exports: [SizeRuleService],
})
export class SizeRuleModule {}
