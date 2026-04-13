import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Test' })
export class TestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  url: string;
}
