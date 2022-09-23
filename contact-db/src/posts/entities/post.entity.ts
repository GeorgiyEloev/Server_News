import { BaseDateColumn } from '../../constants';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'posts' })
export class Posts extends BaseDateColumn {
  @Column({
    type: 'varchar',
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  url: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  category: string | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  previewImg: string | null;

  @Column({
    type: 'timestamp with time zone',
    nullable: false,
  })
  date: Date;
}
