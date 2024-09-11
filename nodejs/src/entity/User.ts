import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import 'reflect-metadata';

@Entity('user', { schema: 'public' })
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    firstName: string

    @Column({ nullable: true })
    lastName: string

    @Column()
    mobileNo: string

}
