import { Module } from '@nestjs/common';
import { TestsModule } from 'apps/hello_world/src/tests/tests.module';
import { TestModule } from 'apps/hello_world/src/test/test.module';
import { TestController } from 'apps/hello_world/src/test/test.controller';
import { AppService } from 'apps/hello_world/src/app.service';
import { AppController } from 'apps/hello_world/test/src/app.controller';

@Module({
  imports: [TestModule, TestsModule],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
