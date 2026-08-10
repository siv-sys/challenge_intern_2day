import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToTasks1785918273602 implements MigrationInterface {
    name = 'AddIsActiveToTasks1785918273602'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`is_active\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`CREATE INDEX \`IDX_edb86616dfba2a5ff503ae3c3f\` ON \`tasks\` (\`is_active\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_edb86616dfba2a5ff503ae3c3f\` ON \`tasks\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`is_active\``);
    }

}
